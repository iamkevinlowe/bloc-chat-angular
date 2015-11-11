(function() {

  angular
    .module('app.controllers', [])
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
    ])
    .controller('newUserModal.controller', [
      '$scope',
      '$uibModalInstance',
      NewUserModalController
    ]);

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

    function NewUserModalController($scope, $uibModalInstance) {
      $scope.onNewUserSubmit = function(valid) {
        if (valid) {
          $uibModalInstance.close($scope.newUser);
        }
      };
    }

})();