(function() {
	// 'use strict';

	module.exports = function($rootScope, $scope, $window, Notification, ngDialog) {
		$scope.troubleshootActions = [];
		$scope.manualAction = {input: ''};
		$scope.manualActionCustom = {
			input: '',
			inputMultiple: {}
		};

		// Set up some menu items
		$scope.menuItems = [
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

		$scope.manualActionCustomValidator = function() {
			return $scope.manualActionCustom.inputMultiple;
		};

		$rootScope.$on('ngDialog.closed', function(e, $dialog) {
			$scope.manualActionCustom.input = '';
		});

		$scope.isNotObject = function(e) {
			return !angular.isObject(e);
		};

		// Reference
		$scope.dialogContent = {
			title: '',
			text: ''
		};

		$scope.openModal = function(parentIndex, index) {
			ngDialog.open({
				template: 'templateId',
				scope: $scope
			});

			$scope.dialogContent = {
				parent: parentIndex,
				subItem: index,
				title: $scope.menuItems[parentIndex].subItems[index].title,
				type: $scope.menuItems[parentIndex].subItems[index].type,
				prompt: $scope.menuItems[parentIndex].subItems[index].prompt,
				fields: $scope.menuItems[parentIndex].subItems[index].fields,
				divider: $scope.menuItems[parentIndex].subItems[index].divider,
				options: $scope.menuItems[parentIndex].subItems[index].options
			};
		};

		$scope.addAction = function(parentIndex, index) {
			$scope.troubleshootActionsString = '';
			var addedItem;
			var addedSubitem;
			var addedCustomValue;

			if (angular.isUndefined(parentIndex) && angular.isUndefined(index)) { // Manual add
				addedItem = $scope.manualAction.input;

				$scope.troubleshootActions.push({item: $scope.manualAction.input});
				$scope.manualAction.input = '';
			} else {
				if (angular.isString($scope.menuItems[parentIndex].subItems[index])) { // Simple click - not popup
					addedItem = $scope.menuItems[parentIndex].title;
					addedSubitem = $scope.menuItems[parentIndex].subItems[index];
				} else if (angular.isObject($scope.menuItems[parentIndex].subItems[index])) { // Popup

					addedItem = $scope.menuItems[parentIndex].title;
					addedSubitem = $scope.menuItems[parentIndex].subItems[index].title;

					if ($scope.manualActionCustom.input === '') {
						var arr = [];
						angular.forEach($scope.manualActionCustom.inputMultiple, function(value, i) {
							arr.push(value + $scope.menuItems[parentIndex].subItems[index].fields[i]);
						});
						addedCustomValue = arr.join($scope.menuItems[parentIndex].subItems[index].divider);
					} else if (angular.isObject($scope.manualActionCustom.inputMultiple)) {
						addedCustomValue = $scope.manualActionCustom.input;
					}
				}

				$scope.troubleshootActions.push({
					item: addedItem,
					subItem: addedSubitem,
					customValue: addedCustomValue
				});
			}

			// Populating the textarea for the clipboard functionality
			angular.forEach($scope.troubleshootActions, function(value) {
				var str = '';

				if (!angular.isUndefined(value.subItem)) {
					str += value.subItem;

					if (!angular.isUndefined(value.customValue)) {
						str += ' - ' + value.customValue;
					}
				} else {
					str += value.item;
				}

				$scope.troubleshootActionsString += str + '\n';
			});

			Notification({message: addedItem, title: 'Action added'});
		};

		$scope.removeAction = function(index) {
			$scope.troubleshootActionsString = '';

			var subitem = !angular.isUndefined($scope.troubleshootActions[index].subItem) ?
			' - ' + $scope.troubleshootActions[index].subItem : '';
			var removedItem = $scope.troubleshootActions[index].item + subitem;

			$scope.troubleshootActions.splice(index, 1);

			angular.forEach($scope.troubleshootActions, function(value) {
				var subitem = !angular.isUndefined(value.subItem) ? ' - ' + value.subItem : '';
				$scope.troubleshootActionsString += value.item + subitem + '\n';
			});

			Notification({message: removedItem, title: 'Action removed'});
		};

		$scope.removeAll = function() {
			var r = $window.confirm('Are you sure you want to erase the list of actions?');

			if (r) {
				$scope.troubleshootActions = [];
				Notification('Cleared');
			}
		};

		$scope.onSuccess = function(e) {
			Notification('Copied!');

			e.clearSelection();
		};
	};
}());
