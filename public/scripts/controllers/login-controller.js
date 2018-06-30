angular
    .module('cne')
    .controller('loginController', loginController);

loginController.$inject = ['$scope','$log'];

/* @ngInject */
function loginController($scope, $log) {

	//define view model variable
	var vm = this;

	//define view model variables
	vm.credentials = {
		username: "",
		password: ""
	};

	vm.active = {
		username: false,
		password: false
	};

	//define view model functions
	vm.submitCreds = function(username, pass) {
		console.log('submitting credentials', username, pass);
	};

	$log.info('in the login controller');	//TODO: TAKE THIS OUT LATER

	//define local functions

	//run the test


}