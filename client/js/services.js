'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', [])
    .factory('Login', function ($http,$q) {

        var finduser = function (username) {
        var deferred = $q.defer();
        $http.get(API_URL+'user/?username=' + username + '&format=json').then(function (result) {
            deferred.resolve(result.data.objects[0]);
        });
        return deferred.promise;
    }


        return {
            get: finduser
        }
    });

angular.module('dashApp.services', [])
.factory("MessageBus", function($rootScope) {
    return {
        broadcast : function(event, data) {
            $rootScope.$broadcast(event, data);
        }
    };
    })
    .factory('User', function () {
        var user;
        //factory function body that constructs shinyNewServiceInstance
        return user;
    })
    .factory('Loctns', function () {

        return [];
    })
    .factory('Phone', function () {

        return [];
    })
    .factory('PhoneNo', function () {

        return [];
    })
    .factory('FaxNo', function () {

        return [];
    })
    .factory('Fax', function () {

        return [];
    })
    .factory('Names', function () {

        return [];
    })
    .factory('URLS', function () {

        return [];
    })
    
    .factory('Entity', function ($http,$q) {
        var findStudent = function () {
            var deferred = $q.defer();
            $http.get(API_URL+'Entity/?id=3&format=json').then(function (result) {
                deferred.resolve(result.data.objects[0]);
            });
            return deferred.promise;
        }

        return {
            get: function () {
                 $http.get(API_URL+'Entity/?id=3&format=json').success(function (data) {
                   return data.data
                })
            },

            finds: function () {
                return $http.get(API_URL+'Entity/?format=json').success(function (data) {
                })
            },
            add: function (Entity) {
                console.log(Entity)
                return $http.post(API_URL+'Entity/', Entity).then(function (data) {
                    console.log('success')
                    return data
                });
            },
            addurl: function (url) {
                console.log(url)
                return $http.post(API_URL+'Url/', url).then(function (data) {
                    console.log('success')
                    return data
                });
            },
            addname: function (name) {
                console.log(name)
                return $http.post(API_URL+'Name/', name).then(function (data) {
                    console.log('success')
                    return data
                });
            },
            addphone: function (phone) {
                console.log(phone)
                return $http.post(API_URL+'Phone/', phone).then(function (data) {
                    console.log('success')
                    return data
                });
            },
            addfax: function (fax) {
                console.log(fax)
                return $http.post(API_URL+'Fax/', fax).then(function (data) {
                    console.log('success')
                    return data
                });
            }
        }
    });


angular.module('tdashApp.services', []).
    value('version', '0.1');