# Smooth Scroll Plugin

## Features

### $.fn.smoothScroll

* Allows for easy implementation of smooth scrolling for same-page links.
* Works like this: `$('a').smoothScroll();`
* Specify a containing element if you want: `$('#container a').smoothScroll();`
* Exclude links if they are within a containing element: `$('#container a').smoothScroll({excludeWithin: ['.container2']});`
* Exclude links if they match certain conditions: `$('a').smoothScroll({exclude: ['.rough','#chunky']});`
* Adjust where the scrolling stops: `$('.backtotop').smoothScroll({offset: -100});`
* Add a callback function that is triggered after the scroll is complete: `$('a').smoothScroll({afterScroll: function() { alert('we made it!'); }});`
* Add back button support by including a history management plugin such as "Ben Alman's BBQ":http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html. See demo/bbq.html for an example of how to implement this.

#### Options

The following options, shown with their default values, are available for both `$.fn.smoothScroll` and `$.smoothScroll`:

        {
          offset: 0,
          direction: 'top', // one of 'top' or 'left'
          scrollTarget: null, // only use if you want to override default behavior
          afterScroll: null,   // function to be called after scrolling occurs. "this" is the triggering element
          easing: 'swing',
          speed: 400
        }

The options map for `$.fn.smoothScroll` can take two additional properties:
`exclude` and `excludeWithin`. The value for both of these is an array of
selectors, DOM elements or jQuery objects. Default value for both is an
empty array.


### $.smoothScroll

* Utility method works without a selector: `$.smoothScroll()`
* Can be used to scroll any element (not just `document.documentElement` /
  `document.body`)
* Doesn't automatically fire, so you need to bind it to some other user
  interaction. For example:

        $('button.scrollsomething').click(function() {
          $.smoothScroll({
            scrollElement: $('div.scrollme'),
            scrollTarget: '#findme'
          });
          return false;
        });

* The `$.smoothScroll` method can take one or two arguments.
    * If the first argument is a number, the document is scrolled to that 
    position. If it's an options map, those options determine how the
    document (or other element) will be scrolled.
    * If a number is provided as the second argument, it will override whatever may have been set for the `scrollTarget` option.

#### Additional Option
The following option, in addition to those listed above, is available
for `$.smoothScroll`:

    {
      // jQuery set of elements you wish to scroll.
      //  if null (default), $('html, body').firstScrollable() is used.
      scrollElement: null,
    }

### $.fn.scrollable

* Selects the matched element(s) that are scrollable. Acts just like a
  DOM traversal method such as `.find()` or `.next()`.
* The resulting jQuery set may consist of **zero, one, or multiple**
  elements.

### $.fn.firstScrollable

* Selects the first matched element that is scrollable. Acts just like a
  DOM traversal method such as `.find()` or `.next()`.
* The resulting jQuery set may consist of **zero or one** element.
* This method is used *internally* by the plugin to determine which element
  to use for "document" scrolling:
  `$('html, body').firstScrollable().animate({scrollTop: someNumber},
  someSpeed)`

## Note

* The plugin's `$.fn.smoothScroll` and `$.smoothScroll` methods use the 
`$.fn.firstScrollable` DOM traversal method (also defined by this plugin)
to determine which element is scrollable. If no elements are scrollable,
these methods return a jQuery object containing an empty array, just like
all of jQuery's other DOM traversal methods. Any further chained methods,
therefore, will be called against no elements (which, in most cases,
means that nothing will happen).
