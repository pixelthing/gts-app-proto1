var transitionDetail = function() {

  var newsData = [];
  var viewPortDims = {};
  var transitionInProgress = false;
  var transitionOutProgress = false;
  // detail modal stuff
  var detail = null;
  var detailBar = null;
  var detailBackground = null;
  var detailHeader = null;
  var detailHeadline = null;
  var detailHeadText = null;
  var detailDate = null;
  var detailSubhead = null;
  var detailBody = null;
  var detailDims = {};
  var detailImgDims = {};
  var detailImgTransform = null;
  // list node stuff
  var nodeDims = {};
  var nodeImgDims = {};
  
  var init = function() {

    // capture various elements
    detail = document.querySelector('.js-protoDetail');
    detailBar = document.querySelector('.js-protoDetailBar');
    detailBackground = document.querySelector('.js-protoDetailBackground');
    detailHeader = document.querySelector('.js-protoDetailHeader');
    detailHeadline = document.querySelector('.js-protoDetailHeadline');
    detailHeadlineText = document.querySelector('.js-protoDetailHeadlineText');
    detailDate = document.querySelector('.js-protoDetailDate');
    detailSubhead = document.querySelector('.js-protoDetailSubhead');
    detailBody = document.querySelector('.js-protoDetailBody');

    // methods
    loadNewsData();
    transitionInEvent();
    transitionOutEvent();
    setTimeout(function() {
      calcSizeViewport();
    },500);

    // set up resize event - DEBOUNCE THIS!!!
    window.addEventListener('resize',calcSizeViewport);
  }

  var calcSizeViewport = function(newsIndex) {
    viewPortDims['width']  = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    viewPortDims['height'] = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    detailDims = calcSizeEl(document.querySelector('.js-protoDetail'));
    detailImgDims = calcSizeEl(document.querySelector('.js-protoDetailHeader'));
  }

  var calcSizeEl = function(el) {
    if (el) {
      var output = {};
      output.width = el.offsetWidth;
      output.height = el.offsetHeight;
      var rect = el.getBoundingClientRect();
      output.top = rect.top + document.body.scrollTop;
      output.left = rect.left + document.body.scrollLeft;
      return output;
    }
  }

  var loadNewsData = function() {

    ajax('news.json').then(function(response) {
        newsData = JSON.parse(response).news;
    }, function(error) {
        alert('error loading data - sorry!');
    });
  }

  var transitionInEvent = function() {

    // start transition
    document.querySelectorAll('.js-protoTransitionIn').forEach(function(el) {
      el.addEventListener('click',function(ev) {
        ev.preventDefault();

        if (newsData.length < 1) {
          return;
        } 

        transitionInProgress = true;

        // clean up
        cleanUp();
        // lock the background
        lockList();
        // get the position of the news item in the list, and it's image
        var nodeIndex = this.getAttribute('data-news-index');
        var node = document.querySelector('[data-news-index="' + nodeIndex +'"]');
        var nodeImg = node.querySelector('.js-protoItemHeaderImg');
        nodeDims = calcSizeEl(node);
        nodeImgDims = calcSizeEl(nodeImg);
        // lock backgound
          /*  locking background stuff here!!! */
        // get the detail panel and header
        var detailHeaderTransition = false;
        var detailHeaderScaleFactor = 1;
        var detailHeaderScale = 'scale3d(1,1,1)';
        var detailHeaderTranslate = 'translate3d(0,0,0)';
        // calc the scale of the image
        if (nodeImgDims.width != detailImgDims.width) {
          detailHeaderTransition = true;
          detailHeaderScaleFactor = nodeImgDims.width / detailImgDims.width;
          detailHeaderScale = 'scale3d(' + detailHeaderScaleFactor + ',' + detailHeaderScaleFactor + ',1)';
        }
        // calc the offset of the image
        //console.log(nodeImgDims)
        //console.log(detailImgDims)
        if (nodeImgDims.top != detailImgDims.top || nodeImgDims.left != detailImgDims.left) {
          detailHeaderTransition = true;
          var top = (nodeImgDims.top - detailImgDims.top - document.body.scrollTop)/detailHeaderScaleFactor;
          var left = 0;
          if (nodeImgDims.left != detailImgDims.left) {
            left = (nodeImgDims.left - detailImgDims.left)/detailHeaderScaleFactor;
          }
          detailHeaderTranslate = 'translate3d(' + left + 'px,' + top + 'px,0)';
        }
        // apply all transforms
        if (detailHeaderTransition) {
          detailImgTransform = detailHeaderScale + ' ' + detailHeaderTranslate;
          detailHeader.style.webkitTransform = detailImgTransform;
          detailHeader.style.transform       = detailImgTransform;
        }
        setTimeout(function() {
          // drop the image into the new header
          var detailImg = nodeImg.cloneNode(true);
          detailHeader.appendChild(detailImg);
          // add all the text
          detailHeadlineText.innerText = newsData[nodeIndex].title;
          detailDate.innerText = newsData[nodeIndex].date;
          detailSubhead.innerText = newsData[nodeIndex].intro;
          detailBody.innerHTML = newsData[nodeIndex].body;
        },0);
        setTimeout(function() {
          // hide the list node image
          nodeImg.classList.add('proto__item__header__img--hide');
          // activate ther detail parts
          detail.classList.add('proto__detail--ready');
          detailHeader.classList.add('proto__detail__header--ready');
        },1);
        setTimeout(function() {
          detailBar.classList.add('proto__detail__bar--in');
          detailBackground.classList.add('proto__detail__background--in');
          detailHeader.classList.remove('proto__detail__header--ready');
          detailHeader.classList.add('proto__detail__header--in');
        },2);

      });
    });

    // end transition
    addMultipleListeners(detailHeader,['transitionend','webkitTransitionEnd'],function() {
      postTransitionIn();
    },false);

    // cleanup after transition complete
    var postTransitionIn = function () {
      if (transitionInProgress) {
        detailHeadline.classList.add('proto__detail__headline--in');
        detailDate.classList.add('proto__detail__date--in');
        detailSubhead.classList.add('proto__detail__subhead--in');
        detailBody.classList.add('proto__detail__body--in');
        detailHeader.removeAttribute('style');
      }
      transitionInProgress = false;
    }
  }

  var transitionOutEvent = function() {

    document.querySelector('.js-protoTransitionOut').addEventListener('click',function(ev) {
      ev.preventDefault();

      transitionOutProgress = true;

      detailBar.classList.remove('proto__detail__bar--in');
      detailBackground.classList.remove('proto__detail__background--in');
      detailHeader.classList.add('proto__detail__header--out');
      detailHeader.classList.remove('proto__detail__header--in');
      detailHeadline.classList.remove('proto__detail__headline--in');
      detailDate.classList.remove('proto__detail__date--in');
      detailSubhead.classList.remove('proto__detail__subhead--in');
      detailBody.classList.remove('proto__detail__body--in');
      detailHeader.style.webkitTransform = detailImgTransform;
      detailHeader.style.transform       = detailImgTransform;
    });

    // end transition
    addMultipleListeners(detailHeader,['transitionend','webkitTransitionEnd'],function() {
      postTransitionOut();
    },false);

    // cleanup after transition complete
    var postTransitionOut = function () {
      if (transitionOutProgress) {
        cleanUp();
      }
      transitionOutProgress = false;
      // unlock the background list
      unLockList();
    }

  }

  var lockList = function() {

  }

  var unLockList = function() {
    
  }

  var cleanUp = function() {

    document.querySelectorAll('.proto__item__header__img--hide').forEach(function(el){
      el.classList.remove('proto__item__header__img--hide');
    })

    detail.classList.remove('proto__detail--ready');
    detailBar.classList.remove('proto__detail__bar--in');
    detailBackground.classList.remove('proto__detail__background--in');

    detailHeader.classList.add('proto__detail__header--out');
    detailHeader.classList.remove('proto__detail__header--in');

    detailHeadline.classList.remove('proto__detail__headline--in');
    detailDate.classList.remove('proto__detail__date--in');
    detailSubhead.classList.remove('proto__detail__subhead--in');
    detailBody.classList.remove('proto__detail__body--in');

    detailHeader.classList.remove('proto__detail__header--in');
    detailHeader.classList.remove('proto__detail__header--out');
    detailHeader.classList.remove('proto__detail__header--ready');

    detailHeader.removeAttribute('style');

    detailHeader.innerHTML = '';
    detailHeadlineText.innerHTML = '';
    detailDate.innerHTML = '';
    detailSubhead.innerHTML = '';
    detailBody.innerHTML = '';
  }
  
  return {
    init : init
  }
  
}();

transitionDetail.init();