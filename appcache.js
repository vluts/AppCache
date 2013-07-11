window.APP={};
APP.appcache = (function () {
    'use strict';

    var statuses = {
        "-1": 'timeout',
        "0": 'uncached',
        "1": 'idle',
        "2": 'checking',
        "3": 'downloading',
        "4": 'updateready',
        "5": 'obsolete'
    }, offlineEnabled;

    function innerLoad() {
        var iframe = document.createElement('IFRAME');
//        iframe.setAttribute('style', 'width:0px; height:0px; visibility:hidden; position:absolute; border:none');
        iframe.src = 'manifest.html';
        iframe.id = 'appcacheloader';
        document.body.appendChild(iframe);

//        var script   = document.createElement("script");
//        script.type  = "text/javascript";
//        script.src   = "http://www.abc/static/st.v2.js"; // Or:
//        script.text  = "   var addImg = function(){" +
//            " var img = document.createElement('IMG');" +
//            "img.src = 'IDEL_icon.png';" +
//            "$('body').append(img);}";
//
//        iframe.script = script;

        $('#appcacheloader').contents().find('body').append("<button id='showCache' onclick=" +

            "var img = document.createElement('IMG');"+
            "img.id = 'innerImg';"+
            "img.src = 'IDEL_icon.png';"+
            "$('#appcacheloader').contents().find('body').append(img);"+

        "' >show cache</button>");
    }

    function logEvent(evtcode, hasChecked) {
        var s = statuses[evtcode], loaderEl;
        if (hasChecked || s === 'timeout') {
            if (s === 'uncached' || s === 'idle' || s === 'obsolete' || s === 'timeout' || s === 'updateready') {
                loaderEl = document.getElementById('appcacheloader');
//                loaderEl.parentNode.removeChild(loaderEl);
            }
        }
    }

    function requestOffline() {
        return confirm("This website is capable of working offline. Would you like to enable this feature?");
    }

    function start() {
        if (offlineEnabled !== true && offlineEnabled !== false) {
            offlineEnabled = requestOffline();
            if (offlineEnabled) {
                localStorage.offlineEnabled = true;
            }
        }
        if (offlineEnabled === true) {
            innerLoad();
        }
    }

    // If offline mode already enabled, run innerLoad
    offlineEnabled = localStorage.offlineEnabled;

    if (offlineEnabled !== undefined) {
        offlineEnabled = (offlineEnabled === "true");
    }

    return {
        start: start,
        logEvent: logEvent
    };
}());