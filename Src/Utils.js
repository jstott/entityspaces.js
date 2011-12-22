﻿/*globals es, ko*/

/// <reference path="../Libs/jquery-1.7.1.js" />
/// <reference path="../Libs/knockout-2.0.RC.js" />

var utils = {

    extendObservable: function (target, source) {
        var prop;

        if (!target || !source) {
            return;
        }

        for (prop in target) {

            if (source.hasOwnProperty(prop)) {

                if (ko.isObservable(target[prop])) { //set the observable property

                    target[prop](source[prop]); // set the observable
                } else {

                    target[prop] = source[prop];
                }
            }
        }

        return target;
    },

    addPropertyChangedHandlers: function (obj, propertyName) {

        var property = obj[propertyName];
        if (ko.isObservable(property) && !(property instanceof Array)) {

            // This is the actual PropertyChanged event
            property.subscribe(function () {
                if (ko.utils.arrayIndexOf(obj.ModifiedColumns(), propertyName) === -1) {

                    if (propertyName !== "RowState") {
                        obj.ModifiedColumns.push(propertyName);

                        if (obj.RowState() !== es.RowState.MODIFIED && obj.RowState() !== es.RowState.ADDED) {
                            obj.RowState(es.RowState.MODIFIED);
                        }
                    }
                }
            });
        }
    },

    startTracking: function (entity) {

        var propertyName;

        if (!entity.hasOwnProperty("RowState")) {
            entity.RowState = ko.observable(es.RowState.ADDED);
            if (entity.hasOwnProperty("__ko_mapping__")) {
                entity.__ko_mapping__.mappedProperties["RowState"] = true;
            }
        } else {
            if (!ko.isObservable(entity.RowState)) {
                entity.RowState = ko.observable(entity.RowState);
            }
        }

        if (!entity.hasOwnProperty("ModifiedColumns")) {
            entity.ModifiedColumns = ko.observableArray();
            if (entity.hasOwnProperty("__ko_mapping__")) {
                entity.__ko_mapping__.mappedProperties["ModifiedColumns"] = true;
            }
        } else {
            if (!ko.isObservable(entity.ModifiedColumns)) {
                entity.ModifiedColumns = ko.observable(entity.ModifiedColumns);
            }
        }

        for (propertyName in entity) {
            if (propertyName !== 'RowState' && propertyName !== "ModifiedColumns" && propertyName !== '__type' && propertyName !== 'esExtendedData') {

                var property = entity[propertyName];

                if (property instanceof Array) { continue; }

                if (entity.hasOwnProperty(propertyName) && ko.isObservable(property)) {
                    utils.addPropertyChangedHandlers(entity, propertyName);
                }
            }
        }

        return entity;
    },

    expandExtraColumns: function (entity, shouldMakeObservable) {
        var data, i, ext,
                makeObservable = arguments[1] || false;

        if (entity.esExtendedData !== undefined) {

            data = ko.utils.unwrapObservable(entity.esExtendedData);

            for (i = 0; i < data.length; i++) {

                if (makeObservable) {
                    entity[ko.utils.unwrapObservable(data[i].Key)] = ko.observable(ko.utils.unwrapObservable(data[i].Value));
                } else {
                    entity[ko.utils.unwrapObservable(data[i].Key)] = ko.utils.unwrapObservable(data[i].Value);
                }

                if (entity.hasOwnProperty("__ko_mapping__")) {
                    if (entity.__ko_mapping__.hasOwnProperty("mappedProperties")) {
                        entity.__ko_mapping__.mappedProperties[ko.utils.unwrapObservable(data[i].Key)] = true;
                    }
                }
            }

            ext = ko.utils.unwrapObservable(entity.esExtendedData);
            delete entity.esExtendedData;
        }

        if (data !== undefined) {

            entity["esExtendedData"] = [];

            for (i = 0; i < data.length; i++) {
                entity.esExtendedData.push(ko.utils.unwrapObservable(data[i].Key));
            }
        }

        return entity;
    },

    removeExtraColumns: function (entity) {
        var i;

        if (entity.esExtendedData !== undefined) {

            var data = ko.utils.unwrapObservable(entity.esExtendedData);

            for (i = 0; i < data.length; i++) {
                delete entity[data[i]];
            }
            delete entity.esExtendedData;
        }

        return entity;
    }
};

utils.newId = (function () {
    var seedId = new Date().getTime();

    return function () {
        return ++seedId;
    };

} ());

es.utils = utils;