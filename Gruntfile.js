/*global module:false*/

module.exports = function(grunt) {

  var marked = require('marked');
  // var hl = require('highlight').Highlight;
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
    bower: './bower.json',
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' +
          ' (<%= _.pluck(pkg.licenses, "url").join(", ") %>)' +
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
        banner: '<%= meta.banner %>'
      }
    },
    uglify: {
      all: {
        files: {
          'jquery.<%= pluginName %>.min.js': ['<%= concat.all.dest %>']
        },
        options: {
          preserveComments: 'some'
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
    version: {
      patch: {
        src: [
          'package.json',
          '<%= pluginName %>.jquery.json',
          'bower.json',
          'src/jquery.<%= pluginName %>.js',
          'jquery.<%= pluginName %>.js'
        ],
        options: {
          release: 'patch'
        }
      },
      same: {
        src: ['package.json', 'src/jquery.<%= pluginName %>.js', 'jquery.<%= pluginName %>.js']
      },
      bannerPatch: {
        src: ['jquery.<%= pluginName %>.js'],
        options: {
          prefix: '- v',
          release: 'patch'
        }
      }
    }
  });

  grunt.registerMultiTask( 'setshell', 'Set grunt shell commands', function() {
    var settings, cmd,
        tgt = this.target,
        cmdLabel = 'shell.' + tgt + '.command',
        file = this.data.file,
        append = this.data.cmdAppend || '';

    if ( !grunt.file.exists(file) ) {
      grunt.warn('File does not exist: ' + file);
    }

    settings = grunt.file.readJSON(file);
    if (!settings[tgt]) {
      grunt.warn('No ' + tgt + ' property found in ' + file);
    }

    cmd = settings[tgt] + append;
    grunt.config(cmdLabel, cmd);
    grunt.log.writeln( ('Setting ' + cmdLabel + ' to:').cyan );

    grunt.log.writeln(cmd);

  });

  grunt.registerTask( 'deploy', ['setshell:rsync', 'shell:rsync']);

  grunt.registerTask( 'configs', 'Update json configs based on package.json', function() {
    var pkg = grunt.file.readJSON('package.json'),
        pkgBasename = grunt.config('pluginName'),
        bowerFile = grunt.config('bower'),
        bower = grunt.file.readJSON(bowerFile),
        jqConfigFile = pkgBasename + '.jquery.json',
        jqConfig = grunt.file.readJSON(jqConfigFile);

    ['main', 'version', 'dependencies', 'keywords'].forEach(function(el) {
      bower[el] = pkg[el];
      jqConfig[el] = pkg[el];
    });

    ['author', 'repository', 'homepage', 'docs', 'bugs', 'demo', 'licenses'].forEach(function(el) {
      jqConfig[el] = pkg[el];
    });

    jqConfig.keywords.shift();
    jqConfig.name = pkgBasename;
    bower.name = 'jquery.' + pkgBasename;

    grunt.file.write( bowerFile, JSON.stringify(bower, null, 2) + '\n');
    grunt.log.writeln( 'File "' + bowerFile + '" updated."' );

    grunt.file.write( jqConfigFile, JSON.stringify(jqConfig, null, 2) + '\n');
    grunt.log.writeln( 'File "' + jqConfigFile + '" updated."' );
  });

  grunt.registerTask('docs', 'Convert readme.md to html and concat with header and footer for index.html', function() {
    var readme = grunt.file.read('readme.md'),
        head = grunt.template.process( grunt.file.read('lib/tmpl/header.tpl') ),
        foot = grunt.file.read('lib/tmpl/footer.tpl'),
        doc = marked(readme);

    grunt.file.write('index.html', head + doc + foot);
  });

  grunt.registerTask('build', ['jshint', 'concat', 'version:same', 'configs', 'uglify', 'docs']);
  grunt.registerTask('patch', ['jshint', 'concat', 'version:bannerPatch', 'version:patch', 'configs', 'uglify']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-shell');
};
