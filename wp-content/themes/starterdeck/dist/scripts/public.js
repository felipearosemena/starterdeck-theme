(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * matchesSelector v2.0.1
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }

}( window, function factory() {
  'use strict';

  var matchesMethod = ( function() {
    var ElemProto = Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));

},{}],2:[function(require,module,exports){
/**
 * EvEmitter v1.0.3
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  while ( listener ) {
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }

  return this;
};

return EvEmitter;

}));

},{}],3:[function(require,module,exports){
/**
 * Fizzy UI utils v2.0.3
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'desandro-matches-selector/matches-selector'
    ], function( matchesSelector ) {
      return factory( window, matchesSelector );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.matchesSelector
    );
  }

}( window, function factory( window, matchesSelector ) {

'use strict';

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0; i < obj.length; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));

},{"desandro-matches-selector":1}],4:[function(require,module,exports){
// add, remove cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'fizzy-ui-utils/utils'
    ], function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, utils ) {

'use strict';

// append cells to a document fragment
function getCellsFragment( cells ) {
  var fragment = document.createDocumentFragment();
  cells.forEach( function( cell ) {
    fragment.appendChild( cell.element );
  });
  return fragment;
}

// -------------------------- add/remove cell prototype -------------------------- //

var proto = Flickity.prototype;

/**
 * Insert, prepend, or append cells
 * @param {Element, Array, NodeList} elems
 * @param {Integer} index
 */
proto.insert = function( elems, index ) {
  var cells = this._makeCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }
  var len = this.cells.length;
  // default to append
  index = index === undefined ? len : index;
  // add cells with document fragment
  var fragment = getCellsFragment( cells );
  // append to slider
  var isAppend = index == len;
  if ( isAppend ) {
    this.slider.appendChild( fragment );
  } else {
    var insertCellElement = this.cells[ index ].element;
    this.slider.insertBefore( fragment, insertCellElement );
  }
  // add to this.cells
  if ( index === 0 ) {
    // prepend, add to start
    this.cells = cells.concat( this.cells );
  } else if ( isAppend ) {
    // append, add to end
    this.cells = this.cells.concat( cells );
  } else {
    // insert in this.cells
    var endCells = this.cells.splice( index, len - index );
    this.cells = this.cells.concat( cells ).concat( endCells );
  }

  this._sizeCells( cells );

  var selectedIndexDelta = index > this.selectedIndex ? 0 : cells.length;
  this._cellAddedRemoved( index, selectedIndexDelta );
};

proto.append = function( elems ) {
  this.insert( elems, this.cells.length );
};

proto.prepend = function( elems ) {
  this.insert( elems, 0 );
};

/**
 * Remove cells
 * @param {Element, Array, NodeList} elems
 */
proto.remove = function( elems ) {
  var cells = this.getCells( elems );
  var selectedIndexDelta = 0;
  var len = cells.length;
  var i, cell;
  // calculate selectedIndexDelta, easier if done in seperate loop
  for ( i=0; i < len; i++ ) {
    cell = cells[i];
    var wasBefore = this.cells.indexOf( cell ) < this.selectedIndex;
    selectedIndexDelta -= wasBefore ? 1 : 0;
  }

  for ( i=0; i < len; i++ ) {
    cell = cells[i];
    cell.remove();
    // remove item from collection
    utils.removeFrom( this.cells, cell );
  }

  if ( cells.length ) {
    // update stuff
    this._cellAddedRemoved( 0, selectedIndexDelta );
  }
};

// updates when cells are added or removed
proto._cellAddedRemoved = function( changedCellIndex, selectedIndexDelta ) {
  // TODO this math isn't perfect with grouped slides
  selectedIndexDelta = selectedIndexDelta || 0;
  this.selectedIndex += selectedIndexDelta;
  this.selectedIndex = Math.max( 0, Math.min( this.slides.length - 1, this.selectedIndex ) );

  this.cellChange( changedCellIndex, true );
  // backwards compatibility
  this.emitEvent( 'cellAddedRemoved', [ changedCellIndex, selectedIndexDelta ] );
};

/**
 * logic to be run after a cell's size changes
 * @param {Element} elem - cell's element
 */
proto.cellSizeChange = function( elem ) {
  var cell = this.getCell( elem );
  if ( !cell ) {
    return;
  }
  cell.getSize();

  var index = this.cells.indexOf( cell );
  this.cellChange( index );
};

/**
 * logic any time a cell is changed: added, removed, or size changed
 * @param {Integer} changedCellIndex - index of the changed cell, optional
 */
proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
  var prevSlideableWidth = this.slideableWidth;
  this._positionCells( changedCellIndex );
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent( 'cellChange', [ changedCellIndex ] );
  // position slider
  if ( this.options.freeScroll ) {
    // shift x by change in slideableWidth
    // TODO fix position shifts when prepending w/ freeScroll
    var deltaX = prevSlideableWidth - this.slideableWidth;
    this.x += deltaX * this.cellAlign;
    this.positionSlider();
  } else {
    // do not position slider after lazy load
    if ( isPositioningSlider ) {
      this.positionSliderAtSelected();
    }
    this.select( this.selectedIndex );
  }
};

// -----  ----- //

return Flickity;

}));

},{"./flickity":8,"fizzy-ui-utils":3}],5:[function(require,module,exports){
// animate
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'fizzy-ui-utils/utils'
    ], function( utils ) {
      return factory( window, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.animatePrototype = factory(
      window,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, utils ) {

'use strict';

// -------------------------- requestAnimationFrame -------------------------- //

// get rAF, prefixed, if present
var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

// fallback to setTimeout
var lastTime = 0;
if ( !requestAnimationFrame )  {
  requestAnimationFrame = function( callback ) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
    var id = setTimeout( callback, timeToCall );
    lastTime = currTime + timeToCall;
    return id;
  };
}

// -------------------------- animate -------------------------- //

var proto = {};

proto.startAnimation = function() {
  if ( this.isAnimating ) {
    return;
  }

  this.isAnimating = true;
  this.restingFrames = 0;
  this.animate();
};

proto.animate = function() {
  this.applyDragForce();
  this.applySelectedAttraction();

  var previousX = this.x;

  this.integratePhysics();
  this.positionSlider();
  this.settle( previousX );
  // animate next frame
  if ( this.isAnimating ) {
    var _this = this;
    requestAnimationFrame( function animateFrame() {
      _this.animate();
    });
  }
};


var transformProperty = ( function () {
  var style = document.documentElement.style;
  if ( typeof style.transform == 'string' ) {
    return 'transform';
  }
  return 'WebkitTransform';
})();

proto.positionSlider = function() {
  var x = this.x;
  // wrap position around
  if ( this.options.wrapAround && this.cells.length > 1 ) {
    x = utils.modulo( x, this.slideableWidth );
    x = x - this.slideableWidth;
    this.shiftWrapCells( x );
  }

  x = x + this.cursorPosition;
  // reverse if right-to-left and using transform
  x = this.options.rightToLeft && transformProperty ? -x : x;
  var value = this.getPositionValue( x );
  // use 3D tranforms for hardware acceleration on iOS
  // but use 2D when settled, for better font-rendering
  this.slider.style[ transformProperty ] = this.isAnimating ?
    'translate3d(' + value + ',0,0)' : 'translateX(' + value + ')';

  // scroll event
  var firstSlide = this.slides[0];
  if ( firstSlide ) {
    var positionX = -this.x - firstSlide.target;
    var progress = positionX / this.slidesWidth;
    this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
  }
};

proto.positionSliderAtSelected = function() {
  if ( !this.cells.length ) {
    return;
  }
  this.x = -this.selectedSlide.target;
  this.positionSlider();
};

proto.getPositionValue = function( position ) {
  if ( this.options.percentPosition ) {
    // percent position, round to 2 digits, like 12.34%
    return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 )+ '%';
  } else {
    // pixel positioning
    return Math.round( position ) + 'px';
  }
};

proto.settle = function( previousX ) {
  // keep track of frames where x hasn't moved
  if ( !this.isPointerDown && Math.round( this.x * 100 ) == Math.round( previousX * 100 ) ) {
    this.restingFrames++;
  }
  // stop animating if resting for 3 or more frames
  if ( this.restingFrames > 2 ) {
    this.isAnimating = false;
    delete this.isFreeScrolling;
    // render position with translateX when settled
    this.positionSlider();
    this.dispatchEvent('settle');
  }
};

proto.shiftWrapCells = function( x ) {
  // shift before cells
  var beforeGap = this.cursorPosition + x;
  this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
  // shift after cells
  var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
  this._shiftCells( this.afterShiftCells, afterGap, 1 );
};

proto._shiftCells = function( cells, gap, shift ) {
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    var cellShift = gap > 0 ? shift : 0;
    cell.wrapShift( cellShift );
    gap -= cell.size.outerWidth;
  }
};

proto._unshiftCells = function( cells ) {
  if ( !cells || !cells.length ) {
    return;
  }
  for ( var i=0; i < cells.length; i++ ) {
    cells[i].wrapShift( 0 );
  }
};

// -------------------------- physics -------------------------- //

proto.integratePhysics = function() {
  this.x += this.velocity;
  this.velocity *= this.getFrictionFactor();
};

proto.applyForce = function( force ) {
  this.velocity += force;
};

proto.getFrictionFactor = function() {
  return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
};

proto.getRestingPosition = function() {
  // my thanks to Steven Wittens, who simplified this math greatly
  return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
};

proto.applyDragForce = function() {
  if ( !this.isPointerDown ) {
    return;
  }
  // change the position to drag position by applying force
  var dragVelocity = this.dragX - this.x;
  var dragForce = dragVelocity - this.velocity;
  this.applyForce( dragForce );
};

proto.applySelectedAttraction = function() {
  // do not attract if pointer down or no cells
  if ( this.isPointerDown || this.isFreeScrolling || !this.cells.length ) {
    return;
  }
  var distance = this.selectedSlide.target * -1 - this.x;
  var force = distance * this.options.selectedAttraction;
  this.applyForce( force );
};

return proto;

}));

},{"fizzy-ui-utils":3}],6:[function(require,module,exports){
// Flickity.Cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'get-size/get-size'
    ], function( getSize ) {
      return factory( window, getSize );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('get-size')
    );
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.Cell = factory(
      window,
      window.getSize
    );
  }

}( window, function factory( window, getSize ) {

'use strict';

function Cell( elem, parent ) {
  this.element = elem;
  this.parent = parent;

  this.create();
}

var proto = Cell.prototype;

proto.create = function() {
  this.element.style.position = 'absolute';
  this.x = 0;
  this.shift = 0;
};

proto.destroy = function() {
  // reset style
  this.element.style.position = '';
  var side = this.parent.originSide;
  this.element.style[ side ] = '';
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

proto.setPosition = function( x ) {
  this.x = x;
  this.updateTarget();
  this.renderPosition( x );
};

// setDefaultTarget v1 method, backwards compatibility, remove in v3
proto.updateTarget = proto.setDefaultTarget = function() {
  var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
  this.target = this.x + this.size[ marginProperty ] +
    this.size.width * this.parent.cellAlign;
};

proto.renderPosition = function( x ) {
  // render position of cell with in slider
  var side = this.parent.originSide;
  this.element.style[ side ] = this.parent.getPositionValue( x );
};

/**
 * @param {Integer} factor - 0, 1, or -1
**/
proto.wrapShift = function( shift ) {
  this.shift = shift;
  this.renderPosition( this.x + this.parent.slideableWidth * shift );
};

proto.remove = function() {
  this.element.parentNode.removeChild( this.element );
};

return Cell;

}));

},{"get-size":15}],7:[function(require,module,exports){
// drag
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'unidragger/unidragger',
      'fizzy-ui-utils/utils'
    ], function( Flickity, Unidragger, utils ) {
      return factory( window, Flickity, Unidragger, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('unidragger'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Flickity = factory(
      window,
      window.Flickity,
      window.Unidragger,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, Unidragger, utils ) {

'use strict';

// ----- defaults ----- //

utils.extend( Flickity.defaults, {
  draggable: true,
  dragThreshold: 3,
});

// ----- create ----- //

Flickity.createMethods.push('_createDrag');

// -------------------------- drag prototype -------------------------- //

var proto = Flickity.prototype;
utils.extend( proto, Unidragger.prototype );

// --------------------------  -------------------------- //

var isTouch = 'createTouch' in document;
var isTouchmoveScrollCanceled = false;

proto._createDrag = function() {
  this.on( 'activate', this.bindDrag );
  this.on( 'uiChange', this._uiChangeDrag );
  this.on( 'childUIPointerDown', this._childUIPointerDownDrag );
  this.on( 'deactivate', this.unbindDrag );
  // HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
  // #457, RubaXa/Sortable#973
  if ( isTouch && !isTouchmoveScrollCanceled ) {
    window.addEventListener( 'touchmove', function() {});
    isTouchmoveScrollCanceled = true;
  }
};

proto.bindDrag = function() {
  if ( !this.options.draggable || this.isDragBound ) {
    return;
  }
  this.element.classList.add('is-draggable');
  this.handles = [ this.viewport ];
  this.bindHandles();
  this.isDragBound = true;
};

proto.unbindDrag = function() {
  if ( !this.isDragBound ) {
    return;
  }
  this.element.classList.remove('is-draggable');
  this.unbindHandles();
  delete this.isDragBound;
};

proto._uiChangeDrag = function() {
  delete this.isFreeScrolling;
};

proto._childUIPointerDownDrag = function( event ) {
  event.preventDefault();
  this.pointerDownFocus( event );
};

// -------------------------- pointer events -------------------------- //

// nodes that have text fields
var cursorNodes = {
  TEXTAREA: true,
  INPUT: true,
  OPTION: true,
};

// input types that do not have text fields
var clickTypes = {
  radio: true,
  checkbox: true,
  button: true,
  submit: true,
  image: true,
  file: true,
};

proto.pointerDown = function( event, pointer ) {
  // dismiss inputs with text fields. #403, #404
  var isCursorInput = cursorNodes[ event.target.nodeName ] &&
    !clickTypes[ event.target.type ];
  if ( isCursorInput ) {
    // reset pointerDown logic
    this.isPointerDown = false;
    delete this.pointerIdentifier;
    return;
  }

  this._dragPointerDown( event, pointer );

  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur && focused != this.element &&
    // do not blur body for IE9 & 10, #117
    focused != document.body ) {
    focused.blur();
  }
  this.pointerDownFocus( event );
  // stop if it was moving
  this.dragX = this.x;
  this.viewport.classList.add('is-pointer-down');
  // bind move and end events
  this._bindPostStartEvents( event );
  // track scrolling
  this.pointerDownScroll = getScrollPosition();
  window.addEventListener( 'scroll', this );

  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
};

var touchStartEvents = {
  touchstart: true,
  MSPointerDown: true
};

var focusNodes = {
  INPUT: true,
  SELECT: true
};

proto.pointerDownFocus = function( event ) {
  // focus element, if not touch, and its not an input or select
  if ( !this.options.accessibility || touchStartEvents[ event.type ] ||
      focusNodes[ event.target.nodeName ] ) {
    return;
  }
  var prevScrollY = window.pageYOffset;
  this.element.focus();
  // hack to fix scroll jump after focus, #76
  if ( window.pageYOffset != prevScrollY ) {
    window.scrollTo( window.pageXOffset, prevScrollY );
  }
};

proto.canPreventDefaultOnPointerDown = function( event ) {
  // prevent default, unless touchstart or <select>
  var isTouchstart = event.type == 'touchstart';
  var targetNodeName = event.target.nodeName;
  return !isTouchstart && targetNodeName != 'SELECT';
};

// ----- move ----- //

proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > this.options.dragThreshold;
};

// ----- up ----- //

proto.pointerUp = function( event, pointer ) {
  delete this.isTouchScrolling;
  this.viewport.classList.remove('is-pointer-down');
  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
  this._dragPointerUp( event, pointer );
};

proto.pointerDone = function() {
  window.removeEventListener( 'scroll', this );
  delete this.pointerDownScroll;
};

// -------------------------- dragging -------------------------- //

proto.dragStart = function( event, pointer ) {
  this.dragStartPosition = this.x;
  this.startAnimation();
  window.removeEventListener( 'scroll', this );
  this.dispatchEvent( 'dragStart', event, [ pointer ] );
};

proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();

  this.previousDragX = this.dragX;
  // reverse if right-to-left
  var direction = this.options.rightToLeft ? -1 : 1;
  var dragX = this.dragStartPosition + moveVector.x * direction;

  if ( !this.options.wrapAround && this.slides.length ) {
    // slow drag
    var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
    dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
    var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
    dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
  }

  this.dragX = dragX;

  this.dragMoveTime = new Date();
  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
};

proto.dragEnd = function( event, pointer ) {
  if ( this.options.freeScroll ) {
    this.isFreeScrolling = true;
  }
  // set selectedIndex based on where flick will end up
  var index = this.dragEndRestingSelect();

  if ( this.options.freeScroll && !this.options.wrapAround ) {
    // if free-scroll & not wrap around
    // do not free-scroll if going outside of bounding slides
    // so bounding slides can attract slider, and keep it in bounds
    var restingX = this.getRestingPosition();
    this.isFreeScrolling = -restingX > this.slides[0].target &&
      -restingX < this.getLastSlide().target;
  } else if ( !this.options.freeScroll && index == this.selectedIndex ) {
    // boost selection if selected index has not changed
    index += this.dragEndBoostSelect();
  }
  delete this.previousDragX;
  // apply selection
  // TODO refactor this, selecting here feels weird
  // HACK, set flag so dragging stays in correct direction
  this.isDragSelect = this.options.wrapAround;
  this.select( index );
  delete this.isDragSelect;
  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
};

proto.dragEndRestingSelect = function() {
  var restingX = this.getRestingPosition();
  // how far away from selected slide
  var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
  // get closet resting going up and going down
  var positiveResting = this._getClosestResting( restingX, distance, 1 );
  var negativeResting = this._getClosestResting( restingX, distance, -1 );
  // use closer resting for wrap-around
  var index = positiveResting.distance < negativeResting.distance ?
    positiveResting.index : negativeResting.index;
  return index;
};

/**
 * given resting X and distance to selected cell
 * get the distance and index of the closest cell
 * @param {Number} restingX - estimated post-flick resting position
 * @param {Number} distance - distance to selected cell
 * @param {Integer} increment - +1 or -1, going up or down
 * @returns {Object} - { distance: {Number}, index: {Integer} }
 */
proto._getClosestResting = function( restingX, distance, increment ) {
  var index = this.selectedIndex;
  var minDistance = Infinity;
  var condition = this.options.contain && !this.options.wrapAround ?
    // if contain, keep going if distance is equal to minDistance
    function( d, md ) { return d <= md; } : function( d, md ) { return d < md; };
  while ( condition( distance, minDistance ) ) {
    // measure distance to next cell
    index += increment;
    minDistance = distance;
    distance = this.getSlideDistance( -restingX, index );
    if ( distance === null ) {
      break;
    }
    distance = Math.abs( distance );
  }
  return {
    distance: minDistance,
    // selected was previous index
    index: index - increment
  };
};

/**
 * measure distance between x and a slide target
 * @param {Number} x
 * @param {Integer} index - slide index
 */
proto.getSlideDistance = function( x, index ) {
  var len = this.slides.length;
  // wrap around if at least 2 slides
  var isWrapAround = this.options.wrapAround && len > 1;
  var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
  var slide = this.slides[ slideIndex ];
  if ( !slide ) {
    return null;
  }
  // add distance for wrap-around slides
  var wrap = isWrapAround ? this.slideableWidth * Math.floor( index / len ) : 0;
  return x - ( slide.target + wrap );
};

proto.dragEndBoostSelect = function() {
  // do not boost if no previousDragX or dragMoveTime
  if ( this.previousDragX === undefined || !this.dragMoveTime ||
    // or if drag was held for 100 ms
    new Date() - this.dragMoveTime > 100 ) {
    return 0;
  }

  var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
  var delta = this.previousDragX - this.dragX;
  if ( distance > 0 && delta > 0 ) {
    // boost to next if moving towards the right, and positive velocity
    return 1;
  } else if ( distance < 0 && delta < 0 ) {
    // boost to previous if moving towards the left, and negative velocity
    return -1;
  }
  return 0;
};

// ----- staticClick ----- //

proto.staticClick = function( event, pointer ) {
  // get clickedCell, if cell was clicked
  var clickedCell = this.getParentCell( event.target );
  var cellElem = clickedCell && clickedCell.element;
  var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
  this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
};

// ----- scroll ----- //

proto.onscroll = function() {
  var scroll = getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

function getScrollPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}

// -----  ----- //

return Flickity;

}));

},{"./flickity":8,"fizzy-ui-utils":3,"unidragger":21}],8:[function(require,module,exports){
// Flickity main
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter',
      'get-size/get-size',
      'fizzy-ui-utils/utils',
      './cell',
      './slide',
      './animate'
    ], function( EvEmitter, getSize, utils, Cell, Slide, animatePrototype ) {
      return factory( window, EvEmitter, getSize, utils, Cell, Slide, animatePrototype );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./cell'),
      require('./slide'),
      require('./animate')
    );
  } else {
    // browser global
    var _Flickity = window.Flickity;

    window.Flickity = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      _Flickity.Cell,
      _Flickity.Slide,
      _Flickity.animatePrototype
    );
  }

}( window, function factory( window, EvEmitter, getSize,
  utils, Cell, Slide, animatePrototype ) {

'use strict';

// vars
var jQuery = window.jQuery;
var getComputedStyle = window.getComputedStyle;
var console = window.console;

function moveElements( elems, toElem ) {
  elems = utils.makeArray( elems );
  while ( elems.length ) {
    toElem.appendChild( elems.shift() );
  }
}

// -------------------------- Flickity -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Flickity intances
var instances = {};

function Flickity( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // do not initialize twice on same element
  if ( this.element.flickityGUID ) {
    var instance = instances[ this.element.flickityGUID ];
    instance.option( options );
    return instance;
  }

  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }
  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // kick things off
  this._create();
}

Flickity.defaults = {
  accessibility: true,
  // adaptiveHeight: false,
  cellAlign: 'center',
  // cellSelector: undefined,
  // contain: false,
  freeScrollFriction: 0.075, // friction when free-scrolling
  friction: 0.28, // friction when selecting
  namespaceJQueryEvents: true,
  // initialIndex: 0,
  percentPosition: true,
  resize: true,
  selectedAttraction: 0.025,
  setGallerySize: true
  // watchCSS: false,
  // wrapAround: false
};

// hash of methods triggered on _create()
Flickity.createMethods = [];

var proto = Flickity.prototype;
// inherit EventEmitter
utils.extend( proto, EvEmitter.prototype );

proto._create = function() {
  // add id for Flickity.data
  var id = this.guid = ++GUID;
  this.element.flickityGUID = id; // expando
  instances[ id ] = this; // associate via id
  // initial properties
  this.selectedIndex = 0;
  // how many frames slider has been in same position
  this.restingFrames = 0;
  // initial physics properties
  this.x = 0;
  this.velocity = 0;
  this.originSide = this.options.rightToLeft ? 'right' : 'left';
  // create viewport & slider
  this.viewport = document.createElement('div');
  this.viewport.className = 'flickity-viewport';
  this._createSlider();

  if ( this.options.resize || this.options.watchCSS ) {
    window.addEventListener( 'resize', this );
  }

  Flickity.createMethods.forEach( function( method ) {
    this[ method ]();
  }, this );

  if ( this.options.watchCSS ) {
    this.watchCSS();
  } else {
    this.activate();
  }

};

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

proto.activate = function() {
  if ( this.isActive ) {
    return;
  }
  this.isActive = true;
  this.element.classList.add('flickity-enabled');
  if ( this.options.rightToLeft ) {
    this.element.classList.add('flickity-rtl');
  }

  this.getSize();
  // move initial cell elements so they can be loaded as cells
  var cellElems = this._filterFindCellElements( this.element.children );
  moveElements( cellElems, this.slider );
  this.viewport.appendChild( this.slider );
  this.element.appendChild( this.viewport );
  // get cells from children
  this.reloadCells();

  if ( this.options.accessibility ) {
    // allow element to focusable
    this.element.tabIndex = 0;
    // listen for key presses
    this.element.addEventListener( 'keydown', this );
  }

  this.emitEvent('activate');

  var index;
  var initialIndex = this.options.initialIndex;
  if ( this.isInitActivated ) {
    index = this.selectedIndex;
  } else if ( initialIndex !== undefined ) {
    index = this.cells[ initialIndex ] ? initialIndex : 0;
  } else {
    index = 0;
  }
  // select instantly
  this.select( index, false, true );
  // flag for initial activation, for using initialIndex
  this.isInitActivated = true;
};

// slider positions the cells
proto._createSlider = function() {
  // slider element does all the positioning
  var slider = document.createElement('div');
  slider.className = 'flickity-slider';
  slider.style[ this.originSide ] = 0;
  this.slider = slider;
};

proto._filterFindCellElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.cellSelector );
};

// goes through all children
proto.reloadCells = function() {
  // collection of item elements
  this.cells = this._makeCells( this.slider.children );
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
};

/**
 * turn elements into Flickity.Cells
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Flickity Cells
 */
proto._makeCells = function( elems ) {
  var cellElems = this._filterFindCellElements( elems );

  // create new Flickity for collection
  var cells = cellElems.map( function( cellElem ) {
    return new Cell( cellElem, this );
  }, this );

  return cells;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.getLastSlide = function() {
  return this.slides[ this.slides.length - 1 ];
};

// positions all cells
proto.positionCells = function() {
  // size all cells
  this._sizeCells( this.cells );
  // position all cells
  this._positionCells( 0 );
};

/**
 * position certain cells
 * @param {Integer} index - which cell to start with
 */
proto._positionCells = function( index ) {
  index = index || 0;
  // also measure maxCellHeight
  // start 0 if positioning all cells
  this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
  var cellX = 0;
  // get cellX
  if ( index > 0 ) {
    var startCell = this.cells[ index - 1 ];
    cellX = startCell.x + startCell.size.outerWidth;
  }
  var len = this.cells.length;
  for ( var i=index; i < len; i++ ) {
    var cell = this.cells[i];
    cell.setPosition( cellX );
    cellX += cell.size.outerWidth;
    this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
  }
  // keep track of cellX for wrap-around
  this.slideableWidth = cellX;
  // slides
  this.updateSlides();
  // contain slides target
  this._containSlides();
  // update slidesWidth
  this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
};

/**
 * cell.getSize() on multiple cells
 * @param {Array} cells
 */
proto._sizeCells = function( cells ) {
  cells.forEach( function( cell ) {
    cell.getSize();
  });
};

// --------------------------  -------------------------- //

proto.updateSlides = function() {
  this.slides = [];
  if ( !this.cells.length ) {
    return;
  }

  var slide = new Slide( this );
  this.slides.push( slide );
  var isOriginLeft = this.originSide == 'left';
  var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

  var canCellFit = this._getCanCellFit();

  this.cells.forEach( function( cell, i ) {
    // just add cell if first cell in slide
    if ( !slide.cells.length ) {
      slide.addCell( cell );
      return;
    }

    var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
      ( cell.size.outerWidth - cell.size[ nextMargin ] );

    if ( canCellFit.call( this, i, slideWidth ) ) {
      slide.addCell( cell );
    } else {
      // doesn't fit, new slide
      slide.updateTarget();

      slide = new Slide( this );
      this.slides.push( slide );
      slide.addCell( cell );
    }
  }, this );
  // last slide
  slide.updateTarget();
  // update .selectedSlide
  this.updateSelectedSlide();
};

proto._getCanCellFit = function() {
  var groupCells = this.options.groupCells;
  if ( !groupCells ) {
    return function() {
      return false;
    };
  } else if ( typeof groupCells == 'number' ) {
    // group by number. 3 -> [0,1,2], [3,4,5], ...
    var number = parseInt( groupCells, 10 );
    return function( i ) {
      return ( i % number ) !== 0;
    };
  }
  // default, group by width of slide
  // parse '75%
  var percentMatch = typeof groupCells == 'string' &&
    groupCells.match(/^(\d+)%$/);
  var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
  return function( i, slideWidth ) {
    return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
  };
};

// alias _init for jQuery plugin .flickity()
proto._init =
proto.reposition = function() {
  this.positionCells();
  this.positionSliderAtSelected();
};

proto.getSize = function() {
  this.size = getSize( this.element );
  this.setCellAlign();
  this.cursorPosition = this.size.innerWidth * this.cellAlign;
};

var cellAlignShorthands = {
  // cell align, then based on origin side
  center: {
    left: 0.5,
    right: 0.5
  },
  left: {
    left: 0,
    right: 1
  },
  right: {
    right: 0,
    left: 1
  }
};

proto.setCellAlign = function() {
  var shorthand = cellAlignShorthands[ this.options.cellAlign ];
  this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
};

proto.setGallerySize = function() {
  if ( this.options.setGallerySize ) {
    var height = this.options.adaptiveHeight && this.selectedSlide ?
      this.selectedSlide.height : this.maxCellHeight;
    this.viewport.style.height = height + 'px';
  }
};

proto._getWrapShiftCells = function() {
  // only for wrap-around
  if ( !this.options.wrapAround ) {
    return;
  }
  // unshift previous cells
  this._unshiftCells( this.beforeShiftCells );
  this._unshiftCells( this.afterShiftCells );
  // get before cells
  // initial gap
  var gapX = this.cursorPosition;
  var cellIndex = this.cells.length - 1;
  this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
  // get after cells
  // ending gap between last cell and end of gallery viewport
  gapX = this.size.innerWidth - this.cursorPosition;
  // start cloning at first cell, working forwards
  this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
};

proto._getGapCells = function( gapX, cellIndex, increment ) {
  // keep adding cells until the cover the initial gap
  var cells = [];
  while ( gapX > 0 ) {
    var cell = this.cells[ cellIndex ];
    if ( !cell ) {
      break;
    }
    cells.push( cell );
    cellIndex += increment;
    gapX -= cell.size.outerWidth;
  }
  return cells;
};

// ----- contain ----- //

// contain cell targets so no excess sliding
proto._containSlides = function() {
  if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
    return;
  }
  var isRightToLeft = this.options.rightToLeft;
  var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
  var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
  var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
  // content is less than gallery size
  var isContentSmaller = contentWidth < this.size.innerWidth;
  // bounds
  var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
  var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
  // contain each cell target
  this.slides.forEach( function( slide ) {
    if ( isContentSmaller ) {
      // all cells fit inside gallery
      slide.target = contentWidth * this.cellAlign;
    } else {
      // contain to bounds
      slide.target = Math.max( slide.target, beginBound );
      slide.target = Math.min( slide.target, endBound );
    }
  }, this );
};

// -----  ----- //

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery && this.$element ) {
    // default trigger with type if no event
    type += this.options.namespaceJQueryEvents ? '.flickity' : '';
    var $event = type;
    if ( event ) {
      // create jQuery event
      var jQEvent = jQuery.Event( event );
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger( $event, args );
  }
};

// -------------------------- select -------------------------- //

/**
 * @param {Integer} index - index of the slide
 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
 * @param {Boolean} isInstant - will immediately set position at selected cell
 */
proto.select = function( index, isWrap, isInstant ) {
  if ( !this.isActive ) {
    return;
  }
  index = parseInt( index, 10 );
  this._wrapSelect( index );

  if ( this.options.wrapAround || isWrap ) {
    index = utils.modulo( index, this.slides.length );
  }
  // bail if invalid index
  if ( !this.slides[ index ] ) {
    return;
  }
  this.selectedIndex = index;
  this.updateSelectedSlide();
  if ( isInstant ) {
    this.positionSliderAtSelected();
  } else {
    this.startAnimation();
  }
  if ( this.options.adaptiveHeight ) {
    this.setGallerySize();
  }

  this.dispatchEvent('select');
  // old v1 event name, remove in v3
  this.dispatchEvent('cellSelect');
};

// wraps position for wrapAround, to move to closest slide. #113
proto._wrapSelect = function( index ) {
  var len = this.slides.length;
  var isWrapping = this.options.wrapAround && len > 1;
  if ( !isWrapping ) {
    return index;
  }
  var wrapIndex = utils.modulo( index, len );
  // go to shortest
  var delta = Math.abs( wrapIndex - this.selectedIndex );
  var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
  var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
  if ( !this.isDragSelect && backWrapDelta < delta ) {
    index += len;
  } else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
    index -= len;
  }
  // wrap position so slider is within normal area
  if ( index < 0 ) {
    this.x -= this.slideableWidth;
  } else if ( index >= len ) {
    this.x += this.slideableWidth;
  }
};

proto.previous = function( isWrap, isInstant ) {
  this.select( this.selectedIndex - 1, isWrap, isInstant );
};

proto.next = function( isWrap, isInstant ) {
  this.select( this.selectedIndex + 1, isWrap, isInstant );
};

proto.updateSelectedSlide = function() {
  var slide = this.slides[ this.selectedIndex ];
  // selectedIndex could be outside of slides, if triggered before resize()
  if ( !slide ) {
    return;
  }
  // unselect previous selected slide
  this.unselectSelectedSlide();
  // update new selected slide
  this.selectedSlide = slide;
  slide.select();
  this.selectedCells = slide.cells;
  this.selectedElements = slide.getCellElements();
  // HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
  // Remove in v3?
  this.selectedCell = slide.cells[0];
  this.selectedElement = this.selectedElements[0];
};

proto.unselectSelectedSlide = function() {
  if ( this.selectedSlide ) {
    this.selectedSlide.unselect();
  }
};

/**
 * select slide from number or cell element
 * @param {Element or Number} elem
 */
proto.selectCell = function( value, isWrap, isInstant ) {
  // get cell
  var cell;
  if ( typeof value == 'number' ) {
    cell = this.cells[ value ];
  } else {
    // use string as selector
    if ( typeof value == 'string' ) {
      value = this.element.querySelector( value );
    }
    // get cell from element
    cell = this.getCell( value );
  }
  // select slide that has cell
  for ( var i=0; cell && i < this.slides.length; i++ ) {
    var slide = this.slides[i];
    var index = slide.cells.indexOf( cell );
    if ( index != -1 ) {
      this.select( i, isWrap, isInstant );
      return;
    }
  }
};

// -------------------------- get cells -------------------------- //

/**
 * get Flickity.Cell, given an Element
 * @param {Element} elem
 * @returns {Flickity.Cell} item
 */
proto.getCell = function( elem ) {
  // loop through cells to get the one that matches
  for ( var i=0; i < this.cells.length; i++ ) {
    var cell = this.cells[i];
    if ( cell.element == elem ) {
      return cell;
    }
  }
};

/**
 * get collection of Flickity.Cells, given Elements
 * @param {Element, Array, NodeList} elems
 * @returns {Array} cells - Flickity.Cells
 */
proto.getCells = function( elems ) {
  elems = utils.makeArray( elems );
  var cells = [];
  elems.forEach( function( elem ) {
    var cell = this.getCell( elem );
    if ( cell ) {
      cells.push( cell );
    }
  }, this );
  return cells;
};

/**
 * get cell elements
 * @returns {Array} cellElems
 */
proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

/**
 * get parent cell from an element
 * @param {Element} elem
 * @returns {Flickit.Cell} cell
 */
proto.getParentCell = function( elem ) {
  // first check if elem is cell
  var cell = this.getCell( elem );
  if ( cell ) {
    return cell;
  }
  // try to get parent cell elem
  elem = utils.getParent( elem, '.flickity-slider > *' );
  return this.getCell( elem );
};

/**
 * get cells adjacent to a slide
 * @param {Integer} adjCount - number of adjacent slides
 * @param {Integer} index - index of slide to start
 * @returns {Array} cells - array of Flickity.Cells
 */
proto.getAdjacentCellElements = function( adjCount, index ) {
  if ( !adjCount ) {
    return this.selectedSlide.getCellElements();
  }
  index = index === undefined ? this.selectedIndex : index;

  var len = this.slides.length;
  if ( 1 + ( adjCount * 2 ) >= len ) {
    return this.getCellElements();
  }

  var cellElems = [];
  for ( var i = index - adjCount; i <= index + adjCount ; i++ ) {
    var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
    var slide = this.slides[ slideIndex ];
    if ( slide ) {
      cellElems = cellElems.concat( slide.getCellElements() );
    }
  }
  return cellElems;
};

// -------------------------- events -------------------------- //

proto.uiChange = function() {
  this.emitEvent('uiChange');
};

proto.childUIPointerDown = function( event ) {
  this.emitEvent( 'childUIPointerDown', [ event ] );
};

// ----- resize ----- //

proto.onresize = function() {
  this.watchCSS();
  this.resize();
};

utils.debounceMethod( Flickity, 'onresize', 150 );

proto.resize = function() {
  if ( !this.isActive ) {
    return;
  }
  this.getSize();
  // wrap values
  if ( this.options.wrapAround ) {
    this.x = utils.modulo( this.x, this.slideableWidth );
  }
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent('resize');
  // update selected index for group slides, instant
  // TODO: position can be lost between groups of various numbers
  var selectedElement = this.selectedElements && this.selectedElements[0];
  this.selectCell( selectedElement, false, true );
};

// watches the :after property, activates/deactivates
proto.watchCSS = function() {
  var watchOption = this.options.watchCSS;
  if ( !watchOption ) {
    return;
  }

  var afterContent = getComputedStyle( this.element, ':after' ).content;
  // activate if :after { content: 'flickity' }
  if ( afterContent.indexOf('flickity') != -1 ) {
    this.activate();
  } else {
    this.deactivate();
  }
};

// ----- keydown ----- //

// go previous/next if left/right keys pressed
proto.onkeydown = function( event ) {
  // only work if element is in focus
  if ( !this.options.accessibility ||
    ( document.activeElement && document.activeElement != this.element ) ) {
    return;
  }

  if ( event.keyCode == 37 ) {
    // go left
    var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
    this.uiChange();
    this[ leftMethod ]();
  } else if ( event.keyCode == 39 ) {
    // go right
    var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
    this.uiChange();
    this[ rightMethod ]();
  }
};

// -------------------------- destroy -------------------------- //

// deactivate all Flickity functionality, but keep stuff available
proto.deactivate = function() {
  if ( !this.isActive ) {
    return;
  }
  this.element.classList.remove('flickity-enabled');
  this.element.classList.remove('flickity-rtl');
  // destroy cells
  this.cells.forEach( function( cell ) {
    cell.destroy();
  });
  this.unselectSelectedSlide();
  this.element.removeChild( this.viewport );
  // move child elements back into element
  moveElements( this.slider.children, this.element );
  if ( this.options.accessibility ) {
    this.element.removeAttribute('tabIndex');
    this.element.removeEventListener( 'keydown', this );
  }
  // set flags
  this.isActive = false;
  this.emitEvent('deactivate');
};

proto.destroy = function() {
  this.deactivate();
  window.removeEventListener( 'resize', this );
  this.emitEvent('destroy');
  if ( jQuery && this.$element ) {
    jQuery.removeData( this.element, 'flickity' );
  }
  delete this.element.flickityGUID;
  delete instances[ this.guid ];
};

// -------------------------- prototype -------------------------- //

utils.extend( proto, animatePrototype );

// -------------------------- extras -------------------------- //

/**
 * get Flickity instance from element
 * @param {Element} elem
 * @returns {Flickity}
 */
Flickity.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.flickityGUID;
  return id && instances[ id ];
};

utils.htmlInit( Flickity, 'flickity' );

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'flickity', Flickity );
}

Flickity.Cell = Cell;

return Flickity;

}));

},{"./animate":5,"./cell":6,"./slide":14,"ev-emitter":2,"fizzy-ui-utils":3,"get-size":15}],9:[function(require,module,exports){
/*!
 * Flickity v2.0.5
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://flickity.metafizzy.co
 * Copyright 2016 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      './drag',
      './prev-next-button',
      './page-dots',
      './player',
      './add-remove-cell',
      './lazyload'
    ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('./flickity'),
      require('./drag'),
      require('./prev-next-button'),
      require('./page-dots'),
      require('./player'),
      require('./add-remove-cell'),
      require('./lazyload')
    );
  }

})( window, function factory( Flickity ) {
  /*jshint strict: false*/
  return Flickity;
});

},{"./add-remove-cell":4,"./drag":7,"./flickity":8,"./lazyload":10,"./page-dots":11,"./player":12,"./prev-next-button":13}],10:[function(require,module,exports){
// lazyload
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'fizzy-ui-utils/utils'
    ], function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, utils ) {
'use strict';

Flickity.createMethods.push('_createLazyload');
var proto = Flickity.prototype;

proto._createLazyload = function() {
  this.on( 'select', this.lazyLoad );
};

proto.lazyLoad = function() {
  var lazyLoad = this.options.lazyLoad;
  if ( !lazyLoad ) {
    return;
  }
  // get adjacent cells, use lazyLoad option for adjacent count
  var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
  var cellElems = this.getAdjacentCellElements( adjCount );
  // get lazy images in those cells
  var lazyImages = [];
  cellElems.forEach( function( cellElem ) {
    var lazyCellImages = getCellLazyImages( cellElem );
    lazyImages = lazyImages.concat( lazyCellImages );
  });
  // load lazy images
  lazyImages.forEach( function( img ) {
    new LazyLoader( img, this );
  }, this );
};

function getCellLazyImages( cellElem ) {
  // check if cell element is lazy image
  if ( cellElem.nodeName == 'IMG' &&
    cellElem.getAttribute('data-flickity-lazyload') ) {
    return [ cellElem ];
  }
  // select lazy images in cell
  var imgs = cellElem.querySelectorAll('img[data-flickity-lazyload]');
  return utils.makeArray( imgs );
}

// -------------------------- LazyLoader -------------------------- //

/**
 * class to handle loading images
 */
function LazyLoader( img, flickity ) {
  this.img = img;
  this.flickity = flickity;
  this.load();
}

LazyLoader.prototype.handleEvent = utils.handleEvent;

LazyLoader.prototype.load = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  // load image
  this.img.src = this.img.getAttribute('data-flickity-lazyload');
  // remove attr
  this.img.removeAttribute('data-flickity-lazyload');
};

LazyLoader.prototype.onload = function( event ) {
  this.complete( event, 'flickity-lazyloaded' );
};

LazyLoader.prototype.onerror = function( event ) {
  this.complete( event, 'flickity-lazyerror' );
};

LazyLoader.prototype.complete = function( event, className ) {
  // unbind events
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );

  var cell = this.flickity.getParentCell( this.img );
  var cellElem = cell && cell.element;
  this.flickity.cellSizeChange( cellElem );

  this.img.classList.add( className );
  this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
};

// -----  ----- //

Flickity.LazyLoader = LazyLoader;

return Flickity;

}));

},{"./flickity":8,"fizzy-ui-utils":3}],11:[function(require,module,exports){
// page dots
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'tap-listener/tap-listener',
      'fizzy-ui-utils/utils'
    ], function( Flickity, TapListener, utils ) {
      return factory( window, Flickity, TapListener, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('tap-listener'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.TapListener,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, TapListener, utils ) {

// -------------------------- PageDots -------------------------- //

'use strict';

function PageDots( parent ) {
  this.parent = parent;
  this._create();
}

PageDots.prototype = new TapListener();

PageDots.prototype._create = function() {
  // create holder element
  this.holder = document.createElement('ol');
  this.holder.className = 'flickity-page-dots';
  // create dots, array of elements
  this.dots = [];
  // events
  this.on( 'tap', this.onTap );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PageDots.prototype.activate = function() {
  this.setDots();
  this.bindTap( this.holder );
  // add to DOM
  this.parent.element.appendChild( this.holder );
};

PageDots.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.holder );
  TapListener.prototype.destroy.call( this );
};

PageDots.prototype.setDots = function() {
  // get difference between number of slides and number of dots
  var delta = this.parent.slides.length - this.dots.length;
  if ( delta > 0 ) {
    this.addDots( delta );
  } else if ( delta < 0 ) {
    this.removeDots( -delta );
  }
};

PageDots.prototype.addDots = function( count ) {
  var fragment = document.createDocumentFragment();
  var newDots = [];
  while ( count ) {
    var dot = document.createElement('li');
    dot.className = 'dot';
    fragment.appendChild( dot );
    newDots.push( dot );
    count--;
  }
  this.holder.appendChild( fragment );
  this.dots = this.dots.concat( newDots );
};

PageDots.prototype.removeDots = function( count ) {
  // remove from this.dots collection
  var removeDots = this.dots.splice( this.dots.length - count, count );
  // remove from DOM
  removeDots.forEach( function( dot ) {
    this.holder.removeChild( dot );
  }, this );
};

PageDots.prototype.updateSelected = function() {
  // remove selected class on previous
  if ( this.selectedDot ) {
    this.selectedDot.className = 'dot';
  }
  // don't proceed if no dots
  if ( !this.dots.length ) {
    return;
  }
  this.selectedDot = this.dots[ this.parent.selectedIndex ];
  this.selectedDot.className = 'dot is-selected';
};

PageDots.prototype.onTap = function( event ) {
  var target = event.target;
  // only care about dot clicks
  if ( target.nodeName != 'LI' ) {
    return;
  }

  this.parent.uiChange();
  var index = this.dots.indexOf( target );
  this.parent.select( index );
};

PageDots.prototype.destroy = function() {
  this.deactivate();
};

Flickity.PageDots = PageDots;

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pageDots: true
});

Flickity.createMethods.push('_createPageDots');

var proto = Flickity.prototype;

proto._createPageDots = function() {
  if ( !this.options.pageDots ) {
    return;
  }
  this.pageDots = new PageDots( this );
  // events
  this.on( 'activate', this.activatePageDots );
  this.on( 'select', this.updateSelectedPageDots );
  this.on( 'cellChange', this.updatePageDots );
  this.on( 'resize', this.updatePageDots );
  this.on( 'deactivate', this.deactivatePageDots );
};

proto.activatePageDots = function() {
  this.pageDots.activate();
};

proto.updateSelectedPageDots = function() {
  this.pageDots.updateSelected();
};

proto.updatePageDots = function() {
  this.pageDots.setDots();
};

proto.deactivatePageDots = function() {
  this.pageDots.deactivate();
};

// -----  ----- //

Flickity.PageDots = PageDots;

return Flickity;

}));

},{"./flickity":8,"fizzy-ui-utils":3,"tap-listener":20}],12:[function(require,module,exports){
// player & autoPlay
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter',
      'fizzy-ui-utils/utils',
      './flickity'
    ], function( EvEmitter, utils, Flickity ) {
      return factory( EvEmitter, utils, Flickity );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('ev-emitter'),
      require('fizzy-ui-utils'),
      require('./flickity')
    );
  } else {
    // browser global
    factory(
      window.EvEmitter,
      window.fizzyUIUtils,
      window.Flickity
    );
  }

}( window, function factory( EvEmitter, utils, Flickity ) {

'use strict';

// -------------------------- Page Visibility -------------------------- //
// https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API

var hiddenProperty, visibilityEvent;
if ( 'hidden' in document ) {
  hiddenProperty = 'hidden';
  visibilityEvent = 'visibilitychange';
} else if ( 'webkitHidden' in document ) {
  hiddenProperty = 'webkitHidden';
  visibilityEvent = 'webkitvisibilitychange';
}

// -------------------------- Player -------------------------- //

function Player( parent ) {
  this.parent = parent;
  this.state = 'stopped';
  // visibility change event handler
  if ( visibilityEvent ) {
    this.onVisibilityChange = function() {
      this.visibilityChange();
    }.bind( this );
    this.onVisibilityPlay = function() {
      this.visibilityPlay();
    }.bind( this );
  }
}

Player.prototype = Object.create( EvEmitter.prototype );

// start play
Player.prototype.play = function() {
  if ( this.state == 'playing' ) {
    return;
  }
  // do not play if page is hidden, start playing when page is visible
  var isPageHidden = document[ hiddenProperty ];
  if ( visibilityEvent && isPageHidden ) {
    document.addEventListener( visibilityEvent, this.onVisibilityPlay );
    return;
  }

  this.state = 'playing';
  // listen to visibility change
  if ( visibilityEvent ) {
    document.addEventListener( visibilityEvent, this.onVisibilityChange );
  }
  // start ticking
  this.tick();
};

Player.prototype.tick = function() {
  // do not tick if not playing
  if ( this.state != 'playing' ) {
    return;
  }

  var time = this.parent.options.autoPlay;
  // default to 3 seconds
  time = typeof time == 'number' ? time : 3000;
  var _this = this;
  // HACK: reset ticks if stopped and started within interval
  this.clear();
  this.timeout = setTimeout( function() {
    _this.parent.next( true );
    _this.tick();
  }, time );
};

Player.prototype.stop = function() {
  this.state = 'stopped';
  this.clear();
  // remove visibility change event
  if ( visibilityEvent ) {
    document.removeEventListener( visibilityEvent, this.onVisibilityChange );
  }
};

Player.prototype.clear = function() {
  clearTimeout( this.timeout );
};

Player.prototype.pause = function() {
  if ( this.state == 'playing' ) {
    this.state = 'paused';
    this.clear();
  }
};

Player.prototype.unpause = function() {
  // re-start play if paused
  if ( this.state == 'paused' ) {
    this.play();
  }
};

// pause if page visibility is hidden, unpause if visible
Player.prototype.visibilityChange = function() {
  var isPageHidden = document[ hiddenProperty ];
  this[ isPageHidden ? 'pause' : 'unpause' ]();
};

Player.prototype.visibilityPlay = function() {
  this.play();
  document.removeEventListener( visibilityEvent, this.onVisibilityPlay );
};

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pauseAutoPlayOnHover: true
});

Flickity.createMethods.push('_createPlayer');
var proto = Flickity.prototype;

proto._createPlayer = function() {
  this.player = new Player( this );

  this.on( 'activate', this.activatePlayer );
  this.on( 'uiChange', this.stopPlayer );
  this.on( 'pointerDown', this.stopPlayer );
  this.on( 'deactivate', this.deactivatePlayer );
};

proto.activatePlayer = function() {
  if ( !this.options.autoPlay ) {
    return;
  }
  this.player.play();
  this.element.addEventListener( 'mouseenter', this );
};

// Player API, don't hate the ... thanks I know where the door is

proto.playPlayer = function() {
  this.player.play();
};

proto.stopPlayer = function() {
  this.player.stop();
};

proto.pausePlayer = function() {
  this.player.pause();
};

proto.unpausePlayer = function() {
  this.player.unpause();
};

proto.deactivatePlayer = function() {
  this.player.stop();
  this.element.removeEventListener( 'mouseenter', this );
};

// ----- mouseenter/leave ----- //

// pause auto-play on hover
proto.onmouseenter = function() {
  if ( !this.options.pauseAutoPlayOnHover ) {
    return;
  }
  this.player.pause();
  this.element.addEventListener( 'mouseleave', this );
};

// resume auto-play on hover off
proto.onmouseleave = function() {
  this.player.unpause();
  this.element.removeEventListener( 'mouseleave', this );
};

// -----  ----- //

Flickity.Player = Player;

return Flickity;

}));

},{"./flickity":8,"ev-emitter":2,"fizzy-ui-utils":3}],13:[function(require,module,exports){
// prev/next buttons
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'tap-listener/tap-listener',
      'fizzy-ui-utils/utils'
    ], function( Flickity, TapListener, utils ) {
      return factory( window, Flickity, TapListener, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('tap-listener'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.TapListener,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, TapListener, utils ) {
'use strict';

var svgURI = 'http://www.w3.org/2000/svg';

// -------------------------- PrevNextButton -------------------------- //

function PrevNextButton( direction, parent ) {
  this.direction = direction;
  this.parent = parent;
  this._create();
}

PrevNextButton.prototype = new TapListener();

PrevNextButton.prototype._create = function() {
  // properties
  this.isEnabled = true;
  this.isPrevious = this.direction == -1;
  var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
  this.isLeft = this.direction == leftDirection;

  var element = this.element = document.createElement('button');
  element.className = 'flickity-prev-next-button';
  element.className += this.isPrevious ? ' previous' : ' next';
  // prevent button from submitting form http://stackoverflow.com/a/10836076/182183
  element.setAttribute( 'type', 'button' );
  // init as disabled
  this.disable();

  element.setAttribute( 'aria-label', this.isPrevious ? 'previous' : 'next' );

  // create arrow
  var svg = this.createSVG();
  element.appendChild( svg );
  // events
  this.on( 'tap', this.onTap );
  this.parent.on( 'select', this.update.bind( this ) );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PrevNextButton.prototype.activate = function() {
  this.bindTap( this.element );
  // click events from keyboard
  this.element.addEventListener( 'click', this );
  // add to DOM
  this.parent.element.appendChild( this.element );
};

PrevNextButton.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.element );
  // do regular TapListener destroy
  TapListener.prototype.destroy.call( this );
  // click events from keyboard
  this.element.removeEventListener( 'click', this );
};

PrevNextButton.prototype.createSVG = function() {
  var svg = document.createElementNS( svgURI, 'svg');
  svg.setAttribute( 'viewBox', '0 0 100 100' );
  var path = document.createElementNS( svgURI, 'path');
  var pathMovements = getArrowMovements( this.parent.options.arrowShape );
  path.setAttribute( 'd', pathMovements );
  path.setAttribute( 'class', 'arrow' );
  // rotate arrow
  if ( !this.isLeft ) {
    path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
  }
  svg.appendChild( path );
  return svg;
};

// get SVG path movmement
function getArrowMovements( shape ) {
  // use shape as movement if string
  if ( typeof shape == 'string' ) {
    return shape;
  }
  // create movement string
  return 'M ' + shape.x0 + ',50' +
    ' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
    ' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
    ' L ' + shape.x3 + ',50 ' +
    ' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
    ' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
    ' Z';
}

PrevNextButton.prototype.onTap = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.parent.uiChange();
  var method = this.isPrevious ? 'previous' : 'next';
  this.parent[ method ]();
};

PrevNextButton.prototype.handleEvent = utils.handleEvent;

PrevNextButton.prototype.onclick = function() {
  // only allow clicks from keyboard
  var focused = document.activeElement;
  if ( focused && focused == this.element ) {
    this.onTap();
  }
};

// -----  ----- //

PrevNextButton.prototype.enable = function() {
  if ( this.isEnabled ) {
    return;
  }
  this.element.disabled = false;
  this.isEnabled = true;
};

PrevNextButton.prototype.disable = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.element.disabled = true;
  this.isEnabled = false;
};

PrevNextButton.prototype.update = function() {
  // index of first or last slide, if previous or next
  var slides = this.parent.slides;
  // enable is wrapAround and at least 2 slides
  if ( this.parent.options.wrapAround && slides.length > 1 ) {
    this.enable();
    return;
  }
  var lastIndex = slides.length ? slides.length - 1 : 0;
  var boundIndex = this.isPrevious ? 0 : lastIndex;
  var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
  this[ method ]();
};

PrevNextButton.prototype.destroy = function() {
  this.deactivate();
};

// -------------------------- Flickity prototype -------------------------- //

utils.extend( Flickity.defaults, {
  prevNextButtons: true,
  arrowShape: {
    x0: 10,
    x1: 60, y1: 50,
    x2: 70, y2: 40,
    x3: 30
  }
});

Flickity.createMethods.push('_createPrevNextButtons');
var proto = Flickity.prototype;

proto._createPrevNextButtons = function() {
  if ( !this.options.prevNextButtons ) {
    return;
  }

  this.prevButton = new PrevNextButton( -1, this );
  this.nextButton = new PrevNextButton( 1, this );

  this.on( 'activate', this.activatePrevNextButtons );
};

proto.activatePrevNextButtons = function() {
  this.prevButton.activate();
  this.nextButton.activate();
  this.on( 'deactivate', this.deactivatePrevNextButtons );
};

proto.deactivatePrevNextButtons = function() {
  this.prevButton.deactivate();
  this.nextButton.deactivate();
  this.off( 'deactivate', this.deactivatePrevNextButtons );
};

// --------------------------  -------------------------- //

Flickity.PrevNextButton = PrevNextButton;

return Flickity;

}));

},{"./flickity":8,"fizzy-ui-utils":3,"tap-listener":20}],14:[function(require,module,exports){
// slide
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.Slide = factory();
  }

}( window, function factory() {
'use strict';

function Slide( parent ) {
  this.parent = parent;
  this.isOriginLeft = parent.originSide == 'left';
  this.cells = [];
  this.outerWidth = 0;
  this.height = 0;
}

var proto = Slide.prototype;

proto.addCell = function( cell ) {
  this.cells.push( cell );
  this.outerWidth += cell.size.outerWidth;
  this.height = Math.max( cell.size.outerHeight, this.height );
  // first cell stuff
  if ( this.cells.length == 1 ) {
    this.x = cell.x; // x comes from first cell
    var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
    this.firstMargin = cell.size[ beginMargin ];
  }
};

proto.updateTarget = function() {
  var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
  var lastCell = this.getLastCell();
  var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
  var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
  this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.select = function() {
  this.changeSelectedClass('add');
};

proto.unselect = function() {
  this.changeSelectedClass('remove');
};

proto.changeSelectedClass = function( method ) {
  this.cells.forEach( function( cell ) {
    cell.element.classList[ method ]('is-selected');
  });
};

proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

return Slide;

}));

},{}],15:[function(require,module,exports){
/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false, console: false */

( function( window, factory ) {
  'use strict';

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function() {
      return factory();
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }

})( window, function factory() {
'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See http://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );

  getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize( style.width ) == 200;
  body.removeChild( div );

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});

},{}],16:[function(require,module,exports){
function hidePlaceholderOnFocus(a){target=a.currentTarget?a.currentTarget:a.srcElement,target.value==target.getAttribute("placeholder")&&(target.value="")}function unfocusOnAnElement(a){target=a.currentTarget?a.currentTarget:a.srcElement,""==target.value&&(target.value=target.getAttribute("placeholder"))}if(!("placeholder"in document.createElement("input")))for(var inputs=document.getElementsByTagName("input"),i=0;i<inputs.length;i++)inputs[i].value||(inputs[i].value=inputs[i].getAttribute("placeholder")),inputs[i].addEventListener?(inputs[i].addEventListener("click",hidePlaceholderOnFocus,!1),inputs[i].addEventListener("blur",unfocusOnAnElement,!1)):inputs[i].attachEvent&&(inputs[i].attachEvent("onclick",hidePlaceholderOnFocus),inputs[i].attachEvent("onblur",unfocusOnAnElement));
},{}],17:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],18:[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],19:[function(require,module,exports){
(function (global){
/*! smooth-scroll v10.2.1 | (c) 2016 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/smooth-scroll */
!(function(e,t){"function"==typeof define&&define.amd?define([],t(e)):"object"==typeof exports?module.exports=t(e):e.smoothScroll=t(e)})("undefined"!=typeof global?global:this.window||this.global,(function(e){"use strict";var t,n,o,r,a,c,l,i={},u="querySelector"in document&&"addEventListener"in e,s={selector:"[data-scroll]",selectorHeader:null,speed:500,easing:"easeInOutCubic",offset:0,callback:function(){}},d=function(){var e={},t=!1,n=0,o=arguments.length;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(t=arguments[0],n++);for(var r=function(n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t&&"[object Object]"===Object.prototype.toString.call(n[o])?e[o]=d(!0,e[o],n[o]):e[o]=n[o])};n<o;n++){var a=arguments[n];r(a)}return e},f=function(e){return Math.max(e.scrollHeight,e.offsetHeight,e.clientHeight)},h=function(e,t){for(Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(e){for(var t=(this.document||this.ownerDocument).querySelectorAll(e),n=t.length;--n>=0&&t.item(n)!==this;);return n>-1});e&&e!==document;e=e.parentNode)if(e.matches(t))return e;return null},m=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,n=String(e),o=n.length,r=-1,a="",c=n.charCodeAt(0);++r<o;){if(t=n.charCodeAt(r),0===t)throw new InvalidCharacterError("Invalid character: the input contains U+0000.");a+=t>=1&&t<=31||127==t||0===r&&t>=48&&t<=57||1===r&&t>=48&&t<=57&&45===c?"\\"+t.toString(16)+" ":t>=128||45===t||95===t||t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122?n.charAt(r):"\\"+n.charAt(r)}return"#"+a},p=function(e,t){var n;return"easeInQuad"===e&&(n=t*t),"easeOutQuad"===e&&(n=t*(2-t)),"easeInOutQuad"===e&&(n=t<.5?2*t*t:-1+(4-2*t)*t),"easeInCubic"===e&&(n=t*t*t),"easeOutCubic"===e&&(n=--t*t*t+1),"easeInOutCubic"===e&&(n=t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1),"easeInQuart"===e&&(n=t*t*t*t),"easeOutQuart"===e&&(n=1- --t*t*t*t),"easeInOutQuart"===e&&(n=t<.5?8*t*t*t*t:1-8*--t*t*t*t),"easeInQuint"===e&&(n=t*t*t*t*t),"easeOutQuint"===e&&(n=1+--t*t*t*t*t),"easeInOutQuint"===e&&(n=t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t),n||t},g=function(e,t,n){var o=0;if(e.offsetParent)do o+=e.offsetTop,e=e.offsetParent;while(e);return o=Math.max(o-t-n,0),Math.min(o,v()-b())},b=function(){return Math.max(document.documentElement.clientHeight,e.innerHeight||0)},v=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},y=function(e){return e&&"object"==typeof JSON&&"function"==typeof JSON.parse?JSON.parse(e):{}},O=function(e){return e?f(e)+e.offsetTop:0},S=function(t,n,o){o||(t.focus(),document.activeElement.id!==t.id&&(t.setAttribute("tabindex","-1"),t.focus(),t.style.outline="none"),e.scrollTo(0,n))};i.animateScroll=function(n,o,c){var i=y(o?o.getAttribute("data-options"):null),u=d(t||s,c||{},i),f="[object Number]"===Object.prototype.toString.call(n),h=f||!n.tagName?null:n;if(f||h){var m=e.pageYOffset;u.selectorHeader&&!r&&(r=document.querySelector(u.selectorHeader)),a||(a=O(r));var b,E,I=f?n:g(h,a,parseInt(u.offset,10)),H=I-m,A=v(),j=0,C=function(t,r,a){var c=e.pageYOffset;(t==r||c==r||e.innerHeight+c>=A)&&(clearInterval(a),S(n,r,f),u.callback(n,o))},M=function(){j+=16,b=j/parseInt(u.speed,10),b=b>1?1:b,E=m+H*p(u.easing,b),e.scrollTo(0,Math.floor(E)),C(E,I,l)},w=function(){clearInterval(l),l=setInterval(M,16)};0===e.pageYOffset&&e.scrollTo(0,0),w()}};var E=function(t){var r;try{r=m(decodeURIComponent(e.location.hash))}catch(t){r=m(e.location.hash)}n&&(n.id=n.getAttribute("data-scroll-id"),i.animateScroll(n,o),n=null,o=null)},I=function(r){if(0===r.button&&!r.metaKey&&!r.ctrlKey&&(o=h(r.target,t.selector),o&&"a"===o.tagName.toLowerCase()&&o.hostname===e.location.hostname&&o.pathname===e.location.pathname&&/#/.test(o.href))){var a;try{a=m(decodeURIComponent(o.hash))}catch(e){a=m(o.hash)}if("#"===a){r.preventDefault(),n=document.body;var c=n.id?n.id:"smooth-scroll-top";return n.setAttribute("data-scroll-id",c),n.id="",void(e.location.hash.substring(1)===c?E():e.location.hash=c)}n=document.querySelector(a),n&&(n.setAttribute("data-scroll-id",n.id),n.id="",o.hash===e.location.hash&&(r.preventDefault(),E()))}},H=function(e){c||(c=setTimeout((function(){c=null,a=O(r)}),66))};return i.destroy=function(){t&&(document.removeEventListener("click",I,!1),e.removeEventListener("resize",H,!1),t=null,n=null,o=null,r=null,a=null,c=null,l=null)},i.init=function(n){u&&(i.destroy(),t=d(s,n||{}),r=t.selectorHeader?document.querySelector(t.selectorHeader):null,a=O(r),document.addEventListener("click",I,!1),e.addEventListener("hashchange",E,!1),r&&e.addEventListener("resize",H,!1))},i}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],20:[function(require,module,exports){
/*!
 * Tap listener v2.0.0
 * listens to taps
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false*/ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'unipointer/unipointer'
    ], function( Unipointer ) {
      return factory( window, Unipointer );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('unipointer')
    );
  } else {
    // browser global
    window.TapListener = factory(
      window,
      window.Unipointer
    );
  }

}( window, function factory( window, Unipointer ) {

'use strict';

// --------------------------  TapListener -------------------------- //

function TapListener( elem ) {
  this.bindTap( elem );
}

// inherit Unipointer & EventEmitter
var proto = TapListener.prototype = Object.create( Unipointer.prototype );

/**
 * bind tap event to element
 * @param {Element} elem
 */
proto.bindTap = function( elem ) {
  if ( !elem ) {
    return;
  }
  this.unbindTap();
  this.tapElement = elem;
  this._bindStartEvent( elem, true );
};

proto.unbindTap = function() {
  if ( !this.tapElement ) {
    return;
  }
  this._bindStartEvent( this.tapElement, true );
  delete this.tapElement;
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  var pointerPoint = Unipointer.getPointerPoint( pointer );
  var boundingRect = this.tapElement.getBoundingClientRect();
  var scrollX = window.pageXOffset;
  var scrollY = window.pageYOffset;
  // calculate if pointer is inside tapElement
  var isInside = pointerPoint.x >= boundingRect.left + scrollX &&
    pointerPoint.x <= boundingRect.right + scrollX &&
    pointerPoint.y >= boundingRect.top + scrollY &&
    pointerPoint.y <= boundingRect.bottom + scrollY;
  // trigger callback if pointer is inside element
  if ( isInside ) {
    this.emitEvent( 'tap', [ event, pointer ] );
  }

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    var _this = this;
    setTimeout( function() {
      delete _this.isIgnoringMouseUp;
    }, 400 );
  }
};

proto.destroy = function() {
  this.pointerDone();
  this.unbindTap();
};

// -----  ----- //

return TapListener;

}));

},{"unipointer":22}],21:[function(require,module,exports){
/*!
 * Unidragger v2.1.0
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'unipointer/unipointer'
    ], function( Unipointer ) {
      return factory( window, Unipointer );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('unipointer')
    );
  } else {
    // browser global
    window.Unidragger = factory(
      window,
      window.Unipointer
    );
  }

}( window, function factory( window, Unipointer ) {

'use strict';

// -----  ----- //

function noop() {}

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EvEmitter
var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

// ----- bind start ----- //

proto.bindHandles = function() {
  this._bindHandles( true );
};

proto.unbindHandles = function() {
  this._bindHandles( false );
};

var navigator = window.navigator;
/**
 * works as unbinder, as you can .bindHandles( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
proto._bindHandles = function( isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  // extra bind logic
  var binderExtra;
  if ( navigator.pointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.touchAction = isBind ? 'none' : '';
    };
  } else if ( navigator.msPointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.msTouchAction = isBind ? 'none' : '';
    };
  } else {
    binderExtra = noop;
  }
  // bind each handle
  var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
  for ( var i=0; i < this.handles.length; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isBind );
    binderExtra( handle );
    handle[ bindMethod ]( 'click', this );
  }
};

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerDown = function( event, pointer ) {
  // dismiss range sliders
  if ( event.target.nodeName == 'INPUT' && event.target.type == 'range' ) {
    // reset pointerDown logic
    this.isPointerDown = false;
    delete this.pointerIdentifier;
    return;
  }

  this._dragPointerDown( event, pointer );
  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur ) {
    focused.blur();
  }
  // bind move and end events
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// base pointer down logic
proto._dragPointerDown = function( event, pointer ) {
  // track to see when dragging starts
  this.pointerDownPoint = Unipointer.getPointerPoint( pointer );

  var canPreventDefault = this.canPreventDefaultOnPointerDown( event, pointer );
  if ( canPreventDefault ) {
    event.preventDefault();
  }
};

// overwriteable method so Flickity can prevent for scrolling
proto.canPreventDefaultOnPointerDown = function( event ) {
  // prevent default, unless touchstart or <select>
  return event.target.nodeName != 'SELECT';
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
proto._dragPointerMove = function( event, pointer ) {
  var movePoint = Unipointer.getPointerPoint( pointer );
  var moveVector = {
    x: movePoint.x - this.pointerDownPoint.x,
    y: movePoint.y - this.pointerDownPoint.y
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};


// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

proto._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

// -------------------------- drag -------------------------- //

// dragStart
proto._dragStart = function( event, pointer ) {
  this.isDragging = true;
  this.dragStartPoint = Unipointer.getPointerPoint( pointer );
  // prevent clicks
  this.isPreventingClicks = true;

  this.dragStart( event, pointer );
};

proto.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
proto._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
proto._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  setTimeout( function() {
    delete this.isPreventingClicks;
  }.bind( this ) );

  this.dragEnd( event, pointer );
};

proto.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
proto.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    event.preventDefault();
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
proto._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  // allow click in <input>s and <textarea>s
  var nodeName = event.target.nodeName;
  if ( nodeName == 'INPUT' || nodeName == 'TEXTAREA' ) {
    event.target.focus();
  }
  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    setTimeout( function() {
      delete this.isIgnoringMouseUp;
    }.bind( this ), 400 );
  }
};

proto.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- utils ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

// -----  ----- //

return Unidragger;

}));

},{"unipointer":22}],22:[function(require,module,exports){
/*!
 * Unipointer v2.1.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.Unipointer = factory(
      window,
      window.EvEmitter
    );
  }

}( window, function factory( window, EvEmitter ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EvEmitter
var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

proto.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

proto.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * works as unbinder, as you can ._bindStart( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
proto._bindStartEvent = function( elem, isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';

  if ( window.navigator.pointerEnabled ) {
    // W3C Pointer Events, IE11. See https://coderwall.com/p/mfreca
    elem[ bindMethod ]( 'pointerdown', this );
  } else if ( window.navigator.msPointerEnabled ) {
    // IE10 Pointer Events
    elem[ bindMethod ]( 'MSPointerDown', this );
  } else {
    // listen for both, for devices like Chrome Pixel
    elem[ bindMethod ]( 'mousedown', this );
    elem[ bindMethod ]( 'touchstart', this );
  }
};

// trigger handler methods for events
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
proto.getTouch = function( touches ) {
  for ( var i=0; i < touches.length; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

proto.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

proto.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

proto.onMSPointerDown =
proto.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto._pointerDown = function( event, pointer ) {
  // dismiss other pointers
  if ( this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

proto.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
  MSPointerDown: [ 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel' ]
};

proto._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // bind events to node
  events.forEach( function( eventName ) {
    window.addEventListener( eventName, this );
  }, this );
  // save these arguments
  this._boundPointerEvents = events;
};

proto._unbindPostStartEvents = function() {
  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
  if ( !this._boundPointerEvents ) {
    return;
  }
  this._boundPointerEvents.forEach( function( eventName ) {
    window.removeEventListener( eventName, this );
  }, this );

  delete this._boundPointerEvents;
};

// ----- move event ----- //

proto.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

proto.onMSPointerMove =
proto.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

proto.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
proto.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


proto.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

proto.onMSPointerUp =
proto.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

proto.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
proto._pointerDone = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
  // remove events
  this._unbindPostStartEvents();
  this.pointerDone();
};

proto.pointerDone = noop;

// ----- pointer cancel ----- //

proto.onMSPointerCancel =
proto.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

proto.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
proto.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y coords from event
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX,
    y: pointer.pageY
  };
};

// -----  ----- //

return Unipointer;

}));

},{"ev-emitter":2}],23:[function(require,module,exports){
/*!
 * viewport-units-buggyfill v0.6.0
 * @web: https://github.com/rodneyrehm/viewport-units-buggyfill/
 * @author: Rodney Rehm - http://rodneyrehm.de/en/
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.viewportUnitsBuggyfill = factory();
  }
}(this, function () {
  'use strict';
  /*global document, window, navigator, location, XMLHttpRequest, XDomainRequest, CustomEvent*/

  var initialized = false;
  var options;
  var userAgent = window.navigator.userAgent;
  var viewportUnitExpression = /([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g;
  var forEach = [].forEach;
  var dimensions;
  var declarations;
  var styleNode;
  var isBuggyIE = /MSIE [0-9]\./i.test(userAgent);
  var isOldIE = /MSIE [0-8]\./i.test(userAgent);
  var isOperaMini = userAgent.indexOf('Opera Mini') > -1;

  var isMobileSafari = /(iPhone|iPod|iPad).+AppleWebKit/i.test(userAgent) && (function() {
    // Regexp for iOS-version tested against the following userAgent strings:
    // Example WebView UserAgents:
    // * iOS Chrome on iOS8: "Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/39.0.2171.50 Mobile/12B410 Safari/600.1.4"
    // * iOS Facebook on iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201 [FBAN/FBIOS;FBAV/12.1.0.24.20; FBBV/3214247; FBDV/iPhone6,1;FBMD/iPhone; FBSN/iPhone OS;FBSV/7.1.1; FBSS/2; FBCR/AT&T;FBID/phone;FBLC/en_US;FBOP/5]"
    // Example Safari UserAgents:
    // * Safari iOS8: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
    // * Safari iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53"
    var iOSversion = userAgent.match(/OS (\d)/);
    // viewport units work fine in mobile Safari and webView on iOS 8+
    return iOSversion && iOSversion.length>1 && parseInt(iOSversion[1]) < 10;
  })();

  var isBadStockAndroid = (function() {
    // Android stock browser test derived from
    // http://stackoverflow.com/questions/24926221/distinguish-android-chrome-from-stock-browser-stock-browsers-user-agent-contai
    var isAndroid = userAgent.indexOf(' Android ') > -1;
    if (!isAndroid) {
      return false;
    }

    var isStockAndroid = userAgent.indexOf('Version/') > -1;
    if (!isStockAndroid) {
      return false;
    }

    var versionNumber = parseFloat((userAgent.match('Android ([0-9.]+)') || [])[1]);
    // anything below 4.4 uses WebKit without *any* viewport support,
    // 4.4 has issues with viewport units within calc()
    return versionNumber <= 4.4;
  })();

  // added check for IE10, IE11 and Edge < 20, since it *still* doesn't understand vmax
  // http://caniuse.com/#feat=viewport-units
  if (!isBuggyIE) {
    isBuggyIE = !!navigator.userAgent.match(/Trident.*rv[ :]*1[01]\.| Edge\/1\d\./);
  }

  // Polyfill for creating CustomEvents on IE9/10/11
  // from https://github.com/krambuhl/custom-event-polyfill
  try {
    new CustomEvent('test');
  } catch(e) {
    var CustomEvent = function(event, params) {
      var evt;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }

  // from http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function initialize(initOptions) {
    if (initialized) {
      return;
    }

    if (initOptions === true) {
      initOptions = {
        force: true
      };
    }

    options = initOptions || {};
    options.isMobileSafari = isMobileSafari;
    options.isBadStockAndroid = isBadStockAndroid;

    if (options.ignoreVmax && !options.force && !isOldIE) {
      // modern IE (10 and up) do not support vmin/vmax,
      // but chances are this unit is not even used, so
      // allow overwriting the "hacktivation"
      // https://github.com/rodneyrehm/viewport-units-buggyfill/issues/56
      isBuggyIE = false;
    }

    if (isOldIE || (!options.force && !isMobileSafari && !isBuggyIE && !isBadStockAndroid && !isOperaMini && (!options.hacks || !options.hacks.required(options)))) {
      // this buggyfill only applies to mobile safari, IE9-10 and the Stock Android Browser.
      if (window.console && isOldIE) {
        console.info('viewport-units-buggyfill requires a proper CSSOM and basic viewport unit support, which are not available in IE8 and below');
      }

      return {
        init: function () {}
      };
    }

    // fire a custom event that buggyfill was initialize
    window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-init'));

    options.hacks && options.hacks.initialize(options);

    initialized = true;
    styleNode = document.createElement('style');
    styleNode.id = 'patched-viewport';
    document.head.appendChild(styleNode);

    // Issue #6: Cross Origin Stylesheets are not accessible through CSSOM,
    // therefore download and inject them as <style> to circumvent SOP.
    importCrossOriginLinks(function() {
      var _refresh = debounce(refresh, options.refreshDebounceWait || 100);
      // doing a full refresh rather than updateStyles because an orientationchange
      // could activate different stylesheets
      window.addEventListener('orientationchange', _refresh, true);
      // orientationchange might have happened while in a different window
      window.addEventListener('pageshow', _refresh, true);

      if (options.force || isBuggyIE || inIframe()) {
        window.addEventListener('resize', _refresh, true);
        options._listeningToResize = true;
      }

      options.hacks && options.hacks.initializeEvents(options, refresh, _refresh);

      refresh();
    });
  }

  function updateStyles() {
    styleNode.textContent = getReplacedViewportUnits();
    // move to the end in case inline <style>s were added dynamically
    styleNode.parentNode.appendChild(styleNode);
    // fire a custom event that styles were updated
    window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-style'));
  }

  function refresh() {
    if (!initialized) {
      return;
    }

    findProperties();

    // iOS Safari will report window.innerWidth and .innerHeight as 0 unless a timeout is used here.
    // TODO: figure out WHY innerWidth === 0
    setTimeout(function() {
      updateStyles();
    }, 1);
  }
  
  // http://stackoverflow.com/a/23613052
  function processStylesheet(ss) {
    // cssRules respects same-origin policy, as per
    // https://code.google.com/p/chromium/issues/detail?id=49001#c10.
    try {
      if (!ss.cssRules) { return; }
    } catch(e) {
      if (e.name !== 'SecurityError') { throw e; }
      return;
    }
    // ss.cssRules is available, so proceed with desired operations.
    var rules = [];
    for (var i = 0; i < ss.cssRules.length; i++) {
      var rule = ss.cssRules[i];
      rules.push(rule);
    }
    return rules;
  }

  function findProperties() {
    declarations = [];
    forEach.call(document.styleSheets, function(sheet) {
      var cssRules = processStylesheet(sheet);

      if (!cssRules || sheet.ownerNode.id === 'patched-viewport' || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
        // skip entire sheet because no rules are present, it's supposed to be ignored or it's the target-element of the buggyfill
        return;
      }

      if (sheet.media && sheet.media.mediaText && window.matchMedia && !window.matchMedia(sheet.media.mediaText).matches) {
        // skip entire sheet because media attribute doesn't match
        return;
      }

      forEach.call(cssRules, findDeclarations);
    });

    return declarations;
  }

  function findDeclarations(rule) {
    if (rule.type === 7) {
      var value;

      // there may be a case where accessing cssText throws an error.
      // I could not reproduce this issue, but the worst that can happen
      // this way is an animation not running properly.
      // not awesome, but probably better than a script error
      // see https://github.com/rodneyrehm/viewport-units-buggyfill/issues/21
      try {
        value = rule.cssText;
      } catch(e) {
        return;
      }

      viewportUnitExpression.lastIndex = 0;
      if (viewportUnitExpression.test(value)) {
        // KeyframesRule does not have a CSS-PropertyName
        declarations.push([rule, null, value]);
        options.hacks && options.hacks.findDeclarations(declarations, rule, null, value);
      }

      return;
    }

    if (!rule.style) {
      if (!rule.cssRules) {
        return;
      }

      forEach.call(rule.cssRules, function(_rule) {
        findDeclarations(_rule);
      });

      return;
    }

    forEach.call(rule.style, function(name) {
      var value = rule.style.getPropertyValue(name);
      // preserve those !important rules
      if (rule.style.getPropertyPriority(name)) {
        value += ' !important';
      }

      viewportUnitExpression.lastIndex = 0;
      if (viewportUnitExpression.test(value)) {
        declarations.push([rule, name, value]);
        options.hacks && options.hacks.findDeclarations(declarations, rule, name, value);
      }
    });
  }

  function getReplacedViewportUnits() {
    dimensions = getViewport();

    var css = [];
    var buffer = [];
    var open;
    var close;

    declarations.forEach(function(item) {
      var _item = overwriteDeclaration.apply(null, item);
      var _open = _item.selector.length ? (_item.selector.join(' {\n') + ' {\n') : '';
      var _close = new Array(_item.selector.length + 1).join('\n}');

      if (!_open || _open !== open) {
        if (buffer.length) {
          css.push(open + buffer.join('\n') + close);
          buffer.length = 0;
        }

        if (_open) {
          open = _open;
          close = _close;
          buffer.push(_item.content);
        } else {
          css.push(_item.content);
          open = null;
          close = null;
        }

        return;
      }

      if (_open && !open) {
        open = _open;
        close = _close;
      }

      buffer.push(_item.content);
    });

    if (buffer.length) {
      css.push(open + buffer.join('\n') + close);
    }

    // Opera Mini messes up on the content hack (it replaces the DOM node's innerHTML with the value).
    // This fixes it. We test for Opera Mini only since it is the most expensive CSS selector
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
    if (isOperaMini) {
      css.push('* { content: normal !important; }');
    }

    return css.join('\n\n');
  }

  function overwriteDeclaration(rule, name, value) {
    var _value;
    var _selectors = [];

    _value = value.replace(viewportUnitExpression, replaceValues);

    if (options.hacks) {
      _value = options.hacks.overwriteDeclaration(rule, name, _value);
    }

    if (name) {
      // skipping KeyframesRule
      _selectors.push(rule.selectorText);
      _value = name + ': ' + _value + ';';
    }

    var _rule = rule.parentRule;
    while (_rule) {
      _selectors.unshift('@media ' + _rule.media.mediaText);
      _rule = _rule.parentRule;
    }

    return {
      selector: _selectors,
      content: _value
    };
  }

  function replaceValues(match, number, unit) {
    var _base = dimensions[unit];
    var _number = parseFloat(number) / 100;
    return (_number * _base) + 'px';
  }

  function getViewport() {
    var vh = window.innerHeight;
    var vw = window.innerWidth;

    return {
      vh: vh,
      vw: vw,
      vmax: Math.max(vw, vh),
      vmin: Math.min(vw, vh)
    };
  }

  function importCrossOriginLinks(next) {
    var _waiting = 0;
    var decrease = function() {
      _waiting--;
      if (!_waiting) {
        next();
      }
    };

    forEach.call(document.styleSheets, function(sheet) {
      if (!sheet.href || origin(sheet.href) === origin(location.href) || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
        // skip <style> and <link> from same origin or explicitly declared to ignore
        return;
      }

      _waiting++;
      convertLinkToStyle(sheet.ownerNode, decrease);
    });

    if (!_waiting) {
      next();
    }
  }

  function origin(url) {
    return url.slice(0, url.indexOf('/', url.indexOf('://') + 3));
  }

  function convertLinkToStyle(link, next) {
    getCors(link.href, function() {
      var style = document.createElement('style');
      style.media = link.media;
      style.setAttribute('data-href', link.href);
      style.textContent = this.responseText;
      link.parentNode.replaceChild(style, link);
      next();
    }, next);
  }

  function getCors(url, success, error) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open('GET', url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open('GET', url);
    } else {
      throw new Error('cross-domain XHR not supported');
    }

    xhr.onload = success;
    xhr.onerror = error;
    xhr.send();
    return xhr;
  }

  return {
    version: '0.6.0',
    findProperties: findProperties,
    getCss: getReplacedViewportUnits,
    init: initialize,
    refresh: refresh
  };

}));

},{}],24:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 * Event Bus
 *
 * Pub/Sub system for custom event communication between modules.
 *
 * Exports a single EventBus instace.
 *
 */

var topics = {};

var EventBus = {

  /**
   *
   * Subscribe to topic, passing a callback function
   *
   * @param {string} topic - event name to subscribe to
   * @param {function} listener - Callback function when event gets published
   *
   * @returns {object} Cancellable subscription object.
   * 
   */

  subscribe: function subscribe(topic, listener) {

    // Create the topic's object if not yet created
    if (!topics.hasOwnProperty(topic)) {
      topics[topic] = [];
    }

    // Add the listener to queue
    var index = topics[topic].push(listener) - 1;

    // Provide handle back for removal of topic
    return {
      remove: function remove() {
        delete topics[topic][index];
      }
    };
  },


  /**
   *
   * Trigger event
   *
   * @param {string} topic - event name to publish
   * @param {...*} args - Any number of custom data to be passed to the callback
   * 
   */

  publish: function publish(topic) {
    var _arguments = arguments;


    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if (!topics.hasOwnProperty(topic)) {
      return;
    }

    topics[topic].forEach(function (item) {
      item.apply(null, Array.prototype.slice.call(_arguments, 1));
    });
  }
};

exports.default = EventBus;

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customFileUpload = customFileUpload;
exports.ajaxSubmitGforms = ajaxSubmitGforms;
exports.newsletterMoveSubmit = newsletterMoveSubmit;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = false;

// Very Important
// Must ensure we are using the same jquery instance as Gforms
/**
 *
 * Forms
 *
 * Form presentational and behavioural scripts
 *
 * Uses global jQuery reference exposed by forms plugin
 *
 */

if (window.jQuery) {
  $ = window.jQuery;
}

var fileUploadLabelAttr = 'data-label-text';

function fileUploadOnChange(e, defaultLabel) {

  var $customLabel = $(e.currentTarget).parent().find('[' + fileUploadLabelAttr + ']');
  var val = e.currentTarget.value.replace('C:\\fakepath\\', '');

  $customLabel.text(val || defaultLabel);
}

/**
 *
 * Custom Mask for File Upload Inputs
 *
 */

function customFileUpload(input) {
  var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Choose file';


  if (!$) {
    return;
  }

  var $input = $(input);
  var $customLabel = $('<span ' + fileUploadLabelAttr + '>' + label + '</span>');

  $input.on('change', function (e) {
    return fileUploadOnChange(e, label);
  });

  $input.wrapAll('\n    <label for="' + input.id + '">\n    </label>\n  ').parent().prepend($customLabel);

  return {
    setLabelText: function setLabelText(label) {
      $customLabel.text(label);
      return this;
    },
    getLabelText: function getLabelText() {
      return $customLabel.text();
    }
  };
}

function getGformId(formEl) {
  return formEl.id.replace('gform_', '');
}

/**
 *
 * Submit Gravity Forms via AJAX
 *
 * In this function we also setup custom file upload inputs, see `customFileUpload`
 *
 * @param {string} selector jQuery selector for the forms to be submitted via AJAX
 *
 * @event 'form:submitting' - Fires when the user submits the form
 * @event 'form:submit-done' - Fires after Gravity Forms succesfully submits the form
 *
 */

function ajaxSubmitGforms(selector) {

  if (!$) {
    return;
  }

  $(document).on('gform_post_render', function (e, formId) {

    $('#gform_wrapper_' + formId).filter(function (i, el) {

      var hiddenIdField = el.querySelector('[name=gform_submit]');

      /**
       *
       * If using the 'Multiple Form Instance' plugin for Gforms,
       * it changes the DOM form ID's
       *
       * The caveat is that the initial 'gform_post_render' will
       * return a 'formId' equal to the actual form ID (usually a low digit
       * like 1, 2, 3), whereas subsequent `gform_post_render` (eg: after an ajax submit), return
       * the ID set by the 'Multiple Form Instance' plugin (which looks more like a large random
       * number, eg: 2108960147)
       *
       */

      // Check if the 'formID' matched the ID on the DOM element (used after an ajax submission)
      if (getGformId(el) == formId) {
        return el;
      }
      // otherwise, check agains the hidden field containing the actual form ID (used on initial render)
      else if (hiddenIdField && hiddenIdField.value == formId) {
          return el;
        }
    }).each(function (i, form) {

      var $form = $(form);
      var $wrapper = $form.closest('.gform_wrapper');

      $wrapper.removeClass('is-submitting');

      $form.find('[type=file]').each(function (i, input) {
        customFileUpload(input);
      });
    });
  });

  $(document).on('gform_confirmation_loaded', function (e, formId) {
    var $wrapper = $('#gform_wrapper_' + formId);
    $wrapper.removeClass('is-submitting');

    _EventBus2.default.publish('form:submit-done', $wrapper);
  });

  $(document).on('submit', selector, function (e) {

    var form = e.currentTarget;
    var formId = getGformId(form);
    var $wrapper = $('#gform_wrapper_' + formId);
    $wrapper.addClass('is-submitting');

    _EventBus2.default.publish('form:submitting', $wrapper);
  });
}

/**
 *
 * Reposition the form submit button, so that it's easier
 * to align with the the input field
 *
 */

function newsletterMoveSubmit(form) {
  if (!$) {
    return;
  }

  var $form = $(form);
  $form.find('[type=submit]').appendTo($form.find('.gform_body'));
}

},{"./EventBus":25}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windowLoaded = exports.windowScrolled = exports.windowResized = exports.keyDownEscape = undefined;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Global DOM Event Listeners, to be used in conjunction with the `EventBus`
 *
 */

var keyDownEscape = exports.keyDownEscape = 'keydown:escape';
var windowResized = exports.windowResized = 'window:resized';
var windowScrolled = exports.windowScrolled = 'window:scrolled';
var windowLoaded = exports.windowLoaded = 'window:loaded';

window.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case 27:
      _EventBus2.default.publish(keyDownEscape);
      break;
    default:
      break;
  }
});

window.addEventListener('resize', (0, _utils.debounce)(function () {
  _EventBus2.default.publish(windowResized);
}, 100));

window.addEventListener('scroll', function () {
  _EventBus2.default.publish(windowScrolled);
});

window.addEventListener('load', function () {
  _EventBus2.default.publish(windowLoaded);
});

},{"./EventBus":25,"./utils":34}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadScriptOnce = loadScriptOnce;
exports.loadOnce = loadOnce;
/**
 *
 * Load
 *
 * Requires the fetch API to be available
 * 
 */

/**
 *
 * Cache of promises of requested objects
 * 
 */

var requestedURLs = {};

/**
 *
 * Load a script only once, regardless if its requested multiple times.
 *
 * @param {string} src - Source URL
 *
 * @returns {object} promise object for that specific source
 *  
 */

function loadScriptOnce(src) {

  // Check if we've already requested this script
  if (src in requestedURLs) {

    // If so, return this script's promise
    return requestedURLs[src];
  }

  var s = document.createElement('script');

  s.type = 'text/javascript';
  s.async = true;
  s.src = src;

  var promise = new Promise(function (resolve, reject) {
    // Resolve the promise when the script has loaded.
    s.addEventListener('load', function (e) {
      resolve(e);
    }, false);
  });

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(s);

  // Store the promise, for next time this `src` is requested
  requestedURLs[src] = promise;

  // Return the promise
  return requestedURLs[src];
}

/**
 *
 * Load a URL only once, regardless if its requested multiple times.
 *
 * @param {string} url - Source URL
 *
 * @returns {object} promise object for that specific source
 *  
 */

function loadOnce(url, type) {

  // Check if we've already requested this script
  if (url in requestedURLs) {

    // If so, return this script's promise
    return requestedURLs[url];
  }

  var promise = fetch(url)
  // res.text() can only be called once,
  // it returns another promise
  .then(function (res) {
    return res.text();
  });

  // Store the promise, for next time this `url` is requested
  requestedURLs[url] = promise;

  // Return the promise
  return requestedURLs[url];
}

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModal = initModal;
exports.initVideoModal = initVideoModal;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _video = require('./video');

var _video2 = _interopRequireDefault(_video);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.querySelector('html'); /**
                                              *
                                              * Modal
                                              *
                                              * Toggleable modal panels
                                              *
                                              */

var ACTIVE_CLASS = 'is-active';
var TRANS_CLASS = 'is-transiting';

// Add a global class to the root element, for styling
rootEl.className += ' modal-root';

var modalProto = {

  isOpen: false,

  /**
   *
   * Open the modal
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  open: function open() {
    var els = this.els;


    els.map(function (el) {
      return el.classList.add(ACTIVE_CLASS, TRANS_CLASS);
    });

    this.isOpen = true;
    _EventBus2.default.publish('modal:open', this);
  },


  /**
   *
   * Close the modal
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  close: function close() {
    var els = this.els;


    els.map(function (el) {
      return el.classList.add(TRANS_CLASS);
    });
    els.map(function (el) {
      return el.classList.remove(ACTIVE_CLASS);
    });

    if (!(0, _utils.whichTransitionEnd)()) {
      els.map(function (el) {
        return el.classList.remove(TRANS_CLASS);
      });
    }

    this.isOpen = false;
    _EventBus2.default.publish('modal:close', this);
  },


  /**
   *
   * Toggle the modal open/close
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  toggle: function toggle() {

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
};

/**
 *
 * Instantiate the modal, adding click listeners to it's triggers,
 * as well as controls for closing it.
 *
 * @param {HTMLElement} modalEl - Modal DOM element
 * @param {object} config - Configuration object, with callbacks for the modals open/close events
 * @returns {object} instance - Modal instance
 */

function initModal(modalEl) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!modalEl || !modalEl.nodeType) {
    console.log('You must provide a DOM element to `initModal`');
    return false;
  }

  // Find the elements that toggles this modal
  var toggleEls = (0, _utils.collection)('[data-toggle-modal="#' + modalEl.id + '"]');
  var allEls = toggleEls.concat(modalEl, rootEl);
  var closeEls = (0, _utils.collection)(modalEl.querySelectorAll('[data-close-modal]'));

  // Create the modal instance object
  var instance = Object.create(modalProto);

  Object.assign(instance, {
    modalEl: modalEl,
    els: allEls
  });

  var options = Object.assign({}, {
    onOpen: function onOpen() {},
    onClose: function onClose() {}
  }, config);

  // Listen for toggle button clicks
  toggleEls.map(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      instance.toggle();
    });
  });

  // Esc Keydown
  document.addEventListener('keydown', function (e) {
    if (e.keyCode == 27 && instance.isOpen) {
      instance.close();
    }
  });

  // Listen for click to any elements that close the modal
  if (closeEls.length) {

    closeEls.map(function (el) {
      el.addEventListener('click', function (e) {
        if ((0, _utils.selectorMatches)(e.target, '[data-close-modal]') && instance.isOpen) {
          e.preventDefault();
          instance.close();
        }
      });
    });
  }

  // Listen for transition end to remove transition class
  modalEl.addEventListener((0, _utils.whichTransitionEnd)(), function (e) {
    if (e.target == modalEl) {
      instance.els.map(function (el) {
        return el.classList.remove(TRANS_CLASS);
      });
    }
  });

  // Subscribe this modal to it's open/close events
  _EventBus2.default.subscribe('modal:open', function (openedInstance) {
    if (instance == openedInstance) {
      options.onOpen(instance);
    }
  });

  _EventBus2.default.subscribe('modal:close', function (openedInstance) {
    if (instance == openedInstance) {
      options.onClose(instance);
    }
  });

  // Move the element to the end of the document (prevent any z-index issues)
  document.body.appendChild(modalEl);

  // Expose the modal instance controller
  return instance;
}

/**
 *
 * Create a modal with a video player inside
 *
 * @param {HTMLElement} modalEl - Modal DOM element
 * @param {string} playerSelector - Query selector for the player inside the modal
 * @param {object} config - Configuration object, used to override the default video modal behaviour
 * 
 * @returns {object} instance - Modal instance with an attached video service controller
 * 
 */

function initVideoModal(modalEl, playerSelector) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  if (!modalEl || !modalEl.nodeType) {
    console.log('You must provide a DOM element to `initVideoModal`');
    return false;
  }

  var playerEl = modalEl.querySelector(playerSelector);
  var service = (0, _video2.default)(playerEl);

  // By default, make the player play when the modal opens
  // And stop when it closes
  var options = Object.assign({}, {
    onOpen: function onOpen() {
      service.play();
    },
    onClose: function onClose() {
      service.stop();
    }
  }, config);

  var instance = initModal(modalEl, options);
  instance.service = service; // Assign the video service to the modal instance

  // Expose the modal instance controller
  return instance;
}

},{"./EventBus":25,"./utils":34,"./video":35}],30:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

function matchesIE() {
  return !!navigator.userAgent.match(/(?:ms|\()(ie)\s([\w\.]+)/i);
} /**
   *
   * Custom Modernizr Tests
   *
   */

function matchesIE11() {
  return !!navigator.userAgent.match(/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i);
}

Modernizr.addTest('ie', function () {
  return matchesIE11() || matchesIE();
});

Modernizr.addTest('ie11', matchesIE11);

Modernizr.addTest('mobile', _utils.isMobile);

},{"./utils":34}],31:[function(require,module,exports){
(function (global){
'use strict';

require('input-placeholder-polyfill');

var _viewportUnitsBuggyfill = require('viewport-units-buggyfill');

var _viewportUnitsBuggyfill2 = _interopRequireDefault(_viewportUnitsBuggyfill);

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

require('whatwg-fetch');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Required for IE

// Assign to the Object constructor
// Required for IE
// Required for older IE
if (!Object.assign) {
  Object.assign = _objectAssign2.default;
}

// Assign Promise to window, if not defined
// Required for IE & Safari
// Required for IOS devices
/**
 *
 * Polyfills
 *
 * Including this module will automatically call all specified polyfills
 * 
 */

if (!window.Promise) {
  window.Promise = _promisePolyfill2.default;
}

// Patch Buggy Viewport units on IOS devices
_viewportUnitsBuggyfill2.default.init();

/**
 *
 * Dataset Polyfill
 *
 * Element.dataset polyfill for IE10-
 *
 */

function dataset() {

  if (!('dataset' in document.createElement('span')) && 'Element' in global && Element.prototype && Object.defineProperty) {
    Object.defineProperty(Element.prototype, 'dataset', { get: function get() {
        var result = Object.create(null);

        for (var i = 0; i < this.attributes.length; ++i) {
          var attr = this.attributes[i];
          if (attr.specified && attr.name.substring(0, 5) === 'data-') {
            (function (element, name) {
              var prop = name.replace(/-([a-z])/g, function (m, p) {
                return p.toUpperCase();
              });
              result[prop] = element.getAttribute('data-' + name); // Read-only, for IE8-
              Object.defineProperty(result, prop, {
                get: function get() {
                  return element.getAttribute('data-' + name);
                },
                set: function set(value) {
                  element.setAttribute('data-' + name, value);
                } });
            })(this, attr.name.substring(5));
          }
        }
        return result;
      } });
  }
}

// Add cross browser support for dataset
dataset();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"input-placeholder-polyfill":16,"object-assign":17,"promise-polyfill":18,"viewport-units-buggyfill":23,"whatwg-fetch":24}],32:[function(require,module,exports){
/**
 *
 * DOM based router
 *
 * Fires when class on element, matches the name of any method.
 * Router also adds a 'common' call for JS that fires on any page.
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var namespace = void 0;
var fire = function fire(func) {
  if (func !== '' && namespace[func] && typeof namespace[func] == 'function') {
    namespace[func]();
  }
};

var loadEvents = function loadEvents() {

  // hit up common first.
  fire('common');

  // do all the classes too.
  document.body.className.replace(/-/g, '_').split(/\s+/).forEach(function (classnm) {
    fire(classnm);
  });
};

var router = function router(routes) {
  namespace = routes;
  loadEvents();
};

exports.default = router;

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleTarget;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** 
*
* Toggle
* 
* Toggles target element active class
*
* Usage:
*
* <button class="{selector}" data-target="#toggle-target" data-toggle>Toggle</button>
* <div id="toggle-target">Toggle Target</div>
* 
*/

var ACTIVE_CLASS = 'is-active';

/**
 *
 * Get all elements related to particular toggle element
 *
 * @return {Object} elements - Elements object
 * @return {HTMLElement} elements.clickedToggle - Current toggle element
 * @return {HTMLElement} elements.target - The target of the current toggle element
 * @return {Array} elements.targetAndToggles - An array of all toggle elements for a particular target,
 * concatenated with said target
 * @return {HTMLElement} elements.group - The group element that contains this and possibly other toggle targets with different 
 * toggle elements, for collapsing any related siblings within the same group
 * 
 */

function getElements(el) {

  var dataTarget = el.dataset.target;
  var target = document.querySelector(dataTarget);
  var targetToggles = (0, _utils.collection)('[data-target="' + dataTarget + '"]');

  return {
    clickedToggle: el,
    target: target,
    targetAndToggles: targetToggles.concat(target),
    group: document.querySelector(el.dataset.group)
  };
}

/**
 * Remove the active class from any other target & toggles within the same group, excluding a current target
 * 
 * @param  {HTMLElement} group - The group element
 * @param  {String} selector - The toggle selector for the current toggleTarget instance
 * @param  {HTMLElement} currentElement - Currently active toggle, any elements that contain the same [data-target]
 * attribute value as this element, will be filtered out from this function
 * 
 * @return {null} 
 */
function hideOthers(group, selector, currentElement) {

  (0, _utils.collection)(group.querySelectorAll(selector)).filter(function (el) {
    return el.dataset.target !== currentElement.dataset.target;
  }).map(function (el) {

    getElements(el).targetAndToggles.map(function (el) {
      return el.classList.remove(ACTIVE_CLASS);
    });
  });
}

/**
 *
 * Initialize the toggle Target for a given selector
 *
 * - The selector represents the toggle element, used to hide or show a certain target
 * - The toggle element must have a `data-target` attribute, referencing a unique element on the page to be toggled
 * Make sure to use an ID for the target
 * - The toggle element can have an optional `data-toggle` attribute, which will make the button toggle the target ON/OFF
 * If the attribute is not defined, the button will only toggle it's target ON.
 * 
 * @param  {String} selector - selector for the toggle element
 * @param  {Object} config - Configuration Object
 * @param  {Function} config.onToggleClose - Fires when the toggle gets closed, gets passed an object
 *                                         containing the current toggle elements
 * @param  {Function} config.onToggleOpen - Fires when the toggle gets opened, gets passed an object
 *                                         containing the current toggle elements 
 * @return {Object} Toggle Controller object
 * 
 */

function toggleTarget(selector) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var options = Object.assign({}, {
    onToggleOpen: function onToggleOpen() {},
    onToggleClose: function onToggleClose() {}
  }, config);

  document.addEventListener('click', (0, _utils.delegate)(selector, function (e) {

    e.preventDefault();

    var els = getElements(e.target);
    var target = els.target,
        targetAndToggles = els.targetAndToggles,
        group = els.group;

    var shouldToggle = e.target.dataset.toggle == 'true';

    if (target) {

      var isActive = target.classList.contains(ACTIVE_CLASS);

      if (shouldToggle && isActive) {

        targetAndToggles.map(function (el) {
          return el.classList.remove(ACTIVE_CLASS);
        });
        options.onToggleClose(els);
        _EventBus2.default.publish('toggle-target:close', els);
      }

      if (!isActive) {

        targetAndToggles.map(function (el) {
          return el.classList.add(ACTIVE_CLASS);
        });
        options.onToggleOpen(els);
        _EventBus2.default.publish('toggle-target:open', els);
      }

      if (group) {
        hideOthers(group, selector, e.target);
      }
    }
  }));

  var allTargetAndToggles = (0, _utils.collection)(selector).map(function (el) {
    return getElements(el).targetAndToggles;
  });

  // Controller Object
  return {

    /**
     *
     * Remove all active classes from all toggles in the instance
     * 
     * @return {null}
     */
    closeAll: function closeAll() {
      allTargetAndToggles.map(function (els) {
        els.map(function (el) {
          return el.classList.remove(ACTIVE_CLASS);
        });
      });
    }
  };
}

},{"./EventBus":25,"./utils":34}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inArray = inArray;
exports.createElement = createElement;
exports.selectorMatches = selectorMatches;
exports.delegate = delegate;
exports.debounce = debounce;
exports.whichTransitionEnd = whichTransitionEnd;
exports.serializeObject = serializeObject;
exports.extractURLParameters = extractURLParameters;
exports.isIOSorAndroid = isIOSorAndroid;
exports.isMobile = isMobile;
exports.scrollY = scrollY;
exports.collection = collection;
exports.getBpObj = getBpObj;
/**
 *
 * Utility functions
 *
 * Keep these functions as pure as possible (ie: input -> output ).
 * You can use globally available variables such as window and document.
 *
 */

/**
 *
 * @returns {boolean}
 *
 */

function inArray(item, array) {
  return array.indexOf(item) > -1;
}

/**
 *
 * Create a new DOM element
 *
 * @param {string} tagname - Element tagname ('iframe', 'div')
 * @param {object} attributes - Object of attributes to be assigned to the object.
 * @returns {HTMLElement} The DOM element
 *
 */

function createElement(tagname) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var el = document.createElement(tagname);

  if (el.setAttribute) {
    for (var k in attributes) {
      if (attributes.hasOwnProperty(k)) {
        el.setAttribute(k, attributes[k]);
      }
    }
  }

  return el;
}

/**
 *
 * Element.matches polyfill
 *
 * @param {HTMLElement} el - DOM element to check selector against
 * @param {string} selector - Selector string to use for matching
 *
 * @returns {boolean} Whether the selector matches or not.
 */

function selectorMatches(el, selector) {
  var p = Element.prototype;
  var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
  return fn.call(el, selector);
}

/**
 *
 * Return the first matched element by provided selector, traversing from current element to document.
 *
 * @param {HTMLElement} el - Element to find closest element to 
 * @param {string} selector - Selector to use for matching
 *
 * @return {HTMLElement|null} - The matching closest element or null
 * 
 */

function closest(el, selector) {

  while (el) {
    if (selectorMatches(el, selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return null;
}

/**
 *
 *  Thunk function for event delegation using `addEventListener`
 *
 *  Usage:
 *
 *  element.addEventListener('click', delegate(selector, e => {
 *  
 *    // your callback
 *
 *  }))
 *
 *  @param {string} delegate - Selector string to use for delegation
 *  @param {function} handler - Event handler function
 *
 *  @returns {undefined}
 * 
 */

function delegate(selector, handler) {
  return function (e) {

    var closestEl = closest(e.target, selector);

    if (closestEl) {
      handler.call(closestEl, e);
    }
  };
}

/**
 *   Returns a function, that, as long as it continues to be invoked, will not
 *   be triggered. The function will be called after it stops being called for
 *   N milliseconds. If `immediate` is passed, trigger the function on the
 *   leading edge, instead of the trailing.
 */

function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 *
 * Detect if browser supports transitionend event.
 * 
 * @returns {string|false} The prefixed (or unprefixed) supported event name 
 *                         or false if it doesn't support any.
 *
 */

function whichTransitionEnd() {

  var transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  };

  for (var name in transEndEventNames) {
    if (document.body.style[name] !== undefined) {
      return transEndEventNames[name];
    }
  }

  return false;
}

/**
 *
 * Covert Object into URL parameters
 *
 */

function serializeObject(obj) {

  var str = '';

  for (var k in obj) {
    if (str != '') {
      str += '&';
    }

    str += k + '=' + encodeURIComponent(obj[k]);
  }

  return str;
}

/**
 *
 * Convert URL parameters to object
 *
 */

function extractURLParameters(str) {

  var obj = {};

  if (document.location.search) {
    document.location.search.replace(/(^\?)/, '').split('&').map(function (n) {
      var par = n.split('=');
      obj[par[0]] = par[1];
    });
  }

  return obj;
}

/**
 *
 * User agent matching for IOS or Android devices
 *
 * @returns {boolean} If the UA matches for IOS or Android
 * 
 */

function isIOSorAndroid() {
  return navigator.userAgent.match(/iPad|iPhone|iPod|Android/i);
}

/**
 *
 * User agent matching for mobile devices
 *
 * @returns {boolean} If the UA matches for a mobile device
 * 
 */

function isMobile() {
  return navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
}

/**
 *
 * Get the value for the scrollY window position. 
 *
 * Note: Getting window.pageYOffset or window.scrollY causes layout reflow.
 * By caching the value we minimize this.
 * 
 * @returns {int} Current Y scroll distance
 * 
 */

var attachedScrollY = false;
var scrollPos = window.pageYOffset;

function scrollY() {

  if (!attachedScrollY) {
    window.addEventListener('scroll', function (e) {
      scrollPos = window.pageYOffset;
    });

    attachedScrollY = true;
  }

  return scrollPos;
}

/**
 *
 * Collection
 *
 * Interface for querySelectorAll, returning an array of elements, instead of a nodeList 
 *
 * @param {string|NodeList} selectorOrNodeList - Either a selector string or a nodeList
 * @return {array} Array of DOM elements
 * 
 */

function collection(selectorOrNodeList) {

  var arr = [];

  var nodeList = void 0;

  if (selectorOrNodeList instanceof NodeList) {
    nodeList = selectorOrNodeList;
  } else if (typeof selectorOrNodeList == 'string') {
    nodeList = document.querySelectorAll(selectorOrNodeList);
  } else {
    return arr;
  }

  for (var i = 0; i < nodeList.length; i++) {
    arr[i] = nodeList[i];
  }

  return arr;
}

/**
*
* Get Breakpoints Object
*
* This is a custom technique to gain access to our SCSS defined media query breakpoints 
* in JS.
*
* To get the technique working you need the following:
*
* 1. Define a `$bp-array` variable in your SCSS, with the following format:
*    
*   $bp-array  : '{"xs": "#{$bp-xs}" }';
*
* 2. To make it the value accessible from JS, we attach that property as
*    the font size of the document head.
*
*  head {
*   font-family: $bp-array;
*  }
* 
* 
* This function will take care of querying and parsing that value, returning an object
* with the media query values that you define on your SCSS
*
*
*/

function getBpObj() {
  var style = window.getComputedStyle(document.head)['font-family'];

  var bpObj = {};
  // Remove all unwanted character to make it possible to parse this as JSON
  var bpJSON = style.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, "");

  try {
    bpObj = JSON.parse(bpJSON);

    for (var k in bpObj) {
      if (bpObj.hasOwnProperty(k)) {
        bpObj[k] = parseInt(bpObj[k]);
      }
    }
  } catch (e) {}

  return bpObj;
}

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _videoService = require('./videoService');

var _videoService2 = _interopRequireDefault(_videoService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTIVE_CLASS = 'is-active';

/**
 * Returns a unique id within this module
 */

/**
 *
 * Video Iframe
 *
 * Setup video iframes, instantantiating it's corresponding player api 
 * and external custom controls.
 *
 * Any service specific api logic should be abstracted to it's corresponding 'videoService'
 *
 * IMPORTANT: IOS devices don't allow you to use the service API to trigger play on the iframe.
 * Instead, allow the user to click directly on the iframe, which will work fine.
 * 
 */

var id = 1;
function uid() {
  return id++;
}

/**
 * 
 * Returns an object with the different services 
 * we support and the parameters each service requires.
 *
 * @param {string} playerId - Id of the player iframe.
 * 
 */

function servicesConfig(playerId) {

  // Configuration object for each video service
  return {
    youtube: {
      url: 'http://www.youtube.com/embed/',
      params: {
        enablejsapi: 1,
        rel: 0,
        autoplay: 0,
        modestbranding: 1,
        controls: 1,
        showinfo: 0,
        wmode: 'transparent',
        vq: 'hd720'
      }
    },

    vimeo: {
      url: 'http://player.vimeo.com/video/',
      params: {
        autoplay: 0,
        api: 1,
        player_id: playerId
      }
    }
  };
}

/**
 *
 * Returns the markup for the player iframe
 *
 * @param {object} service - Value of the corresponding service key from `servicesConfig`.
 * @param {string} videoId - Id of the video provided by the video service.
 * @param {string} iframeId - Id of the iframe DOM element.
 * 
 */

function getIframe(service, videoId, iframeId) {
  var src = service.url + videoId + '?' + (0, _utils.serializeObject)(service.params);

  return (0, _utils.createElement)('iframe', {
    id: iframeId,
    src: src,
    frameborder: 0,
    allowfullscreen: true
  });
}

/**
 *
 * Attaches event listener for any external controls for the player 
 * (A custom play button for example)
 *
 * Play button: <button> element must have a `data-video-play` attribute
 * to indicate it's a play button and a `data-target` with the id of the `wrapperEl` iframe
 * wrapper to be targeted.
 *
 */

var controlsInitialized = false;
function initVideoControls() {

  // Only want to attach this listener once
  if (!controlsInitialized) {
    document.addEventListener('click', (0, _utils.delegate)('[data-video-play]', function (e) {

      var clickedEl = e.target;
      var wrapperEl = document.querySelector(clickedEl.dataset.target);

      // The wrapper element service should be assigned when calling `createVideoIframe`
      if (wrapperEl && wrapperEl.serviceController) {
        wrapperEl.serviceController.play();
      }
    }));

    controlsInitialized = true;
  }
}

/**
 *
 * Creates the video iframe player.
 *
 * @param {HTMLElement} wrapperEl - Root element where the player will be inserted.
 * @returns {object} serviceController - service video service controller instance.
 */

function createVideoIframe(wrapperEl) {

  if (!wrapperEl || !wrapperEl.nodeType) {
    console.log('You must provide a DOM element to `createVideoIframe`');
    return false;
  }

  var data = wrapperEl.dataset;
  var videoId = data.videoId;
  var playerId = 'iframe-player-' + uid();
  var serviceConfig = servicesConfig(playerId)[data.videoService];

  if (!serviceConfig || !videoId) {
    console.log('The player wrapper must have "data-video-service" and "data-video-id" attributes');
    return;
  }

  // Create and append the player iframe to the wrapper 
  wrapperEl.appendChild(getIframe(serviceConfig, videoId, playerId));

  var iframe = wrapperEl.querySelector('iframe'); // Then get it
  var serviceController = (0, _videoService2.default)(data.videoService, iframe);

  // Custom event listeners, triggered by the respective service API
  _EventBus2.default.subscribe('video-service:play', function (playerIframe) {
    if (playerIframe.id == playerId) {
      wrapperEl.classList.add(ACTIVE_CLASS);
    }
  });

  _EventBus2.default.subscribe('video-service:finish', function (playerIframe) {
    if (playerIframe.id == playerId) {
      wrapperEl.classList.remove(ACTIVE_CLASS);
    }
  });

  // Expose the service object to the outside by assigning it to the wrapper element
  wrapperEl.serviceController = serviceController;
  initVideoControls();

  return serviceController;
}

exports.default = createVideoIframe;

},{"./EventBus":25,"./utils":34,"./videoService":36}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _load = require('./load');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Video Service
 *
 * Logic to setup different video iframe api services (currently Youtube and Vimeo)
 *
 * IMPORTANT: IOS devices don't allow you to use the service API to trigger play on the iframe.
 * Instead, allow the user to click directly on the ifram, which will work fine.
 * 
 */

var playerOrigin = '*';

/**
 *
 * Helper function for sending a message to the vimeo player, taken from {@link Vimeo API}
 * {@link https://developer.vimeo.com/player/js-api Vimeo API}
 * 
 * @param {string} action - Name of the action to be posted to the iframe
 * @param {string} value - Value of the action to be posted to the iframe
 * @param {HTMLIFrameElement} playerIframe - Iframe DOM element of the player
 * 
 */

function postToVimeo(action, value, playerIframe) {

  var data = {
    method: action
  };

  if (value) {
    data.value = value;
  }

  var message = JSON.stringify(data);
  playerIframe.contentWindow.postMessage(message, playerOrigin);
}

/**
 *
 * Listen for 'message' events from the VIMEO iframe, and call the corresponding
 * handler from a provied configuration object
 *
 * @param {object} config - instance configuration object. Must have valid methods
 *                        Corresponding to the Vimeo API events
 * @param {HTMLIframeElement} iframe - Vimeo iframe video player
 *
 */

function initVimeo(config, iframe) {

  window.addEventListener('message', function (e) {

    var data = JSON.parse(e.data);

    // Handle messages from the vimeo player only
    if (!/^https?:\/\/player.vimeo.com/.test(e.origin)) {
      return false;
    }

    // Return if the message is not from this iframe
    if (iframe.id !== data.player_id) {
      return false;
    }

    if (playerOrigin === '*') {
      playerOrigin = e.origin;
    }

    // Execute the handler for this event, if it's a valid function
    if (typeof config[data.event] == 'function') {
      config[data.event]();
    }
  }, false);
}

/**
 *
 * Youtube calls this function automatically once the API has loaded
 *
 */

var youtubeAPIPromise = new Promise(function (resolve) {
  window.onYouTubeIframeAPIReady = function () {
    resolve();
  };
});

/**
 *
 * Initialize a video service instance. Returns a `serviceController`
 * object for listening to API events  and controlling player with custom elements.
 *
 * @param {string} serviceName - Name of the service to initialize
 * @param {HTMLIframeElement} iframe - Iframe video player
 * @returns {object} serviceController - service video service controller instance.
 */

function initVideoService(serviceName, iframe) {

  var serviceReady = new Promise(function (resolve) {
    _EventBus2.default.subscribe('video-service:ready', function (readyService, player) {
      if (readyService == serviceName) {
        resolve(player);
      }
    });
  });

  // Instace controller
  var serviceController = {};

  // Since each service has a very different API, 
  // We have to assemble the `serviceController` for each type
  // in a different way, while still providing a consistent interface.
  switch (serviceName) {

    case 'vimeo':

      // Assign the controls methods for vimeo
      serviceController.play = function () {
        serviceReady.then(function () {
          postToVimeo('play', null, iframe);
        });
      };
      serviceController.stop = function () {
        serviceReady.then(function () {
          postToVimeo('pause', null, iframe);
        });
      };

      initVimeo({
        ready: function ready() {
          // Need to tell Vimeo that we want to listen for this events
          postToVimeo('addEventListener', 'play', iframe);
          postToVimeo('addEventListener', 'finish', iframe);

          _EventBus2.default.publish('video-service:ready', serviceName);
        },
        play: function play() {
          _EventBus2.default.publish('video-service:play', iframe);
        },
        finish: function finish() {
          _EventBus2.default.publish('video-service:finish', iframe);
        }
      }, iframe);
      break;

    case 'youtube':

      // Assign control methods for youtube
      serviceController.play = function () {
        serviceReady.then(function (player) {
          player.playVideo();
        });
      };
      serviceController.stop = function () {
        serviceReady.then(function (player) {
          player.stopVideo();
        });
      };

      (0, _load.loadScriptOnce)('https://www.youtube.com/iframe_api');

      youtubeAPIPromise.then(function () {

        var player = new YT.Player(iframe, {
          events: {
            onReady: function onReady() {
              _EventBus2.default.publish('video-service:ready', serviceName, player);
            },
            onStateChange: function onStateChange(e) {
              if (e.data == 1) {
                _EventBus2.default.publish('video-service:play', iframe);
              } else if (e.data == 0) {
                _EventBus2.default.publish('video-service:finish', iframe);
              }
            }
          }
        });
      });

      break;
  }

  return serviceController;
}

exports.default = initVideoService;

},{"./EventBus":25,"./load":28}],37:[function(require,module,exports){
'use strict';

require('./modules/polyfills');

require('./modules/modernizrTests');

var _flickity = require('flickity');

var _flickity2 = _interopRequireDefault(_flickity);

var _smoothScroll = require('smooth-scroll');

var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

var _router = require('./modules/router');

var _router2 = _interopRequireDefault(_router);

var _EventBus = require('./modules/EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _modal = require('./modules/modal');

var _form = require('./modules/form');

var _toggleTarget = require('./modules/toggleTarget');

var _toggleTarget2 = _interopRequireDefault(_toggleTarget);

var _globalEvents = require('./modules/globalEvents');

var _utils = require('./modules/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Stub the console, if it doesn't exist
window.console = window.console || {
  log: function log() {}
};

/*----------  Common Function Definitions  ----------*/

/*----------  Scripts to Fire on Every Page  ----------*/

var breakpoints = (0, _utils.getBpObj)();

/**
 * 
 * Listen for card elements click, and trigger click on the links inside,
 * making the whole card clickable
 * 
 */

(0, _utils.collection)('[data-card-click]').map(function (card) {
  card.addEventListener('click', function (e) {
    var link = card.querySelector('[data-card-link]');
    if (link) {
      link.click();
    }
  });
});

/**
 *
 * Smooth scroll for links within the same page
 * 
 */

_EventBus2.default.subscribe(_globalEvents.windowResized, function (e) {
  _smoothScroll2.default.init({
    offset: document.querySelector('#site-header').offsetHeight
  });
});

/**
 *
 * Search Bar Toggle
 * 
 */

var siteSearch = document.querySelector('#site-search');

// Focuses automatically when opening
var toggleSearchController = (0, _toggleTarget2.default)('.js-toggle-search', {
  onToggleOpen: function onToggleOpen(els) {
    return siteSearch.querySelector('input').focus();
  }
});

// Close the search bar on `esc` press
_EventBus2.default.subscribe(_globalEvents.keyDownEscape, function () {
  toggleSearchController.closeAll();
});

/**
 *
 *  Generic Toggle
 * 
 */

(0, _toggleTarget2.default)('.js-toggle');

(0, _toggleTarget2.default)('.js-toggle-tab', {
  onToggleOpen: function onToggleOpen(_ref) {
    var target = _ref.target,
        group = _ref.group;

    if (group) {
      setTimeout(function () {
        _smoothScroll2.default.animateScroll(group);
      }, 0);
    }
  }
});

/**
 *
 * Mobile Navigation
 * 
 */

(0, _modal.initModal)(document.querySelector('#mobile-nav'));
(0, _modal.initVideoModal)(document.querySelector('#video-modal'), '[data-video-player]');
(0, _modal.initModal)(document.querySelector('#modal'));

/**
 *
 *  Sliders
 * 
 */

(0, _utils.collection)('.js-slider').filter(function (el) {
  return el.children.length > 1;
}).map(function (el) {
  return new _flickity2.default(el, {
    pageDots: el.dataset.pageDots == 'false' ? false : true
  });
});

_EventBus2.default.subscribe(_globalEvents.windowResized, function () {

  var sliders = (0, _utils.collection)('.js-mobile-slider');

  if (window.innerWidth <= breakpoints.lg) {
    sliders.filter(function (el) {
      return !_flickity2.default.data(el);
    }).map(function (el) {
      return new _flickity2.default(el, {
        pageDots: true,
        prevNextButtons: false
      });
    });
  } else {
    sliders.map(function (el) {
      return _flickity2.default.data(el);
    }).filter(function (flickity) {
      return flickity;
    }).map(function (flickity) {
      return flickity.destroy();
    });
  }
});

/**
 *
 * Handler for ajax submitted gravity forms
 * 
 */

(0, _form.ajaxSubmitGforms)('.gform_wrapper form');

/*----------  Route Specific  ----------*/

(0, _router2.default)({
  home: function home() {}
});

// Fire initial custom events

_EventBus2.default.publish(_globalEvents.windowResized);

},{"./modules/EventBus":25,"./modules/form":26,"./modules/globalEvents":27,"./modules/modal":29,"./modules/modernizrTests":30,"./modules/polyfills":31,"./modules/router":32,"./modules/toggleTarget":33,"./modules/utils":34,"flickity":9,"smooth-scroll":19}]},{},[37])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2V2LWVtaXR0ZXIvZXYtZW1pdHRlci5qcyIsIm5vZGVfbW9kdWxlcy9maXp6eS11aS11dGlscy91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9mbGlja2l0eS9qcy9hZGQtcmVtb3ZlLWNlbGwuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvYW5pbWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9mbGlja2l0eS9qcy9jZWxsLmpzIiwibm9kZV9tb2R1bGVzL2ZsaWNraXR5L2pzL2RyYWcuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvZmxpY2tpdHkuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvbGF6eWxvYWQuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvcGFnZS1kb3RzLmpzIiwibm9kZV9tb2R1bGVzL2ZsaWNraXR5L2pzL3BsYXllci5qcyIsIm5vZGVfbW9kdWxlcy9mbGlja2l0eS9qcy9wcmV2LW5leHQtYnV0dG9uLmpzIiwibm9kZV9tb2R1bGVzL2ZsaWNraXR5L2pzL3NsaWRlLmpzIiwibm9kZV9tb2R1bGVzL2dldC1zaXplL2dldC1zaXplLmpzIiwibm9kZV9tb2R1bGVzL2lucHV0LXBsYWNlaG9sZGVyLXBvbHlmaWxsL2Rpc3QvbWFpbi5taW4uanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlLXBvbHlmaWxsL3Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvc21vb3RoLXNjcm9sbC9kaXN0L2pzL3Ntb290aC1zY3JvbGwubWluLmpzIiwibm9kZV9tb2R1bGVzL3RhcC1saXN0ZW5lci90YXAtbGlzdGVuZXIuanMiLCJub2RlX21vZHVsZXMvdW5pZHJhZ2dlci91bmlkcmFnZ2VyLmpzIiwibm9kZV9tb2R1bGVzL3VuaXBvaW50ZXIvdW5pcG9pbnRlci5qcyIsIm5vZGVfbW9kdWxlcy92aWV3cG9ydC11bml0cy1idWdneWZpbGwvdmlld3BvcnQtdW5pdHMtYnVnZ3lmaWxsLmpzIiwibm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9FdmVudEJ1cy5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9mb3JtLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL2dsb2JhbEV2ZW50cy5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9sb2FkLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL21vZGFsLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL21vZGVybml6clRlc3RzLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3BvbHlmaWxscy5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9yb3V0ZXIuanMiLCJ3cC1jb250ZW50L3RoZW1lcy9iYXNlLXRoZW1lL3NyYy9zY3JpcHRzL21vZHVsZXMvdG9nZ2xlVGFyZ2V0LmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3V0aWxzLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3ZpZGVvLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3ZpZGVvU2VydmljZS5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvcHVibGljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2wxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDek9BO0FBQ0E7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDMWNBOzs7Ozs7Ozs7O0FBVUEsSUFBTSxTQUFTLEVBQWY7O0FBRUEsSUFBTSxXQUFXOztBQUVmOzs7Ozs7Ozs7OztBQVdBLFdBYmUscUJBYUwsS0FiSyxFQWFFLFFBYkYsRUFhWTs7QUFFekI7QUFDQSxRQUFHLENBQUMsT0FBTyxjQUFQLENBQXNCLEtBQXRCLENBQUosRUFBa0M7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LGFBQU0sbUJBQVMsSUFBVCxDQUFjLEVBQWQsQ0FBTjtBQUFBLEtBRFAsRUFFRyxNQUZILENBRVU7QUFBQSxhQUFZLFFBQVo7QUFBQSxLQUZWLEVBR0csR0FISCxDQUdPO0FBQUEsYUFBWSxTQUFTLE9BQVQsRUFBWjtBQUFBLEtBSFA7QUFJRDtBQUVGLENBbEJEOztBQW9CQTs7Ozs7O0FBTUEsNEJBQWlCLHFCQUFqQjs7QUFHQTs7QUFFQSxzQkFBTztBQUNMLE1BREssa0JBQ0UsQ0FFTjtBQUhJLENBQVA7O0FBTUE7O0FBRUEsbUJBQVMsT0FBVCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIG1hdGNoZXNTZWxlY3RvciB2Mi4wLjFcbiAqIG1hdGNoZXNTZWxlY3RvciggZWxlbWVudCwgJy5zZWxlY3RvcicgKVxuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCBzdHJpY3Q6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvKmdsb2JhbCBkZWZpbmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBmYWN0b3J5ICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5tYXRjaGVzU2VsZWN0b3IgPSBmYWN0b3J5KCk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1hdGNoZXNNZXRob2QgPSAoIGZ1bmN0aW9uKCkge1xuICAgIHZhciBFbGVtUHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcbiAgICAvLyBjaGVjayBmb3IgdGhlIHN0YW5kYXJkIG1ldGhvZCBuYW1lIGZpcnN0XG4gICAgaWYgKCBFbGVtUHJvdG8ubWF0Y2hlcyApIHtcbiAgICAgIHJldHVybiAnbWF0Y2hlcyc7XG4gICAgfVxuICAgIC8vIGNoZWNrIHVuLXByZWZpeGVkXG4gICAgaWYgKCBFbGVtUHJvdG8ubWF0Y2hlc1NlbGVjdG9yICkge1xuICAgICAgcmV0dXJuICdtYXRjaGVzU2VsZWN0b3InO1xuICAgIH1cbiAgICAvLyBjaGVjayB2ZW5kb3IgcHJlZml4ZXNcbiAgICB2YXIgcHJlZml4ZXMgPSBbICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nIF07XG5cbiAgICBmb3IgKCB2YXIgaT0wOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgICB2YXIgbWV0aG9kID0gcHJlZml4ICsgJ01hdGNoZXNTZWxlY3Rvcic7XG4gICAgICBpZiAoIEVsZW1Qcm90b1sgbWV0aG9kIF0gKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Q7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBtYXRjaGVzU2VsZWN0b3IoIGVsZW0sIHNlbGVjdG9yICkge1xuICAgIHJldHVybiBlbGVtWyBtYXRjaGVzTWV0aG9kIF0oIHNlbGVjdG9yICk7XG4gIH07XG5cbn0pKTtcbiIsIi8qKlxuICogRXZFbWl0dGVyIHYxLjAuM1xuICogTGlsJyBldmVudCBlbWl0dGVyXG4gKiBNSVQgTGljZW5zZVxuICovXG5cbi8qIGpzaGludCB1bnVzZWQ6IHRydWUsIHVuZGVmOiB0cnVlLCBzdHJpY3Q6IHRydWUgKi9cblxuKCBmdW5jdGlvbiggZ2xvYmFsLCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLyogZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgd2luZG93ICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EIC0gUmVxdWlyZUpTXG4gICAgZGVmaW5lKCBmYWN0b3J5ICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlMgLSBCcm93c2VyaWZ5LCBXZWJwYWNrXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgZ2xvYmFsLkV2RW1pdHRlciA9IGZhY3RvcnkoKTtcbiAgfVxuXG59KCB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcywgZnVuY3Rpb24oKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBFdkVtaXR0ZXIoKSB7fVxuXG52YXIgcHJvdG8gPSBFdkVtaXR0ZXIucHJvdG90eXBlO1xuXG5wcm90by5vbiA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGxpc3RlbmVyICkge1xuICBpZiAoICFldmVudE5hbWUgfHwgIWxpc3RlbmVyICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBzZXQgZXZlbnRzIGhhc2hcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgLy8gc2V0IGxpc3RlbmVycyBhcnJheVxuICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzWyBldmVudE5hbWUgXSA9IGV2ZW50c1sgZXZlbnROYW1lIF0gfHwgW107XG4gIC8vIG9ubHkgYWRkIG9uY2VcbiAgaWYgKCBsaXN0ZW5lcnMuaW5kZXhPZiggbGlzdGVuZXIgKSA9PSAtMSApIHtcbiAgICBsaXN0ZW5lcnMucHVzaCggbGlzdGVuZXIgKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxucHJvdG8ub25jZSA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGxpc3RlbmVyICkge1xuICBpZiAoICFldmVudE5hbWUgfHwgIWxpc3RlbmVyICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBhZGQgZXZlbnRcbiAgdGhpcy5vbiggZXZlbnROYW1lLCBsaXN0ZW5lciApO1xuICAvLyBzZXQgb25jZSBmbGFnXG4gIC8vIHNldCBvbmNlRXZlbnRzIGhhc2hcbiAgdmFyIG9uY2VFdmVudHMgPSB0aGlzLl9vbmNlRXZlbnRzID0gdGhpcy5fb25jZUV2ZW50cyB8fCB7fTtcbiAgLy8gc2V0IG9uY2VMaXN0ZW5lcnMgb2JqZWN0XG4gIHZhciBvbmNlTGlzdGVuZXJzID0gb25jZUV2ZW50c1sgZXZlbnROYW1lIF0gPSBvbmNlRXZlbnRzWyBldmVudE5hbWUgXSB8fCB7fTtcbiAgLy8gc2V0IGZsYWdcbiAgb25jZUxpc3RlbmVyc1sgbGlzdGVuZXIgXSA9IHRydWU7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wcm90by5vZmYgPSBmdW5jdGlvbiggZXZlbnROYW1lLCBsaXN0ZW5lciApIHtcbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbIGV2ZW50TmFtZSBdO1xuICBpZiAoICFsaXN0ZW5lcnMgfHwgIWxpc3RlbmVycy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKCBsaXN0ZW5lciApO1xuICBpZiAoIGluZGV4ICE9IC0xICkge1xuICAgIGxpc3RlbmVycy5zcGxpY2UoIGluZGV4LCAxICk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGFyZ3MgKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzWyBldmVudE5hbWUgXTtcbiAgaWYgKCAhbGlzdGVuZXJzIHx8ICFsaXN0ZW5lcnMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaSA9IDA7XG4gIHZhciBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgYXJncyA9IGFyZ3MgfHwgW107XG4gIC8vIG9uY2Ugc3R1ZmZcbiAgdmFyIG9uY2VMaXN0ZW5lcnMgPSB0aGlzLl9vbmNlRXZlbnRzICYmIHRoaXMuX29uY2VFdmVudHNbIGV2ZW50TmFtZSBdO1xuXG4gIHdoaWxlICggbGlzdGVuZXIgKSB7XG4gICAgdmFyIGlzT25jZSA9IG9uY2VMaXN0ZW5lcnMgJiYgb25jZUxpc3RlbmVyc1sgbGlzdGVuZXIgXTtcbiAgICBpZiAoIGlzT25jZSApIHtcbiAgICAgIC8vIHJlbW92ZSBsaXN0ZW5lclxuICAgICAgLy8gcmVtb3ZlIGJlZm9yZSB0cmlnZ2VyIHRvIHByZXZlbnQgcmVjdXJzaW9uXG4gICAgICB0aGlzLm9mZiggZXZlbnROYW1lLCBsaXN0ZW5lciApO1xuICAgICAgLy8gdW5zZXQgb25jZSBmbGFnXG4gICAgICBkZWxldGUgb25jZUxpc3RlbmVyc1sgbGlzdGVuZXIgXTtcbiAgICB9XG4gICAgLy8gdHJpZ2dlciBsaXN0ZW5lclxuICAgIGxpc3RlbmVyLmFwcGx5KCB0aGlzLCBhcmdzICk7XG4gICAgLy8gZ2V0IG5leHQgbGlzdGVuZXJcbiAgICBpICs9IGlzT25jZSA/IDAgOiAxO1xuICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5yZXR1cm4gRXZFbWl0dGVyO1xuXG59KSk7XG4iLCIvKipcbiAqIEZpenp5IFVJIHV0aWxzIHYyLjAuM1xuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCB1bmRlZjogdHJ1ZSwgdW51c2VkOiB0cnVlLCBzdHJpY3Q6IHRydWUgKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLypqc2hpbnQgc3RyaWN0OiBmYWxzZSAqLyAvKmdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cblxuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJ2Rlc2FuZHJvLW1hdGNoZXMtc2VsZWN0b3IvbWF0Y2hlcy1zZWxlY3RvcidcbiAgICBdLCBmdW5jdGlvbiggbWF0Y2hlc1NlbGVjdG9yICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgbWF0Y2hlc1NlbGVjdG9yICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCdkZXNhbmRyby1tYXRjaGVzLXNlbGVjdG9yJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93LmZpenp5VUlVdGlscyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cubWF0Y2hlc1NlbGVjdG9yXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgbWF0Y2hlc1NlbGVjdG9yICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHt9O1xuXG4vLyAtLS0tLSBleHRlbmQgLS0tLS0gLy9cblxuLy8gZXh0ZW5kcyBvYmplY3RzXG51dGlscy5leHRlbmQgPSBmdW5jdGlvbiggYSwgYiApIHtcbiAgZm9yICggdmFyIHByb3AgaW4gYiApIHtcbiAgICBhWyBwcm9wIF0gPSBiWyBwcm9wIF07XG4gIH1cbiAgcmV0dXJuIGE7XG59O1xuXG4vLyAtLS0tLSBtb2R1bG8gLS0tLS0gLy9cblxudXRpbHMubW9kdWxvID0gZnVuY3Rpb24oIG51bSwgZGl2ICkge1xuICByZXR1cm4gKCAoIG51bSAlIGRpdiApICsgZGl2ICkgJSBkaXY7XG59O1xuXG4vLyAtLS0tLSBtYWtlQXJyYXkgLS0tLS0gLy9cblxuLy8gdHVybiBlbGVtZW50IG9yIG5vZGVMaXN0IGludG8gYW4gYXJyYXlcbnV0aWxzLm1ha2VBcnJheSA9IGZ1bmN0aW9uKCBvYmogKSB7XG4gIHZhciBhcnkgPSBbXTtcbiAgaWYgKCBBcnJheS5pc0FycmF5KCBvYmogKSApIHtcbiAgICAvLyB1c2Ugb2JqZWN0IGlmIGFscmVhZHkgYW4gYXJyYXlcbiAgICBhcnkgPSBvYmo7XG4gIH0gZWxzZSBpZiAoIG9iaiAmJiB0eXBlb2Ygb2JqLmxlbmd0aCA9PSAnbnVtYmVyJyApIHtcbiAgICAvLyBjb252ZXJ0IG5vZGVMaXN0IHRvIGFycmF5XG4gICAgZm9yICggdmFyIGk9MDsgaSA8IG9iai5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGFyeS5wdXNoKCBvYmpbaV0gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gYXJyYXkgb2Ygc2luZ2xlIGluZGV4XG4gICAgYXJ5LnB1c2goIG9iaiApO1xuICB9XG4gIHJldHVybiBhcnk7XG59O1xuXG4vLyAtLS0tLSByZW1vdmVGcm9tIC0tLS0tIC8vXG5cbnV0aWxzLnJlbW92ZUZyb20gPSBmdW5jdGlvbiggYXJ5LCBvYmogKSB7XG4gIHZhciBpbmRleCA9IGFyeS5pbmRleE9mKCBvYmogKTtcbiAgaWYgKCBpbmRleCAhPSAtMSApIHtcbiAgICBhcnkuc3BsaWNlKCBpbmRleCwgMSApO1xuICB9XG59O1xuXG4vLyAtLS0tLSBnZXRQYXJlbnQgLS0tLS0gLy9cblxudXRpbHMuZ2V0UGFyZW50ID0gZnVuY3Rpb24oIGVsZW0sIHNlbGVjdG9yICkge1xuICB3aGlsZSAoIGVsZW0gIT0gZG9jdW1lbnQuYm9keSApIHtcbiAgICBlbGVtID0gZWxlbS5wYXJlbnROb2RlO1xuICAgIGlmICggbWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBzZWxlY3RvciApICkge1xuICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLSBnZXRRdWVyeUVsZW1lbnQgLS0tLS0gLy9cblxuLy8gdXNlIGVsZW1lbnQgYXMgc2VsZWN0b3Igc3RyaW5nXG51dGlscy5nZXRRdWVyeUVsZW1lbnQgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgaWYgKCB0eXBlb2YgZWxlbSA9PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggZWxlbSApO1xuICB9XG4gIHJldHVybiBlbGVtO1xufTtcblxuLy8gLS0tLS0gaGFuZGxlRXZlbnQgLS0tLS0gLy9cblxuLy8gZW5hYmxlIC5vbnR5cGUgdG8gdHJpZ2dlciBmcm9tIC5hZGRFdmVudExpc3RlbmVyKCBlbGVtLCAndHlwZScgKVxudXRpbHMuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHZhciBtZXRob2QgPSAnb24nICsgZXZlbnQudHlwZTtcbiAgaWYgKCB0aGlzWyBtZXRob2QgXSApIHtcbiAgICB0aGlzWyBtZXRob2QgXSggZXZlbnQgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gZmlsdGVyRmluZEVsZW1lbnRzIC0tLS0tIC8vXG5cbnV0aWxzLmZpbHRlckZpbmRFbGVtZW50cyA9IGZ1bmN0aW9uKCBlbGVtcywgc2VsZWN0b3IgKSB7XG4gIC8vIG1ha2UgYXJyYXkgb2YgZWxlbXNcbiAgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGVsZW1zICk7XG4gIHZhciBmZkVsZW1zID0gW107XG5cbiAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgLy8gY2hlY2sgdGhhdCBlbGVtIGlzIGFuIGFjdHVhbCBlbGVtZW50XG4gICAgaWYgKCAhKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gYWRkIGVsZW0gaWYgbm8gc2VsZWN0b3JcbiAgICBpZiAoICFzZWxlY3RvciApIHtcbiAgICAgIGZmRWxlbXMucHVzaCggZWxlbSApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBmaWx0ZXIgJiBmaW5kIGl0ZW1zIGlmIHdlIGhhdmUgYSBzZWxlY3RvclxuICAgIC8vIGZpbHRlclxuICAgIGlmICggbWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBzZWxlY3RvciApICkge1xuICAgICAgZmZFbGVtcy5wdXNoKCBlbGVtICk7XG4gICAgfVxuICAgIC8vIGZpbmQgY2hpbGRyZW5cbiAgICB2YXIgY2hpbGRFbGVtcyA9IGVsZW0ucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKTtcbiAgICAvLyBjb25jYXQgY2hpbGRFbGVtcyB0byBmaWx0ZXJGb3VuZCBhcnJheVxuICAgIGZvciAoIHZhciBpPTA7IGkgPCBjaGlsZEVsZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgZmZFbGVtcy5wdXNoKCBjaGlsZEVsZW1zW2ldICk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZmZFbGVtcztcbn07XG5cbi8vIC0tLS0tIGRlYm91bmNlTWV0aG9kIC0tLS0tIC8vXG5cbnV0aWxzLmRlYm91bmNlTWV0aG9kID0gZnVuY3Rpb24oIF9jbGFzcywgbWV0aG9kTmFtZSwgdGhyZXNob2xkICkge1xuICAvLyBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG1ldGhvZCA9IF9jbGFzcy5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXTtcbiAgdmFyIHRpbWVvdXROYW1lID0gbWV0aG9kTmFtZSArICdUaW1lb3V0JztcblxuICBfY2xhc3MucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZW91dCA9IHRoaXNbIHRpbWVvdXROYW1lIF07XG4gICAgaWYgKCB0aW1lb3V0ICkge1xuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG4gICAgfVxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzWyB0aW1lb3V0TmFtZSBdID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICBtZXRob2QuYXBwbHkoIF90aGlzLCBhcmdzICk7XG4gICAgICBkZWxldGUgX3RoaXNbIHRpbWVvdXROYW1lIF07XG4gICAgfSwgdGhyZXNob2xkIHx8IDEwMCApO1xuICB9O1xufTtcblxuLy8gLS0tLS0gZG9jUmVhZHkgLS0tLS0gLy9cblxudXRpbHMuZG9jUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG4gIHZhciByZWFkeVN0YXRlID0gZG9jdW1lbnQucmVhZHlTdGF0ZTtcbiAgaWYgKCByZWFkeVN0YXRlID09ICdjb21wbGV0ZScgfHwgcmVhZHlTdGF0ZSA9PSAnaW50ZXJhY3RpdmUnICkge1xuICAgIC8vIGRvIGFzeW5jIHRvIGFsbG93IGZvciBvdGhlciBzY3JpcHRzIHRvIHJ1bi4gbWV0YWZpenp5L2ZsaWNraXR5IzQ0MVxuICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrICk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjayApO1xuICB9XG59O1xuXG4vLyAtLS0tLSBodG1sSW5pdCAtLS0tLSAvL1xuXG4vLyBodHRwOi8vamFtZXNyb2JlcnRzLm5hbWUvYmxvZy8yMDEwLzAyLzIyL3N0cmluZy1mdW5jdGlvbnMtZm9yLWphdmFzY3JpcHQtdHJpbS10by1jYW1lbC1jYXNlLXRvLWRhc2hlZC1hbmQtdG8tdW5kZXJzY29yZS9cbnV0aWxzLnRvRGFzaGVkID0gZnVuY3Rpb24oIHN0ciApIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKCAvKC4pKFtBLVpdKS9nLCBmdW5jdGlvbiggbWF0Y2gsICQxLCAkMiApIHtcbiAgICByZXR1cm4gJDEgKyAnLScgKyAkMjtcbiAgfSkudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBjb25zb2xlID0gd2luZG93LmNvbnNvbGU7XG4vKipcbiAqIGFsbG93IHVzZXIgdG8gaW5pdGlhbGl6ZSBjbGFzc2VzIHZpYSBbZGF0YS1uYW1lc3BhY2VdIG9yIC5qcy1uYW1lc3BhY2UgY2xhc3NcbiAqIGh0bWxJbml0KCBXaWRnZXQsICd3aWRnZXROYW1lJyApXG4gKiBvcHRpb25zIGFyZSBwYXJzZWQgZnJvbSBkYXRhLW5hbWVzcGFjZS1vcHRpb25zXG4gKi9cbnV0aWxzLmh0bWxJbml0ID0gZnVuY3Rpb24oIFdpZGdldENsYXNzLCBuYW1lc3BhY2UgKSB7XG4gIHV0aWxzLmRvY1JlYWR5KCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGFzaGVkTmFtZXNwYWNlID0gdXRpbHMudG9EYXNoZWQoIG5hbWVzcGFjZSApO1xuICAgIHZhciBkYXRhQXR0ciA9ICdkYXRhLScgKyBkYXNoZWROYW1lc3BhY2U7XG4gICAgdmFyIGRhdGFBdHRyRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnWycgKyBkYXRhQXR0ciArICddJyApO1xuICAgIHZhciBqc0Rhc2hFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuanMtJyArIGRhc2hlZE5hbWVzcGFjZSApO1xuICAgIHZhciBlbGVtcyA9IHV0aWxzLm1ha2VBcnJheSggZGF0YUF0dHJFbGVtcyApXG4gICAgICAuY29uY2F0KCB1dGlscy5tYWtlQXJyYXkoIGpzRGFzaEVsZW1zICkgKTtcbiAgICB2YXIgZGF0YU9wdGlvbnNBdHRyID0gZGF0YUF0dHIgKyAnLW9wdGlvbnMnO1xuICAgIHZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5O1xuXG4gICAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgICB2YXIgYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCBkYXRhQXR0ciApIHx8XG4gICAgICAgIGVsZW0uZ2V0QXR0cmlidXRlKCBkYXRhT3B0aW9uc0F0dHIgKTtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgdHJ5IHtcbiAgICAgICAgb3B0aW9ucyA9IGF0dHIgJiYgSlNPTi5wYXJzZSggYXR0ciApO1xuICAgICAgfSBjYXRjaCAoIGVycm9yICkge1xuICAgICAgICAvLyBsb2cgZXJyb3IsIGRvIG5vdCBpbml0aWFsaXplXG4gICAgICAgIGlmICggY29uc29sZSApIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCAnRXJyb3IgcGFyc2luZyAnICsgZGF0YUF0dHIgKyAnIG9uICcgKyBlbGVtLmNsYXNzTmFtZSArXG4gICAgICAgICAgJzogJyArIGVycm9yICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gaW5pdGlhbGl6ZVxuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IFdpZGdldENsYXNzKCBlbGVtLCBvcHRpb25zICk7XG4gICAgICAvLyBtYWtlIGF2YWlsYWJsZSB2aWEgJCgpLmRhdGEoJ25hbWVzcGFjZScpXG4gICAgICBpZiAoIGpRdWVyeSApIHtcbiAgICAgICAgalF1ZXJ5LmRhdGEoIGVsZW0sIG5hbWVzcGFjZSwgaW5zdGFuY2UgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9KTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5yZXR1cm4gdXRpbHM7XG5cbn0pKTtcbiIsIi8vIGFkZCwgcmVtb3ZlIGNlbGxcbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnLi9mbGlja2l0eScsXG4gICAgICAnZml6enktdWktdXRpbHMvdXRpbHMnXG4gICAgXSwgZnVuY3Rpb24oIEZsaWNraXR5LCB1dGlscyApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCB1dGlscyApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnLi9mbGlja2l0eScpLFxuICAgICAgcmVxdWlyZSgnZml6enktdWktdXRpbHMnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LkZsaWNraXR5LFxuICAgICAgd2luZG93LmZpenp5VUlVdGlsc1xuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCB1dGlscyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBhcHBlbmQgY2VsbHMgdG8gYSBkb2N1bWVudCBmcmFnbWVudFxuZnVuY3Rpb24gZ2V0Q2VsbHNGcmFnbWVudCggY2VsbHMgKSB7XG4gIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgY2VsbHMuZm9yRWFjaCggZnVuY3Rpb24oIGNlbGwgKSB7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGNlbGwuZWxlbWVudCApO1xuICB9KTtcbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBhZGQvcmVtb3ZlIGNlbGwgcHJvdG90eXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnZhciBwcm90byA9IEZsaWNraXR5LnByb3RvdHlwZTtcblxuLyoqXG4gKiBJbnNlcnQsIHByZXBlbmQsIG9yIGFwcGVuZCBjZWxsc1xuICogQHBhcmFtIHtFbGVtZW50LCBBcnJheSwgTm9kZUxpc3R9IGVsZW1zXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGluZGV4XG4gKi9cbnByb3RvLmluc2VydCA9IGZ1bmN0aW9uKCBlbGVtcywgaW5kZXggKSB7XG4gIHZhciBjZWxscyA9IHRoaXMuX21ha2VDZWxscyggZWxlbXMgKTtcbiAgaWYgKCAhY2VsbHMgfHwgIWNlbGxzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGxlbiA9IHRoaXMuY2VsbHMubGVuZ3RoO1xuICAvLyBkZWZhdWx0IHRvIGFwcGVuZFxuICBpbmRleCA9IGluZGV4ID09PSB1bmRlZmluZWQgPyBsZW4gOiBpbmRleDtcbiAgLy8gYWRkIGNlbGxzIHdpdGggZG9jdW1lbnQgZnJhZ21lbnRcbiAgdmFyIGZyYWdtZW50ID0gZ2V0Q2VsbHNGcmFnbWVudCggY2VsbHMgKTtcbiAgLy8gYXBwZW5kIHRvIHNsaWRlclxuICB2YXIgaXNBcHBlbmQgPSBpbmRleCA9PSBsZW47XG4gIGlmICggaXNBcHBlbmQgKSB7XG4gICAgdGhpcy5zbGlkZXIuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGluc2VydENlbGxFbGVtZW50ID0gdGhpcy5jZWxsc1sgaW5kZXggXS5lbGVtZW50O1xuICAgIHRoaXMuc2xpZGVyLmluc2VydEJlZm9yZSggZnJhZ21lbnQsIGluc2VydENlbGxFbGVtZW50ICk7XG4gIH1cbiAgLy8gYWRkIHRvIHRoaXMuY2VsbHNcbiAgaWYgKCBpbmRleCA9PT0gMCApIHtcbiAgICAvLyBwcmVwZW5kLCBhZGQgdG8gc3RhcnRcbiAgICB0aGlzLmNlbGxzID0gY2VsbHMuY29uY2F0KCB0aGlzLmNlbGxzICk7XG4gIH0gZWxzZSBpZiAoIGlzQXBwZW5kICkge1xuICAgIC8vIGFwcGVuZCwgYWRkIHRvIGVuZFxuICAgIHRoaXMuY2VsbHMgPSB0aGlzLmNlbGxzLmNvbmNhdCggY2VsbHMgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpbnNlcnQgaW4gdGhpcy5jZWxsc1xuICAgIHZhciBlbmRDZWxscyA9IHRoaXMuY2VsbHMuc3BsaWNlKCBpbmRleCwgbGVuIC0gaW5kZXggKTtcbiAgICB0aGlzLmNlbGxzID0gdGhpcy5jZWxscy5jb25jYXQoIGNlbGxzICkuY29uY2F0KCBlbmRDZWxscyApO1xuICB9XG5cbiAgdGhpcy5fc2l6ZUNlbGxzKCBjZWxscyApO1xuXG4gIHZhciBzZWxlY3RlZEluZGV4RGVsdGEgPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWRJbmRleCA/IDAgOiBjZWxscy5sZW5ndGg7XG4gIHRoaXMuX2NlbGxBZGRlZFJlbW92ZWQoIGluZGV4LCBzZWxlY3RlZEluZGV4RGVsdGEgKTtcbn07XG5cbnByb3RvLmFwcGVuZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdGhpcy5pbnNlcnQoIGVsZW1zLCB0aGlzLmNlbGxzLmxlbmd0aCApO1xufTtcblxucHJvdG8ucHJlcGVuZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdGhpcy5pbnNlcnQoIGVsZW1zLCAwICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBjZWxsc1xuICogQHBhcmFtIHtFbGVtZW50LCBBcnJheSwgTm9kZUxpc3R9IGVsZW1zXG4gKi9cbnByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdmFyIGNlbGxzID0gdGhpcy5nZXRDZWxscyggZWxlbXMgKTtcbiAgdmFyIHNlbGVjdGVkSW5kZXhEZWx0YSA9IDA7XG4gIHZhciBsZW4gPSBjZWxscy5sZW5ndGg7XG4gIHZhciBpLCBjZWxsO1xuICAvLyBjYWxjdWxhdGUgc2VsZWN0ZWRJbmRleERlbHRhLCBlYXNpZXIgaWYgZG9uZSBpbiBzZXBlcmF0ZSBsb29wXG4gIGZvciAoIGk9MDsgaSA8IGxlbjsgaSsrICkge1xuICAgIGNlbGwgPSBjZWxsc1tpXTtcbiAgICB2YXIgd2FzQmVmb3JlID0gdGhpcy5jZWxscy5pbmRleE9mKCBjZWxsICkgPCB0aGlzLnNlbGVjdGVkSW5kZXg7XG4gICAgc2VsZWN0ZWRJbmRleERlbHRhIC09IHdhc0JlZm9yZSA/IDEgOiAwO1xuICB9XG5cbiAgZm9yICggaT0wOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgY2VsbCA9IGNlbGxzW2ldO1xuICAgIGNlbGwucmVtb3ZlKCk7XG4gICAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSBjb2xsZWN0aW9uXG4gICAgdXRpbHMucmVtb3ZlRnJvbSggdGhpcy5jZWxscywgY2VsbCApO1xuICB9XG5cbiAgaWYgKCBjZWxscy5sZW5ndGggKSB7XG4gICAgLy8gdXBkYXRlIHN0dWZmXG4gICAgdGhpcy5fY2VsbEFkZGVkUmVtb3ZlZCggMCwgc2VsZWN0ZWRJbmRleERlbHRhICk7XG4gIH1cbn07XG5cbi8vIHVwZGF0ZXMgd2hlbiBjZWxscyBhcmUgYWRkZWQgb3IgcmVtb3ZlZFxucHJvdG8uX2NlbGxBZGRlZFJlbW92ZWQgPSBmdW5jdGlvbiggY2hhbmdlZENlbGxJbmRleCwgc2VsZWN0ZWRJbmRleERlbHRhICkge1xuICAvLyBUT0RPIHRoaXMgbWF0aCBpc24ndCBwZXJmZWN0IHdpdGggZ3JvdXBlZCBzbGlkZXNcbiAgc2VsZWN0ZWRJbmRleERlbHRhID0gc2VsZWN0ZWRJbmRleERlbHRhIHx8IDA7XG4gIHRoaXMuc2VsZWN0ZWRJbmRleCArPSBzZWxlY3RlZEluZGV4RGVsdGE7XG4gIHRoaXMuc2VsZWN0ZWRJbmRleCA9IE1hdGgubWF4KCAwLCBNYXRoLm1pbiggdGhpcy5zbGlkZXMubGVuZ3RoIC0gMSwgdGhpcy5zZWxlY3RlZEluZGV4ICkgKTtcblxuICB0aGlzLmNlbGxDaGFuZ2UoIGNoYW5nZWRDZWxsSW5kZXgsIHRydWUgKTtcbiAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgdGhpcy5lbWl0RXZlbnQoICdjZWxsQWRkZWRSZW1vdmVkJywgWyBjaGFuZ2VkQ2VsbEluZGV4LCBzZWxlY3RlZEluZGV4RGVsdGEgXSApO1xufTtcblxuLyoqXG4gKiBsb2dpYyB0byBiZSBydW4gYWZ0ZXIgYSBjZWxsJ3Mgc2l6ZSBjaGFuZ2VzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW0gLSBjZWxsJ3MgZWxlbWVudFxuICovXG5wcm90by5jZWxsU2l6ZUNoYW5nZSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICB2YXIgY2VsbCA9IHRoaXMuZ2V0Q2VsbCggZWxlbSApO1xuICBpZiAoICFjZWxsICkge1xuICAgIHJldHVybjtcbiAgfVxuICBjZWxsLmdldFNpemUoKTtcblxuICB2YXIgaW5kZXggPSB0aGlzLmNlbGxzLmluZGV4T2YoIGNlbGwgKTtcbiAgdGhpcy5jZWxsQ2hhbmdlKCBpbmRleCApO1xufTtcblxuLyoqXG4gKiBsb2dpYyBhbnkgdGltZSBhIGNlbGwgaXMgY2hhbmdlZDogYWRkZWQsIHJlbW92ZWQsIG9yIHNpemUgY2hhbmdlZFxuICogQHBhcmFtIHtJbnRlZ2VyfSBjaGFuZ2VkQ2VsbEluZGV4IC0gaW5kZXggb2YgdGhlIGNoYW5nZWQgY2VsbCwgb3B0aW9uYWxcbiAqL1xucHJvdG8uY2VsbENoYW5nZSA9IGZ1bmN0aW9uKCBjaGFuZ2VkQ2VsbEluZGV4LCBpc1Bvc2l0aW9uaW5nU2xpZGVyICkge1xuICB2YXIgcHJldlNsaWRlYWJsZVdpZHRoID0gdGhpcy5zbGlkZWFibGVXaWR0aDtcbiAgdGhpcy5fcG9zaXRpb25DZWxscyggY2hhbmdlZENlbGxJbmRleCApO1xuICB0aGlzLl9nZXRXcmFwU2hpZnRDZWxscygpO1xuICB0aGlzLnNldEdhbGxlcnlTaXplKCk7XG4gIHRoaXMuZW1pdEV2ZW50KCAnY2VsbENoYW5nZScsIFsgY2hhbmdlZENlbGxJbmRleCBdICk7XG4gIC8vIHBvc2l0aW9uIHNsaWRlclxuICBpZiAoIHRoaXMub3B0aW9ucy5mcmVlU2Nyb2xsICkge1xuICAgIC8vIHNoaWZ0IHggYnkgY2hhbmdlIGluIHNsaWRlYWJsZVdpZHRoXG4gICAgLy8gVE9ETyBmaXggcG9zaXRpb24gc2hpZnRzIHdoZW4gcHJlcGVuZGluZyB3LyBmcmVlU2Nyb2xsXG4gICAgdmFyIGRlbHRhWCA9IHByZXZTbGlkZWFibGVXaWR0aCAtIHRoaXMuc2xpZGVhYmxlV2lkdGg7XG4gICAgdGhpcy54ICs9IGRlbHRhWCAqIHRoaXMuY2VsbEFsaWduO1xuICAgIHRoaXMucG9zaXRpb25TbGlkZXIoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBkbyBub3QgcG9zaXRpb24gc2xpZGVyIGFmdGVyIGxhenkgbG9hZFxuICAgIGlmICggaXNQb3NpdGlvbmluZ1NsaWRlciApIHtcbiAgICAgIHRoaXMucG9zaXRpb25TbGlkZXJBdFNlbGVjdGVkKCk7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0KCB0aGlzLnNlbGVjdGVkSW5kZXggKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbnJldHVybiBGbGlja2l0eTtcblxufSkpO1xuIiwiLy8gYW5pbWF0ZVxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICdmaXp6eS11aS11dGlscy91dGlscydcbiAgICBdLCBmdW5jdGlvbiggdXRpbHMgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCB1dGlscyApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnZml6enktdWktdXRpbHMnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuRmxpY2tpdHkgPSB3aW5kb3cuRmxpY2tpdHkgfHwge307XG4gICAgd2luZG93LkZsaWNraXR5LmFuaW1hdGVQcm90b3R5cGUgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LmZpenp5VUlVdGlsc1xuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIHV0aWxzICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHJlcXVlc3RBbmltYXRpb25GcmFtZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vLyBnZXQgckFGLCBwcmVmaXhlZCwgaWYgcHJlc2VudFxudmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuLy8gZmFsbGJhY2sgdG8gc2V0VGltZW91dFxudmFyIGxhc3RUaW1lID0gMDtcbmlmICggIXJlcXVlc3RBbmltYXRpb25GcmFtZSApICB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcbiAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KCAwLCAxNiAtICggY3VyclRpbWUgLSBsYXN0VGltZSApICk7XG4gICAgdmFyIGlkID0gc2V0VGltZW91dCggY2FsbGJhY2ssIHRpbWVUb0NhbGwgKTtcbiAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICByZXR1cm4gaWQ7XG4gIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGFuaW1hdGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudmFyIHByb3RvID0ge307XG5cbnByb3RvLnN0YXJ0QW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5pc0FuaW1hdGluZyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgdGhpcy5yZXN0aW5nRnJhbWVzID0gMDtcbiAgdGhpcy5hbmltYXRlKCk7XG59O1xuXG5wcm90by5hbmltYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYXBwbHlEcmFnRm9yY2UoKTtcbiAgdGhpcy5hcHBseVNlbGVjdGVkQXR0cmFjdGlvbigpO1xuXG4gIHZhciBwcmV2aW91c1ggPSB0aGlzLng7XG5cbiAgdGhpcy5pbnRlZ3JhdGVQaHlzaWNzKCk7XG4gIHRoaXMucG9zaXRpb25TbGlkZXIoKTtcbiAgdGhpcy5zZXR0bGUoIHByZXZpb3VzWCApO1xuICAvLyBhbmltYXRlIG5leHQgZnJhbWVcbiAgaWYgKCB0aGlzLmlzQW5pbWF0aW5nICkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmdW5jdGlvbiBhbmltYXRlRnJhbWUoKSB7XG4gICAgICBfdGhpcy5hbmltYXRlKCk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxudmFyIHRyYW5zZm9ybVByb3BlcnR5ID0gKCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcbiAgaWYgKCB0eXBlb2Ygc3R5bGUudHJhbnNmb3JtID09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiAndHJhbnNmb3JtJztcbiAgfVxuICByZXR1cm4gJ1dlYmtpdFRyYW5zZm9ybSc7XG59KSgpO1xuXG5wcm90by5wb3NpdGlvblNsaWRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMueDtcbiAgLy8gd3JhcCBwb3NpdGlvbiBhcm91bmRcbiAgaWYgKCB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCAmJiB0aGlzLmNlbGxzLmxlbmd0aCA+IDEgKSB7XG4gICAgeCA9IHV0aWxzLm1vZHVsbyggeCwgdGhpcy5zbGlkZWFibGVXaWR0aCApO1xuICAgIHggPSB4IC0gdGhpcy5zbGlkZWFibGVXaWR0aDtcbiAgICB0aGlzLnNoaWZ0V3JhcENlbGxzKCB4ICk7XG4gIH1cblxuICB4ID0geCArIHRoaXMuY3Vyc29yUG9zaXRpb247XG4gIC8vIHJldmVyc2UgaWYgcmlnaHQtdG8tbGVmdCBhbmQgdXNpbmcgdHJhbnNmb3JtXG4gIHggPSB0aGlzLm9wdGlvbnMucmlnaHRUb0xlZnQgJiYgdHJhbnNmb3JtUHJvcGVydHkgPyAteCA6IHg7XG4gIHZhciB2YWx1ZSA9IHRoaXMuZ2V0UG9zaXRpb25WYWx1ZSggeCApO1xuICAvLyB1c2UgM0QgdHJhbmZvcm1zIGZvciBoYXJkd2FyZSBhY2NlbGVyYXRpb24gb24gaU9TXG4gIC8vIGJ1dCB1c2UgMkQgd2hlbiBzZXR0bGVkLCBmb3IgYmV0dGVyIGZvbnQtcmVuZGVyaW5nXG4gIHRoaXMuc2xpZGVyLnN0eWxlWyB0cmFuc2Zvcm1Qcm9wZXJ0eSBdID0gdGhpcy5pc0FuaW1hdGluZyA/XG4gICAgJ3RyYW5zbGF0ZTNkKCcgKyB2YWx1ZSArICcsMCwwKScgOiAndHJhbnNsYXRlWCgnICsgdmFsdWUgKyAnKSc7XG5cbiAgLy8gc2Nyb2xsIGV2ZW50XG4gIHZhciBmaXJzdFNsaWRlID0gdGhpcy5zbGlkZXNbMF07XG4gIGlmICggZmlyc3RTbGlkZSApIHtcbiAgICB2YXIgcG9zaXRpb25YID0gLXRoaXMueCAtIGZpcnN0U2xpZGUudGFyZ2V0O1xuICAgIHZhciBwcm9ncmVzcyA9IHBvc2l0aW9uWCAvIHRoaXMuc2xpZGVzV2lkdGg7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KCAnc2Nyb2xsJywgbnVsbCwgWyBwcm9ncmVzcywgcG9zaXRpb25YIF0gKTtcbiAgfVxufTtcblxucHJvdG8ucG9zaXRpb25TbGlkZXJBdFNlbGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuY2VsbHMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnggPSAtdGhpcy5zZWxlY3RlZFNsaWRlLnRhcmdldDtcbiAgdGhpcy5wb3NpdGlvblNsaWRlcigpO1xufTtcblxucHJvdG8uZ2V0UG9zaXRpb25WYWx1ZSA9IGZ1bmN0aW9uKCBwb3NpdGlvbiApIHtcbiAgaWYgKCB0aGlzLm9wdGlvbnMucGVyY2VudFBvc2l0aW9uICkge1xuICAgIC8vIHBlcmNlbnQgcG9zaXRpb24sIHJvdW5kIHRvIDIgZGlnaXRzLCBsaWtlIDEyLjM0JVxuICAgIHJldHVybiAoIE1hdGgucm91bmQoICggcG9zaXRpb24gLyB0aGlzLnNpemUuaW5uZXJXaWR0aCApICogMTAwMDAgKSAqIDAuMDEgKSsgJyUnO1xuICB9IGVsc2Uge1xuICAgIC8vIHBpeGVsIHBvc2l0aW9uaW5nXG4gICAgcmV0dXJuIE1hdGgucm91bmQoIHBvc2l0aW9uICkgKyAncHgnO1xuICB9XG59O1xuXG5wcm90by5zZXR0bGUgPSBmdW5jdGlvbiggcHJldmlvdXNYICkge1xuICAvLyBrZWVwIHRyYWNrIG9mIGZyYW1lcyB3aGVyZSB4IGhhc24ndCBtb3ZlZFxuICBpZiAoICF0aGlzLmlzUG9pbnRlckRvd24gJiYgTWF0aC5yb3VuZCggdGhpcy54ICogMTAwICkgPT0gTWF0aC5yb3VuZCggcHJldmlvdXNYICogMTAwICkgKSB7XG4gICAgdGhpcy5yZXN0aW5nRnJhbWVzKys7XG4gIH1cbiAgLy8gc3RvcCBhbmltYXRpbmcgaWYgcmVzdGluZyBmb3IgMyBvciBtb3JlIGZyYW1lc1xuICBpZiAoIHRoaXMucmVzdGluZ0ZyYW1lcyA+IDIgKSB7XG4gICAgdGhpcy5pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgIGRlbGV0ZSB0aGlzLmlzRnJlZVNjcm9sbGluZztcbiAgICAvLyByZW5kZXIgcG9zaXRpb24gd2l0aCB0cmFuc2xhdGVYIHdoZW4gc2V0dGxlZFxuICAgIHRoaXMucG9zaXRpb25TbGlkZXIoKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3NldHRsZScpO1xuICB9XG59O1xuXG5wcm90by5zaGlmdFdyYXBDZWxscyA9IGZ1bmN0aW9uKCB4ICkge1xuICAvLyBzaGlmdCBiZWZvcmUgY2VsbHNcbiAgdmFyIGJlZm9yZUdhcCA9IHRoaXMuY3Vyc29yUG9zaXRpb24gKyB4O1xuICB0aGlzLl9zaGlmdENlbGxzKCB0aGlzLmJlZm9yZVNoaWZ0Q2VsbHMsIGJlZm9yZUdhcCwgLTEgKTtcbiAgLy8gc2hpZnQgYWZ0ZXIgY2VsbHNcbiAgdmFyIGFmdGVyR2FwID0gdGhpcy5zaXplLmlubmVyV2lkdGggLSAoIHggKyB0aGlzLnNsaWRlYWJsZVdpZHRoICsgdGhpcy5jdXJzb3JQb3NpdGlvbiApO1xuICB0aGlzLl9zaGlmdENlbGxzKCB0aGlzLmFmdGVyU2hpZnRDZWxscywgYWZ0ZXJHYXAsIDEgKTtcbn07XG5cbnByb3RvLl9zaGlmdENlbGxzID0gZnVuY3Rpb24oIGNlbGxzLCBnYXAsIHNoaWZ0ICkge1xuICBmb3IgKCB2YXIgaT0wOyBpIDwgY2VsbHMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGNlbGwgPSBjZWxsc1tpXTtcbiAgICB2YXIgY2VsbFNoaWZ0ID0gZ2FwID4gMCA/IHNoaWZ0IDogMDtcbiAgICBjZWxsLndyYXBTaGlmdCggY2VsbFNoaWZ0ICk7XG4gICAgZ2FwIC09IGNlbGwuc2l6ZS5vdXRlcldpZHRoO1xuICB9XG59O1xuXG5wcm90by5fdW5zaGlmdENlbGxzID0gZnVuY3Rpb24oIGNlbGxzICkge1xuICBpZiAoICFjZWxscyB8fCAhY2VsbHMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKCB2YXIgaT0wOyBpIDwgY2VsbHMubGVuZ3RoOyBpKysgKSB7XG4gICAgY2VsbHNbaV0ud3JhcFNoaWZ0KCAwICk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHBoeXNpY3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxucHJvdG8uaW50ZWdyYXRlUGh5c2ljcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnggKz0gdGhpcy52ZWxvY2l0eTtcbiAgdGhpcy52ZWxvY2l0eSAqPSB0aGlzLmdldEZyaWN0aW9uRmFjdG9yKCk7XG59O1xuXG5wcm90by5hcHBseUZvcmNlID0gZnVuY3Rpb24oIGZvcmNlICkge1xuICB0aGlzLnZlbG9jaXR5ICs9IGZvcmNlO1xufTtcblxucHJvdG8uZ2V0RnJpY3Rpb25GYWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDEgLSB0aGlzLm9wdGlvbnNbIHRoaXMuaXNGcmVlU2Nyb2xsaW5nID8gJ2ZyZWVTY3JvbGxGcmljdGlvbicgOiAnZnJpY3Rpb24nIF07XG59O1xuXG5wcm90by5nZXRSZXN0aW5nUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gbXkgdGhhbmtzIHRvIFN0ZXZlbiBXaXR0ZW5zLCB3aG8gc2ltcGxpZmllZCB0aGlzIG1hdGggZ3JlYXRseVxuICByZXR1cm4gdGhpcy54ICsgdGhpcy52ZWxvY2l0eSAvICggMSAtIHRoaXMuZ2V0RnJpY3Rpb25GYWN0b3IoKSApO1xufTtcblxucHJvdG8uYXBwbHlEcmFnRm9yY2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5pc1BvaW50ZXJEb3duICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBjaGFuZ2UgdGhlIHBvc2l0aW9uIHRvIGRyYWcgcG9zaXRpb24gYnkgYXBwbHlpbmcgZm9yY2VcbiAgdmFyIGRyYWdWZWxvY2l0eSA9IHRoaXMuZHJhZ1ggLSB0aGlzLng7XG4gIHZhciBkcmFnRm9yY2UgPSBkcmFnVmVsb2NpdHkgLSB0aGlzLnZlbG9jaXR5O1xuICB0aGlzLmFwcGx5Rm9yY2UoIGRyYWdGb3JjZSApO1xufTtcblxucHJvdG8uYXBwbHlTZWxlY3RlZEF0dHJhY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gZG8gbm90IGF0dHJhY3QgaWYgcG9pbnRlciBkb3duIG9yIG5vIGNlbGxzXG4gIGlmICggdGhpcy5pc1BvaW50ZXJEb3duIHx8IHRoaXMuaXNGcmVlU2Nyb2xsaW5nIHx8ICF0aGlzLmNlbGxzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGRpc3RhbmNlID0gdGhpcy5zZWxlY3RlZFNsaWRlLnRhcmdldCAqIC0xIC0gdGhpcy54O1xuICB2YXIgZm9yY2UgPSBkaXN0YW5jZSAqIHRoaXMub3B0aW9ucy5zZWxlY3RlZEF0dHJhY3Rpb247XG4gIHRoaXMuYXBwbHlGb3JjZSggZm9yY2UgKTtcbn07XG5cbnJldHVybiBwcm90bztcblxufSkpO1xuIiwiLy8gRmxpY2tpdHkuQ2VsbFxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICdnZXQtc2l6ZS9nZXQtc2l6ZSdcbiAgICBdLCBmdW5jdGlvbiggZ2V0U2l6ZSApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIGdldFNpemUgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ2dldC1zaXplJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93LkZsaWNraXR5ID0gd2luZG93LkZsaWNraXR5IHx8IHt9O1xuICAgIHdpbmRvdy5GbGlja2l0eS5DZWxsID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5nZXRTaXplXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgZ2V0U2l6ZSApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBDZWxsKCBlbGVtLCBwYXJlbnQgKSB7XG4gIHRoaXMuZWxlbWVudCA9IGVsZW07XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gIHRoaXMuY3JlYXRlKCk7XG59XG5cbnZhciBwcm90byA9IENlbGwucHJvdG90eXBlO1xuXG5wcm90by5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgdGhpcy54ID0gMDtcbiAgdGhpcy5zaGlmdCA9IDA7XG59O1xuXG5wcm90by5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIC8vIHJlc2V0IHN0eWxlXG4gIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICB2YXIgc2lkZSA9IHRoaXMucGFyZW50Lm9yaWdpblNpZGU7XG4gIHRoaXMuZWxlbWVudC5zdHlsZVsgc2lkZSBdID0gJyc7XG59O1xuXG5wcm90by5nZXRTaXplID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc2l6ZSA9IGdldFNpemUoIHRoaXMuZWxlbWVudCApO1xufTtcblxucHJvdG8uc2V0UG9zaXRpb24gPSBmdW5jdGlvbiggeCApIHtcbiAgdGhpcy54ID0geDtcbiAgdGhpcy51cGRhdGVUYXJnZXQoKTtcbiAgdGhpcy5yZW5kZXJQb3NpdGlvbiggeCApO1xufTtcblxuLy8gc2V0RGVmYXVsdFRhcmdldCB2MSBtZXRob2QsIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCByZW1vdmUgaW4gdjNcbnByb3RvLnVwZGF0ZVRhcmdldCA9IHByb3RvLnNldERlZmF1bHRUYXJnZXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1hcmdpblByb3BlcnR5ID0gdGhpcy5wYXJlbnQub3JpZ2luU2lkZSA9PSAnbGVmdCcgPyAnbWFyZ2luTGVmdCcgOiAnbWFyZ2luUmlnaHQnO1xuICB0aGlzLnRhcmdldCA9IHRoaXMueCArIHRoaXMuc2l6ZVsgbWFyZ2luUHJvcGVydHkgXSArXG4gICAgdGhpcy5zaXplLndpZHRoICogdGhpcy5wYXJlbnQuY2VsbEFsaWduO1xufTtcblxucHJvdG8ucmVuZGVyUG9zaXRpb24gPSBmdW5jdGlvbiggeCApIHtcbiAgLy8gcmVuZGVyIHBvc2l0aW9uIG9mIGNlbGwgd2l0aCBpbiBzbGlkZXJcbiAgdmFyIHNpZGUgPSB0aGlzLnBhcmVudC5vcmlnaW5TaWRlO1xuICB0aGlzLmVsZW1lbnQuc3R5bGVbIHNpZGUgXSA9IHRoaXMucGFyZW50LmdldFBvc2l0aW9uVmFsdWUoIHggKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtJbnRlZ2VyfSBmYWN0b3IgLSAwLCAxLCBvciAtMVxuKiovXG5wcm90by53cmFwU2hpZnQgPSBmdW5jdGlvbiggc2hpZnQgKSB7XG4gIHRoaXMuc2hpZnQgPSBzaGlmdDtcbiAgdGhpcy5yZW5kZXJQb3NpdGlvbiggdGhpcy54ICsgdGhpcy5wYXJlbnQuc2xpZGVhYmxlV2lkdGggKiBzaGlmdCApO1xufTtcblxucHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzLmVsZW1lbnQgKTtcbn07XG5cbnJldHVybiBDZWxsO1xuXG59KSk7XG4iLCIvLyBkcmFnXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJy4vZmxpY2tpdHknLFxuICAgICAgJ3VuaWRyYWdnZXIvdW5pZHJhZ2dlcicsXG4gICAgICAnZml6enktdWktdXRpbHMvdXRpbHMnXG4gICAgXSwgZnVuY3Rpb24oIEZsaWNraXR5LCBVbmlkcmFnZ2VyLCB1dGlscyApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCBVbmlkcmFnZ2VyLCB1dGlscyApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnLi9mbGlja2l0eScpLFxuICAgICAgcmVxdWlyZSgndW5pZHJhZ2dlcicpLFxuICAgICAgcmVxdWlyZSgnZml6enktdWktdXRpbHMnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuRmxpY2tpdHkgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LkZsaWNraXR5LFxuICAgICAgd2luZG93LlVuaWRyYWdnZXIsXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIFVuaWRyYWdnZXIsIHV0aWxzICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tIGRlZmF1bHRzIC0tLS0tIC8vXG5cbnV0aWxzLmV4dGVuZCggRmxpY2tpdHkuZGVmYXVsdHMsIHtcbiAgZHJhZ2dhYmxlOiB0cnVlLFxuICBkcmFnVGhyZXNob2xkOiAzLFxufSk7XG5cbi8vIC0tLS0tIGNyZWF0ZSAtLS0tLSAvL1xuXG5GbGlja2l0eS5jcmVhdGVNZXRob2RzLnB1c2goJ19jcmVhdGVEcmFnJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRyYWcgcHJvdG90eXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnZhciBwcm90byA9IEZsaWNraXR5LnByb3RvdHlwZTtcbnV0aWxzLmV4dGVuZCggcHJvdG8sIFVuaWRyYWdnZXIucHJvdG90eXBlICk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG52YXIgaXNUb3VjaCA9ICdjcmVhdGVUb3VjaCcgaW4gZG9jdW1lbnQ7XG52YXIgaXNUb3VjaG1vdmVTY3JvbGxDYW5jZWxlZCA9IGZhbHNlO1xuXG5wcm90by5fY3JlYXRlRHJhZyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9uKCAnYWN0aXZhdGUnLCB0aGlzLmJpbmREcmFnICk7XG4gIHRoaXMub24oICd1aUNoYW5nZScsIHRoaXMuX3VpQ2hhbmdlRHJhZyApO1xuICB0aGlzLm9uKCAnY2hpbGRVSVBvaW50ZXJEb3duJywgdGhpcy5fY2hpbGRVSVBvaW50ZXJEb3duRHJhZyApO1xuICB0aGlzLm9uKCAnZGVhY3RpdmF0ZScsIHRoaXMudW5iaW5kRHJhZyApO1xuICAvLyBIQUNLIC0gYWRkIHNlZW1pbmdseSBpbm5vY3VvdXMgaGFuZGxlciB0byBmaXggaU9TIDEwIHNjcm9sbCBiZWhhdmlvclxuICAvLyAjNDU3LCBSdWJhWGEvU29ydGFibGUjOTczXG4gIGlmICggaXNUb3VjaCAmJiAhaXNUb3VjaG1vdmVTY3JvbGxDYW5jZWxlZCApIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIGZ1bmN0aW9uKCkge30pO1xuICAgIGlzVG91Y2htb3ZlU2Nyb2xsQ2FuY2VsZWQgPSB0cnVlO1xuICB9XG59O1xuXG5wcm90by5iaW5kRHJhZyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLm9wdGlvbnMuZHJhZ2dhYmxlIHx8IHRoaXMuaXNEcmFnQm91bmQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1kcmFnZ2FibGUnKTtcbiAgdGhpcy5oYW5kbGVzID0gWyB0aGlzLnZpZXdwb3J0IF07XG4gIHRoaXMuYmluZEhhbmRsZXMoKTtcbiAgdGhpcy5pc0RyYWdCb3VuZCA9IHRydWU7XG59O1xuXG5wcm90by51bmJpbmREcmFnID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuaXNEcmFnQm91bmQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1kcmFnZ2FibGUnKTtcbiAgdGhpcy51bmJpbmRIYW5kbGVzKCk7XG4gIGRlbGV0ZSB0aGlzLmlzRHJhZ0JvdW5kO1xufTtcblxucHJvdG8uX3VpQ2hhbmdlRHJhZyA9IGZ1bmN0aW9uKCkge1xuICBkZWxldGUgdGhpcy5pc0ZyZWVTY3JvbGxpbmc7XG59O1xuXG5wcm90by5fY2hpbGRVSVBvaW50ZXJEb3duRHJhZyA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgdGhpcy5wb2ludGVyRG93bkZvY3VzKCBldmVudCApO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gcG9pbnRlciBldmVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gbm9kZXMgdGhhdCBoYXZlIHRleHQgZmllbGRzXG52YXIgY3Vyc29yTm9kZXMgPSB7XG4gIFRFWFRBUkVBOiB0cnVlLFxuICBJTlBVVDogdHJ1ZSxcbiAgT1BUSU9OOiB0cnVlLFxufTtcblxuLy8gaW5wdXQgdHlwZXMgdGhhdCBkbyBub3QgaGF2ZSB0ZXh0IGZpZWxkc1xudmFyIGNsaWNrVHlwZXMgPSB7XG4gIHJhZGlvOiB0cnVlLFxuICBjaGVja2JveDogdHJ1ZSxcbiAgYnV0dG9uOiB0cnVlLFxuICBzdWJtaXQ6IHRydWUsXG4gIGltYWdlOiB0cnVlLFxuICBmaWxlOiB0cnVlLFxufTtcblxucHJvdG8ucG9pbnRlckRvd24gPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIC8vIGRpc21pc3MgaW5wdXRzIHdpdGggdGV4dCBmaWVsZHMuICM0MDMsICM0MDRcbiAgdmFyIGlzQ3Vyc29ySW5wdXQgPSBjdXJzb3JOb2Rlc1sgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lIF0gJiZcbiAgICAhY2xpY2tUeXBlc1sgZXZlbnQudGFyZ2V0LnR5cGUgXTtcbiAgaWYgKCBpc0N1cnNvcklucHV0ICkge1xuICAgIC8vIHJlc2V0IHBvaW50ZXJEb3duIGxvZ2ljXG4gICAgdGhpcy5pc1BvaW50ZXJEb3duID0gZmFsc2U7XG4gICAgZGVsZXRlIHRoaXMucG9pbnRlcklkZW50aWZpZXI7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fZHJhZ1BvaW50ZXJEb3duKCBldmVudCwgcG9pbnRlciApO1xuXG4gIC8vIGtsdWRnZSB0byBibHVyIGZvY3VzZWQgaW5wdXRzIGluIGRyYWdnZXJcbiAgdmFyIGZvY3VzZWQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICBpZiAoIGZvY3VzZWQgJiYgZm9jdXNlZC5ibHVyICYmIGZvY3VzZWQgIT0gdGhpcy5lbGVtZW50ICYmXG4gICAgLy8gZG8gbm90IGJsdXIgYm9keSBmb3IgSUU5ICYgMTAsICMxMTdcbiAgICBmb2N1c2VkICE9IGRvY3VtZW50LmJvZHkgKSB7XG4gICAgZm9jdXNlZC5ibHVyKCk7XG4gIH1cbiAgdGhpcy5wb2ludGVyRG93bkZvY3VzKCBldmVudCApO1xuICAvLyBzdG9wIGlmIGl0IHdhcyBtb3ZpbmdcbiAgdGhpcy5kcmFnWCA9IHRoaXMueDtcbiAgdGhpcy52aWV3cG9ydC5jbGFzc0xpc3QuYWRkKCdpcy1wb2ludGVyLWRvd24nKTtcbiAgLy8gYmluZCBtb3ZlIGFuZCBlbmQgZXZlbnRzXG4gIHRoaXMuX2JpbmRQb3N0U3RhcnRFdmVudHMoIGV2ZW50ICk7XG4gIC8vIHRyYWNrIHNjcm9sbGluZ1xuICB0aGlzLnBvaW50ZXJEb3duU2Nyb2xsID0gZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCB0aGlzICk7XG5cbiAgdGhpcy5kaXNwYXRjaEV2ZW50KCAncG9pbnRlckRvd24nLCBldmVudCwgWyBwb2ludGVyIF0gKTtcbn07XG5cbnZhciB0b3VjaFN0YXJ0RXZlbnRzID0ge1xuICB0b3VjaHN0YXJ0OiB0cnVlLFxuICBNU1BvaW50ZXJEb3duOiB0cnVlXG59O1xuXG52YXIgZm9jdXNOb2RlcyA9IHtcbiAgSU5QVVQ6IHRydWUsXG4gIFNFTEVDVDogdHJ1ZVxufTtcblxucHJvdG8ucG9pbnRlckRvd25Gb2N1cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgLy8gZm9jdXMgZWxlbWVudCwgaWYgbm90IHRvdWNoLCBhbmQgaXRzIG5vdCBhbiBpbnB1dCBvciBzZWxlY3RcbiAgaWYgKCAhdGhpcy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgfHwgdG91Y2hTdGFydEV2ZW50c1sgZXZlbnQudHlwZSBdIHx8XG4gICAgICBmb2N1c05vZGVzWyBldmVudC50YXJnZXQubm9kZU5hbWUgXSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHByZXZTY3JvbGxZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICB0aGlzLmVsZW1lbnQuZm9jdXMoKTtcbiAgLy8gaGFjayB0byBmaXggc2Nyb2xsIGp1bXAgYWZ0ZXIgZm9jdXMsICM3NlxuICBpZiAoIHdpbmRvdy5wYWdlWU9mZnNldCAhPSBwcmV2U2Nyb2xsWSApIHtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oIHdpbmRvdy5wYWdlWE9mZnNldCwgcHJldlNjcm9sbFkgKTtcbiAgfVxufTtcblxucHJvdG8uY2FuUHJldmVudERlZmF1bHRPblBvaW50ZXJEb3duID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICAvLyBwcmV2ZW50IGRlZmF1bHQsIHVubGVzcyB0b3VjaHN0YXJ0IG9yIDxzZWxlY3Q+XG4gIHZhciBpc1RvdWNoc3RhcnQgPSBldmVudC50eXBlID09ICd0b3VjaHN0YXJ0JztcbiAgdmFyIHRhcmdldE5vZGVOYW1lID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lO1xuICByZXR1cm4gIWlzVG91Y2hzdGFydCAmJiB0YXJnZXROb2RlTmFtZSAhPSAnU0VMRUNUJztcbn07XG5cbi8vIC0tLS0tIG1vdmUgLS0tLS0gLy9cblxucHJvdG8uaGFzRHJhZ1N0YXJ0ZWQgPSBmdW5jdGlvbiggbW92ZVZlY3RvciApIHtcbiAgcmV0dXJuIE1hdGguYWJzKCBtb3ZlVmVjdG9yLnggKSA+IHRoaXMub3B0aW9ucy5kcmFnVGhyZXNob2xkO1xufTtcblxuLy8gLS0tLS0gdXAgLS0tLS0gLy9cblxucHJvdG8ucG9pbnRlclVwID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICBkZWxldGUgdGhpcy5pc1RvdWNoU2Nyb2xsaW5nO1xuICB0aGlzLnZpZXdwb3J0LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBvaW50ZXItZG93bicpO1xuICB0aGlzLmRpc3BhdGNoRXZlbnQoICdwb2ludGVyVXAnLCBldmVudCwgWyBwb2ludGVyIF0gKTtcbiAgdGhpcy5fZHJhZ1BvaW50ZXJVcCggZXZlbnQsIHBvaW50ZXIgKTtcbn07XG5cbnByb3RvLnBvaW50ZXJEb25lID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgdGhpcyApO1xuICBkZWxldGUgdGhpcy5wb2ludGVyRG93blNjcm9sbDtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRyYWdnaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnByb3RvLmRyYWdTdGFydCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5kcmFnU3RhcnRQb3NpdGlvbiA9IHRoaXMueDtcbiAgdGhpcy5zdGFydEFuaW1hdGlvbigpO1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIHRoaXMgKTtcbiAgdGhpcy5kaXNwYXRjaEV2ZW50KCAnZHJhZ1N0YXJ0JywgZXZlbnQsIFsgcG9pbnRlciBdICk7XG59O1xuXG5wcm90by5wb2ludGVyTW92ZSA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdmFyIG1vdmVWZWN0b3IgPSB0aGlzLl9kcmFnUG9pbnRlck1vdmUoIGV2ZW50LCBwb2ludGVyICk7XG4gIHRoaXMuZGlzcGF0Y2hFdmVudCggJ3BvaW50ZXJNb3ZlJywgZXZlbnQsIFsgcG9pbnRlciwgbW92ZVZlY3RvciBdICk7XG4gIHRoaXMuX2RyYWdNb3ZlKCBldmVudCwgcG9pbnRlciwgbW92ZVZlY3RvciApO1xufTtcblxucHJvdG8uZHJhZ01vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgdGhpcy5wcmV2aW91c0RyYWdYID0gdGhpcy5kcmFnWDtcbiAgLy8gcmV2ZXJzZSBpZiByaWdodC10by1sZWZ0XG4gIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wdGlvbnMucmlnaHRUb0xlZnQgPyAtMSA6IDE7XG4gIHZhciBkcmFnWCA9IHRoaXMuZHJhZ1N0YXJ0UG9zaXRpb24gKyBtb3ZlVmVjdG9yLnggKiBkaXJlY3Rpb247XG5cbiAgaWYgKCAhdGhpcy5vcHRpb25zLndyYXBBcm91bmQgJiYgdGhpcy5zbGlkZXMubGVuZ3RoICkge1xuICAgIC8vIHNsb3cgZHJhZ1xuICAgIHZhciBvcmlnaW5Cb3VuZCA9IE1hdGgubWF4KCAtdGhpcy5zbGlkZXNbMF0udGFyZ2V0LCB0aGlzLmRyYWdTdGFydFBvc2l0aW9uICk7XG4gICAgZHJhZ1ggPSBkcmFnWCA+IG9yaWdpbkJvdW5kID8gKCBkcmFnWCArIG9yaWdpbkJvdW5kICkgKiAwLjUgOiBkcmFnWDtcbiAgICB2YXIgZW5kQm91bmQgPSBNYXRoLm1pbiggLXRoaXMuZ2V0TGFzdFNsaWRlKCkudGFyZ2V0LCB0aGlzLmRyYWdTdGFydFBvc2l0aW9uICk7XG4gICAgZHJhZ1ggPSBkcmFnWCA8IGVuZEJvdW5kID8gKCBkcmFnWCArIGVuZEJvdW5kICkgKiAwLjUgOiBkcmFnWDtcbiAgfVxuXG4gIHRoaXMuZHJhZ1ggPSBkcmFnWDtcblxuICB0aGlzLmRyYWdNb3ZlVGltZSA9IG5ldyBEYXRlKCk7XG4gIHRoaXMuZGlzcGF0Y2hFdmVudCggJ2RyYWdNb3ZlJywgZXZlbnQsIFsgcG9pbnRlciwgbW92ZVZlY3RvciBdICk7XG59O1xuXG5wcm90by5kcmFnRW5kID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICBpZiAoIHRoaXMub3B0aW9ucy5mcmVlU2Nyb2xsICkge1xuICAgIHRoaXMuaXNGcmVlU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuICAvLyBzZXQgc2VsZWN0ZWRJbmRleCBiYXNlZCBvbiB3aGVyZSBmbGljayB3aWxsIGVuZCB1cFxuICB2YXIgaW5kZXggPSB0aGlzLmRyYWdFbmRSZXN0aW5nU2VsZWN0KCk7XG5cbiAgaWYgKCB0aGlzLm9wdGlvbnMuZnJlZVNjcm9sbCAmJiAhdGhpcy5vcHRpb25zLndyYXBBcm91bmQgKSB7XG4gICAgLy8gaWYgZnJlZS1zY3JvbGwgJiBub3Qgd3JhcCBhcm91bmRcbiAgICAvLyBkbyBub3QgZnJlZS1zY3JvbGwgaWYgZ29pbmcgb3V0c2lkZSBvZiBib3VuZGluZyBzbGlkZXNcbiAgICAvLyBzbyBib3VuZGluZyBzbGlkZXMgY2FuIGF0dHJhY3Qgc2xpZGVyLCBhbmQga2VlcCBpdCBpbiBib3VuZHNcbiAgICB2YXIgcmVzdGluZ1ggPSB0aGlzLmdldFJlc3RpbmdQb3NpdGlvbigpO1xuICAgIHRoaXMuaXNGcmVlU2Nyb2xsaW5nID0gLXJlc3RpbmdYID4gdGhpcy5zbGlkZXNbMF0udGFyZ2V0ICYmXG4gICAgICAtcmVzdGluZ1ggPCB0aGlzLmdldExhc3RTbGlkZSgpLnRhcmdldDtcbiAgfSBlbHNlIGlmICggIXRoaXMub3B0aW9ucy5mcmVlU2Nyb2xsICYmIGluZGV4ID09IHRoaXMuc2VsZWN0ZWRJbmRleCApIHtcbiAgICAvLyBib29zdCBzZWxlY3Rpb24gaWYgc2VsZWN0ZWQgaW5kZXggaGFzIG5vdCBjaGFuZ2VkXG4gICAgaW5kZXggKz0gdGhpcy5kcmFnRW5kQm9vc3RTZWxlY3QoKTtcbiAgfVxuICBkZWxldGUgdGhpcy5wcmV2aW91c0RyYWdYO1xuICAvLyBhcHBseSBzZWxlY3Rpb25cbiAgLy8gVE9ETyByZWZhY3RvciB0aGlzLCBzZWxlY3RpbmcgaGVyZSBmZWVscyB3ZWlyZFxuICAvLyBIQUNLLCBzZXQgZmxhZyBzbyBkcmFnZ2luZyBzdGF5cyBpbiBjb3JyZWN0IGRpcmVjdGlvblxuICB0aGlzLmlzRHJhZ1NlbGVjdCA9IHRoaXMub3B0aW9ucy53cmFwQXJvdW5kO1xuICB0aGlzLnNlbGVjdCggaW5kZXggKTtcbiAgZGVsZXRlIHRoaXMuaXNEcmFnU2VsZWN0O1xuICB0aGlzLmRpc3BhdGNoRXZlbnQoICdkcmFnRW5kJywgZXZlbnQsIFsgcG9pbnRlciBdICk7XG59O1xuXG5wcm90by5kcmFnRW5kUmVzdGluZ1NlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdGluZ1ggPSB0aGlzLmdldFJlc3RpbmdQb3NpdGlvbigpO1xuICAvLyBob3cgZmFyIGF3YXkgZnJvbSBzZWxlY3RlZCBzbGlkZVxuICB2YXIgZGlzdGFuY2UgPSBNYXRoLmFicyggdGhpcy5nZXRTbGlkZURpc3RhbmNlKCAtcmVzdGluZ1gsIHRoaXMuc2VsZWN0ZWRJbmRleCApICk7XG4gIC8vIGdldCBjbG9zZXQgcmVzdGluZyBnb2luZyB1cCBhbmQgZ29pbmcgZG93blxuICB2YXIgcG9zaXRpdmVSZXN0aW5nID0gdGhpcy5fZ2V0Q2xvc2VzdFJlc3RpbmcoIHJlc3RpbmdYLCBkaXN0YW5jZSwgMSApO1xuICB2YXIgbmVnYXRpdmVSZXN0aW5nID0gdGhpcy5fZ2V0Q2xvc2VzdFJlc3RpbmcoIHJlc3RpbmdYLCBkaXN0YW5jZSwgLTEgKTtcbiAgLy8gdXNlIGNsb3NlciByZXN0aW5nIGZvciB3cmFwLWFyb3VuZFxuICB2YXIgaW5kZXggPSBwb3NpdGl2ZVJlc3RpbmcuZGlzdGFuY2UgPCBuZWdhdGl2ZVJlc3RpbmcuZGlzdGFuY2UgP1xuICAgIHBvc2l0aXZlUmVzdGluZy5pbmRleCA6IG5lZ2F0aXZlUmVzdGluZy5pbmRleDtcbiAgcmV0dXJuIGluZGV4O1xufTtcblxuLyoqXG4gKiBnaXZlbiByZXN0aW5nIFggYW5kIGRpc3RhbmNlIHRvIHNlbGVjdGVkIGNlbGxcbiAqIGdldCB0aGUgZGlzdGFuY2UgYW5kIGluZGV4IG9mIHRoZSBjbG9zZXN0IGNlbGxcbiAqIEBwYXJhbSB7TnVtYmVyfSByZXN0aW5nWCAtIGVzdGltYXRlZCBwb3N0LWZsaWNrIHJlc3RpbmcgcG9zaXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIGRpc3RhbmNlIHRvIHNlbGVjdGVkIGNlbGxcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaW5jcmVtZW50IC0gKzEgb3IgLTEsIGdvaW5nIHVwIG9yIGRvd25cbiAqIEByZXR1cm5zIHtPYmplY3R9IC0geyBkaXN0YW5jZToge051bWJlcn0sIGluZGV4OiB7SW50ZWdlcn0gfVxuICovXG5wcm90by5fZ2V0Q2xvc2VzdFJlc3RpbmcgPSBmdW5jdGlvbiggcmVzdGluZ1gsIGRpc3RhbmNlLCBpbmNyZW1lbnQgKSB7XG4gIHZhciBpbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleDtcbiAgdmFyIG1pbkRpc3RhbmNlID0gSW5maW5pdHk7XG4gIHZhciBjb25kaXRpb24gPSB0aGlzLm9wdGlvbnMuY29udGFpbiAmJiAhdGhpcy5vcHRpb25zLndyYXBBcm91bmQgP1xuICAgIC8vIGlmIGNvbnRhaW4sIGtlZXAgZ29pbmcgaWYgZGlzdGFuY2UgaXMgZXF1YWwgdG8gbWluRGlzdGFuY2VcbiAgICBmdW5jdGlvbiggZCwgbWQgKSB7IHJldHVybiBkIDw9IG1kOyB9IDogZnVuY3Rpb24oIGQsIG1kICkgeyByZXR1cm4gZCA8IG1kOyB9O1xuICB3aGlsZSAoIGNvbmRpdGlvbiggZGlzdGFuY2UsIG1pbkRpc3RhbmNlICkgKSB7XG4gICAgLy8gbWVhc3VyZSBkaXN0YW5jZSB0byBuZXh0IGNlbGxcbiAgICBpbmRleCArPSBpbmNyZW1lbnQ7XG4gICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICBkaXN0YW5jZSA9IHRoaXMuZ2V0U2xpZGVEaXN0YW5jZSggLXJlc3RpbmdYLCBpbmRleCApO1xuICAgIGlmICggZGlzdGFuY2UgPT09IG51bGwgKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGlzdGFuY2UgPSBNYXRoLmFicyggZGlzdGFuY2UgKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGRpc3RhbmNlOiBtaW5EaXN0YW5jZSxcbiAgICAvLyBzZWxlY3RlZCB3YXMgcHJldmlvdXMgaW5kZXhcbiAgICBpbmRleDogaW5kZXggLSBpbmNyZW1lbnRcbiAgfTtcbn07XG5cbi8qKlxuICogbWVhc3VyZSBkaXN0YW5jZSBiZXR3ZWVuIHggYW5kIGEgc2xpZGUgdGFyZ2V0XG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleCAtIHNsaWRlIGluZGV4XG4gKi9cbnByb3RvLmdldFNsaWRlRGlzdGFuY2UgPSBmdW5jdGlvbiggeCwgaW5kZXggKSB7XG4gIHZhciBsZW4gPSB0aGlzLnNsaWRlcy5sZW5ndGg7XG4gIC8vIHdyYXAgYXJvdW5kIGlmIGF0IGxlYXN0IDIgc2xpZGVzXG4gIHZhciBpc1dyYXBBcm91bmQgPSB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCAmJiBsZW4gPiAxO1xuICB2YXIgc2xpZGVJbmRleCA9IGlzV3JhcEFyb3VuZCA/IHV0aWxzLm1vZHVsbyggaW5kZXgsIGxlbiApIDogaW5kZXg7XG4gIHZhciBzbGlkZSA9IHRoaXMuc2xpZGVzWyBzbGlkZUluZGV4IF07XG4gIGlmICggIXNsaWRlICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIGFkZCBkaXN0YW5jZSBmb3Igd3JhcC1hcm91bmQgc2xpZGVzXG4gIHZhciB3cmFwID0gaXNXcmFwQXJvdW5kID8gdGhpcy5zbGlkZWFibGVXaWR0aCAqIE1hdGguZmxvb3IoIGluZGV4IC8gbGVuICkgOiAwO1xuICByZXR1cm4geCAtICggc2xpZGUudGFyZ2V0ICsgd3JhcCApO1xufTtcblxucHJvdG8uZHJhZ0VuZEJvb3N0U2VsZWN0ID0gZnVuY3Rpb24oKSB7XG4gIC8vIGRvIG5vdCBib29zdCBpZiBubyBwcmV2aW91c0RyYWdYIG9yIGRyYWdNb3ZlVGltZVxuICBpZiAoIHRoaXMucHJldmlvdXNEcmFnWCA9PT0gdW5kZWZpbmVkIHx8ICF0aGlzLmRyYWdNb3ZlVGltZSB8fFxuICAgIC8vIG9yIGlmIGRyYWcgd2FzIGhlbGQgZm9yIDEwMCBtc1xuICAgIG5ldyBEYXRlKCkgLSB0aGlzLmRyYWdNb3ZlVGltZSA+IDEwMCApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciBkaXN0YW5jZSA9IHRoaXMuZ2V0U2xpZGVEaXN0YW5jZSggLXRoaXMuZHJhZ1gsIHRoaXMuc2VsZWN0ZWRJbmRleCApO1xuICB2YXIgZGVsdGEgPSB0aGlzLnByZXZpb3VzRHJhZ1ggLSB0aGlzLmRyYWdYO1xuICBpZiAoIGRpc3RhbmNlID4gMCAmJiBkZWx0YSA+IDAgKSB7XG4gICAgLy8gYm9vc3QgdG8gbmV4dCBpZiBtb3ZpbmcgdG93YXJkcyB0aGUgcmlnaHQsIGFuZCBwb3NpdGl2ZSB2ZWxvY2l0eVxuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKCBkaXN0YW5jZSA8IDAgJiYgZGVsdGEgPCAwICkge1xuICAgIC8vIGJvb3N0IHRvIHByZXZpb3VzIGlmIG1vdmluZyB0b3dhcmRzIHRoZSBsZWZ0LCBhbmQgbmVnYXRpdmUgdmVsb2NpdHlcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG4vLyAtLS0tLSBzdGF0aWNDbGljayAtLS0tLSAvL1xuXG5wcm90by5zdGF0aWNDbGljayA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgLy8gZ2V0IGNsaWNrZWRDZWxsLCBpZiBjZWxsIHdhcyBjbGlja2VkXG4gIHZhciBjbGlja2VkQ2VsbCA9IHRoaXMuZ2V0UGFyZW50Q2VsbCggZXZlbnQudGFyZ2V0ICk7XG4gIHZhciBjZWxsRWxlbSA9IGNsaWNrZWRDZWxsICYmIGNsaWNrZWRDZWxsLmVsZW1lbnQ7XG4gIHZhciBjZWxsSW5kZXggPSBjbGlja2VkQ2VsbCAmJiB0aGlzLmNlbGxzLmluZGV4T2YoIGNsaWNrZWRDZWxsICk7XG4gIHRoaXMuZGlzcGF0Y2hFdmVudCggJ3N0YXRpY0NsaWNrJywgZXZlbnQsIFsgcG9pbnRlciwgY2VsbEVsZW0sIGNlbGxJbmRleCBdICk7XG59O1xuXG4vLyAtLS0tLSBzY3JvbGwgLS0tLS0gLy9cblxucHJvdG8ub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNjcm9sbCA9IGdldFNjcm9sbFBvc2l0aW9uKCk7XG4gIHZhciBzY3JvbGxNb3ZlWCA9IHRoaXMucG9pbnRlckRvd25TY3JvbGwueCAtIHNjcm9sbC54O1xuICB2YXIgc2Nyb2xsTW92ZVkgPSB0aGlzLnBvaW50ZXJEb3duU2Nyb2xsLnkgLSBzY3JvbGwueTtcbiAgLy8gY2FuY2VsIGNsaWNrL3RhcCBpZiBzY3JvbGwgaXMgdG9vIG11Y2hcbiAgaWYgKCBNYXRoLmFicyggc2Nyb2xsTW92ZVggKSA+IDMgfHwgTWF0aC5hYnMoIHNjcm9sbE1vdmVZICkgPiAzICkge1xuICAgIHRoaXMuX3BvaW50ZXJEb25lKCk7XG4gIH1cbn07XG5cbi8vIC0tLS0tIHV0aWxzIC0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdldFNjcm9sbFBvc2l0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHg6IHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICB5OiB3aW5kb3cucGFnZVlPZmZzZXRcbiAgfTtcbn1cblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbnJldHVybiBGbGlja2l0eTtcblxufSkpO1xuIiwiLy8gRmxpY2tpdHkgbWFpblxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICdldi1lbWl0dGVyL2V2LWVtaXR0ZXInLFxuICAgICAgJ2dldC1zaXplL2dldC1zaXplJyxcbiAgICAgICdmaXp6eS11aS11dGlscy91dGlscycsXG4gICAgICAnLi9jZWxsJyxcbiAgICAgICcuL3NsaWRlJyxcbiAgICAgICcuL2FuaW1hdGUnXG4gICAgXSwgZnVuY3Rpb24oIEV2RW1pdHRlciwgZ2V0U2l6ZSwgdXRpbHMsIENlbGwsIFNsaWRlLCBhbmltYXRlUHJvdG90eXBlICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgRXZFbWl0dGVyLCBnZXRTaXplLCB1dGlscywgQ2VsbCwgU2xpZGUsIGFuaW1hdGVQcm90b3R5cGUgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ2V2LWVtaXR0ZXInKSxcbiAgICAgIHJlcXVpcmUoJ2dldC1zaXplJyksXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpLFxuICAgICAgcmVxdWlyZSgnLi9jZWxsJyksXG4gICAgICByZXF1aXJlKCcuL3NsaWRlJyksXG4gICAgICByZXF1aXJlKCcuL2FuaW1hdGUnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB2YXIgX0ZsaWNraXR5ID0gd2luZG93LkZsaWNraXR5O1xuXG4gICAgd2luZG93LkZsaWNraXR5ID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5FdkVtaXR0ZXIsXG4gICAgICB3aW5kb3cuZ2V0U2l6ZSxcbiAgICAgIHdpbmRvdy5maXp6eVVJVXRpbHMsXG4gICAgICBfRmxpY2tpdHkuQ2VsbCxcbiAgICAgIF9GbGlja2l0eS5TbGlkZSxcbiAgICAgIF9GbGlja2l0eS5hbmltYXRlUHJvdG90eXBlXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRXZFbWl0dGVyLCBnZXRTaXplLFxuICB1dGlscywgQ2VsbCwgU2xpZGUsIGFuaW1hdGVQcm90b3R5cGUgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gdmFyc1xudmFyIGpRdWVyeSA9IHdpbmRvdy5qUXVlcnk7XG52YXIgZ2V0Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlO1xudmFyIGNvbnNvbGUgPSB3aW5kb3cuY29uc29sZTtcblxuZnVuY3Rpb24gbW92ZUVsZW1lbnRzKCBlbGVtcywgdG9FbGVtICkge1xuICBlbGVtcyA9IHV0aWxzLm1ha2VBcnJheSggZWxlbXMgKTtcbiAgd2hpbGUgKCBlbGVtcy5sZW5ndGggKSB7XG4gICAgdG9FbGVtLmFwcGVuZENoaWxkKCBlbGVtcy5zaGlmdCgpICk7XG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRmxpY2tpdHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXJzXG52YXIgR1VJRCA9IDA7XG4vLyBpbnRlcm5hbCBzdG9yZSBvZiBhbGwgRmxpY2tpdHkgaW50YW5jZXNcbnZhciBpbnN0YW5jZXMgPSB7fTtcblxuZnVuY3Rpb24gRmxpY2tpdHkoIGVsZW1lbnQsIG9wdGlvbnMgKSB7XG4gIHZhciBxdWVyeUVsZW1lbnQgPSB1dGlscy5nZXRRdWVyeUVsZW1lbnQoIGVsZW1lbnQgKTtcbiAgaWYgKCAhcXVlcnlFbGVtZW50ICkge1xuICAgIGlmICggY29uc29sZSApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoICdCYWQgZWxlbWVudCBmb3IgRmxpY2tpdHk6ICcgKyAoIHF1ZXJ5RWxlbWVudCB8fCBlbGVtZW50ICkgKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZWxlbWVudCA9IHF1ZXJ5RWxlbWVudDtcbiAgLy8gZG8gbm90IGluaXRpYWxpemUgdHdpY2Ugb24gc2FtZSBlbGVtZW50XG4gIGlmICggdGhpcy5lbGVtZW50LmZsaWNraXR5R1VJRCApIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZXNbIHRoaXMuZWxlbWVudC5mbGlja2l0eUdVSUQgXTtcbiAgICBpbnN0YW5jZS5vcHRpb24oIG9wdGlvbnMgKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICAvLyBhZGQgalF1ZXJ5XG4gIGlmICggalF1ZXJ5ICkge1xuICAgIHRoaXMuJGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMuZWxlbWVudCApO1xuICB9XG4gIC8vIG9wdGlvbnNcbiAgdGhpcy5vcHRpb25zID0gdXRpbHMuZXh0ZW5kKCB7fSwgdGhpcy5jb25zdHJ1Y3Rvci5kZWZhdWx0cyApO1xuICB0aGlzLm9wdGlvbiggb3B0aW9ucyApO1xuXG4gIC8vIGtpY2sgdGhpbmdzIG9mZlxuICB0aGlzLl9jcmVhdGUoKTtcbn1cblxuRmxpY2tpdHkuZGVmYXVsdHMgPSB7XG4gIGFjY2Vzc2liaWxpdHk6IHRydWUsXG4gIC8vIGFkYXB0aXZlSGVpZ2h0OiBmYWxzZSxcbiAgY2VsbEFsaWduOiAnY2VudGVyJyxcbiAgLy8gY2VsbFNlbGVjdG9yOiB1bmRlZmluZWQsXG4gIC8vIGNvbnRhaW46IGZhbHNlLFxuICBmcmVlU2Nyb2xsRnJpY3Rpb246IDAuMDc1LCAvLyBmcmljdGlvbiB3aGVuIGZyZWUtc2Nyb2xsaW5nXG4gIGZyaWN0aW9uOiAwLjI4LCAvLyBmcmljdGlvbiB3aGVuIHNlbGVjdGluZ1xuICBuYW1lc3BhY2VKUXVlcnlFdmVudHM6IHRydWUsXG4gIC8vIGluaXRpYWxJbmRleDogMCxcbiAgcGVyY2VudFBvc2l0aW9uOiB0cnVlLFxuICByZXNpemU6IHRydWUsXG4gIHNlbGVjdGVkQXR0cmFjdGlvbjogMC4wMjUsXG4gIHNldEdhbGxlcnlTaXplOiB0cnVlXG4gIC8vIHdhdGNoQ1NTOiBmYWxzZSxcbiAgLy8gd3JhcEFyb3VuZDogZmFsc2Vcbn07XG5cbi8vIGhhc2ggb2YgbWV0aG9kcyB0cmlnZ2VyZWQgb24gX2NyZWF0ZSgpXG5GbGlja2l0eS5jcmVhdGVNZXRob2RzID0gW107XG5cbnZhciBwcm90byA9IEZsaWNraXR5LnByb3RvdHlwZTtcbi8vIGluaGVyaXQgRXZlbnRFbWl0dGVyXG51dGlscy5leHRlbmQoIHByb3RvLCBFdkVtaXR0ZXIucHJvdG90eXBlICk7XG5cbnByb3RvLl9jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgLy8gYWRkIGlkIGZvciBGbGlja2l0eS5kYXRhXG4gIHZhciBpZCA9IHRoaXMuZ3VpZCA9ICsrR1VJRDtcbiAgdGhpcy5lbGVtZW50LmZsaWNraXR5R1VJRCA9IGlkOyAvLyBleHBhbmRvXG4gIGluc3RhbmNlc1sgaWQgXSA9IHRoaXM7IC8vIGFzc29jaWF0ZSB2aWEgaWRcbiAgLy8gaW5pdGlhbCBwcm9wZXJ0aWVzXG4gIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XG4gIC8vIGhvdyBtYW55IGZyYW1lcyBzbGlkZXIgaGFzIGJlZW4gaW4gc2FtZSBwb3NpdGlvblxuICB0aGlzLnJlc3RpbmdGcmFtZXMgPSAwO1xuICAvLyBpbml0aWFsIHBoeXNpY3MgcHJvcGVydGllc1xuICB0aGlzLnggPSAwO1xuICB0aGlzLnZlbG9jaXR5ID0gMDtcbiAgdGhpcy5vcmlnaW5TaWRlID0gdGhpcy5vcHRpb25zLnJpZ2h0VG9MZWZ0ID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgLy8gY3JlYXRlIHZpZXdwb3J0ICYgc2xpZGVyXG4gIHRoaXMudmlld3BvcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy52aWV3cG9ydC5jbGFzc05hbWUgPSAnZmxpY2tpdHktdmlld3BvcnQnO1xuICB0aGlzLl9jcmVhdGVTbGlkZXIoKTtcblxuICBpZiAoIHRoaXMub3B0aW9ucy5yZXNpemUgfHwgdGhpcy5vcHRpb25zLndhdGNoQ1NTICkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgdGhpcyApO1xuICB9XG5cbiAgRmxpY2tpdHkuY3JlYXRlTWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiggbWV0aG9kICkge1xuICAgIHRoaXNbIG1ldGhvZCBdKCk7XG4gIH0sIHRoaXMgKTtcblxuICBpZiAoIHRoaXMub3B0aW9ucy53YXRjaENTUyApIHtcbiAgICB0aGlzLndhdGNoQ1NTKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xuICB9XG5cbn07XG5cbi8qKlxuICogc2V0IG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gKi9cbnByb3RvLm9wdGlvbiA9IGZ1bmN0aW9uKCBvcHRzICkge1xuICB1dGlscy5leHRlbmQoIHRoaXMub3B0aW9ucywgb3B0cyApO1xufTtcblxucHJvdG8uYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCB0aGlzLmlzQWN0aXZlICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZsaWNraXR5LWVuYWJsZWQnKTtcbiAgaWYgKCB0aGlzLm9wdGlvbnMucmlnaHRUb0xlZnQgKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZsaWNraXR5LXJ0bCcpO1xuICB9XG5cbiAgdGhpcy5nZXRTaXplKCk7XG4gIC8vIG1vdmUgaW5pdGlhbCBjZWxsIGVsZW1lbnRzIHNvIHRoZXkgY2FuIGJlIGxvYWRlZCBhcyBjZWxsc1xuICB2YXIgY2VsbEVsZW1zID0gdGhpcy5fZmlsdGVyRmluZENlbGxFbGVtZW50cyggdGhpcy5lbGVtZW50LmNoaWxkcmVuICk7XG4gIG1vdmVFbGVtZW50cyggY2VsbEVsZW1zLCB0aGlzLnNsaWRlciApO1xuICB0aGlzLnZpZXdwb3J0LmFwcGVuZENoaWxkKCB0aGlzLnNsaWRlciApO1xuICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHRoaXMudmlld3BvcnQgKTtcbiAgLy8gZ2V0IGNlbGxzIGZyb20gY2hpbGRyZW5cbiAgdGhpcy5yZWxvYWRDZWxscygpO1xuXG4gIGlmICggdGhpcy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgKSB7XG4gICAgLy8gYWxsb3cgZWxlbWVudCB0byBmb2N1c2FibGVcbiAgICB0aGlzLmVsZW1lbnQudGFiSW5kZXggPSAwO1xuICAgIC8vIGxpc3RlbiBmb3Iga2V5IHByZXNzZXNcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCB0aGlzICk7XG4gIH1cblxuICB0aGlzLmVtaXRFdmVudCgnYWN0aXZhdGUnKTtcblxuICB2YXIgaW5kZXg7XG4gIHZhciBpbml0aWFsSW5kZXggPSB0aGlzLm9wdGlvbnMuaW5pdGlhbEluZGV4O1xuICBpZiAoIHRoaXMuaXNJbml0QWN0aXZhdGVkICkge1xuICAgIGluZGV4ID0gdGhpcy5zZWxlY3RlZEluZGV4O1xuICB9IGVsc2UgaWYgKCBpbml0aWFsSW5kZXggIT09IHVuZGVmaW5lZCApIHtcbiAgICBpbmRleCA9IHRoaXMuY2VsbHNbIGluaXRpYWxJbmRleCBdID8gaW5pdGlhbEluZGV4IDogMDtcbiAgfSBlbHNlIHtcbiAgICBpbmRleCA9IDA7XG4gIH1cbiAgLy8gc2VsZWN0IGluc3RhbnRseVxuICB0aGlzLnNlbGVjdCggaW5kZXgsIGZhbHNlLCB0cnVlICk7XG4gIC8vIGZsYWcgZm9yIGluaXRpYWwgYWN0aXZhdGlvbiwgZm9yIHVzaW5nIGluaXRpYWxJbmRleFxuICB0aGlzLmlzSW5pdEFjdGl2YXRlZCA9IHRydWU7XG59O1xuXG4vLyBzbGlkZXIgcG9zaXRpb25zIHRoZSBjZWxsc1xucHJvdG8uX2NyZWF0ZVNsaWRlciA9IGZ1bmN0aW9uKCkge1xuICAvLyBzbGlkZXIgZWxlbWVudCBkb2VzIGFsbCB0aGUgcG9zaXRpb25pbmdcbiAgdmFyIHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzbGlkZXIuY2xhc3NOYW1lID0gJ2ZsaWNraXR5LXNsaWRlcic7XG4gIHNsaWRlci5zdHlsZVsgdGhpcy5vcmlnaW5TaWRlIF0gPSAwO1xuICB0aGlzLnNsaWRlciA9IHNsaWRlcjtcbn07XG5cbnByb3RvLl9maWx0ZXJGaW5kQ2VsbEVsZW1lbnRzID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICByZXR1cm4gdXRpbHMuZmlsdGVyRmluZEVsZW1lbnRzKCBlbGVtcywgdGhpcy5vcHRpb25zLmNlbGxTZWxlY3RvciApO1xufTtcblxuLy8gZ29lcyB0aHJvdWdoIGFsbCBjaGlsZHJlblxucHJvdG8ucmVsb2FkQ2VsbHMgPSBmdW5jdGlvbigpIHtcbiAgLy8gY29sbGVjdGlvbiBvZiBpdGVtIGVsZW1lbnRzXG4gIHRoaXMuY2VsbHMgPSB0aGlzLl9tYWtlQ2VsbHMoIHRoaXMuc2xpZGVyLmNoaWxkcmVuICk7XG4gIHRoaXMucG9zaXRpb25DZWxscygpO1xuICB0aGlzLl9nZXRXcmFwU2hpZnRDZWxscygpO1xuICB0aGlzLnNldEdhbGxlcnlTaXplKCk7XG59O1xuXG4vKipcbiAqIHR1cm4gZWxlbWVudHMgaW50byBGbGlja2l0eS5DZWxsc1xuICogQHBhcmFtIHtBcnJheSBvciBOb2RlTGlzdCBvciBIVE1MRWxlbWVudH0gZWxlbXNcbiAqIEByZXR1cm5zIHtBcnJheX0gaXRlbXMgLSBjb2xsZWN0aW9uIG9mIG5ldyBGbGlja2l0eSBDZWxsc1xuICovXG5wcm90by5fbWFrZUNlbGxzID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICB2YXIgY2VsbEVsZW1zID0gdGhpcy5fZmlsdGVyRmluZENlbGxFbGVtZW50cyggZWxlbXMgKTtcblxuICAvLyBjcmVhdGUgbmV3IEZsaWNraXR5IGZvciBjb2xsZWN0aW9uXG4gIHZhciBjZWxscyA9IGNlbGxFbGVtcy5tYXAoIGZ1bmN0aW9uKCBjZWxsRWxlbSApIHtcbiAgICByZXR1cm4gbmV3IENlbGwoIGNlbGxFbGVtLCB0aGlzICk7XG4gIH0sIHRoaXMgKTtcblxuICByZXR1cm4gY2VsbHM7XG59O1xuXG5wcm90by5nZXRMYXN0Q2VsbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jZWxsc1sgdGhpcy5jZWxscy5sZW5ndGggLSAxIF07XG59O1xuXG5wcm90by5nZXRMYXN0U2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc2xpZGVzWyB0aGlzLnNsaWRlcy5sZW5ndGggLSAxIF07XG59O1xuXG4vLyBwb3NpdGlvbnMgYWxsIGNlbGxzXG5wcm90by5wb3NpdGlvbkNlbGxzID0gZnVuY3Rpb24oKSB7XG4gIC8vIHNpemUgYWxsIGNlbGxzXG4gIHRoaXMuX3NpemVDZWxscyggdGhpcy5jZWxscyApO1xuICAvLyBwb3NpdGlvbiBhbGwgY2VsbHNcbiAgdGhpcy5fcG9zaXRpb25DZWxscyggMCApO1xufTtcblxuLyoqXG4gKiBwb3NpdGlvbiBjZXJ0YWluIGNlbGxzXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGluZGV4IC0gd2hpY2ggY2VsbCB0byBzdGFydCB3aXRoXG4gKi9cbnByb3RvLl9wb3NpdGlvbkNlbGxzID0gZnVuY3Rpb24oIGluZGV4ICkge1xuICBpbmRleCA9IGluZGV4IHx8IDA7XG4gIC8vIGFsc28gbWVhc3VyZSBtYXhDZWxsSGVpZ2h0XG4gIC8vIHN0YXJ0IDAgaWYgcG9zaXRpb25pbmcgYWxsIGNlbGxzXG4gIHRoaXMubWF4Q2VsbEhlaWdodCA9IGluZGV4ID8gdGhpcy5tYXhDZWxsSGVpZ2h0IHx8IDAgOiAwO1xuICB2YXIgY2VsbFggPSAwO1xuICAvLyBnZXQgY2VsbFhcbiAgaWYgKCBpbmRleCA+IDAgKSB7XG4gICAgdmFyIHN0YXJ0Q2VsbCA9IHRoaXMuY2VsbHNbIGluZGV4IC0gMSBdO1xuICAgIGNlbGxYID0gc3RhcnRDZWxsLnggKyBzdGFydENlbGwuc2l6ZS5vdXRlcldpZHRoO1xuICB9XG4gIHZhciBsZW4gPSB0aGlzLmNlbGxzLmxlbmd0aDtcbiAgZm9yICggdmFyIGk9aW5kZXg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgY2VsbCA9IHRoaXMuY2VsbHNbaV07XG4gICAgY2VsbC5zZXRQb3NpdGlvbiggY2VsbFggKTtcbiAgICBjZWxsWCArPSBjZWxsLnNpemUub3V0ZXJXaWR0aDtcbiAgICB0aGlzLm1heENlbGxIZWlnaHQgPSBNYXRoLm1heCggY2VsbC5zaXplLm91dGVySGVpZ2h0LCB0aGlzLm1heENlbGxIZWlnaHQgKTtcbiAgfVxuICAvLyBrZWVwIHRyYWNrIG9mIGNlbGxYIGZvciB3cmFwLWFyb3VuZFxuICB0aGlzLnNsaWRlYWJsZVdpZHRoID0gY2VsbFg7XG4gIC8vIHNsaWRlc1xuICB0aGlzLnVwZGF0ZVNsaWRlcygpO1xuICAvLyBjb250YWluIHNsaWRlcyB0YXJnZXRcbiAgdGhpcy5fY29udGFpblNsaWRlcygpO1xuICAvLyB1cGRhdGUgc2xpZGVzV2lkdGhcbiAgdGhpcy5zbGlkZXNXaWR0aCA9IGxlbiA/IHRoaXMuZ2V0TGFzdFNsaWRlKCkudGFyZ2V0IC0gdGhpcy5zbGlkZXNbMF0udGFyZ2V0IDogMDtcbn07XG5cbi8qKlxuICogY2VsbC5nZXRTaXplKCkgb24gbXVsdGlwbGUgY2VsbHNcbiAqIEBwYXJhbSB7QXJyYXl9IGNlbGxzXG4gKi9cbnByb3RvLl9zaXplQ2VsbHMgPSBmdW5jdGlvbiggY2VsbHMgKSB7XG4gIGNlbGxzLmZvckVhY2goIGZ1bmN0aW9uKCBjZWxsICkge1xuICAgIGNlbGwuZ2V0U2l6ZSgpO1xuICB9KTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5wcm90by51cGRhdGVTbGlkZXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zbGlkZXMgPSBbXTtcbiAgaWYgKCAhdGhpcy5jZWxscy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHNsaWRlID0gbmV3IFNsaWRlKCB0aGlzICk7XG4gIHRoaXMuc2xpZGVzLnB1c2goIHNsaWRlICk7XG4gIHZhciBpc09yaWdpbkxlZnQgPSB0aGlzLm9yaWdpblNpZGUgPT0gJ2xlZnQnO1xuICB2YXIgbmV4dE1hcmdpbiA9IGlzT3JpZ2luTGVmdCA/ICdtYXJnaW5SaWdodCcgOiAnbWFyZ2luTGVmdCc7XG5cbiAgdmFyIGNhbkNlbGxGaXQgPSB0aGlzLl9nZXRDYW5DZWxsRml0KCk7XG5cbiAgdGhpcy5jZWxscy5mb3JFYWNoKCBmdW5jdGlvbiggY2VsbCwgaSApIHtcbiAgICAvLyBqdXN0IGFkZCBjZWxsIGlmIGZpcnN0IGNlbGwgaW4gc2xpZGVcbiAgICBpZiAoICFzbGlkZS5jZWxscy5sZW5ndGggKSB7XG4gICAgICBzbGlkZS5hZGRDZWxsKCBjZWxsICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHNsaWRlV2lkdGggPSAoIHNsaWRlLm91dGVyV2lkdGggLSBzbGlkZS5maXJzdE1hcmdpbiApICtcbiAgICAgICggY2VsbC5zaXplLm91dGVyV2lkdGggLSBjZWxsLnNpemVbIG5leHRNYXJnaW4gXSApO1xuXG4gICAgaWYgKCBjYW5DZWxsRml0LmNhbGwoIHRoaXMsIGksIHNsaWRlV2lkdGggKSApIHtcbiAgICAgIHNsaWRlLmFkZENlbGwoIGNlbGwgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZG9lc24ndCBmaXQsIG5ldyBzbGlkZVxuICAgICAgc2xpZGUudXBkYXRlVGFyZ2V0KCk7XG5cbiAgICAgIHNsaWRlID0gbmV3IFNsaWRlKCB0aGlzICk7XG4gICAgICB0aGlzLnNsaWRlcy5wdXNoKCBzbGlkZSApO1xuICAgICAgc2xpZGUuYWRkQ2VsbCggY2VsbCApO1xuICAgIH1cbiAgfSwgdGhpcyApO1xuICAvLyBsYXN0IHNsaWRlXG4gIHNsaWRlLnVwZGF0ZVRhcmdldCgpO1xuICAvLyB1cGRhdGUgLnNlbGVjdGVkU2xpZGVcbiAgdGhpcy51cGRhdGVTZWxlY3RlZFNsaWRlKCk7XG59O1xuXG5wcm90by5fZ2V0Q2FuQ2VsbEZpdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ3JvdXBDZWxscyA9IHRoaXMub3B0aW9ucy5ncm91cENlbGxzO1xuICBpZiAoICFncm91cENlbGxzICkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgZ3JvdXBDZWxscyA9PSAnbnVtYmVyJyApIHtcbiAgICAvLyBncm91cCBieSBudW1iZXIuIDMgLT4gWzAsMSwyXSwgWzMsNCw1XSwgLi4uXG4gICAgdmFyIG51bWJlciA9IHBhcnNlSW50KCBncm91cENlbGxzLCAxMCApO1xuICAgIHJldHVybiBmdW5jdGlvbiggaSApIHtcbiAgICAgIHJldHVybiAoIGkgJSBudW1iZXIgKSAhPT0gMDtcbiAgICB9O1xuICB9XG4gIC8vIGRlZmF1bHQsIGdyb3VwIGJ5IHdpZHRoIG9mIHNsaWRlXG4gIC8vIHBhcnNlICc3NSVcbiAgdmFyIHBlcmNlbnRNYXRjaCA9IHR5cGVvZiBncm91cENlbGxzID09ICdzdHJpbmcnICYmXG4gICAgZ3JvdXBDZWxscy5tYXRjaCgvXihcXGQrKSUkLyk7XG4gIHZhciBwZXJjZW50ID0gcGVyY2VudE1hdGNoID8gcGFyc2VJbnQoIHBlcmNlbnRNYXRjaFsxXSwgMTAgKSAvIDEwMCA6IDE7XG4gIHJldHVybiBmdW5jdGlvbiggaSwgc2xpZGVXaWR0aCApIHtcbiAgICByZXR1cm4gc2xpZGVXaWR0aCA8PSAoIHRoaXMuc2l6ZS5pbm5lcldpZHRoICsgMSApICogcGVyY2VudDtcbiAgfTtcbn07XG5cbi8vIGFsaWFzIF9pbml0IGZvciBqUXVlcnkgcGx1Z2luIC5mbGlja2l0eSgpXG5wcm90by5faW5pdCA9XG5wcm90by5yZXBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucG9zaXRpb25DZWxscygpO1xuICB0aGlzLnBvc2l0aW9uU2xpZGVyQXRTZWxlY3RlZCgpO1xufTtcblxucHJvdG8uZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNpemUgPSBnZXRTaXplKCB0aGlzLmVsZW1lbnQgKTtcbiAgdGhpcy5zZXRDZWxsQWxpZ24oKTtcbiAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IHRoaXMuc2l6ZS5pbm5lcldpZHRoICogdGhpcy5jZWxsQWxpZ247XG59O1xuXG52YXIgY2VsbEFsaWduU2hvcnRoYW5kcyA9IHtcbiAgLy8gY2VsbCBhbGlnbiwgdGhlbiBiYXNlZCBvbiBvcmlnaW4gc2lkZVxuICBjZW50ZXI6IHtcbiAgICBsZWZ0OiAwLjUsXG4gICAgcmlnaHQ6IDAuNVxuICB9LFxuICBsZWZ0OiB7XG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMVxuICB9LFxuICByaWdodDoge1xuICAgIHJpZ2h0OiAwLFxuICAgIGxlZnQ6IDFcbiAgfVxufTtcblxucHJvdG8uc2V0Q2VsbEFsaWduID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzaG9ydGhhbmQgPSBjZWxsQWxpZ25TaG9ydGhhbmRzWyB0aGlzLm9wdGlvbnMuY2VsbEFsaWduIF07XG4gIHRoaXMuY2VsbEFsaWduID0gc2hvcnRoYW5kID8gc2hvcnRoYW5kWyB0aGlzLm9yaWdpblNpZGUgXSA6IHRoaXMub3B0aW9ucy5jZWxsQWxpZ247XG59O1xuXG5wcm90by5zZXRHYWxsZXJ5U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIHRoaXMub3B0aW9ucy5zZXRHYWxsZXJ5U2l6ZSApIHtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ICYmIHRoaXMuc2VsZWN0ZWRTbGlkZSA/XG4gICAgICB0aGlzLnNlbGVjdGVkU2xpZGUuaGVpZ2h0IDogdGhpcy5tYXhDZWxsSGVpZ2h0O1xuICAgIHRoaXMudmlld3BvcnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgfVxufTtcblxucHJvdG8uX2dldFdyYXBTaGlmdENlbGxzID0gZnVuY3Rpb24oKSB7XG4gIC8vIG9ubHkgZm9yIHdyYXAtYXJvdW5kXG4gIGlmICggIXRoaXMub3B0aW9ucy53cmFwQXJvdW5kICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyB1bnNoaWZ0IHByZXZpb3VzIGNlbGxzXG4gIHRoaXMuX3Vuc2hpZnRDZWxscyggdGhpcy5iZWZvcmVTaGlmdENlbGxzICk7XG4gIHRoaXMuX3Vuc2hpZnRDZWxscyggdGhpcy5hZnRlclNoaWZ0Q2VsbHMgKTtcbiAgLy8gZ2V0IGJlZm9yZSBjZWxsc1xuICAvLyBpbml0aWFsIGdhcFxuICB2YXIgZ2FwWCA9IHRoaXMuY3Vyc29yUG9zaXRpb247XG4gIHZhciBjZWxsSW5kZXggPSB0aGlzLmNlbGxzLmxlbmd0aCAtIDE7XG4gIHRoaXMuYmVmb3JlU2hpZnRDZWxscyA9IHRoaXMuX2dldEdhcENlbGxzKCBnYXBYLCBjZWxsSW5kZXgsIC0xICk7XG4gIC8vIGdldCBhZnRlciBjZWxsc1xuICAvLyBlbmRpbmcgZ2FwIGJldHdlZW4gbGFzdCBjZWxsIGFuZCBlbmQgb2YgZ2FsbGVyeSB2aWV3cG9ydFxuICBnYXBYID0gdGhpcy5zaXplLmlubmVyV2lkdGggLSB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICAvLyBzdGFydCBjbG9uaW5nIGF0IGZpcnN0IGNlbGwsIHdvcmtpbmcgZm9yd2FyZHNcbiAgdGhpcy5hZnRlclNoaWZ0Q2VsbHMgPSB0aGlzLl9nZXRHYXBDZWxscyggZ2FwWCwgMCwgMSApO1xufTtcblxucHJvdG8uX2dldEdhcENlbGxzID0gZnVuY3Rpb24oIGdhcFgsIGNlbGxJbmRleCwgaW5jcmVtZW50ICkge1xuICAvLyBrZWVwIGFkZGluZyBjZWxscyB1bnRpbCB0aGUgY292ZXIgdGhlIGluaXRpYWwgZ2FwXG4gIHZhciBjZWxscyA9IFtdO1xuICB3aGlsZSAoIGdhcFggPiAwICkge1xuICAgIHZhciBjZWxsID0gdGhpcy5jZWxsc1sgY2VsbEluZGV4IF07XG4gICAgaWYgKCAhY2VsbCApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjZWxscy5wdXNoKCBjZWxsICk7XG4gICAgY2VsbEluZGV4ICs9IGluY3JlbWVudDtcbiAgICBnYXBYIC09IGNlbGwuc2l6ZS5vdXRlcldpZHRoO1xuICB9XG4gIHJldHVybiBjZWxscztcbn07XG5cbi8vIC0tLS0tIGNvbnRhaW4gLS0tLS0gLy9cblxuLy8gY29udGFpbiBjZWxsIHRhcmdldHMgc28gbm8gZXhjZXNzIHNsaWRpbmdcbnByb3RvLl9jb250YWluU2xpZGVzID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMub3B0aW9ucy5jb250YWluIHx8IHRoaXMub3B0aW9ucy53cmFwQXJvdW5kIHx8ICF0aGlzLmNlbGxzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGlzUmlnaHRUb0xlZnQgPSB0aGlzLm9wdGlvbnMucmlnaHRUb0xlZnQ7XG4gIHZhciBiZWdpbk1hcmdpbiA9IGlzUmlnaHRUb0xlZnQgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuICB2YXIgZW5kTWFyZ2luID0gaXNSaWdodFRvTGVmdCA/ICdtYXJnaW5MZWZ0JyA6ICdtYXJnaW5SaWdodCc7XG4gIHZhciBjb250ZW50V2lkdGggPSB0aGlzLnNsaWRlYWJsZVdpZHRoIC0gdGhpcy5nZXRMYXN0Q2VsbCgpLnNpemVbIGVuZE1hcmdpbiBdO1xuICAvLyBjb250ZW50IGlzIGxlc3MgdGhhbiBnYWxsZXJ5IHNpemVcbiAgdmFyIGlzQ29udGVudFNtYWxsZXIgPSBjb250ZW50V2lkdGggPCB0aGlzLnNpemUuaW5uZXJXaWR0aDtcbiAgLy8gYm91bmRzXG4gIHZhciBiZWdpbkJvdW5kID0gdGhpcy5jdXJzb3JQb3NpdGlvbiArIHRoaXMuY2VsbHNbMF0uc2l6ZVsgYmVnaW5NYXJnaW4gXTtcbiAgdmFyIGVuZEJvdW5kID0gY29udGVudFdpZHRoIC0gdGhpcy5zaXplLmlubmVyV2lkdGggKiAoIDEgLSB0aGlzLmNlbGxBbGlnbiApO1xuICAvLyBjb250YWluIGVhY2ggY2VsbCB0YXJnZXRcbiAgdGhpcy5zbGlkZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuICAgIGlmICggaXNDb250ZW50U21hbGxlciApIHtcbiAgICAgIC8vIGFsbCBjZWxscyBmaXQgaW5zaWRlIGdhbGxlcnlcbiAgICAgIHNsaWRlLnRhcmdldCA9IGNvbnRlbnRXaWR0aCAqIHRoaXMuY2VsbEFsaWduO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb250YWluIHRvIGJvdW5kc1xuICAgICAgc2xpZGUudGFyZ2V0ID0gTWF0aC5tYXgoIHNsaWRlLnRhcmdldCwgYmVnaW5Cb3VuZCApO1xuICAgICAgc2xpZGUudGFyZ2V0ID0gTWF0aC5taW4oIHNsaWRlLnRhcmdldCwgZW5kQm91bmQgKTtcbiAgICB9XG4gIH0sIHRoaXMgKTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG4vKipcbiAqIGVtaXRzIGV2ZW50cyB2aWEgZXZlbnRFbWl0dGVyIGFuZCBqUXVlcnkgZXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIG5hbWUgb2YgZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gb3JpZ2luYWwgZXZlbnRcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBleHRyYSBhcmd1bWVudHNcbiAqL1xucHJvdG8uZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKCB0eXBlLCBldmVudCwgYXJncyApIHtcbiAgdmFyIGVtaXRBcmdzID0gZXZlbnQgPyBbIGV2ZW50IF0uY29uY2F0KCBhcmdzICkgOiBhcmdzO1xuICB0aGlzLmVtaXRFdmVudCggdHlwZSwgZW1pdEFyZ3MgKTtcblxuICBpZiAoIGpRdWVyeSAmJiB0aGlzLiRlbGVtZW50ICkge1xuICAgIC8vIGRlZmF1bHQgdHJpZ2dlciB3aXRoIHR5cGUgaWYgbm8gZXZlbnRcbiAgICB0eXBlICs9IHRoaXMub3B0aW9ucy5uYW1lc3BhY2VKUXVlcnlFdmVudHMgPyAnLmZsaWNraXR5JyA6ICcnO1xuICAgIHZhciAkZXZlbnQgPSB0eXBlO1xuICAgIGlmICggZXZlbnQgKSB7XG4gICAgICAvLyBjcmVhdGUgalF1ZXJ5IGV2ZW50XG4gICAgICB2YXIgalFFdmVudCA9IGpRdWVyeS5FdmVudCggZXZlbnQgKTtcbiAgICAgIGpRRXZlbnQudHlwZSA9IHR5cGU7XG4gICAgICAkZXZlbnQgPSBqUUV2ZW50O1xuICAgIH1cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoICRldmVudCwgYXJncyApO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzZWxlY3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLyoqXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGluZGV4IC0gaW5kZXggb2YgdGhlIHNsaWRlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzV3JhcCAtIHdpbGwgd3JhcC1hcm91bmQgdG8gbGFzdC9maXJzdCBpZiBhdCB0aGUgZW5kXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzSW5zdGFudCAtIHdpbGwgaW1tZWRpYXRlbHkgc2V0IHBvc2l0aW9uIGF0IHNlbGVjdGVkIGNlbGxcbiAqL1xucHJvdG8uc2VsZWN0ID0gZnVuY3Rpb24oIGluZGV4LCBpc1dyYXAsIGlzSW5zdGFudCApIHtcbiAgaWYgKCAhdGhpcy5pc0FjdGl2ZSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaW5kZXggPSBwYXJzZUludCggaW5kZXgsIDEwICk7XG4gIHRoaXMuX3dyYXBTZWxlY3QoIGluZGV4ICk7XG5cbiAgaWYgKCB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCB8fCBpc1dyYXAgKSB7XG4gICAgaW5kZXggPSB1dGlscy5tb2R1bG8oIGluZGV4LCB0aGlzLnNsaWRlcy5sZW5ndGggKTtcbiAgfVxuICAvLyBiYWlsIGlmIGludmFsaWQgaW5kZXhcbiAgaWYgKCAhdGhpcy5zbGlkZXNbIGluZGV4IF0gKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuICB0aGlzLnVwZGF0ZVNlbGVjdGVkU2xpZGUoKTtcbiAgaWYgKCBpc0luc3RhbnQgKSB7XG4gICAgdGhpcy5wb3NpdGlvblNsaWRlckF0U2VsZWN0ZWQoKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uKCk7XG4gIH1cbiAgaWYgKCB0aGlzLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgKSB7XG4gICAgdGhpcy5zZXRHYWxsZXJ5U2l6ZSgpO1xuICB9XG5cbiAgdGhpcy5kaXNwYXRjaEV2ZW50KCdzZWxlY3QnKTtcbiAgLy8gb2xkIHYxIGV2ZW50IG5hbWUsIHJlbW92ZSBpbiB2M1xuICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2NlbGxTZWxlY3QnKTtcbn07XG5cbi8vIHdyYXBzIHBvc2l0aW9uIGZvciB3cmFwQXJvdW5kLCB0byBtb3ZlIHRvIGNsb3Nlc3Qgc2xpZGUuICMxMTNcbnByb3RvLl93cmFwU2VsZWN0ID0gZnVuY3Rpb24oIGluZGV4ICkge1xuICB2YXIgbGVuID0gdGhpcy5zbGlkZXMubGVuZ3RoO1xuICB2YXIgaXNXcmFwcGluZyA9IHRoaXMub3B0aW9ucy53cmFwQXJvdW5kICYmIGxlbiA+IDE7XG4gIGlmICggIWlzV3JhcHBpbmcgKSB7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG4gIHZhciB3cmFwSW5kZXggPSB1dGlscy5tb2R1bG8oIGluZGV4LCBsZW4gKTtcbiAgLy8gZ28gdG8gc2hvcnRlc3RcbiAgdmFyIGRlbHRhID0gTWF0aC5hYnMoIHdyYXBJbmRleCAtIHRoaXMuc2VsZWN0ZWRJbmRleCApO1xuICB2YXIgYmFja1dyYXBEZWx0YSA9IE1hdGguYWJzKCAoIHdyYXBJbmRleCArIGxlbiApIC0gdGhpcy5zZWxlY3RlZEluZGV4ICk7XG4gIHZhciBmb3Jld2FyZFdyYXBEZWx0YSA9IE1hdGguYWJzKCAoIHdyYXBJbmRleCAtIGxlbiApIC0gdGhpcy5zZWxlY3RlZEluZGV4ICk7XG4gIGlmICggIXRoaXMuaXNEcmFnU2VsZWN0ICYmIGJhY2tXcmFwRGVsdGEgPCBkZWx0YSApIHtcbiAgICBpbmRleCArPSBsZW47XG4gIH0gZWxzZSBpZiAoICF0aGlzLmlzRHJhZ1NlbGVjdCAmJiBmb3Jld2FyZFdyYXBEZWx0YSA8IGRlbHRhICkge1xuICAgIGluZGV4IC09IGxlbjtcbiAgfVxuICAvLyB3cmFwIHBvc2l0aW9uIHNvIHNsaWRlciBpcyB3aXRoaW4gbm9ybWFsIGFyZWFcbiAgaWYgKCBpbmRleCA8IDAgKSB7XG4gICAgdGhpcy54IC09IHRoaXMuc2xpZGVhYmxlV2lkdGg7XG4gIH0gZWxzZSBpZiAoIGluZGV4ID49IGxlbiApIHtcbiAgICB0aGlzLnggKz0gdGhpcy5zbGlkZWFibGVXaWR0aDtcbiAgfVxufTtcblxucHJvdG8ucHJldmlvdXMgPSBmdW5jdGlvbiggaXNXcmFwLCBpc0luc3RhbnQgKSB7XG4gIHRoaXMuc2VsZWN0KCB0aGlzLnNlbGVjdGVkSW5kZXggLSAxLCBpc1dyYXAsIGlzSW5zdGFudCApO1xufTtcblxucHJvdG8ubmV4dCA9IGZ1bmN0aW9uKCBpc1dyYXAsIGlzSW5zdGFudCApIHtcbiAgdGhpcy5zZWxlY3QoIHRoaXMuc2VsZWN0ZWRJbmRleCArIDEsIGlzV3JhcCwgaXNJbnN0YW50ICk7XG59O1xuXG5wcm90by51cGRhdGVTZWxlY3RlZFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzbGlkZSA9IHRoaXMuc2xpZGVzWyB0aGlzLnNlbGVjdGVkSW5kZXggXTtcbiAgLy8gc2VsZWN0ZWRJbmRleCBjb3VsZCBiZSBvdXRzaWRlIG9mIHNsaWRlcywgaWYgdHJpZ2dlcmVkIGJlZm9yZSByZXNpemUoKVxuICBpZiAoICFzbGlkZSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gdW5zZWxlY3QgcHJldmlvdXMgc2VsZWN0ZWQgc2xpZGVcbiAgdGhpcy51bnNlbGVjdFNlbGVjdGVkU2xpZGUoKTtcbiAgLy8gdXBkYXRlIG5ldyBzZWxlY3RlZCBzbGlkZVxuICB0aGlzLnNlbGVjdGVkU2xpZGUgPSBzbGlkZTtcbiAgc2xpZGUuc2VsZWN0KCk7XG4gIHRoaXMuc2VsZWN0ZWRDZWxscyA9IHNsaWRlLmNlbGxzO1xuICB0aGlzLnNlbGVjdGVkRWxlbWVudHMgPSBzbGlkZS5nZXRDZWxsRWxlbWVudHMoKTtcbiAgLy8gSEFDSzogc2VsZWN0ZWRDZWxsICYgc2VsZWN0ZWRFbGVtZW50IGlzIGZpcnN0IGNlbGwgaW4gc2xpZGUsIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gIC8vIFJlbW92ZSBpbiB2Mz9cbiAgdGhpcy5zZWxlY3RlZENlbGwgPSBzbGlkZS5jZWxsc1swXTtcbiAgdGhpcy5zZWxlY3RlZEVsZW1lbnQgPSB0aGlzLnNlbGVjdGVkRWxlbWVudHNbMF07XG59O1xuXG5wcm90by51bnNlbGVjdFNlbGVjdGVkU2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCB0aGlzLnNlbGVjdGVkU2xpZGUgKSB7XG4gICAgdGhpcy5zZWxlY3RlZFNsaWRlLnVuc2VsZWN0KCk7XG4gIH1cbn07XG5cbi8qKlxuICogc2VsZWN0IHNsaWRlIGZyb20gbnVtYmVyIG9yIGNlbGwgZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50IG9yIE51bWJlcn0gZWxlbVxuICovXG5wcm90by5zZWxlY3RDZWxsID0gZnVuY3Rpb24oIHZhbHVlLCBpc1dyYXAsIGlzSW5zdGFudCApIHtcbiAgLy8gZ2V0IGNlbGxcbiAgdmFyIGNlbGw7XG4gIGlmICggdHlwZW9mIHZhbHVlID09ICdudW1iZXInICkge1xuICAgIGNlbGwgPSB0aGlzLmNlbGxzWyB2YWx1ZSBdO1xuICB9IGVsc2Uge1xuICAgIC8vIHVzZSBzdHJpbmcgYXMgc2VsZWN0b3JcbiAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyApIHtcbiAgICAgIHZhbHVlID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoIHZhbHVlICk7XG4gICAgfVxuICAgIC8vIGdldCBjZWxsIGZyb20gZWxlbWVudFxuICAgIGNlbGwgPSB0aGlzLmdldENlbGwoIHZhbHVlICk7XG4gIH1cbiAgLy8gc2VsZWN0IHNsaWRlIHRoYXQgaGFzIGNlbGxcbiAgZm9yICggdmFyIGk9MDsgY2VsbCAmJiBpIDwgdGhpcy5zbGlkZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIHNsaWRlID0gdGhpcy5zbGlkZXNbaV07XG4gICAgdmFyIGluZGV4ID0gc2xpZGUuY2VsbHMuaW5kZXhPZiggY2VsbCApO1xuICAgIGlmICggaW5kZXggIT0gLTEgKSB7XG4gICAgICB0aGlzLnNlbGVjdCggaSwgaXNXcmFwLCBpc0luc3RhbnQgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGdldCBjZWxscyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIGdldCBGbGlja2l0eS5DZWxsLCBnaXZlbiBhbiBFbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqIEByZXR1cm5zIHtGbGlja2l0eS5DZWxsfSBpdGVtXG4gKi9cbnByb3RvLmdldENlbGwgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgLy8gbG9vcCB0aHJvdWdoIGNlbGxzIHRvIGdldCB0aGUgb25lIHRoYXQgbWF0Y2hlc1xuICBmb3IgKCB2YXIgaT0wOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgY2VsbCA9IHRoaXMuY2VsbHNbaV07XG4gICAgaWYgKCBjZWxsLmVsZW1lbnQgPT0gZWxlbSApIHtcbiAgICAgIHJldHVybiBjZWxsO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBnZXQgY29sbGVjdGlvbiBvZiBGbGlja2l0eS5DZWxscywgZ2l2ZW4gRWxlbWVudHNcbiAqIEBwYXJhbSB7RWxlbWVudCwgQXJyYXksIE5vZGVMaXN0fSBlbGVtc1xuICogQHJldHVybnMge0FycmF5fSBjZWxscyAtIEZsaWNraXR5LkNlbGxzXG4gKi9cbnByb3RvLmdldENlbGxzID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBlbGVtcyA9IHV0aWxzLm1ha2VBcnJheSggZWxlbXMgKTtcbiAgdmFyIGNlbGxzID0gW107XG4gIGVsZW1zLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtICkge1xuICAgIHZhciBjZWxsID0gdGhpcy5nZXRDZWxsKCBlbGVtICk7XG4gICAgaWYgKCBjZWxsICkge1xuICAgICAgY2VsbHMucHVzaCggY2VsbCApO1xuICAgIH1cbiAgfSwgdGhpcyApO1xuICByZXR1cm4gY2VsbHM7XG59O1xuXG4vKipcbiAqIGdldCBjZWxsIGVsZW1lbnRzXG4gKiBAcmV0dXJucyB7QXJyYXl9IGNlbGxFbGVtc1xuICovXG5wcm90by5nZXRDZWxsRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2VsbHMubWFwKCBmdW5jdGlvbiggY2VsbCApIHtcbiAgICByZXR1cm4gY2VsbC5lbGVtZW50O1xuICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IHBhcmVudCBjZWxsIGZyb20gYW4gZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcmV0dXJucyB7RmxpY2tpdC5DZWxsfSBjZWxsXG4gKi9cbnByb3RvLmdldFBhcmVudENlbGwgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgLy8gZmlyc3QgY2hlY2sgaWYgZWxlbSBpcyBjZWxsXG4gIHZhciBjZWxsID0gdGhpcy5nZXRDZWxsKCBlbGVtICk7XG4gIGlmICggY2VsbCApIHtcbiAgICByZXR1cm4gY2VsbDtcbiAgfVxuICAvLyB0cnkgdG8gZ2V0IHBhcmVudCBjZWxsIGVsZW1cbiAgZWxlbSA9IHV0aWxzLmdldFBhcmVudCggZWxlbSwgJy5mbGlja2l0eS1zbGlkZXIgPiAqJyApO1xuICByZXR1cm4gdGhpcy5nZXRDZWxsKCBlbGVtICk7XG59O1xuXG4vKipcbiAqIGdldCBjZWxscyBhZGphY2VudCB0byBhIHNsaWRlXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGFkakNvdW50IC0gbnVtYmVyIG9mIGFkamFjZW50IHNsaWRlc1xuICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleCAtIGluZGV4IG9mIHNsaWRlIHRvIHN0YXJ0XG4gKiBAcmV0dXJucyB7QXJyYXl9IGNlbGxzIC0gYXJyYXkgb2YgRmxpY2tpdHkuQ2VsbHNcbiAqL1xucHJvdG8uZ2V0QWRqYWNlbnRDZWxsRWxlbWVudHMgPSBmdW5jdGlvbiggYWRqQ291bnQsIGluZGV4ICkge1xuICBpZiAoICFhZGpDb3VudCApIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFNsaWRlLmdldENlbGxFbGVtZW50cygpO1xuICB9XG4gIGluZGV4ID0gaW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuc2VsZWN0ZWRJbmRleCA6IGluZGV4O1xuXG4gIHZhciBsZW4gPSB0aGlzLnNsaWRlcy5sZW5ndGg7XG4gIGlmICggMSArICggYWRqQ291bnQgKiAyICkgPj0gbGVuICkge1xuICAgIHJldHVybiB0aGlzLmdldENlbGxFbGVtZW50cygpO1xuICB9XG5cbiAgdmFyIGNlbGxFbGVtcyA9IFtdO1xuICBmb3IgKCB2YXIgaSA9IGluZGV4IC0gYWRqQ291bnQ7IGkgPD0gaW5kZXggKyBhZGpDb3VudCA7IGkrKyApIHtcbiAgICB2YXIgc2xpZGVJbmRleCA9IHRoaXMub3B0aW9ucy53cmFwQXJvdW5kID8gdXRpbHMubW9kdWxvKCBpLCBsZW4gKSA6IGk7XG4gICAgdmFyIHNsaWRlID0gdGhpcy5zbGlkZXNbIHNsaWRlSW5kZXggXTtcbiAgICBpZiAoIHNsaWRlICkge1xuICAgICAgY2VsbEVsZW1zID0gY2VsbEVsZW1zLmNvbmNhdCggc2xpZGUuZ2V0Q2VsbEVsZW1lbnRzKCkgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNlbGxFbGVtcztcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGV2ZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5wcm90by51aUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXRFdmVudCgndWlDaGFuZ2UnKTtcbn07XG5cbnByb3RvLmNoaWxkVUlQb2ludGVyRG93biA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5lbWl0RXZlbnQoICdjaGlsZFVJUG9pbnRlckRvd24nLCBbIGV2ZW50IF0gKTtcbn07XG5cbi8vIC0tLS0tIHJlc2l6ZSAtLS0tLSAvL1xuXG5wcm90by5vbnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLndhdGNoQ1NTKCk7XG4gIHRoaXMucmVzaXplKCk7XG59O1xuXG51dGlscy5kZWJvdW5jZU1ldGhvZCggRmxpY2tpdHksICdvbnJlc2l6ZScsIDE1MCApO1xuXG5wcm90by5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5pc0FjdGl2ZSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5nZXRTaXplKCk7XG4gIC8vIHdyYXAgdmFsdWVzXG4gIGlmICggdGhpcy5vcHRpb25zLndyYXBBcm91bmQgKSB7XG4gICAgdGhpcy54ID0gdXRpbHMubW9kdWxvKCB0aGlzLngsIHRoaXMuc2xpZGVhYmxlV2lkdGggKTtcbiAgfVxuICB0aGlzLnBvc2l0aW9uQ2VsbHMoKTtcbiAgdGhpcy5fZ2V0V3JhcFNoaWZ0Q2VsbHMoKTtcbiAgdGhpcy5zZXRHYWxsZXJ5U2l6ZSgpO1xuICB0aGlzLmVtaXRFdmVudCgncmVzaXplJyk7XG4gIC8vIHVwZGF0ZSBzZWxlY3RlZCBpbmRleCBmb3IgZ3JvdXAgc2xpZGVzLCBpbnN0YW50XG4gIC8vIFRPRE86IHBvc2l0aW9uIGNhbiBiZSBsb3N0IGJldHdlZW4gZ3JvdXBzIG9mIHZhcmlvdXMgbnVtYmVyc1xuICB2YXIgc2VsZWN0ZWRFbGVtZW50ID0gdGhpcy5zZWxlY3RlZEVsZW1lbnRzICYmIHRoaXMuc2VsZWN0ZWRFbGVtZW50c1swXTtcbiAgdGhpcy5zZWxlY3RDZWxsKCBzZWxlY3RlZEVsZW1lbnQsIGZhbHNlLCB0cnVlICk7XG59O1xuXG4vLyB3YXRjaGVzIHRoZSA6YWZ0ZXIgcHJvcGVydHksIGFjdGl2YXRlcy9kZWFjdGl2YXRlc1xucHJvdG8ud2F0Y2hDU1MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHdhdGNoT3B0aW9uID0gdGhpcy5vcHRpb25zLndhdGNoQ1NTO1xuICBpZiAoICF3YXRjaE9wdGlvbiApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgYWZ0ZXJDb250ZW50ID0gZ2V0Q29tcHV0ZWRTdHlsZSggdGhpcy5lbGVtZW50LCAnOmFmdGVyJyApLmNvbnRlbnQ7XG4gIC8vIGFjdGl2YXRlIGlmIDphZnRlciB7IGNvbnRlbnQ6ICdmbGlja2l0eScgfVxuICBpZiAoIGFmdGVyQ29udGVudC5pbmRleE9mKCdmbGlja2l0eScpICE9IC0xICkge1xuICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgfVxufTtcblxuLy8gLS0tLS0ga2V5ZG93biAtLS0tLSAvL1xuXG4vLyBnbyBwcmV2aW91cy9uZXh0IGlmIGxlZnQvcmlnaHQga2V5cyBwcmVzc2VkXG5wcm90by5vbmtleWRvd24gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIC8vIG9ubHkgd29yayBpZiBlbGVtZW50IGlzIGluIGZvY3VzXG4gIGlmICggIXRoaXMub3B0aW9ucy5hY2Nlc3NpYmlsaXR5IHx8XG4gICAgKCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT0gdGhpcy5lbGVtZW50ICkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCBldmVudC5rZXlDb2RlID09IDM3ICkge1xuICAgIC8vIGdvIGxlZnRcbiAgICB2YXIgbGVmdE1ldGhvZCA9IHRoaXMub3B0aW9ucy5yaWdodFRvTGVmdCA/ICduZXh0JyA6ICdwcmV2aW91cyc7XG4gICAgdGhpcy51aUNoYW5nZSgpO1xuICAgIHRoaXNbIGxlZnRNZXRob2QgXSgpO1xuICB9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09IDM5ICkge1xuICAgIC8vIGdvIHJpZ2h0XG4gICAgdmFyIHJpZ2h0TWV0aG9kID0gdGhpcy5vcHRpb25zLnJpZ2h0VG9MZWZ0ID8gJ3ByZXZpb3VzJyA6ICduZXh0JztcbiAgICB0aGlzLnVpQ2hhbmdlKCk7XG4gICAgdGhpc1sgcmlnaHRNZXRob2QgXSgpO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkZXN0cm95IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGRlYWN0aXZhdGUgYWxsIEZsaWNraXR5IGZ1bmN0aW9uYWxpdHksIGJ1dCBrZWVwIHN0dWZmIGF2YWlsYWJsZVxucHJvdG8uZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLmlzQWN0aXZlICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmxpY2tpdHktZW5hYmxlZCcpO1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmxpY2tpdHktcnRsJyk7XG4gIC8vIGRlc3Ryb3kgY2VsbHNcbiAgdGhpcy5jZWxscy5mb3JFYWNoKCBmdW5jdGlvbiggY2VsbCApIHtcbiAgICBjZWxsLmRlc3Ryb3koKTtcbiAgfSk7XG4gIHRoaXMudW5zZWxlY3RTZWxlY3RlZFNsaWRlKCk7XG4gIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZCggdGhpcy52aWV3cG9ydCApO1xuICAvLyBtb3ZlIGNoaWxkIGVsZW1lbnRzIGJhY2sgaW50byBlbGVtZW50XG4gIG1vdmVFbGVtZW50cyggdGhpcy5zbGlkZXIuY2hpbGRyZW4sIHRoaXMuZWxlbWVudCApO1xuICBpZiAoIHRoaXMub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ICkge1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYkluZGV4Jyk7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgdGhpcyApO1xuICB9XG4gIC8vIHNldCBmbGFnc1xuICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gIHRoaXMuZW1pdEV2ZW50KCdkZWFjdGl2YXRlJyk7XG59O1xuXG5wcm90by5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIHRoaXMgKTtcbiAgdGhpcy5lbWl0RXZlbnQoJ2Rlc3Ryb3knKTtcbiAgaWYgKCBqUXVlcnkgJiYgdGhpcy4kZWxlbWVudCApIHtcbiAgICBqUXVlcnkucmVtb3ZlRGF0YSggdGhpcy5lbGVtZW50LCAnZmxpY2tpdHknICk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuZWxlbWVudC5mbGlja2l0eUdVSUQ7XG4gIGRlbGV0ZSBpbnN0YW5jZXNbIHRoaXMuZ3VpZCBdO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gcHJvdG90eXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnV0aWxzLmV4dGVuZCggcHJvdG8sIGFuaW1hdGVQcm90b3R5cGUgKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXh0cmFzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogZ2V0IEZsaWNraXR5IGluc3RhbmNlIGZyb20gZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcmV0dXJucyB7RmxpY2tpdHl9XG4gKi9cbkZsaWNraXR5LmRhdGEgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgZWxlbSA9IHV0aWxzLmdldFF1ZXJ5RWxlbWVudCggZWxlbSApO1xuICB2YXIgaWQgPSBlbGVtICYmIGVsZW0uZmxpY2tpdHlHVUlEO1xuICByZXR1cm4gaWQgJiYgaW5zdGFuY2VzWyBpZCBdO1xufTtcblxudXRpbHMuaHRtbEluaXQoIEZsaWNraXR5LCAnZmxpY2tpdHknICk7XG5cbmlmICggalF1ZXJ5ICYmIGpRdWVyeS5icmlkZ2V0ICkge1xuICBqUXVlcnkuYnJpZGdldCggJ2ZsaWNraXR5JywgRmxpY2tpdHkgKTtcbn1cblxuRmxpY2tpdHkuQ2VsbCA9IENlbGw7XG5cbnJldHVybiBGbGlja2l0eTtcblxufSkpO1xuIiwiLyohXG4gKiBGbGlja2l0eSB2Mi4wLjVcbiAqIFRvdWNoLCByZXNwb25zaXZlLCBmbGlja2FibGUgY2Fyb3VzZWxzXG4gKlxuICogTGljZW5zZWQgR1BMdjMgZm9yIG9wZW4gc291cmNlIHVzZVxuICogb3IgRmxpY2tpdHkgQ29tbWVyY2lhbCBMaWNlbnNlIGZvciBjb21tZXJjaWFsIHVzZVxuICpcbiAqIGh0dHA6Ly9mbGlja2l0eS5tZXRhZml6enkuY29cbiAqIENvcHlyaWdodCAyMDE2IE1ldGFmaXp6eVxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnLi9mbGlja2l0eScsXG4gICAgICAnLi9kcmFnJyxcbiAgICAgICcuL3ByZXYtbmV4dC1idXR0b24nLFxuICAgICAgJy4vcGFnZS1kb3RzJyxcbiAgICAgICcuL3BsYXllcicsXG4gICAgICAnLi9hZGQtcmVtb3ZlLWNlbGwnLFxuICAgICAgJy4vbGF6eWxvYWQnXG4gICAgXSwgZmFjdG9yeSApO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgcmVxdWlyZSgnLi9mbGlja2l0eScpLFxuICAgICAgcmVxdWlyZSgnLi9kcmFnJyksXG4gICAgICByZXF1aXJlKCcuL3ByZXYtbmV4dC1idXR0b24nKSxcbiAgICAgIHJlcXVpcmUoJy4vcGFnZS1kb3RzJyksXG4gICAgICByZXF1aXJlKCcuL3BsYXllcicpLFxuICAgICAgcmVxdWlyZSgnLi9hZGQtcmVtb3ZlLWNlbGwnKSxcbiAgICAgIHJlcXVpcmUoJy4vbGF6eWxvYWQnKVxuICAgICk7XG4gIH1cblxufSkoIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggRmxpY2tpdHkgKSB7XG4gIC8qanNoaW50IHN0cmljdDogZmFsc2UqL1xuICByZXR1cm4gRmxpY2tpdHk7XG59KTtcbiIsIi8vIGxhenlsb2FkXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJy4vZmxpY2tpdHknLFxuICAgICAgJ2Zpenp5LXVpLXV0aWxzL3V0aWxzJ1xuICAgIF0sIGZ1bmN0aW9uKCBGbGlja2l0eSwgdXRpbHMgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBGbGlja2l0eSwgdXRpbHMgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJy4vZmxpY2tpdHknKSxcbiAgICAgIHJlcXVpcmUoJ2Zpenp5LXVpLXV0aWxzJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5GbGlja2l0eSxcbiAgICAgIHdpbmRvdy5maXp6eVVJVXRpbHNcbiAgICApO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBGbGlja2l0eSwgdXRpbHMgKSB7XG4ndXNlIHN0cmljdCc7XG5cbkZsaWNraXR5LmNyZWF0ZU1ldGhvZHMucHVzaCgnX2NyZWF0ZUxhenlsb2FkJyk7XG52YXIgcHJvdG8gPSBGbGlja2l0eS5wcm90b3R5cGU7XG5cbnByb3RvLl9jcmVhdGVMYXp5bG9hZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9uKCAnc2VsZWN0JywgdGhpcy5sYXp5TG9hZCApO1xufTtcblxucHJvdG8ubGF6eUxvYWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxhenlMb2FkID0gdGhpcy5vcHRpb25zLmxhenlMb2FkO1xuICBpZiAoICFsYXp5TG9hZCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gZ2V0IGFkamFjZW50IGNlbGxzLCB1c2UgbGF6eUxvYWQgb3B0aW9uIGZvciBhZGphY2VudCBjb3VudFxuICB2YXIgYWRqQ291bnQgPSB0eXBlb2YgbGF6eUxvYWQgPT0gJ251bWJlcicgPyBsYXp5TG9hZCA6IDA7XG4gIHZhciBjZWxsRWxlbXMgPSB0aGlzLmdldEFkamFjZW50Q2VsbEVsZW1lbnRzKCBhZGpDb3VudCApO1xuICAvLyBnZXQgbGF6eSBpbWFnZXMgaW4gdGhvc2UgY2VsbHNcbiAgdmFyIGxhenlJbWFnZXMgPSBbXTtcbiAgY2VsbEVsZW1zLmZvckVhY2goIGZ1bmN0aW9uKCBjZWxsRWxlbSApIHtcbiAgICB2YXIgbGF6eUNlbGxJbWFnZXMgPSBnZXRDZWxsTGF6eUltYWdlcyggY2VsbEVsZW0gKTtcbiAgICBsYXp5SW1hZ2VzID0gbGF6eUltYWdlcy5jb25jYXQoIGxhenlDZWxsSW1hZ2VzICk7XG4gIH0pO1xuICAvLyBsb2FkIGxhenkgaW1hZ2VzXG4gIGxhenlJbWFnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGltZyApIHtcbiAgICBuZXcgTGF6eUxvYWRlciggaW1nLCB0aGlzICk7XG4gIH0sIHRoaXMgKTtcbn07XG5cbmZ1bmN0aW9uIGdldENlbGxMYXp5SW1hZ2VzKCBjZWxsRWxlbSApIHtcbiAgLy8gY2hlY2sgaWYgY2VsbCBlbGVtZW50IGlzIGxhenkgaW1hZ2VcbiAgaWYgKCBjZWxsRWxlbS5ub2RlTmFtZSA9PSAnSU1HJyAmJlxuICAgIGNlbGxFbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1mbGlja2l0eS1sYXp5bG9hZCcpICkge1xuICAgIHJldHVybiBbIGNlbGxFbGVtIF07XG4gIH1cbiAgLy8gc2VsZWN0IGxhenkgaW1hZ2VzIGluIGNlbGxcbiAgdmFyIGltZ3MgPSBjZWxsRWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1mbGlja2l0eS1sYXp5bG9hZF0nKTtcbiAgcmV0dXJuIHV0aWxzLm1ha2VBcnJheSggaW1ncyApO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBMYXp5TG9hZGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogY2xhc3MgdG8gaGFuZGxlIGxvYWRpbmcgaW1hZ2VzXG4gKi9cbmZ1bmN0aW9uIExhenlMb2FkZXIoIGltZywgZmxpY2tpdHkgKSB7XG4gIHRoaXMuaW1nID0gaW1nO1xuICB0aGlzLmZsaWNraXR5ID0gZmxpY2tpdHk7XG4gIHRoaXMubG9hZCgpO1xufVxuXG5MYXp5TG9hZGVyLnByb3RvdHlwZS5oYW5kbGVFdmVudCA9IHV0aWxzLmhhbmRsZUV2ZW50O1xuXG5MYXp5TG9hZGVyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgdGhpcyApO1xuICB0aGlzLmltZy5hZGRFdmVudExpc3RlbmVyKCAnZXJyb3InLCB0aGlzICk7XG4gIC8vIGxvYWQgaW1hZ2VcbiAgdGhpcy5pbWcuc3JjID0gdGhpcy5pbWcuZ2V0QXR0cmlidXRlKCdkYXRhLWZsaWNraXR5LWxhenlsb2FkJyk7XG4gIC8vIHJlbW92ZSBhdHRyXG4gIHRoaXMuaW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1mbGlja2l0eS1sYXp5bG9hZCcpO1xufTtcblxuTGF6eUxvYWRlci5wcm90b3R5cGUub25sb2FkID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB0aGlzLmNvbXBsZXRlKCBldmVudCwgJ2ZsaWNraXR5LWxhenlsb2FkZWQnICk7XG59O1xuXG5MYXp5TG9hZGVyLnByb3RvdHlwZS5vbmVycm9yID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB0aGlzLmNvbXBsZXRlKCBldmVudCwgJ2ZsaWNraXR5LWxhenllcnJvcicgKTtcbn07XG5cbkxhenlMb2FkZXIucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24oIGV2ZW50LCBjbGFzc05hbWUgKSB7XG4gIC8vIHVuYmluZCBldmVudHNcbiAgdGhpcy5pbWcucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCB0aGlzICk7XG4gIHRoaXMuaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdlcnJvcicsIHRoaXMgKTtcblxuICB2YXIgY2VsbCA9IHRoaXMuZmxpY2tpdHkuZ2V0UGFyZW50Q2VsbCggdGhpcy5pbWcgKTtcbiAgdmFyIGNlbGxFbGVtID0gY2VsbCAmJiBjZWxsLmVsZW1lbnQ7XG4gIHRoaXMuZmxpY2tpdHkuY2VsbFNpemVDaGFuZ2UoIGNlbGxFbGVtICk7XG5cbiAgdGhpcy5pbWcuY2xhc3NMaXN0LmFkZCggY2xhc3NOYW1lICk7XG4gIHRoaXMuZmxpY2tpdHkuZGlzcGF0Y2hFdmVudCggJ2xhenlMb2FkJywgZXZlbnQsIGNlbGxFbGVtICk7XG59O1xuXG4vLyAtLS0tLSAgLS0tLS0gLy9cblxuRmxpY2tpdHkuTGF6eUxvYWRlciA9IExhenlMb2FkZXI7XG5cbnJldHVybiBGbGlja2l0eTtcblxufSkpO1xuIiwiLy8gcGFnZSBkb3RzXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJy4vZmxpY2tpdHknLFxuICAgICAgJ3RhcC1saXN0ZW5lci90YXAtbGlzdGVuZXInLFxuICAgICAgJ2Zpenp5LXVpLXV0aWxzL3V0aWxzJ1xuICAgIF0sIGZ1bmN0aW9uKCBGbGlja2l0eSwgVGFwTGlzdGVuZXIsIHV0aWxzICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIFRhcExpc3RlbmVyLCB1dGlscyApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnLi9mbGlja2l0eScpLFxuICAgICAgcmVxdWlyZSgndGFwLWxpc3RlbmVyJyksXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuRmxpY2tpdHksXG4gICAgICB3aW5kb3cuVGFwTGlzdGVuZXIsXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIFRhcExpc3RlbmVyLCB1dGlscyApIHtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUGFnZURvdHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBQYWdlRG90cyggcGFyZW50ICkge1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fY3JlYXRlKCk7XG59XG5cblBhZ2VEb3RzLnByb3RvdHlwZSA9IG5ldyBUYXBMaXN0ZW5lcigpO1xuXG5QYWdlRG90cy5wcm90b3R5cGUuX2NyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBjcmVhdGUgaG9sZGVyIGVsZW1lbnRcbiAgdGhpcy5ob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvbCcpO1xuICB0aGlzLmhvbGRlci5jbGFzc05hbWUgPSAnZmxpY2tpdHktcGFnZS1kb3RzJztcbiAgLy8gY3JlYXRlIGRvdHMsIGFycmF5IG9mIGVsZW1lbnRzXG4gIHRoaXMuZG90cyA9IFtdO1xuICAvLyBldmVudHNcbiAgdGhpcy5vbiggJ3RhcCcsIHRoaXMub25UYXAgKTtcbiAgdGhpcy5vbiggJ3BvaW50ZXJEb3duJywgdGhpcy5wYXJlbnQuY2hpbGRVSVBvaW50ZXJEb3duLmJpbmQoIHRoaXMucGFyZW50ICkgKTtcbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNldERvdHMoKTtcbiAgdGhpcy5iaW5kVGFwKCB0aGlzLmhvbGRlciApO1xuICAvLyBhZGQgdG8gRE9NXG4gIHRoaXMucGFyZW50LmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHRoaXMuaG9sZGVyICk7XG59O1xuXG5QYWdlRG90cy5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyByZW1vdmUgZnJvbSBET01cbiAgdGhpcy5wYXJlbnQuZWxlbWVudC5yZW1vdmVDaGlsZCggdGhpcy5ob2xkZXIgKTtcbiAgVGFwTGlzdGVuZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCggdGhpcyApO1xufTtcblxuUGFnZURvdHMucHJvdG90eXBlLnNldERvdHMgPSBmdW5jdGlvbigpIHtcbiAgLy8gZ2V0IGRpZmZlcmVuY2UgYmV0d2VlbiBudW1iZXIgb2Ygc2xpZGVzIGFuZCBudW1iZXIgb2YgZG90c1xuICB2YXIgZGVsdGEgPSB0aGlzLnBhcmVudC5zbGlkZXMubGVuZ3RoIC0gdGhpcy5kb3RzLmxlbmd0aDtcbiAgaWYgKCBkZWx0YSA+IDAgKSB7XG4gICAgdGhpcy5hZGREb3RzKCBkZWx0YSApO1xuICB9IGVsc2UgaWYgKCBkZWx0YSA8IDAgKSB7XG4gICAgdGhpcy5yZW1vdmVEb3RzKCAtZGVsdGEgKTtcbiAgfVxufTtcblxuUGFnZURvdHMucHJvdG90eXBlLmFkZERvdHMgPSBmdW5jdGlvbiggY291bnQgKSB7XG4gIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIG5ld0RvdHMgPSBbXTtcbiAgd2hpbGUgKCBjb3VudCApIHtcbiAgICB2YXIgZG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBkb3QuY2xhc3NOYW1lID0gJ2RvdCc7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRvdCApO1xuICAgIG5ld0RvdHMucHVzaCggZG90ICk7XG4gICAgY291bnQtLTtcbiAgfVxuICB0aGlzLmhvbGRlci5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcbiAgdGhpcy5kb3RzID0gdGhpcy5kb3RzLmNvbmNhdCggbmV3RG90cyApO1xufTtcblxuUGFnZURvdHMucHJvdG90eXBlLnJlbW92ZURvdHMgPSBmdW5jdGlvbiggY291bnQgKSB7XG4gIC8vIHJlbW92ZSBmcm9tIHRoaXMuZG90cyBjb2xsZWN0aW9uXG4gIHZhciByZW1vdmVEb3RzID0gdGhpcy5kb3RzLnNwbGljZSggdGhpcy5kb3RzLmxlbmd0aCAtIGNvdW50LCBjb3VudCApO1xuICAvLyByZW1vdmUgZnJvbSBET01cbiAgcmVtb3ZlRG90cy5mb3JFYWNoKCBmdW5jdGlvbiggZG90ICkge1xuICAgIHRoaXMuaG9sZGVyLnJlbW92ZUNoaWxkKCBkb3QgKTtcbiAgfSwgdGhpcyApO1xufTtcblxuUGFnZURvdHMucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gIC8vIHJlbW92ZSBzZWxlY3RlZCBjbGFzcyBvbiBwcmV2aW91c1xuICBpZiAoIHRoaXMuc2VsZWN0ZWREb3QgKSB7XG4gICAgdGhpcy5zZWxlY3RlZERvdC5jbGFzc05hbWUgPSAnZG90JztcbiAgfVxuICAvLyBkb24ndCBwcm9jZWVkIGlmIG5vIGRvdHNcbiAgaWYgKCAhdGhpcy5kb3RzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5zZWxlY3RlZERvdCA9IHRoaXMuZG90c1sgdGhpcy5wYXJlbnQuc2VsZWN0ZWRJbmRleCBdO1xuICB0aGlzLnNlbGVjdGVkRG90LmNsYXNzTmFtZSA9ICdkb3QgaXMtc2VsZWN0ZWQnO1xufTtcblxuUGFnZURvdHMucHJvdG90eXBlLm9uVGFwID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAvLyBvbmx5IGNhcmUgYWJvdXQgZG90IGNsaWNrc1xuICBpZiAoIHRhcmdldC5ub2RlTmFtZSAhPSAnTEknICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMucGFyZW50LnVpQ2hhbmdlKCk7XG4gIHZhciBpbmRleCA9IHRoaXMuZG90cy5pbmRleE9mKCB0YXJnZXQgKTtcbiAgdGhpcy5wYXJlbnQuc2VsZWN0KCBpbmRleCApO1xufTtcblxuUGFnZURvdHMucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kZWFjdGl2YXRlKCk7XG59O1xuXG5GbGlja2l0eS5QYWdlRG90cyA9IFBhZ2VEb3RzO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGbGlja2l0eSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG51dGlscy5leHRlbmQoIEZsaWNraXR5LmRlZmF1bHRzLCB7XG4gIHBhZ2VEb3RzOiB0cnVlXG59KTtcblxuRmxpY2tpdHkuY3JlYXRlTWV0aG9kcy5wdXNoKCdfY3JlYXRlUGFnZURvdHMnKTtcblxudmFyIHByb3RvID0gRmxpY2tpdHkucHJvdG90eXBlO1xuXG5wcm90by5fY3JlYXRlUGFnZURvdHMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5vcHRpb25zLnBhZ2VEb3RzICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnBhZ2VEb3RzID0gbmV3IFBhZ2VEb3RzKCB0aGlzICk7XG4gIC8vIGV2ZW50c1xuICB0aGlzLm9uKCAnYWN0aXZhdGUnLCB0aGlzLmFjdGl2YXRlUGFnZURvdHMgKTtcbiAgdGhpcy5vbiggJ3NlbGVjdCcsIHRoaXMudXBkYXRlU2VsZWN0ZWRQYWdlRG90cyApO1xuICB0aGlzLm9uKCAnY2VsbENoYW5nZScsIHRoaXMudXBkYXRlUGFnZURvdHMgKTtcbiAgdGhpcy5vbiggJ3Jlc2l6ZScsIHRoaXMudXBkYXRlUGFnZURvdHMgKTtcbiAgdGhpcy5vbiggJ2RlYWN0aXZhdGUnLCB0aGlzLmRlYWN0aXZhdGVQYWdlRG90cyApO1xufTtcblxucHJvdG8uYWN0aXZhdGVQYWdlRG90cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhZ2VEb3RzLmFjdGl2YXRlKCk7XG59O1xuXG5wcm90by51cGRhdGVTZWxlY3RlZFBhZ2VEb3RzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGFnZURvdHMudXBkYXRlU2VsZWN0ZWQoKTtcbn07XG5cbnByb3RvLnVwZGF0ZVBhZ2VEb3RzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGFnZURvdHMuc2V0RG90cygpO1xufTtcblxucHJvdG8uZGVhY3RpdmF0ZVBhZ2VEb3RzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGFnZURvdHMuZGVhY3RpdmF0ZSgpO1xufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbkZsaWNraXR5LlBhZ2VEb3RzID0gUGFnZURvdHM7XG5cbnJldHVybiBGbGlja2l0eTtcblxufSkpO1xuIiwiLy8gcGxheWVyICYgYXV0b1BsYXlcbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZXYtZW1pdHRlci9ldi1lbWl0dGVyJyxcbiAgICAgICdmaXp6eS11aS11dGlscy91dGlscycsXG4gICAgICAnLi9mbGlja2l0eSdcbiAgICBdLCBmdW5jdGlvbiggRXZFbWl0dGVyLCB1dGlscywgRmxpY2tpdHkgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggRXZFbWl0dGVyLCB1dGlscywgRmxpY2tpdHkgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHJlcXVpcmUoJ2V2LWVtaXR0ZXInKSxcbiAgICAgIHJlcXVpcmUoJ2Zpenp5LXVpLXV0aWxzJyksXG4gICAgICByZXF1aXJlKCcuL2ZsaWNraXR5JylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgZmFjdG9yeShcbiAgICAgIHdpbmRvdy5FdkVtaXR0ZXIsXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzLFxuICAgICAgd2luZG93LkZsaWNraXR5XG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIEV2RW1pdHRlciwgdXRpbHMsIEZsaWNraXR5ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBhZ2UgVmlzaWJpbGl0eSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvR3VpZGUvVXNlcl9leHBlcmllbmNlL1VzaW5nX3RoZV9QYWdlX1Zpc2liaWxpdHlfQVBJXG5cbnZhciBoaWRkZW5Qcm9wZXJ0eSwgdmlzaWJpbGl0eUV2ZW50O1xuaWYgKCAnaGlkZGVuJyBpbiBkb2N1bWVudCApIHtcbiAgaGlkZGVuUHJvcGVydHkgPSAnaGlkZGVuJztcbiAgdmlzaWJpbGl0eUV2ZW50ID0gJ3Zpc2liaWxpdHljaGFuZ2UnO1xufSBlbHNlIGlmICggJ3dlYmtpdEhpZGRlbicgaW4gZG9jdW1lbnQgKSB7XG4gIGhpZGRlblByb3BlcnR5ID0gJ3dlYmtpdEhpZGRlbic7XG4gIHZpc2liaWxpdHlFdmVudCA9ICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUGxheWVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIFBsYXllciggcGFyZW50ICkge1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5zdGF0ZSA9ICdzdG9wcGVkJztcbiAgLy8gdmlzaWJpbGl0eSBjaGFuZ2UgZXZlbnQgaGFuZGxlclxuICBpZiAoIHZpc2liaWxpdHlFdmVudCApIHtcbiAgICB0aGlzLm9uVmlzaWJpbGl0eUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy52aXNpYmlsaXR5Q2hhbmdlKCk7XG4gICAgfS5iaW5kKCB0aGlzICk7XG4gICAgdGhpcy5vblZpc2liaWxpdHlQbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlQbGF5KCk7XG4gICAgfS5iaW5kKCB0aGlzICk7XG4gIH1cbn1cblxuUGxheWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEV2RW1pdHRlci5wcm90b3R5cGUgKTtcblxuLy8gc3RhcnQgcGxheVxuUGxheWVyLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5zdGF0ZSA9PSAncGxheWluZycgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGRvIG5vdCBwbGF5IGlmIHBhZ2UgaXMgaGlkZGVuLCBzdGFydCBwbGF5aW5nIHdoZW4gcGFnZSBpcyB2aXNpYmxlXG4gIHZhciBpc1BhZ2VIaWRkZW4gPSBkb2N1bWVudFsgaGlkZGVuUHJvcGVydHkgXTtcbiAgaWYgKCB2aXNpYmlsaXR5RXZlbnQgJiYgaXNQYWdlSGlkZGVuICkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHZpc2liaWxpdHlFdmVudCwgdGhpcy5vblZpc2liaWxpdHlQbGF5ICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5zdGF0ZSA9ICdwbGF5aW5nJztcbiAgLy8gbGlzdGVuIHRvIHZpc2liaWxpdHkgY2hhbmdlXG4gIGlmICggdmlzaWJpbGl0eUV2ZW50ICkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHZpc2liaWxpdHlFdmVudCwgdGhpcy5vblZpc2liaWxpdHlDaGFuZ2UgKTtcbiAgfVxuICAvLyBzdGFydCB0aWNraW5nXG4gIHRoaXMudGljaygpO1xufTtcblxuUGxheWVyLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG4gIC8vIGRvIG5vdCB0aWNrIGlmIG5vdCBwbGF5aW5nXG4gIGlmICggdGhpcy5zdGF0ZSAhPSAncGxheWluZycgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRpbWUgPSB0aGlzLnBhcmVudC5vcHRpb25zLmF1dG9QbGF5O1xuICAvLyBkZWZhdWx0IHRvIDMgc2Vjb25kc1xuICB0aW1lID0gdHlwZW9mIHRpbWUgPT0gJ251bWJlcicgPyB0aW1lIDogMzAwMDtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgLy8gSEFDSzogcmVzZXQgdGlja3MgaWYgc3RvcHBlZCBhbmQgc3RhcnRlZCB3aXRoaW4gaW50ZXJ2YWxcbiAgdGhpcy5jbGVhcigpO1xuICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICBfdGhpcy5wYXJlbnQubmV4dCggdHJ1ZSApO1xuICAgIF90aGlzLnRpY2soKTtcbiAgfSwgdGltZSApO1xufTtcblxuUGxheWVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gIHRoaXMuY2xlYXIoKTtcbiAgLy8gcmVtb3ZlIHZpc2liaWxpdHkgY2hhbmdlIGV2ZW50XG4gIGlmICggdmlzaWJpbGl0eUV2ZW50ICkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIHZpc2liaWxpdHlFdmVudCwgdGhpcy5vblZpc2liaWxpdHlDaGFuZ2UgKTtcbiAgfVxufTtcblxuUGxheWVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBjbGVhclRpbWVvdXQoIHRoaXMudGltZW91dCApO1xufTtcblxuUGxheWVyLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIHRoaXMuc3RhdGUgPT0gJ3BsYXlpbmcnICkge1xuICAgIHRoaXMuc3RhdGUgPSAncGF1c2VkJztcbiAgICB0aGlzLmNsZWFyKCk7XG4gIH1cbn07XG5cblBsYXllci5wcm90b3R5cGUudW5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAvLyByZS1zdGFydCBwbGF5IGlmIHBhdXNlZFxuICBpZiAoIHRoaXMuc3RhdGUgPT0gJ3BhdXNlZCcgKSB7XG4gICAgdGhpcy5wbGF5KCk7XG4gIH1cbn07XG5cbi8vIHBhdXNlIGlmIHBhZ2UgdmlzaWJpbGl0eSBpcyBoaWRkZW4sIHVucGF1c2UgaWYgdmlzaWJsZVxuUGxheWVyLnByb3RvdHlwZS52aXNpYmlsaXR5Q2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpc1BhZ2VIaWRkZW4gPSBkb2N1bWVudFsgaGlkZGVuUHJvcGVydHkgXTtcbiAgdGhpc1sgaXNQYWdlSGlkZGVuID8gJ3BhdXNlJyA6ICd1bnBhdXNlJyBdKCk7XG59O1xuXG5QbGF5ZXIucHJvdG90eXBlLnZpc2liaWxpdHlQbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGxheSgpO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB2aXNpYmlsaXR5RXZlbnQsIHRoaXMub25WaXNpYmlsaXR5UGxheSApO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRmxpY2tpdHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudXRpbHMuZXh0ZW5kKCBGbGlja2l0eS5kZWZhdWx0cywge1xuICBwYXVzZUF1dG9QbGF5T25Ib3ZlcjogdHJ1ZVxufSk7XG5cbkZsaWNraXR5LmNyZWF0ZU1ldGhvZHMucHVzaCgnX2NyZWF0ZVBsYXllcicpO1xudmFyIHByb3RvID0gRmxpY2tpdHkucHJvdG90eXBlO1xuXG5wcm90by5fY3JlYXRlUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGxheWVyID0gbmV3IFBsYXllciggdGhpcyApO1xuXG4gIHRoaXMub24oICdhY3RpdmF0ZScsIHRoaXMuYWN0aXZhdGVQbGF5ZXIgKTtcbiAgdGhpcy5vbiggJ3VpQ2hhbmdlJywgdGhpcy5zdG9wUGxheWVyICk7XG4gIHRoaXMub24oICdwb2ludGVyRG93bicsIHRoaXMuc3RvcFBsYXllciApO1xuICB0aGlzLm9uKCAnZGVhY3RpdmF0ZScsIHRoaXMuZGVhY3RpdmF0ZVBsYXllciApO1xufTtcblxucHJvdG8uYWN0aXZhdGVQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5vcHRpb25zLmF1dG9QbGF5ICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnBsYXllci5wbGF5KCk7XG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2VlbnRlcicsIHRoaXMgKTtcbn07XG5cbi8vIFBsYXllciBBUEksIGRvbid0IGhhdGUgdGhlIC4uLiB0aGFua3MgSSBrbm93IHdoZXJlIHRoZSBkb29yIGlzXG5cbnByb3RvLnBsYXlQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5ZXIucGxheSgpO1xufTtcblxucHJvdG8uc3RvcFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXllci5zdG9wKCk7XG59O1xuXG5wcm90by5wYXVzZVBsYXllciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXllci5wYXVzZSgpO1xufTtcblxucHJvdG8udW5wYXVzZVBsYXllciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXllci51bnBhdXNlKCk7XG59O1xuXG5wcm90by5kZWFjdGl2YXRlUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGxheWVyLnN0b3AoKTtcbiAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZWVudGVyJywgdGhpcyApO1xufTtcblxuLy8gLS0tLS0gbW91c2VlbnRlci9sZWF2ZSAtLS0tLSAvL1xuXG4vLyBwYXVzZSBhdXRvLXBsYXkgb24gaG92ZXJcbnByb3RvLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLm9wdGlvbnMucGF1c2VBdXRvUGxheU9uSG92ZXIgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMucGxheWVyLnBhdXNlKCk7XG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2VsZWF2ZScsIHRoaXMgKTtcbn07XG5cbi8vIHJlc3VtZSBhdXRvLXBsYXkgb24gaG92ZXIgb2ZmXG5wcm90by5vbm1vdXNlbGVhdmUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5ZXIudW5wYXVzZSgpO1xuICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbGVhdmUnLCB0aGlzICk7XG59O1xuXG4vLyAtLS0tLSAgLS0tLS0gLy9cblxuRmxpY2tpdHkuUGxheWVyID0gUGxheWVyO1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8vIHByZXYvbmV4dCBidXR0b25zXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJy4vZmxpY2tpdHknLFxuICAgICAgJ3RhcC1saXN0ZW5lci90YXAtbGlzdGVuZXInLFxuICAgICAgJ2Zpenp5LXVpLXV0aWxzL3V0aWxzJ1xuICAgIF0sIGZ1bmN0aW9uKCBGbGlja2l0eSwgVGFwTGlzdGVuZXIsIHV0aWxzICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIFRhcExpc3RlbmVyLCB1dGlscyApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnLi9mbGlja2l0eScpLFxuICAgICAgcmVxdWlyZSgndGFwLWxpc3RlbmVyJyksXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuRmxpY2tpdHksXG4gICAgICB3aW5kb3cuVGFwTGlzdGVuZXIsXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIFRhcExpc3RlbmVyLCB1dGlscyApIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIHN2Z1VSSSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFByZXZOZXh0QnV0dG9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIFByZXZOZXh0QnV0dG9uKCBkaXJlY3Rpb24sIHBhcmVudCApIHtcbiAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICB0aGlzLl9jcmVhdGUoKTtcbn1cblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlID0gbmV3IFRhcExpc3RlbmVyKCk7XG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZS5fY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIHByb3BlcnRpZXNcbiAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xuICB0aGlzLmlzUHJldmlvdXMgPSB0aGlzLmRpcmVjdGlvbiA9PSAtMTtcbiAgdmFyIGxlZnREaXJlY3Rpb24gPSB0aGlzLnBhcmVudC5vcHRpb25zLnJpZ2h0VG9MZWZ0ID8gMSA6IC0xO1xuICB0aGlzLmlzTGVmdCA9IHRoaXMuZGlyZWN0aW9uID09IGxlZnREaXJlY3Rpb247XG5cbiAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgZWxlbWVudC5jbGFzc05hbWUgPSAnZmxpY2tpdHktcHJldi1uZXh0LWJ1dHRvbic7XG4gIGVsZW1lbnQuY2xhc3NOYW1lICs9IHRoaXMuaXNQcmV2aW91cyA/ICcgcHJldmlvdXMnIDogJyBuZXh0JztcbiAgLy8gcHJldmVudCBidXR0b24gZnJvbSBzdWJtaXR0aW5nIGZvcm0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA4MzYwNzYvMTgyMTgzXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCAndHlwZScsICdidXR0b24nICk7XG4gIC8vIGluaXQgYXMgZGlzYWJsZWRcbiAgdGhpcy5kaXNhYmxlKCk7XG5cbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdhcmlhLWxhYmVsJywgdGhpcy5pc1ByZXZpb3VzID8gJ3ByZXZpb3VzJyA6ICduZXh0JyApO1xuXG4gIC8vIGNyZWF0ZSBhcnJvd1xuICB2YXIgc3ZnID0gdGhpcy5jcmVhdGVTVkcoKTtcbiAgZWxlbWVudC5hcHBlbmRDaGlsZCggc3ZnICk7XG4gIC8vIGV2ZW50c1xuICB0aGlzLm9uKCAndGFwJywgdGhpcy5vblRhcCApO1xuICB0aGlzLnBhcmVudC5vbiggJ3NlbGVjdCcsIHRoaXMudXBkYXRlLmJpbmQoIHRoaXMgKSApO1xuICB0aGlzLm9uKCAncG9pbnRlckRvd24nLCB0aGlzLnBhcmVudC5jaGlsZFVJUG9pbnRlckRvd24uYmluZCggdGhpcy5wYXJlbnQgKSApO1xufTtcblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYmluZFRhcCggdGhpcy5lbGVtZW50ICk7XG4gIC8vIGNsaWNrIGV2ZW50cyBmcm9tIGtleWJvYXJkXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzICk7XG4gIC8vIGFkZCB0byBET01cbiAgdGhpcy5wYXJlbnQuZWxlbWVudC5hcHBlbmRDaGlsZCggdGhpcy5lbGVtZW50ICk7XG59O1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyByZW1vdmUgZnJvbSBET01cbiAgdGhpcy5wYXJlbnQuZWxlbWVudC5yZW1vdmVDaGlsZCggdGhpcy5lbGVtZW50ICk7XG4gIC8vIGRvIHJlZ3VsYXIgVGFwTGlzdGVuZXIgZGVzdHJveVxuICBUYXBMaXN0ZW5lci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKCB0aGlzICk7XG4gIC8vIGNsaWNrIGV2ZW50cyBmcm9tIGtleWJvYXJkXG4gIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzICk7XG59O1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuY3JlYXRlU1ZHID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoIHN2Z1VSSSwgJ3N2ZycpO1xuICBzdmcuc2V0QXR0cmlidXRlKCAndmlld0JveCcsICcwIDAgMTAwIDEwMCcgKTtcbiAgdmFyIHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoIHN2Z1VSSSwgJ3BhdGgnKTtcbiAgdmFyIHBhdGhNb3ZlbWVudHMgPSBnZXRBcnJvd01vdmVtZW50cyggdGhpcy5wYXJlbnQub3B0aW9ucy5hcnJvd1NoYXBlICk7XG4gIHBhdGguc2V0QXR0cmlidXRlKCAnZCcsIHBhdGhNb3ZlbWVudHMgKTtcbiAgcGF0aC5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhcnJvdycgKTtcbiAgLy8gcm90YXRlIGFycm93XG4gIGlmICggIXRoaXMuaXNMZWZ0ICkge1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgxMDAsIDEwMCkgcm90YXRlKDE4MCkgJyApO1xuICB9XG4gIHN2Zy5hcHBlbmRDaGlsZCggcGF0aCApO1xuICByZXR1cm4gc3ZnO1xufTtcblxuLy8gZ2V0IFNWRyBwYXRoIG1vdm1lbWVudFxuZnVuY3Rpb24gZ2V0QXJyb3dNb3ZlbWVudHMoIHNoYXBlICkge1xuICAvLyB1c2Ugc2hhcGUgYXMgbW92ZW1lbnQgaWYgc3RyaW5nXG4gIGlmICggdHlwZW9mIHNoYXBlID09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuICAvLyBjcmVhdGUgbW92ZW1lbnQgc3RyaW5nXG4gIHJldHVybiAnTSAnICsgc2hhcGUueDAgKyAnLDUwJyArXG4gICAgJyBMICcgKyBzaGFwZS54MSArICcsJyArICggc2hhcGUueTEgKyA1MCApICtcbiAgICAnIEwgJyArIHNoYXBlLngyICsgJywnICsgKCBzaGFwZS55MiArIDUwICkgK1xuICAgICcgTCAnICsgc2hhcGUueDMgKyAnLDUwICcgK1xuICAgICcgTCAnICsgc2hhcGUueDIgKyAnLCcgKyAoIDUwIC0gc2hhcGUueTIgKSArXG4gICAgJyBMICcgKyBzaGFwZS54MSArICcsJyArICggNTAgLSBzaGFwZS55MSApICtcbiAgICAnIFonO1xufVxuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUub25UYXAgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5pc0VuYWJsZWQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMucGFyZW50LnVpQ2hhbmdlKCk7XG4gIHZhciBtZXRob2QgPSB0aGlzLmlzUHJldmlvdXMgPyAncHJldmlvdXMnIDogJ25leHQnO1xuICB0aGlzLnBhcmVudFsgbWV0aG9kIF0oKTtcbn07XG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZS5oYW5kbGVFdmVudCA9IHV0aWxzLmhhbmRsZUV2ZW50O1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAvLyBvbmx5IGFsbG93IGNsaWNrcyBmcm9tIGtleWJvYXJkXG4gIHZhciBmb2N1c2VkID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgaWYgKCBmb2N1c2VkICYmIGZvY3VzZWQgPT0gdGhpcy5lbGVtZW50ICkge1xuICAgIHRoaXMub25UYXAoKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCB0aGlzLmlzRW5hYmxlZCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gZmFsc2U7XG4gIHRoaXMuaXNFbmFibGVkID0gdHJ1ZTtcbn07XG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuaXNFbmFibGVkICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xufTtcblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBpbmRleCBvZiBmaXJzdCBvciBsYXN0IHNsaWRlLCBpZiBwcmV2aW91cyBvciBuZXh0XG4gIHZhciBzbGlkZXMgPSB0aGlzLnBhcmVudC5zbGlkZXM7XG4gIC8vIGVuYWJsZSBpcyB3cmFwQXJvdW5kIGFuZCBhdCBsZWFzdCAyIHNsaWRlc1xuICBpZiAoIHRoaXMucGFyZW50Lm9wdGlvbnMud3JhcEFyb3VuZCAmJiBzbGlkZXMubGVuZ3RoID4gMSApIHtcbiAgICB0aGlzLmVuYWJsZSgpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gc2xpZGVzLmxlbmd0aCA/IHNsaWRlcy5sZW5ndGggLSAxIDogMDtcbiAgdmFyIGJvdW5kSW5kZXggPSB0aGlzLmlzUHJldmlvdXMgPyAwIDogbGFzdEluZGV4O1xuICB2YXIgbWV0aG9kID0gdGhpcy5wYXJlbnQuc2VsZWN0ZWRJbmRleCA9PSBib3VuZEluZGV4ID8gJ2Rpc2FibGUnIDogJ2VuYWJsZSc7XG4gIHRoaXNbIG1ldGhvZCBdKCk7XG59O1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRlYWN0aXZhdGUoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZsaWNraXR5IHByb3RvdHlwZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG51dGlscy5leHRlbmQoIEZsaWNraXR5LmRlZmF1bHRzLCB7XG4gIHByZXZOZXh0QnV0dG9uczogdHJ1ZSxcbiAgYXJyb3dTaGFwZToge1xuICAgIHgwOiAxMCxcbiAgICB4MTogNjAsIHkxOiA1MCxcbiAgICB4MjogNzAsIHkyOiA0MCxcbiAgICB4MzogMzBcbiAgfVxufSk7XG5cbkZsaWNraXR5LmNyZWF0ZU1ldGhvZHMucHVzaCgnX2NyZWF0ZVByZXZOZXh0QnV0dG9ucycpO1xudmFyIHByb3RvID0gRmxpY2tpdHkucHJvdG90eXBlO1xuXG5wcm90by5fY3JlYXRlUHJldk5leHRCdXR0b25zID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMub3B0aW9ucy5wcmV2TmV4dEJ1dHRvbnMgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5wcmV2QnV0dG9uID0gbmV3IFByZXZOZXh0QnV0dG9uKCAtMSwgdGhpcyApO1xuICB0aGlzLm5leHRCdXR0b24gPSBuZXcgUHJldk5leHRCdXR0b24oIDEsIHRoaXMgKTtcblxuICB0aGlzLm9uKCAnYWN0aXZhdGUnLCB0aGlzLmFjdGl2YXRlUHJldk5leHRCdXR0b25zICk7XG59O1xuXG5wcm90by5hY3RpdmF0ZVByZXZOZXh0QnV0dG9ucyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByZXZCdXR0b24uYWN0aXZhdGUoKTtcbiAgdGhpcy5uZXh0QnV0dG9uLmFjdGl2YXRlKCk7XG4gIHRoaXMub24oICdkZWFjdGl2YXRlJywgdGhpcy5kZWFjdGl2YXRlUHJldk5leHRCdXR0b25zICk7XG59O1xuXG5wcm90by5kZWFjdGl2YXRlUHJldk5leHRCdXR0b25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJldkJ1dHRvbi5kZWFjdGl2YXRlKCk7XG4gIHRoaXMubmV4dEJ1dHRvbi5kZWFjdGl2YXRlKCk7XG4gIHRoaXMub2ZmKCAnZGVhY3RpdmF0ZScsIHRoaXMuZGVhY3RpdmF0ZVByZXZOZXh0QnV0dG9ucyApO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbkZsaWNraXR5LlByZXZOZXh0QnV0dG9uID0gUHJldk5leHRCdXR0b247XG5cbnJldHVybiBGbGlja2l0eTtcblxufSkpO1xuIiwiLy8gc2xpZGVcbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBmYWN0b3J5ICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5GbGlja2l0eSA9IHdpbmRvdy5GbGlja2l0eSB8fCB7fTtcbiAgICB3aW5kb3cuRmxpY2tpdHkuU2xpZGUgPSBmYWN0b3J5KCk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCkge1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTbGlkZSggcGFyZW50ICkge1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5pc09yaWdpbkxlZnQgPSBwYXJlbnQub3JpZ2luU2lkZSA9PSAnbGVmdCc7XG4gIHRoaXMuY2VsbHMgPSBbXTtcbiAgdGhpcy5vdXRlcldpZHRoID0gMDtcbiAgdGhpcy5oZWlnaHQgPSAwO1xufVxuXG52YXIgcHJvdG8gPSBTbGlkZS5wcm90b3R5cGU7XG5cbnByb3RvLmFkZENlbGwgPSBmdW5jdGlvbiggY2VsbCApIHtcbiAgdGhpcy5jZWxscy5wdXNoKCBjZWxsICk7XG4gIHRoaXMub3V0ZXJXaWR0aCArPSBjZWxsLnNpemUub3V0ZXJXaWR0aDtcbiAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heCggY2VsbC5zaXplLm91dGVySGVpZ2h0LCB0aGlzLmhlaWdodCApO1xuICAvLyBmaXJzdCBjZWxsIHN0dWZmXG4gIGlmICggdGhpcy5jZWxscy5sZW5ndGggPT0gMSApIHtcbiAgICB0aGlzLnggPSBjZWxsLng7IC8vIHggY29tZXMgZnJvbSBmaXJzdCBjZWxsXG4gICAgdmFyIGJlZ2luTWFyZ2luID0gdGhpcy5pc09yaWdpbkxlZnQgPyAnbWFyZ2luTGVmdCcgOiAnbWFyZ2luUmlnaHQnO1xuICAgIHRoaXMuZmlyc3RNYXJnaW4gPSBjZWxsLnNpemVbIGJlZ2luTWFyZ2luIF07XG4gIH1cbn07XG5cbnByb3RvLnVwZGF0ZVRhcmdldCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZW5kTWFyZ2luID0gdGhpcy5pc09yaWdpbkxlZnQgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuICB2YXIgbGFzdENlbGwgPSB0aGlzLmdldExhc3RDZWxsKCk7XG4gIHZhciBsYXN0TWFyZ2luID0gbGFzdENlbGwgPyBsYXN0Q2VsbC5zaXplWyBlbmRNYXJnaW4gXSA6IDA7XG4gIHZhciBzbGlkZVdpZHRoID0gdGhpcy5vdXRlcldpZHRoIC0gKCB0aGlzLmZpcnN0TWFyZ2luICsgbGFzdE1hcmdpbiApO1xuICB0aGlzLnRhcmdldCA9IHRoaXMueCArIHRoaXMuZmlyc3RNYXJnaW4gKyBzbGlkZVdpZHRoICogdGhpcy5wYXJlbnQuY2VsbEFsaWduO1xufTtcblxucHJvdG8uZ2V0TGFzdENlbGwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2VsbHNbIHRoaXMuY2VsbHMubGVuZ3RoIC0gMSBdO1xufTtcblxucHJvdG8uc2VsZWN0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2hhbmdlU2VsZWN0ZWRDbGFzcygnYWRkJyk7XG59O1xuXG5wcm90by51bnNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNoYW5nZVNlbGVjdGVkQ2xhc3MoJ3JlbW92ZScpO1xufTtcblxucHJvdG8uY2hhbmdlU2VsZWN0ZWRDbGFzcyA9IGZ1bmN0aW9uKCBtZXRob2QgKSB7XG4gIHRoaXMuY2VsbHMuZm9yRWFjaCggZnVuY3Rpb24oIGNlbGwgKSB7XG4gICAgY2VsbC5lbGVtZW50LmNsYXNzTGlzdFsgbWV0aG9kIF0oJ2lzLXNlbGVjdGVkJyk7XG4gIH0pO1xufTtcblxucHJvdG8uZ2V0Q2VsbEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNlbGxzLm1hcCggZnVuY3Rpb24oIGNlbGwgKSB7XG4gICAgcmV0dXJuIGNlbGwuZWxlbWVudDtcbiAgfSk7XG59O1xuXG5yZXR1cm4gU2xpZGU7XG5cbn0pKTtcbiIsIi8qIVxuICogZ2V0U2l6ZSB2Mi4wLjJcbiAqIG1lYXN1cmUgc2l6ZSBvZiBlbGVtZW50c1xuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCBzdHJpY3Q6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGNvbnNvbGU6IGZhbHNlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5nZXRTaXplID0gZmFjdG9yeSgpO1xuICB9XG5cbn0pKCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZ2V0IGEgbnVtYmVyIGZyb20gYSBzdHJpbmcsIG5vdCBhIHBlcmNlbnRhZ2VcbmZ1bmN0aW9uIGdldFN0eWxlU2l6ZSggdmFsdWUgKSB7XG4gIHZhciBudW0gPSBwYXJzZUZsb2F0KCB2YWx1ZSApO1xuICAvLyBub3QgYSBwZXJjZW50IGxpa2UgJzEwMCUnLCBhbmQgYSBudW1iZXJcbiAgdmFyIGlzVmFsaWQgPSB2YWx1ZS5pbmRleE9mKCclJykgPT0gLTEgJiYgIWlzTmFOKCBudW0gKTtcbiAgcmV0dXJuIGlzVmFsaWQgJiYgbnVtO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIGxvZ0Vycm9yID0gdHlwZW9mIGNvbnNvbGUgPT0gJ3VuZGVmaW5lZCcgPyBub29wIDpcbiAgZnVuY3Rpb24oIG1lc3NhZ2UgKSB7XG4gICAgY29uc29sZS5lcnJvciggbWVzc2FnZSApO1xuICB9O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtZWFzdXJlbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudmFyIG1lYXN1cmVtZW50cyA9IFtcbiAgJ3BhZGRpbmdMZWZ0JyxcbiAgJ3BhZGRpbmdSaWdodCcsXG4gICdwYWRkaW5nVG9wJyxcbiAgJ3BhZGRpbmdCb3R0b20nLFxuICAnbWFyZ2luTGVmdCcsXG4gICdtYXJnaW5SaWdodCcsXG4gICdtYXJnaW5Ub3AnLFxuICAnbWFyZ2luQm90dG9tJyxcbiAgJ2JvcmRlckxlZnRXaWR0aCcsXG4gICdib3JkZXJSaWdodFdpZHRoJyxcbiAgJ2JvcmRlclRvcFdpZHRoJyxcbiAgJ2JvcmRlckJvdHRvbVdpZHRoJ1xuXTtcblxudmFyIG1lYXN1cmVtZW50c0xlbmd0aCA9IG1lYXN1cmVtZW50cy5sZW5ndGg7XG5cbmZ1bmN0aW9uIGdldFplcm9TaXplKCkge1xuICB2YXIgc2l6ZSA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgaW5uZXJXaWR0aDogMCxcbiAgICBpbm5lckhlaWdodDogMCxcbiAgICBvdXRlcldpZHRoOiAwLFxuICAgIG91dGVySGVpZ2h0OiAwXG4gIH07XG4gIGZvciAoIHZhciBpPTA7IGkgPCBtZWFzdXJlbWVudHNMZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgc2l6ZVsgbWVhc3VyZW1lbnQgXSA9IDA7XG4gIH1cbiAgcmV0dXJuIHNpemU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGdldFN0eWxlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogZ2V0U3R5bGUsIGdldCBzdHlsZSBvZiBlbGVtZW50LCBjaGVjayBmb3IgRmlyZWZveCBidWdcbiAqIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTU0ODM5N1xuICovXG5mdW5jdGlvbiBnZXRTdHlsZSggZWxlbSApIHtcbiAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbSApO1xuICBpZiAoICFzdHlsZSApIHtcbiAgICBsb2dFcnJvciggJ1N0eWxlIHJldHVybmVkICcgKyBzdHlsZSArXG4gICAgICAnLiBBcmUgeW91IHJ1bm5pbmcgdGhpcyBjb2RlIGluIGEgaGlkZGVuIGlmcmFtZSBvbiBGaXJlZm94PyAnICtcbiAgICAgICdTZWUgaHR0cDovL2JpdC5seS9nZXRzaXplYnVnMScgKTtcbiAgfVxuICByZXR1cm4gc3R5bGU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHNldHVwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnZhciBpc1NldHVwID0gZmFsc2U7XG5cbnZhciBpc0JveFNpemVPdXRlcjtcblxuLyoqXG4gKiBzZXR1cFxuICogY2hlY2sgaXNCb3hTaXplck91dGVyXG4gKiBkbyBvbiBmaXJzdCBnZXRTaXplKCkgcmF0aGVyIHRoYW4gb24gcGFnZSBsb2FkIGZvciBGaXJlZm94IGJ1Z1xuICovXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgLy8gc2V0dXAgb25jZVxuICBpZiAoIGlzU2V0dXAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlzU2V0dXAgPSB0cnVlO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJveCBzaXppbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAvKipcbiAgICogV2ViS2l0IG1lYXN1cmVzIHRoZSBvdXRlci13aWR0aCBvbiBzdHlsZS53aWR0aCBvbiBib3JkZXItYm94IGVsZW1zXG4gICAqIElFICYgRmlyZWZveDwyOSBtZWFzdXJlcyB0aGUgaW5uZXItd2lkdGhcbiAgICovXG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LnN0eWxlLndpZHRoID0gJzIwMHB4JztcbiAgZGl2LnN0eWxlLnBhZGRpbmcgPSAnMXB4IDJweCAzcHggNHB4JztcbiAgZGl2LnN0eWxlLmJvcmRlclN0eWxlID0gJ3NvbGlkJztcbiAgZGl2LnN0eWxlLmJvcmRlcldpZHRoID0gJzFweCAycHggM3B4IDRweCc7XG4gIGRpdi5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgYm9keS5hcHBlbmRDaGlsZCggZGl2ICk7XG4gIHZhciBzdHlsZSA9IGdldFN0eWxlKCBkaXYgKTtcblxuICBnZXRTaXplLmlzQm94U2l6ZU91dGVyID0gaXNCb3hTaXplT3V0ZXIgPSBnZXRTdHlsZVNpemUoIHN0eWxlLndpZHRoICkgPT0gMjAwO1xuICBib2R5LnJlbW92ZUNoaWxkKCBkaXYgKTtcblxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBnZXRTaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdldFNpemUoIGVsZW0gKSB7XG4gIHNldHVwKCk7XG5cbiAgLy8gdXNlIHF1ZXJ5U2VsZXRvciBpZiBlbGVtIGlzIHN0cmluZ1xuICBpZiAoIHR5cGVvZiBlbGVtID09ICdzdHJpbmcnICkge1xuICAgIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBlbGVtICk7XG4gIH1cblxuICAvLyBkbyBub3QgcHJvY2VlZCBvbiBub24tb2JqZWN0c1xuICBpZiAoICFlbGVtIHx8IHR5cGVvZiBlbGVtICE9ICdvYmplY3QnIHx8ICFlbGVtLm5vZGVUeXBlICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBzdHlsZSA9IGdldFN0eWxlKCBlbGVtICk7XG5cbiAgLy8gaWYgaGlkZGVuLCBldmVyeXRoaW5nIGlzIDBcbiAgaWYgKCBzdHlsZS5kaXNwbGF5ID09ICdub25lJyApIHtcbiAgICByZXR1cm4gZ2V0WmVyb1NpemUoKTtcbiAgfVxuXG4gIHZhciBzaXplID0ge307XG4gIHNpemUud2lkdGggPSBlbGVtLm9mZnNldFdpZHRoO1xuICBzaXplLmhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0O1xuXG4gIHZhciBpc0JvcmRlckJveCA9IHNpemUuaXNCb3JkZXJCb3ggPSBzdHlsZS5ib3hTaXppbmcgPT0gJ2JvcmRlci1ib3gnO1xuXG4gIC8vIGdldCBhbGwgbWVhc3VyZW1lbnRzXG4gIGZvciAoIHZhciBpPTA7IGkgPCBtZWFzdXJlbWVudHNMZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgdmFyIHZhbHVlID0gc3R5bGVbIG1lYXN1cmVtZW50IF07XG4gICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XG4gICAgLy8gYW55ICdhdXRvJywgJ21lZGl1bScgdmFsdWUgd2lsbCBiZSAwXG4gICAgc2l6ZVsgbWVhc3VyZW1lbnQgXSA9ICFpc05hTiggbnVtICkgPyBudW0gOiAwO1xuICB9XG5cbiAgdmFyIHBhZGRpbmdXaWR0aCA9IHNpemUucGFkZGluZ0xlZnQgKyBzaXplLnBhZGRpbmdSaWdodDtcbiAgdmFyIHBhZGRpbmdIZWlnaHQgPSBzaXplLnBhZGRpbmdUb3AgKyBzaXplLnBhZGRpbmdCb3R0b207XG4gIHZhciBtYXJnaW5XaWR0aCA9IHNpemUubWFyZ2luTGVmdCArIHNpemUubWFyZ2luUmlnaHQ7XG4gIHZhciBtYXJnaW5IZWlnaHQgPSBzaXplLm1hcmdpblRvcCArIHNpemUubWFyZ2luQm90dG9tO1xuICB2YXIgYm9yZGVyV2lkdGggPSBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUuYm9yZGVyUmlnaHRXaWR0aDtcbiAgdmFyIGJvcmRlckhlaWdodCA9IHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuXG4gIHZhciBpc0JvcmRlckJveFNpemVPdXRlciA9IGlzQm9yZGVyQm94ICYmIGlzQm94U2l6ZU91dGVyO1xuXG4gIC8vIG92ZXJ3cml0ZSB3aWR0aCBhbmQgaGVpZ2h0IGlmIHdlIGNhbiBnZXQgaXQgZnJvbSBzdHlsZVxuICB2YXIgc3R5bGVXaWR0aCA9IGdldFN0eWxlU2l6ZSggc3R5bGUud2lkdGggKTtcbiAgaWYgKCBzdHlsZVdpZHRoICE9PSBmYWxzZSApIHtcbiAgICBzaXplLndpZHRoID0gc3R5bGVXaWR0aCArXG4gICAgICAvLyBhZGQgcGFkZGluZyBhbmQgYm9yZGVyIHVubGVzcyBpdCdzIGFscmVhZHkgaW5jbHVkaW5nIGl0XG4gICAgICAoIGlzQm9yZGVyQm94U2l6ZU91dGVyID8gMCA6IHBhZGRpbmdXaWR0aCArIGJvcmRlcldpZHRoICk7XG4gIH1cblxuICB2YXIgc3R5bGVIZWlnaHQgPSBnZXRTdHlsZVNpemUoIHN0eWxlLmhlaWdodCApO1xuICBpZiAoIHN0eWxlSGVpZ2h0ICE9PSBmYWxzZSApIHtcbiAgICBzaXplLmhlaWdodCA9IHN0eWxlSGVpZ2h0ICtcbiAgICAgIC8vIGFkZCBwYWRkaW5nIGFuZCBib3JkZXIgdW5sZXNzIGl0J3MgYWxyZWFkeSBpbmNsdWRpbmcgaXRcbiAgICAgICggaXNCb3JkZXJCb3hTaXplT3V0ZXIgPyAwIDogcGFkZGluZ0hlaWdodCArIGJvcmRlckhlaWdodCApO1xuICB9XG5cbiAgc2l6ZS5pbm5lcldpZHRoID0gc2l6ZS53aWR0aCAtICggcGFkZGluZ1dpZHRoICsgYm9yZGVyV2lkdGggKTtcbiAgc2l6ZS5pbm5lckhlaWdodCA9IHNpemUuaGVpZ2h0IC0gKCBwYWRkaW5nSGVpZ2h0ICsgYm9yZGVySGVpZ2h0ICk7XG5cbiAgc2l6ZS5vdXRlcldpZHRoID0gc2l6ZS53aWR0aCArIG1hcmdpbldpZHRoO1xuICBzaXplLm91dGVySGVpZ2h0ID0gc2l6ZS5oZWlnaHQgKyBtYXJnaW5IZWlnaHQ7XG5cbiAgcmV0dXJuIHNpemU7XG59XG5cbnJldHVybiBnZXRTaXplO1xuXG59KTtcbiIsImZ1bmN0aW9uIGhpZGVQbGFjZWhvbGRlck9uRm9jdXMoYSl7dGFyZ2V0PWEuY3VycmVudFRhcmdldD9hLmN1cnJlbnRUYXJnZXQ6YS5zcmNFbGVtZW50LHRhcmdldC52YWx1ZT09dGFyZ2V0LmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpJiYodGFyZ2V0LnZhbHVlPVwiXCIpfWZ1bmN0aW9uIHVuZm9jdXNPbkFuRWxlbWVudChhKXt0YXJnZXQ9YS5jdXJyZW50VGFyZ2V0P2EuY3VycmVudFRhcmdldDphLnNyY0VsZW1lbnQsXCJcIj09dGFyZ2V0LnZhbHVlJiYodGFyZ2V0LnZhbHVlPXRhcmdldC5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKSl9aWYoIShcInBsYWNlaG9sZGVyXCJpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpKWZvcih2YXIgaW5wdXRzPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIiksaT0wO2k8aW5wdXRzLmxlbmd0aDtpKyspaW5wdXRzW2ldLnZhbHVlfHwoaW5wdXRzW2ldLnZhbHVlPWlucHV0c1tpXS5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKSksaW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXI/KGlucHV0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixoaWRlUGxhY2Vob2xkZXJPbkZvY3VzLCExKSxpbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIix1bmZvY3VzT25BbkVsZW1lbnQsITEpKTppbnB1dHNbaV0uYXR0YWNoRXZlbnQmJihpbnB1dHNbaV0uYXR0YWNoRXZlbnQoXCJvbmNsaWNrXCIsaGlkZVBsYWNlaG9sZGVyT25Gb2N1cyksaW5wdXRzW2ldLmF0dGFjaEV2ZW50KFwib25ibHVyXCIsdW5mb2N1c09uQW5FbGVtZW50KSk7IiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIihmdW5jdGlvbiAocm9vdCkge1xuXG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuXG4gIGZ1bmN0aW9uIG5vb3AoKSB7fVxuICBcbiAgLy8gUG9seWZpbGwgZm9yIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG4gIGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gICAgdGhpcy5fc3RhdGUgPSAwO1xuICAgIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9kZWZlcnJlZHMgPSBbXTtcblxuICAgIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICAgIHNlbGYgPSBzZWxmLl92YWx1ZTtcbiAgICB9XG4gICAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYiA9IHNlbGYuX3N0YXRlID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAgIChzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHJldDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgICBpZiAobmV3VmFsdWUgJiYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICB2YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG4gICAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBmaW5hbGUoc2VsZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KHNlbGYsIGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICAgIHNlbGYuX3N0YXRlID0gMjtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGZpbmFsZShzZWxmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gICAgaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbihzZWxmLl92YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGhhbmRsZShzZWxmLCBzZWxmLl9kZWZlcnJlZHNbaV0pO1xuICAgIH1cbiAgICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xuICAgIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gICAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gICAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICAgKlxuICAgKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gICAqL1xuICBmdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbiAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBmbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlc29sdmUoc2VsZiwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVqZWN0KHNlbGYsIHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgICB9XG4gIH1cblxuICBQcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgfTtcblxuICBQcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgdmFyIHByb20gPSBuZXcgKHRoaXMuY29uc3RydWN0b3IpKG5vb3ApO1xuXG4gICAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG4gICAgcmV0dXJuIHByb207XG4gIH07XG5cbiAgUHJvbWlzZS5hbGwgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgICBmdW5jdGlvbiByZXMoaSwgdmFsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdGhlbi5jYWxsKHZhbCwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZ3NbaV0gPSB2YWw7XG4gICAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICByZWplY3QoZXgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXMoaSwgYXJnc1tpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IFByb21pc2UpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlamVjdCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhbHVlc1tpXS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG4gIFByb21pc2UuX2ltbWVkaWF0ZUZuID0gKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiYgZnVuY3Rpb24gKGZuKSB7IHNldEltbWVkaWF0ZShmbik7IH0pIHx8XG4gICAgZnVuY3Rpb24gKGZuKSB7XG4gICAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gICAgfTtcblxuICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF91bmhhbmRsZWRSZWplY3Rpb25GbihlcnIpIHtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2V0IHRoZSBpbW1lZGlhdGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBjYWxsYmFja3NcbiAgICogQHBhcmFtIGZuIHtmdW5jdGlvbn0gRnVuY3Rpb24gdG8gZXhlY3V0ZVxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgUHJvbWlzZS5fc2V0SW1tZWRpYXRlRm4gPSBmdW5jdGlvbiBfc2V0SW1tZWRpYXRlRm4oZm4pIHtcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbiA9IGZuO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gdW5oYW5kbGVkIHJlamVjdGlvblxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBleGVjdXRlIG9uIHVuaGFuZGxlZCByZWplY3Rpb25cbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIFByb21pc2UuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuKGZuKSB7XG4gICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmbjtcbiAgfTtcbiAgXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiAgfSBlbHNlIGlmICghcm9vdC5Qcm9taXNlKSB7XG4gICAgcm9vdC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgfVxuXG59KSh0aGlzKTtcbiIsIi8qISBzbW9vdGgtc2Nyb2xsIHYxMC4yLjEgfCAoYykgMjAxNiBDaHJpcyBGZXJkaW5hbmRpIHwgTUlUIExpY2Vuc2UgfCBodHRwOi8vZ2l0aHViLmNvbS9jZmVyZGluYW5kaS9zbW9vdGgtc2Nyb2xsICovXG4hKGZ1bmN0aW9uKGUsdCl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KGUpKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz10KGUpOmUuc21vb3RoU2Nyb2xsPXQoZSl9KShcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzLndpbmRvd3x8dGhpcy5nbG9iYWwsKGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0LG4sbyxyLGEsYyxsLGk9e30sdT1cInF1ZXJ5U2VsZWN0b3JcImluIGRvY3VtZW50JiZcImFkZEV2ZW50TGlzdGVuZXJcImluIGUscz17c2VsZWN0b3I6XCJbZGF0YS1zY3JvbGxdXCIsc2VsZWN0b3JIZWFkZXI6bnVsbCxzcGVlZDo1MDAsZWFzaW5nOlwiZWFzZUluT3V0Q3ViaWNcIixvZmZzZXQ6MCxjYWxsYmFjazpmdW5jdGlvbigpe319LGQ9ZnVuY3Rpb24oKXt2YXIgZT17fSx0PSExLG49MCxvPWFyZ3VtZW50cy5sZW5ndGg7XCJbb2JqZWN0IEJvb2xlYW5dXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnRzWzBdKSYmKHQ9YXJndW1lbnRzWzBdLG4rKyk7Zm9yKHZhciByPWZ1bmN0aW9uKG4pe2Zvcih2YXIgbyBpbiBuKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuLG8pJiYodCYmXCJbb2JqZWN0IE9iamVjdF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuW29dKT9lW29dPWQoITAsZVtvXSxuW29dKTplW29dPW5bb10pfTtuPG87bisrKXt2YXIgYT1hcmd1bWVudHNbbl07cihhKX1yZXR1cm4gZX0sZj1mdW5jdGlvbihlKXtyZXR1cm4gTWF0aC5tYXgoZS5zY3JvbGxIZWlnaHQsZS5vZmZzZXRIZWlnaHQsZS5jbGllbnRIZWlnaHQpfSxoPWZ1bmN0aW9uKGUsdCl7Zm9yKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXN8fChFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzPUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXNTZWxlY3Rvcnx8RWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yfHxFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3Rvcnx8RWxlbWVudC5wcm90b3R5cGUub01hdGNoZXNTZWxlY3Rvcnx8RWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yfHxmdW5jdGlvbihlKXtmb3IodmFyIHQ9KHRoaXMuZG9jdW1lbnR8fHRoaXMub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChlKSxuPXQubGVuZ3RoOy0tbj49MCYmdC5pdGVtKG4pIT09dGhpczspO3JldHVybiBuPi0xfSk7ZSYmZSE9PWRvY3VtZW50O2U9ZS5wYXJlbnROb2RlKWlmKGUubWF0Y2hlcyh0KSlyZXR1cm4gZTtyZXR1cm4gbnVsbH0sbT1mdW5jdGlvbihlKXtcIiNcIj09PWUuY2hhckF0KDApJiYoZT1lLnN1YnN0cigxKSk7Zm9yKHZhciB0LG49U3RyaW5nKGUpLG89bi5sZW5ndGgscj0tMSxhPVwiXCIsYz1uLmNoYXJDb2RlQXQoMCk7KytyPG87KXtpZih0PW4uY2hhckNvZGVBdChyKSwwPT09dCl0aHJvdyBuZXcgSW52YWxpZENoYXJhY3RlckVycm9yKFwiSW52YWxpZCBjaGFyYWN0ZXI6IHRoZSBpbnB1dCBjb250YWlucyBVKzAwMDAuXCIpO2ErPXQ+PTEmJnQ8PTMxfHwxMjc9PXR8fDA9PT1yJiZ0Pj00OCYmdDw9NTd8fDE9PT1yJiZ0Pj00OCYmdDw9NTcmJjQ1PT09Yz9cIlxcXFxcIit0LnRvU3RyaW5nKDE2KStcIiBcIjp0Pj0xMjh8fDQ1PT09dHx8OTU9PT10fHx0Pj00OCYmdDw9NTd8fHQ+PTY1JiZ0PD05MHx8dD49OTcmJnQ8PTEyMj9uLmNoYXJBdChyKTpcIlxcXFxcIituLmNoYXJBdChyKX1yZXR1cm5cIiNcIithfSxwPWZ1bmN0aW9uKGUsdCl7dmFyIG47cmV0dXJuXCJlYXNlSW5RdWFkXCI9PT1lJiYobj10KnQpLFwiZWFzZU91dFF1YWRcIj09PWUmJihuPXQqKDItdCkpLFwiZWFzZUluT3V0UXVhZFwiPT09ZSYmKG49dDwuNT8yKnQqdDotMSsoNC0yKnQpKnQpLFwiZWFzZUluQ3ViaWNcIj09PWUmJihuPXQqdCp0KSxcImVhc2VPdXRDdWJpY1wiPT09ZSYmKG49LS10KnQqdCsxKSxcImVhc2VJbk91dEN1YmljXCI9PT1lJiYobj10PC41PzQqdCp0KnQ6KHQtMSkqKDIqdC0yKSooMip0LTIpKzEpLFwiZWFzZUluUXVhcnRcIj09PWUmJihuPXQqdCp0KnQpLFwiZWFzZU91dFF1YXJ0XCI9PT1lJiYobj0xLSAtLXQqdCp0KnQpLFwiZWFzZUluT3V0UXVhcnRcIj09PWUmJihuPXQ8LjU/OCp0KnQqdCp0OjEtOCotLXQqdCp0KnQpLFwiZWFzZUluUXVpbnRcIj09PWUmJihuPXQqdCp0KnQqdCksXCJlYXNlT3V0UXVpbnRcIj09PWUmJihuPTErLS10KnQqdCp0KnQpLFwiZWFzZUluT3V0UXVpbnRcIj09PWUmJihuPXQ8LjU/MTYqdCp0KnQqdCp0OjErMTYqLS10KnQqdCp0KnQpLG58fHR9LGc9ZnVuY3Rpb24oZSx0LG4pe3ZhciBvPTA7aWYoZS5vZmZzZXRQYXJlbnQpZG8gbys9ZS5vZmZzZXRUb3AsZT1lLm9mZnNldFBhcmVudDt3aGlsZShlKTtyZXR1cm4gbz1NYXRoLm1heChvLXQtbiwwKSxNYXRoLm1pbihvLHYoKS1iKCkpfSxiPWZ1bmN0aW9uKCl7cmV0dXJuIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsZS5pbm5lckhlaWdodHx8MCl9LHY9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5tYXgoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCxkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0LGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0LGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpfSx5PWZ1bmN0aW9uKGUpe3JldHVybiBlJiZcIm9iamVjdFwiPT10eXBlb2YgSlNPTiYmXCJmdW5jdGlvblwiPT10eXBlb2YgSlNPTi5wYXJzZT9KU09OLnBhcnNlKGUpOnt9fSxPPWZ1bmN0aW9uKGUpe3JldHVybiBlP2YoZSkrZS5vZmZzZXRUb3A6MH0sUz1mdW5jdGlvbih0LG4sbyl7b3x8KHQuZm9jdXMoKSxkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlkIT09dC5pZCYmKHQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIixcIi0xXCIpLHQuZm9jdXMoKSx0LnN0eWxlLm91dGxpbmU9XCJub25lXCIpLGUuc2Nyb2xsVG8oMCxuKSl9O2kuYW5pbWF0ZVNjcm9sbD1mdW5jdGlvbihuLG8sYyl7dmFyIGk9eShvP28uZ2V0QXR0cmlidXRlKFwiZGF0YS1vcHRpb25zXCIpOm51bGwpLHU9ZCh0fHxzLGN8fHt9LGkpLGY9XCJbb2JqZWN0IE51bWJlcl1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuKSxoPWZ8fCFuLnRhZ05hbWU/bnVsbDpuO2lmKGZ8fGgpe3ZhciBtPWUucGFnZVlPZmZzZXQ7dS5zZWxlY3RvckhlYWRlciYmIXImJihyPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodS5zZWxlY3RvckhlYWRlcikpLGF8fChhPU8ocikpO3ZhciBiLEUsST1mP246ZyhoLGEscGFyc2VJbnQodS5vZmZzZXQsMTApKSxIPUktbSxBPXYoKSxqPTAsQz1mdW5jdGlvbih0LHIsYSl7dmFyIGM9ZS5wYWdlWU9mZnNldDsodD09cnx8Yz09cnx8ZS5pbm5lckhlaWdodCtjPj1BKSYmKGNsZWFySW50ZXJ2YWwoYSksUyhuLHIsZiksdS5jYWxsYmFjayhuLG8pKX0sTT1mdW5jdGlvbigpe2orPTE2LGI9ai9wYXJzZUludCh1LnNwZWVkLDEwKSxiPWI+MT8xOmIsRT1tK0gqcCh1LmVhc2luZyxiKSxlLnNjcm9sbFRvKDAsTWF0aC5mbG9vcihFKSksQyhFLEksbCl9LHc9ZnVuY3Rpb24oKXtjbGVhckludGVydmFsKGwpLGw9c2V0SW50ZXJ2YWwoTSwxNil9OzA9PT1lLnBhZ2VZT2Zmc2V0JiZlLnNjcm9sbFRvKDAsMCksdygpfX07dmFyIEU9ZnVuY3Rpb24odCl7dmFyIHI7dHJ5e3I9bShkZWNvZGVVUklDb21wb25lbnQoZS5sb2NhdGlvbi5oYXNoKSl9Y2F0Y2godCl7cj1tKGUubG9jYXRpb24uaGFzaCl9biYmKG4uaWQ9bi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNjcm9sbC1pZFwiKSxpLmFuaW1hdGVTY3JvbGwobixvKSxuPW51bGwsbz1udWxsKX0sST1mdW5jdGlvbihyKXtpZigwPT09ci5idXR0b24mJiFyLm1ldGFLZXkmJiFyLmN0cmxLZXkmJihvPWgoci50YXJnZXQsdC5zZWxlY3RvciksbyYmXCJhXCI9PT1vLnRhZ05hbWUudG9Mb3dlckNhc2UoKSYmby5ob3N0bmFtZT09PWUubG9jYXRpb24uaG9zdG5hbWUmJm8ucGF0aG5hbWU9PT1lLmxvY2F0aW9uLnBhdGhuYW1lJiYvIy8udGVzdChvLmhyZWYpKSl7dmFyIGE7dHJ5e2E9bShkZWNvZGVVUklDb21wb25lbnQoby5oYXNoKSl9Y2F0Y2goZSl7YT1tKG8uaGFzaCl9aWYoXCIjXCI9PT1hKXtyLnByZXZlbnREZWZhdWx0KCksbj1kb2N1bWVudC5ib2R5O3ZhciBjPW4uaWQ/bi5pZDpcInNtb290aC1zY3JvbGwtdG9wXCI7cmV0dXJuIG4uc2V0QXR0cmlidXRlKFwiZGF0YS1zY3JvbGwtaWRcIixjKSxuLmlkPVwiXCIsdm9pZChlLmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpPT09Yz9FKCk6ZS5sb2NhdGlvbi5oYXNoPWMpfW49ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhKSxuJiYobi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNjcm9sbC1pZFwiLG4uaWQpLG4uaWQ9XCJcIixvLmhhc2g9PT1lLmxvY2F0aW9uLmhhc2gmJihyLnByZXZlbnREZWZhdWx0KCksRSgpKSl9fSxIPWZ1bmN0aW9uKGUpe2N8fChjPXNldFRpbWVvdXQoKGZ1bmN0aW9uKCl7Yz1udWxsLGE9TyhyKX0pLDY2KSl9O3JldHVybiBpLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0JiYoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsSSwhMSksZS5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsSCwhMSksdD1udWxsLG49bnVsbCxvPW51bGwscj1udWxsLGE9bnVsbCxjPW51bGwsbD1udWxsKX0saS5pbml0PWZ1bmN0aW9uKG4pe3UmJihpLmRlc3Ryb3koKSx0PWQocyxufHx7fSkscj10LnNlbGVjdG9ySGVhZGVyP2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodC5zZWxlY3RvckhlYWRlcik6bnVsbCxhPU8ociksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsSSwhMSksZS5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLEUsITEpLHImJmUuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLEgsITEpKX0saX0pKTsiLCIvKiFcbiAqIFRhcCBsaXN0ZW5lciB2Mi4wLjBcbiAqIGxpc3RlbnMgdG8gdGFwc1xuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCB1bnVzZWQ6IHRydWUsIHVuZGVmOiB0cnVlLCBzdHJpY3Q6IHRydWUgKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLypqc2hpbnQgc3RyaWN0OiBmYWxzZSovIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xuXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAndW5pcG9pbnRlci91bmlwb2ludGVyJ1xuICAgIF0sIGZ1bmN0aW9uKCBVbmlwb2ludGVyICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgVW5pcG9pbnRlciApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgndW5pcG9pbnRlcicpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5UYXBMaXN0ZW5lciA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuVW5pcG9pbnRlclxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIFVuaXBvaW50ZXIgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIFRhcExpc3RlbmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIFRhcExpc3RlbmVyKCBlbGVtICkge1xuICB0aGlzLmJpbmRUYXAoIGVsZW0gKTtcbn1cblxuLy8gaW5oZXJpdCBVbmlwb2ludGVyICYgRXZlbnRFbWl0dGVyXG52YXIgcHJvdG8gPSBUYXBMaXN0ZW5lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBVbmlwb2ludGVyLnByb3RvdHlwZSApO1xuXG4vKipcbiAqIGJpbmQgdGFwIGV2ZW50IHRvIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICovXG5wcm90by5iaW5kVGFwID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIGlmICggIWVsZW0gKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMudW5iaW5kVGFwKCk7XG4gIHRoaXMudGFwRWxlbWVudCA9IGVsZW07XG4gIHRoaXMuX2JpbmRTdGFydEV2ZW50KCBlbGVtLCB0cnVlICk7XG59O1xuXG5wcm90by51bmJpbmRUYXAgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy50YXBFbGVtZW50ICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLl9iaW5kU3RhcnRFdmVudCggdGhpcy50YXBFbGVtZW50LCB0cnVlICk7XG4gIGRlbGV0ZSB0aGlzLnRhcEVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIHBvaW50ZXIgdXBcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50IG9yIFRvdWNofSBwb2ludGVyXG4gKi9cbnByb3RvLnBvaW50ZXJVcCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgLy8gaWdub3JlIGVtdWxhdGVkIG1vdXNlIHVwIGNsaWNrc1xuICBpZiAoIHRoaXMuaXNJZ25vcmluZ01vdXNlVXAgJiYgZXZlbnQudHlwZSA9PSAnbW91c2V1cCcgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBvaW50ZXJQb2ludCA9IFVuaXBvaW50ZXIuZ2V0UG9pbnRlclBvaW50KCBwb2ludGVyICk7XG4gIHZhciBib3VuZGluZ1JlY3QgPSB0aGlzLnRhcEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY3JvbGxYID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICB2YXIgc2Nyb2xsWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgLy8gY2FsY3VsYXRlIGlmIHBvaW50ZXIgaXMgaW5zaWRlIHRhcEVsZW1lbnRcbiAgdmFyIGlzSW5zaWRlID0gcG9pbnRlclBvaW50LnggPj0gYm91bmRpbmdSZWN0LmxlZnQgKyBzY3JvbGxYICYmXG4gICAgcG9pbnRlclBvaW50LnggPD0gYm91bmRpbmdSZWN0LnJpZ2h0ICsgc2Nyb2xsWCAmJlxuICAgIHBvaW50ZXJQb2ludC55ID49IGJvdW5kaW5nUmVjdC50b3AgKyBzY3JvbGxZICYmXG4gICAgcG9pbnRlclBvaW50LnkgPD0gYm91bmRpbmdSZWN0LmJvdHRvbSArIHNjcm9sbFk7XG4gIC8vIHRyaWdnZXIgY2FsbGJhY2sgaWYgcG9pbnRlciBpcyBpbnNpZGUgZWxlbWVudFxuICBpZiAoIGlzSW5zaWRlICkge1xuICAgIHRoaXMuZW1pdEV2ZW50KCAndGFwJywgWyBldmVudCwgcG9pbnRlciBdICk7XG4gIH1cblxuICAvLyBzZXQgZmxhZyBmb3IgZW11bGF0ZWQgY2xpY2tzIDMwMG1zIGFmdGVyIHRvdWNoZW5kXG4gIGlmICggZXZlbnQudHlwZSAhPSAnbW91c2V1cCcgKSB7XG4gICAgdGhpcy5pc0lnbm9yaW5nTW91c2VVcCA9IHRydWU7XG4gICAgLy8gcmVzZXQgZmxhZyBhZnRlciAzMDBtc1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICBkZWxldGUgX3RoaXMuaXNJZ25vcmluZ01vdXNlVXA7XG4gICAgfSwgNDAwICk7XG4gIH1cbn07XG5cbnByb3RvLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wb2ludGVyRG9uZSgpO1xuICB0aGlzLnVuYmluZFRhcCgpO1xufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbnJldHVybiBUYXBMaXN0ZW5lcjtcblxufSkpO1xuIiwiLyohXG4gKiBVbmlkcmFnZ2VyIHYyLjEuMFxuICogRHJhZ2dhYmxlIGJhc2UgY2xhc3NcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgdW51c2VkOiB0cnVlLCB1bmRlZjogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qanNoaW50IHN0cmljdDogZmFsc2UgKi8gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXG5cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICd1bmlwb2ludGVyL3VuaXBvaW50ZXInXG4gICAgXSwgZnVuY3Rpb24oIFVuaXBvaW50ZXIgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBVbmlwb2ludGVyICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCd1bmlwb2ludGVyJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93LlVuaWRyYWdnZXIgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LlVuaXBvaW50ZXJcbiAgICApO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBVbmlwb2ludGVyICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVW5pZHJhZ2dlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBVbmlkcmFnZ2VyKCkge31cblxuLy8gaW5oZXJpdCBVbmlwb2ludGVyICYgRXZFbWl0dGVyXG52YXIgcHJvdG8gPSBVbmlkcmFnZ2VyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFVuaXBvaW50ZXIucHJvdG90eXBlICk7XG5cbi8vIC0tLS0tIGJpbmQgc3RhcnQgLS0tLS0gLy9cblxucHJvdG8uYmluZEhhbmRsZXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fYmluZEhhbmRsZXMoIHRydWUgKTtcbn07XG5cbnByb3RvLnVuYmluZEhhbmRsZXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fYmluZEhhbmRsZXMoIGZhbHNlICk7XG59O1xuXG52YXIgbmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbi8qKlxuICogd29ya3MgYXMgdW5iaW5kZXIsIGFzIHlvdSBjYW4gLmJpbmRIYW5kbGVzKCBmYWxzZSApIHRvIHVuYmluZFxuICogQHBhcmFtIHtCb29sZWFufSBpc0JpbmQgLSB3aWxsIHVuYmluZCBpZiBmYWxzZXlcbiAqL1xucHJvdG8uX2JpbmRIYW5kbGVzID0gZnVuY3Rpb24oIGlzQmluZCApIHtcbiAgLy8gbXVuZ2UgaXNCaW5kLCBkZWZhdWx0IHRvIHRydWVcbiAgaXNCaW5kID0gaXNCaW5kID09PSB1bmRlZmluZWQgPyB0cnVlIDogISFpc0JpbmQ7XG4gIC8vIGV4dHJhIGJpbmQgbG9naWNcbiAgdmFyIGJpbmRlckV4dHJhO1xuICBpZiAoIG5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCApIHtcbiAgICBiaW5kZXJFeHRyYSA9IGZ1bmN0aW9uKCBoYW5kbGUgKSB7XG4gICAgICAvLyBkaXNhYmxlIHNjcm9sbGluZyBvbiB0aGUgZWxlbWVudFxuICAgICAgaGFuZGxlLnN0eWxlLnRvdWNoQWN0aW9uID0gaXNCaW5kID8gJ25vbmUnIDogJyc7XG4gICAgfTtcbiAgfSBlbHNlIGlmICggbmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgKSB7XG4gICAgYmluZGVyRXh0cmEgPSBmdW5jdGlvbiggaGFuZGxlICkge1xuICAgICAgLy8gZGlzYWJsZSBzY3JvbGxpbmcgb24gdGhlIGVsZW1lbnRcbiAgICAgIGhhbmRsZS5zdHlsZS5tc1RvdWNoQWN0aW9uID0gaXNCaW5kID8gJ25vbmUnIDogJyc7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBiaW5kZXJFeHRyYSA9IG5vb3A7XG4gIH1cbiAgLy8gYmluZCBlYWNoIGhhbmRsZVxuICB2YXIgYmluZE1ldGhvZCA9IGlzQmluZCA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbiAgZm9yICggdmFyIGk9MDsgaSA8IHRoaXMuaGFuZGxlcy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgaGFuZGxlID0gdGhpcy5oYW5kbGVzW2ldO1xuICAgIHRoaXMuX2JpbmRTdGFydEV2ZW50KCBoYW5kbGUsIGlzQmluZCApO1xuICAgIGJpbmRlckV4dHJhKCBoYW5kbGUgKTtcbiAgICBoYW5kbGVbIGJpbmRNZXRob2QgXSggJ2NsaWNrJywgdGhpcyApO1xuICB9XG59O1xuXG4vLyAtLS0tLSBzdGFydCBldmVudCAtLS0tLSAvL1xuXG4vKipcbiAqIHBvaW50ZXIgc3RhcnRcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50IG9yIFRvdWNofSBwb2ludGVyXG4gKi9cbnByb3RvLnBvaW50ZXJEb3duID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICAvLyBkaXNtaXNzIHJhbmdlIHNsaWRlcnNcbiAgaWYgKCBldmVudC50YXJnZXQubm9kZU5hbWUgPT0gJ0lOUFVUJyAmJiBldmVudC50YXJnZXQudHlwZSA9PSAncmFuZ2UnICkge1xuICAgIC8vIHJlc2V0IHBvaW50ZXJEb3duIGxvZ2ljXG4gICAgdGhpcy5pc1BvaW50ZXJEb3duID0gZmFsc2U7XG4gICAgZGVsZXRlIHRoaXMucG9pbnRlcklkZW50aWZpZXI7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fZHJhZ1BvaW50ZXJEb3duKCBldmVudCwgcG9pbnRlciApO1xuICAvLyBrbHVkZ2UgdG8gYmx1ciBmb2N1c2VkIGlucHV0cyBpbiBkcmFnZ2VyXG4gIHZhciBmb2N1c2VkID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgaWYgKCBmb2N1c2VkICYmIGZvY3VzZWQuYmx1ciApIHtcbiAgICBmb2N1c2VkLmJsdXIoKTtcbiAgfVxuICAvLyBiaW5kIG1vdmUgYW5kIGVuZCBldmVudHNcbiAgdGhpcy5fYmluZFBvc3RTdGFydEV2ZW50cyggZXZlbnQgKTtcbiAgdGhpcy5lbWl0RXZlbnQoICdwb2ludGVyRG93bicsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xufTtcblxuLy8gYmFzZSBwb2ludGVyIGRvd24gbG9naWNcbnByb3RvLl9kcmFnUG9pbnRlckRvd24gPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIC8vIHRyYWNrIHRvIHNlZSB3aGVuIGRyYWdnaW5nIHN0YXJ0c1xuICB0aGlzLnBvaW50ZXJEb3duUG9pbnQgPSBVbmlwb2ludGVyLmdldFBvaW50ZXJQb2ludCggcG9pbnRlciApO1xuXG4gIHZhciBjYW5QcmV2ZW50RGVmYXVsdCA9IHRoaXMuY2FuUHJldmVudERlZmF1bHRPblBvaW50ZXJEb3duKCBldmVudCwgcG9pbnRlciApO1xuICBpZiAoIGNhblByZXZlbnREZWZhdWx0ICkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn07XG5cbi8vIG92ZXJ3cml0ZWFibGUgbWV0aG9kIHNvIEZsaWNraXR5IGNhbiBwcmV2ZW50IGZvciBzY3JvbGxpbmdcbnByb3RvLmNhblByZXZlbnREZWZhdWx0T25Qb2ludGVyRG93biA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgLy8gcHJldmVudCBkZWZhdWx0LCB1bmxlc3MgdG91Y2hzdGFydCBvciA8c2VsZWN0PlxuICByZXR1cm4gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lICE9ICdTRUxFQ1QnO1xufTtcblxuLy8gLS0tLS0gbW92ZSBldmVudCAtLS0tLSAvL1xuXG4vKipcbiAqIGRyYWcgbW92ZVxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnQgb3IgVG91Y2h9IHBvaW50ZXJcbiAqL1xucHJvdG8ucG9pbnRlck1vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHZhciBtb3ZlVmVjdG9yID0gdGhpcy5fZHJhZ1BvaW50ZXJNb3ZlKCBldmVudCwgcG9pbnRlciApO1xuICB0aGlzLmVtaXRFdmVudCggJ3BvaW50ZXJNb3ZlJywgWyBldmVudCwgcG9pbnRlciwgbW92ZVZlY3RvciBdICk7XG4gIHRoaXMuX2RyYWdNb3ZlKCBldmVudCwgcG9pbnRlciwgbW92ZVZlY3RvciApO1xufTtcblxuLy8gYmFzZSBwb2ludGVyIG1vdmUgbG9naWNcbnByb3RvLl9kcmFnUG9pbnRlck1vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHZhciBtb3ZlUG9pbnQgPSBVbmlwb2ludGVyLmdldFBvaW50ZXJQb2ludCggcG9pbnRlciApO1xuICB2YXIgbW92ZVZlY3RvciA9IHtcbiAgICB4OiBtb3ZlUG9pbnQueCAtIHRoaXMucG9pbnRlckRvd25Qb2ludC54LFxuICAgIHk6IG1vdmVQb2ludC55IC0gdGhpcy5wb2ludGVyRG93blBvaW50LnlcbiAgfTtcbiAgLy8gc3RhcnQgZHJhZyBpZiBwb2ludGVyIGhhcyBtb3ZlZCBmYXIgZW5vdWdoIHRvIHN0YXJ0IGRyYWdcbiAgaWYgKCAhdGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuaGFzRHJhZ1N0YXJ0ZWQoIG1vdmVWZWN0b3IgKSApIHtcbiAgICB0aGlzLl9kcmFnU3RhcnQoIGV2ZW50LCBwb2ludGVyICk7XG4gIH1cbiAgcmV0dXJuIG1vdmVWZWN0b3I7XG59O1xuXG4vLyBjb25kaXRpb24gaWYgcG9pbnRlciBoYXMgbW92ZWQgZmFyIGVub3VnaCB0byBzdGFydCBkcmFnXG5wcm90by5oYXNEcmFnU3RhcnRlZCA9IGZ1bmN0aW9uKCBtb3ZlVmVjdG9yICkge1xuICByZXR1cm4gTWF0aC5hYnMoIG1vdmVWZWN0b3IueCApID4gMyB8fCBNYXRoLmFicyggbW92ZVZlY3Rvci55ICkgPiAzO1xufTtcblxuXG4vLyAtLS0tLSBlbmQgZXZlbnQgLS0tLS0gLy9cblxuLyoqXG4gKiBwb2ludGVyIHVwXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHBhcmFtIHtFdmVudCBvciBUb3VjaH0gcG9pbnRlclxuICovXG5wcm90by5wb2ludGVyVXAgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuZW1pdEV2ZW50KCAncG9pbnRlclVwJywgWyBldmVudCwgcG9pbnRlciBdICk7XG4gIHRoaXMuX2RyYWdQb2ludGVyVXAoIGV2ZW50LCBwb2ludGVyICk7XG59O1xuXG5wcm90by5fZHJhZ1BvaW50ZXJVcCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgaWYgKCB0aGlzLmlzRHJhZ2dpbmcgKSB7XG4gICAgdGhpcy5fZHJhZ0VuZCggZXZlbnQsIHBvaW50ZXIgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBwb2ludGVyIGRpZG4ndCBtb3ZlIGVub3VnaCBmb3IgZHJhZyB0byBzdGFydFxuICAgIHRoaXMuX3N0YXRpY0NsaWNrKCBldmVudCwgcG9pbnRlciApO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkcmFnIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGRyYWdTdGFydFxucHJvdG8uX2RyYWdTdGFydCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgdGhpcy5kcmFnU3RhcnRQb2ludCA9IFVuaXBvaW50ZXIuZ2V0UG9pbnRlclBvaW50KCBwb2ludGVyICk7XG4gIC8vIHByZXZlbnQgY2xpY2tzXG4gIHRoaXMuaXNQcmV2ZW50aW5nQ2xpY2tzID0gdHJ1ZTtcblxuICB0aGlzLmRyYWdTdGFydCggZXZlbnQsIHBvaW50ZXIgKTtcbn07XG5cbnByb3RvLmRyYWdTdGFydCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5lbWl0RXZlbnQoICdkcmFnU3RhcnQnLCBbIGV2ZW50LCBwb2ludGVyIF0gKTtcbn07XG5cbi8vIGRyYWdNb3ZlXG5wcm90by5fZHJhZ01vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgKSB7XG4gIC8vIGRvIG5vdCBkcmFnIGlmIG5vdCBkcmFnZ2luZyB5ZXRcbiAgaWYgKCAhdGhpcy5pc0RyYWdnaW5nICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuZHJhZ01vdmUoIGV2ZW50LCBwb2ludGVyLCBtb3ZlVmVjdG9yICk7XG59O1xuXG5wcm90by5kcmFnTW92ZSA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciwgbW92ZVZlY3RvciApIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgdGhpcy5lbWl0RXZlbnQoICdkcmFnTW92ZScsIFsgZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgXSApO1xufTtcblxuLy8gZHJhZ0VuZFxucHJvdG8uX2RyYWdFbmQgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIC8vIHNldCBmbGFnc1xuICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgLy8gcmUtZW5hYmxlIGNsaWNraW5nIGFzeW5jXG4gIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSB0aGlzLmlzUHJldmVudGluZ0NsaWNrcztcbiAgfS5iaW5kKCB0aGlzICkgKTtcblxuICB0aGlzLmRyYWdFbmQoIGV2ZW50LCBwb2ludGVyICk7XG59O1xuXG5wcm90by5kcmFnRW5kID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLmVtaXRFdmVudCggJ2RyYWdFbmQnLCBbIGV2ZW50LCBwb2ludGVyIF0gKTtcbn07XG5cbi8vIC0tLS0tIG9uY2xpY2sgLS0tLS0gLy9cblxuLy8gaGFuZGxlIGFsbCBjbGlja3MgYW5kIHByZXZlbnQgY2xpY2tzIHdoZW4gZHJhZ2dpbmdcbnByb3RvLm9uY2xpY2sgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIGlmICggdGhpcy5pc1ByZXZlbnRpbmdDbGlja3MgKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gc3RhdGljQ2xpY2sgLS0tLS0gLy9cblxuLy8gdHJpZ2dlcmVkIGFmdGVyIHBvaW50ZXIgZG93biAmIHVwIHdpdGggbm8vdGlueSBtb3ZlbWVudFxucHJvdG8uX3N0YXRpY0NsaWNrID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICAvLyBpZ25vcmUgZW11bGF0ZWQgbW91c2UgdXAgY2xpY2tzXG4gIGlmICggdGhpcy5pc0lnbm9yaW5nTW91c2VVcCAmJiBldmVudC50eXBlID09ICdtb3VzZXVwJyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBhbGxvdyBjbGljayBpbiA8aW5wdXQ+cyBhbmQgPHRleHRhcmVhPnNcbiAgdmFyIG5vZGVOYW1lID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lO1xuICBpZiAoIG5vZGVOYW1lID09ICdJTlBVVCcgfHwgbm9kZU5hbWUgPT0gJ1RFWFRBUkVBJyApIHtcbiAgICBldmVudC50YXJnZXQuZm9jdXMoKTtcbiAgfVxuICB0aGlzLnN0YXRpY0NsaWNrKCBldmVudCwgcG9pbnRlciApO1xuXG4gIC8vIHNldCBmbGFnIGZvciBlbXVsYXRlZCBjbGlja3MgMzAwbXMgYWZ0ZXIgdG91Y2hlbmRcbiAgaWYgKCBldmVudC50eXBlICE9ICdtb3VzZXVwJyApIHtcbiAgICB0aGlzLmlzSWdub3JpbmdNb3VzZVVwID0gdHJ1ZTtcbiAgICAvLyByZXNldCBmbGFnIGFmdGVyIDMwMG1zXG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICBkZWxldGUgdGhpcy5pc0lnbm9yaW5nTW91c2VVcDtcbiAgICB9LmJpbmQoIHRoaXMgKSwgNDAwICk7XG4gIH1cbn07XG5cbnByb3RvLnN0YXRpY0NsaWNrID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLmVtaXRFdmVudCggJ3N0YXRpY0NsaWNrJywgWyBldmVudCwgcG9pbnRlciBdICk7XG59O1xuXG4vLyAtLS0tLSB1dGlscyAtLS0tLSAvL1xuXG5VbmlkcmFnZ2VyLmdldFBvaW50ZXJQb2ludCA9IFVuaXBvaW50ZXIuZ2V0UG9pbnRlclBvaW50O1xuXG4vLyAtLS0tLSAgLS0tLS0gLy9cblxucmV0dXJuIFVuaWRyYWdnZXI7XG5cbn0pKTtcbiIsIi8qIVxuICogVW5pcG9pbnRlciB2Mi4xLjBcbiAqIGJhc2UgY2xhc3MgZm9yIGRvaW5nIG9uZSB0aGluZyB3aXRoIHBvaW50ZXIgZXZlbnRcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qZ2xvYmFsIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZXYtZW1pdHRlci9ldi1lbWl0dGVyJ1xuICAgIF0sIGZ1bmN0aW9uKCBFdkVtaXR0ZXIgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBFdkVtaXR0ZXIgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ2V2LWVtaXR0ZXInKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuVW5pcG9pbnRlciA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuRXZFbWl0dGVyXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRXZFbWl0dGVyICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBVbmlwb2ludGVyKCkge31cblxuLy8gaW5oZXJpdCBFdkVtaXR0ZXJcbnZhciBwcm90byA9IFVuaXBvaW50ZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggRXZFbWl0dGVyLnByb3RvdHlwZSApO1xuXG5wcm90by5iaW5kU3RhcnRFdmVudCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICB0aGlzLl9iaW5kU3RhcnRFdmVudCggZWxlbSwgdHJ1ZSApO1xufTtcblxucHJvdG8udW5iaW5kU3RhcnRFdmVudCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICB0aGlzLl9iaW5kU3RhcnRFdmVudCggZWxlbSwgZmFsc2UgKTtcbn07XG5cbi8qKlxuICogd29ya3MgYXMgdW5iaW5kZXIsIGFzIHlvdSBjYW4gLl9iaW5kU3RhcnQoIGZhbHNlICkgdG8gdW5iaW5kXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzQmluZCAtIHdpbGwgdW5iaW5kIGlmIGZhbHNleVxuICovXG5wcm90by5fYmluZFN0YXJ0RXZlbnQgPSBmdW5jdGlvbiggZWxlbSwgaXNCaW5kICkge1xuICAvLyBtdW5nZSBpc0JpbmQsIGRlZmF1bHQgdG8gdHJ1ZVxuICBpc0JpbmQgPSBpc0JpbmQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIWlzQmluZDtcbiAgdmFyIGJpbmRNZXRob2QgPSBpc0JpbmQgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG5cbiAgaWYgKCB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICkge1xuICAgIC8vIFczQyBQb2ludGVyIEV2ZW50cywgSUUxMS4gU2VlIGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wL21mcmVjYVxuICAgIGVsZW1bIGJpbmRNZXRob2QgXSggJ3BvaW50ZXJkb3duJywgdGhpcyApO1xuICB9IGVsc2UgaWYgKCB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgKSB7XG4gICAgLy8gSUUxMCBQb2ludGVyIEV2ZW50c1xuICAgIGVsZW1bIGJpbmRNZXRob2QgXSggJ01TUG9pbnRlckRvd24nLCB0aGlzICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbGlzdGVuIGZvciBib3RoLCBmb3IgZGV2aWNlcyBsaWtlIENocm9tZSBQaXhlbFxuICAgIGVsZW1bIGJpbmRNZXRob2QgXSggJ21vdXNlZG93bicsIHRoaXMgKTtcbiAgICBlbGVtWyBiaW5kTWV0aG9kIF0oICd0b3VjaHN0YXJ0JywgdGhpcyApO1xuICB9XG59O1xuXG4vLyB0cmlnZ2VyIGhhbmRsZXIgbWV0aG9kcyBmb3IgZXZlbnRzXG5wcm90by5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdmFyIG1ldGhvZCA9ICdvbicgKyBldmVudC50eXBlO1xuICBpZiAoIHRoaXNbIG1ldGhvZCBdICkge1xuICAgIHRoaXNbIG1ldGhvZCBdKCBldmVudCApO1xuICB9XG59O1xuXG4vLyByZXR1cm5zIHRoZSB0b3VjaCB0aGF0IHdlJ3JlIGtlZXBpbmcgdHJhY2sgb2ZcbnByb3RvLmdldFRvdWNoID0gZnVuY3Rpb24oIHRvdWNoZXMgKSB7XG4gIGZvciAoIHZhciBpPTA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciB0b3VjaCA9IHRvdWNoZXNbaV07XG4gICAgaWYgKCB0b3VjaC5pZGVudGlmaWVyID09IHRoaXMucG9pbnRlcklkZW50aWZpZXIgKSB7XG4gICAgICByZXR1cm4gdG91Y2g7XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLSBzdGFydCBldmVudCAtLS0tLSAvL1xuXG5wcm90by5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgLy8gZGlzbWlzcyBjbGlja3MgZnJvbSByaWdodCBvciBtaWRkbGUgYnV0dG9uc1xuICB2YXIgYnV0dG9uID0gZXZlbnQuYnV0dG9uO1xuICBpZiAoIGJ1dHRvbiAmJiAoIGJ1dHRvbiAhPT0gMCAmJiBidXR0b24gIT09IDEgKSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5fcG9pbnRlckRvd24oIGV2ZW50LCBldmVudCApO1xufTtcblxucHJvdG8ub250b3VjaHN0YXJ0ID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB0aGlzLl9wb2ludGVyRG93biggZXZlbnQsIGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdICk7XG59O1xuXG5wcm90by5vbk1TUG9pbnRlckRvd24gPVxucHJvdG8ub25wb2ludGVyZG93biA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5fcG9pbnRlckRvd24oIGV2ZW50LCBldmVudCApO1xufTtcblxuLyoqXG4gKiBwb2ludGVyIHN0YXJ0XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHBhcmFtIHtFdmVudCBvciBUb3VjaH0gcG9pbnRlclxuICovXG5wcm90by5fcG9pbnRlckRvd24gPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIC8vIGRpc21pc3Mgb3RoZXIgcG9pbnRlcnNcbiAgaWYgKCB0aGlzLmlzUG9pbnRlckRvd24gKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5pc1BvaW50ZXJEb3duID0gdHJ1ZTtcbiAgLy8gc2F2ZSBwb2ludGVyIGlkZW50aWZpZXIgdG8gbWF0Y2ggdXAgdG91Y2ggZXZlbnRzXG4gIHRoaXMucG9pbnRlcklkZW50aWZpZXIgPSBwb2ludGVyLnBvaW50ZXJJZCAhPT0gdW5kZWZpbmVkID9cbiAgICAvLyBwb2ludGVySWQgZm9yIHBvaW50ZXIgZXZlbnRzLCB0b3VjaC5pbmRlbnRpZmllciBmb3IgdG91Y2ggZXZlbnRzXG4gICAgcG9pbnRlci5wb2ludGVySWQgOiBwb2ludGVyLmlkZW50aWZpZXI7XG5cbiAgdGhpcy5wb2ludGVyRG93biggZXZlbnQsIHBvaW50ZXIgKTtcbn07XG5cbnByb3RvLnBvaW50ZXJEb3duID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLl9iaW5kUG9zdFN0YXJ0RXZlbnRzKCBldmVudCApO1xuICB0aGlzLmVtaXRFdmVudCggJ3BvaW50ZXJEb3duJywgWyBldmVudCwgcG9pbnRlciBdICk7XG59O1xuXG4vLyBoYXNoIG9mIGV2ZW50cyB0byBiZSBib3VuZCBhZnRlciBzdGFydCBldmVudFxudmFyIHBvc3RTdGFydEV2ZW50cyA9IHtcbiAgbW91c2Vkb3duOiBbICdtb3VzZW1vdmUnLCAnbW91c2V1cCcgXSxcbiAgdG91Y2hzdGFydDogWyAndG91Y2htb3ZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJyBdLFxuICBwb2ludGVyZG93bjogWyAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJjYW5jZWwnIF0sXG4gIE1TUG9pbnRlckRvd246IFsgJ01TUG9pbnRlck1vdmUnLCAnTVNQb2ludGVyVXAnLCAnTVNQb2ludGVyQ2FuY2VsJyBdXG59O1xuXG5wcm90by5fYmluZFBvc3RTdGFydEV2ZW50cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgaWYgKCAhZXZlbnQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGdldCBwcm9wZXIgZXZlbnRzIHRvIG1hdGNoIHN0YXJ0IGV2ZW50XG4gIHZhciBldmVudHMgPSBwb3N0U3RhcnRFdmVudHNbIGV2ZW50LnR5cGUgXTtcbiAgLy8gYmluZCBldmVudHMgdG8gbm9kZVxuICBldmVudHMuZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCB0aGlzICk7XG4gIH0sIHRoaXMgKTtcbiAgLy8gc2F2ZSB0aGVzZSBhcmd1bWVudHNcbiAgdGhpcy5fYm91bmRQb2ludGVyRXZlbnRzID0gZXZlbnRzO1xufTtcblxucHJvdG8uX3VuYmluZFBvc3RTdGFydEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAvLyBjaGVjayBmb3IgX2JvdW5kRXZlbnRzLCBpbiBjYXNlIGRyYWdFbmQgdHJpZ2dlcmVkIHR3aWNlIChvbGQgSUU4IGJ1ZylcbiAgaWYgKCAhdGhpcy5fYm91bmRQb2ludGVyRXZlbnRzICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLl9ib3VuZFBvaW50ZXJFdmVudHMuZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCB0aGlzICk7XG4gIH0sIHRoaXMgKTtcblxuICBkZWxldGUgdGhpcy5fYm91bmRQb2ludGVyRXZlbnRzO1xufTtcblxuLy8gLS0tLS0gbW92ZSBldmVudCAtLS0tLSAvL1xuXG5wcm90by5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5fcG9pbnRlck1vdmUoIGV2ZW50LCBldmVudCApO1xufTtcblxucHJvdG8ub25NU1BvaW50ZXJNb3ZlID1cbnByb3RvLm9ucG9pbnRlcm1vdmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIGlmICggZXZlbnQucG9pbnRlcklkID09IHRoaXMucG9pbnRlcklkZW50aWZpZXIgKSB7XG4gICAgdGhpcy5fcG9pbnRlck1vdmUoIGV2ZW50LCBldmVudCApO1xuICB9XG59O1xuXG5wcm90by5vbnRvdWNobW92ZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdmFyIHRvdWNoID0gdGhpcy5nZXRUb3VjaCggZXZlbnQuY2hhbmdlZFRvdWNoZXMgKTtcbiAgaWYgKCB0b3VjaCApIHtcbiAgICB0aGlzLl9wb2ludGVyTW92ZSggZXZlbnQsIHRvdWNoICk7XG4gIH1cbn07XG5cbi8qKlxuICogcG9pbnRlciBtb3ZlXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHBhcmFtIHtFdmVudCBvciBUb3VjaH0gcG9pbnRlclxuICogQHByaXZhdGVcbiAqL1xucHJvdG8uX3BvaW50ZXJNb3ZlID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLnBvaW50ZXJNb3ZlKCBldmVudCwgcG9pbnRlciApO1xufTtcblxuLy8gcHVibGljXG5wcm90by5wb2ludGVyTW92ZSA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5lbWl0RXZlbnQoICdwb2ludGVyTW92ZScsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xufTtcblxuLy8gLS0tLS0gZW5kIGV2ZW50IC0tLS0tIC8vXG5cblxucHJvdG8ub25tb3VzZXVwID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB0aGlzLl9wb2ludGVyVXAoIGV2ZW50LCBldmVudCApO1xufTtcblxucHJvdG8ub25NU1BvaW50ZXJVcCA9XG5wcm90by5vbnBvaW50ZXJ1cCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgaWYgKCBldmVudC5wb2ludGVySWQgPT0gdGhpcy5wb2ludGVySWRlbnRpZmllciApIHtcbiAgICB0aGlzLl9wb2ludGVyVXAoIGV2ZW50LCBldmVudCApO1xuICB9XG59O1xuXG5wcm90by5vbnRvdWNoZW5kID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB2YXIgdG91Y2ggPSB0aGlzLmdldFRvdWNoKCBldmVudC5jaGFuZ2VkVG91Y2hlcyApO1xuICBpZiAoIHRvdWNoICkge1xuICAgIHRoaXMuX3BvaW50ZXJVcCggZXZlbnQsIHRvdWNoICk7XG4gIH1cbn07XG5cbi8qKlxuICogcG9pbnRlciB1cFxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnQgb3IgVG91Y2h9IHBvaW50ZXJcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvLl9wb2ludGVyVXAgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuX3BvaW50ZXJEb25lKCk7XG4gIHRoaXMucG9pbnRlclVwKCBldmVudCwgcG9pbnRlciApO1xufTtcblxuLy8gcHVibGljXG5wcm90by5wb2ludGVyVXAgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuZW1pdEV2ZW50KCAncG9pbnRlclVwJywgWyBldmVudCwgcG9pbnRlciBdICk7XG59O1xuXG4vLyAtLS0tLSBwb2ludGVyIGRvbmUgLS0tLS0gLy9cblxuLy8gdHJpZ2dlcmVkIG9uIHBvaW50ZXIgdXAgJiBwb2ludGVyIGNhbmNlbFxucHJvdG8uX3BvaW50ZXJEb25lID0gZnVuY3Rpb24oKSB7XG4gIC8vIHJlc2V0IHByb3BlcnRpZXNcbiAgdGhpcy5pc1BvaW50ZXJEb3duID0gZmFsc2U7XG4gIGRlbGV0ZSB0aGlzLnBvaW50ZXJJZGVudGlmaWVyO1xuICAvLyByZW1vdmUgZXZlbnRzXG4gIHRoaXMuX3VuYmluZFBvc3RTdGFydEV2ZW50cygpO1xuICB0aGlzLnBvaW50ZXJEb25lKCk7XG59O1xuXG5wcm90by5wb2ludGVyRG9uZSA9IG5vb3A7XG5cbi8vIC0tLS0tIHBvaW50ZXIgY2FuY2VsIC0tLS0tIC8vXG5cbnByb3RvLm9uTVNQb2ludGVyQ2FuY2VsID1cbnByb3RvLm9ucG9pbnRlcmNhbmNlbCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgaWYgKCBldmVudC5wb2ludGVySWQgPT0gdGhpcy5wb2ludGVySWRlbnRpZmllciApIHtcbiAgICB0aGlzLl9wb2ludGVyQ2FuY2VsKCBldmVudCwgZXZlbnQgKTtcbiAgfVxufTtcblxucHJvdG8ub250b3VjaGNhbmNlbCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdmFyIHRvdWNoID0gdGhpcy5nZXRUb3VjaCggZXZlbnQuY2hhbmdlZFRvdWNoZXMgKTtcbiAgaWYgKCB0b3VjaCApIHtcbiAgICB0aGlzLl9wb2ludGVyQ2FuY2VsKCBldmVudCwgdG91Y2ggKTtcbiAgfVxufTtcblxuLyoqXG4gKiBwb2ludGVyIGNhbmNlbFxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnQgb3IgVG91Y2h9IHBvaW50ZXJcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvLl9wb2ludGVyQ2FuY2VsID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLl9wb2ludGVyRG9uZSgpO1xuICB0aGlzLnBvaW50ZXJDYW5jZWwoIGV2ZW50LCBwb2ludGVyICk7XG59O1xuXG4vLyBwdWJsaWNcbnByb3RvLnBvaW50ZXJDYW5jZWwgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuZW1pdEV2ZW50KCAncG9pbnRlckNhbmNlbCcsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbi8vIHV0aWxpdHkgZnVuY3Rpb24gZm9yIGdldHRpbmcgeC95IGNvb3JkcyBmcm9tIGV2ZW50XG5Vbmlwb2ludGVyLmdldFBvaW50ZXJQb2ludCA9IGZ1bmN0aW9uKCBwb2ludGVyICkge1xuICByZXR1cm4ge1xuICAgIHg6IHBvaW50ZXIucGFnZVgsXG4gICAgeTogcG9pbnRlci5wYWdlWVxuICB9O1xufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbnJldHVybiBVbmlwb2ludGVyO1xuXG59KSk7XG4iLCIvKiFcbiAqIHZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbCB2MC42LjBcbiAqIEB3ZWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9yb2RuZXlyZWhtL3ZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbC9cbiAqIEBhdXRob3I6IFJvZG5leSBSZWhtIC0gaHR0cDovL3JvZG5leXJlaG0uZGUvZW4vXG4gKi9cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKmdsb2JhbCBkb2N1bWVudCwgd2luZG93LCBuYXZpZ2F0b3IsIGxvY2F0aW9uLCBYTUxIdHRwUmVxdWVzdCwgWERvbWFpblJlcXVlc3QsIEN1c3RvbUV2ZW50Ki9cblxuICB2YXIgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgdmFyIG9wdGlvbnM7XG4gIHZhciB1c2VyQWdlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgdmFyIHZpZXdwb3J0VW5pdEV4cHJlc3Npb24gPSAvKFsrLV0/WzAtOS5dKykodmh8dnd8dm1pbnx2bWF4KS9nO1xuICB2YXIgZm9yRWFjaCA9IFtdLmZvckVhY2g7XG4gIHZhciBkaW1lbnNpb25zO1xuICB2YXIgZGVjbGFyYXRpb25zO1xuICB2YXIgc3R5bGVOb2RlO1xuICB2YXIgaXNCdWdneUlFID0gL01TSUUgWzAtOV1cXC4vaS50ZXN0KHVzZXJBZ2VudCk7XG4gIHZhciBpc09sZElFID0gL01TSUUgWzAtOF1cXC4vaS50ZXN0KHVzZXJBZ2VudCk7XG4gIHZhciBpc09wZXJhTWluaSA9IHVzZXJBZ2VudC5pbmRleE9mKCdPcGVyYSBNaW5pJykgPiAtMTtcblxuICB2YXIgaXNNb2JpbGVTYWZhcmkgPSAvKGlQaG9uZXxpUG9kfGlQYWQpLitBcHBsZVdlYktpdC9pLnRlc3QodXNlckFnZW50KSAmJiAoZnVuY3Rpb24oKSB7XG4gICAgLy8gUmVnZXhwIGZvciBpT1MtdmVyc2lvbiB0ZXN0ZWQgYWdhaW5zdCB0aGUgZm9sbG93aW5nIHVzZXJBZ2VudCBzdHJpbmdzOlxuICAgIC8vIEV4YW1wbGUgV2ViVmlldyBVc2VyQWdlbnRzOlxuICAgIC8vICogaU9TIENocm9tZSBvbiBpT1M4OiBcIk1vemlsbGEvNS4wIChpUGFkOyBDUFUgT1MgOF8xIGxpa2UgTWFjIE9TIFgpIEFwcGxlV2ViS2l0LzYwMC4xLjQgKEtIVE1MLCBsaWtlIEdlY2tvKSBDcmlPUy8zOS4wLjIxNzEuNTAgTW9iaWxlLzEyQjQxMCBTYWZhcmkvNjAwLjEuNFwiXG4gICAgLy8gKiBpT1MgRmFjZWJvb2sgb24gaU9TNzogXCJNb3ppbGxhLzUuMCAoaVBob25lOyBDUFUgaVBob25lIE9TIDdfMV8xIGxpa2UgTWFjIE9TIFgpIEFwcGxlV2ViS2l0LzUzNy41MS4yIChLSFRNTCwgbGlrZSBHZWNrbykgTW9iaWxlLzExRDIwMSBbRkJBTi9GQklPUztGQkFWLzEyLjEuMC4yNC4yMDsgRkJCVi8zMjE0MjQ3OyBGQkRWL2lQaG9uZTYsMTtGQk1EL2lQaG9uZTsgRkJTTi9pUGhvbmUgT1M7RkJTVi83LjEuMTsgRkJTUy8yOyBGQkNSL0FUJlQ7RkJJRC9waG9uZTtGQkxDL2VuX1VTO0ZCT1AvNV1cIlxuICAgIC8vIEV4YW1wbGUgU2FmYXJpIFVzZXJBZ2VudHM6XG4gICAgLy8gKiBTYWZhcmkgaU9TODogXCJNb3ppbGxhLzUuMCAoaVBob25lOyBDUFUgaVBob25lIE9TIDhfMCBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC82MDAuMS4zIChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi84LjAgTW9iaWxlLzEyQTQzNDVkIFNhZmFyaS82MDAuMS40XCJcbiAgICAvLyAqIFNhZmFyaSBpT1M3OiBcIk1vemlsbGEvNS4wIChpUGhvbmU7IENQVSBpUGhvbmUgT1MgN18wIGxpa2UgTWFjIE9TIFgpIEFwcGxlV2ViS2l0LzUzNy41MS4xIChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi83LjAgTW9iaWxlLzExQTQ0NDlkIFNhZmFyaS85NTM3LjUzXCJcbiAgICB2YXIgaU9TdmVyc2lvbiA9IHVzZXJBZ2VudC5tYXRjaCgvT1MgKFxcZCkvKTtcbiAgICAvLyB2aWV3cG9ydCB1bml0cyB3b3JrIGZpbmUgaW4gbW9iaWxlIFNhZmFyaSBhbmQgd2ViVmlldyBvbiBpT1MgOCtcbiAgICByZXR1cm4gaU9TdmVyc2lvbiAmJiBpT1N2ZXJzaW9uLmxlbmd0aD4xICYmIHBhcnNlSW50KGlPU3ZlcnNpb25bMV0pIDwgMTA7XG4gIH0pKCk7XG5cbiAgdmFyIGlzQmFkU3RvY2tBbmRyb2lkID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIEFuZHJvaWQgc3RvY2sgYnJvd3NlciB0ZXN0IGRlcml2ZWQgZnJvbVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ5MjYyMjEvZGlzdGluZ3Vpc2gtYW5kcm9pZC1jaHJvbWUtZnJvbS1zdG9jay1icm93c2VyLXN0b2NrLWJyb3dzZXJzLXVzZXItYWdlbnQtY29udGFpXG4gICAgdmFyIGlzQW5kcm9pZCA9IHVzZXJBZ2VudC5pbmRleE9mKCcgQW5kcm9pZCAnKSA+IC0xO1xuICAgIGlmICghaXNBbmRyb2lkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGlzU3RvY2tBbmRyb2lkID0gdXNlckFnZW50LmluZGV4T2YoJ1ZlcnNpb24vJykgPiAtMTtcbiAgICBpZiAoIWlzU3RvY2tBbmRyb2lkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHZlcnNpb25OdW1iZXIgPSBwYXJzZUZsb2F0KCh1c2VyQWdlbnQubWF0Y2goJ0FuZHJvaWQgKFswLTkuXSspJykgfHwgW10pWzFdKTtcbiAgICAvLyBhbnl0aGluZyBiZWxvdyA0LjQgdXNlcyBXZWJLaXQgd2l0aG91dCAqYW55KiB2aWV3cG9ydCBzdXBwb3J0LFxuICAgIC8vIDQuNCBoYXMgaXNzdWVzIHdpdGggdmlld3BvcnQgdW5pdHMgd2l0aGluIGNhbGMoKVxuICAgIHJldHVybiB2ZXJzaW9uTnVtYmVyIDw9IDQuNDtcbiAgfSkoKTtcblxuICAvLyBhZGRlZCBjaGVjayBmb3IgSUUxMCwgSUUxMSBhbmQgRWRnZSA8IDIwLCBzaW5jZSBpdCAqc3RpbGwqIGRvZXNuJ3QgdW5kZXJzdGFuZCB2bWF4XG4gIC8vIGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD12aWV3cG9ydC11bml0c1xuICBpZiAoIWlzQnVnZ3lJRSkge1xuICAgIGlzQnVnZ3lJRSA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC4qcnZbIDpdKjFbMDFdXFwufCBFZGdlXFwvMVxcZFxcLi8pO1xuICB9XG5cbiAgLy8gUG9seWZpbGwgZm9yIGNyZWF0aW5nIEN1c3RvbUV2ZW50cyBvbiBJRTkvMTAvMTFcbiAgLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20va3JhbWJ1aGwvY3VzdG9tLWV2ZW50LXBvbHlmaWxsXG4gIHRyeSB7XG4gICAgbmV3IEN1c3RvbUV2ZW50KCd0ZXN0Jyk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHZhciBDdXN0b21FdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgIHZhciBldnQ7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge1xuICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgIGRldGFpbDogdW5kZWZpbmVkXG4gICAgICB9O1xuXG4gICAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH07XG4gICAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDsgLy8gZXhwb3NlIGRlZmluaXRpb24gdG8gd2luZG93XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gICAgdmFyIHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG5cbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNhbGxiYWNrLCB3YWl0KTtcbiAgICB9O1xuICB9XG5cbiAgLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyNjA2OS9ob3ctdG8taWRlbnRpZnktaWYtYS13ZWJwYWdlLWlzLWJlaW5nLWxvYWRlZC1pbnNpZGUtYW4taWZyYW1lLW9yLWRpcmVjdGx5LWludG8tdFxuICBmdW5jdGlvbiBpbklmcmFtZSgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmICE9PSB3aW5kb3cudG9wO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoaW5pdE9wdGlvbnMpIHtcbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5pdE9wdGlvbnMgPT09IHRydWUpIHtcbiAgICAgIGluaXRPcHRpb25zID0ge1xuICAgICAgICBmb3JjZTogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gaW5pdE9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5pc01vYmlsZVNhZmFyaSA9IGlzTW9iaWxlU2FmYXJpO1xuICAgIG9wdGlvbnMuaXNCYWRTdG9ja0FuZHJvaWQgPSBpc0JhZFN0b2NrQW5kcm9pZDtcblxuICAgIGlmIChvcHRpb25zLmlnbm9yZVZtYXggJiYgIW9wdGlvbnMuZm9yY2UgJiYgIWlzT2xkSUUpIHtcbiAgICAgIC8vIG1vZGVybiBJRSAoMTAgYW5kIHVwKSBkbyBub3Qgc3VwcG9ydCB2bWluL3ZtYXgsXG4gICAgICAvLyBidXQgY2hhbmNlcyBhcmUgdGhpcyB1bml0IGlzIG5vdCBldmVuIHVzZWQsIHNvXG4gICAgICAvLyBhbGxvdyBvdmVyd3JpdGluZyB0aGUgXCJoYWNrdGl2YXRpb25cIlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JvZG5leXJlaG0vdmlld3BvcnQtdW5pdHMtYnVnZ3lmaWxsL2lzc3Vlcy81NlxuICAgICAgaXNCdWdneUlFID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzT2xkSUUgfHwgKCFvcHRpb25zLmZvcmNlICYmICFpc01vYmlsZVNhZmFyaSAmJiAhaXNCdWdneUlFICYmICFpc0JhZFN0b2NrQW5kcm9pZCAmJiAhaXNPcGVyYU1pbmkgJiYgKCFvcHRpb25zLmhhY2tzIHx8ICFvcHRpb25zLmhhY2tzLnJlcXVpcmVkKG9wdGlvbnMpKSkpIHtcbiAgICAgIC8vIHRoaXMgYnVnZ3lmaWxsIG9ubHkgYXBwbGllcyB0byBtb2JpbGUgc2FmYXJpLCBJRTktMTAgYW5kIHRoZSBTdG9jayBBbmRyb2lkIEJyb3dzZXIuXG4gICAgICBpZiAod2luZG93LmNvbnNvbGUgJiYgaXNPbGRJRSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJ3ZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbCByZXF1aXJlcyBhIHByb3BlciBDU1NPTSBhbmQgYmFzaWMgdmlld3BvcnQgdW5pdCBzdXBwb3J0LCB3aGljaCBhcmUgbm90IGF2YWlsYWJsZSBpbiBJRTggYW5kIGJlbG93Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHt9XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZpcmUgYSBjdXN0b20gZXZlbnQgdGhhdCBidWdneWZpbGwgd2FzIGluaXRpYWxpemVcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbC1pbml0JykpO1xuXG4gICAgb3B0aW9ucy5oYWNrcyAmJiBvcHRpb25zLmhhY2tzLmluaXRpYWxpemUob3B0aW9ucyk7XG5cbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgc3R5bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZU5vZGUuaWQgPSAncGF0Y2hlZC12aWV3cG9ydCc7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuXG4gICAgLy8gSXNzdWUgIzY6IENyb3NzIE9yaWdpbiBTdHlsZXNoZWV0cyBhcmUgbm90IGFjY2Vzc2libGUgdGhyb3VnaCBDU1NPTSxcbiAgICAvLyB0aGVyZWZvcmUgZG93bmxvYWQgYW5kIGluamVjdCB0aGVtIGFzIDxzdHlsZT4gdG8gY2lyY3VtdmVudCBTT1AuXG4gICAgaW1wb3J0Q3Jvc3NPcmlnaW5MaW5rcyhmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfcmVmcmVzaCA9IGRlYm91bmNlKHJlZnJlc2gsIG9wdGlvbnMucmVmcmVzaERlYm91bmNlV2FpdCB8fCAxMDApO1xuICAgICAgLy8gZG9pbmcgYSBmdWxsIHJlZnJlc2ggcmF0aGVyIHRoYW4gdXBkYXRlU3R5bGVzIGJlY2F1c2UgYW4gb3JpZW50YXRpb25jaGFuZ2VcbiAgICAgIC8vIGNvdWxkIGFjdGl2YXRlIGRpZmZlcmVudCBzdHlsZXNoZWV0c1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgX3JlZnJlc2gsIHRydWUpO1xuICAgICAgLy8gb3JpZW50YXRpb25jaGFuZ2UgbWlnaHQgaGF2ZSBoYXBwZW5lZCB3aGlsZSBpbiBhIGRpZmZlcmVudCB3aW5kb3dcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIF9yZWZyZXNoLCB0cnVlKTtcblxuICAgICAgaWYgKG9wdGlvbnMuZm9yY2UgfHwgaXNCdWdneUlFIHx8IGluSWZyYW1lKCkpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF9yZWZyZXNoLCB0cnVlKTtcbiAgICAgICAgb3B0aW9ucy5fbGlzdGVuaW5nVG9SZXNpemUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmhhY2tzICYmIG9wdGlvbnMuaGFja3MuaW5pdGlhbGl6ZUV2ZW50cyhvcHRpb25zLCByZWZyZXNoLCBfcmVmcmVzaCk7XG5cbiAgICAgIHJlZnJlc2goKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlcygpIHtcbiAgICBzdHlsZU5vZGUudGV4dENvbnRlbnQgPSBnZXRSZXBsYWNlZFZpZXdwb3J0VW5pdHMoKTtcbiAgICAvLyBtb3ZlIHRvIHRoZSBlbmQgaW4gY2FzZSBpbmxpbmUgPHN0eWxlPnMgd2VyZSBhZGRlZCBkeW5hbWljYWxseVxuICAgIHN0eWxlTm9kZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHN0eWxlTm9kZSk7XG4gICAgLy8gZmlyZSBhIGN1c3RvbSBldmVudCB0aGF0IHN0eWxlcyB3ZXJlIHVwZGF0ZWRcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbC1zdHlsZScpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZpbmRQcm9wZXJ0aWVzKCk7XG5cbiAgICAvLyBpT1MgU2FmYXJpIHdpbGwgcmVwb3J0IHdpbmRvdy5pbm5lcldpZHRoIGFuZCAuaW5uZXJIZWlnaHQgYXMgMCB1bmxlc3MgYSB0aW1lb3V0IGlzIHVzZWQgaGVyZS5cbiAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IFdIWSBpbm5lcldpZHRoID09PSAwXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHVwZGF0ZVN0eWxlcygpO1xuICAgIH0sIDEpO1xuICB9XG4gIFxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMzYxMzA1MlxuICBmdW5jdGlvbiBwcm9jZXNzU3R5bGVzaGVldChzcykge1xuICAgIC8vIGNzc1J1bGVzIHJlc3BlY3RzIHNhbWUtb3JpZ2luIHBvbGljeSwgYXMgcGVyXG4gICAgLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ5MDAxI2MxMC5cbiAgICB0cnkge1xuICAgICAgaWYgKCFzcy5jc3NSdWxlcykgeyByZXR1cm47IH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTZWN1cml0eUVycm9yJykgeyB0aHJvdyBlOyB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHNzLmNzc1J1bGVzIGlzIGF2YWlsYWJsZSwgc28gcHJvY2VlZCB3aXRoIGRlc2lyZWQgb3BlcmF0aW9ucy5cbiAgICB2YXIgcnVsZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNzLmNzc1J1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcnVsZSA9IHNzLmNzc1J1bGVzW2ldO1xuICAgICAgcnVsZXMucHVzaChydWxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVzO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluZFByb3BlcnRpZXMoKSB7XG4gICAgZGVjbGFyYXRpb25zID0gW107XG4gICAgZm9yRWFjaC5jYWxsKGRvY3VtZW50LnN0eWxlU2hlZXRzLCBmdW5jdGlvbihzaGVldCkge1xuICAgICAgdmFyIGNzc1J1bGVzID0gcHJvY2Vzc1N0eWxlc2hlZXQoc2hlZXQpO1xuXG4gICAgICBpZiAoIWNzc1J1bGVzIHx8IHNoZWV0Lm93bmVyTm9kZS5pZCA9PT0gJ3BhdGNoZWQtdmlld3BvcnQnIHx8IHNoZWV0Lm93bmVyTm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlld3BvcnQtdW5pdHMtYnVnZ3lmaWxsJykgPT09ICdpZ25vcmUnKSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIHNoZWV0IGJlY2F1c2Ugbm8gcnVsZXMgYXJlIHByZXNlbnQsIGl0J3Mgc3VwcG9zZWQgdG8gYmUgaWdub3JlZCBvciBpdCdzIHRoZSB0YXJnZXQtZWxlbWVudCBvZiB0aGUgYnVnZ3lmaWxsXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNoZWV0Lm1lZGlhICYmIHNoZWV0Lm1lZGlhLm1lZGlhVGV4dCAmJiB3aW5kb3cubWF0Y2hNZWRpYSAmJiAhd2luZG93Lm1hdGNoTWVkaWEoc2hlZXQubWVkaWEubWVkaWFUZXh0KS5tYXRjaGVzKSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIHNoZWV0IGJlY2F1c2UgbWVkaWEgYXR0cmlidXRlIGRvZXNuJ3QgbWF0Y2hcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3JFYWNoLmNhbGwoY3NzUnVsZXMsIGZpbmREZWNsYXJhdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlY2xhcmF0aW9ucztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmREZWNsYXJhdGlvbnMocnVsZSkge1xuICAgIGlmIChydWxlLnR5cGUgPT09IDcpIHtcbiAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgLy8gdGhlcmUgbWF5IGJlIGEgY2FzZSB3aGVyZSBhY2Nlc3NpbmcgY3NzVGV4dCB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAvLyBJIGNvdWxkIG5vdCByZXByb2R1Y2UgdGhpcyBpc3N1ZSwgYnV0IHRoZSB3b3JzdCB0aGF0IGNhbiBoYXBwZW5cbiAgICAgIC8vIHRoaXMgd2F5IGlzIGFuIGFuaW1hdGlvbiBub3QgcnVubmluZyBwcm9wZXJseS5cbiAgICAgIC8vIG5vdCBhd2Vzb21lLCBidXQgcHJvYmFibHkgYmV0dGVyIHRoYW4gYSBzY3JpcHQgZXJyb3JcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcm9kbmV5cmVobS92aWV3cG9ydC11bml0cy1idWdneWZpbGwvaXNzdWVzLzIxXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHJ1bGUuY3NzVGV4dDtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZpZXdwb3J0VW5pdEV4cHJlc3Npb24ubGFzdEluZGV4ID0gMDtcbiAgICAgIGlmICh2aWV3cG9ydFVuaXRFeHByZXNzaW9uLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIC8vIEtleWZyYW1lc1J1bGUgZG9lcyBub3QgaGF2ZSBhIENTUy1Qcm9wZXJ0eU5hbWVcbiAgICAgICAgZGVjbGFyYXRpb25zLnB1c2goW3J1bGUsIG51bGwsIHZhbHVlXSk7XG4gICAgICAgIG9wdGlvbnMuaGFja3MgJiYgb3B0aW9ucy5oYWNrcy5maW5kRGVjbGFyYXRpb25zKGRlY2xhcmF0aW9ucywgcnVsZSwgbnVsbCwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFydWxlLnN0eWxlKSB7XG4gICAgICBpZiAoIXJ1bGUuY3NzUnVsZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3JFYWNoLmNhbGwocnVsZS5jc3NSdWxlcywgZnVuY3Rpb24oX3J1bGUpIHtcbiAgICAgICAgZmluZERlY2xhcmF0aW9ucyhfcnVsZSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvckVhY2guY2FsbChydWxlLnN0eWxlLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgdmFsdWUgPSBydWxlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG4gICAgICAvLyBwcmVzZXJ2ZSB0aG9zZSAhaW1wb3J0YW50IHJ1bGVzXG4gICAgICBpZiAocnVsZS5zdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KG5hbWUpKSB7XG4gICAgICAgIHZhbHVlICs9ICcgIWltcG9ydGFudCc7XG4gICAgICB9XG5cbiAgICAgIHZpZXdwb3J0VW5pdEV4cHJlc3Npb24ubGFzdEluZGV4ID0gMDtcbiAgICAgIGlmICh2aWV3cG9ydFVuaXRFeHByZXNzaW9uLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIGRlY2xhcmF0aW9ucy5wdXNoKFtydWxlLCBuYW1lLCB2YWx1ZV0pO1xuICAgICAgICBvcHRpb25zLmhhY2tzICYmIG9wdGlvbnMuaGFja3MuZmluZERlY2xhcmF0aW9ucyhkZWNsYXJhdGlvbnMsIHJ1bGUsIG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcGxhY2VkVmlld3BvcnRVbml0cygpIHtcbiAgICBkaW1lbnNpb25zID0gZ2V0Vmlld3BvcnQoKTtcblxuICAgIHZhciBjc3MgPSBbXTtcbiAgICB2YXIgYnVmZmVyID0gW107XG4gICAgdmFyIG9wZW47XG4gICAgdmFyIGNsb3NlO1xuXG4gICAgZGVjbGFyYXRpb25zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIF9pdGVtID0gb3ZlcndyaXRlRGVjbGFyYXRpb24uYXBwbHkobnVsbCwgaXRlbSk7XG4gICAgICB2YXIgX29wZW4gPSBfaXRlbS5zZWxlY3Rvci5sZW5ndGggPyAoX2l0ZW0uc2VsZWN0b3Iuam9pbignIHtcXG4nKSArICcge1xcbicpIDogJyc7XG4gICAgICB2YXIgX2Nsb3NlID0gbmV3IEFycmF5KF9pdGVtLnNlbGVjdG9yLmxlbmd0aCArIDEpLmpvaW4oJ1xcbn0nKTtcblxuICAgICAgaWYgKCFfb3BlbiB8fCBfb3BlbiAhPT0gb3Blbikge1xuICAgICAgICBpZiAoYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgIGNzcy5wdXNoKG9wZW4gKyBidWZmZXIuam9pbignXFxuJykgKyBjbG9zZSk7XG4gICAgICAgICAgYnVmZmVyLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX29wZW4pIHtcbiAgICAgICAgICBvcGVuID0gX29wZW47XG4gICAgICAgICAgY2xvc2UgPSBfY2xvc2U7XG4gICAgICAgICAgYnVmZmVyLnB1c2goX2l0ZW0uY29udGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3NzLnB1c2goX2l0ZW0uY29udGVudCk7XG4gICAgICAgICAgb3BlbiA9IG51bGw7XG4gICAgICAgICAgY2xvc2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoX29wZW4gJiYgIW9wZW4pIHtcbiAgICAgICAgb3BlbiA9IF9vcGVuO1xuICAgICAgICBjbG9zZSA9IF9jbG9zZTtcbiAgICAgIH1cblxuICAgICAgYnVmZmVyLnB1c2goX2l0ZW0uY29udGVudCk7XG4gICAgfSk7XG5cbiAgICBpZiAoYnVmZmVyLmxlbmd0aCkge1xuICAgICAgY3NzLnB1c2gob3BlbiArIGJ1ZmZlci5qb2luKCdcXG4nKSArIGNsb3NlKTtcbiAgICB9XG5cbiAgICAvLyBPcGVyYSBNaW5pIG1lc3NlcyB1cCBvbiB0aGUgY29udGVudCBoYWNrIChpdCByZXBsYWNlcyB0aGUgRE9NIG5vZGUncyBpbm5lckhUTUwgd2l0aCB0aGUgdmFsdWUpLlxuICAgIC8vIFRoaXMgZml4ZXMgaXQuIFdlIHRlc3QgZm9yIE9wZXJhIE1pbmkgb25seSBzaW5jZSBpdCBpcyB0aGUgbW9zdCBleHBlbnNpdmUgQ1NTIHNlbGVjdG9yXG4gICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Vbml2ZXJzYWxfc2VsZWN0b3JzXG4gICAgaWYgKGlzT3BlcmFNaW5pKSB7XG4gICAgICBjc3MucHVzaCgnKiB7IGNvbnRlbnQ6IG5vcm1hbCAhaW1wb3J0YW50OyB9Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzcy5qb2luKCdcXG5cXG4nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG92ZXJ3cml0ZURlY2xhcmF0aW9uKHJ1bGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIF92YWx1ZTtcbiAgICB2YXIgX3NlbGVjdG9ycyA9IFtdO1xuXG4gICAgX3ZhbHVlID0gdmFsdWUucmVwbGFjZSh2aWV3cG9ydFVuaXRFeHByZXNzaW9uLCByZXBsYWNlVmFsdWVzKTtcblxuICAgIGlmIChvcHRpb25zLmhhY2tzKSB7XG4gICAgICBfdmFsdWUgPSBvcHRpb25zLmhhY2tzLm92ZXJ3cml0ZURlY2xhcmF0aW9uKHJ1bGUsIG5hbWUsIF92YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIC8vIHNraXBwaW5nIEtleWZyYW1lc1J1bGVcbiAgICAgIF9zZWxlY3RvcnMucHVzaChydWxlLnNlbGVjdG9yVGV4dCk7XG4gICAgICBfdmFsdWUgPSBuYW1lICsgJzogJyArIF92YWx1ZSArICc7JztcbiAgICB9XG5cbiAgICB2YXIgX3J1bGUgPSBydWxlLnBhcmVudFJ1bGU7XG4gICAgd2hpbGUgKF9ydWxlKSB7XG4gICAgICBfc2VsZWN0b3JzLnVuc2hpZnQoJ0BtZWRpYSAnICsgX3J1bGUubWVkaWEubWVkaWFUZXh0KTtcbiAgICAgIF9ydWxlID0gX3J1bGUucGFyZW50UnVsZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0b3I6IF9zZWxlY3RvcnMsXG4gICAgICBjb250ZW50OiBfdmFsdWVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVwbGFjZVZhbHVlcyhtYXRjaCwgbnVtYmVyLCB1bml0KSB7XG4gICAgdmFyIF9iYXNlID0gZGltZW5zaW9uc1t1bml0XTtcbiAgICB2YXIgX251bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKSAvIDEwMDtcbiAgICByZXR1cm4gKF9udW1iZXIgKiBfYmFzZSkgKyAncHgnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XG4gICAgdmFyIHZoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHZhciB2dyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZoOiB2aCxcbiAgICAgIHZ3OiB2dyxcbiAgICAgIHZtYXg6IE1hdGgubWF4KHZ3LCB2aCksXG4gICAgICB2bWluOiBNYXRoLm1pbih2dywgdmgpXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltcG9ydENyb3NzT3JpZ2luTGlua3MobmV4dCkge1xuICAgIHZhciBfd2FpdGluZyA9IDA7XG4gICAgdmFyIGRlY3JlYXNlID0gZnVuY3Rpb24oKSB7XG4gICAgICBfd2FpdGluZy0tO1xuICAgICAgaWYgKCFfd2FpdGluZykge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvckVhY2guY2FsbChkb2N1bWVudC5zdHlsZVNoZWV0cywgZnVuY3Rpb24oc2hlZXQpIHtcbiAgICAgIGlmICghc2hlZXQuaHJlZiB8fCBvcmlnaW4oc2hlZXQuaHJlZikgPT09IG9yaWdpbihsb2NhdGlvbi5ocmVmKSB8fCBzaGVldC5vd25lck5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbCcpID09PSAnaWdub3JlJykge1xuICAgICAgICAvLyBza2lwIDxzdHlsZT4gYW5kIDxsaW5rPiBmcm9tIHNhbWUgb3JpZ2luIG9yIGV4cGxpY2l0bHkgZGVjbGFyZWQgdG8gaWdub3JlXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3dhaXRpbmcrKztcbiAgICAgIGNvbnZlcnRMaW5rVG9TdHlsZShzaGVldC5vd25lck5vZGUsIGRlY3JlYXNlKTtcbiAgICB9KTtcblxuICAgIGlmICghX3dhaXRpbmcpIHtcbiAgICAgIG5leHQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvcmlnaW4odXJsKSB7XG4gICAgcmV0dXJuIHVybC5zbGljZSgwLCB1cmwuaW5kZXhPZignLycsIHVybC5pbmRleE9mKCc6Ly8nKSArIDMpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRMaW5rVG9TdHlsZShsaW5rLCBuZXh0KSB7XG4gICAgZ2V0Q29ycyhsaW5rLmhyZWYsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlLm1lZGlhID0gbGluay5tZWRpYTtcbiAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS1ocmVmJywgbGluay5ocmVmKTtcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gdGhpcy5yZXNwb25zZVRleHQ7XG4gICAgICBsaW5rLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHN0eWxlLCBsaW5rKTtcbiAgICAgIG5leHQoKTtcbiAgICB9LCBuZXh0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvcnModXJsLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBpZiAoJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAvLyBYSFIgZm9yIENocm9tZS9GaXJlZm94L09wZXJhL1NhZmFyaS5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIFhEb21haW5SZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gWERvbWFpblJlcXVlc3QgZm9yIElFLlxuICAgICAgeGhyID0gbmV3IFhEb21haW5SZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcm9zcy1kb21haW4gWEhSIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gc3VjY2VzcztcbiAgICB4aHIub25lcnJvciA9IGVycm9yO1xuICAgIHhoci5zZW5kKCk7XG4gICAgcmV0dXJuIHhocjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmVyc2lvbjogJzAuNi4wJyxcbiAgICBmaW5kUHJvcGVydGllczogZmluZFByb3BlcnRpZXMsXG4gICAgZ2V0Q3NzOiBnZXRSZXBsYWNlZFZpZXdwb3J0VW5pdHMsXG4gICAgaW5pdDogaW5pdGlhbGl6ZSxcbiAgICByZWZyZXNoOiByZWZyZXNoXG4gIH07XG5cbn0pKTtcbiIsIihmdW5jdGlvbihzZWxmKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoc2VsZi5mZXRjaCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgICBdXG5cbiAgICB2YXIgaXNEYXRhVmlldyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG4gICAgfVxuXG4gICAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3JcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge31cblxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfSwgdGhpcylcblxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gICAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlKycsJyt2YWx1ZSA6IHZhbHVlXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKG5hbWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgaXRlbXMucHVzaCh2YWx1ZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICAgIH1cbiAgICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgICAgfVxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICAgIH1cbiAgICByZXR1cm4gY2hhcnMuam9pbignJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICAgIGlmIChidWYuc2xpY2UpIHtcbiAgICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gICAgfVxuXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcbiAgfVxuXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHsgYm9keTogdGhpcy5fYm9keUluaXQgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZm9ybVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgICByYXdIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgICAgaWYgKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gaGVhZGVyc1xuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgICB0aGlzLnN0YXR1cyA9ICdzdGF0dXMnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1cyA6IDIwMFxuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9XG5cbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxuICB9XG5cbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxuXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4iLCIvKipcbiAqXG4gKiBFdmVudCBCdXNcbiAqXG4gKiBQdWIvU3ViIHN5c3RlbSBmb3IgY3VzdG9tIGV2ZW50IGNvbW11bmljYXRpb24gYmV0d2VlbiBtb2R1bGVzLlxuICpcbiAqIEV4cG9ydHMgYSBzaW5nbGUgRXZlbnRCdXMgaW5zdGFjZS5cbiAqXG4gKi9cblxuY29uc3QgdG9waWNzID0ge307XG5cbmNvbnN0IEV2ZW50QnVzID0ge1xuXG4gIC8qKlxuICAgKlxuICAgKiBTdWJzY3JpYmUgdG8gdG9waWMsIHBhc3NpbmcgYSBjYWxsYmFjayBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBldmVudCBuYW1lIHRvIHN1YnNjcmliZSB0b1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIENhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZXZlbnQgZ2V0cyBwdWJsaXNoZWRcbiAgICpcbiAgICogQHJldHVybnMge29iamVjdH0gQ2FuY2VsbGFibGUgc3Vic2NyaXB0aW9uIG9iamVjdC5cbiAgICogXG4gICAqL1xuICBcbiAgc3Vic2NyaWJlKHRvcGljLCBsaXN0ZW5lcikge1xuXG4gICAgLy8gQ3JlYXRlIHRoZSB0b3BpYydzIG9iamVjdCBpZiBub3QgeWV0IGNyZWF0ZWRcbiAgICBpZighdG9waWNzLmhhc093blByb3BlcnR5KHRvcGljKSkge1xuICAgICAgdG9waWNzW3RvcGljXSA9IFtdO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXIgdG8gcXVldWVcbiAgICBsZXQgaW5kZXggPSB0b3BpY3NbdG9waWNdLnB1c2gobGlzdGVuZXIpIC0xO1xuXG4gICAgLy8gUHJvdmlkZSBoYW5kbGUgYmFjayBmb3IgcmVtb3ZhbCBvZiB0b3BpY1xuICAgIHJldHVybiB7XG4gICAgICByZW1vdmUoKSB7XG4gICAgICAgIGRlbGV0ZSB0b3BpY3NbdG9waWNdW2luZGV4XTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKlxuICAgKiBUcmlnZ2VyIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIGV2ZW50IG5hbWUgdG8gcHVibGlzaFxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBbnkgbnVtYmVyIG9mIGN1c3RvbSBkYXRhIHRvIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcbiAgICogXG4gICAqL1xuICBcbiAgcHVibGlzaCh0b3BpYykge1xuXG4gICAgLy8gSWYgdGhlIHRvcGljIGRvZXNuJ3QgZXhpc3QsIG9yIHRoZXJlJ3Mgbm8gbGlzdGVuZXJzIGluIHF1ZXVlLCBqdXN0IGxlYXZlXG4gICAgaWYoIXRvcGljcy5oYXNPd25Qcm9wZXJ0eSh0b3BpYykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b3BpY3NbdG9waWNdLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYXBwbHkobnVsbCwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50QnVzXG4iLCIvKipcbiAqXG4gKiBGb3Jtc1xuICpcbiAqIEZvcm0gcHJlc2VudGF0aW9uYWwgYW5kIGJlaGF2aW91cmFsIHNjcmlwdHNcbiAqXG4gKiBVc2VzIGdsb2JhbCBqUXVlcnkgcmVmZXJlbmNlIGV4cG9zZWQgYnkgZm9ybXMgcGx1Z2luXG4gKlxuICovXG5cbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJ1xuXG5sZXQgJCA9IGZhbHNlO1xuXG4vLyBWZXJ5IEltcG9ydGFudFxuLy8gTXVzdCBlbnN1cmUgd2UgYXJlIHVzaW5nIHRoZSBzYW1lIGpxdWVyeSBpbnN0YW5jZSBhcyBHZm9ybXNcbmlmKHdpbmRvdy5qUXVlcnkpIHtcbiAgJCA9IHdpbmRvdy5qUXVlcnk7XG59XG5cbmNvbnN0IGZpbGVVcGxvYWRMYWJlbEF0dHIgPSAnZGF0YS1sYWJlbC10ZXh0J1xuXG5mdW5jdGlvbiBmaWxlVXBsb2FkT25DaGFuZ2UoZSwgZGVmYXVsdExhYmVsKSB7XG5cbiAgY29uc3QgJGN1c3RvbUxhYmVsID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpLmZpbmQoYFskeyBmaWxlVXBsb2FkTGFiZWxBdHRyIH1dYClcbiAgY29uc3QgdmFsID0gZS5jdXJyZW50VGFyZ2V0LnZhbHVlLnJlcGxhY2UoJ0M6XFxcXGZha2VwYXRoXFxcXCcsICcnKVxuXG4gICRjdXN0b21MYWJlbC50ZXh0KHZhbCB8fCBkZWZhdWx0TGFiZWwpXG5cbn1cblxuLyoqXG4gKlxuICogQ3VzdG9tIE1hc2sgZm9yIEZpbGUgVXBsb2FkIElucHV0c1xuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRmlsZVVwbG9hZChpbnB1dCwgbGFiZWwgPSAnQ2hvb3NlIGZpbGUnKSB7XG5cbiAgaWYoISQpIHsgcmV0dXJuIH1cblxuICBjb25zdCAkaW5wdXQgPSAkKGlucHV0KVxuICBjb25zdCAkY3VzdG9tTGFiZWwgPSAkKGA8c3BhbiAkeyBmaWxlVXBsb2FkTGFiZWxBdHRyIH0+JHsgbGFiZWwgfTwvc3Bhbj5gKVxuXG4gICRpbnB1dC5vbignY2hhbmdlJywgZSA9PiBmaWxlVXBsb2FkT25DaGFuZ2UoZSwgbGFiZWwpKVxuICBcbiAgJGlucHV0LndyYXBBbGwoYFxuICAgIDxsYWJlbCBmb3I9XCIkeyBpbnB1dC5pZCB9XCI+XG4gICAgPC9sYWJlbD5cbiAgYClcbiAgICAucGFyZW50KClcbiAgICAucHJlcGVuZCgkY3VzdG9tTGFiZWwpXG5cbiAgcmV0dXJuIHtcbiAgICBzZXRMYWJlbFRleHQobGFiZWwpIHtcbiAgICAgICRjdXN0b21MYWJlbC50ZXh0KGxhYmVsKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgZ2V0TGFiZWxUZXh0KCkge1xuICAgICAgcmV0dXJuICRjdXN0b21MYWJlbC50ZXh0KClcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBnZXRHZm9ybUlkKGZvcm1FbCkge1xuICByZXR1cm4gZm9ybUVsLmlkLnJlcGxhY2UoJ2dmb3JtXycsICcnKVxufVxuXG5cbi8qKlxuICpcbiAqIFN1Ym1pdCBHcmF2aXR5IEZvcm1zIHZpYSBBSkFYXG4gKlxuICogSW4gdGhpcyBmdW5jdGlvbiB3ZSBhbHNvIHNldHVwIGN1c3RvbSBmaWxlIHVwbG9hZCBpbnB1dHMsIHNlZSBgY3VzdG9tRmlsZVVwbG9hZGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgalF1ZXJ5IHNlbGVjdG9yIGZvciB0aGUgZm9ybXMgdG8gYmUgc3VibWl0dGVkIHZpYSBBSkFYXG4gKlxuICogQGV2ZW50ICdmb3JtOnN1Ym1pdHRpbmcnIC0gRmlyZXMgd2hlbiB0aGUgdXNlciBzdWJtaXRzIHRoZSBmb3JtXG4gKiBAZXZlbnQgJ2Zvcm06c3VibWl0LWRvbmUnIC0gRmlyZXMgYWZ0ZXIgR3Jhdml0eSBGb3JtcyBzdWNjZXNmdWxseSBzdWJtaXRzIHRoZSBmb3JtXG4gKlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4U3VibWl0R2Zvcm1zKHNlbGVjdG9yKSB7XG5cbiAgaWYoISQpIHsgcmV0dXJuIH1cblxuICAkKGRvY3VtZW50KS5vbignZ2Zvcm1fcG9zdF9yZW5kZXInLCBmdW5jdGlvbihlLCBmb3JtSWQpe1xuXG4gICAgJCgnI2dmb3JtX3dyYXBwZXJfJyArIGZvcm1JZClcbiAgICAgIC5maWx0ZXIoKGksIGVsKSA9PiB7XG5cbiAgICAgICAgY29uc3QgaGlkZGVuSWRGaWVsZCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPWdmb3JtX3N1Ym1pdF0nKVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB1c2luZyB0aGUgJ011bHRpcGxlIEZvcm0gSW5zdGFuY2UnIHBsdWdpbiBmb3IgR2Zvcm1zLFxuICAgICAgICAgKiBpdCBjaGFuZ2VzIHRoZSBET00gZm9ybSBJRCdzXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBjYXZlYXQgaXMgdGhhdCB0aGUgaW5pdGlhbCAnZ2Zvcm1fcG9zdF9yZW5kZXInIHdpbGxcbiAgICAgICAgICogcmV0dXJuIGEgJ2Zvcm1JZCcgZXF1YWwgdG8gdGhlIGFjdHVhbCBmb3JtIElEICh1c3VhbGx5IGEgbG93IGRpZ2l0XG4gICAgICAgICAqIGxpa2UgMSwgMiwgMyksIHdoZXJlYXMgc3Vic2VxdWVudCBgZ2Zvcm1fcG9zdF9yZW5kZXJgIChlZzogYWZ0ZXIgYW4gYWpheCBzdWJtaXQpLCByZXR1cm5cbiAgICAgICAgICogdGhlIElEIHNldCBieSB0aGUgJ011bHRpcGxlIEZvcm0gSW5zdGFuY2UnIHBsdWdpbiAod2hpY2ggbG9va3MgbW9yZSBsaWtlIGEgbGFyZ2UgcmFuZG9tXG4gICAgICAgICAqIG51bWJlciwgZWc6IDIxMDg5NjAxNDcpXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSAnZm9ybUlEJyBtYXRjaGVkIHRoZSBJRCBvbiB0aGUgRE9NIGVsZW1lbnQgKHVzZWQgYWZ0ZXIgYW4gYWpheCBzdWJtaXNzaW9uKVxuICAgICAgICBpZihnZXRHZm9ybUlkKGVsKSA9PSBmb3JtSWQpIHtcbiAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgfVxuICAgICAgICAvLyBvdGhlcndpc2UsIGNoZWNrIGFnYWlucyB0aGUgaGlkZGVuIGZpZWxkIGNvbnRhaW5pbmcgdGhlIGFjdHVhbCBmb3JtIElEICh1c2VkIG9uIGluaXRpYWwgcmVuZGVyKVxuICAgICAgICBlbHNlIGlmIChoaWRkZW5JZEZpZWxkICYmIGhpZGRlbklkRmllbGQudmFsdWUgPT0gZm9ybUlkKSB7XG4gICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuZWFjaCgoaSwgZm9ybSkgPT4ge1xuXG4gICAgICAgIGNvbnN0ICRmb3JtID0gJChmb3JtKVxuICAgICAgICBjb25zdCAkd3JhcHBlciA9ICRmb3JtLmNsb3Nlc3QoJy5nZm9ybV93cmFwcGVyJylcblxuICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnaXMtc3VibWl0dGluZycpXG5cbiAgICAgICAgJGZvcm1cbiAgICAgICAgICAuZmluZCgnW3R5cGU9ZmlsZV0nKVxuICAgICAgICAgIC5lYWNoKChpLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgY3VzdG9tRmlsZVVwbG9hZChpbnB1dClcbiAgICAgICAgICB9KVxuXG4gICAgICB9KVxuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignZ2Zvcm1fY29uZmlybWF0aW9uX2xvYWRlZCcsIGZ1bmN0aW9uKGUsIGZvcm1JZCkge1xuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnI2dmb3JtX3dyYXBwZXJfJyArIGZvcm1JZClcbiAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnaXMtc3VibWl0dGluZycpXG5cbiAgICBFdmVudEJ1cy5wdWJsaXNoKCdmb3JtOnN1Ym1pdC1kb25lJywgJHdyYXBwZXIpXG4gIH0pXG5cbiAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHNlbGVjdG9yICwgZSA9PiB7XG5cbiAgICBjb25zdCBmb3JtID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgY29uc3QgZm9ybUlkID0gZ2V0R2Zvcm1JZChmb3JtKVxuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnI2dmb3JtX3dyYXBwZXJfJyArIGZvcm1JZClcbiAgICAkd3JhcHBlci5hZGRDbGFzcygnaXMtc3VibWl0dGluZycpXG5cbiAgICBFdmVudEJ1cy5wdWJsaXNoKCdmb3JtOnN1Ym1pdHRpbmcnLCAkd3JhcHBlcilcbiAgfSlcbn1cblxuXG4vKipcbiAqXG4gKiBSZXBvc2l0aW9uIHRoZSBmb3JtIHN1Ym1pdCBidXR0b24sIHNvIHRoYXQgaXQncyBlYXNpZXJcbiAqIHRvIGFsaWduIHdpdGggdGhlIHRoZSBpbnB1dCBmaWVsZFxuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbmV3c2xldHRlck1vdmVTdWJtaXQoZm9ybSkge1xuICBpZighJCkgeyByZXR1cm4gfVxuXG4gIGNvbnN0ICRmb3JtID0gJChmb3JtKVxuICAkZm9ybS5maW5kKCdbdHlwZT1zdWJtaXRdJykuYXBwZW5kVG8oJGZvcm0uZmluZCgnLmdmb3JtX2JvZHknKSlcbn0iLCIvKipcbiAqXG4gKiBHbG9iYWwgRE9NIEV2ZW50IExpc3RlbmVycywgdG8gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBgRXZlbnRCdXNgXG4gKlxuICovXG5cbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJ1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY29uc3Qga2V5RG93bkVzY2FwZSA9ICdrZXlkb3duOmVzY2FwZSdcbmV4cG9ydCBjb25zdCB3aW5kb3dSZXNpemVkID0gJ3dpbmRvdzpyZXNpemVkJ1xuZXhwb3J0IGNvbnN0IHdpbmRvd1Njcm9sbGVkID0gJ3dpbmRvdzpzY3JvbGxlZCdcbmV4cG9ydCBjb25zdCB3aW5kb3dMb2FkZWQgPSAnd2luZG93OmxvYWRlZCdcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICBjYXNlIDI3OlxuICAgICAgRXZlbnRCdXMucHVibGlzaChrZXlEb3duRXNjYXBlKVxuICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgYnJlYWs7XG4gIH1cbn0pXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRlYm91bmNlKCgpID0+IHtcbiAgRXZlbnRCdXMucHVibGlzaCh3aW5kb3dSZXNpemVkKVxufSwgMTAwKSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgRXZlbnRCdXMucHVibGlzaCh3aW5kb3dTY3JvbGxlZClcbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICBFdmVudEJ1cy5wdWJsaXNoKHdpbmRvd0xvYWRlZClcbn0pIiwiLyoqXG4gKlxuICogTG9hZFxuICpcbiAqIFJlcXVpcmVzIHRoZSBmZXRjaCBBUEkgdG8gYmUgYXZhaWxhYmxlXG4gKiBcbiAqL1xuXG4vKipcbiAqXG4gKiBDYWNoZSBvZiBwcm9taXNlcyBvZiByZXF1ZXN0ZWQgb2JqZWN0c1xuICogXG4gKi9cblxuY29uc3QgcmVxdWVzdGVkVVJMcyA9IHt9O1xuXG4vKipcbiAqXG4gKiBMb2FkIGEgc2NyaXB0IG9ubHkgb25jZSwgcmVnYXJkbGVzcyBpZiBpdHMgcmVxdWVzdGVkIG11bHRpcGxlIHRpbWVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmMgLSBTb3VyY2UgVVJMXG4gKlxuICogQHJldHVybnMge29iamVjdH0gcHJvbWlzZSBvYmplY3QgZm9yIHRoYXQgc3BlY2lmaWMgc291cmNlXG4gKiAgXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRTY3JpcHRPbmNlKHNyYykge1xuXG4gIC8vIENoZWNrIGlmIHdlJ3ZlIGFscmVhZHkgcmVxdWVzdGVkIHRoaXMgc2NyaXB0XG4gIGlmKHNyYyBpbiByZXF1ZXN0ZWRVUkxzKSB7XG5cbiAgICAvLyBJZiBzbywgcmV0dXJuIHRoaXMgc2NyaXB0J3MgcHJvbWlzZVxuICAgIHJldHVybiByZXF1ZXN0ZWRVUkxzW3NyY11cbiAgfVxuXG4gIGxldCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cbiAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gIHMuYXN5bmMgPSB0cnVlO1xuICBzLnNyYyA9IHNyYztcbiAgXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2Ugd2hlbiB0aGUgc2NyaXB0IGhhcyBsb2FkZWQuXG4gICAgcy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHJlc29sdmUoZSk7XG4gICAgfSwgZmFsc2UpO1xuICB9KVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgaGVhZC5hcHBlbmRDaGlsZChzKTtcblxuICAvLyBTdG9yZSB0aGUgcHJvbWlzZSwgZm9yIG5leHQgdGltZSB0aGlzIGBzcmNgIGlzIHJlcXVlc3RlZFxuICByZXF1ZXN0ZWRVUkxzW3NyY10gPSBwcm9taXNlO1xuXG4gIC8vIFJldHVybiB0aGUgcHJvbWlzZVxuICByZXR1cm4gcmVxdWVzdGVkVVJMc1tzcmNdO1xuXG59XG5cbi8qKlxuICpcbiAqIExvYWQgYSBVUkwgb25seSBvbmNlLCByZWdhcmRsZXNzIGlmIGl0cyByZXF1ZXN0ZWQgbXVsdGlwbGUgdGltZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFNvdXJjZSBVUkxcbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBwcm9taXNlIG9iamVjdCBmb3IgdGhhdCBzcGVjaWZpYyBzb3VyY2VcbiAqICBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE9uY2UodXJsLCB0eXBlKSB7XG5cbiAgLy8gQ2hlY2sgaWYgd2UndmUgYWxyZWFkeSByZXF1ZXN0ZWQgdGhpcyBzY3JpcHRcbiAgaWYodXJsIGluIHJlcXVlc3RlZFVSTHMpIHtcblxuICAgIC8vIElmIHNvLCByZXR1cm4gdGhpcyBzY3JpcHQncyBwcm9taXNlXG4gICAgcmV0dXJuIHJlcXVlc3RlZFVSTHNbdXJsXVxuICB9XG5cbiAgbGV0IHByb21pc2UgPSBmZXRjaCh1cmwpXG4gICAgLy8gcmVzLnRleHQoKSBjYW4gb25seSBiZSBjYWxsZWQgb25jZSxcbiAgICAvLyBpdCByZXR1cm5zIGFub3RoZXIgcHJvbWlzZVxuICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICByZXR1cm4gcmVzLnRleHQoKVxuICAgIH0pXG5cbiAgLy8gU3RvcmUgdGhlIHByb21pc2UsIGZvciBuZXh0IHRpbWUgdGhpcyBgdXJsYCBpcyByZXF1ZXN0ZWRcbiAgcmVxdWVzdGVkVVJMc1t1cmxdID0gcHJvbWlzZTtcblxuICAvLyBSZXR1cm4gdGhlIHByb21pc2VcbiAgcmV0dXJuIHJlcXVlc3RlZFVSTHNbdXJsXTtcblxufSIsIi8qKlxuICpcbiAqIE1vZGFsXG4gKlxuICogVG9nZ2xlYWJsZSBtb2RhbCBwYW5lbHNcbiAqXG4gKi9cblxuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnO1xuaW1wb3J0IGNyZWF0ZVZpZGVvSWZyYW1lIGZyb20gJy4vdmlkZW8nO1xuaW1wb3J0IHsgd2hpY2hUcmFuc2l0aW9uRW5kLCBzZWxlY3Rvck1hdGNoZXMsIGNvbGxlY3Rpb24gfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3Qgcm9vdEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuY29uc3QgQUNUSVZFX0NMQVNTID0gJ2lzLWFjdGl2ZSc7XG5jb25zdCBUUkFOU19DTEFTUyAgPSAnaXMtdHJhbnNpdGluZyc7XG5cbi8vIEFkZCBhIGdsb2JhbCBjbGFzcyB0byB0aGUgcm9vdCBlbGVtZW50LCBmb3Igc3R5bGluZ1xucm9vdEVsLmNsYXNzTmFtZSArPSAnIG1vZGFsLXJvb3QnO1xuXG5jb25zdCBtb2RhbFByb3RvID0ge1xuXG4gIGlzT3BlbjogZmFsc2UsXG5cbiAgLyoqXG4gICAqXG4gICAqIE9wZW4gdGhlIG1vZGFsXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqfSBpbnN0YW5jZSAtIE1vZGFsIGluc3RhbmNlIGNyZWF0ZWQgd2hlbiBjYWxsaW5nIGBtb2RhbCgpYFxuICAgKlxuICAgKi9cbiAgb3BlbigpIHtcblxuICAgIGNvbnN0IHsgZWxzIH0gPSB0aGlzO1xuXG4gICAgZWxzLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKEFDVElWRV9DTEFTUywgVFJBTlNfQ0xBU1MpKVxuXG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIEV2ZW50QnVzLnB1Ymxpc2goJ21vZGFsOm9wZW4nLCB0aGlzKVxuICB9LFxuXG4gIC8qKlxuICAgKlxuICAgKiBDbG9zZSB0aGUgbW9kYWxcbiAgICpcbiAgICogQHBhcmFtIHtvYmp9IGluc3RhbmNlIC0gTW9kYWwgaW5zdGFuY2UgY3JlYXRlZCB3aGVuIGNhbGxpbmcgYG1vZGFsKClgXG4gICAqXG4gICAqL1xuICBjbG9zZSgpIHtcbiAgICBcbiAgICBjb25zdCB7IGVscyB9ID0gdGhpcztcblxuICAgIGVscy5tYXAoZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChUUkFOU19DTEFTUykpXG4gICAgZWxzLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKEFDVElWRV9DTEFTUykpXG5cbiAgICBpZighd2hpY2hUcmFuc2l0aW9uRW5kKCkpIHtcbiAgICAgIGVscy5tYXAoZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShUUkFOU19DTEFTUykpXG4gICAgfVxuXG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICBFdmVudEJ1cy5wdWJsaXNoKCdtb2RhbDpjbG9zZScsIHRoaXMpXG4gIH0sXG5cbiAgLyoqXG4gICAqXG4gICAqIFRvZ2dsZSB0aGUgbW9kYWwgb3Blbi9jbG9zZVxuICAgKlxuICAgKiBAcGFyYW0ge29ian0gaW5zdGFuY2UgLSBNb2RhbCBpbnN0YW5jZSBjcmVhdGVkIHdoZW4gY2FsbGluZyBgbW9kYWwoKWBcbiAgICpcbiAgICovXG4gIHRvZ2dsZSgpIHtcblxuICAgIGlmKHRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cblxuICB9XG59XG5cbi8qKlxuICpcbiAqIEluc3RhbnRpYXRlIHRoZSBtb2RhbCwgYWRkaW5nIGNsaWNrIGxpc3RlbmVycyB0byBpdCdzIHRyaWdnZXJzLFxuICogYXMgd2VsbCBhcyBjb250cm9scyBmb3IgY2xvc2luZyBpdC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtb2RhbEVsIC0gTW9kYWwgRE9NIGVsZW1lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgLSBDb25maWd1cmF0aW9uIG9iamVjdCwgd2l0aCBjYWxsYmFja3MgZm9yIHRoZSBtb2RhbHMgb3Blbi9jbG9zZSBldmVudHNcbiAqIEByZXR1cm5zIHtvYmplY3R9IGluc3RhbmNlIC0gTW9kYWwgaW5zdGFuY2VcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdE1vZGFsKG1vZGFsRWwsIGNvbmZpZyA9IHt9KSB7XG5cbiAgaWYoIW1vZGFsRWwgfHwgIW1vZGFsRWwubm9kZVR5cGUpIHtcbiAgICBjb25zb2xlLmxvZygnWW91IG11c3QgcHJvdmlkZSBhIERPTSBlbGVtZW50IHRvIGBpbml0TW9kYWxgJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRmluZCB0aGUgZWxlbWVudHMgdGhhdCB0b2dnbGVzIHRoaXMgbW9kYWxcbiAgY29uc3QgdG9nZ2xlRWxzID0gY29sbGVjdGlvbignW2RhdGEtdG9nZ2xlLW1vZGFsPVwiIycgKyBtb2RhbEVsLmlkICsgJ1wiXScpO1xuICBjb25zdCBhbGxFbHMgPSB0b2dnbGVFbHMuY29uY2F0KG1vZGFsRWwsIHJvb3RFbClcbiAgY29uc3QgY2xvc2VFbHMgPSBjb2xsZWN0aW9uKG1vZGFsRWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2xvc2UtbW9kYWxdJykpXG5cbiAgLy8gQ3JlYXRlIHRoZSBtb2RhbCBpbnN0YW5jZSBvYmplY3RcbiAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZGFsUHJvdG8pXG5cbiAgT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwge1xuICAgIG1vZGFsRWw6IG1vZGFsRWwsXG4gICAgZWxzOiBhbGxFbHNcbiAgfSlcblxuICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgIG9uT3BlbigpIHt9LFxuICAgIG9uQ2xvc2UoKXt9XG4gIH0sIGNvbmZpZylcblxuICAvLyBMaXN0ZW4gZm9yIHRvZ2dsZSBidXR0b24gY2xpY2tzXG4gIHRvZ2dsZUVscy5tYXAoZWwgPT4ge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpbnN0YW5jZS50b2dnbGUoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRXNjIEtleWRvd25cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYoZS5rZXlDb2RlID09IDI3ICYmIGluc3RhbmNlLmlzT3Blbikge1xuICAgICAgaW5zdGFuY2UuY2xvc2UoKVxuICAgIH0gXG4gIH0pO1xuXG4gIC8vIExpc3RlbiBmb3IgY2xpY2sgdG8gYW55IGVsZW1lbnRzIHRoYXQgY2xvc2UgdGhlIG1vZGFsXG4gIGlmIChjbG9zZUVscy5sZW5ndGgpIHtcblxuICAgIGNsb3NlRWxzLm1hcChlbCA9PiB7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICBpZihzZWxlY3Rvck1hdGNoZXMoZS50YXJnZXQsICdbZGF0YS1jbG9zZS1tb2RhbF0nKSAmJiBpbnN0YW5jZS5pc09wZW4pIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaW5zdGFuY2UuY2xvc2UoKSAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH1cblxuICAvLyBMaXN0ZW4gZm9yIHRyYW5zaXRpb24gZW5kIHRvIHJlbW92ZSB0cmFuc2l0aW9uIGNsYXNzXG4gIG1vZGFsRWwuYWRkRXZlbnRMaXN0ZW5lcih3aGljaFRyYW5zaXRpb25FbmQoKSwgZSA9PiB7XG4gICAgaWYoZS50YXJnZXQgPT0gbW9kYWxFbCkge1xuICAgICAgaW5zdGFuY2UuZWxzLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFRSQU5TX0NMQVNTKSlcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFN1YnNjcmliZSB0aGlzIG1vZGFsIHRvIGl0J3Mgb3Blbi9jbG9zZSBldmVudHNcbiAgRXZlbnRCdXMuc3Vic2NyaWJlKCdtb2RhbDpvcGVuJywgb3BlbmVkSW5zdGFuY2UgPT4ge1xuICAgIGlmKGluc3RhbmNlID09IG9wZW5lZEluc3RhbmNlKSB7XG4gICAgICBvcHRpb25zLm9uT3BlbihpbnN0YW5jZSlcbiAgICB9XG4gIH0pXG5cbiAgRXZlbnRCdXMuc3Vic2NyaWJlKCdtb2RhbDpjbG9zZScsIG9wZW5lZEluc3RhbmNlID0+IHtcbiAgICBpZihpbnN0YW5jZSA9PSBvcGVuZWRJbnN0YW5jZSkge1xuICAgICAgb3B0aW9ucy5vbkNsb3NlKGluc3RhbmNlKVxuICAgIH1cbiAgfSlcblxuICAvLyBNb3ZlIHRoZSBlbGVtZW50IHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IChwcmV2ZW50IGFueSB6LWluZGV4IGlzc3VlcylcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbEVsKVxuXG4gIC8vIEV4cG9zZSB0aGUgbW9kYWwgaW5zdGFuY2UgY29udHJvbGxlclxuICByZXR1cm4gaW5zdGFuY2U7XG5cbn1cblxuXG4vKipcbiAqXG4gKiBDcmVhdGUgYSBtb2RhbCB3aXRoIGEgdmlkZW8gcGxheWVyIGluc2lkZVxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1vZGFsRWwgLSBNb2RhbCBET00gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IHBsYXllclNlbGVjdG9yIC0gUXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBwbGF5ZXIgaW5zaWRlIHRoZSBtb2RhbFxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2JqZWN0LCB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHZpZGVvIG1vZGFsIGJlaGF2aW91clxuICogXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBpbnN0YW5jZSAtIE1vZGFsIGluc3RhbmNlIHdpdGggYW4gYXR0YWNoZWQgdmlkZW8gc2VydmljZSBjb250cm9sbGVyXG4gKiBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFZpZGVvTW9kYWwobW9kYWxFbCwgcGxheWVyU2VsZWN0b3IsIGNvbmZpZyA9IHt9KSB7XG5cbiAgaWYoIW1vZGFsRWwgfHwgIW1vZGFsRWwubm9kZVR5cGUpIHtcbiAgICBjb25zb2xlLmxvZygnWW91IG11c3QgcHJvdmlkZSBhIERPTSBlbGVtZW50IHRvIGBpbml0VmlkZW9Nb2RhbGAnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwbGF5ZXJFbCA9IG1vZGFsRWwucXVlcnlTZWxlY3RvcihwbGF5ZXJTZWxlY3Rvcik7XG4gIGNvbnN0IHNlcnZpY2UgPSBjcmVhdGVWaWRlb0lmcmFtZShwbGF5ZXJFbCk7XG5cbiAgLy8gQnkgZGVmYXVsdCwgbWFrZSB0aGUgcGxheWVyIHBsYXkgd2hlbiB0aGUgbW9kYWwgb3BlbnNcbiAgLy8gQW5kIHN0b3Agd2hlbiBpdCBjbG9zZXNcbiAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICBvbk9wZW4oKSB7XG4gICAgICBzZXJ2aWNlLnBsYXkoKTtcbiAgICB9LFxuICAgIG9uQ2xvc2UoKXtcbiAgICAgIHNlcnZpY2Uuc3RvcCgpO1xuICAgIH1cbiAgfSwgY29uZmlnKVxuICBcbiAgY29uc3QgaW5zdGFuY2UgPSBpbml0TW9kYWwobW9kYWxFbCwgb3B0aW9ucylcbiAgaW5zdGFuY2Uuc2VydmljZSA9IHNlcnZpY2UgLy8gQXNzaWduIHRoZSB2aWRlbyBzZXJ2aWNlIHRvIHRoZSBtb2RhbCBpbnN0YW5jZVxuXG4gIC8vIEV4cG9zZSB0aGUgbW9kYWwgaW5zdGFuY2UgY29udHJvbGxlclxuICByZXR1cm4gaW5zdGFuY2U7XG59IiwiLyoqXG4gKlxuICogQ3VzdG9tIE1vZGVybml6ciBUZXN0c1xuICpcbiAqL1xuXG5pbXBvcnQgeyBpc01vYmlsZSB9IGZyb20gJy4vdXRpbHMnXG5cbmZ1bmN0aW9uIG1hdGNoZXNJRSgpIHtcbiAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKD86bXN8XFwoKShpZSlcXHMoW1xcd1xcLl0rKS9pKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc0lFMTEoKSB7XG4gIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyh0cmlkZW50KS4rcnZbOlxcc10oW1xcd1xcLl0rKS4rbGlrZVxcc2dlY2tvL2kpO1xufVxuXG5Nb2Rlcm5penIuYWRkVGVzdCgnaWUnLCAoKSA9PiB7XG4gIHJldHVybiBtYXRjaGVzSUUxMSgpIHx8IG1hdGNoZXNJRSgpXG59KVxuXG5Nb2Rlcm5penIuYWRkVGVzdCgnaWUxMScsIG1hdGNoZXNJRTExKVxuXG5Nb2Rlcm5penIuYWRkVGVzdCgnbW9iaWxlJywgaXNNb2JpbGUpIiwiLyoqXG4gKlxuICogUG9seWZpbGxzXG4gKlxuICogSW5jbHVkaW5nIHRoaXMgbW9kdWxlIHdpbGwgYXV0b21hdGljYWxseSBjYWxsIGFsbCBzcGVjaWZpZWQgcG9seWZpbGxzXG4gKiBcbiAqL1xuXG5cbmltcG9ydCAnaW5wdXQtcGxhY2Vob2xkZXItcG9seWZpbGwnOyAvLyBSZXF1aXJlZCBmb3Igb2xkZXIgSUVcbmltcG9ydCB2dUJ1Z2d5ZmlsbCBmcm9tICd2aWV3cG9ydC11bml0cy1idWdneWZpbGwnIC8vIFJlcXVpcmVkIGZvciBJT1MgZGV2aWNlc1xuaW1wb3J0IFByb21pc2UgZnJvbSAncHJvbWlzZS1wb2x5ZmlsbCc7IC8vIFJlcXVpcmVkIGZvciBJRVxuaW1wb3J0ICd3aGF0d2ctZmV0Y2gnIC8vIFJlcXVpcmVkIGZvciBJRSAmIFNhZmFyaVxuaW1wb3J0IG9iamVjdEFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJyAvLyBSZXF1aXJlZCBmb3IgSUVcblxuLy8gQXNzaWduIHRvIHRoZSBPYmplY3QgY29uc3RydWN0b3JcbmlmKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5hc3NpZ24gPSBvYmplY3RBc3NpZ25cbn1cblxuLy8gQXNzaWduIFByb21pc2UgdG8gd2luZG93LCBpZiBub3QgZGVmaW5lZFxuaWYgKCF3aW5kb3cuUHJvbWlzZSkge1xuICB3aW5kb3cuUHJvbWlzZSA9IFByb21pc2U7XG59XG5cbi8vIFBhdGNoIEJ1Z2d5IFZpZXdwb3J0IHVuaXRzIG9uIElPUyBkZXZpY2VzXG52dUJ1Z2d5ZmlsbC5pbml0KClcblxuLyoqXG4gKlxuICogRGF0YXNldCBQb2x5ZmlsbFxuICpcbiAqIEVsZW1lbnQuZGF0YXNldCBwb2x5ZmlsbCBmb3IgSUUxMC1cbiAqXG4gKi9cblxuZnVuY3Rpb24gZGF0YXNldCgpIHtcblxuICBpZiAoISgnZGF0YXNldCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKSAmJlxuICAgICAgJ0VsZW1lbnQnIGluIGdsb2JhbCAmJiBFbGVtZW50LnByb3RvdHlwZSAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdkYXRhc2V0JywgeyBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCBhdHRyID0gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBpZiAoYXR0ci5zcGVjaWZpZWQgJiYgYXR0ci5uYW1lLnN1YnN0cmluZygwLCA1KSA9PT0gJ2RhdGEtJykge1xuICAgICAgICAgIChmdW5jdGlvbihlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IG5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgZnVuY3Rpb24obSwgcCkge1xuICAgICAgICAgICAgICByZXR1cm4gcC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgbmFtZSk7IC8vIFJlYWQtb25seSwgZm9yIElFOC1cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIHByb3AsIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIG5hbWUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgIH0odGhpcywgYXR0ci5uYW1lLnN1YnN0cmluZyg1KSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH19KTtcbiAgfVxuXG59XG5cbi8vIEFkZCBjcm9zcyBicm93c2VyIHN1cHBvcnQgZm9yIGRhdGFzZXRcbmRhdGFzZXQoKVxuXG4iLCIvKipcbiAqXG4gKiBET00gYmFzZWQgcm91dGVyXG4gKlxuICogRmlyZXMgd2hlbiBjbGFzcyBvbiBlbGVtZW50LCBtYXRjaGVzIHRoZSBuYW1lIG9mIGFueSBtZXRob2QuXG4gKiBSb3V0ZXIgYWxzbyBhZGRzIGEgJ2NvbW1vbicgY2FsbCBmb3IgSlMgdGhhdCBmaXJlcyBvbiBhbnkgcGFnZS5cbiAqIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubGV0IG5hbWVzcGFjZTsgIFxubGV0IGZpcmUgPSAoZnVuYykgPT4ge1xuICBpZiAoZnVuYyAhPT0gJycgJiYgbmFtZXNwYWNlW2Z1bmNdICYmIHR5cGVvZiBuYW1lc3BhY2VbZnVuY10gPT0gJ2Z1bmN0aW9uJyl7XG4gICAgbmFtZXNwYWNlW2Z1bmNdKCk7XG4gIH1cbn1cblxubGV0IGxvYWRFdmVudHMgPSAoKSA9PiB7XG5cbiAgLy8gaGl0IHVwIGNvbW1vbiBmaXJzdC5cbiAgZmlyZSgnY29tbW9uJyk7XG5cbiAgLy8gZG8gYWxsIHRoZSBjbGFzc2VzIHRvby5cbiAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWVcbiAgICAucmVwbGFjZSgvLS9nLCAnXycpXG4gICAgLnNwbGl0KC9cXHMrLylcbiAgICAuZm9yRWFjaCgoY2xhc3NubSkgPT4ge1xuICAgICAgZmlyZShjbGFzc25tKTtcbiAgICB9KTtcblxufVxuXG5jb25zdCByb3V0ZXIgPSBmdW5jdGlvbihyb3V0ZXMpe1xuICBuYW1lc3BhY2UgPSByb3V0ZXM7XG4gIGxvYWRFdmVudHMoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcblxuIiwiLyoqIFxuKlxuKiBUb2dnbGVcbiogXG4qIFRvZ2dsZXMgdGFyZ2V0IGVsZW1lbnQgYWN0aXZlIGNsYXNzXG4qXG4qIFVzYWdlOlxuKlxuKiA8YnV0dG9uIGNsYXNzPVwie3NlbGVjdG9yfVwiIGRhdGEtdGFyZ2V0PVwiI3RvZ2dsZS10YXJnZXRcIiBkYXRhLXRvZ2dsZT5Ub2dnbGU8L2J1dHRvbj5cbiogPGRpdiBpZD1cInRvZ2dsZS10YXJnZXRcIj5Ub2dnbGUgVGFyZ2V0PC9kaXY+XG4qIFxuKi9cblxuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnXG5pbXBvcnQgeyBjb2xsZWN0aW9uLCBkZWxlZ2F0ZSB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdpcy1hY3RpdmUnXG5cbi8qKlxuICpcbiAqIEdldCBhbGwgZWxlbWVudHMgcmVsYXRlZCB0byBwYXJ0aWN1bGFyIHRvZ2dsZSBlbGVtZW50XG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBlbGVtZW50cyAtIEVsZW1lbnRzIG9iamVjdFxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IGVsZW1lbnRzLmNsaWNrZWRUb2dnbGUgLSBDdXJyZW50IHRvZ2dsZSBlbGVtZW50XG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gZWxlbWVudHMudGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgY3VycmVudCB0b2dnbGUgZWxlbWVudFxuICogQHJldHVybiB7QXJyYXl9IGVsZW1lbnRzLnRhcmdldEFuZFRvZ2dsZXMgLSBBbiBhcnJheSBvZiBhbGwgdG9nZ2xlIGVsZW1lbnRzIGZvciBhIHBhcnRpY3VsYXIgdGFyZ2V0LFxuICogY29uY2F0ZW5hdGVkIHdpdGggc2FpZCB0YXJnZXRcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBlbGVtZW50cy5ncm91cCAtIFRoZSBncm91cCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBhbmQgcG9zc2libHkgb3RoZXIgdG9nZ2xlIHRhcmdldHMgd2l0aCBkaWZmZXJlbnQgXG4gKiB0b2dnbGUgZWxlbWVudHMsIGZvciBjb2xsYXBzaW5nIGFueSByZWxhdGVkIHNpYmxpbmdzIHdpdGhpbiB0aGUgc2FtZSBncm91cFxuICogXG4gKi9cblxuZnVuY3Rpb24gZ2V0RWxlbWVudHMoZWwpIHtcblxuICBjb25zdCBkYXRhVGFyZ2V0ID0gZWwuZGF0YXNldC50YXJnZXRcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihkYXRhVGFyZ2V0KVxuICBjb25zdCB0YXJnZXRUb2dnbGVzID0gY29sbGVjdGlvbignW2RhdGEtdGFyZ2V0PVwiJyArIGRhdGFUYXJnZXQgKyAnXCJdJylcbiAgXG4gIHJldHVybiB7XG4gICAgY2xpY2tlZFRvZ2dsZTogZWwsXG4gICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgdGFyZ2V0QW5kVG9nZ2xlczogdGFyZ2V0VG9nZ2xlcy5jb25jYXQodGFyZ2V0KSxcbiAgICBncm91cDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbC5kYXRhc2V0Lmdyb3VwKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgZnJvbSBhbnkgb3RoZXIgdGFyZ2V0ICYgdG9nZ2xlcyB3aXRoaW4gdGhlIHNhbWUgZ3JvdXAsIGV4Y2x1ZGluZyBhIGN1cnJlbnQgdGFyZ2V0XG4gKiBcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBncm91cCAtIFRoZSBncm91cCBlbGVtZW50XG4gKiBAcGFyYW0gIHtTdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHRvZ2dsZSBzZWxlY3RvciBmb3IgdGhlIGN1cnJlbnQgdG9nZ2xlVGFyZ2V0IGluc3RhbmNlXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gY3VycmVudEVsZW1lbnQgLSBDdXJyZW50bHkgYWN0aXZlIHRvZ2dsZSwgYW55IGVsZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgc2FtZSBbZGF0YS10YXJnZXRdXG4gKiBhdHRyaWJ1dGUgdmFsdWUgYXMgdGhpcyBlbGVtZW50LCB3aWxsIGJlIGZpbHRlcmVkIG91dCBmcm9tIHRoaXMgZnVuY3Rpb25cbiAqIFxuICogQHJldHVybiB7bnVsbH0gXG4gKi9cbmZ1bmN0aW9uIGhpZGVPdGhlcnMoZ3JvdXAsIHNlbGVjdG9yLCBjdXJyZW50RWxlbWVudCkge1xuXG4gIGNvbGxlY3Rpb24oZ3JvdXAucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXG4gICAgLmZpbHRlcihlbCA9PiBlbC5kYXRhc2V0LnRhcmdldCAhPT0gY3VycmVudEVsZW1lbnQuZGF0YXNldC50YXJnZXQpXG4gICAgLm1hcChlbCA9PiB7XG5cbiAgICAgIGdldEVsZW1lbnRzKGVsKVxuICAgICAgICAudGFyZ2V0QW5kVG9nZ2xlc1xuICAgICAgICAubWFwKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoQUNUSVZFX0NMQVNTKSlcblxuICAgIH0pXG5cbn1cblxuXG4vKipcbiAqXG4gKiBJbml0aWFsaXplIHRoZSB0b2dnbGUgVGFyZ2V0IGZvciBhIGdpdmVuIHNlbGVjdG9yXG4gKlxuICogLSBUaGUgc2VsZWN0b3IgcmVwcmVzZW50cyB0aGUgdG9nZ2xlIGVsZW1lbnQsIHVzZWQgdG8gaGlkZSBvciBzaG93IGEgY2VydGFpbiB0YXJnZXRcbiAqIC0gVGhlIHRvZ2dsZSBlbGVtZW50IG11c3QgaGF2ZSBhIGBkYXRhLXRhcmdldGAgYXR0cmlidXRlLCByZWZlcmVuY2luZyBhIHVuaXF1ZSBlbGVtZW50IG9uIHRoZSBwYWdlIHRvIGJlIHRvZ2dsZWRcbiAqIE1ha2Ugc3VyZSB0byB1c2UgYW4gSUQgZm9yIHRoZSB0YXJnZXRcbiAqIC0gVGhlIHRvZ2dsZSBlbGVtZW50IGNhbiBoYXZlIGFuIG9wdGlvbmFsIGBkYXRhLXRvZ2dsZWAgYXR0cmlidXRlLCB3aGljaCB3aWxsIG1ha2UgdGhlIGJ1dHRvbiB0b2dnbGUgdGhlIHRhcmdldCBPTi9PRkZcbiAqIElmIHRoZSBhdHRyaWJ1dGUgaXMgbm90IGRlZmluZWQsIHRoZSBidXR0b24gd2lsbCBvbmx5IHRvZ2dsZSBpdCdzIHRhcmdldCBPTi5cbiAqIFxuICogQHBhcmFtICB7U3RyaW5nfSBzZWxlY3RvciAtIHNlbGVjdG9yIGZvciB0aGUgdG9nZ2xlIGVsZW1lbnRcbiAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnIC0gQ29uZmlndXJhdGlvbiBPYmplY3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjb25maWcub25Ub2dnbGVDbG9zZSAtIEZpcmVzIHdoZW4gdGhlIHRvZ2dsZSBnZXRzIGNsb3NlZCwgZ2V0cyBwYXNzZWQgYW4gb2JqZWN0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmluZyB0aGUgY3VycmVudCB0b2dnbGUgZWxlbWVudHNcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjb25maWcub25Ub2dnbGVPcGVuIC0gRmlyZXMgd2hlbiB0aGUgdG9nZ2xlIGdldHMgb3BlbmVkLCBnZXRzIHBhc3NlZCBhbiBvYmplY3RcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluaW5nIHRoZSBjdXJyZW50IHRvZ2dsZSBlbGVtZW50cyBcbiAqIEByZXR1cm4ge09iamVjdH0gVG9nZ2xlIENvbnRyb2xsZXIgb2JqZWN0XG4gKiBcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2dnbGVUYXJnZXQoc2VsZWN0b3IsIGNvbmZpZyA9IHt9KSB7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICBvblRvZ2dsZU9wZW4oKSB7fSxcbiAgICBvblRvZ2dsZUNsb3NlKCkge30sXG4gIH0sIGNvbmZpZylcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGVnYXRlKHNlbGVjdG9yLCBlID0+IHtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGVscyA9IGdldEVsZW1lbnRzKGUudGFyZ2V0KVxuICAgIGNvbnN0IHsgdGFyZ2V0LCB0YXJnZXRBbmRUb2dnbGVzLCBncm91cCB9ID0gZWxzXG4gICAgY29uc3Qgc2hvdWxkVG9nZ2xlID0gZS50YXJnZXQuZGF0YXNldC50b2dnbGUgPT0gJ3RydWUnXG5cbiAgICBpZih0YXJnZXQpIHtcblxuICAgICAgY29uc3QgaXNBY3RpdmUgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUylcblxuICAgICAgaWYoc2hvdWxkVG9nZ2xlICYmIGlzQWN0aXZlKSB7XG5cbiAgICAgICAgdGFyZ2V0QW5kVG9nZ2xlcy5tYXAoZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkVfQ0xBU1MpKVxuICAgICAgICBvcHRpb25zLm9uVG9nZ2xlQ2xvc2UoZWxzKVxuICAgICAgICBFdmVudEJ1cy5wdWJsaXNoKCd0b2dnbGUtdGFyZ2V0OmNsb3NlJywgZWxzKVxuXG4gICAgICB9IFxuXG4gICAgICBpZighaXNBY3RpdmUpIHtcblxuICAgICAgICB0YXJnZXRBbmRUb2dnbGVzLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKEFDVElWRV9DTEFTUykpXG4gICAgICAgIG9wdGlvbnMub25Ub2dnbGVPcGVuKGVscylcbiAgICAgICAgRXZlbnRCdXMucHVibGlzaCgndG9nZ2xlLXRhcmdldDpvcGVuJywgZWxzKVxuXG4gICAgICB9XG5cbiAgICAgIGlmKGdyb3VwKSB7XG4gICAgICAgIGhpZGVPdGhlcnMoZ3JvdXAsIHNlbGVjdG9yLCBlLnRhcmdldClcbiAgICAgIH1cblxuICAgIH1cblxuICB9KSlcblxuICBjb25zdCBhbGxUYXJnZXRBbmRUb2dnbGVzID0gY29sbGVjdGlvbihzZWxlY3RvcilcbiAgICAubWFwKGVsID0+IGdldEVsZW1lbnRzKGVsKS50YXJnZXRBbmRUb2dnbGVzKVxuXG5cbiAgLy8gQ29udHJvbGxlciBPYmplY3RcbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmcm9tIGFsbCB0b2dnbGVzIGluIHRoZSBpbnN0YW5jZVxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge251bGx9XG4gICAgICovXG4gICAgY2xvc2VBbGwoKSB7XG4gICAgICBhbGxUYXJnZXRBbmRUb2dnbGVzLm1hcChlbHMgPT4ge1xuICAgICAgICBlbHMubWFwKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoQUNUSVZFX0NMQVNTKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbn0iLCIvKipcbiAqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uc1xuICpcbiAqIEtlZXAgdGhlc2UgZnVuY3Rpb25zIGFzIHB1cmUgYXMgcG9zc2libGUgKGllOiBpbnB1dCAtPiBvdXRwdXQgKS5cbiAqIFlvdSBjYW4gdXNlIGdsb2JhbGx5IGF2YWlsYWJsZSB2YXJpYWJsZXMgc3VjaCBhcyB3aW5kb3cgYW5kIGRvY3VtZW50LlxuICpcbiAqL1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGluQXJyYXkoaXRlbSwgYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgPiAtMVxufVxuXG4vKipcbiAqXG4gKiBDcmVhdGUgYSBuZXcgRE9NIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnbmFtZSAtIEVsZW1lbnQgdGFnbmFtZSAoJ2lmcmFtZScsICdkaXYnKVxuICogQHBhcmFtIHtvYmplY3R9IGF0dHJpYnV0ZXMgLSBPYmplY3Qgb2YgYXR0cmlidXRlcyB0byBiZSBhc3NpZ25lZCB0byB0aGUgb2JqZWN0LlxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBUaGUgRE9NIGVsZW1lbnRcbiAqXG4gKi9cblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWduYW1lLCBhdHRyaWJ1dGVzID0ge30pIHtcbiAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWduYW1lKVxuXG4gIGlmKGVsLnNldEF0dHJpYnV0ZSkge1xuICAgIGZvciAodmFyIGsgaW4gIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShrLCBhdHRyaWJ1dGVzW2tdKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbFxufVxuXG5cbi8qKlxuICpcbiAqIEVsZW1lbnQubWF0Y2hlcyBwb2x5ZmlsbFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gRE9NIGVsZW1lbnQgdG8gY2hlY2sgc2VsZWN0b3IgYWdhaW5zdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gU2VsZWN0b3Igc3RyaW5nIHRvIHVzZSBmb3IgbWF0Y2hpbmdcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgc2VsZWN0b3IgbWF0Y2hlcyBvciBub3QuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdG9yTWF0Y2hlcyhlbCwgc2VsZWN0b3IpIHtcbiAgbGV0IHAgPSBFbGVtZW50LnByb3RvdHlwZVxuICBsZXQgZm4gPSBwLm1hdGNoZXMgfHwgcC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgcC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgcC5tc01hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIFtdLmluZGV4T2YuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHMpLCB0aGlzKSAhPT0gLTFcbiAgfVxuICByZXR1cm4gZm4uY2FsbChlbCwgc2VsZWN0b3IpXG59XG5cbi8qKlxuICpcbiAqIFJldHVybiB0aGUgZmlyc3QgbWF0Y2hlZCBlbGVtZW50IGJ5IHByb3ZpZGVkIHNlbGVjdG9yLCB0cmF2ZXJzaW5nIGZyb20gY3VycmVudCBlbGVtZW50IHRvIGRvY3VtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gRWxlbWVudCB0byBmaW5kIGNsb3Nlc3QgZWxlbWVudCB0byBcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIFNlbGVjdG9yIHRvIHVzZSBmb3IgbWF0Y2hpbmdcbiAqXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudHxudWxsfSAtIFRoZSBtYXRjaGluZyBjbG9zZXN0IGVsZW1lbnQgb3IgbnVsbFxuICogXG4gKi9cblxuZnVuY3Rpb24gY2xvc2VzdChlbCwgc2VsZWN0b3IpIHtcblxuICB3aGlsZSAoZWwpIHtcbiAgICBpZiAoc2VsZWN0b3JNYXRjaGVzKGVsLCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKlxuICogIFRodW5rIGZ1bmN0aW9uIGZvciBldmVudCBkZWxlZ2F0aW9uIHVzaW5nIGBhZGRFdmVudExpc3RlbmVyYFxuICpcbiAqICBVc2FnZTpcbiAqXG4gKiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGVnYXRlKHNlbGVjdG9yLCBlID0+IHtcbiAqICBcbiAqICAgIC8vIHlvdXIgY2FsbGJhY2tcbiAqXG4gKiAgfSkpXG4gKlxuICogIEBwYXJhbSB7c3RyaW5nfSBkZWxlZ2F0ZSAtIFNlbGVjdG9yIHN0cmluZyB0byB1c2UgZm9yIGRlbGVnYXRpb25cbiAqICBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gRXZlbnQgaGFuZGxlciBmdW5jdGlvblxuICpcbiAqICBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBoYW5kbGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG5cbiAgICBjb25zdCBjbG9zZXN0RWwgPSBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvcilcblxuICAgIGlmKGNsb3Nlc3RFbCkge1xuICAgICAgaGFuZGxlci5jYWxsKGNsb3Nlc3RFbCwgZSlcbiAgICB9XG5cbiAgfVxufVxuXG4vKipcbiAqICAgUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICogICBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiAgIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICogICBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgbGV0IHRpbWVvdXRcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50c1xuICAgIGxldCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGltZW91dCA9IG51bGxcbiAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgfVxuXG4gICAgbGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXRcbiAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdClcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICB9XG59XG5cblxuXG4vKipcbiAqXG4gKiBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyB0cmFuc2l0aW9uZW5kIGV2ZW50LlxuICogXG4gKiBAcmV0dXJucyB7c3RyaW5nfGZhbHNlfSBUaGUgcHJlZml4ZWQgKG9yIHVucHJlZml4ZWQpIHN1cHBvcnRlZCBldmVudCBuYW1lIFxuICogICAgICAgICAgICAgICAgICAgICAgICAgb3IgZmFsc2UgaWYgaXQgZG9lc24ndCBzdXBwb3J0IGFueS5cbiAqXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHdoaWNoVHJhbnNpdGlvbkVuZCgpIHtcblxuICBsZXQgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgTW96VHJhbnNpdGlvbiAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICBPVHJhbnNpdGlvbiAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gIH1cblxuICBmb3IgKGxldCBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgIGlmIChkb2N1bWVudC5ib2R5LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKlxuICogQ292ZXJ0IE9iamVjdCBpbnRvIFVSTCBwYXJhbWV0ZXJzXG4gKlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVPYmplY3Qob2JqKSB7XG5cbiAgbGV0IHN0ciA9ICcnXG5cbiAgZm9yIChsZXQgayBpbiBvYmopIHtcbiAgICBpZiAoc3RyICE9ICcnKSB7XG4gICAgICBzdHIgKz0gJyYnXG4gICAgfVxuXG4gICAgc3RyICs9IGsgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tdKTtcbiAgfVxuXG4gIHJldHVybiBzdHJcbn1cblxuLyoqXG4gKlxuICogQ29udmVydCBVUkwgcGFyYW1ldGVycyB0byBvYmplY3RcbiAqXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RVUkxQYXJhbWV0ZXJzKHN0cikge1xuXG4gIGxldCBvYmogPSB7fVxuXG4gIGlmKGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaCkge1xuICAgIGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaFxuICAgICAgLnJlcGxhY2UoLyheXFw/KS8sJycpXG4gICAgICAuc3BsaXQoJyYnKVxuICAgICAgLm1hcChuID0+IHtcbiAgICAgICAgY29uc3QgcGFyID0gbi5zcGxpdCgnPScpXG4gICAgICAgIG9ialtwYXJbMF1dID0gcGFyWzFdXG4gICAgICB9KVxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuXG4vKipcbiAqXG4gKiBVc2VyIGFnZW50IG1hdGNoaW5nIGZvciBJT1Mgb3IgQW5kcm9pZCBkZXZpY2VzXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IElmIHRoZSBVQSBtYXRjaGVzIGZvciBJT1Mgb3IgQW5kcm9pZFxuICogXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSU9Tb3JBbmRyb2lkKCkge1xuICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZHxpUGhvbmV8aVBvZHxBbmRyb2lkL2kpXG59XG5cbi8qKlxuICpcbiAqIFVzZXIgYWdlbnQgbWF0Y2hpbmcgZm9yIG1vYmlsZSBkZXZpY2VzXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IElmIHRoZSBVQSBtYXRjaGVzIGZvciBhIG1vYmlsZSBkZXZpY2VcbiAqIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZSgpIHtcbiAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaSlcbn1cblxuXG4vKipcbiAqXG4gKiBHZXQgdGhlIHZhbHVlIGZvciB0aGUgc2Nyb2xsWSB3aW5kb3cgcG9zaXRpb24uIFxuICpcbiAqIE5vdGU6IEdldHRpbmcgd2luZG93LnBhZ2VZT2Zmc2V0IG9yIHdpbmRvdy5zY3JvbGxZIGNhdXNlcyBsYXlvdXQgcmVmbG93LlxuICogQnkgY2FjaGluZyB0aGUgdmFsdWUgd2UgbWluaW1pemUgdGhpcy5cbiAqIFxuICogQHJldHVybnMge2ludH0gQ3VycmVudCBZIHNjcm9sbCBkaXN0YW5jZVxuICogXG4gKi9cblxubGV0IGF0dGFjaGVkU2Nyb2xsWSA9IGZhbHNlXG5sZXQgc2Nyb2xsUG9zID0gd2luZG93LnBhZ2VZT2Zmc2V0XG5cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxZKCkge1xuXG4gIGlmKCFhdHRhY2hlZFNjcm9sbFkpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZSA9PiB7XG4gICAgICBzY3JvbGxQb3MgPSB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICB9KVxuXG4gICAgYXR0YWNoZWRTY3JvbGxZID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIHNjcm9sbFBvc1xufVxuXG5cbi8qKlxuICpcbiAqIENvbGxlY3Rpb25cbiAqXG4gKiBJbnRlcmZhY2UgZm9yIHF1ZXJ5U2VsZWN0b3JBbGwsIHJldHVybmluZyBhbiBhcnJheSBvZiBlbGVtZW50cywgaW5zdGVhZCBvZiBhIG5vZGVMaXN0IFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfE5vZGVMaXN0fSBzZWxlY3Rvck9yTm9kZUxpc3QgLSBFaXRoZXIgYSBzZWxlY3RvciBzdHJpbmcgb3IgYSBub2RlTGlzdFxuICogQHJldHVybiB7YXJyYXl9IEFycmF5IG9mIERPTSBlbGVtZW50c1xuICogXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3Rpb24oc2VsZWN0b3JPck5vZGVMaXN0KSB7XG5cbiAgY29uc3QgYXJyID0gW11cblxuICBsZXQgbm9kZUxpc3RcblxuICBpZiAoc2VsZWN0b3JPck5vZGVMaXN0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICBub2RlTGlzdCA9IHNlbGVjdG9yT3JOb2RlTGlzdFxuICB9IGVsc2UgaWYodHlwZW9mIHNlbGVjdG9yT3JOb2RlTGlzdCA9PSAnc3RyaW5nJykge1xuICAgIG5vZGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvck9yTm9kZUxpc3QpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgZm9yKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZUxpc3RbaV1cbiAgfVxuXG4gIHJldHVybiBhcnJcblxufVxuXG5cbi8qKlxuKlxuKiBHZXQgQnJlYWtwb2ludHMgT2JqZWN0XG4qXG4qIFRoaXMgaXMgYSBjdXN0b20gdGVjaG5pcXVlIHRvIGdhaW4gYWNjZXNzIHRvIG91ciBTQ1NTIGRlZmluZWQgbWVkaWEgcXVlcnkgYnJlYWtwb2ludHMgXG4qIGluIEpTLlxuKlxuKiBUbyBnZXQgdGhlIHRlY2huaXF1ZSB3b3JraW5nIHlvdSBuZWVkIHRoZSBmb2xsb3dpbmc6XG4qXG4qIDEuIERlZmluZSBhIGAkYnAtYXJyYXlgIHZhcmlhYmxlIGluIHlvdXIgU0NTUywgd2l0aCB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiogICAgXG4qICAgJGJwLWFycmF5ICA6ICd7XCJ4c1wiOiBcIiN7JGJwLXhzfVwiIH0nO1xuKlxuKiAyLiBUbyBtYWtlIGl0IHRoZSB2YWx1ZSBhY2Nlc3NpYmxlIGZyb20gSlMsIHdlIGF0dGFjaCB0aGF0IHByb3BlcnR5IGFzXG4qICAgIHRoZSBmb250IHNpemUgb2YgdGhlIGRvY3VtZW50IGhlYWQuXG4qXG4qICBoZWFkIHtcbiogICBmb250LWZhbWlseTogJGJwLWFycmF5O1xuKiAgfVxuKiBcbiogXG4qIFRoaXMgZnVuY3Rpb24gd2lsbCB0YWtlIGNhcmUgb2YgcXVlcnlpbmcgYW5kIHBhcnNpbmcgdGhhdCB2YWx1ZSwgcmV0dXJuaW5nIGFuIG9iamVjdFxuKiB3aXRoIHRoZSBtZWRpYSBxdWVyeSB2YWx1ZXMgdGhhdCB5b3UgZGVmaW5lIG9uIHlvdXIgU0NTU1xuKlxuKlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJwT2JqKCkge1xuICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmhlYWQpWydmb250LWZhbWlseSddXG5cbiAgbGV0IGJwT2JqID0ge31cbiAgLy8gUmVtb3ZlIGFsbCB1bndhbnRlZCBjaGFyYWN0ZXIgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byBwYXJzZSB0aGlzIGFzIEpTT05cbiAgY29uc3QgYnBKU09OID0gc3R5bGUucmVwbGFjZSgvXlsnXCJdK3xcXHMrfFxcXFx8KDtcXHM/fSkrfFsnXCJdJC9nLFwiXCIpXG4gXG4gIHRyeSB7XG4gICAgYnBPYmogPSBKU09OLnBhcnNlKGJwSlNPTilcbiAgICBcbiAgICBmb3IobGV0IGsgaW4gYnBPYmopIHtcbiAgICAgIGlmKGJwT2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIGJwT2JqW2tdID0gcGFyc2VJbnQoYnBPYmpba10pXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoKGUpIHt9XG5cbiAgcmV0dXJuIGJwT2JqXG59IiwiLyoqXG4gKlxuICogVmlkZW8gSWZyYW1lXG4gKlxuICogU2V0dXAgdmlkZW8gaWZyYW1lcywgaW5zdGFudGFudGlhdGluZyBpdCdzIGNvcnJlc3BvbmRpbmcgcGxheWVyIGFwaSBcbiAqIGFuZCBleHRlcm5hbCBjdXN0b20gY29udHJvbHMuXG4gKlxuICogQW55IHNlcnZpY2Ugc3BlY2lmaWMgYXBpIGxvZ2ljIHNob3VsZCBiZSBhYnN0cmFjdGVkIHRvIGl0J3MgY29ycmVzcG9uZGluZyAndmlkZW9TZXJ2aWNlJ1xuICpcbiAqIElNUE9SVEFOVDogSU9TIGRldmljZXMgZG9uJ3QgYWxsb3cgeW91IHRvIHVzZSB0aGUgc2VydmljZSBBUEkgdG8gdHJpZ2dlciBwbGF5IG9uIHRoZSBpZnJhbWUuXG4gKiBJbnN0ZWFkLCBhbGxvdyB0aGUgdXNlciB0byBjbGljayBkaXJlY3RseSBvbiB0aGUgaWZyYW1lLCB3aGljaCB3aWxsIHdvcmsgZmluZS5cbiAqIFxuICovXG5cbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHNlcmlhbGl6ZU9iamVjdCwgZGVsZWdhdGUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJztcbmltcG9ydCBpbml0VmlkZW9TZXJ2aWNlIGZyb20gJy4vdmlkZW9TZXJ2aWNlJztcblxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ2lzLWFjdGl2ZSdcblxuLyoqXG4gKiBSZXR1cm5zIGEgdW5pcXVlIGlkIHdpdGhpbiB0aGlzIG1vZHVsZVxuICovXG5cbmxldCBpZCA9IDE7XG5mdW5jdGlvbiB1aWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5cbi8qKlxuICogXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBkaWZmZXJlbnQgc2VydmljZXMgXG4gKiB3ZSBzdXBwb3J0IGFuZCB0aGUgcGFyYW1ldGVycyBlYWNoIHNlcnZpY2UgcmVxdWlyZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYXllcklkIC0gSWQgb2YgdGhlIHBsYXllciBpZnJhbWUuXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBzZXJ2aWNlc0NvbmZpZyhwbGF5ZXJJZCkge1xuICBcbiAgLy8gQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIGVhY2ggdmlkZW8gc2VydmljZVxuICByZXR1cm4ge1xuICAgIHlvdXR1YmU6IHtcbiAgICAgIHVybDogJ2h0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBlbmFibGVqc2FwaTogMSxcbiAgICAgICAgcmVsOiAwLFxuICAgICAgICBhdXRvcGxheTogMCxcbiAgICAgICAgbW9kZXN0YnJhbmRpbmc6IDEsXG4gICAgICAgIGNvbnRyb2xzOiAxLFxuICAgICAgICBzaG93aW5mbzogMCxcbiAgICAgICAgd21vZGU6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHZxOiAnaGQ3MjAnXG4gICAgICB9XG4gICAgfSxcblxuICAgIHZpbWVvOiB7XG4gICAgICB1cmw6ICdodHRwOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8nLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGF1dG9wbGF5OiAwLFxuICAgICAgICBhcGk6IDEsXG4gICAgICAgIHBsYXllcl9pZDogcGxheWVySWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqXG4gKiBSZXR1cm5zIHRoZSBtYXJrdXAgZm9yIHRoZSBwbGF5ZXIgaWZyYW1lXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHNlcnZpY2UgLSBWYWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBzZXJ2aWNlIGtleSBmcm9tIGBzZXJ2aWNlc0NvbmZpZ2AuXG4gKiBAcGFyYW0ge3N0cmluZ30gdmlkZW9JZCAtIElkIG9mIHRoZSB2aWRlbyBwcm92aWRlZCBieSB0aGUgdmlkZW8gc2VydmljZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpZnJhbWVJZCAtIElkIG9mIHRoZSBpZnJhbWUgRE9NIGVsZW1lbnQuXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBnZXRJZnJhbWUoc2VydmljZSwgdmlkZW9JZCwgaWZyYW1lSWQpIHtcbiAgbGV0IHNyYyA9IHNlcnZpY2UudXJsICsgdmlkZW9JZCArICc/JyArIHNlcmlhbGl6ZU9iamVjdChzZXJ2aWNlLnBhcmFtcyk7XG5cbiAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScsIHtcbiAgICBpZDogaWZyYW1lSWQsXG4gICAgc3JjOiBzcmMsXG4gICAgZnJhbWVib3JkZXI6IDAsXG4gICAgYWxsb3dmdWxsc2NyZWVuOiB0cnVlXG4gIH0pXG59XG5cblxuLyoqXG4gKlxuICogQXR0YWNoZXMgZXZlbnQgbGlzdGVuZXIgZm9yIGFueSBleHRlcm5hbCBjb250cm9scyBmb3IgdGhlIHBsYXllciBcbiAqIChBIGN1c3RvbSBwbGF5IGJ1dHRvbiBmb3IgZXhhbXBsZSlcbiAqXG4gKiBQbGF5IGJ1dHRvbjogPGJ1dHRvbj4gZWxlbWVudCBtdXN0IGhhdmUgYSBgZGF0YS12aWRlby1wbGF5YCBhdHRyaWJ1dGVcbiAqIHRvIGluZGljYXRlIGl0J3MgYSBwbGF5IGJ1dHRvbiBhbmQgYSBgZGF0YS10YXJnZXRgIHdpdGggdGhlIGlkIG9mIHRoZSBgd3JhcHBlckVsYCBpZnJhbWVcbiAqIHdyYXBwZXIgdG8gYmUgdGFyZ2V0ZWQuXG4gKlxuICovXG5cbmxldCBjb250cm9sc0luaXRpYWxpemVkID0gZmFsc2U7XG5mdW5jdGlvbiBpbml0VmlkZW9Db250cm9scygpIHtcblxuICAvLyBPbmx5IHdhbnQgdG8gYXR0YWNoIHRoaXMgbGlzdGVuZXIgb25jZVxuICBpZighY29udHJvbHNJbml0aWFsaXplZCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGVsZWdhdGUoJ1tkYXRhLXZpZGVvLXBsYXldJywgZSA9PiB7XG5cbiAgICAgIGNvbnN0IGNsaWNrZWRFbCA9IGUudGFyZ2V0O1xuICAgICAgY29uc3Qgd3JhcHBlckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihjbGlja2VkRWwuZGF0YXNldC50YXJnZXQpO1xuXG4gICAgICAvLyBUaGUgd3JhcHBlciBlbGVtZW50IHNlcnZpY2Ugc2hvdWxkIGJlIGFzc2lnbmVkIHdoZW4gY2FsbGluZyBgY3JlYXRlVmlkZW9JZnJhbWVgXG4gICAgICBpZih3cmFwcGVyRWwgJiYgd3JhcHBlckVsLnNlcnZpY2VDb250cm9sbGVyKSB7XG4gICAgICAgIHdyYXBwZXJFbC5zZXJ2aWNlQ29udHJvbGxlci5wbGF5KClcbiAgICAgIH1cbiAgICAgIFxuICAgIH0pKVxuXG4gICAgY29udHJvbHNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxufVxuXG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgdGhlIHZpZGVvIGlmcmFtZSBwbGF5ZXIuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlckVsIC0gUm9vdCBlbGVtZW50IHdoZXJlIHRoZSBwbGF5ZXIgd2lsbCBiZSBpbnNlcnRlZC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IHNlcnZpY2VDb250cm9sbGVyIC0gc2VydmljZSB2aWRlbyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlVmlkZW9JZnJhbWUod3JhcHBlckVsKSB7XG5cbiAgaWYoIXdyYXBwZXJFbCB8fCAhd3JhcHBlckVsLm5vZGVUeXBlKSB7XG4gICAgY29uc29sZS5sb2coJ1lvdSBtdXN0IHByb3ZpZGUgYSBET00gZWxlbWVudCB0byBgY3JlYXRlVmlkZW9JZnJhbWVgJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IHdyYXBwZXJFbC5kYXRhc2V0O1xuICBjb25zdCB2aWRlb0lkID0gZGF0YS52aWRlb0lkO1xuICBjb25zdCBwbGF5ZXJJZCA9ICdpZnJhbWUtcGxheWVyLScgKyB1aWQoKTtcbiAgY29uc3Qgc2VydmljZUNvbmZpZyA9IHNlcnZpY2VzQ29uZmlnKHBsYXllcklkKVtkYXRhLnZpZGVvU2VydmljZV07XG5cbiAgaWYoIXNlcnZpY2VDb25maWcgfHwgIXZpZGVvSWQpIHtcbiAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciB3cmFwcGVyIG11c3QgaGF2ZSBcImRhdGEtdmlkZW8tc2VydmljZVwiIGFuZCBcImRhdGEtdmlkZW8taWRcIiBhdHRyaWJ1dGVzJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHBsYXllciBpZnJhbWUgdG8gdGhlIHdyYXBwZXIgXG4gIHdyYXBwZXJFbFxuICAgIC5hcHBlbmRDaGlsZChnZXRJZnJhbWUoc2VydmljZUNvbmZpZywgdmlkZW9JZCwgcGxheWVySWQpKVxuICBcbiAgY29uc3QgaWZyYW1lID0gd3JhcHBlckVsLnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZScpIC8vIFRoZW4gZ2V0IGl0XG4gIGNvbnN0IHNlcnZpY2VDb250cm9sbGVyID0gaW5pdFZpZGVvU2VydmljZShkYXRhLnZpZGVvU2VydmljZSwgaWZyYW1lKVxuXG4gIC8vIEN1c3RvbSBldmVudCBsaXN0ZW5lcnMsIHRyaWdnZXJlZCBieSB0aGUgcmVzcGVjdGl2ZSBzZXJ2aWNlIEFQSVxuICBFdmVudEJ1cy5zdWJzY3JpYmUoJ3ZpZGVvLXNlcnZpY2U6cGxheScsIChwbGF5ZXJJZnJhbWUpID0+IHtcbiAgICBpZihwbGF5ZXJJZnJhbWUuaWQgPT0gcGxheWVySWQpIHtcbiAgICAgIHdyYXBwZXJFbC5jbGFzc0xpc3QuYWRkKEFDVElWRV9DTEFTUylcbiAgICB9XG4gIH0pXG5cbiAgRXZlbnRCdXMuc3Vic2NyaWJlKCd2aWRlby1zZXJ2aWNlOmZpbmlzaCcsIChwbGF5ZXJJZnJhbWUpID0+IHtcbiAgICBpZihwbGF5ZXJJZnJhbWUuaWQgPT0gcGxheWVySWQpIHtcbiAgICAgIHdyYXBwZXJFbC5jbGFzc0xpc3QucmVtb3ZlKEFDVElWRV9DTEFTUylcbiAgICB9XG4gIH0pXG5cbiAgLy8gRXhwb3NlIHRoZSBzZXJ2aWNlIG9iamVjdCB0byB0aGUgb3V0c2lkZSBieSBhc3NpZ25pbmcgaXQgdG8gdGhlIHdyYXBwZXIgZWxlbWVudFxuICB3cmFwcGVyRWwuc2VydmljZUNvbnRyb2xsZXIgPSBzZXJ2aWNlQ29udHJvbGxlcjtcbiAgaW5pdFZpZGVvQ29udHJvbHMoKTtcblxuICByZXR1cm4gc2VydmljZUNvbnRyb2xsZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVZpZGVvSWZyYW1lO1xuIiwiLyoqXG4gKlxuICogVmlkZW8gU2VydmljZVxuICpcbiAqIExvZ2ljIHRvIHNldHVwIGRpZmZlcmVudCB2aWRlbyBpZnJhbWUgYXBpIHNlcnZpY2VzIChjdXJyZW50bHkgWW91dHViZSBhbmQgVmltZW8pXG4gKlxuICogSU1QT1JUQU5UOiBJT1MgZGV2aWNlcyBkb24ndCBhbGxvdyB5b3UgdG8gdXNlIHRoZSBzZXJ2aWNlIEFQSSB0byB0cmlnZ2VyIHBsYXkgb24gdGhlIGlmcmFtZS5cbiAqIEluc3RlYWQsIGFsbG93IHRoZSB1c2VyIHRvIGNsaWNrIGRpcmVjdGx5IG9uIHRoZSBpZnJhbSwgd2hpY2ggd2lsbCB3b3JrIGZpbmUuXG4gKiBcbiAqL1xuXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cyc7XG5pbXBvcnQgeyBsb2FkU2NyaXB0T25jZSB9IGZyb20gJy4vbG9hZCc7XG5cbmxldCBwbGF5ZXJPcmlnaW4gPSAnKic7XG5cbi8qKlxuICpcbiAqIEhlbHBlciBmdW5jdGlvbiBmb3Igc2VuZGluZyBhIG1lc3NhZ2UgdG8gdGhlIHZpbWVvIHBsYXllciwgdGFrZW4gZnJvbSB7QGxpbmsgVmltZW8gQVBJfVxuICoge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLnZpbWVvLmNvbS9wbGF5ZXIvanMtYXBpIFZpbWVvIEFQSX1cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIE5hbWUgb2YgdGhlIGFjdGlvbiB0byBiZSBwb3N0ZWQgdG8gdGhlIGlmcmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIGFjdGlvbiB0byBiZSBwb3N0ZWQgdG8gdGhlIGlmcmFtZVxuICogQHBhcmFtIHtIVE1MSUZyYW1lRWxlbWVudH0gcGxheWVySWZyYW1lIC0gSWZyYW1lIERPTSBlbGVtZW50IG9mIHRoZSBwbGF5ZXJcbiAqIFxuICovXG5cbmZ1bmN0aW9uIHBvc3RUb1ZpbWVvKGFjdGlvbiwgdmFsdWUsIHBsYXllcklmcmFtZSkge1xuXG4gIHZhciBkYXRhID0ge1xuICAgIG1ldGhvZDogYWN0aW9uXG4gIH07XG5cbiAgaWYodmFsdWUpIHtcbiAgICBkYXRhLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICB2YXIgbWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICBwbGF5ZXJJZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShtZXNzYWdlLCBwbGF5ZXJPcmlnaW4pO1xufVxuXG5cbi8qKlxuICpcbiAqIExpc3RlbiBmb3IgJ21lc3NhZ2UnIGV2ZW50cyBmcm9tIHRoZSBWSU1FTyBpZnJhbWUsIGFuZCBjYWxsIHRoZSBjb3JyZXNwb25kaW5nXG4gKiBoYW5kbGVyIGZyb20gYSBwcm92aWVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyAtIGluc3RhbmNlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBNdXN0IGhhdmUgdmFsaWQgbWV0aG9kc1xuICogICAgICAgICAgICAgICAgICAgICAgICBDb3JyZXNwb25kaW5nIHRvIHRoZSBWaW1lbyBBUEkgZXZlbnRzXG4gKiBAcGFyYW0ge0hUTUxJZnJhbWVFbGVtZW50fSBpZnJhbWUgLSBWaW1lbyBpZnJhbWUgdmlkZW8gcGxheWVyXG4gKlxuICovXG5cbmZ1bmN0aW9uIGluaXRWaW1lbyhjb25maWcsIGlmcmFtZSkge1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGUpID0+IHtcblxuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgIFxuICAgIC8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHRoZSB2aW1lbyBwbGF5ZXIgb25seVxuICAgIGlmICghKC9eaHR0cHM/OlxcL1xcL3BsYXllci52aW1lby5jb20vKS50ZXN0KGUub3JpZ2luKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gaWYgdGhlIG1lc3NhZ2UgaXMgbm90IGZyb20gdGhpcyBpZnJhbWVcbiAgICBpZihpZnJhbWUuaWQgIT09IGRhdGEucGxheWVyX2lkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHBsYXllck9yaWdpbiA9PT0gJyonKSB7XG4gICAgICBwbGF5ZXJPcmlnaW4gPSBlLm9yaWdpbjtcbiAgICB9XG5cbiAgICAvLyBFeGVjdXRlIHRoZSBoYW5kbGVyIGZvciB0aGlzIGV2ZW50LCBpZiBpdCdzIGEgdmFsaWQgZnVuY3Rpb25cbiAgICBpZih0eXBlb2YgY29uZmlnW2RhdGEuZXZlbnRdID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbmZpZ1tkYXRhLmV2ZW50XSgpXG4gICAgfVxuXG4gIH0sIGZhbHNlKTtcbn1cblxuXG4vKipcbiAqXG4gKiBZb3V0dWJlIGNhbGxzIHRoaXMgZnVuY3Rpb24gYXV0b21hdGljYWxseSBvbmNlIHRoZSBBUEkgaGFzIGxvYWRlZFxuICpcbiAqL1xuXG5jb25zdCB5b3V0dWJlQVBJUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICB3aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSAoKSA9PiB7XG4gICAgcmVzb2x2ZSgpO1xuICB9XG59KTtcblxuXG4vKipcbiAqXG4gKiBJbml0aWFsaXplIGEgdmlkZW8gc2VydmljZSBpbnN0YW5jZS4gUmV0dXJucyBhIGBzZXJ2aWNlQ29udHJvbGxlcmBcbiAqIG9iamVjdCBmb3IgbGlzdGVuaW5nIHRvIEFQSSBldmVudHMgIGFuZCBjb250cm9sbGluZyBwbGF5ZXIgd2l0aCBjdXN0b20gZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VOYW1lIC0gTmFtZSBvZiB0aGUgc2VydmljZSB0byBpbml0aWFsaXplXG4gKiBAcGFyYW0ge0hUTUxJZnJhbWVFbGVtZW50fSBpZnJhbWUgLSBJZnJhbWUgdmlkZW8gcGxheWVyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzZXJ2aWNlQ29udHJvbGxlciAtIHNlcnZpY2UgdmlkZW8gc2VydmljZSBjb250cm9sbGVyIGluc3RhbmNlLlxuICovXG5cbmZ1bmN0aW9uIGluaXRWaWRlb1NlcnZpY2Uoc2VydmljZU5hbWUsIGlmcmFtZSkge1xuXG4gIGxldCBzZXJ2aWNlUmVhZHkgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBFdmVudEJ1cy5zdWJzY3JpYmUoJ3ZpZGVvLXNlcnZpY2U6cmVhZHknLCAocmVhZHlTZXJ2aWNlLCBwbGF5ZXIpID0+IHtcbiAgICAgIGlmKHJlYWR5U2VydmljZSA9PSBzZXJ2aWNlTmFtZSkge1xuICAgICAgICByZXNvbHZlKHBsYXllcilcbiAgICAgIH1cbiAgICB9KVxuICB9KTtcblxuICAvLyBJbnN0YWNlIGNvbnRyb2xsZXJcbiAgbGV0IHNlcnZpY2VDb250cm9sbGVyID0ge31cblxuICAvLyBTaW5jZSBlYWNoIHNlcnZpY2UgaGFzIGEgdmVyeSBkaWZmZXJlbnQgQVBJLCBcbiAgLy8gV2UgaGF2ZSB0byBhc3NlbWJsZSB0aGUgYHNlcnZpY2VDb250cm9sbGVyYCBmb3IgZWFjaCB0eXBlXG4gIC8vIGluIGEgZGlmZmVyZW50IHdheSwgd2hpbGUgc3RpbGwgcHJvdmlkaW5nIGEgY29uc2lzdGVudCBpbnRlcmZhY2UuXG4gIHN3aXRjaCAoc2VydmljZU5hbWUpIHtcblxuICAgIGNhc2UgJ3ZpbWVvJzpcblxuICAgICAgLy8gQXNzaWduIHRoZSBjb250cm9scyBtZXRob2RzIGZvciB2aW1lb1xuICAgICAgc2VydmljZUNvbnRyb2xsZXIucGxheSA9ICgpID0+IHtcbiAgICAgICAgc2VydmljZVJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHBvc3RUb1ZpbWVvKCdwbGF5JywgbnVsbCwgaWZyYW1lKTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHNlcnZpY2VDb250cm9sbGVyLnN0b3AgPSAoKSA9PiB7XG4gICAgICAgIHNlcnZpY2VSZWFkeS50aGVuKCgpID0+IHtcbiAgICAgICAgICBwb3N0VG9WaW1lbygncGF1c2UnLCBudWxsLCBpZnJhbWUpO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpbml0VmltZW8oe1xuICAgICAgICByZWFkeSgpIHtcbiAgICAgICAgICAvLyBOZWVkIHRvIHRlbGwgVmltZW8gdGhhdCB3ZSB3YW50IHRvIGxpc3RlbiBmb3IgdGhpcyBldmVudHNcbiAgICAgICAgICBwb3N0VG9WaW1lbygnYWRkRXZlbnRMaXN0ZW5lcicsICdwbGF5JywgaWZyYW1lKTtcbiAgICAgICAgICBwb3N0VG9WaW1lbygnYWRkRXZlbnRMaXN0ZW5lcicsICdmaW5pc2gnLCBpZnJhbWUpO1xuXG4gICAgICAgICAgRXZlbnRCdXMucHVibGlzaCgndmlkZW8tc2VydmljZTpyZWFkeScsIHNlcnZpY2VOYW1lKVxuXG4gICAgICAgIH0sXG4gICAgICAgIHBsYXkoKSB7XG4gICAgICAgICAgRXZlbnRCdXMucHVibGlzaCgndmlkZW8tc2VydmljZTpwbGF5JywgaWZyYW1lKVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaCgpIHtcbiAgICAgICAgICBFdmVudEJ1cy5wdWJsaXNoKCd2aWRlby1zZXJ2aWNlOmZpbmlzaCcsIGlmcmFtZSlcbiAgICAgICAgfVxuICAgICAgfSwgaWZyYW1lKVxuICAgIGJyZWFrO1xuXG4gICAgY2FzZSAneW91dHViZSc6XG5cbiAgICAgIC8vIEFzc2lnbiBjb250cm9sIG1ldGhvZHMgZm9yIHlvdXR1YmVcbiAgICAgIHNlcnZpY2VDb250cm9sbGVyLnBsYXkgPSAoKSA9PiB7XG4gICAgICAgIHNlcnZpY2VSZWFkeS50aGVuKChwbGF5ZXIpID0+IHtcbiAgICAgICAgICBwbGF5ZXIucGxheVZpZGVvKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHNlcnZpY2VDb250cm9sbGVyLnN0b3AgPSAoKSA9PiB7XG4gICAgICAgIHNlcnZpY2VSZWFkeS50aGVuKChwbGF5ZXIpID0+IHtcbiAgICAgICAgICBwbGF5ZXIuc3RvcFZpZGVvKClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbG9hZFNjcmlwdE9uY2UoJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGknKTtcblxuICAgICAgeW91dHViZUFQSVByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFlULlBsYXllcihpZnJhbWUsIHtcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIG9uUmVhZHkoKSB7XG4gICAgICAgICAgICAgIEV2ZW50QnVzLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6cmVhZHknLCBzZXJ2aWNlTmFtZSwgcGxheWVyKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uU3RhdGVDaGFuZ2UoZSkge1xuICAgICAgICAgICAgICBpZihlLmRhdGEgPT0gMSkge1xuICAgICAgICAgICAgICAgIEV2ZW50QnVzLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6cGxheScsIGlmcmFtZSlcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmRhdGEgPT0gMCkge1xuICAgICAgICAgICAgICAgIEV2ZW50QnVzLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6ZmluaXNoJywgaWZyYW1lKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9KVxuXG4gICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gc2VydmljZUNvbnRyb2xsZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdFZpZGVvU2VydmljZSIsImltcG9ydCAnLi9tb2R1bGVzL3BvbHlmaWxscydcbmltcG9ydCAnLi9tb2R1bGVzL21vZGVybml6clRlc3RzJ1xuXG5pbXBvcnQgRmxpY2tpdHkgZnJvbSAnZmxpY2tpdHknXG5pbXBvcnQgc21vb3RoU2Nyb2xsIGZyb20gJ3Ntb290aC1zY3JvbGwnXG5cbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9tb2R1bGVzL3JvdXRlcidcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL21vZHVsZXMvRXZlbnRCdXMnXG5pbXBvcnQgeyBpbml0TW9kYWwsIGluaXRWaWRlb01vZGFsIH0gZnJvbSAnLi9tb2R1bGVzL21vZGFsJ1xuaW1wb3J0IHsgYWpheFN1Ym1pdEdmb3JtcyB9IGZyb20gJy4vbW9kdWxlcy9mb3JtJ1xuaW1wb3J0IHRvZ2dsZVRhcmdldCBmcm9tICcuL21vZHVsZXMvdG9nZ2xlVGFyZ2V0J1xuaW1wb3J0IHsga2V5RG93bkVzY2FwZSwgd2luZG93UmVzaXplZCB9IGZyb20gJy4vbW9kdWxlcy9nbG9iYWxFdmVudHMnXG5pbXBvcnQgeyBjb2xsZWN0aW9uLCBnZXRCcE9iaiB9IGZyb20gJy4vbW9kdWxlcy91dGlscydcblxuLy8gU3R1YiB0aGUgY29uc29sZSwgaWYgaXQgZG9lc24ndCBleGlzdFxud2luZG93LmNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSB8fCB7IGxvZygpIHt9IH0gXG5cbi8qLS0tLS0tLS0tLSAgQ29tbW9uIEZ1bmN0aW9uIERlZmluaXRpb25zICAtLS0tLS0tLS0tKi9cblxuXG4vKi0tLS0tLS0tLS0gIFNjcmlwdHMgdG8gRmlyZSBvbiBFdmVyeSBQYWdlICAtLS0tLS0tLS0tKi9cblxuY29uc3QgYnJlYWtwb2ludHMgPSBnZXRCcE9iaigpXG5cbi8qKlxuICogXG4gKiBMaXN0ZW4gZm9yIGNhcmQgZWxlbWVudHMgY2xpY2ssIGFuZCB0cmlnZ2VyIGNsaWNrIG9uIHRoZSBsaW5rcyBpbnNpZGUsXG4gKiBtYWtpbmcgdGhlIHdob2xlIGNhcmQgY2xpY2thYmxlXG4gKiBcbiAqL1xuXG5jb2xsZWN0aW9uKCdbZGF0YS1jYXJkLWNsaWNrXScpLm1hcChjYXJkID0+IHtcbiAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgIGNvbnN0IGxpbmsgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNhcmQtbGlua10nKVxuICAgIGlmKGxpbmspIHsgbGluay5jbGljaygpIH1cbiAgfSlcbn0pXG5cblxuLyoqXG4gKlxuICogU21vb3RoIHNjcm9sbCBmb3IgbGlua3Mgd2l0aGluIHRoZSBzYW1lIHBhZ2VcbiAqIFxuICovXG5cbkV2ZW50QnVzLnN1YnNjcmliZSh3aW5kb3dSZXNpemVkLCBlID0+IHtcbiAgc21vb3RoU2Nyb2xsLmluaXQoe1xuICAgIG9mZnNldDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NpdGUtaGVhZGVyJykub2Zmc2V0SGVpZ2h0XG4gIH0pXG59KVxuXG4vKipcbiAqXG4gKiBTZWFyY2ggQmFyIFRvZ2dsZVxuICogXG4gKi9cblxuY29uc3Qgc2l0ZVNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaXRlLXNlYXJjaCcpXG5cbi8vIEZvY3VzZXMgYXV0b21hdGljYWxseSB3aGVuIG9wZW5pbmdcbmNvbnN0IHRvZ2dsZVNlYXJjaENvbnRyb2xsZXIgPSB0b2dnbGVUYXJnZXQoJy5qcy10b2dnbGUtc2VhcmNoJywge1xuICBvblRvZ2dsZU9wZW46IChlbHMpID0+IHNpdGVTZWFyY2gucXVlcnlTZWxlY3RvcignaW5wdXQnKS5mb2N1cygpXG59KVxuXG4vLyBDbG9zZSB0aGUgc2VhcmNoIGJhciBvbiBgZXNjYCBwcmVzc1xuRXZlbnRCdXMuc3Vic2NyaWJlKGtleURvd25Fc2NhcGUsICgpID0+IHtcbiAgdG9nZ2xlU2VhcmNoQ29udHJvbGxlci5jbG9zZUFsbCgpXG59KVxuXG4vKipcbiAqXG4gKiAgR2VuZXJpYyBUb2dnbGVcbiAqIFxuICovXG5cbnRvZ2dsZVRhcmdldCgnLmpzLXRvZ2dsZScpXG5cbnRvZ2dsZVRhcmdldCgnLmpzLXRvZ2dsZS10YWInLCB7XG4gIG9uVG9nZ2xlT3Blbih7IHRhcmdldCwgZ3JvdXAgfSkge1xuICAgIGlmIChncm91cCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNtb290aFNjcm9sbC5hbmltYXRlU2Nyb2xsKGdyb3VwKVxuICAgICAgfSwgMClcbiAgICB9XG4gIH1cbn0pXG5cbi8qKlxuICpcbiAqIE1vYmlsZSBOYXZpZ2F0aW9uXG4gKiBcbiAqL1xuXG5pbml0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vYmlsZS1uYXYnKSlcbmluaXRWaWRlb01vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN2aWRlby1tb2RhbCcpLCAnW2RhdGEtdmlkZW8tcGxheWVyXScpXG5pbml0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vZGFsJykpXG5cbi8qKlxuICpcbiAqICBTbGlkZXJzXG4gKiBcbiAqL1xuXG5jb2xsZWN0aW9uKCcuanMtc2xpZGVyJylcbiAgLmZpbHRlcihlbCA9PiBlbC5jaGlsZHJlbi5sZW5ndGggPiAxKVxuICAubWFwKGVsID0+IG5ldyBGbGlja2l0eShlbCwge1xuICAgIHBhZ2VEb3RzOiBlbC5kYXRhc2V0LnBhZ2VEb3RzID09ICdmYWxzZScgPyBmYWxzZSA6IHRydWVcbiAgfSkpXG5cbkV2ZW50QnVzLnN1YnNjcmliZSh3aW5kb3dSZXNpemVkLCAoKSA9PiB7XG5cbiAgY29uc3Qgc2xpZGVycyA9IGNvbGxlY3Rpb24oJy5qcy1tb2JpbGUtc2xpZGVyJylcblxuICBpZih3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50cy5sZykge1xuICAgIHNsaWRlcnNcbiAgICAgIC5maWx0ZXIoZWwgPT4gIUZsaWNraXR5LmRhdGEoZWwpKVxuICAgICAgLm1hcChlbCA9PiBuZXcgRmxpY2tpdHkoZWwsIHtcbiAgICAgICAgcGFnZURvdHM6IHRydWUsXG4gICAgICAgIHByZXZOZXh0QnV0dG9uczogZmFsc2VcbiAgICAgIH0pKVxuICB9IGVsc2Uge1xuICAgIHNsaWRlcnNcbiAgICAgIC5tYXAoZWwgPT4gRmxpY2tpdHkuZGF0YShlbCkpXG4gICAgICAuZmlsdGVyKGZsaWNraXR5ID0+IGZsaWNraXR5KVxuICAgICAgLm1hcChmbGlja2l0eSA9PiBmbGlja2l0eS5kZXN0cm95KCkpXG4gIH1cblxufSlcblxuLyoqXG4gKlxuICogSGFuZGxlciBmb3IgYWpheCBzdWJtaXR0ZWQgZ3Jhdml0eSBmb3Jtc1xuICogXG4gKi9cblxuYWpheFN1Ym1pdEdmb3JtcygnLmdmb3JtX3dyYXBwZXIgZm9ybScpXG5cblxuLyotLS0tLS0tLS0tICBSb3V0ZSBTcGVjaWZpYyAgLS0tLS0tLS0tLSovXG5cbnJvdXRlcih7XG4gIGhvbWUoKSB7XG4gICAgXG4gIH1cbn0pXG5cbi8vIEZpcmUgaW5pdGlhbCBjdXN0b20gZXZlbnRzXG5cbkV2ZW50QnVzLnB1Ymxpc2god2luZG93UmVzaXplZClcbiJdfQ==
