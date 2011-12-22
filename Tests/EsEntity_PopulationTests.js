﻿/// <reference path="../Libs/jquery-1.7.1.js" />
/// <reference path="../Libs/knockout-2.0.RC.js" />
/// <reference path="../Libs/json2.js" />
/// <reference path="Qunit/qunit.js" />
/// <reference path="../Build/entityspaces.debug.js" />
/// <reference path="MockProviders/MockAjaxProvider.js" />

module('Populate Entity Tests');

test('basic smoke Test', function () {

    //override the provider's execute method
    es.testDataProvider.execute = function (options) {

        //hand the success handler our dummy data
        options.success(getEmployeeData());
    };

    var emp = new es.objects.Employees();

    //this will test the entire request pipeline
    emp.loadbyPrimaryKey('testId', function () {

        ok(this.EmployeeId, 'EmployeeId is not null');
        //do assertions here;
    });
});