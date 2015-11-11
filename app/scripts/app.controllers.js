(function() {

  angular
    .module('app.controllers', [])
    .controller('main.controller', [
      '$scope',
      'RoomService',
      'MessageService',
      'FormatTimeService',
      '$uibModal',
      '$cookies',
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

    function MainController(
      $scope,
      RoomService,
      MessageService,
      FormatTimeService,
      $uibModal,
      $cookies
    ) {

      $scope.rooms = RoomService.all;
      $scope.currentRoom = null;
      $scope.newMessage = {};

      var createNewRoom = RoomService.create;
      var getMessages = RoomService.messages;
      var sendMessage = MessageService.send;
      var formatTime = FormatTimeService.formatTime;

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

      $scope.onSendMessageSubmit = function(valid) {
        if (valid) {
          $scope.newMessage.roomId = $scope.currentRoom.$id;
          $scope.newMessage.sentAt = formatTime(new Date());
          $scope.newMessage.username = $cookies.get('blocChatCurrentUser');
          
          sendMessage($scope.newMessage);
          $scope.newMessage = {};
        }
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