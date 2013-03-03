/*global module:false*/

module.exports = function(grunt) {

  // Because I'm lazy
  var _ = grunt.util._;

  // Project configuration.
  grunt.initConfig({
    component: './component.json',
    pkg: grunt.file.readJSON('smooth-scroll.jquery.json'),
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
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
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: 'jquery.<%= pkg.name %>.js'
      },
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      }
    },
    uglify: {
      all: {
        files: {
          'jquery.<%= pkg.name %>.min.js': ['<%= concat.all.dest %>']
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
    shell: {
      rsync: {
        // command is set by setshell:rsync.
        stdout: true
      }
    },
    setshell: {
      rsync: {
        file: 'gitignore/settings.json',
        cmdAppend: '<%= pkg.name %>/'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        curly: true,
        // eqeqeq: true,
        // immed: true,
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
          '<%= pkg.name %>.jquery.json',
          'package.json',
          'src/jquery.<%= pkg.name %>.js',
          'jquery.<%= pkg.name %>.js'
        ],
        options: {
          release: 'patch'
        }
      },
      same: {
        src: ['package.json', 'src/jquery.<%= pkg.name %>.js', 'jquery.<%= pkg.name %>.js']
      },
      bannerPatch: {
        src: ['jquery.<%= pkg.name %>.js'],
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

  grunt.registerTask( 'component', 'Update component.json', function() {
    var comp = grunt.config('component'),
        pkgName = grunt.config('pkg').name,
        pkg = grunt.file.readJSON(pkgName + '.jquery.json'),
        json = {};

    ['name', 'version', 'dependencies'].forEach(function(el) {
      json[el] = pkg[el];
    });

    _.extend(json, {
      main: grunt.config('concat.all.dest'),
      ignore: [
        'demo/',
        'lib/',
        'src/',
        '*.json'
      ]
    });
    json.name = 'jquery.' + json.name;

    grunt.file.write( comp, JSON.stringify(json, null, 2) );
    grunt.log.writeln( "File '" + comp + "' updated." );
  });

  grunt.registerTask('docs', function() {
    var marked = require('marked'),
        readme = grunt.file.read('readme.md'),
        head = grunt.template.process(grunt.file.read('lib/tmpl/header.tpl')),
        foot = grunt.file.read('lib/tmpl/footer.tpl'),
        doc = marked(readme);

    marked.setOptions({
      gfm: true
    });

    grunt.file.write('index.html', head + doc + foot);
  });

  grunt.registerTask('build', ['jshint', 'concat', 'version:same', 'component', 'uglify', 'docs']);
  grunt.registerTask('patch', ['jshint', 'concat', 'version:bannerPatch', 'version:patch', 'component', 'uglify']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-shell');
};
