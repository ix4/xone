goog.provide("APP.SETUP");
goog.provide("APP.MAIN");
goog.provide("APP.VIEW");
goog.provide("APP.HTML");
goog.provide("APP.INIT");
goog.require('CONFIG');
goog.require('CORE');
goog.require('APP');
goog.require("DIST.APP");

APP.VIEW = {};
APP.HTML = {};

APP.INIT = function(){};
APP.MAIN = function(){};
APP.SETUP = APP.MAIN;

(function(){

    APP.CONFIG.LAYOUT = [];

    /** @export @dict */

    window.CORE = {

        "isType": CORE.isType,
        "isDefined": CORE.isDefined,
        "hasValue": CORE.hasValue,
        "isArray": CORE.isArray,
        "isObject": CORE.isObject,
        "hasValues": CORE.hasValues,
        "isEmpty": CORE.isEmpty,
        "isBlank": CORE.isBlank,
        "getNode": CORE.getNode,
        "console": {
            "log": CORE.console.log,
            "warn": CORE.console.warn,
            "err": CORE.console.err,
            "info": CORE.console.info
        },
        "query": CORE.query,
        "getById": CORE.getById,
        "getByClass": CORE.getByClass,
        "getByTag": CORE.getByTag,
        "getValue": CORE.getValue,
        "setValue": CORE.setValue,
        "parseNode": CORE.parseNode,
        "buildPattern": CORE.buildPattern,
        "buildData": CORE.buildData,
        "removeNodes": CORE.removeNodes,
        "ajax": CORE.ajax,
        "paramsToString": CORE.paramsToString,
        "unique": CORE.unique,
        "reverse": CORE.reverse,
        "formatDate": CORE.formatDate,
        "formatNumber": CORE.formatNumber,
        "preloadImages": CORE.preloadImages,
        "async": CORE.async,
        "stack": CORE.stack,
        "getStackLength": CORE.getStackLength,
        "loadScript": CORE.loadScript,
        "loadStyle": CORE.loadStyle,
        "time": CORE.time,
        "capitalize": CORE.capitalize,
        "prefix": CORE.prefix,
        "crc32": CORE.crc32,
        "registerEach": CORE.registerEach,
        "registerMap": CORE.registerMap,
        "registerFilter": CORE.registerFilter,
        "contains": CORE.contains,
        "getKeys": CORE.getKeys,
        "imageToDataUrl": CORE.imageToDataUrl,
        "Math": {
            "min": CORE.Math.min,
            "max": CORE.Math.max,
            "rad": CORE.Math.rad,
            "cos": CORE.Math.cos,
            "sin": CORE.Math.sin,
            "rnd": CORE.Math.rnd,
            "abs": CORE.Math.abs
        },
        "Browser": {
            "isOpera": CORE.Browser.isOpera,
            "isFirefox": CORE.Browser.isFirefox,
            "isSafari": CORE.Browser.isSafari,
            "isMSIE": CORE.Browser.isMSIE,
            "isChrome": CORE.Browser.isChrome
        },
        "System": {
            "isIphone": CORE.System.isIphone,
            "isIpod": CORE.System.isIpod,
            "isIpad": CORE.System.isIpad,
            "isAndroid": CORE.System.isAndroid,
            "isIOS": CORE.System.isIOS,
            "isMobile": CORE.System.isMobile
        },
        "hasClass": CORE.hasClass,
        "addClass": CORE.addClass,
        "removeClass": CORE.removeClass,
        "toggleClass": CORE.toggleClass,
        "getStyle": CORE.getStyle,
        "setStyle": CORE.setStyle,
        "toggleStyle": CORE.toggleStyle,
        "css": CORE.css,
        "addCssRule": CORE.addCssRule,
        "setTextContent": CORE.setTextContent,
        "setHTML": CORE.setHTML,
        "getHTML": CORE.getHTML,
        "paint": CORE.paint,
        "clear": CORE.clear,
        "animate": CORE.animate,
        "scrollTo": CORE.scrollTo,
        "scrollToTop": CORE.scrollToTop,
        "preventEvent": CORE.preventEvent,
        "handleEvent": CORE.handleEvent,
        "on": CORE.on,
        "addEvent": CORE.addEvent,
        "addTouchEvent": CORE.addTouchEvent,
        "addTouchMoveEvent": CORE.addTouchMoveEvent,
        "addInputEvent": CORE.addInputEvent,
        "addMouseWheelScroll": CORE.addMouseWheelScroll,
        "triggerMouseEvent": CORE.triggerMouseEvent,
        "delegateByClass": CORE.delegateByClass,
        "delegateByTag": CORE.delegateByTag,
        "delegateByTagClass": CORE.delegateByTagClass,
        "initRetina": CORE.initRetina,
        "Storage": CORE.Storage
    };

    /*
    console.log((function parseObject(obj, name){

        var tmp = '';

        for(var key in obj){

            if(obj.hasOwnProperty(key)){

                if(obj[key] && obj[key].constructor === Object){

                    tmp += '"' + key + '": {\n' + parseObject(obj[key], name + '.' + key) + "\n},\n";
                }

                else{

                    tmp += '"' + key + '": ' + name + '.' + key + ",\n";
                }
            }
        }

        return tmp;

    })(CORE, 'CORE'));
    */

})();