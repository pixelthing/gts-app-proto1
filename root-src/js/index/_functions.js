/* UTILITIES */

// on ready
// http://youmightnotneedjquery.com/
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// nodelist as array
// https://developer.mozilla.org/en/docs/Web/API/NodeList
var arrayMethods = Object.getOwnPropertyNames( Array.prototype );

arrayMethods.forEach( attachArrayMethodsToNodeList );

function attachArrayMethodsToNodeList(methodName) {
  if(methodName !== "length") {
    NodeList.prototype[methodName] = Array.prototype[methodName];
  }
};

// ajax request, wrapped in a JS promise
// http://www.html5rocks.com/en/tutorials/es6/promises/
function ajax(url) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(Error("Network Error"));
        };
        req.send();
    });
}

// delegate event handling
(function (document, EventTarget) {

    /* Check various vendor-prefixed versions of Element.matches */
    function matches(selector, currentNode) {
        var vendors = ["webkit", "ms", "moz"],
            count = vendors.length, vendor, i;

        for (i = 0; i < count; i++) {
            vendor = vendors[i];
            if ((vendor + "MatchesSelector") in currentNode) {
                return currentNode[vendor + "MatchesSelector"](selector);
            }
        }
    }

    /* Traverse DOM from event target up to parent, searching for selector */
    function passedThrough(event, selector, stopAt) {
        var currentNode = event.target;

        while (true) {
            if (matches(selector, currentNode)) {
                return currentNode;
            }
            else if (currentNode != stopAt && currentNode != document.body) {
                currentNode = currentNode.parentNode;
            }
            else {
                return false;
            }
        }
    }

    /* Extend the EventTarget prototype to add a proxyEventListener() event */
    EventTarget.prototype.delegateEventListener = function (eName, toFind, fn) {
        this.addEventListener(eName, function (event) {
            var found = passedThrough(event, toFind, event.currentTarget);

            if (found) {
                // Execute the callback with the context set to the found element
                // jQuery goes way further, it even has it's own event object
                fn.call(found, event);
            }
        });
    };

}(window.document, window.EventTarget || window.Element));

// attach multiple event handlers to an item (helps with prefixing)
function addMultipleListeners(element,events,handler,useCapture,args){
  if (!(events instanceof Array)){
    throw 'addMultipleListeners: '+
          'please supply an array of eventstrings '+
          '(like ["click","mouseover"])';
  }
  //create a wrapper for to be able to use additional arguments
  var handlerFn = function(e){
    handler.apply(this, args && args instanceof Array ? args : []);
  }
  for (var i=0;i<events.length;i+=1){
    element.addEventListener(events[i],handlerFn,useCapture);
  }
}