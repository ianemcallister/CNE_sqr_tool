config.$inject=["$routeProvider","$locationProvider"];var ahNuts=angular.module("cne",["ngRoute","firebase","ngSanitize"]);function customersController(o,e,r,n,t,i,l){var c=this;c.customerList=["a","b","c"],c.testList=l(firebase.database().ref().child("customers")),e.info("in the customers controller"),n.get.customer_list().then(function(e){c.customerList=e,o.$apply()}).catch(function(e){console.log("error")})}function landingController(e,o){o.info("in the landing controller")}function loginController(e,o,r){var n=this;n.credentials={username:"",password:""},n.active={username:!1,password:!1},n.submitCreds=function(e,o){console.log("submitCreds clicked"),r.authUser.email(e,o).then(function(e){console.log("was success",e)}).catch(function(e){console.log("Error:",e)})},o.info("in the login controller")}function customerList(){o.$inject=["scope","el","attr","ctrl"];var e={restrict:"AECM",templateUrl:"views/directives/customer-list.directive.htm",replace:!0,scope:{},link:o,controller:r,controllerAs:"vm",bindToController:!0};function o(e,o,r,n){}function r(e,o){console.log("in costomer List controller")}return r.$inject=["$scope","$log"],e}function loginPassword(){o.$inject=["scope","el","attr","ctrl"];var e={restrict:"AECM",templateUrl:"views/directives/login-password.directive.htm",replace:!0,scope:{password:"=",active:"="},link:o,controller:r,controllerAs:"vm",bindToController:!0};function o(e,o,r,n){}function r(e,o){}return r.$inject=["$scope","$log"],e}function loginUsername(){o.$inject=["scope","el","attr","ctrl"];var e={restrict:"AECM",templateUrl:"views/directives/login-username.directive.htm",replace:!0,scope:{username:"=",active:"="},link:o,controller:r,controllerAs:"vm",bindToController:!0};function o(e,o,r,n){}function r(e,o){}return r.$inject=["$scope","$log"],e}function firebaseService(e,o,r){return{get:{customer_list:function(){return new Promise(function(e,o){e(["one","two","three"])})}},authUser:{email:function(e,r){return console.log("authenticating user"),new Promise(function(o,n){firebase.auth().signInWithEmailAndPassword(e,r).then(function(e){o(e)}).catch(function(e){var o=e.code,r=e.message;n({code:o,message:r})})})}},test:function(){return"good test from FB Service"}}}function config(e,o){o.hashPrefix(""),e.when("/",{templateUrl:"views/landingPage.htm",controller:"landingController",controllerAs:"vm"}).when("/customers",{templateUrl:"views/customersPage.htm",controller:"customersController",controllerAs:"vm",resolve:{customerList:customerList}}).when("/login",{templateUrl:"views/loginPage.htm",controller:"loginController",controllerAs:"vm"}).otherwise({redirectTo:"/"})}function customerList(){return new Promise(function(e,o){e("good test")})}angular.module("cne").controller("customersController",customersController),customersController.$inject=["$scope","$log","customerList","firebaseService","$firebase","$firebaseObject","$firebaseArray"],angular.module("cne").controller("landingController",landingController),landingController.$inject=["$scope","$log"],angular.module("cne").controller("loginController",loginController),loginController.$inject=["$scope","$log","firebaseService"],angular.module("cne").directive("customerList",customerList),angular.module("cne").directive("loginPassword",loginPassword),angular.module("cne").directive("loginUsername",loginUsername),angular.module("cne").factory("firebaseService",firebaseService),firebaseService.$inject=["$firebase","$firebaseObject","$firebaseArray"],angular.module("cne").config(config);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdHMvd2ViYXBwLmpzIiwic2NyaXB0cy9jb250cm9sbGVycy9jdXN0b21lcnMtY29udHJvbGxlci5qcyIsInNjcmlwdHMvY29udHJvbGxlcnMvbGFuZGluZy1jb250cm9sbGVyLmpzIiwic2NyaXB0cy9jb250cm9sbGVycy9sb2dpbi1jb250cm9sbGVyLmpzIiwic2NyaXB0cy9kaXJlY3RpdmVzL2N1c3RvbWVyLWxpc3QuanMiLCJzY3JpcHRzL2RpcmVjdGl2ZXMvbG9naW4tcGFzc3dvcmQuZGlyZWN0aXZlLmpzIiwic2NyaXB0cy9kaXJlY3RpdmVzL2xvZ2luLXVzZXJuYW1lLmRpcmVjdGl2ZS5qcyIsInNjcmlwdHMvZmFjdG9yaWVzL2ZpcmViYXNlLnNlcnZpY2UuanMiLCJzY3JpcHRzL3JvdXRlcy9yb3V0ZXMtY29uZmlnLmpzIl0sIm5hbWVzIjpbImFoTnV0cyIsImFuZ3VsYXIiLCJtb2R1bGUiLCJjdXN0b21lcnNDb250cm9sbGVyIiwiJHNjb3BlIiwiJGxvZyIsImN1c3RvbWVyTGlzdCIsImZpcmViYXNlU2VydmljZSIsIiRmaXJlYmFzZSIsIiRmaXJlYmFzZU9iamVjdCIsIiRmaXJlYmFzZUFycmF5Iiwidm0iLCJ0aGlzIiwidGVzdExpc3QiLCJmaXJlYmFzZSIsImRhdGFiYXNlIiwicmVmIiwiY2hpbGQiLCJpbmZvIiwiZ2V0IiwiY3VzdG9tZXJfbGlzdCIsInRoZW4iLCJzIiwiJGFwcGx5IiwiY2F0Y2giLCJlIiwiY29uc29sZSIsImxvZyIsImxhbmRpbmdDb250cm9sbGVyIiwibG9naW5Db250cm9sbGVyIiwiY3JlZGVudGlhbHMiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiYWN0aXZlIiwic3VibWl0Q3JlZHMiLCJwYXNzIiwiYXV0aFVzZXIiLCJlbWFpbCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwidGVtcGxhdGVVcmwiLCJyZXBsYWNlIiwic2NvcGUiLCJsaW5rIiwibGlua0Z1bmMiLCJjb250cm9sbGVyIiwiY3VzdG9tZXJMaXN0Q29udHJvbGxlciIsImNvbnRyb2xsZXJBcyIsImJpbmRUb0NvbnRyb2xsZXIiLCJlbCIsImF0dHIiLCJjdHJsIiwiJGluamVjdCIsImxvZ2luUGFzc3dvcmQiLCJsb2dpblBhc3N3b3JkQ29udHJvbGxlciIsImxvZ2luVXNlcm5hbWUiLCJsb2dpblVzZXJuYW1lQ29udHJvbGxlciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXV0aCIsInNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIiwiZXJyb3IiLCJlcnJvckNvZGUiLCJjb2RlIiwiZXJyb3JNZXNzYWdlIiwibWVzc2FnZSIsInRlc3QiLCJjb25maWciLCIkcm91dGVQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiaGFzaFByZWZpeCIsIndoZW4iLCJvdGhlcndpc2UiLCJyZWRpcmVjdFRvIiwiZmFjdG9yeSJdLCJtYXBwaW5ncyI6InNEQUNBLElBQUFBLE9BQUFDLFFBQUFDLE9BQUEsTUFBQSxDQUFBLFVBQUEsV0FBQSxlQ01BLFNBQUFDLG9CQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxHQUdBLElBQUFDLEVBQUFDLEtBQ0FELEVBQUFMLGFBQUEsQ0FBQSxJQUFBLElBQUEsS0FDQUssRUFBQUUsU0FBQUgsRUFBQUksU0FBQUMsV0FBQUMsTUFBQUMsTUFBQSxjQUdBWixFQUFBYSxLQUFBLCtCQWVBWCxFQUFBWSxJQUFBQyxnQkFBQUMsS0FBQSxTQUFBQyxHQUtBWCxFQUFBTCxhQUFBZ0IsRUFHQWxCLEVBQUFtQixXQUVBQyxNQUFBLFNBQUFDLEdBRUFDLFFBQUFDLElBQUEsV0NuQ0EsU0FBQUMsa0JBQUF4QixFQUFBQyxHQUtBQSxFQUFBYSxLQUFBLDZCQ0xBLFNBQUFXLGdCQUFBekIsRUFBQUMsRUFBQUUsR0FHQSxJQUFBSSxFQUFBQyxLQUdBRCxFQUFBbUIsWUFBQSxDQUNBQyxTQUFBLEdBQ0FDLFNBQUEsSUFHQXJCLEVBQUFzQixPQUFBLENBQ0FGLFVBQUEsRUFDQUMsVUFBQSxHQUlBckIsRUFB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QWhCLGlCQUVBQSxnQkFBQXVCLFFBQUEsQ0FBQSxTQUFBLE9BQUEsbUJDRUFuRCxRQUNBQyxPQUFBLE9BQ0FvQyxVQUFBLGVBQUFoQyxjQ0RBTCxRQUNBQyxPQUFBLE9BQ0FvQyxVQUFBLGdCQUFBZSxlQ0ZBcEQsUUFDQUMsT0FBQSxPQUNBb0MsVUFBQSxnQkFBQWlCLGVDSEF0RCxRQUNBQyxPQUFBLE9BQ0F5RSxRQUFBLGtCQUFBcEUsaUJBR0FBLGdCQUFBNkMsUUFBQSxDQUFBLFlBQUEsa0JBQUEsa0JDTkFuRCxRQUNBQyxPQUFBLE9BQ0FrRSxPQUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNT0RVTEVcbnZhciBhaE51dHMgPSBhbmd1bGFyLm1vZHVsZSgnY25lJywgWyduZ1JvdXRlJywgJ2ZpcmViYXNlJywgJ25nU2FuaXRpemUnXSk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnY25lJylcbiAgICAuY29udHJvbGxlcignY3VzdG9tZXJzQ29udHJvbGxlcicsIGN1c3RvbWVyc0NvbnRyb2xsZXIpO1xuXG5jdXN0b21lcnNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJyRsb2cnLCAnY3VzdG9tZXJMaXN0JywgJ2ZpcmViYXNlU2VydmljZScsICckZmlyZWJhc2UnLCAnJGZpcmViYXNlT2JqZWN0JywgJyRmaXJlYmFzZUFycmF5J107XG5cbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gY3VzdG9tZXJzQ29udHJvbGxlcigkc2NvcGUsICRsb2csIGN1c3RvbWVyTGlzdCwgZmlyZWJhc2VTZXJ2aWNlLCAkZmlyZWJhc2UsICRmaXJlYmFzZU9iamVjdCwgJGZpcmViYXNlQXJyYXkpIHtcblxuXHQvL2RlZmluZSB2aWV3IG1vZGVsIHZhcmlhYmxlXG5cdHZhciB2bSA9IHRoaXM7XG5cdHZtLmN1c3RvbWVyTGlzdCA9IFsnYScsICdiJywgJ2MnXTtcblx0dm0udGVzdExpc3QgPSAkZmlyZWJhc2VBcnJheShmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZigpLmNoaWxkKCdjdXN0b21lcnMnKSk7XG5cblx0Ly9pZGVudGlmeSB3aGVyZSB3ZSBhcmVcblx0JGxvZy5pbmZvKCdpbiB0aGUgY3VzdG9tZXJzIGNvbnRyb2xsZXInKTtcdC8vVE9ETzogVEFLRSBUSElTIE9VVCBMQVRFUlxuXHRcblxuXHQvKlxuXHQqXHRMT0NBTCBGVU5DVElPTlMgR08gSEVSRVxuXHQqXG5cdCovXG5cblx0Ly9cdExPQUQgQ1VTVE9NRVIgTElTVFxuXHRmdW5jdGlvbiBsb2FkX2N1c3RvbWVyX2xpc3QoKSB7XG5cdFx0XG5cdFx0Ly90cmFjayBzdGFydGluZyBmdW5jdGlvblxuXHRcdC8vY29uc29sZS5sb2coJ2xvYWRpbmcgdGhlIGN1c3RvbWVyIGxpc3QnKTtcblx0XHRcblx0XHQvL2dhdGhlciB0aGUgZGF0YVxuXHRcdGZpcmViYXNlU2VydmljZS5nZXQuY3VzdG9tZXJfbGlzdCgpLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhzKSB7XG5cdFx0XHRcblx0XHRcdC8vY29uc29sZS5sb2coJ2dvdCB0aGlzIHJlc3BvbnMnLCBzKTtcblx0XHRcdFxuXHRcdFx0Ly93aGVuIHRoZSBsaXN0IGhhcyBiZWVuIGxvYWRlZCB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuXHRcdFx0dm0uY3VzdG9tZXJMaXN0ID0gcztcblxuXHRcdFx0Ly9yZWZsZWN0IHRoZSBjaGFuZ2VzXG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cblx0XHR9KS5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XG5cdFx0XHQvL2lmIHRoZXJlIHdhcyBhbiBlcnJvciB0aHJvdyB0aGUgZXJyb3Jcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8vcnVuIHRoZSB0ZXN0XG5cblx0Ly9vbiBwYWdlIGxvYWRcblx0bG9hZF9jdXN0b21lcl9saXN0KCk7XG5cbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnY25lJylcbiAgICAuY29udHJvbGxlcignbGFuZGluZ0NvbnRyb2xsZXInLCBsYW5kaW5nQ29udHJvbGxlcik7XG5cbmxhbmRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJyRsb2cnXTtcblxuLyogQG5nSW5qZWN0ICovXG5mdW5jdGlvbiBsYW5kaW5nQ29udHJvbGxlcigkc2NvcGUsICRsb2cpIHtcblxuXHQvL2RlZmluZSB2aWV3IG1vZGVsIHZhcmlhYmxlXG5cdHZhciB2bSA9IHRoaXM7XG5cblx0JGxvZy5pbmZvKCdpbiB0aGUgbGFuZGluZyBjb250cm9sbGVyJyk7XHQvL1RPRE86IFRBS0UgVEhJUyBPVVQgTEFURVJcblxuXHQvL2RlZmluZSBsb2NhbCBmdW5jdGlvbnNcblxuXHQvL3J1biB0aGUgdGVzdFxuXG5cbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnY25lJylcbiAgICAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgbG9naW5Db250cm9sbGVyKTtcblxubG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJyRsb2cnLCAnZmlyZWJhc2VTZXJ2aWNlJ107XG5cbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gbG9naW5Db250cm9sbGVyKCRzY29wZSwgJGxvZywgZmlyZWJhc2VTZXJ2aWNlKSB7XG5cblx0Ly9kZWZpbmUgdmlldyBtb2RlbCB2YXJpYWJsZVxuXHR2YXIgdm0gPSB0aGlzO1xuXG5cdC8vZGVmaW5lIHZpZXcgbW9kZWwgdmFyaWFibGVzXG5cdHZtLmNyZWRlbnRpYWxzID0ge1xuXHRcdHVzZXJuYW1lOiBcIlwiLFxuXHRcdHBhc3N3b3JkOiBcIlwiXG5cdH07XG5cblx0dm0uYWN0aXZlID0ge1xuXHRcdHVzZXJuYW1lOiBmYWxzZSxcblx0XHRwYXNzd29yZDogZmFsc2Vcblx0fTtcblxuXHQvL2RlZmluZSB2aWV3IG1vZGVsIGZ1bmN0aW9uc1xuXHR2bS5zdWJtaXRDcmVkcyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzKSB7XG5cdFx0XG5cdFx0Y29uc29sZS5sb2coJ3N1Ym1pdENyZWRzIGNsaWNrZWQnKTtcblx0XHRcblx0XHQvL3N1Ym1pdCBjcmVkZW50aWFsc1xuXHRcdGZpcmViYXNlU2VydmljZS5hdXRoVXNlci5lbWFpbCh1c2VybmFtZSwgcGFzcykudGhlbihmdW5jdGlvbiBzdWNjZXNzIChzKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCd3YXMgc3VjY2VzcycsIHMpO1xuXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJFcnJvcjpcIiwgZSk7XG5cdFx0fSk7XG5cblx0fTtcblxuXHQkbG9nLmluZm8oJ2luIHRoZSBsb2dpbiBjb250cm9sbGVyJyk7XHQvL1RPRE86IFRBS0UgVEhJUyBPVVQgTEFURVJcblxuXHQvL2RlZmluZSBsb2NhbCBmdW5jdGlvbnNcblxuXHQvL3J1biB0aGUgdGVzdFxuXG5cbn0iLCIvKlxuKlx0Q1VTVE9NRVIgTElTVFxuKlxuKlx0VGhpcyBtb2R1bGUgaXMgZGVzaWduZWQgdG8gXG4qL1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ2NuZScpXG5cdC5kaXJlY3RpdmUoJ2N1c3RvbWVyTGlzdCcsIGN1c3RvbWVyTGlzdCk7XG5cbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gY3VzdG9tZXJMaXN0KCkge1xuXHQvL2RlZmluZSB0aGUgZGlyZWN0aXZlXG5cdHZhciBkaXJlY3RpdmUgPSB7XG5cdFx0cmVzdHJpY3Q6IFwiQUVDTVwiLFxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jdXN0b21lci1saXN0LmRpcmVjdGl2ZS5odG0nLFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0c2NvcGU6IHtcblx0XHR9LFxuXHRcdGxpbms6IGxpbmtGdW5jLFxuXHRcdGNvbnRyb2xsZXI6IGN1c3RvbWVyTGlzdENvbnRyb2xsZXIsXG5cdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0fVxuXG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmdW5jdGlvbiBsaW5rRnVuYyhzY29wZSwgZWwsIGF0dHIsIGN0cmwpIHt9XG5cblx0Y3VzdG9tZXJMaXN0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvZyddO1xuXHRcblx0LyogQG5nSW5qZWN0ICovXG5cdGZ1bmN0aW9uIGN1c3RvbWVyTGlzdENvbnRyb2xsZXIoJHNjb3BlLCAkbG9nKSB7XG5cdFx0Ly9kZWZpbmUgbG9jYWwgdmFyaWFibGVzXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Y29uc29sZS5sb2coJ2luIGNvc3RvbWVyIExpc3QgY29udHJvbGxlcicpO1xuXHR9XG5cblx0Ly9wYXNzIGl0IGJhY2tcblx0cmV0dXJuIGRpcmVjdGl2ZTtcbn0iLCIvKlxuKlx0RkxBVk9SIE1JWEVSXG4qXG4qXHRUaGlzIG1vZHVsZSBpcyBkZXNpZ25lZCB0byBhbGxvdyBjdXN0b21lcnMgdG8gbWl4IGFuZCBtYXRjaFxuKlx0b3VyIGRlbGljaW91cyBmbGF2b3JzIGFuZCB0byBwaWNrIHRoaWVyIHNpemluZy5cbiovXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnY25lJylcblx0LmRpcmVjdGl2ZSgnbG9naW5QYXNzd29yZCcsIGxvZ2luUGFzc3dvcmQpO1xuXG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIGxvZ2luUGFzc3dvcmQoKSB7XG5cdC8vZGVmaW5lIHRoZSBkaXJlY3RpdmVcblx0dmFyIGRpcmVjdGl2ZSA9IHtcblx0XHRyZXN0cmljdDogXCJBRUNNXCIsXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2xvZ2luLXBhc3N3b3JkLmRpcmVjdGl2ZS5odG0nLFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0c2NvcGU6IHtcblx0XHRcdHBhc3N3b3JkOiBcIj1cIixcblx0XHRcdGFjdGl2ZTogXCI9XCJcblx0XHR9LFxuXHRcdGxpbms6IGxpbmtGdW5jLFxuXHRcdGNvbnRyb2xsZXI6IGxvZ2luUGFzc3dvcmRDb250cm9sbGVyLFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdH1cblxuXHQvKiBAbmdJbmplY3QgKi9cblx0ZnVuY3Rpb24gbGlua0Z1bmMoc2NvcGUsIGVsLCBhdHRyLCBjdHJsKSB7fVxuXG5cdGxvZ2luUGFzc3dvcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9nJ107XG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmdW5jdGlvbiBsb2dpblBhc3N3b3JkQ29udHJvbGxlcigkc2NvcGUsICRsb2cpIHtcblx0XHQvL2RlZmluZSBsb2NhbCB2YXJpYWJsZXNcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdH1cblxuXHQvL3Bhc3MgaXQgYmFja1xuXHRyZXR1cm4gZGlyZWN0aXZlO1xufSIsIi8qXG4qXHRGTEFWT1IgTUlYRVJcbipcbipcdFRoaXMgbW9kdWxlIGlzIGRlc2lnbmVkIHRvIGFsbG93IGN1c3RvbWVycyB0byBtaXggYW5kIG1hdGNoXG4qXHRvdXIgZGVsaWNpb3VzIGZsYXZvcnMgYW5kIHRvIHBpY2sgdGhpZXIgc2l6aW5nLlxuKi9cblxuYW5ndWxhclxuXHQubW9kdWxlKCdjbmUnKVxuXHQuZGlyZWN0aXZlKCdsb2dpblVzZXJuYW1lJywgbG9naW5Vc2VybmFtZSk7XG5cbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gbG9naW5Vc2VybmFtZSgpIHtcblx0Ly9kZWZpbmUgdGhlIGRpcmVjdGl2ZVxuXHR2YXIgZGlyZWN0aXZlID0ge1xuXHRcdHJlc3RyaWN0OiBcIkFFQ01cIixcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvbG9naW4tdXNlcm5hbWUuZGlyZWN0aXZlLmh0bScsXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRzY29wZToge1xuXHRcdFx0dXNlcm5hbWU6IFwiPVwiLFxuXHRcdFx0YWN0aXZlOiBcIj1cIlxuXHRcdH0sXG5cdFx0bGluazogbGlua0Z1bmMsXG5cdFx0Y29udHJvbGxlcjogbG9naW5Vc2VybmFtZUNvbnRyb2xsZXIsXG5cdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0fVxuXG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmdW5jdGlvbiBsaW5rRnVuYyhzY29wZSwgZWwsIGF0dHIsIGN0cmwpIHt9XG5cblx0bG9naW5Vc2VybmFtZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2cnXTtcblx0LyogQG5nSW5qZWN0ICovXG5cdGZ1bmN0aW9uIGxvZ2luVXNlcm5hbWVDb250cm9sbGVyKCRzY29wZSwgJGxvZykge1xuXHRcdC8vZGVmaW5lIGxvY2FsIHZhcmlhYmxlc1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0fVxuXG5cdC8vcGFzcyBpdCBiYWNrXG5cdHJldHVybiBkaXJlY3RpdmU7XG59IiwiLypcbipcbipcbiovXG5cbi8vZGVmaW5lIG1vZHVsZVxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2NuZScpXG4gICAgLmZhY3RvcnkoJ2ZpcmViYXNlU2VydmljZScsIGZpcmViYXNlU2VydmljZSk7XG5cbi8vZGVwZW5kZW5jeSBpbmplY3Rpb25zXG5maXJlYmFzZVNlcnZpY2UuJGluamVjdCA9IFsnJGZpcmViYXNlJywgJyRmaXJlYmFzZU9iamVjdCcsICckZmlyZWJhc2VBcnJheSddO1xuXG4vL2RlY2xhcmUgdGhlIHNlcnZpY2Vcbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gZmlyZWJhc2VTZXJ2aWNlKCRmaXJlYmFzZSwgJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSkge1xuXG5cdC8vZGVmaW5lIG1ldGhvZHNcblx0dmFyIEZCU2VydmljZSA9IHtcblx0XHRnZXQ6IHtcblx0XHRcdGN1c3RvbWVyX2xpc3Q6IGdldF9jdXN0b21lcl9saXN0XG5cdFx0fSxcblx0XHRhdXRoVXNlcjoge1xuXHRcdFx0ZW1haWw6IGF1dGhVc2VyX2VtYWlsXG5cdFx0fSxcblx0XHR0ZXN0OiB0ZXN0XG5cdH07XG5cblx0Ly9cdEFVVEhFTlRJQ0FURSBVU0VSXG5cdGZ1bmN0aW9uIGF1dGhVc2VyX2VtYWlsKGVtYWlsLCBwYXNzd29yZCkge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKCdhdXRoZW50aWNhdGluZyB1c2VyJylcblxuXHRcdC8vcmV0dXJuIGFzeW5jIHdvcmtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXG5cdFx0XHRmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoZW1haWwsIHBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uIHN1Y2VzcyhzKSB7XG5cblx0XHRcdFx0cmVzb2x2ZShzKTtcblxuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0Ly8gSGFuZGxlIEVycm9ycyBoZXJlLlxuXHRcdFx0XHR2YXIgZXJyb3JDb2RlID0gZXJyb3IuY29kZTtcblx0XHRcdFx0dmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG5cdFx0XHRcdHJlamVjdCh7Y29kZTogZXJyb3JDb2RlICwgbWVzc2FnZTogZXJyb3JNZXNzYWdlfSk7XG5cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0Ly9cdEdFVCBDVVNUT01FUiBMSVNUXG5cdGZ1bmN0aW9uIGdldF9jdXN0b21lcl9saXN0KCkge1xuXHRcdC8vZGVmaW5lIGxvY2FsIHZhcmlhYmxlc1xuXG5cdFx0Ly9jb25zb2xlLmxvZygnZ2V0dGluZyBjdXN0b21lciBsaXN0Jyk7XG5cblx0XHQvL3JldHVybiBhc3luYyB3b3JrXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgICAgIFxuXHQgICAgICAgIC8vdmFyIHRlc3QgPSBcblxuXHQgICAgICAgIC8vaGl0IHRoZSBzZXJ2ZXIgZm9yIHRoZSBcblx0ICAgICAgICByZXNvbHZlKFtcIm9uZVwiLCBcInR3b1wiLCAndGhyZWUnXSk7XG5cblx0ICAgIH0pO1xuXHR9XG5cblx0Ly9cdFRFU1QgRlVOQ1RJT05cblx0ZnVuY3Rpb24gdGVzdCgpIHsgcmV0dXJuKCdnb29kIHRlc3QgZnJvbSBGQiBTZXJ2aWNlJyk7IH07XG5cblx0Ly90dXJuIHRoZSBtZXRob2RcbiAgICByZXR1cm4gRkJTZXJ2aWNlO1x0XG59O1xuXG4iLCIvKlxuKlx0Uk9VVEVTLUNPTkZJR1xuKlxuKlx0VGhpcyBtb2R1bGUgc2V0cyB1cCBhbGwgdGhlIHJlcXVpcmVkIGFuZ3VsYXIgcm91dGVzIGZvciB0aGlzIHdlYiBhcHAuXG4qL1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2NuZScpXG4gICAgLmNvbmZpZyhjb25maWcpO1xuXG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIGNvbmZpZygkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblx0JGxvY2F0aW9uUHJvdmlkZXIuaGFzaFByZWZpeCgnJyk7XG4gICAgJHJvdXRlUHJvdmlkZXJcblx0Ly9QVUJMSUMgUk9VVEVTXG4gICAgLndoZW4oJy8nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbGFuZGluZ1BhZ2UuaHRtJywgICAgICAvLyd2aWV3cy9tYWluUGFnZS5odG0nXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsYW5kaW5nQ29udHJvbGxlcicsICAgICAgICAgICAvLydtYWluQ29udHJvbGxlcidcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nXG4gICAgfSlcbiAgICAud2hlbignL2N1c3RvbWVycycsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jdXN0b21lcnNQYWdlLmh0bScsICAgICAgLy8ndmlld3MvbWFpblBhZ2UuaHRtJ1xuICAgICAgICBjb250cm9sbGVyOiAnY3VzdG9tZXJzQ29udHJvbGxlcicsICAgICAgICAgICAvLydtYWluQ29udHJvbGxlcidcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICByZXNvbHZlOiB7IC8qIEBuZ0luamVjdCAqL1xuICAgICAgICAgICAgY3VzdG9tZXJMaXN0OiBjdXN0b21lckxpc3RcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLndoZW4oJy9sb2dpbicsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9sb2dpblBhZ2UuaHRtJywgICAgICAvLyd2aWV3cy9tYWluUGFnZS5odG0nXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLCAgICAgICAgICAgLy8nbWFpbkNvbnRyb2xsZXInXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgIH0pXG5cdC5vdGhlcndpc2Uoe1xuICAgICAgICByZWRpcmVjdFRvOiAnLydcbiAgICB9KTtcbn1cblxuLypcbiogICBSRVFVSVJFRCBGVU5DVElPTlNcbipcbiovXG5cbi8vICBDVVNUT01FUlMgTElTVFxuZnVuY3Rpb24gY3VzdG9tZXJMaXN0KCkge1xuICAgIFxuICAgIC8vcmV0dXJuIHRoZSBwcm9taXNlXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvL2hpdCB0aGUgc2VydmVyIGZvciB0aGUgXG4gICAgICAgIHJlc29sdmUoJ2dvb2QgdGVzdCcpO1xuICAgIH0pO1xuXG59O1xuXG4iXX0=
