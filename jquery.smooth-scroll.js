/*!
 * jQuery Smooth Scroll Plugin v1.3
 *
 * Date: Wed Dec 1 15:03:21 2010 -0500
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

var version = '1.3.1';

var locationPath = filterPath(location.pathname);

  function getScrollable(els) {
    var scrollable = [], scrolled = false;

    this.each(function() {

      if (this == document || this == window) { return; }
      var el = $(this);
      if ( el.scrollTop() > 0 ) {
        scrollable.push(this);
        return;
      }

      el.scrollTop(1);
      scrolled  = el.scrollTop() > 0;
      el.scrollTop(0);
      if ( scrolled ) {
        scrollable.push(this);
        return;
      }

    });

    if ( els === 'first' && scrollable.length ) {
      scrollable = [ scrollable.shift() ];
    }

    return scrollable;
  }
$.fn.extend({
  scrollable: function() {
    var scrl = getScrollable.call(this);
    return this.pushStack(scrl);
  },
  firstScrollable: function() {
    var scrl = getScrollable.call(this, 'first');
    return this.pushStack(scrl);
  },

  smoothScroll: function(options) {
    options = options || {};
    var opts = $.extend({}, $.fn.smoothScroll.defaults, options);
    this.die('click.smoothscroll').live('click.smoothscroll', function(event) {

      var link = this, $link = $(this),
          hostMatch = ((location.hostname === link.hostname) || !link.hostname),
          pathMatch = opts.scrollTarget || (filterPath(link.pathname) || locationPath) === locationPath,
          thisHash = link.hash,
          include = true;


      if ( !opts.scrollTarget && (!hostMatch || !pathMatch || !thisHash) ) {
        include = false;
      } else {
        var exclude = opts.exclude, elCounter = 0, el = exclude.length;
        while (include && elCounter < el) {
          if ($link.is(exclude[elCounter++])) {
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
        opts.scrollTarget = options.scrollTarget || thisHash;
        opts.link = link;
        event.preventDefault();
        $.smoothScroll(opts);
      }
    });

    return this;

  }

});

$.smoothScroll = function(options, px) {
  var opts, $scroller, scrollTargetOffset,
      scrollerOffset = 0,
      offPos = 'offset',
      dirs = {top: 'Top', 'left': 'Left'},
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

  if ( opts.scrollElement ) {
    $scroller = opts.scrollElement;
    scrollerOffset = $scroller.scrollTop();
  } else {
    $scroller = $('html, body').firstScrollable();
  }

  aniprops['scroll' + dirs[opts.direction]] = scrollTargetOffset + scrollerOffset + opts.offset;
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
$.fn.smoothScroll.defaults = {
  exclude: [],
  excludeWithin:[],
  offset: 0,
  direction: 'top', // one of 'top' or 'left'
  scrollElement: null, // jQuery set of elements you wish to scroll.
                      //if null (default), $('html, body').firstScrollable() is used.
  scrollTarget: null, // only use if you want to override default behavior
  afterScroll: null,   // function to be called after window is scrolled. "this" is the triggering element
  easing: 'swing',
  speed: 400
};


// private function
function filterPath(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
}

})(jQuery);
