'use strict';

// Karma configuration
module.exports = function (config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: [
			'common/thirdparty/jquery/jquery.min.js',
			'common/thirdparty/es5-shim/es5-shim.min.js',
			'common/thirdparty/json3/lib/json3.min.js',
			'common/thirdparty/angular/angular.min.js',
			'common/thirdparty/angular-aria/angular-aria.min.js',
			'common/thirdparty/angular-resource/angular-resource.min.js',
			'common/thirdparty/angular-mocks/angular-mocks.js',
			'common/thirdparty/angular-cookies/angular-cookies.min.js',
			'common/thirdparty/angular-sanitize/angular-sanitize.min.js',
			'common/thirdparty/angular-animate/angular-animate.min.js',
			'common/thirdparty/angular-ui-router/angular-ui-router.min.js',			
			'common/thirdparty/angular-material/angular-material.min.js',
			'common/thirdparty/angular-messages/angular-messages.min.js',
			'common/thirdparty/angular-material-icons/angular-material-icons.min.js',
			'common/thirdparty/angular-material-data-table/md-data-table.min.js',
			'common/thirdparty/angular-translate/angular-translate.min.js',
			'common/thirdparty/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
			'app/app.js',
			'common/config/configuration.js',
			'common/services/httpService.js',
			'app/modules/home/homeModule.js',
			'app/modules/home/homeCtrl.js',
			'app/modules/home/homeRoute.js',
			'app/modules/home/homeService.js',
			'app/modules/home/home-test.js',

			'app/modules/home/serviceDelete/serviceDeleteCtrl.js',
			'app/modules/home/serviceDelete/serviceDeleteService.js',
			'app/modules/home/serviceDetails/serviceDetailsCtrl.js',
			'app/modules/home/serviceDetails/serviceDetailsService.js',
			'app/modules/home/serviceDelete/serviceDelete-test.js',
			'app/modules/home/serviceDetails/serviceDetails-test.js',
		],

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['spec'],

		plugins : [
			'karma-jasmine',
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-phantomjs-launcher',
			'karma-spec-reporter'
		],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
