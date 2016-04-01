'use strict';

angular.module('wakeupAlarmApp')
  .controller('AdminCtrl', function ($scope, $http, hardwareService) {

    // Use the User $resource to fetch all users
    $scope.init = function() {
      hardwareService.getHardware().then(function(result) {
        $scope.hardware = result.data;
        if ($scope.hardware) {
          $scope.editHardware = true;
        }
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
