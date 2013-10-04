'use strict';

/* Controllers */
var API_URL = 'https://app.reputer.co/api/v1/';
angular.module('myApp.controllers', []).

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
        console.log("Dashboard Home")

    })
    .controller('EntityCtrl', function ($http, $scope, User, Loctns, Names, URLS, Entity, Phone, Fax, PhoneNo, FaxNo,$location,$timeout) {
        
        
        
        
        
        $scope.entity = {}
        $scope.entity.location = []
        $scope.add_phone = function () {
            var phone = {
                number: ''
            }
            Phone.push(phone);
            $scope.phonenos = Phone;
        };
        $scope.add_fax = function () {
            var fax = {
                number: ''
            }
            Fax.push(fax);
            $scope.faxnos = Fax;
        };
        $scope.add_location = function (loctn, phonenos, faxnos) {
            
            for (var i = 0; i < phonenos.length; i++) {
                var ph = {
                    location: loctn,
                    number: phonenos[i]['number']
                }
                PhoneNo.push(ph)
            }

            for (var j = 0; j < faxnos.length; j++) {
                var fx = {
                    location: loctn,
                    number: faxnos[j]['number']
                }
                FaxNo.push(fx)

            }


            Loctns.push(loctn);
            $scope.loctns = Loctns;
            $scope.entity.location.push(loctn);
            Phone = [];
            Fax = [];
            $scope.loctn = {};
            $scope.phonenos = Phone;
            $scope.faxnos = Fax;
            console.log(Phone)

        };


        $scope.add_name = function (name) {

            Names.push(name);
            $scope.names = Names;
            $scope.name = {};
        };


        $scope.add_url = function (newurl) {


            URLS.push(newurl);
            $scope.urls = URLS;
            $scope.newurl = "";
        };


        $scope.add_entity = function (entity) {
            Entity.add(entity).then(function (data) {
                console.log('Adding Entity  : ')
                var returned_entity = data.data

                /* ************************************************
                               PATCH URLS
                ***************************************************
                */
                //This code prepares the patch stuff for the URLS
                
                
                var urls_patch = {
                    objects: []
                }
                for (var i=0;i<URLS.length;i++) {
                    var url = URLS[i]['url'];
                    var url_object = {
                        entity: returned_entity,
                        url: url
                    }


                    urls_patch.objects.push(url_object)

                }
                
                for (var i=0; i<urls_patch.objects.length; i++){
                    Entity.addurl(urls_patch.objects[i])
                }


                /*$http({
                    method: 'POST',
                    url: API_URL+'Url/',
                    data: urls_patch['objects'][0]
                }).success(function (data) {
                        console.log("URLS Added")
                        console.log(data)
                });
                ************************************************
                                PATCH NAMES
                ***************************************************
                 */
                var names_patch = {
                    objects: []
                }
                for (var i = 0; i < Names.length; i++) {

                    var alternate_name = Names[i]['alternate_name'];
                    var common_misspellings_of_the_name = Names[i]['common_misspellings_of_the_name'];
                    var school_attended1 = Names[i]['school_attended1'];
                    var school_attended2 = Names[i]['school_attended2'];
                    var previous_places_lived1 = Names[i]['previous_places_lived1'];
                    var previous_places_worked1 = Names[i]['previous_places_worked1'];
                    var previous_places_lived2 = Names[i]['previous_places_lived2'];
                    var previous_places_worked2 = Names[i]['previous_places_worked2'];
                    var name_object = {
                        entity: returned_entity,
                        alternate_name: alternate_name,
                        common_misspellings_of_the_name: common_misspellings_of_the_name,
                        school_attended1: school_attended1,
                        school_attended2: school_attended2,
                        previous_places_lived1: previous_places_lived1,
                        previous_places_worked1: previous_places_worked1,
                        previous_places_lived2: previous_places_lived2,
                        previous_places_worked2: previous_places_worked2,

                    }
                    names_patch.objects.push(name_object)
                }
                
                for(var i=0;i<names_patch.objects.length;i++){
                    Entity.addname(names_patch.objects[i])
                }

                /* ************************************************
                               PHONE 
                ***************************************************
                */
                
                var phone_patch = {
                    objects: []
                }
                console.log(PhoneNo.length)
                for (var i=0;i<PhoneNo.length;i++) {
                    var number = PhoneNo[i]['number'];
                    for(var j=0;j<returned_entity.location.length;j++){
                        if(returned_entity.location[j].address1==PhoneNo[i].location.address1&&returned_entity.location[j].address2==PhoneNo[i].location.address2&&returned_entity.location[j].city==PhoneNo[i].location.city&&returned_entity.location[j].state==PhoneNo[i].location.state&&returned_entity.location[j].zip_code==PhoneNo[i].location.zip_code){
                            var loctn=returned_entity.location[j];
                        }
                    }
                    var phone_object = {
                        location: loctn,
                        number: number
                    }


                    phone_patch.objects.push(phone_object)

                }
                console.log('phone_patch')
                console.log(phone_patch)
               for(var i=0; i<phone_patch.objects.length; i++){
                    
                    Entity.addphone(phone_patch.objects[i])
                }

                /* ************************************************
                               FAXNO
                ***************************************************
                */
                var fax_patch = {
                    objects: []
                }
                for (var i=0;i<FaxNo.length;i++) {
                    var number = FaxNo[i]['number'];
                    for(var j=0;j<returned_entity.location.length;j++){
                        if(returned_entity.location[j].address1==FaxNo[i].location.address1&&returned_entity.location[j].address2==FaxNo[i].location.address2&&returned_entity.location[j].city==FaxNo[i].location.city&&returned_entity.location[j].state==FaxNo[i].location.state&&returned_entity.location[j].zip_code==FaxNo[i].location.zip_code){
                            var location=returned_entity.location[j];
                        }
                    }
                    var fax_object = {
                        location: location,
                        number: number
                    }


                    fax_patch.objects.push(fax_object)

                }
                console.log('fax_patch')
                console.log(fax_patch)
                for(var i=0; i<fax_patch.objects.length; i++){
                   Entity.addfax(fax_patch.objects[i])
                }

               /* $http({
                    method: 'PATCH',
                    url: API_URL+'Name/',
                    data: names_patch
                }).success(function (data) {
                        console.log('Adding - Patched Names Success')
                        console.log(data)
                    });

                ************************************************
                            PATCH PHONE NUMBERS
                 ***************************************************
                 
                $http({
                    method: 'POST',
                    url: API_URL+'Phone/',
                    data: PhoneNo['objects'][0]
                }).success(function (data) {
                        console.log('Patching Phone Numbers Success')
                        console.log(data)
                    });
                 ************************************************
                            PATCH FAX NUMBERS
                 ***************************************************
                 
                $http({
                    method: 'POST',
                    url: API_URL+'Fax/',
                    data: FaxNo['objects'][0]
                }).success(function (data) {
                        console.log('Patching Fax Numbers Success')
                        console.log(data)
                });*/
                /*Fax=[];
                Phone=[];
                Loctns = [];
                Names = [];
                URLS = [];
                PhoneNo=[];
                FaxNo=[];
                $scope.faxnos = Fax;
                $scope.phonenos = Phone;
                $scope.loctns = Loctns;
                $scope.names = Names;
                $scope.urls = URLS;
                $scope.entity = {}*/
                $scope.entity.location = []
                $location.path('/');
                
            });
            

        };
                Fax=[];
                Phone=[];
                Loctns = [];
                Names = [];
                URLS = [];
                PhoneNo=[];
                FaxNo=[];
                $scope.faxnos = Fax;
                $scope.phonenos = Phone;

        $scope.delete_phone = function (phoneno) {
            $scope.phonenos.remove(phoneno)
        };
        $scope.delete_fax = function (faxno) {
            $scope.faxnos.remove(faxno)
        };
        $scope.delete_loc = function (loctn) {
            $scope.loctns.remove(loctn)
            for (var i = 0; i < PhoneNo.length; i++) {

                if ((PhoneNo[i]['location'] != loctn)) {

                }

                else {
                    var index = PhoneNo.indexOf(PhoneNo[i])
                    PhoneNo.splice(index, 1);
                    i = i - 1;

                }

            }
            console.log(PhoneNo)

            for (var i = 0; i < FaxNo.length; i++) {

                if ((FaxNo[i]['location'] != loctn)) {

                }

                else {
                    var index = FaxNo.indexOf(FaxNo[i])
                    FaxNo.splice(index, 1);
                    i = i - 1;

                }

            }
            console.log(FaxNo)


        };

        $scope.delete_name = function (name) {
            $scope.names.remove(name)
        };

        $scope.delete_url = function (url) {
            $scope.urls.remove(url)
        }


    })


    .controller('TopNavCtrl', function (User, $scope, $location, $http) {
        $http.get(API_URL + 'user/info/', {withCredentials: true}).then(function (response) {
            User = response.data;
            $scope.user = User;
            console.log(User);
        })
    });
