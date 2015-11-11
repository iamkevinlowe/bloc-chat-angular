(function() {

  angular
    .module('app.services', [
      'firebase'
    ])
    .factory('RoomService', [
      '$firebaseArray',
      RoomService
    ])
    .factory('MessageService', [
      '$firebaseArray',
      MessageService
    ])
    .factory('FormatTimeService', [
      FormatTimeService
    ]);

  function RoomService($firebaseArray) {
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

  function MessageService($firebaseArray) {
    var firebaseRef = new Firebase('bloc-chat-angular.firebaseIO.com');

    var messages = $firebaseArray(firebaseRef.child('messages'));

    function sendMessage(newMessage) {
      messages.$add(newMessage);
    }

    return {
      send: sendMessage
    }
  }

  function FormatTimeService() {
    function formatTime(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var meridian = null;

      hours >= 12 ? meridian = 'PM' : meridian = 'AM';

      return hours % 12 + ':' + minutes + ' ' + meridian;
    }

    return {
      formatTime: formatTime
    }
  }

})();