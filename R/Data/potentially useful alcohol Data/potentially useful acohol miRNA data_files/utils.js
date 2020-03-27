// $Id: utils.1.js,v 1.12 2008/01/14 14:44:06 sponomar Exp $

var utils = {
/*
******************************************************************
 * Constants
******************************************************************
*/
KeyCode_TAB: 9,
KeyCode_DELETE: 46,
KeyCode_BACKSPACE: 8,
KeyCode_LEFT_ARROW: 37,
KeyCode_RIGHT_ARROW: 39,
KeyCode_HOME: 36,
KeyCode_END: 35,
KeyCode_PAGE_UP: 33,
KeyCode_PAGE_DOWN: 34,
KeyCode_UP_ARROW: 38,
KeyCode_DOWN_ARROW: 40,
KeyCode_ESC: 27,
KeyCode_ENTER: 13,
KeyCode_SPACE: 32,
KeyCode_SHIFT_KEY: 16,
KeyCode_CTRL_KEY: 17,
KeyCode_ALT_KEY: 18,
KeyCode_LEFT_MS_WINDOWS_KEY: 91, 
KeyCode_RIGHT_MS_WINDOWS_KEY: 92,
KeyCode_MS_MENU_KEY: 93,
    
bIsIe:0/*@cc_on + 1 @*/,

/*
******************************************************************
Check object properties
******************************************************************
*/
isObject: function(a) { return (a && typeof a == 'object'); },
isArray: function(a) { return this.isObject(a) && a.constructor == Array; },
    

/*
Function: getParent

******************************************************************
Eliminate some browser bugs for DOM processing

The nodeType != 1 comparison is needed since whitespace between 
rows/cells may be included as text nodes, whose type is 3
******************************************************************
*/
getParent: function(obj) {
     if (obj) {
         var result = obj.parentNode;
         while (result && result.nodeType != 1) result = result.nextSibling;
         if (result) return result;
     }
     return null;
},
    
getFirstChild: function(obj) {
     if (obj) {
         var result = obj.firstChild;
         while (result && result.nodeType != 1) result = result.nextSibling;
         if (result) return result;
     }
     return null;
},
    
getNextSibling: function(obj, tagName) {
    if (obj) {
        var result = obj.nextSibling;    
        if (tagName) {
            var tn = tagName.toUpperCase();
            while (result && result.tagName != tn) result = result.nextSibling;
        } else {
            while (result && result.nodeType != 1) result = result.nextSibling;
        }
        return result;
    }
    return null;
},

getPreviousSibling: function(obj, tagName) {    
     if (obj) {
         var result = obj.previousSibling;    
         if (tagName) {
             var tn = tagName.toUpperCase();
             while (result && result.tagName != tn) result = result.previousSibling;
         } else {
             while (result && result.nodeType != 1) result = result.previousSibling;
         }
         return result;
     }
     return null;
},
    
nextItem: function(item, nodeName) {
    if (item == null) return null;
    var next = item.nextSibling;
    while (next != null) {
        if (next.nodeName == nodeName) return next;
        next = next.nextSibling;
    }
    return null;
},

previousItem: function(item, nodeName) {
    var previous = item.previousSibling;
    while (previous != null) {
        if (previous.nodeName == nodeName) return previous;
        previous = previous.previousSibling;
    }
    return null
},

moveBefore: function(item1, item2) {
    var parent = item1.parentNode;
    parent.removeChild(item1);
    parent.insertBefore(item1, item2);
},

moveAfter: function(item1, item2) {
    var parent = item1.parentNode;
    parent.removeChild(item1);
    parent.insertBefore(item1, item2 ? item2.nextSibling : null);
},

insertAfter: function(parent, node, referenceNode) {
	parent.insertBefore(node, referenceNode.nextSibling);
},

removeChildren: function(oObj) {
     if (!oObj || typeof oObj != "object") return;
     while(oObj && oObj.hasChildNodes()) {
         this.removeAllChildren(oObj.firstChild);
         oObj.removeChild(oObj.firstChild);
     }
},

// must be removed!
removeAllChildren: function(oObj) {
     this.removeChildren(oObj);
},

// get text() 
getTextContent: function(x) {
     /*@cc_on return x.text @*/
     return x.textContent;
},

/*
******************************************************************
Cookies processing
******************************************************************
*/

// Create cookie
createCookie: function(name, value, days, path) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
    } else expires = '';
    
    document.cookie = name + '=' + value + expires + '; path=' + (path ? path : "/");
},

