// $Id: remote_data_provider.1.js,v 1.5 2007/11/28 17:38:58 sponomar Exp $

//=========================================================================================================
function RemoteDataProvider(sUrl) {
    this.sUrl = sUrl;
    this.bAsync = true;
    this.iTimeout = 0;
    var oHttpObj = null;
}

RemoteDataProvider.iCount = 0;  // counter of active requests

//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.x_GetHttpObj = function() {
    oHttpObj = null;
    try {
        oHttpObj = new ActiveXObject("Msxml2.XMLHTTP");
    } catch(e) {
        try {
            oHttpObj = new ActiveXObject("Microsoft.XMLHTTP")
        } catch(oc) {
            oHttpObj = null;
        }
    }
    if (!oHttpObj && typeof XMLHttpRequest != "undefined") {
        oHttpObj = new XMLHttpRequest();
    }
    return oHttpObj; 
}


//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.x_onChange = function(oHttpObj, oTimer) {
//    console.info(oHttpObj.readyState, oHttpObj.status, "RemoteDataProvider.iCount=", RemoteDataProvider.iCount);
    if (oTimer.bTimeout) return;  // timeout is occurred
    
    var iStatus;    // added for 'prototype.Abort" support
    try {
        iStatus = oHttpObj.status;
    } catch (e) {
        return;
    }
    if (oHttpObj.readyState == 4 && iStatus == 200) {
        RemoteDataProvider.iCount--;
//        console.info(oHttpObj.readyState, iStatus, "Success, RemoteDataProvider.iCount=", RemoteDataProvider.iCount);
        if (oTimer.oTimer) clearTimeout(oTimer.oTimer);
        this.onSuccess(oHttpObj);
        this.onStop();    
    } else if(oHttpObj.readyState == 4 && iStatus != 200) {
        RemoteDataProvider.iCount--;
//        console.info("Error, RemoteDataProvider.iCount=", RemoteDataProvider.iCount);
        if (oTimer.oTimer) clearTimeout(oTimer.oTimer);
        this.onError(oHttpObj);
        this.onStop();    
    }
}

//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.x_Init = function(oTimer) {
    var oHttpObj = this.x_GetHttpObj();
    if (null == oHttpObj) return null;
    
    if (oHttpObj.readyState != 0) oHttpObj.abort();
    
    var oThis = this;
    if (this.bAsync) {
        oHttpObj.onreadystatechange = function () {
            oThis.x_onChange(oHttpObj, oTimer);
        };
    }
    
    RemoteDataProvider.iCount++;
//    console.info("Start, RemoteDataProvider.iCount=", RemoteDataProvider.iCount);
    this.onStart();
    if (this.iTimeout > 0) {
        oTimer.bTimeout = false;
        oTimer.oTimer = setTimeout(function() {
            RemoteDataProvider.iCount--;
//            console.info("Timeout, RemoteDataProvider.iCount=", RemoteDataProvider.iCount);
            oTimer.bTimeout = true;
            oHttpObj.abort();
            oThis.onTimeout(oThis.iTimeout); 
        }, this.iTimeout);
    }
    
    return oHttpObj;
}


//-------------------------------------------------------------------------------------------------------------
// Abort
RemoteDataProvider.prototype.Abort = function() {
    
    if (RemoteDataProvider.iCount > 0) RemoteDataProvider.iCount--;
//    console.info(oHttpObj.readyState, "Abort, RemoteDataProvider.iCount=", RemoteDataProvider.iCount);
    oHttpObj.abort();
}

//-------------------------------------------------------------------------------------------------------------
// GET request
RemoteDataProvider.prototype.Get = function(sRequest) {
    var sUrl = this.sUrl + (sRequest ? sRequest : "");
    var oTimer = {};
    var oHttpObj = this.x_Init(oTimer); 
    
    if (oHttpObj) {
        oHttpObj.open("get", sUrl, this.bAsync);
        oHttpObj.send(null);
        if (!this.bAsync) {
            this.x_onChange(oHttpObj, oTimer);
        }
    }
}

//-------------------------------------------------------------------------------------------------------------
// POST request
RemoteDataProvider.prototype.Post = function(sRequest) {
    this.Request(null, sRequest);
}


//-------------------------------------------------------------------------------------------------------------
// GET + Post request
RemoteDataProvider.prototype.Request = function(sGetRequest, sPostRequest) {
    var sUrl = this.sUrl + (sGetRequest ? sGetRequest : "");
    var oTimer = {};
    var oHttpObj = this.x_Init(oTimer); 
    if (oHttpObj) {
        if (typeof sPostRequest != "string" || sPostRequest == "") {
            sPostRequest = "";
        }
        if (sPostRequest > "") {
            oHttpObj.open("post", sUrl, this.bAsync);
            oHttpObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
            oHttpObj.setRequestHeader("Content-length", sPostRequest.length); 
            oHttpObj.send(sPostRequest);
        } else {
            oHttpObj.open("get", sUrl, this.bAsync);
            oHttpObj.send(null);
        }
        if (!this.bAsync) {
            this.x_onChange(oHttpObj, oTimer);
        }
    }
}


//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.onSuccess = function(obj) {
    alert(["succes:", obj.responseText]);
}

//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.onStart = function() {
//    alert(["start:"]);
}

//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.onStop = function() {
//    alert(["start:"]);
}

//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.onError = function(obj) {
    alert(["error:", obj.status]);
}

//-------------------------------------------------------------------------------------------------------------
RemoteDataProvider.prototype.onTimeout = function(iTime) {
    alert(["timeout:", iTime + " ms"]);
}

