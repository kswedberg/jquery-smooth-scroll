/*!
 * jQuery Smooth Scroll Plugin v1.4.5
 *
 * Date: Sun Mar 11 18:17:42 2012 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2012, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/

(function($) {

var version = '1.4.4',
    defaults = {
      exclude: [],
      excludeWithin:[],
      offset: 0,
      direction: 'top', // one of 'top' or 'left'
      scrollElement: null, // jQuery set of elements you wish to scroll (for $.smoothScroll).
                          //  if null (default), $('html, body').firstScrollable() is used.
      scrollTarget: null, // only use if you want to override default behavior
      beforeScroll: function() {},  // fn(opts) function to be called before scrolling occurs. "this" is the element(s) being scrolled
      afterScroll: function() {},   // fn(opts) function to be called after scrolling occurs. "this" is the triggering element
      easing: 'swing',
      speed: 400,
      autoCoefficent: 2 // coefficient for "auto" speed
    },

    getScrollable = function(opts) {
      var scrollable = [],
          scrolled = false,
          dir = opts.dir && opts.dir == 'left' ? 'scrollLeft' : 'scrollTop';

      this.each(function() {

        if (this == document || this == window) { return; }
        var el = $(this);
        if ( el[dir]() > 0 ) {
          scrollable.push(this);
          return;
        }

        el[dir](1);
        scrolled  = el[dir]() > 0;
        el[dir](0);
        if ( scrolled ) {
          scrollable.push(this);
          return;
        }

      });

      if ( opts.el === 'first' && scrollable.length ) {
        scrollable = [ scrollable.shift() ];
      }

      return scrollable;
    },
    isTouch = 'ontouchend' in document;

$.fn.extend({
  scrollable: function(dir) {
    var scrl = getScrollable.call(this, {dir: dir});
    return this.pushStack(scrl);
  },
  firstScrollable: function(dir) {
    var scrl = getScrollable.call(this, {el: 'first', dir: dir});
    return this.pushStack(scrl);
  },

  smoothScroll: function(options) {
    options = options || {};
    var opts = $.extend({}, $.fn.smoothScroll.defaults, options),
        locationPath = $.smoothScroll.filterPath(location.pathname);

    this.die('click.smoothscroll').live('click.smoothscroll', function(event) {

      var clickOpts = {}, link = this, $link = $(this),
          hostMatch = ((location.hostname === link.hostname) || !link.hostname),
          pathMatch = opts.scrollTarget || ( $.smoothScroll.filterPath(link.pathname) || locationPath ) === locationPath,
          thisHash = escapeSelector(link.hash),
          include = true;

      if ( !opts.scrollTarget && (!hostMatch || !pathMatch || !thisHash) ) {
        include = false;
      } else {
        var exclude = opts.exclude, elCounter = 0, el = exclude.length;
        while (include && elCounter < el) {
          if ($link.is(escapeSelector(exclude[elCounter++]))) {
            include = false;
          }
        }

        var excludeWithin = opts.excludeWithin, ewlCounter = 0, ewl = excludeWithin.length;
        while ( include && ewlCounter < ewl ) {
          if ($link.closest(excludeWithin[ewlCounter++]).length) {
            include = false;
          }
        }
      }

      if ( include ) {
        event.preventDefault();

        $.extend( clickOpts, opts, {
          scrollTarget: opts.scrollTarget || thisHash,
          link: link
        });

        $.smoothScroll( clickOpts );
      }
    });

    return this;

  }
});

$.smoothScroll = function(options, px) {
  var opts, $scroller, scrollTargetOffset, speed,
      scrollerOffset = 0,
      offPos = 'offset',
      scrollDir = 'scrollTop',
      aniprops = {},
      useScrollTo = false,
      scrollprops = [];

  if ( typeof options === 'number') {
    opts = $.fn.smoothScroll.defaults;
    scrollTargetOffset = options;
  } else {
    opts = $.extend({}, $.fn.smoothScroll.defaults, options || {});
    if (opts.scrollElement) {
      offPos = 'position';
      if (opts.scrollElement.css('position') == 'static') {
        opts.scrollElement.css('position', 'relative');
      }
    }

    scrollTargetOffset = px ||
                        ( $(opts.scrollTarget)[offPos]() &&
                        $(opts.scrollTarget)[offPos]()[opts.direction] ) ||
                        0;
  }
  opts = $.extend({link: null}, opts);
  scrollDir = opts.direction == 'left' ? 'scrollLeft' : scrollDir;

  if ( opts.scrollElement ) {
    $scroller = opts.scrollElement;
    scrollerOffset = $scroller[scrollDir]();
  } else {
    $scroller = $('html, body').firstScrollable();
    useScrollTo = isTouch && 'scrollTo' in window;
  }

  aniprops[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;

  opts.beforeScroll.call($scroller, opts);

  if ( useScrollTo ) {
    scrollprops = (opts.direction == 'left') ? [aniprops[scrollDir], 0] : [0, aniprops[scrollDir]];
    window.scrollTo.apply(window, scrollprops);
    opts.afterScroll.call(opts.link, opts);

  } else {
    speed = opts.speed;

    // automatically calculate the speed of the scroll based on distance / coefficient
    if (speed === 'auto') {
      // if aniprops[scrollDir] == 0 then we'll use scrollTop() value instead
      speed = aniprops[scrollDir] || $scroller.scrollTop();
      // divide the speed by the coefficient
      speed = speed / opts.autoCoefficent;
    }

    $scroller.animate(aniprops,
    {
      duration: speed,
      easing: opts.easing,
      complete: function() {
        opts.afterScroll.call(opts.link, opts);
      }
    });
  }

};

$.smoothScroll.version = version;
$.smoothScroll.filterPath = function(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
};

// default options
$.fn.smoothScroll.defaults = defaults;

function escapeSelector (str) {
  return str.replace(/(:|\.)/g,'\\$1');
}

})(jQuery);