// read cookie
readCookie: function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return "";
},

// erase cookie
eraseCookie: function(name) {
	document.cookie = name + "=null; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=nih.gov; path=/";
	document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=nih.gov; path=/";
    document.cookie = "";
},



/*
******************************************************************
Attribute Class processing
******************************************************************
*/

// add additional class value to object
// class="class1 class2 etc"
addClass: function(element, className) {
    if (!this.hasClass(element, className)) {
        if (element.className) element.className += " " + className;
        else element.className = className;
    }
},

// Remove class value from attribute class
removeClass: function(element, className) {
    var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
    var b = regexp.test(element.className);
    element.className = element.className.replace(regexp, "$2");
    return b;   // true if class has been removed
},

// Check if class attribute contains the value
hasClass: function(element, className) {
    var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
    return regexp.test(element.className);
},


/*
******************************************************************
Eliminate browser depending for geoetry properties of objects
******************************************************************
*/

// Get position of object

getXY: function (obj){
     /*
     +------------- w ----
     | (x,y)
     |
     h
     |
     */
     
     var b = {x:0, y:0, w:obj.offsetWidth, h:obj.offsetHeight};
     
     if (obj.offsetParent) {
         while(obj) {
             b.x += obj.offsetLeft;
             b.y += obj.offsetTop;
             obj = obj.offsetParent;
         }
     } else if (obj.x) {
         b.x = obj.x;
         b.y = obj.y;
     }
     return b;
},


// Get thickness of object's borders
getBorders: function(oObj) {
     var res = {t:0, b:0, l:0, r:0, isInner:false};
     res.t = this.getStyle(oObj, "borderTopWidth");
     if (typeof(res.t) == "string" && res.t != "") {        //IE, Firefox
         res.b = this.getStyle(oObj, "borderBottomWidth");
         res.l = this.getStyle(oObj, "borderLeftWidth");
         res.r = this.getStyle(oObj, "borderRightWidth");
     } else {
         res.t = this.getStyle(oObj, "border-top-width");   //Firefox, Opera
         res.b = this.getStyle(oObj, "border-bottom-width");
         res.l = this.getStyle(oObj, "border-left-width");
         res.r = this.getStyle(oObj, "border-right-width");
     }
     
     if (oObj.currentStyle) {
         res.isInner = true;
     }
     return res;
},

// Get thickness of object's paddings
getPaddings: function(oObj) {
     var res = {t:0, b:0, l:0, r:0, isInner:false};
     res.t = this.getStyle(oObj, "paddingTop");
     if (typeof(res.t) == "string" && res.t != "") {    //IE, Firefox
         res.b = this.getStyle(oObj, "paddingBottom");
         res.l = this.getStyle(oObj, "paddingLeft");
         res.r = this.getStyle(oObj, "paddingRight");
     } else {
         res.t = this.getStyle(oObj, "padding-top");    //Firefox, Opera
         res.b = this.getStyle(oObj, "padding-bottom");
         res.l = this.getStyle(oObj, "padding-left");
         res.r = this.getStyle(oObj, "padding-right");
     }
     
     if (oObj.currentStyle) {
         res.isInner = true;
     }
     return res;
},


// How much the page has scrolled.
getScrolls: function() {
     // http://www.quirksmode.org/viewport/compatibility.html
     var dim = {x:0, y:0};
     if (self.pageYOffset) { // all except Explorer
         dim.x = self.pageXOffset;
         dim.y = self.pageYOffset;
     } else if (document.documentElement /* && document.documentElement.scrollTop */) {
         // Explorer 6 Strict
         dim.x = document.documentElement.scrollLeft;
         dim.y = document.documentElement.scrollTop;
     } else if (document.body) { // all other Explorers
         dim.x = document.body.scrollLeft;
         dim.y = document.body.scrollTop;
     }
     dim.x = parseInt(dim.x);
     dim.y = parseInt(dim.y);
     return dim;
},

