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
    });
    
angular.module('tdashApp.services', []).
    value('version', '0.1');