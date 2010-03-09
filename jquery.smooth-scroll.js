(function($) {
// Animated Scrolling for Same-Page Links
// @see http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links

var version = '1.1';

var locationPath = filterPath(location.pathname);

$.fn.extend({
	smoothScroll: function(options) {
    
    this.each(function() {
      var opts = $.extend({}, $.fn.smoothScroll.defaults, options);
      
      $(this).bind('click', function(event) {
        var link = this, $link = $(this),
            hostMatch = ((location.hostname === link.hostname) || !link.hostname),
            pathMatch = opts.scrollTarget || (filterPath(link.pathname) || locationPath) === locationPath,
            thisHash = link.hash && '#' + link.hash.replace('#',''),
            include = true;
        

        if (!opts.scrollTarget && (!hostMatch || !pathMatch || thisHash.length == 1) ) {
          include = false;
        } else {
          var exclude = opts.exclude, elCounter = 0, el = exclude.length;
          while (include && elCounter < el) {
            if ($link.is(exclude[elCounter++])) {
              include = false;
            }
          }

          var excludeWithin = opts.excludeWithin, ewlCounter = 0, ewl = excludeWithin.length;
          while (include && ewlCounter < ewl) {
            if ($link.parents(excludeWithin[ewlCounter++] + ':first').length) {
              include = false;
            }
          }          
        }

        if (include) {
          opts.scrollTarget = opts.scrollTarget || thisHash;
          opts.link = link;
          event.preventDefault();
          $.smoothScroll(opts);        
        }
      });
    });
  
    return this;

  }
  
});

$.smoothScroll = function(options, px) {
  var opts,
      scrollTargetOffset,
      scrollElem = scrollableElement('html', 'body');
  
  if ( typeof options === 'number') {
    opts = $.fn.smoothScroll.defaults;
    scrollTargetOffset = options;
  } else {
    opts = $.extend({}, $.fn.smoothScroll.defaults, options);
    scrollTargetOffset = px || $(opts.scrollTarget).offset().top;
  }
  opts = $.extend({link: null}, opts);
  
  $(scrollElem).animate({
    scrollTop: scrollTargetOffset + opts.offset
  }, 
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
  scrollTarget: null, // only use if you want to override default behavior
  afterScroll: null,   // function to be called after window is scrolled
  easing: 'swing',
  speed: 400
};


// private functions

// don't pass window or document
function scrollableElement(els) {
  for (var i = 0, argLength = arguments.length; i < argLength; i++) {
    var el = arguments[i],
        $scrollElement = $(el);
    if ($scrollElement.scrollTop() > 0) {
      return el;
    } else {
      $scrollElement.scrollTop(1);
      var isScrollable = $scrollElement.scrollTop() > 0;
      $scrollElement.scrollTop(0);
      if (isScrollable) {
        return el;
      }
    }
  }
  return [];
}


function filterPath(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
}


})(jQuery);
