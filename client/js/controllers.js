'use strict';

/* Controllers */


angular.module('myApp.controllers', []).

    controller('RegisterCtrl',function ($http, $scope, $location, $window, $cookies) {

    }).

    controller('LoginCtrl', function ($http, $scope, $window, $cookieStore, $location, Login, $cookies) {
        var usr;
        Stripe.setPublishableKey('pk_test_tK3fFd59fXpheHTemX2eVp7w');
        $scope.login = function (user) {
            //adding some simple verifications
            var u = {
                    username: user.email,
                    password: user.password
                };
            $http.post(API_URL + 'user/login/', u, {withCredentials: true}).success(function (data, status, headers, config) {

                if (status == '200') {
                    $scope.error = '';
                    $.cookie('the_cookie', data.user.id, { expires: 7 });
                    $window.location.href = 'dashboard.html'
                }
                else {
                    $scope.error = "We were unable to sign you in - please check the email and password that you entered. "
                }
                $scope.user.password = ""
            })

        }
       $scope.register = function (user) {
            //adding some simple verifications
            var data = {
                password: user.password,
                email: user.email
            };
            $http.post(API_URL + 'newuser/', data).then(function (data) {
            if(data.status == '201'){
               var u = {
                    username: data.data.email,
                    password: user.password
                };
            
                $http.post(API_URL + 'user/login/',u, {withCredentials: true}).success(function (data, status, headers, config) {
                    if (status == '200') {
                        $.cookie('the_cookie', data.user.id, { expires: 7 });
                    //todo: redirect to add entity screen
                        $window.location.href = 'dashboard.html#/account/plans'
                    }
                })
                }  
            else{
                $scope.error = "Someone with that email address has already registered with us. If you have just forgotten your password, please click here to have it sent to you."
                $scope.user.password=""
            }    
            })
        }

       
           

        /* ************************************************
         password reset
         ***************************************************
         */
        $scope.send = function (user) {
            //adding some simple verifications

            $http.put(API_URL + 'user/password_reset/', user, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    $scope.error = '';
                    var d = window.confirm("We've emailed you your new password to the email address you submitted. You should be receiving it shortly.");
                    if (d) {
                        $window.location.href = 'index.html'
                    }
                }
            })
                .error(function (data, status, headers, config) {
                    $scope.error = "Please Enter correct email"
                });

        }
    })
    .controller('MyCtrl2', [function () {
    }]);

