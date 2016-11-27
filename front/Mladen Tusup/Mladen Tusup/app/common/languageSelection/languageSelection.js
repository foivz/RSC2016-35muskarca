/**
 * Created by Mladen on 11/13/16.
 */
angular.module('mainModule')
    .controller('LanguageSelectionController', ['language', function (language) {
        var vm, defaultStateName;
        vm = this;
        defaultStateName = 'iQuiz.common.home';
        vm.options = angular.copy(language.availableLanguages);
        angular.forEach(vm.options, function (value) {
            value.stateName = defaultStateName;
            value.stateParams = {IDMDLanguage: value.IDMDLanguage};
        });
    }]);