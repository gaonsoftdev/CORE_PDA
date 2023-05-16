/* hybridAppBridge version 1.0.0.0 : need jquery */
if(!Object.keys)
{
	Object.keys = function(obj)
	{
		var obj_keys = [];
		for(var i in obj)
		{
			obj_keys[obj_keys.length] = i;
		}
		return obj_keys;
	};
}

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    // Could we try:
    // return Array(count + 1).join(this);
    return rpt;
  }
}


if(!String.prototype.trim)
{
	String.prototype.trim = function(){
		return this.replace(/(^[\s\t\v\r\n]*)|([\s\t\v\r\n]*$)/g, '');
	}
}


window.GAON = window.GAON || {};

GAON.AppBridge = function(){return this;};

GAON.AppBridge.versionCompareString = function(v){
	var parts = v.split('.');
	var pad_cnt = 0;
	var pad_len = 5;
	var pad = '0';
	for(var i in parts)
	{
		pad_cnt = pad_len - parts[i].length;
		parts[i] = pad.repeat(pad_cnt) + parts[i];
	}

	return parts.join('.');
};

GAON.AppBridge.getAppInfo = function(){
	var app_info = {'GaonIsApp':'', 'GaonOS':'', 'GaonOSVersion':'', 'GaonDevice':'', 'GaonPackageName':'', 'GaonAppVersion':'', 'GaonFrameWorkVersion':'', 'GaonUUID':'', 'GaonToken':'', 'GaonCustomData':''};
	var ua_str = navigator.userAgent;
	var tmp_datas = ua_str.match(new RegExp('(' + Object.keys(app_info).join('\\/|') + '\\/)([^\\s]*)', 'gi'));

	if(tmp_datas != null && typeof tmp_datas == 'object')
	{
		var ai_kv = [];
		for(var i in tmp_datas)
		{
			if(tmp_datas[i].indexOf('/') != -1)
			{
				ai_kv = tmp_datas[i].split('/');
				app_info[ai_kv[0]] = ai_kv[1];
			}
		}
	}
	
	//모바일 브라우저를 연경우에도 os랑 device 등의 정보를 받을 필요가 있는 경우에 아래 코드에서 useragent를 파싱하여 정보를 추출합니다.
	var ua_sub_info = ua_str.match(/\([^\)]*\)/gim);

	if(ua_sub_info){
		if(typeof ua_sub_info[0] != 'undefined' && ua_sub_info[0] != null && ua_sub_info[0].length > 0)
		{
			if((/(ipad|iphone|ipod)/ig).test(ua_str))
			{
				if(app_info.GaonOS.length == 0) app_info.GaonOS = 'ios';
				var os_version = ua_sub_info[0].match(/os\s[\d\_\.]+/gim);
				if(os_version != null && os_version[0] != null && typeof os_version[0] != 'undefined' && os_version[0] != null && os_version[0].length > 0)
				{
					if(app_info.GaonOSVersion.length == 0) app_info.GaonOSVersion = os_version[0].replace(/os/gim, '').trim().replace(/\_/gim, '.');
					var device = ua_sub_info[0].match(/\((.+);/gim, '');
					if(app_info.GaonDevice.length == 0) app_info.GaonDevice = (device != null && device[0] != null && typeof device[0] != 'undefined' && device[0].length > 0) ? device[0].replace(/[\(;]/gim, '').trim() : '';
				}
			}
			else if((/(android)/ig).test(ua_str))
			{
				if(app_info.GaonOS.length == 0) app_info.GaonOS = 'android';
				var os_version = ua_sub_info[0].match(/android\s[\d\.]+;\s/gim, '');
				if(os_version != null && os_version[0] != null && typeof os_version[0] != 'undefined' && os_version[0] != null && os_version[0].length > 0)
				{
					if(app_info.GaonOSVersion.length == 0) app_info.GaonOSVersion = os_version[0].replace(/(android\s|;)/gim, '').trim();
					var device = ua_sub_info[0].match(new RegExp(os_version[0]+'([^;]+)', 'gi'), '');///android\s[\d\.]+;\s([^;]+)\s/gim
					if(app_info.GaonDevice.length == 0) app_info.GaonDevice = (device != null && device[0] != null && typeof device[0] != 'undefined' && device[0].length > 0) ? device[0].replace(/\)/g, '').replace(new RegExp(os_version[0], 'gi'), '').trim() : '';
				}
			}
		}
	}

	return app_info;
};

GAON.AppBridge.requestApp = function(action, param, callBack){
	var app_info = GAON.AppBridge.getAppInfo();

	if(app_info.GaonIsApp == 'yes') {
		if(app_info.GaonOS == 'android'){
			console.log('디바이스 OS는 android 입니다.');
			if(window.sendToNative != null) {
				window.sendToNative.requestApp(action, param, callBack);
			}
			else {
				alert('모바일앱에서만 지원하는 기능입니다.');
			}
		}
		else if(app_info.GaonOS == 'ios'){
			//iOS 코드		
			console.log('디바이스 OS는 android 입니다.');

			//if(window.webkit != null && webkit.messageHandlers != null && webkit.messageHandlers.sendToNative != null) {
			if(true) {
				var data = {action:action, param:param, callback:callBack};
				webkit.messageHandlers.sendToNative.postMessage(data);
			}
			else {
				alert('모바일앱에서만 지원하는 기능입니다.');
			}
		}
	}
	else {
		if(action == 'GPS') {
			// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
			if (navigator.geolocation) {
				// GeoLocation을 이용해서 접속 위치를 얻어옵니다
				navigator.geolocation.getCurrentPosition(function(position) {
					responseApp(action, {param: param, lat: position.coords.latitude, lng: position.coords.longitude});
				});
			}
			else {
				// HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
				alert('GPS 기능을 지원하지 않는 브라우저입니다.');
			}
		}	
	}
};

//var app_info = GAON.AppBridge.getAppInfo();
//alert(app_info);
//if(app_info.GaonIsApp == 'yes') console.log('앱의 웹뷰에서 호출되었습니다.');
//if(app_info.GaonOS == 'android') console.log('디바이스 OS는 android 입니다.');
//if(GAON.AppBridge.versionCompareString(app_info.GaonAppVersion) > GAON.AppBridge.versionCompareString('1.7.1.0')) console.log('해당 앱은 1.7.1.0 이후 버전입니다.');

/*
# 아래는 android native 코드에서 userAgent 값에 포함할 항목들입니다.

GaonIsApp : 앱 유무(yes, no)
GaonOS : 모바일기기 OS(android, ios)
GaonOSVersion : 모바일기기 OS 버전(5.0)
GaonDevice : 디바이스 정보(SM-G900P Build/LRX21T)
GaonPackageName : 앱패키지명(best.inuri...)
GaonAppVersion : 앱버전(1.7.2.0)
GaonFrameWorkVersion : 프레임워크 버전(1.0.0) -- 앱을 하이브리드앱 프레임워크를 만들어서 다른앱도 같이 소스를 사용할 경우 버전 관리용
GaonUUID : 앱푸시 토큰 매칭 UUID(ba0ba4b8-b6c8-46b5-8d9b-823cf9fa3407)
GaonToken : 앱푸시 토큰 값(보안상 노출 안하는 것이 좋으나 UUID 값이 없거나 필요시 전달)

--------------------------------------------------------------------------

예시)
string userAgent = mWebview.getSettings().getUserAgentString();
userAgent += " GaonIsApp/yes GaonOS/android GaonAppVersion/1.7.2.0";
mWebview.getSettings().setUserAgentString(userAgent);
--------------------------------------------------------------------------
*/




