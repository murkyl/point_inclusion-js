//    3B-point_inclusion 1.0.0
//    Copyright (c) 2011 Andrew Chung, 3Bengals Inc.
//    Last modified: 2011-07-09
//    
//    3B-point_inclusion is freely distributable under the MIT license. (http://www.opensource.org/licenses/mit-license.php)
//
//    Portions are inspired or borrowed from:
//    Wm. Randolph Franklin (http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html)
//
//
//
//    Full MIT License:
//    Permission is hereby granted, free of charge, to any person obtaining a
//    copy of this software and associated documentation files
//    (the "Software"), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//    The above copyright notice and this permission notice shall be included
//    in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//
//
//    The check_poly function is implemented according to: (http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html)
//    The license for its use is included below.
//
//    Copyright (c) 1970-2003, Wm. Randolph Franklin
//
//    Permission is hereby granted, free of charge, to any person obtaining a
//    copy of this software and associated documentation files
//    (the "Software"), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//       1. Redistributions of source code must retain the above copyright
//          notice, this list of conditions and the following disclaimers.
//       2. Redistributions in binary form must reproduce the above copyright
//          notice in the documentation and/or other materials provided with the
//          distribution.
//       3. The name of W. Randolph Franklin may not be used to endorse or
//          promote products derived from this Software without specific prior
//          written permission.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//
//
(function() {
  if (typeof(window.threeB) === 'undefined') {
    window.threeB = {};
  }
  window.threeB.point_inclusion = (function() {
    var _version = '1.0.0';
    return {
      version: function() { return _version; },
      check: function(x, y, area_obj) {
        switch(area_obj.shape) {
          case 'rect':
            return threeB.point_inclusion.check_rectangle(x, y, area_obj.coords);
          case 'circle':
            return threeB.point_inclusion.check_circle(x, y, area_obj.coords, area_obj.bbox);
          case 'poly':
            var vertx = [];
            var verty = [];
            if (typeof(area_obj.vertx) === 'undefined' || typeof(area_obj.vertx) === 'undefined') {
              for (var i = 0; i < area_obj.coords.length; i += 2) {
                vertx.push(area_obj.coords[i]);
                verty.push(area_obj.coords[i + 1]);
              }
            }
            else {
              vertx = area_obj.vertx;
              verty = area_obj.verty;
            }
            return threeB.point_inclusion.check_poly(x, y, vertx, verty, area_obj.bbox);
        }
        return false;
      },
      check_array: function(x, y, area_obj_array) {
        for (var i = 0; i < area_obj_array.length; i++) {
          var in_bounds = threeB.point_inclusion.check(x, y, area_obj_array[i]);
          if (in_bounds)
            return true;
        }
        return false;
      },
      check_rectangle: function(x, y, coords) {
        return (x >= coords[0] && x <= coords[2] && y >= coords[1] && y <= coords[3]);
      },
      check_circle: function(x, y, coords, bbox) {
        // If we have a bounding box parameter, check that first since it is a faster test than the check against the circle
        if (typeof(bbox) !== 'undefined' && !threeB.point_inclusion.check_rectangle(x, y, bbox))
          return false;
        var x_diff  = x - coords[0];
        var y_diff  = y - coords[1];
        return (x_diff*x_diff + y_diff*y_diff) <= (coords[2]*coords[2]);
      },
      check_poly: function(x, y, vertx, verty, bbox) {
        // If we have a bounding box parameter, check that first since it is a faster test than the check against the polygon
        if (typeof(bbox) !== 'undefined' && !threeB.point_inclusion.check_rectangle(x, y, bbox))
          return false;
        var i, j, in_bounds = false;
        for (i = 0, j = vertx.length - 1; i < vertx.length; j = i++)
          if (((verty[i] > y) != (verty[j] > y)) && (x < (vertx[j] - vertx[i])*(y - verty[i])/(verty[j] - verty[i]) + vertx[i]))
            in_bounds = !in_bounds;
        return in_bounds;
      }
    }
  }());
}());
