/*
*	FLAVOR MIXER
*
*	This module is designed to allow customers to mix and match
*	our delicious flavors and to pick thier sizing.
*/

angular
	.module('cne')
	.directive('loginUsername', loginUsername);

/* @ngInject */
function loginUsername() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/login-username.directive.htm',
		replace: true,
		scope: {
			username: "=",
			active: "="
		},
		link: linkFunc,
		controller: loginUsernameController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	loginUsernameController.$inject = ['$scope', '$log'];
	/* @ngInject */
	function loginUsernameController($scope, $log) {
		//define local variables
		var self = this;
	}

	//pass it back
	return directive;
}