// The inner dimensions of the window or frame
getWindowDim: function() {
    // http://www.quirksmode.org/viewport/compatibility.html
    var dim = {w:0, h:0};
    if (self.innerHeight) { // all except Explorer
    	dim.w = self.innerWidth;
    	dim.h = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
    	// Explorer 6 Strict Mode
    	dim.w = document.documentElement.clientWidth;
    	dim.h = document.documentElement.clientHeight;
    } else if (document.body) {// other Explorers
    	dim.w = document.body.clientWidth;
    	dim.h = document.body.clientHeight;
    }
    dim.w = parseInt(dim.w);
    dim.h = parseInt(dim.h);
    return dim;
},


// The width and height of the total page (usually the body element)
getPageDim: function(oObj) {
    // http://www.quirksmode.org/viewport/compatibility.html
    var dim = {w:0, h:0};
    var test1, test2;
    var x;
    if (undefined == oObj) {
        x = document.body;
    } else {
        x = oObj;
    }
    var test1 = parseInt(x.scrollHeight);
    var test2 = parseInt(x.offsetHeight);
    if (test1 > test2) { // all but Explorer Mac
    	dim.w = parseInt(x.scrollWidth);
    	dim.h = test1;
    } else {// Explorer Mac;
         //would also work in Explorer 6 Strict, Mozilla and Safari
    	dim.w = parseInt(x.offsetWidth);
    	dim.h = test2;
    }
    return dim;
},

// get current style of object
getStyle: function (oObj, styleProp) {
    var res;
    if (oObj.currentStyle) {    //IE
		res = oObj.currentStyle[styleProp];
    }
    if (typeof(res) != "string") {
        if (oObj.style) { //Firefox, Opera
            res =  oObj.style[styleProp];
        }
        if (typeof(res) != "string") {
            if (document.defaultView) { // Safary
                res = document.defaultView.getComputedStyle(oObj, null).getPropertyValue(styleProp);
            }
            if (typeof(res) != "string") {
                return null;
            }
        }
    }
    return res;
},


/*
******************************************************************
Text processing
******************************************************************
*/
///// @@@@@@@@ obsolete @@@@@@@
// draw some HTML text inside object
drawText: function (sText, sId, add) {
    if (!sId) sId = "debug";
    var obj = document.getElementById(sId);
    if (obj) {
        if (add)
            obj.innerHTML = "<br/>" + sText;
        else
            obj.innerHTML += sText;
    }
},

// Select part of text inside object
selectRange: function (oObj /*:object*/, iStart /*:int*/, iLength /*:int*/) {
    if (!(oObj && oObj.value)) return;
    
    if (oObj.createTextRange) {
        //use text ranges for Internet Explorer
        var oRange = oObj.createTextRange(); 
        oRange.moveStart("character", iStart); 
        oRange.moveEnd("character", iLength - oObj.value.length);      
        oRange.select();
    } else if (oObj.setSelectionRange) {
        //use setSelectionRange() for Mozilla
        oObj.setSelectionRange(iStart, iLength);
    }     
    //set focus back to the textbox
    oObj.focus();      
},
 
// get text selected by mouse or by keyboard
getSelection: function() {
     var text = "";
     if (window.getSelection) {  
         text += window.getSelection();
     } else if (document.getSelection) {  
         text += document.getSelection();
     } else if (document.selection){        //IE
         text += document.selection.createRange().text;
     }
     return text;
},

// create plural form for noun 
// example "4 + cap" + getPlural(4) -> "4 caps"
getPlural: function x_Plural(iN, sSuffix) {
    if (undefined == sSuffix) { // second param is omitted
        return (iN > 1 ? "s" : "");
    } else if ("y" == sSuffix) {    // assembly -> assemblies
        return (iN > 1 ? "ies" : "");
    } else {
        return (iN > 1 ? sSuffix + "s" : sSuffix);
    }
},

