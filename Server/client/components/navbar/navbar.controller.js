'use strict';

class NavbarController {
  //start-non-standard
  menu = [
    {
      'title': 'Home',
      'state': 'main'
    },
    {
      'title': 'Admin',
      'state': 'admin'
    }
  ];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('wakeupAlarmApp')
  .controller('NavbarController', NavbarController);
