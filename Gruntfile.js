/// <vs AfterBuild='build' Clean='clean' SolutionOpened='default' />
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    config: {
      src:  'root-src',
      dev:  'root-dev',
      prod: 'root-prod',
      fileCss: 'main',
      fileJs: 'main',
      fileFrameCss: 'frame',
      fileFrameJs: 'frame'
    },
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      tmp: {
        files: [
          {
            expand: true,
            cwd: '.tmp/',
            src: '**/*',
          },
        ],
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.dev %>/',
            src: '**/*',
          },
        ],
      }
    },
    copy: {
      data: {
        expand: true,
        cwd: '<%= config.src %>/views/data/',
        src: ['news.json'],
        dest: '<%= config.dev %>/'
      },
      assets: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: ['fonts/*', 'img/*'],
        dest: '<%= config.dev %>/'
      },
      manifest: {
        expand: true,
        cwd: '<%= config.src %>/views/pages/',
        src: ['manifest.json'],
        dest: '<%= config.dev %>/'
      }
    },
    assemble: {
      options: {
        helpers: '<%= config.src %>/views/helpers/**/*.js',
        layoutdir: '<%= config.src %>/views/layouts/',
        data: '<%= config.src %>/views/**/*.{json,yml}'
      },
      dev: {
        options: {
          layout: "_default.hbs",
          partials: [
            '<%= config.src %>/views/partials/**/*.hbs'
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/views/pages',
            src: ['*.hbs'],
            dest: '<%= config.dev %>/'
          },
        ],
      },
    },
    sass: {
      options: {
        //sourceMap: true,
      },
      dev: {
        files: {
          '<%= config.dev %>/css/<%= config.fileCss %>.css': '<%= config.src %>/scss/<%= config.fileCss %>.scss',
          '<%= config.dev %>/css/<%= config.fileFrameCss %>.css': '<%= config.src %>/scss/<%= config.fileFrameCss %>.scss'
        },
      },
    },
    concat: {
      options: {
        banner: '',
        stripBanners: false,
      },
      devIndex: {
        src: [
          'node_modules/fastclick/lib/fastclick.js',
          'node_modules/hammerjs/hammer.js',
          '<%= config.src %>/js/index/*',
        ],
        dest: '<%= config.dev %>/js/<%= config.fileJs %>.js',
      },
      devFrame: {
        src: [
          '<%= config.src %>/js/frame/*',
        ],
        dest: '<%= config.dev %>/js/<%= config.fileFrameJs %>.js',
      },
    },
    jshint: {
      files: ['Gruntfile.js', 'root-src/**/*.js'],
      options: {
        globals: {
          jQuery: false
        }
      }
    },
    postcss: {
        options: {
            map: true,
            processors: [
                require('autoprefixer')({
                    browsers: ['last 3 versions']
                }),
                require('csswring')
            ]
        },
        dev: {
            src: '<%= config.dev %>/css/*.css'
        }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*'
        }
      },
      dev : {
        options: {
          base: '<%= config.dev %>'
        }
      },
      prod : {
        options: {
          base: '<%= config.prod %>'
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          '<%= config.prod %>/js/main.js': ['<%= config.dev %>/js/main.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          // Each of the files in the src/ folder will be output to
          // the dist/ folder each with the extension .gz.js
          {expand: true, src: ['src/*.js'], dest: '<%= config.prod %>/', ext: '.gz.js'}
        ]
      }
    },
    watch: {
      data: {
        files: ['<%= config.src %>/views/data/*.json'],
        tasks: ['copy'],
        options: {
          livereload: true,
        },
      },
      sass: {
        files: ['<%= config.src %>/**/*.scss'],
        tasks: ['sass','postcss'],
        options: {
          livereload: true,
        },
      },
      script: {
        files: ['<%= config.src %>/**/*.js'],
        tasks: ['concat'],
      },
      assemble: {
        files: ['<%= config.src %>/views/{,*/}*.{html,hbs,json}'],
        tasks: ['assemble'],
      },
      livereload: {
        //Here we watch the files the sass task will compile to
        //These files are sent to the live reload server after sass compiles to them
        options: { livereload: true },
        files: ['<%= config.dev %>/**/*'],
      },
    },
    'gh-pages': {
      options: {
        base: '<%= config.dev %>'
      },
      src: ['**']
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('devbuild', ['clean', 'copy', 'assemble', 'sass', 'concat:devIndex', 'concat:devFrame', 'postcss']);

  grunt.registerTask('prodbuild', ['clean', 'copy', 'assemble', 'sass', 'concat:devIndex', 'concat:devFrame', 'postcss', 'uglify', 'compress']);

  // Default task(s).
  grunt.registerTask('default', ['devbuild', 'connect:dev', 'watch']);

  grunt.registerTask('deploy', ['prodbuild', 'connect:prod', 'gh-pages']);

};