// get delta between two timestamps, return something like "2 days and 3 hours ago"
getPeriodToString: function(iDelta) {
    var x = "Error, cannot convert '" + iDelta + "'";
    var sDir;
    iDelta = parseInt(iDelta);
    if (iDelta < 0) {
        sDir = " before";
        iDelta = -iDelta;
    } else 
        sDir = " ago";
    
    var iS = parseInt(iDelta / 1000);
    var iM, iH, iD;
    if (iS < 60) {
        x = iS + " second" + this.getPlural(iS);
    } else {
        iM = parseInt(iS / 60);
        if (iM < 60) {
            x =  iM + " minute" + this.getPlural(iM);
        } else {
            iH = parseInt(iM / 60);
            if (iH < 24) {
                iM = iM - iH * 60;
                x =  iH + " hour" + this.getPlural(iH) + " and " + iM + " minute" + this.getPlural(iM);
            } else {
                iD = parseInt(iH / 24);
                iH -= iD * 24;
                x =  iD + " day" + this.getPlural(iD) + " and " + iH + " hour" + this.getPlural(iH);
            }
        }
    }
    return x + sDir;
},
 // check if string looks like valid e-mail address
isEmail: function (s) {
     // http://www.javascriptkit.com/script/script2/acheck.shtml
     var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
     return (filter.test(s))
},

/*
******************************************************************
Events processing
******************************************************************
*/

/*
// begin http://ejohn.org/apps/jselect/event.html
addEvent: function(obj, type, fn, b) {
    if (obj.attachEvent) {
        var name = "" + type + fn; 
        name = name.substring(0, name.indexOf("\n"));   // IE
        obj["e" + name] = fn;
        obj[name] = function(){ obj["e" + name](window.event);}
        obj.attachEvent("on" + type, obj[name]);
    } else {
        obj.addEventListener(type, fn, b);
        return true;
    }
},


removeEvent: function(obj, type, fn, b) {
    if (obj.detachEvent) {
        var name = "" + type + fn; 
        name = name.substring(0, name.indexOf("\n"));   //IE
        if ("function" == typeof obj[name]) {
            obj.detachEvent("on" + type, obj[name]);
            obj[name] = null;
            obj["e" + name] = null;
        }
    } else {
      obj.removeEventListener(type, fn, b);
      return true;
    }
},
 
noBubbleEvent: function(e) {
	if (e && e.stopPropagation) e.stopPropagation();
	else window.event.cancelBubble = true;
},

// end http://ejohn.org/apps/jselect/event.html

*/



// begin http://dean.edwards.name/weblog/2005/10/add-event/ 
// a counter used to create unique IDs
addEvent_guid: 1,

addEvent: function (element, type, handler) {
                   
//     console.info("addEvent", element, type)
	// assign each event handler a unique ID
                   
	if (!handler.$$guid) handler.$$guid = this.addEvent_guid++;
//    console.log(handler.$$guid)
	// create a hash table of event types for the element
	if (!element.events) element.events = {};
	// create a hash table of event handlers for each element/event pair
	var handlers = element.events[type];
	if (!handlers) {
		handlers = element.events[type] = {};
		// store the existing event handler (if there is one)
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	// store the event handler in the hash table
	handlers[handler.$$guid] = handler;
	// assign a global event handler to do all the work
	element["on" + type] = handleEvent;
    
    
    
    function handleEvent(event) {
    	var returnValue = true;
    	// grab the event object (IE uses a global event object)
    	event = event || fixEvent(window.event);
    	// get a reference to the hash table of event handlers
    	var handlers = this.events[event.type];
    	// execute each event handler
    	for (var i in handlers) {
    		this.$$handleEvent = handlers[i];
    		if (this.$$handleEvent(event) === false) {
    			returnValue = false;
    		}
    	}
    	return returnValue;
    };
    
    function fixEvent(event) {
    	// add W3C standard event methods
    	event.preventDefault = fixEvent.preventDefault;
    	event.stopPropagation = fixEvent.stopPropagation;
    	return event;
    };
    fixEvent.preventDefault = function() {
    	this.returnValue = false;
    };
    fixEvent.stopPropagation = function() {
    	this.cancelBubble = true;
    };
    
    return handler.$$guid;
},

removeEvent: function (element, type, handler) {
	// delete the event handler from the hash table
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
        return handler.$$guid;
	}
    return null;
},
// end http://dean.edwards.name/weblog/2005/10/add-event/ 





