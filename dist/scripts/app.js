(function(){

  angular
    .module('app', [
      'app.controllers',
      'app.services',
      'ui.router',
      'ui.bootstrap',
      'ngCookies'
    ])
    .run([
      '$cookies',
      '$uibModal',
      CookiesService
    ])
    .config([
      '$stateProvider',
      '$locationProvider',
      MainConfig
    ]);

  function CookiesService($cookies, $uibModal) {
    var currentUser = $cookies.get('blocChatCurrentUser');
    if (!currentUser || currentUser === '') {
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/newUserModal.html',
        controller: 'newUserModal.controller',
        backdrop: 'static'
      });
      
      modalInstance.result.then(function(newUser) {
        $cookies.put('blocChatCurrentUser', newUser.name);
      });
    }
  }

  function MainConfig($stateProvider, $locationProvider) {
    $locationProvider
      .html5Mode({
        enabled: true,
        requireBase: false
      }
    );

    $stateProvider
      .state('main', {
        url: '/',
        controller: 'main.controller',
        templateUrl: 'templates/main.html'
      }
    );
  }

})();