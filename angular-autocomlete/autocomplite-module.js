angular
    .module('gdDirective', [])
    .filter('startsWith', function() {
        return function(array, startStr, insensitive) {
            return array.filter(function(el){
                if(insensitive) {
                    startStr = startStr.toLowerCase();
                    el = el.toLowerCase();
                }
                return startStr && (new RegExp("^"+startStr)).test(el);
            });
        };
    })
    .directive('gdAutocomlete',['$document', '$log', function($document, $log){
        return {
            restrict: "EA",
            scope: {
                list: '=',
                callback: '=',
                insensitive: '='
            },
            replace: true,
            templateUrl: 'template.html',
            link: function(scope, elem){
                scope.inputText = "";
                scope.selectElem = selectElem;
                scope.focused = false;
                scope.updateList = updateList;

                var alreadySelected = false;
                var inputElem = elem.find('input');
                var choosing = false;
                var listElements = [];
                var selectedElementIndex = -1;

                inputElem.bind('keydown', keypress);

                scope.$watch('inputText', function(newVal, oldVal){
                    if(newVal !== oldVal){
                        scope.callback(newVal);
                    }
                });

                function selectElem(elem){
                    alreadySelected = true;
                    scope.inputText = elem;
                    scope.callback(elem);
                    scope.focused = false;
                }

                function keypress(event){
                    $log.log(event.keyCode);
                    switch(event.keyCode){
                        case 27:        //esc key
                            angular.element(listElements[selectedElementIndex]).removeClass('chosen');
                            scope.focused = false;
                            selectedElementIndex = 0;
                            break;
                        case 40:        //down key
                            if(!choosing){
                                choosing = true;
                                chooseFirst();
                            }
                            else{
                                chooseNext();
                            }
                            scope.focused = true;
                            break;
                        case 38:
                            scope.focused = true;
                            if(choosing){
                                choosePrev();
                            }
                            break;
                        case 13:        //enter key
                            scope.focused = true;
                            choosing = false;
                            scope.$apply(function(){
                                selectElem(listElements[selectedElementIndex].innerHTML);
                            });
                            selectedElementIndex = 0;
                            break;
                        default:
                            scope.focused = true;
                    }
                }

                function chooseFirst(){
                    listElements = elem.find('li');
                    selectedElementIndex = 0;
                    angular.element(listElements[selectedElementIndex]).addClass('chosen');
                }

                function chooseNext(){
                    if(selectedElementIndex < listElements.length-1) {
                        angular.element(listElements[selectedElementIndex++]).removeClass('chosen');
                        angular.element(listElements[selectedElementIndex]).addClass('chosen');
                    }
                }

                function choosePrev(){
                    if(selectedElementIndex > 0) {
                        angular.element(listElements[selectedElementIndex--]).removeClass('chosen');
                        angular.element(listElements[selectedElementIndex]).addClass('chosen');
                    }
                }

                function updateList(){
                    listElements.removeClass('chosen');
                    selectedElementIndex = -1;
                }
            }
        };
    }]);