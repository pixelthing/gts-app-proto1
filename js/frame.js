/*
FRAME VIEWPORT RESIZING
*/
var viewport = function() {
  
  var init = function() {
    buttonEvents();
  } 
  
  var buttonEvents = function() {
    var buttonsList = document.querySelectorAll('.js-viewportSwitch');
    for (var i = 0; i < buttonsList.length; ++i) {
      var button = buttonsList[i];
      button.addEventListener('click',function(ev,el){
        var dims = this.getAttribute('data-size')
        var dimsArray = dims.split('x');
        var dimsWidth = dimsArray[0];
        var dimsHeight = dimsArray[1];
        document.querySelector('.js-viewport').style.width = dimsWidth + 'px';
        document.querySelector('.js-viewport').style.height = dimsHeight + 'px';
      });
    }
  }
  
  return {
    init : init
  }
  
}();

viewport.init();