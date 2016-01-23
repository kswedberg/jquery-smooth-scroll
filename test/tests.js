/* globals QUnit: false */

QUnit.module('filterPath');

QUnit.test('Link paths not location path', function(assert) {
  var locationPath = $.smoothScroll.filterPath(location.pathname);
  $('a[href*=#]').each(function() {
    assert.notEqual(locationPath, this.pathname);
  });
});

QUnit.module('scrollable');

QUnit.test('Returns first scrollable element (html,body)', function(assert) {
  var scrollable = $('html,body').firstScrollable();
  assert.equal(scrollable.length, 1, 'One scrollable element is returned');
  assert.equal(scrollable[0], document.body, 'Scrollable element is <body>');
});

QUnit.test('Returns scrollable element (div#scrollable)', function(assert) {
  var scrollable = $('#scrollable').scrollable();
  assert.equal(scrollable.length, 1, 'One scrollable element is returned');
  assert.equal(scrollable[0].id, 'scrollable', 'Scrollable element is <div id="scrollable">');
});

QUnit.module('$.smoothScroll');
QUnit.test('Scrolls the #scrollable element, or not.', function(assert) {
  var done = assert.async(2);

  $.smoothScroll({
    scrollElement: $('#scrollable'),
    scrollTarget: '#does-not-exist',
    speed: 200,
    afterScroll: function() {
      var scrollTop = $('#scrollable').scrollTop();
      assert.equal(scrollTop, 0, '#scrollable element does not scroll to non-existant element');

      // Trigger the next scroll, which should actually work
      $('#scrollit').trigger('click');
      done();
    }
  });

  $('#scrollit').bind('click', function(event) {
    event.preventDefault();
    $.smoothScroll({
      scrollElement: $('#scrollable'),
      scrollTarget: '#findme',
      speed: 200,
      afterScroll: function() {
        var scrollTop = $('#scrollable').scrollTop();
        assert.equal(scrollTop, 100, '#scrollable element scrolls');
        done();
      }
    });
  });
});
