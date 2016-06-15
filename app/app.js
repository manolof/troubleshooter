(function() {
	'use strict';

	require('angular');
	require('ngclipboard');
	require('angular-animate');
	require('angular-ui-notification');
	require('ng-dialog');
	require('v-accordion');
	require('v-button');

	var mainController = require('./controllers');

	var app = angular.module('app', ['ngclipboard', 'ui-notification', 'ngAnimate', 'vAccordion', 'vButton', 'ngDialog']);

	app.controller('mainController',
		['$rootScope', '$scope', '$window', 'Notification', 'ngDialog', mainController]
	);

	app.config(function(NotificationProvider) {
		NotificationProvider.setOptions({
			delay: 1500,
			startTop: 10,
			startRight: 10,
			verticalSpacing: 10,
			horizontalSpacing: 10,
			positionX: 'right',
			positionY: 'bottom'
		});
	});
})();
