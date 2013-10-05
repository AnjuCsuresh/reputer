'use strict';

/* Controllers */

//API URLS 
// Add Trailing Slash
var API_URL = 'https://app.reputer.co/api/v1/';
var DATA_API_URL = 'http://localhost:5000/'

angular.module('myApp.controllers', ['ngGrid']).

    controller('RegisterCtrl',function ($http, $scope, $location ,$window, $cookies) {
        console.log('This is register');

        $scope.register = function (user) {
            //adding some simple verifications
            var data = {
                username: user.username,
                password: user.password1,
                email: user.email1
            };
            $http.post(API_URL + 'newuser/', data).then(function (data) {
                console.log(data.data.username)
                var u = {
                username: user.username,
                password: user.password1
                
            };
            console.log
                $http.post(API_URL + 'user/login/',u, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    
                    //console.log(data)
                    $window.location.href = 'dashboard.html'
                }
            })
                
            })
        }
    }).

    controller('LoginCtrl', function ($http, $scope, $window, $cookies,$location,Login) {
        console.log('This is LoginCtrl');
        $scope.login = function (user) {
            //adding some simple verifications
            $http.post(API_URL + 'user/login/', user, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    $scope.error = '';

                    //console.log(data)
                    $window.location.href = 'dashboard.html'
                }
            })
                .error(function (data, status, headers, config) {
                    $scope.error = "Please Enter correct email"
                });
        }

        $scope.reset=function(user){
            
           
           
        }
        $scope.forgot=function(){
            
           $location.path('/forgot/'); 
           
        }
        $scope.send = function (user) {
            //adding some simple verifications
            $http.put(API_URL + 'user/password_reset/', user, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    $scope.error = '';
                    //console.log(data)
                    var d = window.confirm('check your mail');
                    if(d){
                    $window.location.href = 'index.html'
                    }
                }
            })
                .error(function (data, status, headers, config) {
                    $scope.error = "Please check your username or password"
                });
        }
    })
    .controller('MyCtrl2', [function () {
        console.log("2dd")
    }]);

angular.module('dashApp.controllers', []).
    controller('DashHomeCtrl', function ($http, $scope, User) {
        $http.get(DATA_API_URL+'getcrawltable/10').success(function(data, status, headers, config){
            $scope.items = data.aaData;
            
        })
        
    })
    .controller('EntityCtrl', function ($http, $scope, User, Loctns, Names, URLS, Entity, Phone, Fax, PhoneNo, FaxNo,$location,$timeout) {
     
    })


    .controller('TopNavCtrl', function (User, $scope, $location, $http) {
        $http.get(API_URL + 'user/info/', {withCredentials: true}).then(function (response) {
            User = response.data;
            $scope.user = User;
            console.log(User);
        })
    })

