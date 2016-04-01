'use strict';

angular.module('wakeupAlarmApp')
  .service('hardwareService', function ($http) {
    var service = {};

    service.getHardware = function() {
      return $http.get('/api/hardware');
    };

    service.createHardware = function(hardware) {
      return $http.post('/api/hardware', hardware);
    };

    service.updateHardware = function(hardware) {
      return $http.put('/api/hardware', hardware);
    };

    service.getWeeklySetup = function() {
      return $http.get('/api/hardware/weeklySetup');
    };

    service.updateWeeklySetup = function(hardware) {
      return $http.put('/api/hardware/weeklySetup', hardware);
    };
    return service;
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
