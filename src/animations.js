var two = new Two({
  type: Two.Types.canvas,
  fullscreen: true
}).appendTo(document.body);

/**
 * Collection of animations and such for Neuronal Synchrony.
 */

/**
 * Panoramic by Lusine
 */

/**
 * Things needed for the shoot:
 * + long usb 2.0 male - male a - b cable
 *   http://www.radioshack.com/product/index.jsp?productId=2103746
 * + Muslin fabric * Shipped
 * + Something to stretch the canvas on
 * + A table to put down the monome
 * + Camera & Tripod for camera
 * + Projector
 * + Extension cable 100ft
 * + Power Strip
 */

var TWO_PI = Math.PI * 2;

window.animations = (function() {

  var width = two.width, height = two.height;
  var center = { x: width / 2, y: height / 2 };
  var duration = 1000;
  var drag = 0.125;
  var monome = {};
  var pistonAmount = 3;
  var prismAmount = 3;
  var flashAmount = 3;

  var Easing = TWEEN.Easing;
  var PROPERTIES = ['background', 'middleground', 'foreground', 'highlight', 'accent', 'white', 'black'];
  var PALETTE = [
    {
      background: { r: 181, g: 181, b: 181 },
      middleground: { r: 141, g: 164, b: 170 },
      foreground: { r: 227, g: 79, b: 12 },
      highlight: { r: 163, g: 141, b: 116 },
      accent: { r: 255, g: 197, b: 215 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 0, g: 0, b: 0 }
    },
    {
      background: { r: 57, g: 109, b: 193 },
      middleground: { r: 186, g: 60, b: 223 },
      foreground: { r: 213, g: 255, b: 93 },
      highlight: { r: 213, g: 160, b: 255 },
      accent: { r: 36, g: 221, b: 165 },
      white: { r: 215, g: 236, b: 255 },
      black: { r: 0, g: 0, b: 0 }
    },
    {
      background: { r: 217, g: 82, b: 31 },
      middleground: { r: 143, g: 74, b: 45 },
      foreground: { r: 255, g: 108, b: 87 },
      highlight: { r: 255, g: 126, b: 138 },
      accent: { r: 227, g: 190, b: 141 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 0, g: 0, b: 0 }
    },
    {
      background: { r: 255, g: 244, b: 211 },
      middleground: { r: 207, g: 145, b: 79 },
      foreground: { r: 38, g: 83, b: 122 },
      highlight: { r: 178, g: 87, b: 53 },
      accent: { r: 235, g: 192, b: 92 },
      white: { r: 226, g: 82, b: 87 },
      black: { r: 0, g: 0, b: 0 }
    },
    {
      background: { r: 191, g: 178, b: 138 },
      middleground: { r: 115, g: 44, b: 3 },
      foreground: { r: 89, g: 81, b: 57 },
      highlight: { r: 217, g: 210, b: 176 },
      accent: { r: 242, g: 239, b: 220 },
      white: { r: 22, g: 33, b: 44 },
      black: { r: 255, g: 255, b: 255 }
    },
    {
      background: { r: 255, g: 255, b: 255 },
      middleground: { r: 151, g: 41, b: 164 },
      foreground: { r: 1, g: 120, b: 186 },
      highlight: { r: 255, g: 255, b: 0 },
      accent: { r: 255, g: 51, b: 148 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 255, g: 255, b: 255 }
    },
    {
      background: { r: 39, g: 6, b: 54 },
      middleground: { r: 69, g: 26, b: 87 },
      foreground: { r: 252, g: 25, b: 246 },
      highlight: { r: 52, g: 255, b: 253 },
      accent: { r: 133, g: 102, b: 193 },
      white: { r: 253, g: 228, b: 252 },
      black: { r: 255, g: 255, b: 255 }
    }
  ];
  var current = 0;
  var _colors = {};
  var colors = {};

  _.each(PALETTE[current], function(v, k) {
    _colors[k] = _.clone(v);
    colors[k] = toString(v);
  });

  colors.getRandom = function() {
    var array = _.toArray(colors);
    return array[Math.floor(Math.random() * array.length)];
  };

  document.body.style.background = colors.background;

  var wipe = (function() {

    var callback = _.identity;
    var playing = false;

    var direction = true;
    var points = [
      new Two.Vector(- center.x, -center.y),
      new Two.Vector(center.x, - center.y),
      new Two.Vector(center.x, center.y),
      new Two.Vector(- center.x, center.y)
    ];
    var shape = two.makePolygon(points);
    shape.fill = colors.middleground;
    shape.noStroke();

    var start = function(onComplete) {
      playing = true;
      shape.visible = true;
      animate_in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = colors.middleground;
    };
    var resize = function() {};

    var options = {
      i: 0,
      o: 0
    };

    var animate_in = new TWEEN.Tween(options)
      .to({ i: 1 }, duration * 0.5)
      .easing(Easing.Exponential.Out)
      .onUpdate(function(t) {
        if (direction) {
          points[0].x = t * width;
          points[1].x = t * width;
        } else {
          points[0].x = (1 - t) * width;
          points[1].x = (1 - t) * width;
        }
      })
      .onComplete(function() {
        animate_out.start();
      });

    var animate_out = new TWEEN.Tween(options)
      .to({ o: 1 }, duration * 0.5)
      .easing(Easing.Exponential.In)
      .onUpdate(function(t) {
        if (direction) {
          points[2].x = t * width;
          points[3].x = t * width;
        } else {
          points[2].x = (1 - t) * width;
          points[3].x = (1 - t) * width;
        }
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    reset();

    function reset() {
      shape.visible = false;
      playing = false;
      options.beginning = options.ending = 0;
      direction = Math.random() > 0.5;
      if (direction) {
        points[0].clear();
        points[1].set(0, height);
        points[2].set(0, height);
        points[3].clear();
      } else {
        points[0].set(width, 0);
        points[1].set(width, height);
        points[2].set(width, height);
        points[3].set(width, 0);
      }
    }

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '2,6'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var veil = (function() {

    var callback = _.identity;
    var playing = false;

    var direction = true;
    var points = [
      new Two.Vector(- center.x, - center.y),
      new Two.Vector(center.x, - center.y),
      new Two.Vector(center.x, center.y),
      new Two.Vector(- center.x, center.y)
    ];
    var shape = two.makePolygon(points);
    shape.fill = colors.highlight;
    shape.noStroke();

    var start = function(onComplete) {
      playing = true;
      shape.visible = true;
      animate_in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = colors.highlight;
    };
    var resize = function() {};

    var options = {
      i: 0,
      o: 0
    };

    var animate_in = new TWEEN.Tween(options)
      .to({ i: 1 }, duration * 0.5)
      .easing(Easing.Exponential.Out)
      .onUpdate(function(t) {
        if (direction) {
          points[0].y = t * height;
          points[1].y = t * height;
        } else {
          points[0].y = (1 - t) * height;
          points[1].y = (1 - t) * height;
        }
      })
      .onComplete(function() {
        animate_out.start();
      });

    var animate_out = new TWEEN.Tween(options)
      .to({ o: 1 }, duration * 0.5)
      .easing(Easing.Exponential.In)
      .onUpdate(function(t) {
        if (direction) {
          points[2].y = t * height;
          points[3].y = t * height;
        } else {
          points[2].y = (1 - t) * height;
          points[3].y = (1 - t) * height;
        }
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    reset();

    function reset() {
      shape.visible = false;
      playing = false;
      options.beginning = options.ending = 0;
      direction = Math.random() > 0.5;
      if (direction) {
        points[0].clear();
        points[1].set(width, 0);
        points[2].set(width, 0);
        points[3].clear();
      } else {
        points[0].set(0, height);
        points[1].set(width, height);
        points[2].set(width, height);
        points[3].set(0, height);
      }
    }

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '1,6'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  _.each(_.range(prismAmount), function(i) {

    var prism = (function() {

      var amount = Math.floor(i * 1.5) + 3, r1 = 100, r2 = 2, scalar = 10;
      var callback = _.identity;
      var playing = false;

      var circles = [];
      var points = _.map(_.range(amount), function(i) {
        var pct = i / amount;
        var theta = TWO_PI * pct;
        var x = r1 * Math.cos(theta);
        var y = r1 * Math.sin(theta);
        var circle = two.makeCircle(x, y, r2);
        circle.fill = colors.black;
        circle.noStroke();
        circles.push(circle);
        return new Two.Vector(x, y);
      });

      var prism = two.makePolygon(points);
      prism.stroke = colors.black;
      prism.noFill();
      prism.linewidth = 0.5;

      var group = two.makeGroup(prism).add(circles);
      group.translation.set(center.x, center.y);

      var options = { ending: 0 };

      var start = function(onComplete) {
        group.visible = true;
        _in.start();
        if (_.isFunction(onComplete)) {
          callback = onComplete;
        }
      };

      start.onComplete = reset;

      var update = function() {
        prism.stroke = colors.black;
        _.each(circles, function(c) {
          c.fill = colors.black;
        });
      };
      var resize = function() {
        group.translation.set(center.x, center.y);
      };

      var _in = new TWEEN.Tween(options)
        .to({ ending: 1 }, duration * 0.75)
        .easing(Easing.Circular.In)
        .onStart(function() {
          playing = true;
        })
        .onUpdate(function() {
          group.scale = options.ending * scalar;
        })
        .onComplete(function() {
          start.onComplete();
          callback();
        });

      function reset() {
        group.visible = false;
        // group.rotation = Math.random() * TWO_PI;
        options.ending = group.scale = 0;
        playing = false;
      }

      reset();

      var exports = {
        start: start,
        update: update,
        resize: resize,
        playing: function() { return playing; },
        hash: i + ',1'
      };

      monome[exports.hash] = exports;

      return exports;

    })();

  });

  /**
   * BACKGROUND
   */

  var clay = (function() {

    var callback = _.identity;
    var playing = false;

    var amount = Math.random() * 8 + 8, w = width * Math.random(), h = height * Math.random();
    var distance = height, rotation = Math.PI / 2;

    var destinations = [];
    var points = _.map(_.range(amount), function(i) {
      var pct = i / amount;
      var theta = TWO_PI * pct;
      var x = distance * Math.sin(theta);
      var y = distance * Math.cos(theta);
      destinations.push(new Two.Vector(x, y));
      return new Two.Vector(x, y);
    });

    var clay = two.makeCurve(points);
    clay.fill = colors.middleground;
    clay.noStroke();

    points = clay.vertices;

    var start = function(onComplete) {
      clay.visible = true;
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      clay.fill = colors.middleground;
    };
    var resize = function() {};

    var options = { ending: 0 };

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1 }, duration * 0.75)
      .easing(Easing.Circular.In)
      .onStart(function() {
        playing = true;
      })
      .onUpdate(function() {
        var t = options.ending;
        _.each(points, function(v, i) {
          var d = destinations[i];
          var x = lerp(v.x, d.x, t);
          var y = lerp(v.y, d.y, t);
          v.set(x, y);
        });
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {

      clay.visible = false;
      impact = new Two.Vector(Math.random() * width, Math.random() * height);
      var x, y, pos = Math.random() * 8;

      if (pos > 7) {
        // north
        x = center.x;
        y = 0;
      } else if (pos > 6) {
        // north-west
        x = 0;
        y = 0;
      } else if (pos > 5) {
        // west
        x = 0;
        y = center.y;
      } else if (pos > 4) {
        // south-west
        x = 0;
        y = height;
      } else if (pos > 3) {
        // south
        x = center.x;
        y = height;
      }  else if (pos > 2) {
        // south-east
        x = width;
        y = height;
      } else if (pos > 1) {
        // east
        x = width;
        y = center.y;
      } else {
        x = width;
        y = 0;
      }

      clay.translation.set(x, y);
      options.ending = 0;
      distance = height;

      _.each(points, function(v, i) {
        var pct = i / amount;
        var ptheta = pct * TWO_PI;
        v.set(distance * Math.cos(ptheta), distance * Math.sin(ptheta));
        var theta = angleBetween(v, impact) - ptheta;
        var d = v.distanceTo(impact);
        var a = 10 * distance / Math.sqrt(d);
        var x = a * Math.cos(theta) + v.x;
        var y = a * Math.sin(theta) + v.y;
        destinations[i].set(x, y);
      });
      playing = false;
    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '0,6'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  _.each(_.range(pistonAmount), function(i) {

    var pistons = (function() {

      var playing = false;
      var callback = _.identity;

      var amount = i * 4 + 1, w = width * 0.75, h = center.y;
      var begin, end;

      var group = two.makeGroup();
      group.translation.copy(center);

      var shapes = _.map(_.range(amount), function(i) {

        var d = h / amount - h / (amount * 3);
        var x = 0;
        var y = - h / 2 + (i + 1) * (h / (amount + 1));

        var shape = two.makeRectangle(x, y, w, d);

        shape.fill = colors.white;
        shape.noStroke();

        group.add(shape);

        return shape;

      });

      var options = { ending: 0, beginning: 0 };

      var start = function(onComplete) {
        _.each(shapes, function(shape) {
          shape.visible = true;
        });
        _in.start();
        if (_.isFunction(onComplete)) {
          callback = onComplete;
        }
      };

      start.onComplete = reset;

      var update = function() {
        _.each(shapes, function(s) {
          s.fill = colors.white;
        });
      }; // Mainly for color in the future
      var resize = function() {

        w = width * 0.75, h = center.y;

        group.translation.copy(center);

      };

      var _in = new TWEEN.Tween(options)
        .to({ ending: 1.0 }, duration * 0.125)
        .easing(Easing.Sinusoidal.Out)
        .onStart(function() {
          playing = true;
        })
        .onUpdate(function() {
          _.each(shapes, function(s) {
            var points = s.vertices;
            points[3].x = points[0].x = end * options.ending;
          });
        })
        .onComplete(function() {
          _out.start();
        });

      var _out = new TWEEN.Tween(options)
        .to({ beginning: 1.0 }, duration * 0.125)
        .easing(Easing.Sinusoidal.Out)
        .onUpdate(function() {
          _.each(shapes, function(s) {
            var points = s.vertices;
            points[1].x = points[2].x = end * options.beginning;
          });
        })
        .onComplete(function() {
          start.onComplete();
          callback();
        });

      function reset() {
        options.beginning = options.ending = 0;
        var rotated = Math.random() > 0.5 ? true : false;
        if (rotated) {
          begin = - w / 2;
          end = w / 2;
        } else {
          begin = w / 2;
          end = - w / 2;
        }
        _.each(shapes, function(s) {
          shapes.visible = false;
          var points = s.vertices;
          points[0].x = points[1].x = points[2].x = points[3].x = begin;
        });
        playing = false;
      }

      reset();

      var exports = {
        update: update,
        resize: resize,
        start: start,
        playing: function() { return playing; },
        hash: i + ',4'
      };

      monome[exports.hash] = exports;

      return exports;

    })();

  });

  _.each(_.range(flashAmount), function(i) {

    var flash = (function() {

      var playing = false;
      var callback = _.identity;

      var shape = two.makeRectangle(center.x, center.y, width, height);
      shape.noStroke().fill = colors[PROPERTIES[PROPERTIES.length - 1 - (i % PROPERTIES.length)]];
      shape.visible = false;

      var start = function(onComplete) {
        playing = true;
        _.delay(function() {
          playing = false;
          callback();
          shape.visible = false;
        }, duration * 0.25);
        if (_.isFunction(onComplete)) {
          callback = onComplete;
        }
      };

      var update = function() {
        shape.fill = colors[PROPERTIES[PROPERTIES.length - 1 - (i % PROPERTIES.length)]];
      };

      var resize = function() {
        var vertices = shape.vertices;
        vertices[0].set(- center.x, - center.y);
        vertices[1].set(center.x, - center.y);
        vertices[2].set(center.x, center.y);
        vertices[3].set(- center.x, center.y);
      };

      two.bind('update', function() {
        if (!playing) {
          return;
        }
        shape.visible = Math.random() > 0.5;
      });

      var exports = {
        update: update,
        resize: resize,
        start: start,
        playing: function() { return playing; },
        hash: i + ',7'
      };

      monome[exports.hash] = exports;

      return exports;

    })();

  });

  var suspension = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 16, r1 = height * 12 / 900, r2 = height * 20 / 900, theta, deviation, distance = height;

    var destinations = [];
    var circles = _.map(_.range(amount), function(i) {
      var r = Math.round(map(Math.random(), 0, 1, r1, r2));
      var circle = two.makeCircle(0, 0, r);
      circle.fill = colors.white;
      circle.noStroke();
      destinations.push(new Two.Vector());
      return circle;
    });

    var group = two.makeGroup(circles);
    group.translation.set(center.x, center.y);

    var start = function(onComplete) {
      _.each(circles, function(c) {
        c.visible = true;
      })
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      group.fill = colors.white;
    };
    var resize = function() {
      group.translation.set(center.x, center.y);
    };

    var options = { ending: 0 };

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1 }, duration * 0.5)
      .easing(Easing.Sinusoidal.Out)
      .onStart(function() {
        playing = true;
      })
      .onUpdate(function() {
        var t = options.ending;
        _.each(circles, function(c, i) {
          var d = destinations[i];
          var x = lerp(c.translation.x, d.x, t);
          var y = lerp(c.translation.y, d.y, t);
          c.translation.set(x, y);
        });
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {

      theta = Math.random() * TWO_PI;
      deviation = map(Math.random(), 0, 1, Math.PI / 4, Math.PI / 2);

      options.ending = 0;

      _.each(circles, function(c, i) {

        var t = theta + Math.random() * deviation * 2 - deviation;
        var a = Math.random() * distance;
        var x = a * Math.cos(t);
        var y = a * Math.sin(t);
        destinations[i].set(x, y);

        c.visible = false;
        c.translation.set(0, 0);

      });

      playing = false;

    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '0,2'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var confetti = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 32, r1 = height * 12 / 900, r2 = height * 20 / 900, theta, deviation, distance = width;

    var destinations = [];
    var circles = _.map(_.range(amount), function(i) {
      var r = Math.round(map(Math.random(), 0, 1, r1, r2));
      var circle = two.makeCircle(0, 0, r);
      circle.fill = colors.white;
      circle.noStroke();
      destinations.push(new Two.Vector());
      return circle;
    });

    var group = two.makeGroup(circles);
    // group.translation.set(center.x, center.y);

    var start = function(onComplete) {
      _.each(circles, function(c) {
        c.visible = true;
      })
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      group.fill = colors.white;
    };
    var resize = function() {
      group.translation.set(center.x, center.y);
    };

    var options = { ending: 0 };

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1 }, duration * 0.5)
      .easing(Easing.Sinusoidal.Out)
      .onStart(function() {
        playing = true;
      })
      .onUpdate(function() {
        var t = options.ending;
        _.each(circles, function(c, i) {
          var d = destinations[i];
          var x = lerp(c.translation.x, d.x, t);
          var y = lerp(c.translation.y, d.y, t);
          c.translation.set(x, y);
        });
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {

      var ox, oy, pos = Math.random() * 4;

      if (pos > 3) {
        // west
        ox = - width / 8;
        oy = center.y;
      } else if (pos > 2) {
        // east
        ox = width * 1.125;
        oy = center.y;
      } else if (pos > 1) {
        // north
        ox = center.x;
        oy = - height / 8;
      } else {
        // west
        ox = center.x;
        oy = height * 1.125;
      }

      group.translation.set(ox, oy);

      theta = Math.atan2(center.y - oy, center.x - ox);
      deviation = Math.PI / 2;

      options.ending = 0;

      _.each(circles, function(c, i) {

        var t = theta + Math.random() * deviation * 2 - deviation;
        var a = Math.random() * distance;
        var x = a * Math.cos(t);
        var y = a * Math.sin(t);
        destinations[i].set(x, y);

        c.visible = false;
        c.translation.set(0, 0);

      });

      playing = false;

    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '2,2'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var timer = (function() {

    var callback = _.identity;
    var playing = false;
    var amount = 128, radius = height / 3;

    var points = _.map(_.range(amount), function(i) {

      var pct = i / amount;
      var theta = pct * TWO_PI;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);

      return new Two.Vector(x, y);

    });

    points.push(points[0], points[1]);

    var timer = two.makePolygon(points, true);
    timer.stroke = colors.highlight;
    timer.cap = 'butt';
    timer.linewidth = height / 10;
    timer.noFill();

    timer.translation.set(center.x, center.y);

    points = timer.vertices;

    var start = function(onComplete) {
      timer.visible = true;
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      timer.stroke = colors.highlight;
    };
    var resize = function() {
      timer.translation.set(center.x, center.y);
      radius = height / 3;
      timer.linewidth = height / 10;
      _.each(points, function(v, i) {
        var pct = i / amount;
        var theta = pct * TWO_PI;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        v.set(x, y);
      });
    };

    var options = { ending: 0, beginning: 0 };
    var diretion = true;

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1 }, duration / 3)
      .easing(Easing.Sinusoidal.Out)
      .onUpdate(function() {
        if (direction) {
          timer.ending = options.ending;
        } else {
          timer.beginning = 1 - options.ending;
        }
      })
      .onStart(function() {
        playing = true;
      })
      .onComplete(function() {
        _out.start();
      });

    var _out = new TWEEN.Tween(options)
      .to({ beginning: 1 }, duration / 3)
      .easing(Easing.Sinusoidal.In)
      .onUpdate(function() {
        if (direction) {
          timer.beginning = options.beginning;
        } else {
          timer.ending = 1 - options.beginning;
        }
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {
      direction = Math.random() > 0.5;
      timer.visible = false;
      timer.rotation = TWO_PI * Math.random();
      options.ending = options.beginning = 0;
      timer.ending = timer.beginning = direction ? 0 : 1;
      playing = false;
    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '0,3'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var ufo = (function() {

    var playing = false;
    var callback = _.identity;

    var radius = height * 0.25;
    var circle = two.makeCircle(0, 0, radius);
    circle.noStroke().fill = colors.accent;

    var options = { i: 0, o: 0 };
    var start = function(onComplete) {
      playing = true;
      _in.start();
      circle.visible = true;
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      circle.fill = colors.accent;
    };
    var resize = function() {
      radius = height * 0.25;
    };

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1.0 }, duration / 2)
      .easing(Easing.Circular.Out)
      .onUpdate(function(t) {
        circle.translation.y = lerp(circle.origin, circle.destination, t);
      })
      .onComplete(function() {
        _out.start();
      });

    var _out = new TWEEN.Tween(circle)
      .to({ scale: 0 }, duration / 2)
      .easing(Easing.Circular.Out)
      .onComplete(function() {
        playing = false;
        start.onComplete();
        callback();
      });

    function reset() {
      circle.visible = false;
      var right = Math.random() > 0.5;
      var top = Math.random() > 0.5;
      var x, y;
      if (right) {
        circle.translation.x = width * 0.75;
      } else {
        circle.translation.x = width * 0.25;
      }
      if (top) {
        circle.origin = circle.translation.y =  - center.y;
      } else {
        circle.origin = circle.translation.y = height * 1.5;
      }
      circle.destination = center.y;
      circle.scale = 1;
    }

    reset();

    var exports = {
      resize: resize,
      update: update,
      start: start,
      playing: function() { return playing; },
      hash: '1,5'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var splits = (function() {

    var playing = false;
    var callback = _.identity;

    var amount = 25, last = amount - 1;
    var radius = height * 0.33;
    var distance = height / 6;

    var points = _.map(_.range(amount), function(i) {
      var pct = i / last;
      var theta = pct * Math.PI;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);
      return new Two.Vector(x, y);
    });

    var a = two.makePolygon(points);
    a.origin = new Two.Vector().copy(a.translation);

    points = _.map(_.range(amount), function(i) {
      var pct = i / last;
      var theta = pct * Math.PI + Math.PI;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);
      return new Two.Vector(x, y);
    });

    var b = two.makePolygon(points);
    b.origin = new Two.Vector().copy(b.translation);

    var shape = two.makeGroup(a, b);
    shape.fill = shape.stroke = colors.foreground;
    shape.translation.set(center.x, center.y);

    var options = { ending: 0, beginning: 0 };

    var start = function(onComplete) {
      playing = true;
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = shape.stroke = colors.foreground;
    };

    var resize = function() {
      radius = height * 0.33;
      distance = height / 6;
      shape.translation.set(center.x, center.y);
    };

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1.0 }, duration * 0.5)
      .easing(Easing.Circular.In)
      .onUpdate(function(t) {
        shape.visible = Math.random() < t;
      })
      .onComplete(function() {
        shape.visible = true;
        _out.start();
      });

    var _out = new TWEEN.Tween(options)
      .to({ beginning: 1.0 }, duration * 0.5)
      .easing(Easing.Circular.Out)
      .delay(duration * 0.5)
      .onUpdate(function(t) {
        a.translation.y = ease(a.translation.y, a.origin.y + distance, 0.3);
        b.translation.y = ease(b.translation.y, b.origin.y - distance, 0.3);
        shape.opacity = 1 - t;
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {

      playing = false;
      options.ending = options.beginning = 0;
      shape.visible = false;
      shape.rotation = Math.random() * TWO_PI;
      a.translation.copy(a.origin);
      b.translation.copy(b.origin);
      shape.opacity = 1;

    }

    reset();

    var exports = {
      resize: resize,
      update: update,
      start: start,
      playing: function() { return playing; },
      hash: '2,5'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var moon = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 50, half = amount / 2;
    var radius = height * 0.33;

    var destinations = [];
    var points = _.map(_.range(amount), function(i) {
      var pct = i / amount;
      var theta = pct * TWO_PI;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);
      destinations.push({ x: x, y: y });
      return new Two.Vector(x, y);
    });

    var moon = two.makePolygon(points);
    moon.translation.set(center.x, center.y);
    moon.fill = colors.foreground;
    moon.noStroke();

    var options = { ending: 0, beginning: 0 };

    var start = function(onComplete) {
      moon.visible = true;
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      moon.fill = colors.foreground;
    };
    var resize = function() {
      radius = height * 0.33;
      moon.translation.set(center.x, center.y);
    };

    var _in = new TWEEN.Tween(options)
      .to({ ending: 1.0 }, duration / 2)
      .easing(Easing.Sinusoidal.Out)
      .onUpdate(function() {
        var t = options.ending;
        for (var i = half; i < amount; i++) {
          var v = points[i];
          var d = destinations[i];
          var y = lerp(v.y, d.y, t);
          v.y = y;
        }
      })
      .onStart(function() {
        playing = true;
      })
      .onComplete(function() {
        _out.start();
      });

    var _out = new TWEEN.Tween(options)
      .to({ beginning: 1.0 }, duration / 2)
      .easing(Easing.Sinusoidal.Out)
      .onUpdate(function() {
        var t = options.beginning;
        for (var i = 0; i < half; i++) {
          var v = points[i];
          var d = destinations[i];
          var y = lerp(v.y, negate(d.y), t);
          v.y = y;
        }
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {
      moon.visible = false;
      moon.rotation = Math.random() * TWO_PI;
      options.beginning = options.ending = 0;
      _.each(points, function(v, i) {
        var pct = i / amount;
        var theta = pct * TWO_PI;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        destinations[i] = { x: x, y: y };
        v.set(x, Math.abs(y));
      });
      playing = false;
    }

    reset();

    var exports = {
      resize: resize,
      update: update,
      start: start,
      playing: function() { return playing; },
      hash: '0,5'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var strike = (function() {

    var playing = false;
    var callback = _.identity;

    var amount = 32;
    var distance = height * 0.5;

    var points = _.map(_.range(amount), function(i) {
      return new Two.Vector();
    });
    var line = two.makePolygon(points, true);
    line.noFill().stroke = colors.black;
    line.translation.set(center.x, center.y);

    var start = function(onComplete) {
      line.visible = true;
      playing = true;
      animate_in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var resize = function() {
      // distance = height * 0.5;
      line.translation.set(center.x, center.y);
    };
    var update = function() {
      line.stroke = colors.black;
    };

    var animate_in = new TWEEN.Tween(line)
      .to({
        ending: 1.0
      }, duration * 0.25)
      .easing(Easing.Circular.In)
      .onComplete(function() {
        animate_out.start();
      });

    var animate_out = new TWEEN.Tween(line)
      .to({
        beginning: 1.0
      }, duration * 0.25)
      .easing(Easing.Circular.Out)
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    var exports = {
      start: start,
      resize: resize,
      update: update,
      playing: function() { return playing; },
      hash: '1,2'
    };

    var a = {
      x: 0, y: 0
    };
    var b = {
      x: 0, y: 0
    };

    function reset() {
      playing = false;
      var rando = Math.random();
      line.linewidth = Math.round(rando * 7) + 3;
      distance = Math.round(map(rando, 0, 1, height * 0.5, width))
      var theta = Math.random() * TWO_PI;
      a.x = distance * Math.cos(theta);
      a.y = distance * Math.sin(theta);
      theta = theta + Math.PI;
      b.x = distance * Math.cos(theta);
      b.y = distance * Math.sin(theta);
      line.beginning = line.ending = 0;
      line.visible = false;
      _.each(points, function(p, i) {
        var pct = i / (amount - 1);
        p.x = lerp(a.x, b.x, pct);
        p.y = lerp(a.y, b.y, pct);
      });
    }

    reset();

    monome[exports.hash] = exports;

    return exports;

  })();

  var zigzag = (function() {

    var playing = false;
    var callback = _.identity;

    var amount = 200, w = width / 16, phi = 6, h = height * 0.66;
    var offset = Math.PI * 0.5;

    var points = _.map(_.range(amount), function(i) {
      var pct = i / amount;
      var theta = TWO_PI * phi * pct + offset;
      var x = w * Math.sin(theta);
      var y = map(pct, 0, 1, - h / 2, h / 2);
      return new Two.Vector(x, y);
    });

    var zigzag = two.makePolygon(points, true);
    // zigzag.translation.set();
    zigzag.stroke = colors.black;
    zigzag.linewidth = 15;
    zigzag.noFill();
    zigzag.join = 'miter';
    zigzag.miter = 4;
    zigzag.cap = 'butt';

    var start = function(onComplete) {
      zigzag.visible = true;
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      zigzag.stroke = colors.black;
    };
    var resize = function() {
      w = width / 16;
      h = height * 0.66;
    };

    var _in = new TWEEN.Tween(zigzag)
      .to({ ending: 1.0 }, duration * 0.25)
      .easing(Easing.Sinusoidal.Out)
      .onStart(function() {
        playing = true;
      })
      .onComplete(function() {
        _out.start();
      });

    var _out = new TWEEN.Tween(zigzag)
      .to({ beginning: 1.0 }, duration * 0.25)
      .easing(Easing.Sinusoidal.Out)
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {

      if (Math.random() > 0.5) {
        zigzag.translation.set(width * 0.85, center.y);
      } else {
        zigzag.translation.set(width * 0.15, center.y);
      }

      zigzag.visible = false;
      var index = Math.random() * 4;
      if (index > 3) {
        phi = 5;
      } else if (index > 2) {
        phi = 4;
      } else if (index > 1) {
        phi = 2
      } else {
        phi = 1;
      }
      offset = Math.PI / 2;
      zigzag.rotation = Math.random() > 0.5 ? Math.PI : 0;
      var x = 0;
      zigzag.beginning = zigzag.ending = 0;
      _.each(points, function(v, i) {
        var pct = i / amount;
        var theta = Math.abs((((2 * (pct * TWO_PI * phi + offset) / Math.PI) - 1) % 4) - 2) - 1;
        var x = theta * w / 2;
        var y = map(pct, 0, 1, - h / 2, h / 2);
        v.set(x, y);
      });
      playing = false;
    }

    reset();

    var exports = {
      start: start,
      resize: resize,
      update: update,
      playing: function() { return playing; },
      hash: '2,0'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var squiggle = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 200, w = center.x, phi = 6, h = height * 0.33;
    var offset = Math.PI * 0.5;

    var points = _.map(_.range(amount), function(i) {
      var pct = i / amount;
      var theta = TWO_PI * phi * pct + offset;
      var x = map(pct, 0, 1, - w / 2, w / 2);
      var y = h * Math.sin(theta);
      return new Two.Vector(x, y);
    });

    var squiggle = two.makeCurve(points, true);
    squiggle.translation.set(center.x, center.y);
    squiggle.stroke = colors.accent;
    squiggle.linewidth = 12;
    squiggle.noFill();

    // points = squiggle.vertices;

    var start = function(onComplete) {
      squiggle.visible = true;
      _in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      squiggle.stroke = colors.accent;
    };
    var resize = function() {
      w = center.x;
      h = height * 0.33;
      squiggle.translation.set(center.x, center.y);
    };

    // var options = { ending: 0, beginning: 0 };

    var _in = new TWEEN.Tween(squiggle)
      .to({ ending: 1.0 }, duration / 2)
      .easing(Easing.Sinusoidal.Out)
      // .onUpdate(function() {
      //   squiggle.ending = options.ending;
      // })
      .onStart(function() {
        playing = true;
      })
      .onComplete(function() {
        _out.start();
      });

    var _out = new TWEEN.Tween(squiggle)
      .to({ beginning: 1.0 }, duration / 2)
      .easing(Easing.Sinusoidal.In)
      // .onUpdate(function() {
      //   squiggle.beginning = options.beginning;
      // })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    function reset() {
      squiggle.visible = false;
      phi = Math.round(Math.random() * 6) + 1;
      offset = Math.PI / 2;
      squiggle.rotation = Math.random() > 0.5 ? Math.PI : 0;
      // options.beginning = options.ending = 0;
      squiggle.beginning = squiggle.ending = 0;
      _.each(points, function(v, i) {
        var pct = i / amount;
        var theta = TWO_PI * phi * pct + offset;
        var x = map(pct, 0, 1, - w / 2, w / 2);
        var y = h * Math.sin(theta);
        v.set(x, y);
      });
      playing = false;
    }

    reset();

    var exports = {
      start: start,
      resize: resize,
      update: update,
      playing: function() { return playing; },
      hash: '0,0'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var bubbles = (function() {

    var callback = _.identity;
    var playing = false;
    var amount = 24, radius = height * .33;
    var last = amount - 1;
    var dur = duration * 0.2;
    var bubbleRadius = height * 10 / 900;
    var direction = true;

    var circles = _.map(_.range(amount), function(i) {

      var pct = i / last;
      var theta = pct * TWO_PI;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);

      var circle = two.makeCircle(radius, 0, bubbleRadius);
      circle.theta = 0;
      circle.destination = theta;
      return circle;

    });

    var shape = two.makeGroup(circles);
    shape.noStroke().fill = colors.black;
    shape.translation.set(center.x, center.y);

    var start = function(onComplete) {
      playing = true;
      ins[0].start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = colors.black;
    };
    var resize = function() {
      shape.translation.set(center.x, center.y);
      radius = height / 3;
    };

    var options = { ending: 0, beginning: 0 };
    var diretion = true;

    var ins = _.map(circles, function(c, i) {

      return new TWEEN.Tween(c)
        .to({ theta: c.destination }, dur / (i + 1))
        .onStart(function() {
          c.visible = true;
        })
        .onUpdate(function(t) {
          var theta = direction ? c.theta : - c.theta;
          var x = radius * Math.cos(theta);
          var y = radius * Math.sin(theta);
          c.translation.set(x, y);
        })
        .onComplete(function() {

          if (i >= last) {
            outs[0].start();
            return;
          }

          var next = circles[i + 1];
          var tween = ins[i + 1];
          next.theta = c.theta;
          next.translation.copy(c.translation);
          tween.start();

        });

    });

    var outs = _.map(circles, function(c, i) {

      var next = circles[i + 1];
      if (!next) {
        next = TWO_PI;
      } else {
        next = next.destination;
      }

      return new TWEEN.Tween(c)
        .to({ theta: next }, dur / (amount - (i + 1)))
        // .easing(Easing.Circular.Out)
        .onUpdate(function(t) {
          var theta = direction ? c.theta : - c.theta;
          var x = radius * Math.cos(theta);
          var y = radius * Math.sin(theta);
          c.translation.set(x, y);
        })
        .onComplete(function() {

          c.visible = false;

          if (i >= last - 1) {
            callback();
            start.onComplete();
            return;
          }

          var tween = outs[i + 1].start();

        });

    });

    function reset() {
      direction = Math.random() > 0.5;
      shape.visible = false;
      shape.rotation = TWO_PI * Math.random();
      playing = false;
      _.each(circles, function(c) {
        c.theta = 0;
        c.translation.set(radius, 0);
      })
    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '1,3'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var corona = (function() {

    var callback = _.identity;
    var playing = false;

    var amount = 32, radius = height * .45;
    var last = amount - 1;
    var dur = duration * 0.1;
    var bubbleRadius = height * 12 / 900;
    var direction = true;

    var circles = _.map(_.range(amount), function(i) {

      var pct = i / last;
      var theta = pct * TWO_PI;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);

      var circle = makeTriangle(radius, 0, bubbleRadius);
      circle.theta = 0;
      circle.destination = theta;
      return circle;

    });

    var shape = two.makeGroup(circles);
    shape.noStroke().fill = colors.white;
    shape.translation.set(center.x, center.y);

    var start = function(onComplete) {
      playing = true;
      ins[0].start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = colors.white;
    };
    var resize = function() {
      shape.translation.set(center.x, center.y);
      radius = height * .45;
    };

    var options = { ending: 0, beginning: 0 };
    var diretion = true;

    var ins = _.map(circles, function(c, i) {

      return new TWEEN.Tween(c)
        .to({ theta: c.destination }, dur / (i + 1))
        .onStart(function() {
          c.visible = true;
        })
        .onUpdate(function(t) {
          var theta = direction ? c.theta : - c.theta;
          var x = radius * Math.cos(theta);
          var y = radius * Math.sin(theta);
          c.translation.set(x, y);
          c.rotation = theta;
        })
        .onComplete(function() {

          if (i >= last) {
            outs[0].start();
            return;
          }

          var next = circles[i + 1];
          var tween = ins[i + 1];
          next.theta = c.theta;
          next.translation.copy(c.translation);
          tween.start();

        });

    });

    var outs = _.map(circles, function(c, i) {

      var next = circles[i + 1];
      if (!next) {
        next = TWO_PI;
      } else {
        next = next.destination;
      }

      return new TWEEN.Tween(c)
        .to({ theta: next }, dur / (amount - (i + 1)))
        // .easing(Easing.Circular.Out)
        .onUpdate(function(t) {
          var theta = direction ? c.theta : - c.theta;
          var x = radius * Math.cos(theta);
          var y = radius * Math.sin(theta);
          c.translation.set(x, y);
          c.rotation = theta;
        })
        .onComplete(function() {

          c.visible = false;

          if (i >= last - 1) {
            callback();
            start.onComplete();
            return;
          }

          var tween = outs[i + 1].start();

        });

    });

    function reset() {
      direction = Math.random() > 0.5;
      shape.visible = false;
      shape.rotation = TWO_PI * Math.random();
      playing = false;
      _.each(circles, function(c) {
        c.theta = 0;
        c.translation.set(radius, 0);
      })
    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '2,3'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  var pinwheel = (function() {

    var playing = false;
    var callback = _.identity;

    var amount = 8;
    var dur = duration / (amount + 2);
    var distance = height / 5;
    var startAngle = 0;
    var endAngle = TWO_PI;
    var drift = Math.random() * TWO_PI;

    var points = _.map(_.range(amount), function(i) {
      return new Two.Vector();
    });

    var shape = two.makePolygon(points);
    shape.fill = colors.highlight;
    shape.noStroke();
    shape.translation.set(center.x, center.y);

    var start = function(onComplete) {
      playing = true;
      shape.visible = true;
      _.each(sequence[0], function(tween) {
        tween.start();
      });
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = colors.highlight;
    };
    var resize = function() {
      distance = height / 6;
      shape.translation.set(center.x, center.y);
    };

    var sequence = [];

    _.each(_.range(amount), function(i) {

      var index = i + 1;
      var center = Math.PI * (index / amount);

      var parallel = [];

      _.each(_.range(amount), function(j) {

        var pct = Math.min(j / index, 1.0);
        var theta = pct * endAngle + startAngle + center + drift;
        var p = points[j];
        var x = distance * Math.cos(theta);
        var y = distance * Math.sin(theta);

        var tween = new TWEEN.Tween(p)
          .to({
            x: x,
            y: y
          }, dur)
          .easing(Easing.Sinusoidal.Out);

        parallel.push(tween);

      });

      var tween = parallel[0];
      tween.onComplete(function() {
        var parallel = sequence[index];
        if (_.isArray(parallel)) {
          _.each(parallel, function(tween) {
            tween.start();
          })
          return;
        }
        tween_out.start();
      });

      sequence.push(parallel);

    });

    var tween_out = new TWEEN.Tween(shape)
      .to({
        scale: 0
      }, dur)
      .easing(Easing.Sinusoidal.Out)
      .onComplete(function() {
        start.onComplete();
        callback();
        playing = false;
      });

    function reset() {
      shape.visible = false;
      shape.rotation = Math.random() * TWO_PI;
      _.each(points, function(p, i) {
        var pct = i / amount;
        var theta = startAngle;
        var x = distance * Math.cos(theta);
        var y = distance * Math.sin(theta);
        p.set(x, y);
      });
      shape.scale = 1;
    }

    reset();

    var exports = {
      start: start,
      resize: resize,
      update: update,
      playing: function() { return playing; },
      hash: '1,0'
    };

    monome[exports.hash] = exports;

    return exports;


  })();

  var glimmer = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 8, r1 = height * 20 / 900, r2 = height * 40 / 900;

    var longest = 0, index;

    var circles = _.map(_.range(amount), function(i) {
      var r = Math.round(map(Math.random(), 0, 1, r1, r2));
      var delay = Math.random() * duration * 0.5;
      var circle = two.makeCircle(0, 0, r);
      circle.stroke = colors.white;
      circle.noFill();
      circle.__linewidth = Math.random() * 12 + 32;
      circle.tween = new TWEEN.Tween(circle)
        .to({ scale: 1, linewidth: 0 }, duration * 0.35)
        .easing(Easing.Sinusoidal.Out)
        .delay(delay)
        .onComplete(function() {
          circle.visible = false;
        });

      if (longest < delay) {
        longest = delay;
        index = i;
      }

      return circle;

    });

    circles[index].tween
      .onComplete(function() {
        circles[index].visible = false;
        start.onComplete();
        callback();
      });


    var group = two.makeGroup(circles);
    group.translation.set(center.x, center.y);

    var start = function(onComplete) {
      playing = true;
      _.each(circles, function(c) {
        c.visible = true;
        c.tween.start();
      });
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    }

    start.onComplete = reset;

    var update = function() {
      group.stroke = colors.white;
    };
    var resize = function() {
      group.translation.set(center.x, center.y);
    };

    function reset() {

      _.each(circles, function(c, i) {

        var theta = Math.PI * 2 * Math.random();

        var x = Math.random() * center.y * Math.cos(theta);
        var y = Math.random() * center.y * Math.sin(theta);

        c.translation.set(x, y);
        c.visible = false;
        c.scale = 0;
        c.linewidth = c.__linewidth;

      });

      playing = false;

    }

    reset();

    var exports = {
      start: start,
      update: update,
      resize: resize,
      playing: function() { return playing; },
      hash: '0,8'
    };

    monome[exports.hash] = exports;

    return exports;

  })();

  two.bind('resize', function() {
    width = two.width;
    height = two.height;
    center.x = width / 2;
    center.y = height / 2;
    _.each(animations.map, function(o) {
      if (o.resize) {
        o.resize();
      }
    });
  });

  var changedColors = false;
  var changeColors = {};
  changeColors.start = function(onComplete) {
    current = (current + 1) % PALETTE.length;
    changedColors = false;
    if (_.isFunction(onComplete)) {
      changeColors.callback = onComplete;
    }
  };

  changeColors.hash = '3,';

  changeColors.callback = _.identity;

  changeColors.playing = function() {
    return !changedColors;
  };

  changeColors.onComplete = function() {
    changeColors.callback();
  };

  _.each(_.range(8), function(i) {
    monome[changeColors.hash + i] = changeColors;
  });

  var exports = {

    // An update loop

    update: function() {
      var palette = PALETTE[current];
      var amount = 0;
      _.each(_colors, function(v, k) {
        var c = palette[k];
        var r = v.r, g = v.g, b = v.b;
        if (colorsEqual(c, v)) {
          amount++;
        }
        v.r = ease(r, c.r, drag);
        v.g = ease(g, c.g, drag);
        v.b = ease(b, c.b, drag);
        colors[k] = toString(v);
      });
      if (amount >= PALETTE.length) {
        if (!changedColors) {
          changedColors = true;
          changeColors.onComplete();
        }
        return;
      }
      _.each(this.map, function(o) {
        if (_.isFunction(o.update)) {
          o.update();
        }
      });
      document.body.style.background = colors.background;
    },

    map: monome

  };

  return exports;

})();

function makeTriangle(x, y, radius) {
  var t1 = TWO_PI * .33;
  var t2 = TWO_PI * .66;
  var t3 = TWO_PI;
  var points = [
    new Two.Vector(radius * Math.cos(t1) + x, radius * Math.sin(t1) + y),
    new Two.Vector(radius * Math.cos(t2) + x, radius * Math.sin(t2) + y),
    new Two.Vector(radius * Math.cos(t3) + x, radius * Math.sin(t3) + y)
  ];
  var shape = two.makePolygon(points);
  return shape;
}

function colorsEqual(c1, c2, t) {
  var threshold = t || 0.25;
  return Math.abs(c1.r - c2.r) < threshold
    && Math.abs(c1.g - c2.g) < threshold
    && Math.abs(c1.b - c2.b) < threshold;
}

function ease(cur, dest, t) {
  var d = dest - cur;
  if (Math.abs(d) <= 0.0001) {
    return dest;
  } else {
    return cur + d * t;
  }
}

function toString(o) {
  return 'rgb(' + Math.round(o.r) + ',' + Math.round(o.g) + ',' + Math.round(o.b) + ')';
}

function angleBetween(v1, v2) {
  var dx = v2.x - v1.x;
  var dy = v2.y - v2.y;
  return Math.atan2(dy, dx);
}

function negate(v) {
  return v * -1;
}

function lerp(a, b, t) {
  return (b - a) * t + a;
}

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

function sigmoid(a, b, t, k) {
  var k = k || 0.2;
  return lerp(a, b, (k * t) / ((1 + k) * t));
}