angular.module('dashApp.controllers', []).

    controller('DashHomeCtrl', function ($http, $scope, User, $filter, $timeout, $routeParams, $cookieStore, $location) {
        //console.log($.cookie('entity'))
        var userid = $.cookie('the_cookie');
        var id = $.cookie('entity');
        if (id > 0) {
            $http.get(API_URL + 'Entity/?id=' + id + '&format=json',{withCredentials: true}).success(function (data) {
                $scope.entity = data.objects[0]
                if (data.objects[0].live == false) {
                    //console.log("success")
                    $location.path('/account/entity/oops');
                }
                else{
                     //PRODUCTION: $http.get(DATA_API_URL+'getscoretrend/'+id).success(function(data, status, headers, config){
                    $http.get(DATA_API_URL + 'getscoretrend/999', {withCredentials: true}).success(function (data, status, headers, config) {
                    var dataChart = {
                        "xScale": "time",
                        "yScale": "linear",
                        "type": "line",
                        "main": [
                            {
                            "className": ".pizza",
                            "data": data.sentiment
                            }
                        ]
                    };
                    var opts = {
                        "dataFormatX": function (x) {
                            return d3.time.format('%Y-%m-%d').parse(x);
                        },
                        "tickFormatX": function (x) {
                            return d3.time.format('%A')(x);
                        }
                    };
                    var dataChart2 = {
                        "xScale": "time",
                        "yScale": "linear",
                        "type": "line",
                        "main": [
                            {
                                "className": ".pizza",
                                "data": data.pop_count
                            }
                        ]
                    };
                    var opts = {
                        "dataFormatX": function (x) {
                            return d3.time.format('%Y-%m-%d').parse(x);
                        },
                        "tickFormatX": function (x) {
                            return d3.time.format('%A')(x);
                        }
                    };

                    var myChart = new xChart('line', dataChart, '#myChart', opts);
                    var myChart2 = new xChart('line', dataChart2, '#myChart2', opts);
                    })
                }
            });
        }
        else {
            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                if(!data.objects[0].active){
                    bootbox.alert("<b><center>Your card has expired<br>So please change credit card details</center></b>", function(result) 
                        {   
                                $timeout(function(){
                                $location.path('/creditcard');
                                },0); 
                
                            
                            
                        });
                }
            else{
            $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&live=true&format=json',{withCredentials: true}).success(function (data) {
                $scope.entities = data.objects
                if (data.objects.length > 0) {
                    
                        $scope.entity = data.objects[0]
                        //$.cookie('entity', data.objects[0].id);
                        //PRODUCTION: $http.get(DATA_API_URL+'getscoretrend/'+data.objects[0].id).success(function(data, status, headers, config){
                        $http.get(DATA_API_URL + 'getscoretrend/999', {withCredentials: true}).success(function (data, status, headers, config) {
                            var dataChart = {
                                "xScale": "time",
                                "yScale": "linear",
                                "type": "line",
                                "main": [
                                    {
                                    "className": ".pizza",
                                    "data": data.sentiment
                                    }
                                ]
                            };
                            var opts = {
                                "dataFormatX": function (x) {
                                    return d3.time.format('%Y-%m-%d').parse(x);
                                },
                                "tickFormatX": function (x) {
                                    return d3.time.format('%A')(x);
                                }
                            };
                            var dataChart2 = {
                                "xScale": "time",
                                "yScale": "linear",
                                "type": "line",
                                "main": [
                                    {
                                        "className": ".pizza",
                                        "data": data.pop_count
                                    }
                                ]
                            };
                            var opts = {
                                "dataFormatX": function (x) {
                                    return d3.time.format('%Y-%m-%d').parse(x);
                                },
                                "tickFormatX": function (x) {
                                    return d3.time.format('%A')(x);
                                }
                            };

                            var myChart = new xChart('line', dataChart, '#myChart', opts);
                            var myChart2 = new xChart('line', dataChart2, '#myChart2', opts);
                        })
                    
                }
                else {
                    $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&live=false&format=json',{withCredentials: true}).success(function (data) {
                        if (data.objects.length > 0) {
                            $.cookie('entity', data.objects[0].id);
                            $location.path('/account/entity/oops'); 
                        }
                        else{
                          $location.path('/account/entity')  
                        }
                    })
                    
                }

            })
            }
            })

        }

        
        //PRODUCTION CODE: $http.get(DATA_API_URL+'getcrawltable/'+id).success(function(data, status, headers, config){
    })
    .controller('EntityCtrl', function ($http, $scope, User, $window, $location, $timeout, $routeParams, MessageBus) {
        var userdata={}
        var userid = $.cookie('the_cookie');
        //console.log(userid)
        
       // stripe planchange
        $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
            if(data.objects[0].plan==null){
                $location.path('/account/plans')
            }
            else{
                userdata.plan=data.objects[0].plan
                userdata.username=data.objects[0].user.username
                //console.log(userdata)
                $http.post(API_URL + 'user/addcheck/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                        //console.log(data)
                        userdata={}
                        if(data.data=="Group"){
                            bootbox.confirm("<b><center>Adding Entity will change your plan from Solo to Group<br>Are you sure you want to change?</center></b>", function(result) 
                            {   
                                if(!result){
                                    $timeout(function(){
                                    $window.history.back();
                                    },0); 
                                }
                            
                            
                            });
                        
                        
                        }
                        else if(data.data=="Large Group"){
                            bootbox.confirm("<b><center>Adding Entity will change your plan from Group to Large Group<br>Are you sure you want to change?</center></b>", function(result) 
                            {
                                if(!result){
                                    $timeout(function(){
                                    $window.history.back();
                                    },0); 
                                }
                            });
                        }
                        
                })
        
    // stripe planchange
                $http.get(API_URL + 'user/?id=' + userid + '&format=json').success(function (data) {
                    $scope.user = data.objects[0]
                })
                $http.get(API_URL + 'Profession/').success(function (data, status, headers, config) {
                    $scope.professions = data.objects;
                })
            }
        })
        $scope.save_person = function (entity) {
            delete entity['business_name']
            entity.user = $scope.user;
            if (entity.profession.name != 'Other') {
                entity.other_profession = "";
            }
            $http.post(API_URL + 'Entity/', entity).success(function (data, status, headers, config) {
                $scope.n = notyfy({
                    text: 'Added new entity ' + data.first_name,
                    type: 'success',
                    dismissQueue: true,
                    closeWith: ['hover']
                });

                //stripe plan  
             
                $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                    userdata.customer=data.objects[0].stripe_customer
                    userdata.id=data.objects[0].id
                    userdata.type=data.objects[0].stripe_billing_type
                    userdata.plan=data.objects[0].plan
                    userdata.username=data.objects[0].user.username
                    //console.log(userdata)
                    $http.post(API_URL + 'user/entityadd/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                            if (status == '200') {
                                //console.log("success")
                            }
                            else {
                                //console.log("error")
                            }
                    })

                })

               
                MessageBus.broadcast("data");
                $location.path('/account/manage');
            })
        }
        $scope.save_business = function (entity) {
            var userdata={}
            var business = {
                business_name: entity['business_name'],
                user: $scope.user
            };
            $http.post(API_URL + 'Entity/', business).success(function (data, status, headers, config) {
                $scope.n = notyfy({
                    text: 'Added new business ' + data.business_name,
                    type: 'success',
                    dismissQueue: true,
                    closeWith: ['hover']
                });

               //stripe plan  
                //console.log(data.user.id)
                $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                    userdata.customer=data.objects[0].stripe_customer
                    userdata.id=data.objects[0].id
                    userdata.plan=data.objects[0].plan
                    userdata.type=data.objects[0].stripe_billing_type
                    userdata.username=data.objects[0].user.username
                    //console.log(data.objects)
                    //console.log(userdata)
                    $http.post(API_URL + 'user/entityadd/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                        if (status == '200') {
                                //console.log("success")
                        }
                        else {
                                //console.log("error")
                            }
                        })

                    })


                MessageBus.broadcast("data");
                $location.path('/account/manage');
            })
        }
        
    })
     //CONTROLLER - Profile
    .controller('profileTable', function ($http, $scope, User, $filter, $timeout, $routeParams, $cookieStore, $location) {
        var id = $.cookie('entity');
        if (id > 0) {
            $http.get(API_URL + 'Entity/?id=' + id + '&format=json',{withCredentials: true}).success(function (data) {
                $scope.entity = data.objects[0]
                if (data.objects[0].live == true) {
                     //PRODUCTION CODE: $http.get(DATA_API_URL+'getcrawltable/'+id).success(function(data, status, headers, config){
                    $http.get(DATA_API_URL + 'getcrawltable/999', {withCredentials: true}).success(function (data, status, headers, config) {
                        $scope.items = data.aaData;
                        $scope.predicate = 'Rank';
                        $scope.reverse = false;
                        $scope.filteredItems = [];
                        $scope.groupedItems = [];
                        //$scope.itemsPerPage = 5;
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
                                for (var attr in item) {
                                    if (item[attr] != null) {
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
                        $scope.sort_by = function (newSortingOrder) {
                            if ($scope.sortingOrder == newSortingOrder)
                                $scope.reverse = !$scope.reverse;

                             $scope.sortingOrder = newSortingOrder;

                            // icon setup
                            $('th i').each(function () {
                                // icon reset
                                $(this).removeClass().addClass('icon-sort');
                            });
                            if ($scope.reverse)
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-up');
                            else
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-down');
                        };

                        $scope.ignore = function (item) {

                            $http.get(DATA_API_URL + item.ignore).success(function (data, status, headers, config) {
                                item.hide = true;
                                $scope.n = notyfy({
                                text: 'Ignored results from ' + item.domain,
                                type: 'success',
                                dismissQueue: true,
                                closeWith: ['hover']
                                });

                            })
                        }
                    });
                }
            });
        }
        else {
            var userid = $.cookie('the_cookie');
            $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&live=true&format=json',{withCredentials: true}).success(function (data) {
                $scope.entities = data.objects
                if (data.objects.length > 0) {
                    $scope.entity = data.objects[0]
                    //PRODUCTION CODE: $http.get(DATA_API_URL+'getcrawltable/'+data.objects[0].id).success(function(data, status, headers, config){
                    $http.get(DATA_API_URL + 'getcrawltable/999', {withCredentials: true}).success(function (data, status, headers, config) {
                        $scope.items = data.aaData;
                        $scope.predicate = 'Rank';
                        $scope.reverse = false;
                        $scope.filteredItems = [];
                        $scope.groupedItems = [];
                        //$scope.itemsPerPage = 5;
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
                                for (var attr in item) {
                                    if (item[attr] != null) {
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
                        $scope.sort_by = function (newSortingOrder) {
                            if ($scope.sortingOrder == newSortingOrder)
                                $scope.reverse = !$scope.reverse;

                                $scope.sortingOrder = newSortingOrder;

                            // icon setup
                            $('th i').each(function () {
                            // icon reset
                            $(this).removeClass().addClass('icon-sort');
                            });
                            if ($scope.reverse)
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-up');
                            else
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-down');
                        };

                        $scope.ignore = function (item) {

                            $http.get(DATA_API_URL + item.ignore).success(function (data, status, headers, config) {
                                item.hide = true;
                                $scope.n = notyfy({
                                    text: 'Ignored results from ' + item.domain,
                                    type: 'success',
                                    dismissQueue: true,
                                    closeWith: ['hover']
                                });

                            })
                        }
                    });
                }
                
            })
        }
       

    })
    //CONTROLLER - REVIEW
    .controller('reviewTable', function ($http, $scope, User, $filter, $timeout, $routeParams, $cookieStore, $location) {
        var id = $.cookie('entity');
        if (id > 0) {
            $http.get(API_URL + 'Entity/?id=' + id + '&format=json',{withCredentials: true}).success(function (data) {
                $scope.entity = data.objects[0]
                if (data.objects[0].live == true) {
                    //PRODUCTION CODE: $http.get(DATA_API_URL+'getcrawltable/'+id).success(function(data, status, headers, config){
                    $http.get(DATA_API_URL + 'getcrawltable/' + '999', {withCredentials: true}).success(function (data, status, headers, config) {
                        $scope.items = data.aaData;
                        $scope.predicate = 'Rank';
                        $scope.reverse = false;
                        $scope.filteredItems = [];
                        $scope.groupedItems = [];
                        //$scope.itemsPerPage = 3;
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
                                for (var attr in item) {
                                    if (item[attr] != null) {
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
                        $scope.sort_by = function (newSortingOrder) {
                            if ($scope.sortingOrder == newSortingOrder)
                                $scope.reverse = !$scope.reverse;

                                $scope.sortingOrder = newSortingOrder;

                                // icon setup
                                $('th i').each(function () {
                                // icon reset
                                $(this).removeClass().addClass('icon-sort');
                                });
                                if ($scope.reverse)
                                    $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-up');
                                else
                                    $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-down');
                        };


                    })
                }
            });
        }
        else {
            var userid = $.cookie('the_cookie');
            $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&live=true&format=json',{withCredentials: true}).success(function (data) {
                $scope.entities = data.objects
                if (data.objects.length > 0) {
                    $scope.entity = data.objects[0]
                    //PRODUCTION CODE: $http.get(DATA_API_URL+'getcrawltable/'+data.objects[0].id).success(function(data, status, headers, config){
                    $http.get(DATA_API_URL + 'getcrawltable/' + '999', {withCredentials: true}).success(function (data, status, headers, config) {
                        $scope.items = data.aaData;
                        $scope.predicate = 'Rank';
                        $scope.reverse = false;
                        $scope.filteredItems = [];
                        $scope.groupedItems = [];
                        //$scope.itemsPerPage = 3;
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
                                for (var attr in item) {
                                    if (item[attr] != null) {
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
                        $scope.sort_by = function (newSortingOrder) {
                            if ($scope.sortingOrder == newSortingOrder)
                                $scope.reverse = !$scope.reverse;

                            $scope.sortingOrder = newSortingOrder;

                            // icon setup
                            $('th i').each(function () {
                                // icon reset
                            $(this).removeClass().addClass('icon-sort');
                            });
                            if ($scope.reverse)
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-up');
                            else
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-down');
                        };


                    })
                }
            })
        }


    })
    //CONTROLLER - Changes
    .controller('changesTable', function ($http, $scope, User, $filter, $timeout, $routeParams, $cookieStore, $location) {
        var id = $.cookie('entity');
        if (id > 0) {
            console.log(id)
            $http.get(API_URL + 'Entity/?id=' + id + '&format=json',{withCredentials: true}).success(function (data) {
                $scope.entity = data.objects[0]
                console.log(data)
                if (data.objects[0].live == true) {
                    //PRODUCTION CODE: $http.get(DATA_API_URL+'getchangestable/'+id).success(function(data, status, headers, config){
                    $http.get(DATA_API_URL + 'getchangestable/' + '999', {withCredentials: true}).success(function (data, status, headers, config) {
                        $scope.items = data.aaData;
                        $scope.predicate = 'Rank';
                        $scope.reverse = false;
                        $scope.filteredItems = [];
                        $scope.groupedItems = [];
                        //$scope.itemsPerPage = 3;
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
                                for (var attr in item) {
                                    if (item[attr] != null) {
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
                        $scope.sort_by = function (newSortingOrder) {
                            if ($scope.sortingOrder == newSortingOrder)
                                $scope.reverse = !$scope.reverse;

                                $scope.sortingOrder = newSortingOrder;

                                // icon setup
                                $('th i').each(function () {
                                    // icon reset
                                    $(this).removeClass().addClass('icon-sort');
                                });
                            if ($scope.reverse)
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-up');
                            else
                                $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-down');
                        };


                    })

                }
            });
        }
        else {
            var userid = $.cookie('the_cookie');
            $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&live=true&format=json',{withCredentials: true}).success(function (data) {
                $scope.entities = data.objects
                if (data.objects.length > 0) {
                    $scope.entity = data.objects[0]
                        //PRODUCTION CODE: $http.get(DATA_API_URL+'getchangestable/'+data.objects[0].id).success(function(data, status, headers, config){
                        $http.get(DATA_API_URL + 'getchangestable/' + '999', {withCredentials: true}).success(function (data, status, headers, config) {
                            $scope.items = data.aaData;
                            $scope.predicate = 'Rank';
                            $scope.reverse = false;
                            $scope.filteredItems = [];
                            $scope.groupedItems = [];
                            //$scope.itemsPerPage = 3;
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
                                    for (var attr in item) {
                                        if (item[attr] != null) {
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
                            $scope.sort_by = function (newSortingOrder) {
                                if ($scope.sortingOrder == newSortingOrder)
                                    $scope.reverse = !$scope.reverse;

                                $scope.sortingOrder = newSortingOrder;

                                // icon setup
                                $('th i').each(function () {
                                // icon reset
                                $(this).removeClass().addClass('icon-sort');
                                });
                                if ($scope.reverse)
                                    $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-up');
                                else
                                    $('th.' + newSortingOrder + ' i').removeClass().addClass('icon-chevron-down');
                            };


                        })

                }
            })
        }

    })
//Edit entity cntrlr
    .controller('EntityEditCtrl', function ($http, $scope, User, $location, $timeout, $routeParams) {
        var userid = $.cookie('the_cookie');
        var id = $routeParams.id;
        $http.get(API_URL + 'Profession/').success(function (data, status, headers, config) {
            $scope.professions = data.objects;
        })
        $scope.name = {};
        $scope.url = {};
        $scope.phone = {};
        $scope.fax = {};
        $scope.loctn = {};
        //fetching all data from database for edit selected entity
        $http.get(API_URL + 'Entity/?id=' + id + '&user__id=' + userid + '&alive=true&format=json',{withCredentials: true}).success(function (data) {
            if (data.objects.length > 0) {
                $scope.entity = data.objects[0]
                if (data.objects[0].location.length > 0) {
                    $scope.loctn = data.objects[0].location[0]
                }
                if (data.objects[0].business_name == null) {
                    $scope.business = false;
                }
                else {
                    $scope.business = true;
                }
                $http.get(API_URL + 'Url/?entity__id=' + data.objects[0].id + '&format=json').success(function (data) {
                    if (data.objects.length > 0) {
                        $scope.url = data.objects[0]
                    }
                })
                $http.get(API_URL + 'Name/?entity__id=' + data.objects[0].id + '&format=json').success(function (data) {
                    if (data.objects.length > 0) {
                        $scope.name = data.objects[0]
                    }
                })
                if (data.objects[0].location.length > 0) {
                    $http.get(API_URL + 'Phone/?location__id=' + data.objects[0].location[0].id + '&format=json').success(function (data) {
                        if (data.objects.length > 0) {
                            $scope.phone = data.objects[0]
                        }
                    })
                    $http.get(API_URL + 'Fax/?location__id=' + data.objects[0].location[0].id + '&format=json').success(function (data) {
                        if (data.objects.length > 0) {
                            $scope.fax = data.objects[0]
                        }
                    })
                }
            }
        })
        //edit basic entity details
        $scope.edit_person = function (entity) {
            if (entity.profession.name != 'Other') {
                entity.other_profession = "";
            }
            $http.put(API_URL + 'Entity/' + entity.id + '/', entity).success(function (data, status, headers, config) {
                $scope.n = notyfy({
                    text: 'Changes Saved for ' + data.first_name,
                    type: 'success',
                    dismissQueue: true,
                    closeWith: ['hover']
                });
                $scope.entity = data
            })
        }

        //save location details
        $scope.save_location = function (entity, phone, fax, loctn) {
            $http.post(API_URL + 'Location/', loctn).success(function (data, status, headers, config) {
                entity.location[0] = data
                phone.location = data
                fax.location = data
                $http.post(API_URL + 'Phone/', phone).success(function (data, status, headers, config) {
                    $scope.phone = data
                })
                $http.post(API_URL + 'Fax/', fax).success(function (data, status, headers, config) {
                    $scope.fax = data
                })

                $http.post(API_URL + 'Entity/', entity).success(function (data, status, headers, config) {
                    $scope.n = notyfy({
                        text: 'Changes Saved for ' + data.first_name,
                        type: 'success',
                        dismissQueue: true,
                        closeWith: ['hover']
                    });
                    $scope.entity = data
                })

            })

        }
        //save name and url
        $scope.save_name = function (name, url) {
            url.entity = $scope.entity;
            name.entity = $scope.entity;
            $http.post(API_URL + 'Url/', url).success(function (data, status, headers, config) {
                $scope.n = notyfy({
                    text: 'Changes Saved for ' + data.entity.first_name,
                    type: 'success',
                    dismissQueue: true,
                    closeWith: ['hover']
                });
                $scope.url = data
            })
            $http.post(API_URL + 'Name/', name).success(function (data, status, headers, config) {
                $scope.name = data
            })
        }
        //edit basic business details
        $scope.edit_business = function (entity) {
            $http.put(API_URL + 'Entity/' + entity.id + '/', entity).success(function (data, status, headers, config) {
                $scope.n = notyfy({
                    text: 'Changes Saved for ' + data.business_name,
                    type: 'success',
                    dismissQueue: true,
                    closeWith: ['hover']
                });
                $scope.entity = data
            })
        }

        //save business location details
        $scope.save_businesslocation = function (entity, phone, fax, loctn) {
            $http.post(API_URL + 'Location/', loctn).success(function (data, status, headers, config) {
                entity.location[0] = data
                phone.location = data
                fax.location = data
                $http.post(API_URL + 'Phone/', phone).success(function (data, status, headers, config) {
                    $scope.phone = data
                })
                $http.post(API_URL + 'Fax/', fax).success(function (data, status, headers, config) {
                    $scope.fax = data
                })

                $http.post(API_URL + 'Entity/', entity).success(function (data, status, headers, config) {
                    $scope.n = notyfy({
                        text: 'Changes Saved for ' + data.business_name,
                        type: 'success',
                        dismissQueue: true,
                        closeWith: ['hover']
                    });
                    $scope.entity = data
                })
            })

        }
        //save business name and url
        $scope.save_businessname = function (name, url) {
            url.entity = $scope.entity;
            name.entity = $scope.entity;
            $http.post(API_URL + 'Url/', url).success(function (data, status, headers, config) {
                $scope.n = notyfy({
                    text: 'Changes Saved for ' + data.entity.business_name,
                    type: 'success',
                    dismissQueue: true,
                    closeWith: ['hover']
                });
                $scope.url = data
            })
            $http.post(API_URL + 'Name/', name).success(function (data, status, headers, config) {
                $scope.name = data
            })
        }

    })


//Account settings cntrlr
    .controller('TopNavCtrl', function (User, $scope, $location, $http, $timeout, $cookies, $window, $cookieStore) {
        var email;
        var userid = $.cookie('the_cookie');
        $http.get(API_URL + 'user/info/', {withCredentials: true}).then(function (response) {
            User = response.data;
            email = response.data.email
            $scope.user = User;
            $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&format=json',{withCredentials: true}).success(function (data) {
                $scope.entities = data.objects
            })


            $scope.select = function (id) {
                $.cookie('entity', id);
                //console.log($.cookie('entity'))
                $window.location.href = 'dashboard.html'
            }
            $scope.logout = function () {
                $http.get(API_URL + 'user/logout/', {withCredentials: true}).success(function (data, status, headers, config) {

                    $.removeCookie('the_cookie');
                    $.removeCookie('entity');
                    $window.location.href = WEBSITE_URL;
                });
            }
        })
        $scope.$on("data", function () {
            $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&format=json',{withCredentials: true}).success(function (data) {
                console.log(data)
                $scope.entities = data.objects
            })
        })
        $scope.save_password = function (user, user1) {
            var u = {
                email: email,
                email1: user.email,
                password: user1.password,
                password1: user1.password1

            };
            $http.post(API_URL + 'user/test/', u, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    $scope.n = notyfy({
                        text: 'password has been changed ',
                        type: 'success',
                        dismissQueue: true,
                        closeWith: ['hover']
                    });
                }
                else {
                    $scope.n = notyfy({
                        text: 'Your old password is incorrect',
                        type: 'error',
                        dismissQueue: true,
                        closeWith: ['hover']
                    });
                }
            })

        }

    })
    .controller('ManageEntityCtrl', function ($scope, $location, $http, $timeout, $cookies, $window, MessageBus) {
        var userid = $.cookie('the_cookie');
        $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&format=json',{withCredentials: true}).success(function (data) {
            console.log(data)
            $scope.entities = data.objects
        })
        $scope.select = function (id) {
            $.cookie('entity', id);
            $window.location.href = 'dashboard.html'
        }
        $scope.delete = function (entity) {
            var userdata={}
            // stripe planchange
            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                userdata.plan=data.objects[0].plan
                userdata.username=data.objects[0].user.username
                //console.log(userdata)
                $http.post(API_URL + 'user/deletecheck/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                    //console.log(data)
                    userdata={}
                    if(data.data=="Solo"){
                        bootbox.confirm("<b><center>Deleting Entity will change your plan from Group to Solo<br>Are you sure you want to change?</center></b>", function(result) 
                        {   
                            if(result){
                                $timeout(function(){
                                $scope.deleteentity(entity);
                                },0); 
                            }
                            
                            
                        });
                        
                        
                    }
                    else if(data.data=="Group"){
                        bootbox.confirm("<b><center>Deleting Entity will change your plan from Large Group to Group<br>Are you sure you want to change?</center></b>", function(result) 
                        {
                           if(result){
                                $timeout(function(){
                                $scope.deleteentity(entity);
                                },0); 
                            }
                        });
                    }
                    else{
                      $scope.deleteentity(entity);  
                    }

                })
        })
    // stripe planchange

        }
        $scope.deleteentity = function (entity) {
            //console.log(entity)
            var userdata={}
            if(entity.first_name==null){
                bootbox.confirm("<b><center>Are you sure you want to delete "+entity.business_name+"</center></b>", function(result) 
                        {
                           if(result){
                                $timeout(function(){
                                    $http.delete(API_SERVER_URL + entity.resource_uri).success(function (data) {
                                        if(entity.first_name==null){
                                            $scope.n = notyfy({
                                            text: 'Deleted entity '+entity.business_name,
                                            type: 'success',
                                            dismissQueue: true,
                                            closeWith: ['hover']
                                            });
                                        }
                                        else{
                                            $scope.n = notyfy({
                                            text: 'Deleted entity '+entity.first_name+" "+entity.last_name,
                                            type: 'success',
                                            dismissQueue: true,
                                            closeWith: ['hover']
                                            });
                                        }
                    
                                        $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&format=json',{withCredentials: true}).success(function (data) {
                                            //stripe
                                            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                                                userdata.customer=data.objects[0].stripe_customer
                                                userdata.id=data.objects[0].id
                                                userdata.plan=data.objects[0].plan
                                                userdata.type=data.objects[0].stripe_billing_type
                                                userdata.username=data.objects[0].user.username
                                                //console.log(data.objects)
                                                //console.log(userdata)
                                                $http.post(API_URL + 'user/entitydelete/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                                                    if (status == '200') {
                                                        //console.log("success")
                                                    }
                                                    else {
                                                        //console.log("error")
                                                    }
                                                })

                                            })

                                            $scope.entities = data.objects
                                            MessageBus.broadcast("data");
                                        })

                                    })
                                },0); 
                            }
                        });
                
            }
            else{
                bootbox.confirm("<b><center>Are you sure you want to delete "+entity.first_name+" "+entity.last_name+"</center></b>", function(result) 
                        {
                           if(result){
                                $timeout(function(){
                                    $http.delete(API_SERVER_URL + entity.resource_uri).success(function (data) {
                                        if(entity.first_name==null){
                                            $scope.n = notyfy({
                                            text: 'Deleted entity '+entity.business_name,
                                            type: 'success',
                                            dismissQueue: true,
                                            closeWith: ['hover']
                                            });
                                        }
                                        else{
                                            $scope.n = notyfy({
                                            text: 'Deleted entity '+entity.first_name+" "+entity.last_name,
                                            type: 'success',
                                            dismissQueue: true,
                                            closeWith: ['hover']
                                            });
                                        }
                    
                                        $http.get(API_URL + 'Entity/?user__id=' + userid + '&alive=true&format=json',{withCredentials: true}).success(function (data) {
                        //stripe
                                            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                                                userdata.customer=data.objects[0].stripe_customer
                                                userdata.id=data.objects[0].id
                                                userdata.plan=data.objects[0].plan
                                                userdata.type=data.objects[0].stripe_billing_type
                                                userdata.username=data.objects[0].user.username
                                                //console.log(data.objects)
                                                //console.log(userdata)
                                                $http.post(API_URL + 'user/entitydelete/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                                                    if (status == '200') {
                                                        //console.log("success")
                                                    }
                                                    else {
                                                        //console.log("error")
                                                    }
                                                })

                                            })

                                            $scope.entities = data.objects
                                            MessageBus.broadcast("data");
                                        })

                                    })
                                },0); 
                            }
                        });
            }
            
        }//end function

    })
    .controller('NotificationSettingsCtrl',function ($scope, $http, $location) {
        var userid = $.cookie('the_cookie');
        $http.get(API_URL + 'NotificationLevel/', {withCredentials: true}).success(function (data, status, headers, config) {
            $scope.levels = data.objects;
            $scope.levelInfo = {}
            for (var i = 0; i < $scope.levels.length; i++) {
                var l = $scope.levels[i]
                $scope.levelInfo[l.level] = l.description
            }


            $http.get(API_URL + 'extended_user/?user__id=' + userid,{withCredentials: true}).success(function (data, status, headers, config) {
                var user = data.objects[0]
                $scope.message = $scope.levelInfo[user.notification.level]
                if ($('.increments-slider').size() > 0) {
                    $(".increments-slider .slider").slider({
                        create: JQSliderCreate,
                        value: user.notification.level,
                        min: $scope.levels[0].level,
                        max: $scope.levels[$scope.levels.length - 1].level,
                        step: 1,
                        slide: function (event, ui) {
                            $scope.message = $scope.levelInfo[ui.value]
                            $scope.sav_level = ui.value;
                            $scope.$apply();
                        },
                        start: function () {
                            if (typeof mainYScroller != 'undefined') mainYScroller.disable();
                        },
                        stop: function () {
                            if (typeof mainYScroller != 'undefined') mainYScroller.enable();
                        }
                    });
                    $(".increments-slider .amount").val("$" + $(".increments-slider .slider").slider("value"));
                }
                $scope.save = function () {
                    for (var i = 0; i < $scope.levels.length; i++) {
                        var l = $scope.levels[i]
                        if (l.level == $scope.sav_level) {
                            user.notification = l
                            $http.put(API_SERVER_URL + user.resource_uri, data = user).success(function (data, status, headers, config) {
                                $scope.n = notyfy({
                                    text: 'Changed notifications to Level ' + user.notification.level,
                                    type: 'success',
                                    dismissQueue: true,
                                    closeWith: ['hover']
                                });
                            });
                        }
                    }
                }
            });
        });

    }).

    controller('PlansCtrl', function ($scope, $http, $location,$rootScope) {
        var oldplan;
        $scope.type="monthly"
        $scope.plan="";
        var quantity
        $scope.solo={
            select:"Select",
            quantity:1,
            highlight:""
        }
        $scope.group={
            select:"Select",
            quantity:2,
            highlight:""
        }
        $scope.largegroup={
            select:"Select",
            quantity:21,
            highlight:""
        }
        var userid = $.cookie('the_cookie');
        $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
            if(data.objects[0].plan==null){
                $scope.change=false;
                
            }
            else{
               $scope.change=true; 
               if(data.objects[0].plan==SOLO_PLAN_MONTHLY ||data.objects[0].plan==SOLO_PLAN_YEARLY){
                    $scope.plan="Solo"
                    oldplan="Solo"
                    $scope.solo.select="Selected"
                    $scope.solo.highlight="highlight"
               }
               else if(data.objects[0].plan==GROUP_PLAN_MONTHLY ||data.objects[0].plan==GROUP_PLAN_YEARLY){
                    $scope.plan="Group"
                    oldplan="Group"
                    $scope.group.select="Selected"
                    $scope.group.highlight="highlight"
               }
               else{
                    $scope.plan="Large Group"
                    oldplan="Large Group"
                    $scope.largegroup.select="Selected"
                    $scope.largegroup.highlight="highlight"
               }
               //console.log(data.objects[0].stripe_billing_type)
               $scope.type=data.objects[0].stripe_billing_type
            }
        })

        var userdata={}
        
        Stripe.setPublishableKey('pk_test_tK3fFd59fXpheHTemX2eVp7w');
        $scope.select=function(data){
            quantity=data.quantity
            if(data.quantity==1){
                $scope.plan="Solo"
                $scope.solo.select="Selected"
                $scope.group.select="Select"
                $scope.largegroup.select="Select"
                $scope.solo.highlight="highlight"
                $scope.group.highlight=""
                $scope.largegroup.highlight=""
            }
            else if(data.quantity==2){
                $scope.plan="Group"
                $scope.solo.select="Select"
                $scope.group.select="Selected"
                $scope.largegroup.select="Select"
                $scope.solo.highlight=""
                $scope.group.highlight="highlight"
                $scope.largegroup.highlight=""
            }
            else{
                $scope.plan="Large Group"
                $scope.solo.select="Select"
                $scope.group.select="Select"
                $scope.largegroup.select="Selected"
                $scope.solo.highlight=""
                $scope.group.highlight=""
                $scope.largegroup.highlight="highlight"
            }

        }

        $scope.savestriper=function(stripe,type){

            
            userdata.type=type
            Stripe.card.createToken({
            number:stripe.number,
            cvc: stripe.cvc,
            exp_month: stripe.expmonth,
            exp_year: stripe.expyear
            }, $scope.stripeResponseHandler);
            $scope.card={}
        }
        $scope.stripeResponseHandler = function(status, response) {
            
            //console.log(response)
            if (response.error) {
                console.log(response.error)
                bootbox.alert("<b><center>"+response.error.message+"</center></b>",function(result){

                })
                
            }
            else{
                $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                  //console.log(data.objects[0])
                  userdata.email=data.objects[0].user.email
                  userdata.id=data.objects[0].id
                  userdata.token= response.id;
                  userdata.quantity=quantity
                    if (userdata.type=="monthly"){
                        if($scope.plan=="Solo"){
                            userdata.plan= SOLO_PLAN_MONTHLY 
                        }
                        else if($scope.plan=="Group"){
                            userdata.plan= GROUP_PLAN_MONTHLY
                        }
                        else{
                            userdata.plan= LGROUP_PLAN_MONTHLY 
                        }
                    }
                    else{
                        if($scope.plan=="Solo"){
                            userdata.plan= SOLO_PLAN_YEARLY 
                        }
                        else if($scope.plan=="Group"){
                            userdata.plan= GROUP_PLAN_YEARLY
                        }
                        else{
                            userdata.plan= LGROUP_PLAN_YEARLY 
                        }
                    }
                    //console.log(userdata)
                    $http.post(API_URL + 'user/customer/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                        if (status == '200') {
                             $location.path('/account/entity');
                        }
                        else {
                            //console.log(error)
                        }
                    })
                
               })

            }
            
            //$rootScope.user.stripeCustomerId = response.id;
            //$rootScope.user.save();
        }
        $scope.changeplan=function(type){
            userdata.type=type
            if (type=="monthly"){
                if($scope.plan=="Solo"){
                  userdata.plan= SOLO_PLAN_MONTHLY 
                }
                else if($scope.plan=="Group"){
                    userdata.plan= GROUP_PLAN_MONTHLY
                }
                else{
                  userdata.plan= LGROUP_PLAN_MONTHLY 
                }
            }
            else{
                if($scope.plan=="Solo"){
                  userdata.plan= SOLO_PLAN_YEARLY 
                }
                else if($scope.plan=="Group"){
                    userdata.plan= GROUP_PLAN_YEARLY
                }
                else{
                  userdata.plan= LGROUP_PLAN_YEARLY 
                }
            }
            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                userdata.customer=data.objects[0].stripe_customer
                userdata.id=data.objects[0].id
                userdata.username=data.objects[0].user.username
                //console.log(userdata)
                $http.post(API_URL + 'user/planchange/', userdata, {withCredentials: true}).success(function (data, status, headers, config) {
                    console.log(data)
                    if (data.success == true) {
                        $scope.n = notyfy({
                                    text: 'Your plan successfully changed from '+oldplan+' to '+ $scope.plan,
                                    type: 'success',
                                    dismissQueue: true,
                                    closeWith: ['hover']
                                });
                        oldplan=$scope.plan
                    }
                    else {
                        $scope.n = notyfy({
                        text: 'Error',
                        type: 'error',
                        dismissQueue: true,
                        closeWith: ['hover']
                    });
                    }
                })
            })
        }



    }).
    controller('OppsCtrl', function ($scope, $http, $location,$rootScope,$cookies) {
        
        var id = $.cookie('entity');
        $http.get(API_URL + 'Entity/?id=' + id + '&format=json',{withCredentials: true}).success(function (data) {
                $scope.entity = data.objects[0]
        
        })
    }).
    controller('InvoiceCtrl', function ($scope, $http, $location,$rootScope,$cookies,$routeParams) {
        var id= $routeParams.id;
        var userid = $.cookie('the_cookie');
        $http.get(API_URL + 'user/?id=' + userid + '&format=json').success(function (data) {
                $scope.user=data.objects[0]
            })
        var data = {
            invoice_id: id,
                     
        }; 
        console.log(data) 
        $http.post(API_URL + 'user/invoices/',data, {withCredentials: true}).success(function (data, status, headers, config) {
            if (status == '200') {
                console.log(data)
                $scope.invoice=data.data
                $scope.lines=data.data.lines
                }
                
        })
                
               
}).
controller('FullinvoiceCtrl', function ($scope, $http, $location,$rootScope,$cookies) {
        
        var userid = $.cookie('the_cookie');
      
            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                    var data = {
                        customer: data.objects[0].stripe_customer,
                     
                    }; 
                    console.log(data) 
                    $http.post(API_URL + 'user/fullinvoices/',data, {withCredentials: true}).success(function (data, status, headers, config) {
                        if (status == '200') {
                       
                            console.log(data)
                            $scope.invoices=data.data
                            
                        }
                        else {
                            //console.log(error)
                        }
                    })
                
               })
}).

