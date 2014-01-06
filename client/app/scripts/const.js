'use strict';
var stoneBase = {
  resources: 'http://localhost:8888/resources'
   // resources: 'http://localhost/resources'
   // resource: 'http://154.28.16.213/resources'
};

var stone = {
  user:{},

  resources: {
    base: stoneBase.resources,
    indexes: stoneBase.resources + '/indexes',
    login: stoneBase.resources + '/login',
    indexesReport: stoneBase.resources + '/indexes-report'
  },

  template: {
    mainPage: 'views/index/main-page.html',
    report :{
      indexes:{
        report: 'views/report/indexes/report.html',
        detail:'views/report/indexes/detail.html',
        list : 'views/report/indexes/list.html',
        login: 'views/report/indexes/login.html'
      }
    },
    input: {
      number: '<input type="number" ng-model="COL_FIELD" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" />',
      date:  '<select ng-options="d for d in dateOptions" ng-model="COL_FIELD" ' +
        'ng-class="\'colt\' + col.index" ng-input="COL_FIELD"></select>'
    },
    cell: '<div style="border-bottom:1px solid rgb(212,212,212);" class="ngCellText"'+
      'ng-class="col.colIndex()"><span ng-cell-text>{{COL_FIELD}}</span></div>'
  },

  config: {
    navTree: [
      {
        label: '数据报表',
        children: [{url:'/report/indexes', label: '八项规定'}]
      }
    ]
  }
};
