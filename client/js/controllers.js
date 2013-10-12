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
    controller('DashHomeCtrl', function ($http, $scope, User,$filter,$timeout) {
        $http.get(DATA_API_URL+'getcrawltable/11').success(function(data, status, headers, config){
            $scope.items = data.aaData;
            $scope.predicate = 'Rank';
            $scope.reverse = false;
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return String(haystack).toLowerCase().indexOf(needle.toLowerCase()) !== -1; 
        };

        // init the filtered items
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                for(var attr in item) {
                    if (item[attr]!=null){
                       if (searchMatch(item[attr], $scope.query))
                        return true; 
                    }
                    
                }
                return false;
            });
            // take care of the sorting order
            if ($scope.sortingOrder !== '') {
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
            }
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };
        
        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];
            
            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                }
            }
        };
        
        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };
        
        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };
        
        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };
        
        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        // functions have been describe process the data for display
        $scope.search();

        // change sorting order
        $scope.sort_by = function(newSortingOrder) {
            if ($scope.sortingOrder == newSortingOrder)
                $scope.reverse = !$scope.reverse;

            $scope.sortingOrder = newSortingOrder;

            // icon setup
            $('th i').each(function(){
                // icon reset
                $(this).removeClass().addClass('icon-sort');
            });
            if ($scope.reverse)
                $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
            else
                $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');
        };

        $scope.ignore = function(item){
            
            $http.get(DATA_API_URL+item.ignore).success(function(data, status, headers, config){
                item.hide = true;
                $scope.n = notyfy({
                    text: 'Ignored results from '+item.URL,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
        
            })
        }
        })
        
    })
    .controller('EntityCtrl', function ($http, $scope, User, Loctns, Names, URLS, Entity, Phone, Fax, PhoneNo, FaxNo,$location,$timeout) {
        function format(state) {
            if (!state.id) return state.text; // optgroup
            return "<img class='flag' src='http://ivaynberg.github.com/select2/images/flags/" + state.id.toLowerCase() + ".png'/>" + state.text;
        }
        $("#select2_7").select2({
            formatResult: format,
            formatSelection: format,
            containerCss: " ",
            escapeMarkup: function(m) { return m; }
        });
        })


    .controller('TopNavCtrl', function (User, $scope, $location, $http) {
        $http.get(API_URL + 'user/info/', {withCredentials: true}).then(function (response) {
            User = response.data;
            $scope.user = User;
            console.log(User);
        })
    })

.controller('ChartCtrl',function($scope,$http,$location){
    
})