/*
// begin (2007/03/09) http://www.dustindiaz.com/rock-solid-addevent/
// + some modifications were made by sponomar@ncbi
addEvent: function(obj, type, fn) {
//     console.info(obj, type, fn);
	if (obj.addEventListener) {
		obj.addEventListener(type, fn, false);
		this.x_EventCache.add(obj, type, fn);
	} else if (obj.attachEvent) {
		obj["e" + type + fn] = fn;
		obj[type+fn] = function() { obj["e" + type + fn](window.event); }
		obj.attachEvent( "on" + type, obj[type + fn] );
		this.x_EventCache.add(obj, type, fn);
	} else {
        var old = obj["on" + type];
        if (typeof(old) == "function") {
            obj["on"+type] = function() { old(); fn(); }
        } else {
            obj["on"+type] = fn;
        }
	}
},

removeEvent: function( obj, type, fn ) {
     this.x_EventCache.remove(obj, type, fn);
},

x_EventCache: function(){
	var listEvents = [];
	return {
		listEvents : listEvents,
		add: function(node, sEventName, fHandler){
			listEvents[listEvents.length] = arguments;
		},
        remove: function(node, sEventName, fHandler) {
            var item;
            for(var i = listEvents.length - 1; i >= 0; i--) {
                if(node == listEvents[i][0] && sEventName == listEvents[i][1] && fHandler == listEvents[i][2]) {
                    item = listEvents[i];
                    if(item[0].removeEventListener) {
                        item[0].removeEventListener(item[1], item[2], item[3]);
                        if (window.opera) continue;
                    } 
                    if(item[1].substring(0, 2) != "on") {
                        item[1] = "on" + item[1];
                    }
                    if(item[0].detachEvent) {
                        item[0].detachEvent(item[1], item[0][sEventName + fHandler]);
                    } 
                    item[0][item[1]] = null;
                }
            }
        },
		flush: function(){
			var item;
			for(var i = listEvents.length - 1; i >= 0; i--){
				item = listEvents[i];
				if(item[0].removeEventListener){
					item[0].removeEventListener(item[1], item[2], item[3]);
				} 
                if(item[1].substring(0, 2) != "on"){
					item[1] = "on" + item[1];
				} 
                if(item[0].detachEvent){
					item[0].detachEvent(item[1], item[2]);
				};
				item[0][item[1]] = null;
			};
		}
	};
}(),
*/
// end http://www.dustindiaz.com/rock-solid-addevent/
preventDefault: function(e) {
     if (e.preventDefault) e.preventDefault();
     else window.event.returnValue = false;
},

getRelatedTarget: function(e) {
    if (!e) var e = window.event;
	if (e.relatedTarget)    return e.relatedTarget;
	else if (e.toElement)   return e.toElement;
    else if (e.fromElement) return e.fromElement;
},

// Get object when event occurred
getTargetObj: function(eEvent) {
    var oTarget;
    var e = eEvent || window.event;
    if (e == null) return null;
    if (e.srcElement == null) oTarget = e.target;
    else oTarget = e.srcElement;
    while (oTarget && oTarget.nodeType != 1) oTarget = oTarget.parentNode;
    return oTarget;
},

/*
******************************************************************
For debug purposes @@@@@@@ obsolete @@@@@@@
******************************************************************
*/
printObj: function (oObj, iLevel) {
     var s = "";
     var sIdent = "";
     if (!iLevel) iLevel = 0;
     for (var i = 0; i < iLevel; i++) {
         sIdent += "__";
     }
     for (var i in oObj) {
         var ss = [];
         if ("string" == typeof oObj[i]) {
             ss = oObj[i].split("<");
         }
         s += sIdent + " " + i + " : [" + (typeof oObj[i]) + "] : " + ss.join("&lt;") + "<br/>";
 //        if (oObj[i] && "object" == typeof oObj[i] && iLevel < 2) {
 //            s+= "<br/>-----" + typeof oObj[i] + " --- " + iLevel + "</br>";
 //            s += this.printObj(oObj[i], iLevel + 1); 
 //        }
     }
     return s;
},


