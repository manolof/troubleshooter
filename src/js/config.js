(function() {
	'use strict';

	angular.module('app')
		.service('service', service);

	function service() {
		return [
			{
				title: 'About us',
				icon: 'fa-coffee',
				subItems: [
					'Our History',
					'Our Team'
				]
			},
			{
				title: 'Products',
				icon: 'fa-flask',
				subItems: [
					'Garden',
					'Office',
					'Home'
				]
			},
			{
				title: 'Printer',
				icon: 'fa-print',
				subItems: [
					'Restarted',
					{
						title: 'Checked ink level',
						type: 'input',
						prompt: 'What was the ink level?',
						fields: ['ml', '%', '%', '%'],
						divider: ', '
					},
					{
						title: 'Ran Diagnostics',
						type: 'radio',
						options: ['Passed', 'Failed']
					}
				]
			}
		];
	}
})();