controller('BillingCtrl', function ($scope, $http, $location,$rootScope,$cookies) {
        
        var userid = $.cookie('the_cookie');
        $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
            var data = {
                        customer: data.objects[0].stripe_customer,
                     
                    }; 
            $http.post(API_URL + 'user/events/',data, {withCredentials: true}).success(function (data, status, headers, config) {
                        if (status == '200') {
                       
                            console.log(data)
                            $scope.events=data.data

                        }
                        else {
                            //console.log(error)
                        }
                    })

        })
   }).
controller('ChangeCardCtrl', function ($scope, $http, $location,$rootScope,$cookies) {
        Stripe.setPublishableKey('pk_test_tK3fFd59fXpheHTemX2eVp7w');
        var userid = $.cookie('the_cookie');
        $scope.card={}
            $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                    var data = {
                        customer: data.objects[0].stripe_customer,
                     
                    }; 
                    $http.post(API_URL + 'user/carddetails/',data, {withCredentials: true}).success(function (data, status, headers, config) {
                        if (status == '200') {
                            $scope.card=data.data
                            $scope.card.number="**** **** **** "+$scope.card.number
                            
                        }
                        else {
                            //console.log(error)
                        }
                    })
                
               })

            $scope.edit_card=function(card){
                var data = {
                    customer: card.customer,
                    id:card.id,
                    expmonth:card.exp_month,
                    expyear:card.exp_year

                };

                $http.post(API_URL + 'user/editcard/',data, {withCredentials: true}).success(function (data, status, headers, config) {
                    if (status == '200') {

                        $scope.n = notyfy({
                            text: 'Your credit card details updated successfully',
                            type: 'success',
                            dismissQueue: true,
                            closeWith: ['hover']
                        });

                    }
                    else {
                            //console.log(error)
                        }
                    })
            }

        $scope.savestripe=function(creditcard){
            
            Stripe.card.createToken({
            number:creditcard.number,
            cvc: creditcard.cvc,
            exp_month: creditcard.expmonth,
            exp_year: creditcard.expyear
            }, $scope.stripeResponse);
            $scope.creditcard={}
        }
        
        $scope.stripeResponse = function(status, response) {
            
            if (response.error) {
                console.log(response.error)
                bootbox.alert("<b><center>"+response.error.message+"</center></b>",function(result){

                })
                
            }
            else{
                $http.get(API_URL + 'extended_user/?user__id=' + userid + '&format=json',{withCredentials: true}).success(function (data) {
                    var d = {
                        customer: data.objects[0].stripe_customer,
                        token: response.id
                    }; 
                    console.log(data) 
                    $http.post(API_URL + 'user/updatecard/',d, {withCredentials: true}).success(function (data, status, headers, config) {
                        if (status == '200') {
                            $http.post(API_URL + 'user/carddetails/',d, {withCredentials: true}).success(function (data, status, headers, config) {
                                if (status == '200') {
                                    $scope.card=data.data
                                    $scope.card.number="**** **** **** "+$scope.card.number
                                    $scope.n = notyfy({
                                        text: 'Successfully added new card',
                                        type: 'success',
                                        dismissQueue: true,
                                        closeWith: ['hover']
                                    });
                                }

                            })
                        }
                        
                    })
                
               })
             
            }
            
        }
})