/*
******************************************************************
Java Script on demand loader
******************************************************************
*/
jsLoader:  {
    oLoaded: [],
    sBase:"",
    load: function (aScripts) {
        var oS = document.getElementsByTagName("script");
        for (var j = 0; j < oS.length; j++) {
            if (oS[j].src == "") continue;
            this.oLoaded.push(oS[j].src);
        }

        
        var sHost = document.location.protocol + "/" + "/" + document.location.host;
        var sPath = document.location.pathname;
        sPath = sPath.substring(0, sPath.lastIndexOf("/")) + "/";

        var oHead = document.getElementsByTagName("head")[0];
        for (var i = 0; i < aScripts.length; i++) {
            var sNewSrc = this.sBase + aScripts[i];
            if (sNewSrc.indexOf(":/" + "/") == -1) {
                if (sNewSrc.indexOf("/") == 0) {
                    sNewSrc = sHost + sNewSrc;
                } else {
                    sNewSrc = sHost + sPath + sNewSrc;
                }
            }

            var oS = document.getElementsByTagName("script");
            var b = true;
            for (var j = 0; j < this.oLoaded.length; j++) {
                if (sNewSrc == this.oLoaded[j]) {
//                    alert(sNewSrc + " : loaded yet");
                    b = false;
                }
            }

            if (b) {
                document.write("<script src='" + sNewSrc + "' type='text/javascript'></script>");
//                alert(sNewSrc)
                this.oLoaded.push(sNewSrc);
            }
        }
    }
},


/*
******************************************************************
 Obsolete parts
******************************************************************
*/
insertInHtml: function(text, obj) {
	if (document.all) {
		obj.innerHTML += text;
	} else {
		var range = document.createRange();
		range.setStartAfter(obj);
		var docFrag = range.createContextualFragment(text);
		obj.appendChild(docFrag);
	}
	
},
    
replaceInHtml: function(text, obj) {
	if (document.all) {
		obj.innerHTML = text;
	} else {
		while (obj.hasChildNodes()) obj.removeChild(obj.firstChild);
		var range = document.createRange();
		range.setStartAfter(obj);
		var docFrag = range.createContextualFragment(text);
		obj.appendChild(docFrag);
	}
}
};



/*
******************************************************************
 Remove unnecessary events after window unload
******************************************************************
*/
//utils.addEvent(window, 'unload', utils.x_EventCache.flush);

/*
******************************************************************
 Extensions
******************************************************************
*/

// String extensions
String.prototype.trimSpaces = function(trimMode) {
    // 0 = trim begin and end
    // 1 = trim begin only
    // 2 = trim after only

    var targetString = this;
    var iPos = 0;
    if (!trimMode) trimMode = 0;
    
    if (trimMode==0 || trimMode==1) {
        if (targetString.charAt(iPos)==" ") {
            while(targetString.charAt(iPos)==" ") iPos++;
            targetString = targetString.substr(iPos);
        }
    }

    iPos = targetString.length-1;
    if (trimMode==0 || trimMode==2) {
        if (targetString.charAt(iPos) == " ") {
            while(targetString.charAt(iPos) == " ") iPos--;
            targetString = targetString.substr(0, iPos + 1);
        }
    }
    return targetString;
}


