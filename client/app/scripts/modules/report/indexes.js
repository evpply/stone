(function () {
  'use strict';
  angular.
    module('indexes', ['ngGrid', 'chieffancypants.loadingBar', 'ngRoute', 'ui.bootstrap'])
    .controller("IndexesDetailCtrl", ['$rootScope','$scope','$location','$http','$timeout', '$window', '$modal',function($rootScope,$scope,$location,$http,$timeout,$window,$modal) {

      $scope.cancel = function () {
        $window.history.back();
      };

      $scope.login = function () {
        var user = {username:$('#username').val(), password:$('#password').val()};
        $http.post(stone.resources.login, user).success(function(data){
          if(!$.isEmptyObject(data)){
            stone.user = data;
            $rootScope.orgName = data.orgName;
            fillData();
            $('#login').modal('hide');
          } else {
            $('#username').val('');
            $('#password').val('');
          };
        });
      };

      var fillData = function(){
        $http.get(stone.resources.indexes + '/' + stone.user.org) .success(function(result){
          var indexes = ($.isEmptyObject(result)) ? [] : result;
          indexes.sort(function(a, b) {
            return (a.date >= b.date)? 1 : -1;
          });
          indexes.push({});
          $scope.indexes = indexes;
        });
      };



      fillData();
      $.isEmptyObject(stone.user) && $('#login').modal({backdrop: 'static'});

      $('.gridStyle').css('height', window.innerHeight * 0.5);
      var createGridOptions = function(data,colDef) {
        return { data: data,
                 width: '100%',
                 enableCellSelection: true,
                 enableRowSelection: false,
                 enableColumnResize:true,
                 beforeSelectionChange: function(rowItem,event){
                   if(rowItem.rowIndex === $scope[data].length-1) {
                     $scope[data].push({});
                   }
                   return true;
                 },
                 columnDefs: colDef };
      };

      var createColDef = function(fields){
        for (var i in fields) {
          fields[i].enableCellEdit = true;
          fields[i].cellTemplate = stone.template.cell;
          switch(fields[i].type)
          {
          case "date[yyyy-mm]":
            fields[i].editableCellTemplate = stone.template.input.date;
            break;
          case "number":
            fields[i].editableCellTemplate = stone.template.input.number;
            break;
          default:
            break;
          }
        }

        return fields;
      };

      $scope.dateOptions = ['2013-12','2013-11','2013-10','2013-09','2013-08','2013-07','2013-06','2013-05',
                            '2013-04','2013-03','2013-02','2013-01',
                            '2012-12','2012-11','2012-10','2012-09','2012-08','2012-07','2012-06','2012-05',
                            '2012-04','2012-03','2012-02','2012-01'];

      var schema = [{field: "date",                displayName: "时间",     type: "date[yyyy-mm]"},
                    {field: "researchTimes",       displayName: "调研次数",  type:"number"},
                    {field: "researchDuration",    displayName: "调研天数",  type:"number"},
                    {field: "carsExpense",         displayName: "公车费用",  type:"number"},
                    {field: "ORExpense",           displayName: "公务接待费", type: "number"},
                    {field: "officeExpenses",      displayName: "办公经费",  type: "number"},
                    {field: "conferenceExpenses",  displayName: "会议经费",  type: "number"},
                    {field: "conferenceTimes",     displayName: "会议次数",  type: "number"},
                    {field: "files",               displayName: "发文件数",  type: "number"}];

      $scope.schema = createGridOptions('indexes', createColDef(schema));
      $scope.indexes =[{}];

      $scope.cancel = function(){
        $window.history.back();
      };

      $scope.save = function(){
        $('#indexesDetailSubmit').prop('disabled', true);

        for (var i in $scope.indexes){
          $scope.indexes = removeEmpty($scope.indexes);
        }

        var toPost = {
          _id: stone.user.org,
          data: $scope.indexes,
          orgName: stone.user.orgName
        };

        $http.post(stone.resources.indexes, toPost)
          .success(function(result){
            fillData();
            $('#indexesPost').attr('class', 'btn btn-success');
            $timeout(function(){
              $('#indexesPost').removeAttr('disabled').attr('class', 'btn btn-primary');
            },2000);
          })
          .error(function(){
            $('#indexesPost').attr('class', 'btn btn-danger');
            $timeout(function(){
              $('#indexesPost').removeAttr('disabled').attr('class', 'btn btn-primary');
            },2000);
          });
      };
    }])

    .controller('IndexesReportCtrl',['$scope','$location','$http',function($scope,$location,$http){
      var createMainChartOptions = function (date,carsExpense,ORExpense,files,conferenceTimes){
        return {
          chart: {zoomType: 'xy',marginBottom: 65,style:{ // fontFamily:'"Microsoft YaHei"',
            fontSize:'16px'}},
          title: {text: '昭通市地方税务局落实“八项规定”情况'},
          xAxis: [{categories:date}],
          yAxis: [
            {title: {text: '费用(万元)', style: {color: '#4572A7'}},
             labels: {formatter: function() {return this.value/10000;}, style: {color: '#4572A7'}}},
            {labels: {formatter: function() {return this.value;}, style: {color: '#89A54E'}},
             title: {text: '文件', style: {color: '#89A54E'}}, opposite: true},
            {labels: {formatter: function() {return this.value;}, style: {color: '#AA4643'}},
             title: {text: '会议', style: {color: '#AA4643'}}, opposite: true}],
          tooltip: {shared: true},
          series: [{name: '公车费用', type: 'column', color: '#4572A7', yAxis: 0, data: carsExpense},
                   {name: '公务接待费', type: 'column', color: '#FF8345', yAxis: 0, data: ORExpense},
                   {name: '发文数', color: '#89A54E', type: 'line', yAxis: 1, data:files},
                   {name: '会议数', color: '#AA4643', type: 'line',yAxis: 2, data:conferenceTimes, dashStyle:'shortdot'}//,
                  ]
        };
      };
      var createCompareChartOptions = function(title,color,yAxisName,item2012,item2013){
        return {
          chart: {zoomType: 'xy',
                  marginBottom: 65,
                  style:{ fontSize:'16px' },
                  height: 350},

          title: {text: title},
          xAxis: [{categories:['2012年','2013年']}],
          yAxis: [
            {title: {text: yAxisName, style: {color: color}},
             labels:
             {formatter: function() {
               return this.value > 10000 ? this.value / 10000 : this.value;
             },
              style: {color: color}}}],
          //tooltip: {shared: true},
          legend:{y:-260, x:75},
          series: [{name: ((item2013-item2012) * 100 /item2012).toFixed(2) + '%', type: 'column',
                    color: color, yAxis: 0, data: [item2012, item2013]}]};

      };

      $http.get(stone.resources.indexesReport).success(function(data){
        var month = [], files = [], carsExpense = [], ORExpense = [], conferenceTimes = [];
        var ds = data.sort(function(a, b) {
          return (a.date >= b.date)? 1 : -1;
        });

        for(var i in ds){
          var d = ds[i].date;
          if (d >= "2013-01" && d <= "2013-12") {
            month.push(d);
            files.push(ds[i].files);
            carsExpense.push(ds[i].carsExpense);
            ORExpense.push(ds[i].ORExpense);
            conferenceTimes.push(ds[i].conferenceTimes);
          }
        }

        var indexes2013 = ds[ds.length - 1];
        var indexes2012 = ds[0];

        $(function(){
          Highcharts.setOptions({
            chart: {
              style: {
                fontFamily: 'Microsoft YaHei'
              }
            }
          });

          $('#mainChart').highcharts(createMainChartOptions(month,carsExpense,ORExpense,files,conferenceTimes));
          $('#carsExpenseCompare')
            .highcharts(
              createCompareChartOptions(
                '公车费用比较',
                '#4572A7',
                '公车费用(万元)',
                indexes2012.carsExpense,
                indexes2013.carsExpense
              ));
          $('#ORExpenseCompare')
            .highcharts(
              createCompareChartOptions(
                '公务接待费比较',
                '#FF8345',
                '公务接待费(万元)',
                indexes2012.ORExpense,
                indexes2013.ORExpense
              ));
          $('#filesCompare')
            .highcharts(
              createCompareChartOptions(
                '发文数比较',
                '#89A54E',
                '发文数',
                indexes2012.files,
                indexes2013.files
              ));

          $('#conferenceTimesCompare')
            .highcharts(
              createCompareChartOptions(
                '会议数比较',
                '#AA4643',
                '会议数',
                indexes2012.conferenceTimes,
                indexes2013.conferenceTimes
              ));

        });
      });

      $scope.toDetail = function(){
        $location.path('/report/indexes/detail');
      };

      $scope.toList = function(){
        $location.path('/report/indexes/list');
      };
    }])

    .controller('IndexesListCtrl',['$scope','$location','$http',function The8ListCtrl($scope,$location,$http) {
      $('.gridStyle').css('height', window.innerHeight * 0.65);

      $scope.filterOptions = { filterText: ''};

      var createGridOptions = function(data,colDef) {
        return { data: data,
                 width: '100%',
                 enableCellSelection: true,
                 enableRowSelection: false,
                 enableColumnResize:true,
                 filterOptions: $scope.filterOptions,
                 columnDefs: colDef };
      };
      var schema = [{field: "date",                displayName: "时间",     type: "date[yyyy-mm]"},
                    {field: "orgName",             displayName: "单位",     type: "text"},
                    {field: "researchTimes",       displayName: "调研次数",  type: "number"},
                    {field: "researchDuration",    displayName: "调研天数",  type: "number"},
                    {field: "carsExpense",         displayName: "公车费用",  type: "number"},
                    {field: "ORExpense",           displayName: "公务接待费", type: "number"},
                    {field: "officeExpenses",      displayName: "办公经费",  type: "number"},
                    {field: "conferenceExpenses",  displayName: "会议经费",  type: "number"},
                    {field: "conferenceTimes",     displayName: "会议次数",  type: "number"},
                    {field: "files",               displayName: "发文件数",  type: "number"}];

      $scope.schema = createGridOptions('indexes', schema);

      $http.get(stone.resources.indexes).success(function(result){
        $scope.indexes = result;
      });

      $scope.cancel = function (){
        $location.path('/report/indexes/report');
      };
    }])

    .config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
      $routeProvider
        .when('/report',{label:'报表'})
        .when('/report/indexes',
              {label:'八项规定',
               redirectTo: '/report/indexes/report'})
        .when('/report/indexes' + '/report',
              {controller: 'IndexesReportCtrl',
               templateUrl: stone.template.report.indexes.report,
               label:'汇总'})
        .when('/report/indexes' + '/detail',
              {controller: 'IndexesDetailCtrl',
               templateUrl: stone.template.report.indexes.detail,
               label:'填报'})
        .when('/report/indexes' + '/list',
              {controller: 'IndexesListCtrl',
               templateUrl: stone.template.report.indexes.list,
               label:'明细'});
    }]);
})();
