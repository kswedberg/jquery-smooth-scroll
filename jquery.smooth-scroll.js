/*!
 * jQuery Smooth Scroll Plugin v1.4.1
 *
 * Date: Tue Nov 15 14:24:14 2011 EST
 * Requires: jQuery v1.3+
 *
 * Copyright 2010, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/

(function($) {

var version = '1.4.1',
    defaults = {
      exclude: [],
      excludeWithin:[],
      offset: 0,
      direction: 'top', // one of 'top' or 'left'
      scrollElement: null, // jQuery set of elements you wish to scroll (for $.smoothScroll).
                          //  if null (default), $('html, body').firstScrollable() is used.
      scrollTarget: null, // only use if you want to override default behavior
      beforeScroll: null,   // fn(opts) function to be called before scrolling occurs. "this" is the element(s) being scrolled
      afterScroll: null,   // fn(opts) function to be called after scrolling occurs. "this" is the triggering element
      easing: 'swing',
      speed: 400
    },
    locationPath = filterPath(location.pathname),
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
    };

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
    var opts = $.extend({}, $.fn.smoothScroll.defaults, options);
    this.die('click.smoothscroll').live('click.smoothscroll', function(event) {

      var clickOpts = {}, link = this, $link = $(this),
          hostMatch = ((location.hostname === link.hostname) || !link.hostname),
          pathMatch = opts.scrollTarget || (filterPath(link.pathname) || locationPath) === locationPath,
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
  var opts, $scroller, scrollTargetOffset,
      scrollerOffset = 0,
      offPos = 'offset',
      scrollDir = 'scrollTop',
      aniprops = {};

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
  }

  aniprops[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;

  if ( $.isFunction(opts.beforeScroll) ) {
    opts.beforeScroll.call($scroller, opts);
  }

  $scroller.animate(aniprops,
  {
    duration: opts.speed,
    easing: opts.easing,
    complete: function() {
      if ( opts.afterScroll && $.isFunction(opts.afterScroll) ) {
        opts.afterScroll.call(opts.link, opts);
      }
    }
  });

};

$.smoothScroll.version = version;

// default options
$.fn.smoothScroll.defaults = defaults;


// private function
function filterPath(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
}

function escapeSelector (str) {
  return str.replace(/(:|\.)/g,'\\$1');
}

})(jQuery);
