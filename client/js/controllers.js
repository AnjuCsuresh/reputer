'use strict';

/* Controllers */


angular.module('myApp.controllers', []).

    controller('RegisterCtrl',function ($http, $scope, $location ,$window, $cookies) {
        console.log('This is register');

        
    }).

    controller('LoginCtrl', function ($http, $scope, $window, $cookieStore,$location,Login,$cookies) {
        console.log('This is LoginCtrl');
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
                console.log(data.data.username)
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
                    console.log(data)                    
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
        console.log("2dd")
    }]);

angular.module('dashApp.controllers', []).
    controller('DashHomeCtrl', function ($http, $scope, User,$filter,$timeout,$routeParams,$cookieStore,$location) {
        var id=$routeParams.id;
        if(id>0){
            $http.get(API_URL+'Entity/?id='+id+'&format=json').success(function (data) {
                  $scope.entity=data.objects[0]
            });
        }
        else{
            console.log($.cookie('the_cookie'))
            var userid=$.cookie('the_cookie');
            $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
                    console.log(data.objects)
                    $scope.entities=data.objects
                    if(data.objects.length>0){
                        $scope.entity=data.objects[0]
                    }
                    else{
                        $location.path('/account/entity');
                    }

                })
        }
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

        $http.get(DATA_API_URL+'getscoretrend/10').success(function(data, status, headers, config){
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
     .controller('EntityCtrl', function ($http, $scope, User,$window,Entity, Phone, Fax, PhoneNo, FaxNo,$location,$timeout,$routeParams,MessageBus) {
        var userid=$.cookie('the_cookie');
        $http.get(API_URL+'user/?id='+userid+'&format=json').success(function (data) {
                    $scope.user=data.objects[0]
                    console.log($scope.user)
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
    .controller('EntityEditCtrl', function ($http, $scope, User, Loctns, Names, URLS, Entity, Phone, Fax, PhoneNo, FaxNo,$location,$timeout,$routeParams) {
        var id=$routeParams.id;
        console.log(id)
        $http.get(API_URL+'Profession/').success(function(data, status, headers, config){
            $scope.professions = data.objects;
            console.log(data.objects)
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
            console.log(entity)
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
                console.log(loctn)
                $http.post(API_URL+'Location/',loctn).success(function(data, status, headers, config){
                        console.log(data)
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
            console.log(name)
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
                
            console.log(name)
            console.log(url)
            
        }
        //edit basic business details
        $scope.edit_business = function(entity){
            console.log(entity)
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
                console.log(loctn)
                $http.post(API_URL+'Location/',loctn).success(function(data, status, headers, config){
                        console.log(data)
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
            console.log(name)
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
                
            console.log(name)
            console.log(url)
            
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
            console.log(response)
            $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
                    console.log(data.objects)
                    $scope.entities=data.objects
                })
            console.log(User);

            $scope.logout = function(){
               $http.get(API_URL + 'user/logout/',{withCredentials: true}).success(function (data, status, headers, config) {
                    $.removeCookie('the_cookie');
                    $window.location.href=WEBSITE_URL;
                });
            }
        })
        $scope.$on("data", function() {
            $http.get(API_URL+'Entity/?user__id='+userid+'&alive=true&format=json').success(function (data) {
                    console.log(data.objects)
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
            console.log(u)
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
            console.log(data.objects)
            $scope.entities=data.objects
    })
   $scope.deleteentity=function(entity){
    console.log(entity.resource_uri)
        $http.delete("http://localhost:8000" + entity.resource_uri).success(function (data) {
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
.controller('ChartCtrl',function($scope,$http,$location){
    
})
