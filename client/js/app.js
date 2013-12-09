'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngCookies']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: '/partials/front/login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/signup', {templateUrl: '/partials/front/signup.html', controller: 'RegisterCtrl'});
        $routeProvider.when('/forgot', {templateUrl: '/partials/front/forgot.html', controller: 'LoginCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])
    .config(function($httpProvider) {
        var numLoadings = 0;
        var loadingScreen = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:white;background-color:rgba(255,255,255,0.6);"><div style="position:absolute;top:45%;left:45.5%;font-size:4em;text-align:center"><i class="icon-spinner icon-spin icon-large"></i></div></div>')
            .appendTo($('body')).hide();
       $httpProvider.responseInterceptors.push(function() {
            return function(promise) {
                numLoadings++;
                loadingScreen.show();
                var hide = function(r) { if (!(--numLoadings)) loadingScreen.hide(); return r; };
                return promise.then(hide, hide);
            };
        });
    })
    .run(function ($rootScope, $location, $anchorScroll, $routeParams,$window,$cookies) {

        $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
                $location.hash($routeParams.scrollTo);
                $anchorScroll();
            },
            $rootScope.location = $location
        );
        
    });


angular.module('dashApp', ['dashApp.filters', 'dashApp.services', 'dashApp.directives', 'dashApp.controllers', 'ngCookies',]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: '/partials/admin/index.html', controller: 'DashHomeCtrl'});
        $routeProvider.when('/form_wiz', {templateUrl: '/partials/admin/form_wiz.html'});
        $routeProvider.when('/account/entity', {templateUrl: '/partials/admin/entity.html', controller: 'EntityCtrl'});
        $routeProvider.when('/account/entity/oops', {templateUrl: '/partials/admin/disp.html', controller: 'OppsCtrl'});
        $routeProvider.when('/edit/:id', {templateUrl: '/partials/admin/edit.html', controller: 'EntityEditCtrl'});
        $routeProvider.when('/view', {templateUrl: '/partials/admin/view.html', controller: 'EntityCtrl'});
        $routeProvider.when('/account/manage', {templateUrl: '/partials/admin/manage.html', controller: 'ManageEntityCtrl'});
        $routeProvider.when('/account/settings', {templateUrl: '/partials/admin/settings.html', controller: 'TopNavCtrl'});
        $routeProvider.when('/account/settings/notification', {templateUrl: '/partials/admin/noty.html',controller: 'NotificationSettingsCtrl'});
        $routeProvider.when('/account/plans', {templateUrl: '/partials/admin/plans.html', controller: 'PlansCtrl'});
        $routeProvider.when('/details/profile', {templateUrl: '/partials/admin/profile.html', controller: 'profileTable'});
        $routeProvider.when('/details/changes', {templateUrl: '/partials/admin/changes.html', controller: 'changesTable'});
        $routeProvider.when('/details/review', {templateUrl: '/partials/admin/review.html', controller: 'reviewTable'});
        //Individual Table
        $routeProvider.when('/reports/profile', {templateUrl: '/partials/admin/table.html'});
        $routeProvider.when('/reports/reviews', {templateUrl: '/partials/admin/table.html'});
        $routeProvider.when('/reports/changes', {templateUrl: '/partials/admin/table.html'});
        $routeProvider.when('/table', {templateUrl: '/partials/admin/table.html'});
        //$routeProvider.when('/oops', {templateUrl: '/partials/front/404.html'});
        $routeProvider.when('/table', {templateUrl: '/partials/admin/table.html'});
        $routeProvider.when('/table_res', {templateUrl: '/partials/admin/table_res.html'});
        $routeProvider.when('/pricing', {templateUrl: '/partials/admin/pricing_tab.html'});
        $routeProvider.when('/chart', {templateUrl: '/partials/admin/chart.html',controller:'ChartCtrl'});
        $routeProvider.when('/notification', {templateUrl: '/partials/admin/notification.html'});
        $routeProvider.when('/my_account_advance', {templateUrl: '/partials/admin/my_account_advance.html'});
        $routeProvider.when('/my_account', {templateUrl: '/partials/admin/my_account.html'});
        $routeProvider.when('/account/settings/plans', {templateUrl: '/partials/admin/finance.html',controller:'PlansCtrl'});
        $routeProvider.when('/rating', {templateUrl: '/partials/admin/rating.html'});
        $routeProvider.when('/invoice', {templateUrl: '/partials/admin/invoice.html'});
        $routeProvider.when('/faq', {templateUrl: '/partials/admin/faq.html'});
        $routeProvider.when('/timeline', {templateUrl: '/partials/admin/timeline.html'});
        $routeProvider.when('/widgets', {templateUrl: '/partials/admin/widgets.html'});
        $routeProvider.when('/modals', {templateUrl: '/partials/admin/modals.html'});
        $routeProvider.when('/noty', {templateUrl: '/partials/admin/noty.html'});
        $routeProvider.otherwise({redirectTo: '/oops'});

    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])
    .config(function($httpProvider) {
        var numLoadings = 0;
        var loadingScreen = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:white;background-color:rgba(255,255,255,0.6);"><div style="position:absolute;top:45%;left:45.5%;font-size:4em;text-align:center"><i class="icon-spinner icon-spin icon-large"></i></div></div>')
            .appendTo($('body')).hide();
        $httpProvider.responseInterceptors.push(function() {
            return function(promise) {
                numLoadings++;
                loadingScreen.show();
                var hide = function(r) { if (!(--numLoadings)) loadingScreen.hide(); return r; };
                return promise.then(hide, hide);
            };
        });
    })
    .run(function ($rootScope, $location, $anchorScroll, $routeParams, $cookies, $http,$window) {
        $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;
        $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
                $location.hash($routeParams.scrollTo);
                $anchorScroll();
            },
            $rootScope.location = $location
        );
        
    });

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


