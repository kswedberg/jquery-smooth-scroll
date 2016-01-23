/*global module:false*/

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  var marked = require('marked');
  var hl = require('node-syntaxhighlighter');

  marked.setOptions({
    highlight: function(code, lang) {
      lang = lang || 'javascript';
      lang = hl.getLanguage(lang);

      return hl.highlight(code, lang);
    },
    gfm: true
  });

  // Project configuration.
  grunt.initConfig({
    pluginName: 'smooth-scroll',
    pkg: pkg,
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= pkg.license %>' +
          '<%= "\\n" %>' + ' */' +
          '<%= "\\n\\n" %>'
    },
    concat: {
      all: {
        src: ['src/jquery.<%= pluginName %>.js'],
        dest: 'jquery.<%= pluginName %>.js'
      },
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>',
        process: function(src) {
          var umdHead = grunt.file.read('lib/tmpl/umdhead.tpl');
          var umdFoot = grunt.file.read('lib/tmpl/umdfoot.tpl');

          src = src
          .replace('(function($) {', umdHead)
          .replace('})(jQuery);', umdFoot);

          return src;
        }
      }
    },
    uglify: {
      all: {
        files: {
          'jquery.<%= pluginName %>.min.js': ['<%= concat.all.dest %>']
        },
        options: {
          banner: '<%= meta.banner %>',
          // preserveComments: /\/\*[\s\S]*/
        }
      }
    },
    watch: {
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint:all']
      },
      docs: {
        files: ['readme.md', 'lib/tmpl/**/*.html'],
        tasks: ['docs']
      }

    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        curly: true,
        devel: true,
        eqeqeq: true,
        unused: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          require: false
        }
      }
    },
    jscs: {
      src: 'src/**/*.js',
      options: {
        config: '.jscsrc',
        fix: true,
        verbose: true
      }
    },
    version: {
      src: {
        src: ['src/jquery.<%= pluginName %>.js']
      },
      banners: {
        pkg: pkg,
        src: [
          'jquery.<%= pluginName %>.js',
          'jquery.<%= pluginName %>.min.js'
        ],
        options: {
          prefix: '- v'
        }
      },
      package: {
        src: ['package.json']
      },
    }
  });

  grunt.registerTask('docs', 'Convert readme.md to html and concat with header and footer for index.html', function() {
    var readme = grunt.file.read('readme.md');
    var head = grunt.template.process(grunt.file.read('lib/tmpl/header.tpl'));
    var foot = grunt.file.read('lib/tmpl/footer.tpl');
    var doc = marked(readme);

    grunt.file.write('index.html', head + doc + foot);
  });

  grunt.registerTask('updateBower', 'Update bower.json to match package.json', function() {
    var pkg = require('./package.json');
    var props = ['name', 'main', 'homepage', 'repository', 'dependencies', 'keywords', 'license'];
    var json = {
      description: 'Easy implementation of smooth scrolling for same-page links'
    };

    props.forEach(function(item) {
      if (pkg[item]) {
        json[item] = pkg[item];
      }
    });

    json.authors = [pkg.author];
    json.moduleType = ['amd', 'node'];
    json.ignore = ['demo/', 'lib/', 'src/', 'test/', '**/.*', 'Gruntfile.js', 'package.json'];

    grunt.file.write('bower.json', JSON.stringify(json, null, 2));
  });

  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('build', ['lint', 'concat', 'version', 'uglify', 'docs']);
  grunt.registerTask('default', ['build']);

  ['patch', 'minor', 'major'].forEach(function(release) {
    grunt.registerTask(release, ['lint', 'version:src:' + release, 'concat', 'uglify', 'version:banners:' + release, 'version:package:' + release]);
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-version');
};
