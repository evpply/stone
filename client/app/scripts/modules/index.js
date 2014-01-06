(function(){
  'use strict';
  angular
    .module('index', ['angularBootstrapNavTree', 'ngRoute', 'services.breadcrumbs'])

    .controller(
      'IndexCtrl',
      ['$scope','$location','$http','breadcrumbs',
       function IndexCtrl($scope,$location,$http,breadcrumbs){
         $scope.breadcrumbs = breadcrumbs;
         $scope.navTreeHandler = function (branch) {
           var _ref;
           $location.path(branch.url);
           if ((_ref = branch.data) != null ? _ref.description : void 0) {
             return $scope.output += '(' + branch.data.description + ')';
           }

           return null;
         };
         $scope.navTreeData = stone.config.navTree;
       }])

    .controller('MainCtrl', ['$scope',function(){}])

    .config(['$routeProvider',function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: stone.template.mainPage,
          controller: 'MainCtrl',
          label: '主页'
        });
    }]);
})();
