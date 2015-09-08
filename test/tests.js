/* globals QUnit: false */

QUnit.module('filterPath');

QUnit.test( 'Link paths not location path', function( assert ) {
  var locationPath = $.smoothScroll.filterPath(location.pathname);
  $('a[href*=#]').each(function() {
    assert.notEqual(locationPath, this.pathname);
  });
});

QUnit.module('scrollable');

QUnit.test( 'Returns first scrollable element (html,body)', function( assert ) {
  var scrollable = $('html,body').firstScrollable();
  assert.equal(scrollable.length, 1, 'One scrollable element is returned');
  assert.equal(scrollable[0], document.body, 'Scrollable element is <body>');
});

QUnit.test( 'Returns scrollable element (div#scrollable)', function( assert ) {
  var scrollable = $('#scrollable').scrollable();
  assert.equal(scrollable.length, 1, 'One scrollable element is returned');
  assert.equal(scrollable[0].id, 'scrollable', 'Scrollable element is <div id="scrollable">');
});
