(function(){

  angular
    .module('app', [
      'ui.router',
      'firebase',
      'ui.bootstrap'
    ])
    .config(MainConfig)
    .factory('Room', [
      '$firebaseArray',
      RoomFactory
    ])
    .controller('main.controller', [
      '$scope',
      'Room',
      '$uibModal',
      MainController
    ])
    .controller('newRoomModal.controller', [
      '$scope',
      '$uibModalInstance',
      NewRoomModalController
    ]);

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

  function MainController($scope, Room, $uibModal) {
    $scope.currentRoom = null;
    $scope.rooms = Room.all;

    var createNewRoom = Room.create;
    var getMessages = Room.messages;

    $scope.onNewRoomClick = function() {
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/newRoomModal.html',
        controller: 'newRoomModal.controller'
      });

      modalInstance.result.then(function(newRoom) {
        createNewRoom(newRoom);
      }, function() {
        console.log("Dismissed");
      });
    }

    $scope.onRoomClick = function(e, room) {
      e.preventDefault();
      $scope.currentRoom = room;
      $scope.messages = getMessages(room.$id);
    };
  }

  function NewRoomModalController($scope, $uibModalInstance) {
    $scope.onNewRoomSubmit = function(valid) {
      if (valid) {
        $uibModalInstance.close($scope.newRoom);
      }
    };

    $scope.onCancelClick = function(e) {
      e.preventDefault();
      $uibModalInstance.dismiss('cancel');
    };
  }

})();