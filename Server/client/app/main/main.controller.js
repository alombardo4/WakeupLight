'use strict';

angular.module('wakeupAlarmApp')
  .controller('MainCtrl', function ($scope, $http, hardwareService) {
    $scope.week = {
      sunday: {
        name: 'Sunday'
      },
      monday: {
        name: 'Monday'
      },
      tuesday: {
        name: 'Tuesday'
      },
      wednesday: {
        name: 'Wednesday'
      },
      thursday: {
        name: 'Thursday'
      },
      friday: {
        name: 'Friday'
      },
      saturday: {
        name: 'Saturday'
      }
    };
    $scope.init = function() {
      $scope.hourOptions = [{
        value: 'XX',
        show: 'XX'
      }];
      for (var i = 0; i < 24; i++) {
        var stringVal = i.toString();
        if (i < 10) {
          stringVal = '0' + stringVal;
        }
        $scope.hourOptions.push({
          value: stringVal,
          show: i
        });
      }
      $scope.minuteOptions = [{
        value: 'XX',
        show: 'XX'
      }];
      for (var j = 0; j < 60; j++) {
        var st2 = j.toString();
        if (j < 10) {
          st2 = '0' + st2.toString();
        }
        $scope.minuteOptions.push({
          value: st2,
          show: j
        });
      }
      hardwareService.getWeeklySetup().then(function(result) {
        $scope.weeklySetup = result.data;
        if ($scope.weeklySetup) {

          var days = $scope.weeklySetup.split(' ');
          $scope.week.sunday.hour = days[0].substring(0,2);
          $scope.week.sunday.minute = days[0].substring(2,4);
          $scope.week.monday.hour = days[1].substring(0,2);
          $scope.week.monday.minute = days[1].substring(2,4);
          $scope.week.tuesday.hour = days[2].substring(0,2);
          $scope.week.tuesday.minute = days[2].substring(2,4);
          $scope.week.wednesday.hour = days[3].substring(0,2);
          $scope.week.wednesday.minute = days[3].substring(2,4);
          $scope.week.thursday.hour = days[4].substring(0,2);
          $scope.week.thursday.minute = days[4].substring(2,4);
          $scope.week.friday.hour = days[5].substring(0,2);
          $scope.week.friday.minute = days[5].substring(2,4);
          $scope.week.saturday.hour = days[6].substring(0,2);
          $scope.week.saturday.minute = days[6].substring(2,4);
          console.log($scope.week);
        } else {

        }

      });
    };
    $scope.saveForm = function() {
      var stringCommand = '';

      stringCommand = stringCommand.concat($scope.week.sunday.hour).concat($scope.week.sunday.minute).concat(' ');
      stringCommand = stringCommand.concat($scope.week.monday.hour).concat($scope.week.monday.minute).concat(' ');
      stringCommand = stringCommand.concat($scope.week.tuesday.hour).concat($scope.week.tuesday.minute).concat(' ');
      stringCommand = stringCommand.concat($scope.week.wednesday.hour).concat($scope.week.wednesday.minute).concat(' ');
      stringCommand = stringCommand.concat($scope.week.thursday.hour).concat($scope.week.thursday.minute).concat(' ');
      stringCommand = stringCommand.concat($scope.week.friday.hour).concat($scope.week.friday.minute).concat(' ');
      stringCommand = stringCommand.concat($scope.week.saturday.hour).concat($scope.week.saturday.minute);
      hardwareService.updateWeeklySetup({weeklySetup: stringCommand}).then(function() {
        $scope.saved = true;
      });
    };

    $scope.saveHardware = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        if ($scope.editHardware) {
          hardwareService.updateHardware($scope.hardware).then(function() {
            //show success
            $scope.savedHardware = true;
          });
        } else {
          hardwareService.createHardware($scope.hardware).then(function() {
            //show success
            $scope.savedHardware = true;

          });
        }
      }
    };

  });
