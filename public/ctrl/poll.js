/**
 "2 complete........"
 */
var pollApp = angular.module('pollApp', ['chart.js', 'btford.socket-io', 'ui.router']);

//var socket = io.connect();

pollApp.factory('pollSocket', function (socketFactory) {
  return socketFactory();
});

pollApp.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /participate
  $urlRouterProvider.otherwise("/participate");

  // Now set up the states
  $stateProvider
    .state('participate', {
      url: "/participate",
      templateUrl: "views/participate.html"
    })
    .state('results', {
      url: "/results",
      templateUrl: "views/results.html"
    })
    .state('debug', {
      url: "/debug",
      templateUrl: "views/debug.html"
    })
});

pollApp.controller('pollCtrl', function($scope, pollSocket) {
  $scope.chartLabels = [];
  $scope.chartData = [];

  /**
   * Envoie une réponse
   * @param index de la réponse
   */
  $scope.send = function(s) {
    pollSocket.emit('send', s);
  };

  /**
   * Fonction d'initialisation
   */
  $scope.init = function() {
    pollSocket.emit('poll-request');
  };

  /**
   * Fonction de reset
   */
  $scope.reset = function() {
    pollSocket.emit('reset');
  };

  // Receptionne les données du sondage
  // et met a jour le graphique.
  pollSocket.on('poll', function (poll) {
    console.log(poll); //debug

    $scope.$apply(function() {
      $scope.chartLabels = [];
      $scope.chartData = [];
      setLabels($scope.chartLabels,poll);
      setData($scope.chartData, poll);
    });

  });
});

/**
 * Extrait le tableau des labels
 * @param el, poll
 */
function setLabels(el, poll) {

  for (var i = 0; i < Object.keys(poll).length; i++) {
    el.push(poll[i].name);
  }

}

/**
 * Extrait le tableau des compteurs
 * @param poll
 */
function setData(el, poll) {
  for (var i = 0; i < Object.keys(poll).length; i++) {
    el.push(poll[i].count);
  }
}
