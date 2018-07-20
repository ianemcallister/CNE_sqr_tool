angular
    .module('cne')
    .controller('squareTxsController', squareTxsController);

squareTxsController.$inject = ['$scope','$log', '$routeParams', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function squareTxsController($scope, $log, $routeParams, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	vm.sqrLocations = $firebaseArray(firebase.database().ref().child('reference_lists/sqr_locations'));
	$log.info('in a square Txs controller');	//TODO: TAKE THIS OUT LATER

	//define local functions

	//run the test


}