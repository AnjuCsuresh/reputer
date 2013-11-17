'use strict';

/* Controllers */


angular.module('myApp.controllers', []).

    controller('RegisterCtrl',function ($http, $scope, $location ,$window, $cookies) {
       
    }).

    controller('LoginCtrl', function ($http, $scope, $window, $cookieStore,$location,Login,$cookies) {
       $scope.login = function (user) {
            //adding some simple verifications
            user['username']= user.email
            delete user['email']
            $http.post(API_URL + 'user/login/', user, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    $scope.error = '';
                    $.cookie('the_cookie', data.user.id, { expires: 7 });
                    $window.location.href = 'dashboard.html'
                }
            })
                .error(function (data, status, headers, config) {
                    $scope.error = "The email or password that you entered was incorrect"
                });
        }
        $scope.register = function (user) {
            //adding some simple verifications
            var data = {
                password: user.password,
                email: user.email
            };
            $http.post(API_URL + 'newuser/', data).then(function (data) {
               var u = {
                    username: data.data.email,
                    password: user.password
                };
            
                $http.post(API_URL + 'user/login/',u, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                    $.cookie('the_cookie', data.user.id, { expires: 7 });
                    //todo: redirect to add entity screen
                    $window.location.href = 'dashboard.html#/account/entity'
                }
            })
                    
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
                    if(d){
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
    controller('DashHomeCtrl', function ($http, $scope, User,$filter,$timeout,$routeParams,$cookieStore,$location) {
        var id=$routeParams.id;
        if(id>0){
            $http.get(API_URL+'Entity/?id='+id+'&format=json').success(function (data) {
                  $scope.entity=data.objects[0]
                  if(data.objects[0].live==false){
                    $location.path('/account/entity/oops');
                  }
            });
        }
        else{
            var userid=$.cookie('the_cookie');
            $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&live=true&format=json').success(function (data) {
                    $scope.entities=data.objects
                    if(data.objects.length>0){
                        $scope.entity=data.objects[0]
                    }
                    else{
                        $location.path('/account/entity');
                    }

                })
        }
        $http.get(DATA_API_URL+'getcrawltable/'+id).success(function(data, status, headers, config){
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
                $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
            else
                $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
        };

        $scope.ignore = function(item){
            
            $http.get(DATA_API_URL+item.ignore).success(function(data, status, headers, config){
                item.hide = true;
                $scope.n = notyfy({
                    text: 'Ignored results from '+item.domain,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
        
            })
        }
        });

        $http.get(DATA_API_URL+'getscoretrend/'+id).success(function(data, status, headers, config){
            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line'
                    }
                },

                series: [{
                    name: 'Popularity Count',
                    data: data['pop_count']
                },
                {
                    name: 'Search Sentiment',
                    data: data['sentiment']
                }
                ],
                xAxis: {
                    categories: data['time'],
                    labels:
                    {
                      enabled: false
                    }
                },
                yAxis: {
                    lineWidth: 0,
                },
                title: {
                    text: 'Sentiment Score Trend'
                },

                loading: false
            }
        })
        
    })
     .controller('EntityCtrl', function ($http, $scope, User,$window,$location,$timeout,$routeParams,MessageBus) {
        var userid=$.cookie('the_cookie');
        $http.get(API_URL+'user/?id='+userid+'&format=json').success(function (data) {
                    $scope.user=data.objects[0]
                })
        $http.get(API_URL+'Profession/').success(function(data, status, headers, config){
            $scope.professions = data.objects;
        })
        $scope.save_person = function(entity){
            delete entity['business_name']
            entity.user=$scope.user;
            if(entity.profession.name!='Other'){
                entity.other_profession="";
            }
            $http.post(API_URL+'Entity/',entity).success(function(data, status, headers, config){
                $scope.n = notyfy({
                    text: 'Added new entity '+ data.first_name ,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
                MessageBus.broadcast("data");
                $location.path('/account/manage');
                })
        }
        $scope.save_business = function(entity){
            var business = {
                business_name: entity['business_name'],
                user:$scope.user
            };
            $http.post(API_URL+'Entity/',business).success(function(data, status, headers, config){
                $scope.n = notyfy({
                    text: 'Added new business '+ data.business_name ,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
                MessageBus.broadcast("data");
                $location.path('/account/manage');
            })
        }
    })

//Edit entity cntrlr
    .controller('EntityEditCtrl', function ($http, $scope, User,$location,$timeout,$routeParams) {
        var id=$routeParams.id;
        $http.get(API_URL+'Profession/').success(function(data, status, headers, config){
            $scope.professions = data.objects;
        })
        $scope.name={};
        $scope.url={};
        $scope.phone={};
        $scope.fax={};
        $scope.loctn={};
         //fetching all data from database for edit selected entity
        $http.get(API_URL+'Entity/?id='+id+'&format=json').success(function (data) {
                  $scope.entity=data.objects[0]
                  if(data.objects[0].location.length>0){
                    $scope.loctn=data.objects[0].location[0]
                  }
                  if(data.objects[0].business_name==null)
                  {
                    $scope.business=false;
                  }
                  else{
                    $scope.business=true;
                  }
                $http.get(API_URL+'Url/?entity__id='+data.objects[0].id+'&format=json').success(function (data) {
                    if(data.objects.length>0){
                        $scope.url=data.objects[0]
                    }
                })
                $http.get(API_URL+'Name/?entity__id='+data.objects[0].id+'&format=json').success(function (data) {
                    if(data.objects.length>0){
                        $scope.name=data.objects[0]
                    }
                })
                if(data.objects[0].location.length>0){
                $http.get(API_URL+'Phone/?location__id='+data.objects[0].location[0].id+'&format=json').success(function (data) {
                    if(data.objects.length>0){
                        $scope.phone=data.objects[0]
                    }
                })
                $http.get(API_URL+'Fax/?location__id='+data.objects[0].location[0].id+'&format=json').success(function (data) {
                    if(data.objects.length>0){
                        $scope.fax=data.objects[0]
                    }
                })
            }
        })
        //edit basic entity details
        $scope.edit_person = function(entity){
            if(entity.profession.name!='Other'){
                entity.other_profession="";
            }
            $http.put(API_URL+'Entity/'+entity.id+'/',entity).success(function(data, status, headers, config){
                $scope.n = notyfy({
                    text: 'Changes Saved for '+data.first_name,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
                $scope.entity=data
            })
        }

        //save location details
        $scope.save_location = function(entity,phone,fax,loctn){
               $http.post(API_URL+'Location/',loctn).success(function(data, status, headers, config){
                        entity.location[0]=data
                        phone.location=data
                        fax.location=data
                        $http.post(API_URL+'Phone/',phone).success(function(data, status, headers, config){
                            $scope.phone=data
                        })
                        $http.post(API_URL+'Fax/',fax).success(function(data, status, headers, config){
                            $scope.fax=data
                        })
                    
                    $http.post(API_URL+'Entity/',entity).success(function(data, status, headers, config){
                        $scope.n = notyfy({
                        text: 'Changes Saved for '+data.first_name ,
                        type: 'success',
                        dismissQueue:true,
                        closeWith:['hover'] 
                    });
                    $scope.entity=data
                })
           
            })
            
        }
        //save name and url
        $scope.save_name = function(name,url){
            url.entity=$scope.entity;
            name.entity=$scope.entity;
            $http.post(API_URL+'Url/',url).success(function(data, status, headers, config){
                $scope.n = notyfy({
                    text: 'Changes Saved for '+data.entity.first_name,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
                $scope.url=data
                })
            $http.post(API_URL+'Name/',name).success(function(data, status, headers, config){
                $scope.name=data
                })
        }
        //edit basic business details
        $scope.edit_business = function(entity){
             $http.put(API_URL+'Entity/'+entity.id+'/',entity).success(function(data, status, headers, config){
                $scope.n = notyfy({
                    text: 'Changes Saved for '+data.business_name,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
                $scope.entity=data
            })
        }

        //save business location details
        $scope.save_businesslocation = function(entity,phone,fax,loctn){
               $http.post(API_URL+'Location/',loctn).success(function(data, status, headers, config){
                        entity.location[0]=data
                        phone.location=data
                        fax.location=data
                        $http.post(API_URL+'Phone/',phone).success(function(data, status, headers, config){
                            $scope.phone=data
                        })
                        $http.post(API_URL+'Fax/',fax).success(function(data, status, headers, config){
                            $scope.fax=data
                        })
                    
                    $http.post(API_URL+'Entity/',entity).success(function(data, status, headers, config){
                        $scope.n = notyfy({
                        text: 'Changes Saved for '+data.business_name ,
                        type: 'success',
                        dismissQueue:true,
                        closeWith:['hover'] 
                    });
                    $scope.entity=data
                })
               })
            
        }
        //save business name and url
        $scope.save_businessname = function(name,url){
            url.entity=$scope.entity;
            name.entity=$scope.entity;
            $http.post(API_URL+'Url/',url).success(function(data, status, headers, config){
                $scope.n = notyfy({
                    text: 'Changes Saved for '+data.entity.business_name,
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
                $scope.url=data
                })
            $http.post(API_URL+'Name/',name).success(function(data, status, headers, config){
                $scope.name=data
                })
        }

    })



//Account settings cntrlr
    .controller('TopNavCtrl', function (User, $scope, $location, $http,$timeout,$cookies,$window,$cookieStore) {
        var email;
        var userid=$.cookie('the_cookie');
        $http.get(API_URL + 'user/info/', {withCredentials: true}).then(function (response) {
            User = response.data;
            email=response.data.email
            $scope.user = User;
           $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
                    $scope.entities=data.objects
                })
        $scope.logout = function(){
               $http.get(API_URL + 'user/logout/',{withCredentials: true}).success(function (data, status, headers, config) {
                    $.removeCookie('the_cookie');
                    $window.location.href=WEBSITE_URL;
                });
            }
        })
        $scope.$on("data", function() {
            $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
                   $scope.entities=data.objects
                })
        })
        $scope.save_password = function(user,user1){
            var u = {
                email:email,
                email1: user.email,
                password: user1.password,
                password1:user1.password1
                
            };
            $http.post(API_URL + 'user/test/',u, {withCredentials: true}).success(function (data, status, headers, config) {
                if (status == '200') {
                  $scope.n = notyfy({
                    text: 'password has been changed ',
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });  
                }
                else{
                    $scope.n = notyfy({
                    text: 'Your old password is incorrect',
                    type: 'error',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });  
                }
            })
                
        }

    })
.controller('ManageEntityCtrl', function ($scope, $location, $http,$timeout,$cookies,$window, MessageBus){
   var userid=$.cookie('the_cookie');
    $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
        $scope.entities=data.objects
    })
   $scope.deleteentity=function(entity){
        $http.delete(API_URL + entity.resource_uri).success(function (data) {
            $scope.n = notyfy({
                    text: 'Deleted',
                    type: 'success',
                    dismissQueue:true,
                    closeWith:['hover'] 
                });
            $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
                $scope.entities=data.objects
                MessageBus.broadcast("data");
            })
            
         })
   }  
   
})
.controller('NotificationSettingsCtrl',function($scope,$http,$location){
    var userid=$.cookie('the_cookie');
    $http.get(API_URL+'NotificationLevel/',{withCredentials:true}).success(function (data, status, headers, config) {
            $scope.levels = data.objects;
            $scope.levelInfo = {}
            for(var i=0;i<$scope.levels.length;i++){
                var l = $scope.levels[i]
                $scope.levelInfo[l.level] = l.description
            }
            
            
            $http.get(API_URL+'extended_user/?user__id='+userid).success(function (data, status, headers, config) {
                    var user = data.objects[0]
                    $scope.message = $scope.levelInfo[user.notification.level]
                    if ($('.increments-slider').size() > 0)
                    {
                        $( ".increments-slider .slider" ).slider({
                            create: JQSliderCreate,
                            value:user.notification.level,
                            min: $scope.levels[0].level,
                            max: $scope.levels[$scope.levels.length-1].level,
                            step: 1,
                            slide: function( event, ui ) {
                                $scope.message = $scope.levelInfo[ui.value]
                                $scope.sav_level = ui.value;
                                $scope.$apply();
                            },
                            start: function() { if (typeof mainYScroller != 'undefined') mainYScroller.disable(); },
                            stop: function() { if (typeof mainYScroller != 'undefined') mainYScroller.enable(); }
                        });
                        $( ".increments-slider .amount" ).val( "$" + $( ".increments-slider .slider" ).slider( "value" ) );
                    }
                    $scope.save = function(){
                        for(var i=0;i<$scope.levels.length;i++){
                            var l = $scope.levels[i]
                            if(l.level==$scope.sav_level){
                                user.notification = l
                                $http.put(API_SERVER_URL+user.resource_uri,data=user).success(function (data, status, headers, config) {
                                    $scope.n = notyfy({
                                        text: 'Changed notifications to Level '+user.notification.level,
                                        type: 'success',
                                        dismissQueue:true,
                                        closeWith:['hover'] 
                                    });
                                });
                            } 
                        }
                    }       
                });
    });
    
})
