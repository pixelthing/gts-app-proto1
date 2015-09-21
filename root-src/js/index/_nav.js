var protoNav = function() {
  
  var init = function() {
    slideIntroEvents();
    slideNavEvents();
  }
  
  var slideIntroEvents = function() {
    document.querySelector('.js-protoSlideIntroBtn').addEventListener('click',function() {
      document.querySelector('.js-protoSlideIntro').classList.add('proto__slide--background');
      document.querySelector('.js-protoSlide1').classList.remove('proto__slide--background');
    })
  }
  
  var slideNavEvents = function() {
    // slide 1 > slide 2 Top News
    document.querySelector('.js-protoSlideTopBtn').addEventListener('click',function(ev) {
      ev.preventDefault();
      document.querySelector('.js-protoSlide1').classList.add('proto__slide--out');
      document.querySelector('.js-protoSlide2Top').classList.remove('proto__slide--in');
    })
    // slide 1 > slide 3 Editor picks
    document.querySelector('.js-protoSlideEditorBtn').addEventListener('click',function(ev) {
      ev.preventDefault();
      document.querySelector('.js-protoSlide1').classList.add('proto__slide--out');
      document.querySelector('.js-protoSlide3Editor').classList.remove('proto__slide--in');
    })
    // slide 1 > slide 4 Photo Roll
    document.querySelector('.js-protoSlidePhotoBtn').addEventListener('click',function(ev) {
      ev.preventDefault();
      document.querySelector('.js-protoSlide1').classList.add('proto__slide--out');
      document.querySelector('.js-protoSlide4Photo').classList.remove('proto__slide--in');
    })
    // slide X Top News > slide 1
    document.querySelectorAll('.js-protoSlideBackBtn').forEach(function(el) {
      el.addEventListener('click',function(ev) {
        console.log('x');
        ev.preventDefault();
        document.querySelector('.js-protoSlide1').classList.remove('proto__slide--out');
        document.querySelector('.js-protoSlide2Top').classList.add('proto__slide--in');
        document.querySelector('.js-protoSlide3Editor').classList.add('proto__slide--in');
        document.querySelector('.js-protoSlide4Photo').classList.add('proto__slide--in');
      });
    })
  }
  
  return {
    init : init
  }
  
}();

protoNav.init();