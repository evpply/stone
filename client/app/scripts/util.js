'use strict';
// var removeEmpty = function(arr){
//   var returnValue = [];
//   for (var i in arr){
//     !$.isEmptyObject(arr[i]) && returnValue.push(arr[i]);
//   }
//   return returnValue;
// };
var removeEmpty = function(arr){

  var emptyFilter = function(obj){
    var r = true;

    if ($.isEmptyObject(obj)){
      r = false;
    }

    for (var i in obj){
      if(obj[i] == null || obj[i].length == 0){
        r = false;
      }
    }

    return r;
  };

  return arr.filter(emptyFilter, arr);
};

var selectJSON = function(o,k){
  var t = {};
  for (var i in k){
    t[k[i]] = o[k[i]];
  }
  return t;
};

var myGetMonth = function(date){
  var o = new Date(date);
  return o.getMonth() + 1;
};
