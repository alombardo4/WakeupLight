'use strict';

var express = require('express');
var controller = require('./hardware.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/weeklySetup', controller.getWeeklySetup);
router.put('/weeklySetup', controller.updateWeeklySetup);
router.put('/', controller.update);
module.exports = router;
