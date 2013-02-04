/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('smooth-scroll.jquery.json'),
    component: './component.json',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>  */' +
          '<%= "\\n\\n" %>',
      version: '\\n \\nvar version = <%= pkg.version %>;\\n'
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
          preserveComments: false,
          banner: '<%= meta.banner %>'
        }
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      files: ['grunt.js', 'src/**/*.js'],
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
          jQuery: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('build', ['jshint', 'concat', 'version', 'component', 'uglify']);

  grunt.registerTask( 'component', 'update component.json', function() {
    var comp = grunt.config('component'),
        pkg = grunt.config("pkg"),
        json = {};

    ['name', 'version', 'dependencies'].forEach(function(el) {
      json[el] = pkg[el];
    });

    json.main = grunt.config('concat.all.dest');
    json.ignore = [
      'demo/',
      'lib/',
      'src/',
      '*.json'
    ];

    grunt.file.write( comp, JSON.stringify(json, null, 2) );

    grunt.log.writeln( "File '" + comp + "' updated." );
  });

	grunt.registerTask( 'version', 'insert version', function() {
		// Concat specified files.
		var name = grunt.config('concat.all.dest'),
        pkg = grunt.config("pkg"),
        compiled = grunt.file.read(name),
        version = "version = '" + pkg.version + "'";

    // compiled = '/* concatenated files:\n' + this.file.src.join(', ') + '\n*/\n\n' + compiled;

		// Embed Version
    compiled = compiled.replace( /version = '[^']+'/, version );
		// Write concatenated source to file
		grunt.file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		// Otherwise, print a success message.
		grunt.log.writeln( "File '" + name + "' created." );

	});

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

};
