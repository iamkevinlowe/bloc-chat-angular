(function(){

  angular
    .module('app', [
      'app.controllers',
      'ui.router',
      'firebase',
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
    ])
    .factory('Room', [
      '$firebaseArray',
      RoomFactory
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

  function RoomFactory($firebaseArray) {
    var firebaseRef = new Firebase('bloc-chat-angular.firebaseIO.com');

    var rooms = $firebaseArray(firebaseRef.child('rooms'));
    
    function createNewRoom(newRoom) {
      rooms.$add(newRoom);
    }

    function getMessages(roomId) {
      return $firebaseArray(
        firebaseRef.child('messages')
        .orderByChild('roomId')
        .equalTo(roomId)
      );
    }

    return {
      all: rooms,
      create: createNewRoom,
      messages: getMessages
    }
  }

})();