/*
//
// Update Array class to JS 1.5 if not yet there.
// TODO: Add push pop shift unshift
//
if (!Array.prototype.push) 
    Array.prototype.push = function(o) {
        this[this.length] = o;
    }

if (!Array.prototype.pop)
    Array.prototype.pop = function () {
        if (this.length > 0) {
            delete this[this.length - 1];
            this.length--;
        }
    }


// array-like enumeration
if (!Array.forEach) // mozilla already supports this
    Array.forEach = function(object, block, context) {
        for (var i = 0; i < object.length; i++) {
            block.call(context, object[i], i, object);
        }
    };

if (!Array.prototype.indexOf)
    Array.prototype.indexOf = function(item, startIndex) {
        var len = this.length;
        if (startIndex == null)
            startIndex = 0;
        else if (startIndex < 0) {
            startIndex += len;
            if (startIndex < 0)
                startIndex = 0;
        }
        for (var i = startIndex; i < len; i++) {
            var val = this[i] || this.charAt && this.charAt(i);
            if (val == item)
                return i;
        }
        return -1;
    };

if (!Array.prototype.lastIndexOf)
    Array.prototype.lastIndexOf = function(item, startIndex) {
        var len = this.length;
        if (startIndex == null || startIndex >= len)
            startIndex = len - 1;
        else if (startIndex < 0)
            startIndex += len;
        for (var i = startIndex; i >= 0; i--) {
            var val = this[i] || this.charAt && this.charAt(i);
            if (val == item)
                return i;
        }
        return -1;
    };

if (!Array.prototype.map)
    Array.prototype.map = function(func, thisVal) {
        var len = this.length;
        var ret = new Array(len);
        for (var i = 0; i < len; i++)
            ret[i] = func.call(thisVal, this[i] || this.charAt && this.charAt(i), i, this);
        return ret;
    };

if (!Array.prototype.filter)
    Array.prototype.filter = function(func, thisVal) {
        var len = this.length;
        var ret = new Array();
        for (var i = 0; i < len; i++) {
            var val = this[i] || this.charAt && this.charAt(i);
            if(func.call(thisVal, val, i, this))
                ret[ret.length] = val;
        }
        return ret;
    };

if (!Array.prototype.every)
    Array.prototype.every = function(func, thisVal) {
     var len = this.length;
     for (var i = 0; i < len; i++)
        if (!func.call(thisVal, this[i] || this.charAt && this.charAt(i), i, this))
            return false;
     return true;
    };

if (!Array.prototype.some)
    Array.prototype.some = function(func, thisVal) {
        var len = this.length;
        for (var i = 0; i < len; i++)
            if (func.call(thisVal, this[i] || this.charAt && this.charAt(i), i, this))
                return true;
        return false;
    };
    
    
  Array.prototype.size = function() {
  var i = 0;
  for (var j in this) {
    if (this.propertyIsEnumerable(j)) {
      i++;
    }
  }
  return i;
}
*/


/*
******************************************************************
 Helpers
******************************************************************
*/

// Get elements by Id's
function $() {
  var elements = new Array();

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);

    if (arguments.length == 1)
      return element;

    elements.push(element);
  }

  return elements;
}

// Get elements by AttributeValue for Attributename
// http://www.dustindiaz.com/top-ten-javascript/ (but has some errors)
function $C(attrValue, attrName, node, tag) {
    //alert([attrValue, attrName, node, tag])
    if ("*" == attrValue) {
        return $AN(attrName, node, tag);
    }
	var oElements = new Array();
	if (!node) node = document;
	if (!tag) tag = '*';
	if (!attrName) attrName = 'class';
    
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)" + attrValue + "(\\s|$)");
    var j = 0;
	for (i = 0; i < elsLen; i++) {
		if (attrName == "class" && pattern.test(els[i].className)) {
            // IE behavior
            oElements[j++] = els[i];
		} else if (pattern.test(els[i].getAttribute(attrName))) {
			oElements[j++] = els[i];
		}
	}
    return oElements;
}

// gather objects contained into node "node" which tagName is "tag" 
// and which has attribute "attrName"
function $AN(attrName, node, tag) {
	var oElements = new Array();
	if (node == null) node = document;
	if (tag == null)tag = '*';
	var els = node.getElementsByTagName(tag);
	for (i = 0; i < els.length; i++) {
		if (els[i].getAttribute(attrName) != null) {
			oElements[oElements.length] = els[i];
		}
	}
	return oElements;
}

// Shortcut for getElementsByName
function $N(name, node) {
   var oElements = [];
   if (node == null) node = document;
   var els = node.getElementsByName(name);
   for (i = 0; i < els.length; i++) {
       oElements[oElements.length] = els[i];
   }
   return oElements;
} 

