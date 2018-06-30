/*
*	FLAVOR MIXER
*
*	This module is designed to allow customers to mix and match
*	our delicious flavors and to pick thier sizing.
*/

angular
	.module('cne')
	.directive('loginPassword', loginPassword);

/* @ngInject */
function loginPassword() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/login-password.directive.htm',
		replace: true,
		scope: {
			password: "=",
			active: "="
		},
		link: linkFunc,
		controller: loginPasswordController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	loginPasswordController.$inject = ['$scope', '$log'];
	/* @ngInject */
	function loginPasswordController($scope, $log) {
		//define local variables
		var self = this;
	}

	//pass it back
	return directive;
}