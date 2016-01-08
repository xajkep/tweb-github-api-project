/**

*/

var oauthToken = "63097082841fc963e010e43b36918f45a9419d65";

var apiApp = angular.module('apiApp', ['chart.js']);

apiApp.controller('apiCtrl', function($scope) {
  $scope.user = [];
  $scope.repos = [];

  $scope.stats_addDelPerWeek = [];

  $scope.user = function() {
    // Get user informations and user public repos
    $scope.user = getUser($scope.username);
    $scope.repos = getAllRepos($scope.username);

    // Beautify the dates
    $scope.user.created_at = $scope.user.created_at.replace('T', ' ').replace('Z', '');
    $scope.user.updated_at = $scope.user.updated_at.replace('T', ' ').replace('Z', '');

    //alert($scope.user.avatar_url);

    /*$scope.$apply(function() {
      $scope.user = getUser($scope.username);
    });*/
  };

  $scope.stats = function(reponame) {
    //$scope.stats_contributors  = getStatsContributors($scope.username, reponame);

    // Get additions & deletions stats per week
    stats_addDelPerWeek  = getAddDelPerWeek($scope.username, reponame);

    // Prepare labels & data for the line chart
    var labels = [];
    var additions = [];
    var deletions = [];
    stats_addDelPerWeek.map(
      function(val, i) {

        // Convert the timestamp into a readable string
        var tmp = new Date(val[0] * 1000);
        var dateString = tmp.toDateString();

        labels.push(dateString);
        additions.push(val[1]);
        deletions.push(val[2]);
      }
    );

    $scope.stats_addDelPerWeek_labels = labels;
    $scope.stats_addDelPerWeek_data = [];
    $scope.stats_addDelPerWeek_data.push(additions);
    $scope.stats_addDelPerWeek_data.push(deletions);


    // Get the weekly commit count for the repository owner and everyone else
    stats_weeklyCommitCount = getWeeklyCommitCount($scope.username, reponame);

    // Prepare labels, data & series for the bar chart
    var labels = [];
    var now = new Date();
    var all = [];
    var owner = [];
    for (i = 10; i > 0; i--) {
      var date = new Date();
      date.setDate(now.getDate() - i*7);
      labels.push(date.toDateString());

      all.push(stats_weeklyCommitCount.all[41+i]);
      owner.push(stats_weeklyCommitCount.owner[41+i]);
    }

    $scope.stats_weeklyCommitCount_labels = labels;
    $scope.stats_weeklyCommitCount_series = Object.keys(stats_weeklyCommitCount);
    $scope.stats_weeklyCommitCount_data = [];
    $scope.stats_weeklyCommitCount_data.push(all);
    $scope.stats_weeklyCommitCount_data.push(owner);


    // Get last year of commit activity
    stats_lastYearCommitActivity = getLastYearCommitActivity($scope.username, reponame);

    // Prepare labels & data
    var labels = [];
    var lastWeek = new Date(
      stats_lastYearCommitActivity[stats_lastYearCommitActivity.length - 1].week * 1000
    );
    for (i = 7; i > 0; i--) {
      var date = new Date();
      date.setDate(lastWeek.getDate() - i);
      labels.push(date.toDateString());
    }

    $scope.stats_lastWeekCommitActivity_labels = labels;
    $scope.stats_lastWeekCommitActivity_data = [];
    $scope.stats_lastWeekCommitActivity_data.push(
      stats_lastYearCommitActivity[stats_lastYearCommitActivity.length - 1].days
    );
    $scope.stats_lastWeekCommitActivity_series = ["Commit"];
  };

  // debug purpose
  $scope.$watch('username', function() {
      console.log($scope.username);
  });

});

/**
 * Make sync. requests and return the result
 * @param the url
 * @return the result of the requests
 */
function requests(apiurl) {
  var result = null;
  $.ajax({
        url: apiurl,
        beforeSend : function(xhr) {
          xhr.setRequestHeader("Authorization", "token " + oauthToken);
        },
        type: 'get',
        async: false,
        success: function(data) {
            result = data;
        }
     });
  return result;
}

function getUser(username) {
  return requests("https://api.github.com/users/"+username);
}

function getAllRepos(username) {
  return requests("https://api.github.com/users/"+username+"/repos");
}

function getStatsContributors(username, reponame) {
  return requests("https://api.github.com/repos/"+username+"/"+reponame+"/stats/contributors");
}

function getAddDelPerWeek(username, reponame) {
  return requests("https://api.github.com/repos/"+username+"/"+reponame+"/stats/code_frequency");
}

function getWeeklyCommitCount(username, reponame) {
  return requests("https://api.github.com/repos/"+username+"/"+reponame+"/stats/participation");
}

function getLastYearCommitActivity(username, reponame) {
  return requests("https://api.github.com/repos/"+username+"/"+reponame+"/stats/commit_activity");
}
