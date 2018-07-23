angular
    .module('cne')
    .controller('aCustomersController', aCustomersController);

aCustomersController.$inject = ['$scope','$log', '$routeParams', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function aCustomersController($scope, $log, $routeParams, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	var customerId = $routeParams.customerid;
	
	//view model variables
	vm.customerProfile = $firebaseObject(firebase.database().ref().child('customers').child(customerId));
	vm.selected = {
		season_id: ""
	};

	//notify progress
	$log.info('in a customer controller');	//TODO: TAKE THIS OUT LATER

	//define local functions
	//define view model funcitons
	vm.selectSeason = function(id) {
		vm.selected.season_id = id;
		console.log('id', vm.selected.season_id);
	}

	vm.saveChanges = function() { vm.customerProfile.$save(); console.log('saved change'); }
	//run the test


}