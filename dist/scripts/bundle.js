config.$inject=["$routeProvider","$locationProvider"];var ahNuts=angular.module("cne",["ngRoute","firebase","ngSanitize"]);function customersController(e,t,o,s,n,r,l){var c=this;c.customerList=l(firebase.database().ref().child("customers")),c.customerSalesDays=[],c.selectedCustomer={seasons:{2018:{id:2018}}},c.testList=["a","b","c"],c.state={selected:{customer:{$index:"",$id:""}}},t.info("in the customers controller"),c.selectCustomer=function(e){c.state.selected.customer.$index=e,c.state.selected.customer.$id=c.customerList[e].$id,c.selectedCustomer=r(firebase.database().ref().child("customers").child(c.customerList[e].$id)),c.customerSalesDays=c.selectedCustomer.sales_days},c.updateCustomer=function(){c.selectedCustomer.$save().then(function(e){console.log("updated record successfully")}).catch(function(e){console.log("error updating record",e)})},c.changeRecord=function(e){c.state.selected.customer.$index;switch({prev:0,next:1}[e]){case 0:c.selectCustomer(c.state.selected.customer.$index-1);break;case 1:c.selectCustomer(c.state.selected.customer.$index+1)}},c.generate_bulk_salesdays=function(){console.log("generating bulk salesdays",c.selectedCustomer.sales_days)}}function landingController(e,t){t.info("in the landing controller")}function loginController(e,t,o){var s=this;s.credentials={username:"",password:""},s.active={username:!1,password:!1},s.submitCreds=function(e,t){console.log("submitCreds clicked"),o.authUser.email(e,t).then(function(e){console.log("was success",e)}).catch(function(e){console.log("Error:",e)})},t.info("in the login controller")}function salesDaysController(t,e,o,s,n,r,l){var c=this,a={date:"2018-05-05T06:00:00Z",wk_day:"Sat",id:"beaverton_fm_001",schedule:{load_in:"",load_out:"",open:"8:00 AM",close:"1:30 PM",sales_start:"",sales_end:""}};c.salesdaysList=s(firebase.database().ref().child("sales_days")),c.selectedRecord={id:"2039752"},c.testCustomers=["Beaverton","Orenco"],c.testSeasons=["2018","2017"],c.testTimes=["9:00 AM","9:15 AM","9:30 AM","9:45 AM"],c.scheduling_params={customer:"",season:"",bookend_dates:{first:"",last:""},repeats:"",event_days:{Mon:!1,Tue:!1,Wed:!1,Thu:!1,Fri:!1,Sat:!1,Sun:!1},same_day_load_in_out:!0,schedule:{load_in:"",load_out:"",open:"",close:"",sales_start:"",sales_end:""}},c.tempIterations=[a,a],e.info("in the sales days controller"),c.updateRecord=function(e){console.log("got this id",e)},c.addSalesDay=function(){c.salesdaysList.$add({date:(new Date).toISOString(),schedule:{load_in:{datetime:"",sales_day_id:""},load_out:{datetime:"",sales_day_id:""},open:"",close:"",sales_start:"",sales_end:""},customer:"",season:{name:"",frequency:"",instance:0,total:0}}).then(function(e){console.log(e.key),c.selectedRecord=n(firebase.database().ref().child("sales_days").child(e.key)),console.log(c.selectedRecord)}).catch(function(e){console.log("error",e)})},c.generateSalesDays=function(){var e;(e=c.scheduling_params,new Promise(function(t,o){l.sales_days.compile_batch(e).then(function(e){t(e)}).catch(function(e){o(e)})})).then(function(e){console.log("successfully built",e),c.tempIterations=e,t.$apply()}).catch(function(e){console.log(e)})}}function config(e,t){t.hashPrefix(""),e.when("/",{templateUrl:"views/landingPage.htm",controller:"landingController",controllerAs:"vm"}).when("/customers",{templateUrl:"views/customersPage.htm",controller:"customersController",controllerAs:"vm",resolve:{customerList:customerList}}).when("/salesdays",{templateUrl:"views/salesDaysPage.htm",controller:"salesDaysController",controllerAs:"vm"}).when("/login",{templateUrl:"views/loginPage.htm",controller:"loginController",controllerAs:"vm"}).otherwise({redirectTo:"/"})}function customerList(){return new Promise(function(e,t){e("good test")})}function customerList(){t.$inject=["scope","el","attr","ctrl"];var e={restrict:"AECM",templateUrl:"views/directives/customer-list.directive.htm",replace:!0,scope:{},link:t,controller:o,controllerAs:"vm",bindToController:!0};function t(e,t,o,s){}function o(e,t){console.log("in costomer List controller")}return o.$inject=["$scope","$log"],e}function loginPassword(){t.$inject=["scope","el","attr","ctrl"];var e={restrict:"AECM",templateUrl:"views/directives/login-password.directive.htm",replace:!0,scope:{password:"=",active:"="},link:t,controller:o,controllerAs:"vm",bindToController:!0};function t(e,t,o,s){}function o(e,t){}return o.$inject=["$scope","$log"],e}function loginUsername(){t.$inject=["scope","el","attr","ctrl"];var e={restrict:"AECM",templateUrl:"views/directives/login-username.directive.htm",replace:!0,scope:{username:"=",active:"="},link:t,controller:o,controllerAs:"vm",bindToController:!0};function t(e,t,o,s){}function o(e,t){}return o.$inject=["$scope","$log"],e}function dataService(s){return{sales_days:{compile_batch:function(e){return new Promise(function(t,o){s({method:"POST",url:"/api/sales_days/compile_new_sales_days_batch",headers:{"Content-Type":"application/json"},data:e}).then(function(e){t(e.data)},function(e){o(e)})})}}}}function firebaseService(e,t,o){return{get:{customer_list:function(){return new Promise(function(e,t){e(["one","two","three"])})}},authUser:{email:function(e,o){return console.log("authenticating user"),new Promise(function(t,s){firebase.auth().signInWithEmailAndPassword(e,o).then(function(e){t(e)}).catch(function(e){var t=e.code,o=e.message;s({code:t,message:o})})})}},test:function(){return"good test from FB Service"}}}angular.module("cne").controller("customersController",customersController),customersController.$inject=["$scope","$log","customerList","firebaseService","$firebase","$firebaseObject","$firebaseArray"],angular.module("cne").controller("landingController",landingController),landingController.$inject=["$scope","$log"],angular.module("cne").controller("loginController",loginController),loginController.$inject=["$scope","$log","firebaseService"],angular.module("cne").controller("salesDaysController",salesDaysController),salesDaysController.$inject=["$scope","$log","$firebase","$firebaseArray","$firebaseObject","$http","dataService"],angular.module("cne").config(config),angular.module("cne").directive("customerList",customerList),angular.module("cne").directive("loginPassword",loginPassword),angular.module("cne").directive("loginUsername",loginUsername),angular.module("cne").factory("dataService",dataService),dataService.$inject=["$http"],angular.module("cne").factory("firebaseService",firebaseService),firebaseService.$inject=["$firebase","$firebaseObject","$firebaseArray"];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdHMvd2ViYXBwLmpzIiwic2NyaXB0cy9jb250cm9sbGVycy9jdXN0b21lcnMtY29udHJvbGxlci5qcyIsInNjcmlwdHMvY29udHJvbGxlcnMvbGFuZGluZy1jb250cm9sbGVyLmpzIiwic2NyaXB0cy9jb250cm9sbGVycy9sb2dpbi1jb250cm9sbGVyLmpzIiwic2NyaXB0cy9jb250cm9sbGVycy9zYWxlc2RheXMtY29udHJvbGxlci5qcyIsInNjcmlwdHMvcm91dGVzL3JvdXRlcy1jb25maWcuanMiLCJzY3JpcHRzL2RpcmVjdGl2ZXMvY3VzdG9tZXItbGlzdC5qcyIsInNjcmlwdHMvZGlyZWN0aXZlcy9sb2dpbi1wYXNzd29yZC5kaXJlY3RpdmUuanMiLCJzY3JpcHRzL2RpcmVjdGl2ZXMvbG9naW4tdXNlcm5hbWUuZGlyZWN0aXZlLmpzIiwic2NyaXB0cy9mYWN0b3JpZXMvZGF0YS5zZXJ2aWNlLmpzIiwic2NyaXB0cy9mYWN0b3JpZXMvZmlyZWJhc2Uuc2VydmljZS5qcyJdLCJuYW1lcyI6WyJhaE51dHMiLCJhbmd1bGFyIiwibW9kdWxlIiwiY3VzdG9tZXJzQ29udHJvbGxlciIsIiRzY29wZSIsIiRsb2ciLCJjdXN0b21lckxpc3QiLCJmaXJlYmFzZVNlcnZpY2UiLCIkZmlyZWJhc2UiLCIkZmlyZWJhc2VPYmplY3QiLCIkZmlyZWJhc2VBcnJheSIsInZtIiwidGhpcyIsImZpcmViYXNlIiwiZGF0YWJhc2UiLCJyZWYiLCJjaGlsZCIsImN1c3RvbWVyU2FsZXNEYXlzIiwic2VsZWN0ZWRDdXN0b21lciIsInNlYXNvbnMiLCIyMDE4IiwiaWQiLCJ0ZXN0TGlzdCIsInN0YXRlIiwic2VsZWN0ZWQiLCJjdXN0b21lciIsIiRpbmRleCIsIiRpZCIsImluZm8iLCJzZWxlY3RDdXN0b21lciIsImluZGV4X2lkIiwic2FsZXNfZGF5cyIsInVwZGF0ZUN1c3RvbWVyIiwiJHNhdmUiLCJ0aGVuIiwicyIsImNvbnNvbGUiLCJsb2ciLCJjYXRjaCIsImUiLCJjaGFuZ2VSZWNvcmQiLCJzZWxlY3QiLCJwcmV2IiwibmV4dCIsImdlbmVyYXRlX2J1bGtfc2FsZXNkYXlzIiwibGFuZGluZ0NvbnRyb2xsZXIiLCJsb2dpbkNvbnRyb2xsZXIiLCJjcmVkZW50aWFscyIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJhY3RpdmUiLCJzdWJtaXRDcmVkcyIsInBhc3MiLCJhdXRoVXNlciIsImVtYWlsIiwic2FsZXNEYXlzQ29udHJvbGxlciIsIiRodHRwIiwiZGF0YVNlcnZpY2UiLCJpdGVyYXRpb24iLCJkYXRlIiwid2tfZGF5Iiwic2NoZWR1bGUiLCJsb2FkX2luIiwibG9hZF9vdXQiLCJvcGVuIiwiY2xvc2UiLCJzYWxlc19zdGFydCIsInNhbGVzX2VuZCIsInNhbGVzZGF5c0xpc3QiLCJzZWxlY3RlZFJlY29yZCIsInRlc3RDdXN0b21lcnMiLCJ0ZXN0U2Vhc29ucyIsInRlc3RUaW1lcyIsInNjaGVkdWxpbmdfcGFyYW1zIiwic2Vhc29uIiwiYm9va2VuZF9kYXRlcyIsImZpcnN0IiwibGFzdCIsInJlcGVhdHMiLCJldmVudF9kYXlzIiwiTW9uIiwiVHVlIiwiV2VkIiwiVGh1IiwiRnJpIiwiU2F0IiwiU3VuIiwic2FtZV9kYXlfbG9hZF9pbl9vdXQiLCJ0ZW1wSXRlcmF0aW9ucyIsInVwZGF0ZVJlY29yZCIsInJlY29yZF9pZCIsImFkZFNhbGVzRGF5IiwiJGFkZCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImRhdGV0aW1lIiwic2FsZXNfZGF5X2lkIiwibmFtZSIsImZyZXF1ZW5jeSIsImluc3RhbmNlIiwidG90YWwiLCJrZXkiLCJnZW5lcmF0ZVNhbGVzRGF5cyIsInBhcmFtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tcGlsZV9iYXRjaCIsIiRhcHBseSIsImNvbmZpZyIsIiRyb3V0ZVByb3ZpZGVyIiwiJGxvY2F0aW9uUHJvdmlkZXIiLCJoYXNoUHJlZml4Iiwid2hlbiIsInRlbXBsYXRlVXJsIiwiY29udHJvbGxlciIsImNvbnRyb2xsZXJBcyIsIm90aGVyd2lzZSIsInJlZGlyZWN0VG8iLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInJlcGxhY2UiLCJzY29wZSIsImxpbmsiLCJsaW5rRnVuYyIsImN1c3RvbWVyTGlzdENvbnRyb2xsZXIiLCJiaW5kVG9Db250cm9sbGVyIiwiZWwiLCJhdHRyIiwiY3RybCIsIiRpbmplY3QiLCJsb2dpblBhc3N3b3JkIiwibG9naW5QYXNzd29yZENvbnRyb2xsZXIiLCJsb2dpblVzZXJuYW1lIiwibG9naW5Vc2VybmFtZUNvbnRyb2xsZXIiLCJtZXRob2QiLCJ1cmwiLCJoZWFkZXJzIiwiQ29udGVudC1UeXBlIiwiZGF0YSIsInJlc3BvbnNlIiwiZXJyb3IiLCJnZXQiLCJjdXN0b21lcl9saXN0IiwiYXV0aCIsInNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIiwiZXJyb3JDb2RlIiwiY29kZSIsImVycm9yTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0ZXN0IiwiZmFjdG9yeSJdLCJtYXBwaW5ncyI6InNEQUNBLElBQUFBLE9BQUFDLFFBQUFDLE9BQUEsTUFBQSxDQUFBLFVBQUEsV0FBQSxlQ01BLFNBQUFDLG9CQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxHQUdBLElBQUFDLEVBQUFDLEtBQ0FELEVBQUFMLGFBQUFJLEVBQUFHLFNBQUFDLFdBQUFDLE1BQUFDLE1BQUEsY0FDQUwsRUFBQU0sa0JBQUEsR0FDQU4sRUFBQU8saUJBQUEsQ0FBQUMsUUFBQSxDQUFBQyxLQUFBLENBQUFDLEdBQUEsUUFDQVYsRUFBQVcsU0FBQSxDQUFBLElBQUEsSUFBQSxLQUNBWCxFQUFBWSxNQUFBLENBQ0FDLFNBQUEsQ0FDQUMsU0FBQSxDQUNBQyxPQUFBLEdBQ0FDLElBQUEsTUFPQXRCLEVBQUF1QixLQUFBLCtCQXFDQWpCLEVBQUFrQixlQUFBLFNBQUFDLEdBRUFuQixFQUFBWSxNQUFBQyxTQUFBQyxTQUFBQyxPQUFBSSxFQUNBbkIsRUFBQVksTUFBQUMsU0FBQUMsU0FBQUUsSUFBQWhCLEVBQUFMLGFB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QUEsZ0JBQUFZLGVDRkFsSSxRQUNBQyxPQUFBLE9BQ0FxSCxVQUFBLGdCQUFBYyxlQ0hBcEksUUFDQUMsT0FBQSxPQUNBcUosUUFBQSxjQUFBOUYsYUFHQUEsWUFBQXlFLFFBQUEsQ0FBQSxTQ0xBakksUUFDQUMsT0FBQSxPQUNBcUosUUFBQSxrQkFBQWhKLGlCQUdBQSxnQkFBQTJILFFBQUEsQ0FBQSxZQUFBLGtCQUFBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1PRFVMRVxudmFyIGFoTnV0cyA9IGFuZ3VsYXIubW9kdWxlKCdjbmUnLCBbJ25nUm91dGUnLCAnZmlyZWJhc2UnLCAnbmdTYW5pdGl6ZSddKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbmUnKVxuICAgIC5jb250cm9sbGVyKCdjdXN0b21lcnNDb250cm9sbGVyJywgY3VzdG9tZXJzQ29udHJvbGxlcik7XG5cbmN1c3RvbWVyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvZycsICdjdXN0b21lckxpc3QnLCAnZmlyZWJhc2VTZXJ2aWNlJywgJyRmaXJlYmFzZScsICckZmlyZWJhc2VPYmplY3QnLCAnJGZpcmViYXNlQXJyYXknXTtcblxuLyogQG5nSW5qZWN0ICovXG5mdW5jdGlvbiBjdXN0b21lcnNDb250cm9sbGVyKCRzY29wZSwgJGxvZywgY3VzdG9tZXJMaXN0LCBmaXJlYmFzZVNlcnZpY2UsICRmaXJlYmFzZSwgJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSkge1xuXG5cdC8vZGVmaW5lIHZpZXcgbW9kZWwgdmFyaWFibGVcblx0dmFyIHZtID0gdGhpcztcblx0dm0uY3VzdG9tZXJMaXN0ID0gJGZpcmViYXNlQXJyYXkoZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKS5jaGlsZCgnY3VzdG9tZXJzJykpO1xuXHR2bS5jdXN0b21lclNhbGVzRGF5cyA9IFtdO1xuXHR2bS5zZWxlY3RlZEN1c3RvbWVyID0geyBzZWFzb25zOiB7IFwiMjAxOFwiOiB7IGlkOiAyMDE4fSB9IH07XG5cdHZtLnRlc3RMaXN0ID0gWydhJywgJ2InLCAnYyddOyAvLyRmaXJlYmFzZUFycmF5KGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKCkuY2hpbGQoJ2N1c3RvbWVycycpLmNoaWxkKCdjdXN0b21lcl9saXN0JykpO1xuXHR2bS5zdGF0ZSA9IHtcblx0XHRzZWxlY3RlZDoge1xuXHRcdFx0Y3VzdG9tZXI6IHtcblx0XHRcdFx0JGluZGV4OiBcIlwiLFxuXHRcdFx0XHQkaWQ6IFwiXCIsXG5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly9pZGVudGlmeSB3aGVyZSB3ZSBhcmVcblx0JGxvZy5pbmZvKCdpbiB0aGUgY3VzdG9tZXJzIGNvbnRyb2xsZXInKTtcdC8vVE9ETzogVEFLRSBUSElTIE9VVCBMQVRFUlxuXHRcblxuXHQvKlxuXHQqXHRMT0NBTCBGVU5DVElPTlMgR08gSEVSRVxuXHQqXG5cdCovXG5cblx0Ly9cdExPQUQgQ1VTVE9NRVIgTElTVFxuXHRmdW5jdGlvbiBsb2FkX2N1c3RvbWVyX2xpc3QoKSB7XG5cdFx0XG5cdFx0Ly90cmFjayBzdGFydGluZyBmdW5jdGlvblxuXHRcdC8vY29uc29sZS5sb2coJ2xvYWRpbmcgdGhlIGN1c3RvbWVyIGxpc3QnKTtcblx0XHRcblx0XHQvL2dhdGhlciB0aGUgZGF0YVxuXHRcdGZpcmViYXNlU2VydmljZS5nZXQuY3VzdG9tZXJfbGlzdCgpLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhzKSB7XG5cdFx0XHRcblx0XHRcdC8vY29uc29sZS5sb2coJ2dvdCB0aGlzIHJlc3BvbnMnLCBzKTtcblx0XHRcdFxuXHRcdFx0Ly93aGVuIHRoZSBsaXN0IGhhcyBiZWVuIGxvYWRlZCB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuXHRcdFx0Ly92bS5jdXN0b21lckxpc3QgPSBzO1xuXHRcdFx0dm0uY3VzdG9tZXJMaXN0ID0gJGZpcmViYXNlQXJyYXkoZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKS5jaGlsZCgnY3VzdG9tZXJzJykuY2hpbGQoJ2N1c3RvbWVyX2xpc3QnKSk7XG5cblx0XHRcdC8vcmVmbGVjdCB0aGUgY2hhbmdlc1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xuXHRcdFx0Ly9pZiB0aGVyZSB3YXMgYW4gZXJyb3IgdGhyb3cgdGhlIGVycm9yXG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InKTtcblx0XHR9KTtcblx0fTtcblxuXHQvKlxuXHQqXHRWSUVXIE1PREVMIEZVTkNUSU9OUyBHTyBIRVJFXG5cdCpcblx0Ki9cdFxuXHQvL1x0U0VMRUNUIENMSUNLRUQgQ1VTVE9NRVJcblx0dm0uc2VsZWN0Q3VzdG9tZXIgPSBmdW5jdGlvbihpbmRleF9pZCkge1xuXHRcdC8vZGVmaW5lIGxvY2FsIHZhcmlhYmxlc1xuXHRcdHZtLnN0YXRlLnNlbGVjdGVkLmN1c3RvbWVyLiRpbmRleCA9IGluZGV4X2lkO1xuXHRcdHZtLnN0YXRlLnNlbGVjdGVkLmN1c3RvbWVyLiRpZCA9IHZtLmN1c3RvbWVyTGlzdFtpbmRleF9pZF0uJGlkO1xuXHRcdHZtLnNlbGVjdGVkQ3VzdG9tZXIgPSAkZmlyZWJhc2VPYmplY3QoZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKS5jaGlsZCgnY3VzdG9tZXJzJykuY2hpbGQodm0uY3VzdG9tZXJMaXN0W2luZGV4X2lkXS4kaWQpKTtcblx0XHR2bS5jdXN0b21lclNhbGVzRGF5cyA9IHZtLnNlbGVjdGVkQ3VzdG9tZXIuc2FsZXNfZGF5cztcblx0fTtcblxuXHQvL1x0VVBEQVRFIFRIRSBDVVNUT01FUiBSRUNPUkRcblx0dm0udXBkYXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5zZWxlY3RlZEN1c3RvbWVyLiRzYXZlKCkudGhlbihmdW5jdGlvbiBzdWNjZXMocykge1xuXHRcdFx0Y29uc29sZS5sb2coJ3VwZGF0ZWQgcmVjb3JkIHN1Y2Nlc3NmdWxseScpO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvciB1cGRhdGluZyByZWNvcmQnLCBlKTtcblx0XHR9KTtcblx0fTtcblxuXHQvL1x0TU9WRSBUTyBUSEUgTkVYVCBDVVNUT01FUlxuXHR2bS5jaGFuZ2VSZWNvcmQgPSBmdW5jdGlvbihzZWxlY3QpIHtcblx0XHQvL2RlZmluZSBsb2NhbCB2YXJpYWJsZXNcblx0XHR2YXIgb3B0biA9IHsgXCJwcmV2XCI6IDAsIFwibmV4dFwiOiAxIH07XG5cdFx0dmFyIGluZGV4X2lkID0gdm0uc3RhdGUuc2VsZWN0ZWQuY3VzdG9tZXIuJGluZGV4O1xuXG5cdFx0Ly9jb25zb2xlLmxvZyhpbmRleF9pZCk7XG5cblx0XHRzd2l0Y2gob3B0bltzZWxlY3RdKSB7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ3ByZXZpb3VzIHJlY29yZCcpO1xuXHRcdFx0XHR2bS5zZWxlY3RDdXN0b21lcih2bS5zdGF0ZS5zZWxlY3RlZC5jdXN0b21lci4kaW5kZXggLSAxKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ25leHQgcmVjb3JkJyk7XG5cdFx0XHRcdHZtLnNlbGVjdEN1c3RvbWVyKHZtLnN0YXRlLnNlbGVjdGVkLmN1c3RvbWVyLiRpbmRleCArIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fTtcblxuXHQvL1x0R0VORVJBVEUgQlVMSyBTQUxFUyBEQVlTXG5cdHZtLmdlbmVyYXRlX2J1bGtfc2FsZXNkYXlzID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly9kZWZpbmUgbG9jYWwgdmFyaWFibGVzXG5cdFx0Y29uc29sZS5sb2coJ2dlbmVyYXRpbmcgYnVsayBzYWxlc2RheXMnLCB2bS5zZWxlY3RlZEN1c3RvbWVyLnNhbGVzX2RheXMpO1xuXHRcdFxuXHRcdC8qaWYodm0uc2VsZWN0ZWRDdXN0b21lci5zYWxlc19kYXlzWzBdID09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3NhbGVzIGRheXMgdW5kZWZpbmVkJylcblx0XHRcdHZtLnNlbGVjdGVkQ3VzdG9tZXIuc2FsZXNfZGF5c1swXSA9IFwiYW9pc2dvaTIzb2Jzb2IyM29paHNzXCJcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coJ3NhbGVzIGRheXMgZGVmaW5lZCcpO1xuXHRcdFx0dmFyIGxhc3RrZXkgPSAwO1xuXHRcdFx0T2JqZWN0LmtleXModm0uc2VsZWN0ZWRDdXN0b21lci5zYWxlc19kYXlzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYoa2V5ICE9ICdwbGFjZWhvbGRlcicpIGxhc3RrZXkgPSBwYXJzZUludChrZXkpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zZWxlY3RlZEN1c3RvbWVyLnNhbGVzX2RheXNbbGFzdGtleSArIDFdID0gXCJhb3NpZ2hhb2lzaGdpb2hzZ1wiXG5cdFx0fVxuXG5cdFx0Ly9zYXZlIHZhbHVlc1xuXHRcdHZtLnVwZGF0ZUN1c3RvbWVyKCk7Ki9cblx0fTtcblxuXHQvL3J1biB0aGUgdGVzdFxuXG5cdC8vb24gcGFnZSBsb2FkXG5cdC8vbG9hZF9jdXN0b21lcl9saXN0KCk7XG5cblxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbmUnKVxuICAgIC5jb250cm9sbGVyKCdsYW5kaW5nQ29udHJvbGxlcicsIGxhbmRpbmdDb250cm9sbGVyKTtcblxubGFuZGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvZyddO1xuXG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIGxhbmRpbmdDb250cm9sbGVyKCRzY29wZSwgJGxvZykge1xuXG5cdC8vZGVmaW5lIHZpZXcgbW9kZWwgdmFyaWFibGVcblx0dmFyIHZtID0gdGhpcztcblxuXHQkbG9nLmluZm8oJ2luIHRoZSBsYW5kaW5nIGNvbnRyb2xsZXInKTtcdC8vVE9ETzogVEFLRSBUSElTIE9VVCBMQVRFUlxuXG5cdC8vZGVmaW5lIGxvY2FsIGZ1bmN0aW9uc1xuXG5cdC8vcnVuIHRoZSB0ZXN0XG5cblxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbmUnKVxuICAgIC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBsb2dpbkNvbnRyb2xsZXIpO1xuXG5sb2dpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvZycsICdmaXJlYmFzZVNlcnZpY2UnXTtcblxuLyogQG5nSW5qZWN0ICovXG5mdW5jdGlvbiBsb2dpbkNvbnRyb2xsZXIoJHNjb3BlLCAkbG9nLCBmaXJlYmFzZVNlcnZpY2UpIHtcblxuXHQvL2RlZmluZSB2aWV3IG1vZGVsIHZhcmlhYmxlXG5cdHZhciB2bSA9IHRoaXM7XG5cblx0Ly9kZWZpbmUgdmlldyBtb2RlbCB2YXJpYWJsZXNcblx0dm0uY3JlZGVudGlhbHMgPSB7XG5cdFx0dXNlcm5hbWU6IFwiXCIsXG5cdFx0cGFzc3dvcmQ6IFwiXCJcblx0fTtcblxuXHR2bS5hY3RpdmUgPSB7XG5cdFx0dXNlcm5hbWU6IGZhbHNlLFxuXHRcdHBhc3N3b3JkOiBmYWxzZVxuXHR9O1xuXG5cdC8vZGVmaW5lIHZpZXcgbW9kZWwgZnVuY3Rpb25zXG5cdHZtLnN1Ym1pdENyZWRzID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3MpIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZygnc3VibWl0Q3JlZHMgY2xpY2tlZCcpO1xuXHRcdFxuXHRcdC8vc3VibWl0IGNyZWRlbnRpYWxzXG5cdFx0ZmlyZWJhc2VTZXJ2aWNlLmF1dGhVc2VyLmVtYWlsKHVzZXJuYW1lLCBwYXNzKS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MgKHMpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coJ3dhcyBzdWNjZXNzJywgcyk7XG5cblx0XHR9KS5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yOlwiLCBlKTtcblx0XHR9KTtcblxuXHR9O1xuXG5cdCRsb2cuaW5mbygnaW4gdGhlIGxvZ2luIGNvbnRyb2xsZXInKTtcdC8vVE9ETzogVEFLRSBUSElTIE9VVCBMQVRFUlxuXG5cdC8vZGVmaW5lIGxvY2FsIGZ1bmN0aW9uc1xuXG5cdC8vcnVuIHRoZSB0ZXN0XG5cblxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbmUnKVxuICAgIC5jb250cm9sbGVyKCdzYWxlc0RheXNDb250cm9sbGVyJywgc2FsZXNEYXlzQ29udHJvbGxlcik7XG5cbnNhbGVzRGF5c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvZycsICckZmlyZWJhc2UnLCAnJGZpcmViYXNlQXJyYXknLCAnJGZpcmViYXNlT2JqZWN0JywgJyRodHRwJywgJ2RhdGFTZXJ2aWNlJ107XG5cbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gc2FsZXNEYXlzQ29udHJvbGxlcigkc2NvcGUsICRsb2csICRmaXJlYmFzZSwgJGZpcmViYXNlQXJyYXksICRmaXJlYmFzZU9iamVjdCwgJGh0dHAsIGRhdGFTZXJ2aWNlKSB7XG5cblx0Ly9kZWZpbmUgdmlldyBtb2RlbCB2YXJpYWJsZVxuXHR2YXIgdm0gPSB0aGlzO1xuXHR2YXIgaXRlcmF0aW9uID0ge1xuXHRcdGRhdGU6IFwiMjAxOC0wNS0wNVQwNjowMDowMFpcIixcblx0XHR3a19kYXk6IFwiU2F0XCIsXG5cdFx0aWQ6IFwiYmVhdmVydG9uX2ZtXzAwMVwiLFxuXHRcdHNjaGVkdWxlOiB7XG5cdFx0XHRsb2FkX2luOiBcIlwiLFxuXHRcdFx0bG9hZF9vdXQ6IFwiXCIsXG5cdFx0XHRvcGVuOiBcIjg6MDAgQU1cIixcblx0XHRcdGNsb3NlOiBcIjE6MzAgUE1cIixcblx0XHRcdHNhbGVzX3N0YXJ0OiBcIlwiLFxuXHRcdFx0c2FsZXNfZW5kOiBcIlwiXG5cdFx0fVxuXHR9O1xuXHR2bS5zYWxlc2RheXNMaXN0ID0gJGZpcmViYXNlQXJyYXkoZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKS5jaGlsZCgnc2FsZXNfZGF5cycpKTtcblx0dm0uc2VsZWN0ZWRSZWNvcmQgPSB7IGlkOiBcIjIwMzk3NTJcIiB9O1xuXHR2bS50ZXN0Q3VzdG9tZXJzID0gWyBcIkJlYXZlcnRvblwiLCBcIk9yZW5jb1wiIF07XG5cdHZtLnRlc3RTZWFzb25zID0gWyAnMjAxOCcsICcyMDE3JyBdO1xuXHQvL3ZtLnJlcGVhdHMgPSBbICduZXZlcicsIFwiZXZlcnkgd2Vla1wiLCBcImV2ZXJ5IDIgd2Vla3NcIiwgXCJldmVyeSAzIHdlZWtzXCIsIFwiZXZlcnlfNF93ZWVrc1wiLCBcImV2ZXJ5XzVfd2Vla3NcIiwgXCJldmVyeV82X3dlZWtzXCIsIFwiZXZlcnlfN193ZWVrc1wiLCBcImV2ZXJ5Xzhfd2Vla3NcIiBdO1xuXHR2bS50ZXN0VGltZXMgPSBbICc5OjAwIEFNJywnOToxNSBBTScsJzk6MzAgQU0nLCc5OjQ1IEFNJyAgXTtcblx0dm0uc2NoZWR1bGluZ19wYXJhbXMgPSB7XG5cdFx0Y3VzdG9tZXI6IFwiXCIsXG5cdFx0c2Vhc29uOiBcIlwiLFxuXHRcdGJvb2tlbmRfZGF0ZXM6IHtcblx0XHRcdGZpcnN0OiBcIlwiLFxuXHRcdFx0bGFzdDogXCJcIlxuXHRcdH0sXG5cdFx0cmVwZWF0czogXCJcIixcblx0XHRldmVudF9kYXlzOiB7XG5cdFx0XHRNb246IGZhbHNlLFxuXHRcdFx0VHVlOiBmYWxzZSxcblx0XHRcdFdlZDogZmFsc2UsXG5cdFx0XHRUaHU6IGZhbHNlLFxuXHRcdFx0RnJpOiBmYWxzZSxcblx0XHRcdFNhdDogZmFsc2UsXG5cdFx0XHRTdW46IGZhbHNlXG5cdFx0fSxcblx0XHRzYW1lX2RheV9sb2FkX2luX291dDogdHJ1ZSxcblx0XHRzY2hlZHVsZToge1xuXHRcdFx0bG9hZF9pbjogXCJcIixcblx0XHRcdGxvYWRfb3V0OiBcIlwiLFxuXHRcdFx0b3BlbjogXCJcIixcblx0XHRcdGNsb3NlOiBcIlwiLFxuXHRcdFx0c2FsZXNfc3RhcnQ6IFwiXCIsXG5cdFx0XHRzYWxlc19lbmQ6IFwiXCJcblx0XHR9XG5cdH07XG5cdHZtLnRlbXBJdGVyYXRpb25zID0gW2l0ZXJhdGlvbiwgaXRlcmF0aW9uXTtcblxuXHQvL2lkZW50aWZ5IGNvbnRyb2xsZXJcblx0JGxvZy5pbmZvKCdpbiB0aGUgc2FsZXMgZGF5cyBjb250cm9sbGVyJyk7XHQvL1RPRE86IFRBS0UgVEhJUyBPVVQgTEFURVJcblxuXHQvKlxuXHQqXHRMT0NBTCBGVU5DVElPTlMgR08gSEVSRVxuXHQqXG5cdCovXG5cdGZ1bmN0aW9uIGJ1aWxkX3NhbGVzX2RheXNfYXJyYXkocGFyYW1zKSB7XG5cdFx0Ly9sb2NhbCB2YXJpYWJsZXNcblxuXHRcdC8vY29uc29sZS5sb2coJ2dvdCB0aGVzZSBwYXJhbXMnLCBzdGFydCwgZW5kKTtcblxuXHRcdC8vcmV0dXJuIGFzeW5jIHdvcmtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHQvL2FjY2VzcyBkYXRhIHNlcnZpY2Vcblx0XHRcdGRhdGFTZXJ2aWNlLnNhbGVzX2RheXMuY29tcGlsZV9iYXRjaChwYXJhbXMpLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhzKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ3N1Y2Nlc3MnLCBzKTtcblx0XHRcdFx0cmVzb2x2ZShzKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnZXJyb3InLCBlKTtcblx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0fSk7XG5cblx0XHR9KTtcblxuXHR9O1xuXG5cblx0Lypcblx0Klx0VklFVyBNT0RFTCBGVU5DVElPTlMgR08gSEVSRVxuXHQqXG5cdCovXG5cdC8vXHRVUERBVEUgUkVDT1JEXG5cdHZtLnVwZGF0ZVJlY29yZCA9IGZ1bmN0aW9uKHJlY29yZF9pZCkge1xuXHRcdGNvbnNvbGUubG9nKCdnb3QgdGhpcyBpZCcsIHJlY29yZF9pZCk7XG5cdFx0Lyp2bS5zYWxlc2RheXNMaXN0LiRzYXZlKHJlY29yZF9pZCkudGhlbihmdW5jdGlvbiBzdWNjZXMocykge1xuXHRcdFx0Y29uc29sZS5sb2coJ3VwZGF0ZWQgcmVjb3JkIHN1Y2Nlc3NmdWxseScpO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvciB1cGRhdGluZyByZWNvcmQnLCBlKTtcblx0XHR9KTsqL1xuXHR9O1xuXG5cdC8vIEFERCBORVcgU0FMRVMgREFZXG5cdHZtLmFkZFNhbGVzRGF5ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2bS5zYWxlc2RheXNMaXN0LiRhZGQoe1xuXHRcdFx0ZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0c2NoZWR1bGU6IHtcblx0XHRcdFx0bG9hZF9pbjoge1xuXHRcdFx0XHRcdGRhdGV0aW1lOiBcIlwiLFxuXHRcdFx0XHRcdHNhbGVzX2RheV9pZDogXCJcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsb2FkX291dDoge1xuXHRcdFx0XHRcdGRhdGV0aW1lOiBcIlwiLFxuXHRcdFx0XHRcdHNhbGVzX2RheV9pZDogXCJcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvcGVuOiBcIlwiLFxuXHRcdFx0XHRjbG9zZTogXCJcIixcblx0XHRcdFx0c2FsZXNfc3RhcnQ6IFwiXCIsXG5cdFx0XHRcdHNhbGVzX2VuZDogXCJcIlxuXHRcdFx0fSxcblx0XHRcdGN1c3RvbWVyOiBcIlwiLFxuXHRcdFx0c2Vhc29uOiB7XG5cdFx0XHRcdG5hbWU6IFwiXCIsXG5cdFx0XHRcdGZyZXF1ZW5jeTogXCJcIixcblx0XHRcdFx0aW5zdGFuY2U6IDAsXG5cdFx0XHRcdHRvdGFsOiAwXG5cdFx0XHR9XG5cdFx0fSkudGhlbihmdW5jdGlvbiBzdWNjZXNzKHMpIHtcblx0XHRcdC8vc2V0IHRoZSBmaXJlYmFzZSBvYmplY3Rcblx0XHRcdGNvbnNvbGUubG9nKHMua2V5KTtcblx0XHRcdHZtLnNlbGVjdGVkUmVjb3JkID0gJGZpcmViYXNlT2JqZWN0KGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKCkuY2hpbGQoJ3NhbGVzX2RheXMnKS5jaGlsZChzLmtleSkpO1xuXHRcdFx0Y29uc29sZS5sb2codm0uc2VsZWN0ZWRSZWNvcmQpO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xuXHRcdH0pO1xuXG5cdFx0Lyp2bS5zYWxlc2RheXNMaXN0LnNhdmUoKS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3Mocykge1xuXHRcdFx0Y29uc29sZS5sb2coJ3N1Y2Nlc3MnLCBzKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcblx0XHR9KTsqL1xuXG5cdH07XG5cblx0Ly8gR0VORVJBVEUgU0FMRVMgREFZU1xuXHR2bS5nZW5lcmF0ZVNhbGVzRGF5cyA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vZGVmaW5lIGxvY2FsIHZhcmlhYmxlc1xuXG5cdFx0Ly9ub3RpZnkgb2YgbG9jYXRpb25cblx0XHQvL2NvbnNvbGUubG9nKCdnZW5lcmF0aW5nIFNhbGVzIGRheXMnLCB2bS5zY2hlZHVsaW5nX3BhcmFtcyk7XG5cblx0XHRidWlsZF9zYWxlc19kYXlzX2FycmF5KHZtLnNjaGVkdWxpbmdfcGFyYW1zKS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3Mocykge1xuXHRcdFx0Y29uc29sZS5sb2coJ3N1Y2Nlc3NmdWxseSBidWlsdCcsIHMpO1xuXHRcdFx0dm0udGVtcEl0ZXJhdGlvbnMgPSBzO1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0Ly9ydW4gdGhlIHRlc3RcblxuXG59IiwiLypcbipcdFJPVVRFUy1DT05GSUdcbipcbipcdFRoaXMgbW9kdWxlIHNldHMgdXAgYWxsIHRoZSByZXF1aXJlZCBhbmd1bGFyIHJvdXRlcyBmb3IgdGhpcyB3ZWIgYXBwLlxuKi9cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbmUnKVxuICAgIC5jb25maWcoY29uZmlnKTtcblxuLyogQG5nSW5qZWN0ICovXG5mdW5jdGlvbiBjb25maWcoJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdCRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoJycpO1xuICAgICRyb3V0ZVByb3ZpZGVyXG5cdC8vUFVCTElDIFJPVVRFU1xuICAgIC53aGVuKCcvJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2xhbmRpbmdQYWdlLmh0bScsICAgICAgLy8ndmlld3MvbWFpblBhZ2UuaHRtJ1xuICAgICAgICBjb250cm9sbGVyOiAnbGFuZGluZ0NvbnRyb2xsZXInLCAgICAgICAgICAgLy8nbWFpbkNvbnRyb2xsZXInXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgIH0pXG4gICAgLndoZW4oJy9jdXN0b21lcnMnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY3VzdG9tZXJzUGFnZS5odG0nLCAgICAgIC8vJ3ZpZXdzL21haW5QYWdlLmh0bSdcbiAgICAgICAgY29udHJvbGxlcjogJ2N1c3RvbWVyc0NvbnRyb2xsZXInLCAgICAgICAgICAgLy8nbWFpbkNvbnRyb2xsZXInXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgcmVzb2x2ZTogeyAvKiBAbmdJbmplY3QgKi9cbiAgICAgICAgICAgIGN1c3RvbWVyTGlzdDogY3VzdG9tZXJMaXN0XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC53aGVuKCcvc2FsZXNkYXlzJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NhbGVzRGF5c1BhZ2UuaHRtJywgICAgICAvLyd2aWV3cy9tYWluUGFnZS5odG0nXG4gICAgICAgIGNvbnRyb2xsZXI6ICdzYWxlc0RheXNDb250cm9sbGVyJywgICAgICAgICAgIC8vJ21haW5Db250cm9sbGVyJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcbiAgICB9KVxuICAgIC53aGVuKCcvbG9naW4nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbG9naW5QYWdlLmh0bScsICAgICAgLy8ndmlld3MvbWFpblBhZ2UuaHRtJ1xuICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJywgICAgICAgICAgIC8vJ21haW5Db250cm9sbGVyJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcbiAgICB9KVxuXHQub3RoZXJ3aXNlKHtcbiAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgfSk7XG59XG5cbi8qXG4qICAgUkVRVUlSRUQgRlVOQ1RJT05TXG4qXG4qL1xuXG4vLyAgQ1VTVE9NRVJTIExJU1RcbmZ1bmN0aW9uIGN1c3RvbWVyTGlzdCgpIHtcbiAgICBcbiAgICAvL3JldHVybiB0aGUgcHJvbWlzZVxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgLy9oaXQgdGhlIHNlcnZlciBmb3IgdGhlIFxuICAgICAgICByZXNvbHZlKCdnb29kIHRlc3QnKTtcbiAgICB9KTtcblxufTtcblxuIiwiLypcbipcdENVU1RPTUVSIExJU1RcbipcbipcdFRoaXMgbW9kdWxlIGlzIGRlc2lnbmVkIHRvIFxuKi9cblxuYW5ndWxhclxuXHQubW9kdWxlKCdjbmUnKVxuXHQuZGlyZWN0aXZlKCdjdXN0b21lckxpc3QnLCBjdXN0b21lckxpc3QpO1xuXG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIGN1c3RvbWVyTGlzdCgpIHtcblx0Ly9kZWZpbmUgdGhlIGRpcmVjdGl2ZVxuXHR2YXIgZGlyZWN0aXZlID0ge1xuXHRcdHJlc3RyaWN0OiBcIkFFQ01cIixcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY3VzdG9tZXItbGlzdC5kaXJlY3RpdmUuaHRtJyxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHNjb3BlOiB7XG5cdFx0fSxcblx0XHRsaW5rOiBsaW5rRnVuYyxcblx0XHRjb250cm9sbGVyOiBjdXN0b21lckxpc3RDb250cm9sbGVyLFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdH1cblxuXHQvKiBAbmdJbmplY3QgKi9cblx0ZnVuY3Rpb24gbGlua0Z1bmMoc2NvcGUsIGVsLCBhdHRyLCBjdHJsKSB7fVxuXG5cdGN1c3RvbWVyTGlzdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2cnXTtcblx0XG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmdW5jdGlvbiBjdXN0b21lckxpc3RDb250cm9sbGVyKCRzY29wZSwgJGxvZykge1xuXHRcdC8vZGVmaW5lIGxvY2FsIHZhcmlhYmxlc1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGNvbnNvbGUubG9nKCdpbiBjb3N0b21lciBMaXN0IGNvbnRyb2xsZXInKTtcblx0fVxuXG5cdC8vcGFzcyBpdCBiYWNrXG5cdHJldHVybiBkaXJlY3RpdmU7XG59IiwiLypcbipcdEZMQVZPUiBNSVhFUlxuKlxuKlx0VGhpcyBtb2R1bGUgaXMgZGVzaWduZWQgdG8gYWxsb3cgY3VzdG9tZXJzIHRvIG1peCBhbmQgbWF0Y2hcbipcdG91ciBkZWxpY2lvdXMgZmxhdm9ycyBhbmQgdG8gcGljayB0aGllciBzaXppbmcuXG4qL1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ2NuZScpXG5cdC5kaXJlY3RpdmUoJ2xvZ2luUGFzc3dvcmQnLCBsb2dpblBhc3N3b3JkKTtcblxuLyogQG5nSW5qZWN0ICovXG5mdW5jdGlvbiBsb2dpblBhc3N3b3JkKCkge1xuXHQvL2RlZmluZSB0aGUgZGlyZWN0aXZlXG5cdHZhciBkaXJlY3RpdmUgPSB7XG5cdFx0cmVzdHJpY3Q6IFwiQUVDTVwiLFxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9sb2dpbi1wYXNzd29yZC5kaXJlY3RpdmUuaHRtJyxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRwYXNzd29yZDogXCI9XCIsXG5cdFx0XHRhY3RpdmU6IFwiPVwiXG5cdFx0fSxcblx0XHRsaW5rOiBsaW5rRnVuYyxcblx0XHRjb250cm9sbGVyOiBsb2dpblBhc3N3b3JkQ29udHJvbGxlcixcblx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHR9XG5cblx0LyogQG5nSW5qZWN0ICovXG5cdGZ1bmN0aW9uIGxpbmtGdW5jKHNjb3BlLCBlbCwgYXR0ciwgY3RybCkge31cblxuXHRsb2dpblBhc3N3b3JkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvZyddO1xuXHQvKiBAbmdJbmplY3QgKi9cblx0ZnVuY3Rpb24gbG9naW5QYXNzd29yZENvbnRyb2xsZXIoJHNjb3BlLCAkbG9nKSB7XG5cdFx0Ly9kZWZpbmUgbG9jYWwgdmFyaWFibGVzXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHR9XG5cblx0Ly9wYXNzIGl0IGJhY2tcblx0cmV0dXJuIGRpcmVjdGl2ZTtcbn0iLCIvKlxuKlx0RkxBVk9SIE1JWEVSXG4qXG4qXHRUaGlzIG1vZHVsZSBpcyBkZXNpZ25lZCB0byBhbGxvdyBjdXN0b21lcnMgdG8gbWl4IGFuZCBtYXRjaFxuKlx0b3VyIGRlbGljaW91cyBmbGF2b3JzIGFuZCB0byBwaWNrIHRoaWVyIHNpemluZy5cbiovXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnY25lJylcblx0LmRpcmVjdGl2ZSgnbG9naW5Vc2VybmFtZScsIGxvZ2luVXNlcm5hbWUpO1xuXG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIGxvZ2luVXNlcm5hbWUoKSB7XG5cdC8vZGVmaW5lIHRoZSBkaXJlY3RpdmVcblx0dmFyIGRpcmVjdGl2ZSA9IHtcblx0XHRyZXN0cmljdDogXCJBRUNNXCIsXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2xvZ2luLXVzZXJuYW1lLmRpcmVjdGl2ZS5odG0nLFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0c2NvcGU6IHtcblx0XHRcdHVzZXJuYW1lOiBcIj1cIixcblx0XHRcdGFjdGl2ZTogXCI9XCJcblx0XHR9LFxuXHRcdGxpbms6IGxpbmtGdW5jLFxuXHRcdGNvbnRyb2xsZXI6IGxvZ2luVXNlcm5hbWVDb250cm9sbGVyLFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdH1cblxuXHQvKiBAbmdJbmplY3QgKi9cblx0ZnVuY3Rpb24gbGlua0Z1bmMoc2NvcGUsIGVsLCBhdHRyLCBjdHJsKSB7fVxuXG5cdGxvZ2luVXNlcm5hbWVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9nJ107XG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmdW5jdGlvbiBsb2dpblVzZXJuYW1lQ29udHJvbGxlcigkc2NvcGUsICRsb2cpIHtcblx0XHQvL2RlZmluZSBsb2NhbCB2YXJpYWJsZXNcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdH1cblxuXHQvL3Bhc3MgaXQgYmFja1xuXHRyZXR1cm4gZGlyZWN0aXZlO1xufSIsIi8qXG4qXHRCQUNLRU5EIERBVEEgU0VSVklDRVxuKlxuKi9cblxuLy9kZWZpbmUgbW9kdWxlXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnY25lJylcbiAgICAuZmFjdG9yeSgnZGF0YVNlcnZpY2UnLCBkYXRhU2VydmljZSk7XG5cbi8vZGVwZW5kZW5jeSBpbmplY3Rpb25zXG5kYXRhU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xuXG4vL2RlY2xhcmUgdGhlIHNlcnZpY2Vcbi8qIEBuZ0luamVjdCAqL1xuZnVuY3Rpb24gZGF0YVNlcnZpY2UoJGh0dHApIHtcblxuXHQvL2RlZmluZSBtZXRob2RzXG5cdHZhciBkYXRhU2VydmljZSA9IHtcblx0XHRzYWxlc19kYXlzOiB7XG5cdFx0XHRjb21waWxlX2JhdGNoOiBjb21waWxlX25ld19zYWxlc19kYXlfYmF0Y2hcblx0XHR9XG5cdH07XG5cblx0Ly9cdFRFU1QgRlVOQ1RJT05cblx0ZnVuY3Rpb24gY29tcGlsZV9uZXdfc2FsZXNfZGF5X2JhdGNoKHBhcmFtcykge1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coJ3Rlc3RpbmcgZGF0YVNlcnZpY2UnKTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdC8vdHJ5IFBPU1Rcblx0XHRcdCRodHRwKHtcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdHVybDogJy9hcGkvc2FsZXNfZGF5cy9jb21waWxlX25ld19zYWxlc19kYXlzX2JhdGNoJyxcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdFx0fSxcdFxuXHRcdFx0XHRkYXRhOiBwYXJhbXNcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHRcblx0XHRcdH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2soZXJyb3IpIHtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0Ly90dXJuIHRoZSBtZXRob2RcbiAgICByZXR1cm4gZGF0YVNlcnZpY2U7XHRcbn07XG5cbiIsIi8qXG4qXG4qXG4qL1xuXG4vL2RlZmluZSBtb2R1bGVcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbmUnKVxuICAgIC5mYWN0b3J5KCdmaXJlYmFzZVNlcnZpY2UnLCBmaXJlYmFzZVNlcnZpY2UpO1xuXG4vL2RlcGVuZGVuY3kgaW5qZWN0aW9uc1xuZmlyZWJhc2VTZXJ2aWNlLiRpbmplY3QgPSBbJyRmaXJlYmFzZScsICckZmlyZWJhc2VPYmplY3QnLCAnJGZpcmViYXNlQXJyYXknXTtcblxuLy9kZWNsYXJlIHRoZSBzZXJ2aWNlXG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIGZpcmViYXNlU2VydmljZSgkZmlyZWJhc2UsICRmaXJlYmFzZU9iamVjdCwgJGZpcmViYXNlQXJyYXkpIHtcblxuXHQvL2RlZmluZSBtZXRob2RzXG5cdHZhciBGQlNlcnZpY2UgPSB7XG5cdFx0Z2V0OiB7XG5cdFx0XHRjdXN0b21lcl9saXN0OiBnZXRfY3VzdG9tZXJfbGlzdFxuXHRcdH0sXG5cdFx0YXV0aFVzZXI6IHtcblx0XHRcdGVtYWlsOiBhdXRoVXNlcl9lbWFpbFxuXHRcdH0sXG5cdFx0dGVzdDogdGVzdFxuXHR9O1xuXG5cdC8vXHRBVVRIRU5USUNBVEUgVVNFUlxuXHRmdW5jdGlvbiBhdXRoVXNlcl9lbWFpbChlbWFpbCwgcGFzc3dvcmQpIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZygnYXV0aGVudGljYXRpbmcgdXNlcicpXG5cblx0XHQvL3JldHVybiBhc3luYyB3b3JrXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXHRcdFx0ZmlyZWJhc2UuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzd29yZCkudGhlbihmdW5jdGlvbiBzdWNlc3Mocykge1xuXG5cdFx0XHRcdHJlc29sdmUocyk7XG5cblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdC8vIEhhbmRsZSBFcnJvcnMgaGVyZS5cblx0XHRcdFx0dmFyIGVycm9yQ29kZSA9IGVycm9yLmNvZGU7XG5cdFx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuXHRcdFx0XHRyZWplY3Qoe2NvZGU6IGVycm9yQ29kZSAsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZX0pO1xuXG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHR9O1xuXG5cdC8vXHRHRVQgQ1VTVE9NRVIgTElTVFxuXHRmdW5jdGlvbiBnZXRfY3VzdG9tZXJfbGlzdCgpIHtcblx0XHQvL2RlZmluZSBsb2NhbCB2YXJpYWJsZXNcblxuXHRcdC8vY29uc29sZS5sb2coJ2dldHRpbmcgY3VzdG9tZXIgbGlzdCcpO1xuXG5cdFx0Ly9yZXR1cm4gYXN5bmMgd29ya1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICAgICBcblx0ICAgICAgICAvL3ZhciB0ZXN0ID0gXG5cblx0ICAgICAgICAvL2hpdCB0aGUgc2VydmVyIGZvciB0aGUgXG5cdCAgICAgICAgcmVzb2x2ZShbXCJvbmVcIiwgXCJ0d29cIiwgJ3RocmVlJ10pO1xuXG5cdCAgICB9KTtcblx0fVxuXG5cdC8vXHRURVNUIEZVTkNUSU9OXG5cdGZ1bmN0aW9uIHRlc3QoKSB7IHJldHVybignZ29vZCB0ZXN0IGZyb20gRkIgU2VydmljZScpOyB9O1xuXG5cdC8vdHVybiB0aGUgbWV0aG9kXG4gICAgcmV0dXJuIEZCU2VydmljZTtcdFxufTtcblxuIl19
