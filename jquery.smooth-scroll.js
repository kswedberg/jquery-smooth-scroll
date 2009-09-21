;(function($) {
// Animated Scrolling for Same-Page Links
// @see http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links

$.fn.smoothScroll = function(options) {
  var opts = $.extend({}, $.fn.smoothScroll.defaults, options),
      locationPath = filterPath(location.pathname),
      scrollElem = scrollableElement('html', 'body');
      
  this.each(function() {
    var link = this,
        $link = $(this),
        hostMatch = ((location.hostname === link.hostname) || !link.hostname),
        pathMatch = (filterPath(link.pathname) || locationPath) === locationPath,
        thisHash = link.hash && link.hash.replace('#',''),
        scrollTargetExists = thisHash && !!$('#' + thisHash).length;

    if (hostMatch && pathMatch && scrollTargetExists) {
      var include = true,

          exclude = opts.exclude,
          elCounter = 0,
          el = exclude.length,

          excludeWithin = opts.excludeWithin,
          ewlCounter = 0,
          ewl = excludeWithin.length;
       
      while (include && elCounter < el) {
        if ($link.is(exclude[elCounter++])) {
          include = false;
        }
      }
      while (include && ewlCounter < ewl) {
        if ($link.parents(excludeWithin[ewlCounter++] + ':first').length) {
          include = false;
        }
      }

      if (include) {
        $link.data('scrollTarget', '#' + thisHash);
      }
    }

  });

  
  this.die('click.smoothscroll').live('click.smoothscroll', function(event) {
    var scrollTargetId = $(this).data('scrollTarget');
    if (scrollTargetId) {
      event.preventDefault();
       
      var scrollTargetOffset = $(scrollTargetId).offset().top;

      $(scrollElem).animate({scrollTop: scrollTargetOffset + opts.offset}, 400, function() {
        // location.hash = target;
      });
    }
  });
  return this;
  
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
  
  function debug($obj) {
    if (window.console && window.console.log) {
      window.console.log($obj);
    }
  }
};

// default options
$.fn.smoothScroll.defaults = {
  exclude: [],
  excludeWithin:[],
  offset: 0
};

})(jQuery);
