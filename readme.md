# Smooth Scroll Plugin

Allows for easy implementation of smooth scrolling for same-page links.

[![NPM](https://nodei.co/npm/jquery-smooth-scroll.png?compact=true)](https://npmjs.org/package/jquery-smooth-scroll)

Note: Version 2.0+ of this plugin requires jQuery version 1.7 or greater.

## Download

Using npm:

```bash
npm install jquery-smooth-scroll
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
* Add a callback function that is triggered before the scroll starts: `$('a').smoothScroll({beforeScroll: function() { alert('ready to go!'); }});`
* Add a callback function that is triggered after the scroll is complete: `$('a').smoothScroll({afterScroll: function() { alert('we made it!'); }});`
* Add back button support by using a [`hashchange` event listener](https://developer.mozilla.org/en-US/docs/Web/API/HashChangeEvent). You can also include a history management plugin such as [Ben Alman's BBQ](http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html) for ancient browser support (IE &lt; 8), but you'll need jQuery 1.8 or earlier. See [demo/hashchange.html](demo/hashchange.html) or [demo/bbq.html](demo/bbq.html) for an example of how to implement.

#### Options

The following options, shown with their default values, are available for both `$.fn.smoothScroll` and `$.smoothScroll`:

```javascript
{
  offset: 0,

  // one of 'top' or 'left'
  direction: 'top',

  // only use if you want to override default behavior or if using $.smoothScroll
  scrollTarget: null,

  // automatically focus the target element after scrolling to it (see readme for details)
  autoFocus: false,

  // string to use as selector for event delegation
  delegateSelector: null,

  // fn(opts) function to be called before scrolling occurs.
  // `this` is the element(s) being scrolled
  beforeScroll: function() {},

  // fn(opts) function to be called after scrolling occurs.
  // `this` is the triggering element
  afterScroll: function() {},

  // easing name. jQuery comes with "swing" and "linear." For others, you'll need an easing plugin
  // from jQuery UI or elsewhere
  easing: 'swing',

  // speed can be a number or 'auto'
  // if 'auto', the speed will be calculated based on the formula:
  // (current scroll position - target scroll position) / autoCoefficient
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
  ```js
  $('button.scrollsomething').on('click', function() {
    $.smoothScroll({
      scrollElement: $('div.scrollme'),
      scrollTarget: '#findme'
    });
    return false;
  });
  ```
* The `$.smoothScroll` method can take one or two arguments.
    * If the first argument is a number or a "relative string," the document is scrolled to that
    position. If it's an options object, those options determine how the
    document (or other element) will be scrolled.
    * If a number or "relative string" is provided as the second argument, it will override whatever may have been set for the `scrollTarget` option.
    * The relative string syntax, introduced in version 2.1, looks like `"+=100px"` or `"-=50px"` (see below for an example).

#### Additional Option
The following option, in addition to those listed for `$.fn.smoothScroll` above, is available
for `$.smoothScroll`:

```javascript
{
  // The jQuery set of elements you wish to scroll.
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

## Examples

### Scroll down one "page" at a time (v2.1+)

With smoothScroll version 2.1 and later, you can use the "relative string" syntax to scroll an element or the document a certain number of pixels relative to its current position. The following code will scroll the document down one page at a time when the user clicks the ".pagedown" button:

  ```js
  $('button.pagedown').on('click', function() {
    $.smoothScroll('+=' + $(window).height());
  });
  ```

### Smooth scrolling on page load

If you want to scroll to an element when the page loads, use `$.smoothScroll()` in a script at the end of the body or use `$(document).ready()`. To prevent the browser from automatically scrolling to the element on its own, your link on page 1 will need to include a fragment identifier that does _not_ match an element id on page 2. To ensure that users without JavaScript get to the same element, you should modify the link's hash on page 1 with JavaScript. Your script on page 2 will then modify it back to the correct one when you call `$.smoothScroll()`.

For example, let's say you want to smooth scroll to `<div id="scrolltome"></div>` on page-2.html. For page-1.html, your script might do the following:

```js
$('a[href="page-2.html#scrolltome"]').attr('href', function() {
  var hrefParts = this.href.split(/#/);
  hrefParts[1] = 'smoothScroll' + hrefParts[1];
  return hrefParts.join('#');
});

```

Then for page-2.html, your script would do this:

```js
// Call $.smoothScroll if location.hash starts with "#smoothScroll"
var reSmooth = /^#smoothScroll/;
var id;
if (reSmooth.test(location.hash)) {
  // Strip the "#smoothScroll" part off (and put "#" back on the beginning)
  id = '#' + location.hash.replace(reSmooth, '');
  $.smoothScroll({scrollTarget: id});
}
```

## Focus element after scrolling to it.

Imagine you have a link to a form somewhere on the same page. When the user clicks the link, you want the user to be able to begin interacting with that form.

* As of **smoothScroll version 2.2**, the plugin will automatically focus the element if you set the `autoFocus` option to `true`.
* In the future, versions 3.x and later will have `autoFocus` set to true **by default**.
* If you are using the low-level `$.smoothScroll` method, `autoFocus` will only work if you've also provided a value for the `scrollTarget` option.
* Prior to version 2.2, you can use the `afterScroll` callback function. Here is an example that focuses the first input within the form after scrolling to the form:

```js
$('a.example').smoothScroll({
  afterScroll: function(options) {
    $(options.scrollTarget).find('input')[0].focus();
  }
});

```

For accessibility reasons, it might make sense to focus any element you scroll to, even if it's not a natively focusable element. To do so, you could add a `tabIndex` attribute to the target element (this, again, is for versions prior to 2.2):

```js
$('div.example').smoothScroll({
  afterScroll: function(options) {
    var $tgt = $(options.scrollTarget);
    $tgt[0].focus();

    if (!$tgt.is(document.activeElement)) {
      $tgt.attr('tabIndex', '-1');
      $tgt[0].focus();
    }
  }
});
```

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

## Contributing

Thank you! Please consider the following when working on this repo before you submit a pull request:

* For code changes, please work on the "source" file: `src/jquery.smooth-scroll.js`.
* Style conventions are noted in the `jshint` grunt file options and the `.jscsrc` file. To be sure your additions comply, run `grunt lint` from the command line.
* If possible, please use Tim Pope's [git commit message style](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html). Multiple commits in a pull request will be squashed into a single commit. I may adjust the message for clarity, style, or grammar. I manually commit all merged PRs using the `--author` flag to ensure that proper authorship (yours) is maintained.
