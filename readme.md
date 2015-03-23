# Smooth Scroll Plugin

Allows for easy implementation of smooth scrolling for same-page links.

[![NPM](https://nodei.co/npm/jquery-smooth-scroll.png?compact=true)](https://npmjs.org/package/jquery-smooth-scroll)

## Download

Using npm:

```bash
npm install jquery-smooth-scroll
```

Using bower:

```bash
bower install jquery-smooth-scroll
```

The old-fashioned way:

Go to the following URL in your browser and copy/paste the code into your own file:
https://raw.githubusercontent.com/kswedberg/jquery-smooth-scroll/master/jquery.smooth-scroll.js

## Demo

You can try a bare-bones demo at [kswedberg.github.io/jquery-smooth-scroll/demo/](https://kswedberg.github.io/jquery-smooth-scroll/demo/)

## Features

### $.fn.smoothScroll

* Works like this: `$('a').smoothScroll();`
* Specify a containing element if you want: `$('#container a').smoothScroll();`
* Exclude links if they are within a containing element: `$('#container a').smoothScroll({excludeWithin: ['.container2']});`
* Exclude links if they match certain conditions: `$('a').smoothScroll({exclude: ['.rough','#chunky']});`
* Adjust where the scrolling stops: `$('.backtotop').smoothScroll({offset: -100});`
* Add a callback function that is triggered before the scroll starts: `$('a').smoothScroll({beforeScroll: function() { alert('ready to go!'); }});
* Add a callback function that is triggered after the scroll is complete: `$('a').smoothScroll({afterScroll: function() { alert('we made it!'); }});`
* Add back button support by including a history management plugin such as [Ben Alman's BBQ](http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html). See [demo/bbq.html](demo/bbq.html) for an example of how to implement this.


#### Options

The following options, shown with their default values, are available for both `$.fn.smoothScroll` and `$.smoothScroll`:

```javascript
{
  offset: 0,

  // one of 'top' or 'left'
  direction: 'top',

  // only use if you want to override default behavior
  scrollTarget: null,

  // fn(opts) function to be called before scrolling occurs.
  // `this` is the element(s) being scrolled
  beforeScroll: function() {},

  // fn(opts) function to be called after scrolling occurs.
  // `this` is the triggering element
  afterScroll: function() {},
  easing: 'swing',

  // speed can be a number or 'auto'
  // if 'auto', the speed will be calculated based on the formula:
  // (current scroll position - target scroll position) / autoCoeffic
  speed: 400,

  // autoCoefficent: Only used when speed set to "auto".
  // The higher this number, the faster the scroll speed
  autoCoefficient: 2,

  // $.fn.smoothScroll only: whether to prevent the default click action
  preventDefault: true

}
```

The options object for `$.fn.smoothScroll` can take two additional properties:
`exclude` and `excludeWithin`. The value for both of these is an array of
selectors, DOM elements or jQuery objects. Default value for both is an
empty array.

#### Setting options after initial call

If you need to change any of the options after you've already called `.smoothScroll()`,
you can do so by passing the `"options"` string as the first argument and an
options object as the second.

### $.smoothScroll

* Utility method works without a selector: `$.smoothScroll()`
* Can be used to scroll any element (not just `document.documentElement` /
  `document.body`)
* Doesn't automatically fire, so you need to bind it to some other user
  interaction. For example:

        $('button.scrollsomething').on('click', function() {
          $.smoothScroll({
            scrollElement: $('div.scrollme'),
            scrollTarget: '#findme'
          });
          return false;
        });

* The `$.smoothScroll` method can take one or two arguments.
    * If the first argument is a number, the document is scrolled to that
    position. If it's an options object, those options determine how the
    document (or other element) will be scrolled.
    * If a number is provided as the second argument, it will override whatever may have been set for the `scrollTarget` option.

#### Additional Option
The following option, in addition to those listed for `$.fn.smoothScroll` above, is available
for `$.smoothScroll`:

```javascript
{
  // jQuery set of elements you wish to scroll.
  //  if null (default), $('html, body').firstScrollable() is used.
  scrollElement: null
}
```

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

## Notes

* To determine where to scroll the page, the `$.fn.smoothScroll` method looks
for an element with an _id_ attribute that matches the `<a>` element's hash.
It does _not_ look at the element's _name_ attribute. If you want a clicked link
to scroll to a "named anchor" (e.g. `<a name="foo">`), you'll need to use the
`$.smoothScroll` method instead.
* The plugin's `$.fn.smoothScroll` and `$.smoothScroll` methods use the
`$.fn.firstScrollable` DOM traversal method (also defined by this plugin)
to determine which element is scrollable. If no elements are scrollable,
these methods return a jQuery object containing an empty array, just like
all of jQuery's other DOM traversal methods. Any further chained methods,
therefore, will be called against no elements (which, in most cases,
means that nothing will happen).
