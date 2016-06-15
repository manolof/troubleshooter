(function() {
	'use strict';

	angular.module('app', ['ngclipboard', 'ui-notification', 'ngAnimate', 'vAccordion', 'vButton', 'ngDialog'])
		.config(function(NotificationProvider) {
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
