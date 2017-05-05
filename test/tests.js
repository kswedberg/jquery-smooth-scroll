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

QUnit.test('Auto-focuses the scroll target element after scrolling', function(assert) {
  var done = assert.async(1);

  $.smoothScroll({
    scrollTarget: '#scrollable',
    speed: 100,
    autoFocus: true,
    afterScroll: function(opts) {
      assert.equal($(opts.scrollTarget)[0], document.activeElement, 'autofocus scrollTarget');
      done();
    }
  });
});

QUnit.test('Scrolls the #scrollable element to absolute or relative scroll position', function(assert) {
  var done = assert.async(3);

  var finalScroll = function() {
    $.smoothScroll({
      scrollElement: $('#scrollable'),
      speed: 100,
      afterScroll: function() {
        var scrollTop = $('#scrollable').scrollTop();

        assert.equal(scrollTop, 10, '#scrollable element scrolls back to 10');

        // Trigger the next scroll, which should actually work
        done();
      }
    }, 10);
  };

  $.smoothScroll({
    scrollElement: $('#scrollable'),
    speed: 100,
    afterScroll: function() {
      var scrollTop = $('#scrollable').scrollTop();

      assert.equal(scrollTop, 15, '#scrollable element scrolls to 15');

      // Trigger the next scroll, which should actually work
      $('#scrollit').trigger('click');
      done();
    }
  }, 15);

  $('#scrollit').bind('click', function(event) {
    event.preventDefault();

    $.smoothScroll({
      scrollElement: $('#scrollable'),
      speed: 100,
      afterScroll: function() {
        var scrollTop = $('#scrollable').scrollTop();

        assert.equal(scrollTop, 25, '#scrollable element scrolls "+=10" to 25');
        done();
        finalScroll();
      }
    }, '+=10');
  });
});
