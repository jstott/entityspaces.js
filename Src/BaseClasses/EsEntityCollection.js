﻿/*globals es*/
/// <reference path="../../Libs/jquery-1.7.1.js" />
/// <reference path="../../Libs/json2.js" />
/// <reference path="../../Libs/knockout-2.0.0.debug.js" />


es.EsEntityCollection = function () {
    var obs = ko.observableArray([]);

    //define the 'es' utility object
    obs.es = {};

    //add all of our extra methods to the array
    ko.utils.extend(obs, es.EsEntityCollection.fn);

    obs.es['___esCollection___'] = es.utils.newId(); // assign a unique id so we can test objects with this key, do equality comparison, etc...

    return obs;
};

es.EsEntityCollection.fn = { //can't do prototype on this one bc its a function

    filter: function (predicate) {
        var array = this();

        return ko.utils.arrayFilter(array, predicate);
    },

    acceptChanges: function () {

//        var i, entity,
//            coll = this(),
//            len = coll.length;

//        for (i = 0; i < len; i += 1) {
//            entity = coll[i];

//            if (entity.isDirty()) {
//                entity.acceptChanges();
//            }
//        }
    },

    rejectChanges: function () {
//        var i, entity,
//            coll = this(),
//            len = coll.length;

//        for (i = 0; i < len; i += 1) {
//            entity = coll[i];

//            if (entity.isDirty()) {
//                entity.rejectChanges();
//            }
//        }
    },

    markAllAsDeleted: function () {
        var i, entity,
            coll = this(),
            len = coll.length;

        for (i = 0; i < len; i += 1) {
            entity = coll[i];
            entity.markAsDeleted();
        }
    },

    //call this when walking the returned server data to populate collection
    populateCollection: function (dataArray) {
        var entityTypeName = this.es.entityTypeName, // this should be set in the 'DefineCollection' call, unless it was an anonymous definition
            EntityCtor,
            finalColl = [],
            create = this.createEntity,
            entity;

        if (entityTypeName) {
            EntityCtor = es.getType(entityTypeName); //might return undefined
        }

        if (dataArray && es.isArray(dataArray)) {

            ko.utils.arrayForEach(dataArray, function (data) {

                //call 'createEntity' for each item in the data array
                entity = create(data, EntityCtor); //ok to pass an undefined Ctor

                if (entity !== undefined && entity !== null) { //could be zeros or empty strings legitimately
                    finalColl.push(entity);
                }
            });

            //now set the observableArray that we inherit off of
            this(finalColl);
        }
    },

    createEntity: function (entityData, Ctor) {
        var entityTypeName, // this should be set in the 'DefineCollection' call 
            EntityCtor = Ctor,
            entity;

        if (!Ctor) { //undefined Ctor was passed in
            entityTypeName = this.es.entityTypeName;
            EntityCtor = es.getType(entityTypeName); //could return undefined
        }

        if (EntityCtor) { //if we have a constructor, new it up
            entity = new EntityCtor();
            entity.populateEntity(entityData);
        } else { //else just set the entity to the passed in data
            entity = entityData;
        }

        return entity;
    },

    //#region Loads
    load: function (options) {
        var self = this;

        if (options.success !== undefined || options.error !== undefined) {
            options.async = true;
        } else {
            options.async = false;
        }

        //if a route was passed in, use that route to pull the ajax options url & type
        if (options.route) {
            options.url = options.route.url || this.routes[options.route].url;
            options.type = options.route.method || this.routes[options.route].method; //in jQuery, the HttpVerb is the 'type' param
        }

        //sprinkle in our own handlers, but make sure the original still gets called
        var successHandler = options.success;
        var errorHandler = options.error;

        //wrap the passed in success handler so that we can populate the Entity
        options.success = function (data, options) {

            //populate the entity with the returned data;
            self.populateCollection(data);

            //fire the passed in success handler
            if (successHandler) { successHandler.call(self, data, options.state); }
        };

        options.error = function (status, responseText, options) {
            if (errorHandler) { errorHandler.call(self, status, responseText, options.state); }
        };

        es.dataProvider.execute(options);
    },

    loadAll: function (success, error, state) {

        var options = {
            route: this.routes['loadAll']
        };

        if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
            es.utils.extend(options, arguments[0]);
        } else {
            options.success = success;
            options.error = error;
            options.state = state;
        }

        this.load(options);
    },
    //#endregion Loads

    //#region Save
    save: function (success, error, state) {
        var self = this;

        var route,
            options = { success: success, error: error, state: state };

        if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
            es.utils.extend(options, arguments[0]);
        }

        if (options.success !== undefined || options.error !== undefined) {
            options.async = true;
        } else {
            options.async = false;
        }

        options.route = self.routes['commit'];

        //TODO: potentially the most inefficient call in the whole lib
        options.data = es.utils.getDirtyGraph(ko.toJS(self));

        if (options.route) {
            options.url = options.route.url;
            options.type = options.route.method;
        }

        var successHandler = options.success;
        var errorHandler = options.error;

        options.success = function (data, options) {
            self.populateCollection(data);
            if (successHandler) { successHandler.call(self, data, options.state); }
        };

        options.error = function (status, responseText, options) {
            if (errorHandler) { errorHandler.call(self, status, responseText, options.state); }
        };

        es.dataProvider.execute(options);
    }
    //#endregion
};

es.exportSymbol('es.EsEntityCollection', es.EsEntityCollection);
es.exportSymbol('es.EsEntityCollection.markAllAsDeleted', es.EsEntityCollection.markAllAsDeleted);
es.exportSymbol('es.EsEntityCollection.loadAll', es.EsEntityCollection.loadAll);
es.exportSymbol('es.EsEntityCollection.load', es.EsEntityCollection.load);
es.exportSymbol('es.EsEntityCollection.save', es.EsEntityCollection.save);