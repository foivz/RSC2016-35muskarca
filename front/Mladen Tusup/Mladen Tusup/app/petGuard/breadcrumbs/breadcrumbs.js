angular.module('petGuard')
.component('breadcrumbComponent', {
  templateUrl: 'pws/breadcrumbs/breadcrumbsComponent.html',
  controller: ['$state', '$rootScope', function ($state, $rootScope) {
    var self = this;
    $rootScope.$on('$stateChangeSuccess', function () {
      self.setCrumbs();
    });
    self.setCrumbs = function () {
      this.crumbs = $state.$current.path;
    };
    self.setCrumbs();
  }]
});
