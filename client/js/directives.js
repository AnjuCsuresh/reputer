'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);

angular.module('dashApp.directives', []).
directive('stripeForm', ['$window',
function($window) {

  var directive = { restrict: 'A' };
  directive.link = function(scope, element, attributes) {
    var form = angular.element(element);
    form.find('button').prop('disabled', true);
    form.bind('submit', function() {
      scope.disabled=true;
      $window.Stripe.createToken(form[0], function() {
        var args = arguments;
        scope.$apply(function() {
          scope[attributes.stripeForm].apply(scope, args);

        });
      //button.prop('disabled', false);
      });
    });
  };
  return directive;

}])
.directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);


angular.module('tdashApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);
