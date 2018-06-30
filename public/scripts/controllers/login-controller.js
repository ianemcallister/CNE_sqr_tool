angular
    .module('cne')
    .controller('loginController', loginController);

loginController.$inject = ['$scope','$log', 'firebaseService'];

/* @ngInject */
function loginController($scope, $log, firebaseService) {

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
		
		console.log('submitCreds clicked');
		
		//submit credentials
		firebaseService.authUser.email(username, pass).then(function success (s) {

			console.log('was success', s);

		}).catch(function error(e) {
			console.log("Error:", e);
		});

	};

	$log.info('in the login controller');	//TODO: TAKE THIS OUT LATER

	//define local functions

	//run the test


}