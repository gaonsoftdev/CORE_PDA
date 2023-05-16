var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		settingItems:{dsn:'', work:'', serverAddr:'', anotherDsn:'',port:''},
		pageUrls:GX._DATAS_.pageUrls,
		params: GX.getParameters(),
		rows: [],
		isAllowedCamera: (typeof navigator.getUserMedia == 'function'), // scanner 관련
		isScanning: false, // scanner 관련
		isReadyCamera: false // scanner 관련
	},
	methods:{
		save: function(){
			for(let i in this.settingItems){
				if(this.settingItems.hasOwnProperty(i)){
					if(i == 'serverAddr'){
						GX.Storage.set('gx_' + i, this.settingItems[i]+':'+this.settingItems.port);
					}else{
						GX.Storage.set('gx_' + i, this.settingItems[i]);
					}
					// GX.Cookie.set('DBName', document.querySelector('[name="DBName"]').value, 365*100);
				}
			}
			// history.back();
			location.replace('login.html');
		},
		setInfo: function(){
/*
			var pasteText = event.target;
			//alert(pasteText.textContent)
			pasteText.focus();
			document.body.focus();
			document.execCommand("paste");
			console.log(document.body.textContent);
*/
			if(this.isAllowedCamera){
				var vThis = this;
				navigator.clipboard.readText()
				.then(text => {
					vThis.setItems(text);
					console.log('Pasted content: ', text);
				})
				.catch(err => {
					console.error('Failed to read clipboard contents: ', err);
				});
			}

		},
		setItems: function(QRCodeData){
			//QRCodeData = 'MobileERPSetting://~,knicdev_oper~,KNIC DEV~,http://121.146.68.20:8081/mobileappSvc/~,';
			let matches = QRCodeData.match(/^MobileERPSetting:\/\/~,(.+)\/mobileappSvc\/~,$/i);
			if(matches != null && matches.length == 2){
				let parseData = matches[1].split('~,');
				console.log(parseData, this.settingItems);
				let keys = Object.keys(this.settingItems);
				for(let i in parseData){
					if(parseData.hasOwnProperty(i)) this.settingItems[keys[i]] = parseData[i];
				}
			}
		},
		scanBarCode: function(e){
			let clipboardData = e.clipboardData || window.clipboardData;
			let QRCodeData = clipboardData.getData('Text');

			if(QRCodeData != null && QRCodeData.length > 0) this.setItems(QRCodeData);
		},
		runScanner: function(inputName){

			//let e = new Event('paste', true);
			//document.body.dispatchEvent(e);

			let appInfo = GAON.AppBridge.getAppInfo();
			if(appInfo.GaonIsApp != ''){
				const appendName = (inputName != null) ? inputName.match(/([^\.]*)$/i)[1].capitalizeFirstLetter() : '';
					
				//MobileERPSetting://~,knicdev_oper~,KNIC DEV~,http://121.146.68.20:8081/mobileappSvc/~,
				// once, infinity
				GAON.AppBridge.requestApp('QRCodeScanner', 'once', 'responseApp'+appendName);
			}
			else {
				if(this.isAllowedCamera){
					if(this.isReadyCamera && !this.isScanning && !html5QrCode.isScanning){
						this.isScanning = true;
						//this.isScanBox = true;

						document.getElementById('scanner-container').style.display = 'block';
						document.getElementById('scanner-container').style.visibility = 'hidden';
						document.body.style.overflow = 'hidden';

						var vThis = this;
						GX.SpinnerBootstrap.show();

						html5QrCode.start({facingMode: "environment"}, {fps: 10, qrbox: 250},
							QRCodeData => {
								GX.beepSound();
								/* handle success */
								if(QRCodeData != null && QRCodeData.length > 0) {
									if(inputName == null) vThis.setItems(QRCodeData);
									else if(vThis[inputName] != null) vThis[inputName] = QRCodeData;
								}
								//vThis.isScanBox = false;
								document.getElementById('scanner-container').style.display = 'none';
								document.getElementById('scanner-container').style.visibility = 'hidden';
								document.body.style.overflow = 'unset';

				                //console.log(html5QrCode.isScanning, html5QrCode.getState());
				                html5QrCode.stop();
				                html5QrCode.clear();
								vThis.isScanning = false;
				            },
							message => {
								/* handle error */
		            		}
						).then(() => {
							document.getElementById('scanner-container').style.display = 'block';
							document.getElementById('scanner-container').style.visibility = 'visible';

							console.log('닫기 버튼 로딩');
							GX.SpinnerBootstrap.hide();
		                });
					}

				}
				else document.getElementById('info-container').style.display = 'block';//this.isInfoBox = true;
			}

			event.target.blur();
		},
		stopScanner: function(){
			if(this.isAllowedCamera){
				if(this.isScanning && html5QrCode.isScanning){
					document.body.style.overflow = 'unset';
					//this.isScanBox = false;
					document.getElementById('scanner-container').style.display = 'none';
					document.getElementById('scanner-container').style.visibility = 'hidden';
					//console.log(html5QrCode.isScanning, html5QrCode.getState());
					html5QrCode.stop();
					html5QrCode.clear();

					this.isScanning = false;
					event.target.blur();
				}
			}
		},
		closeInfo: function(){
			//this.isInfoBox = false;
			document.getElementById('info-container').style.display = 'none';
			event.target.blur();
		},
		copyUnsafelyUrl: function(){
			GX.SNS.copyUrlToClipboard('chrome://flags/#unsafely-treat-insecure-origin-as-secure', '카메라 접근 예외 설정 주소 복사');
			event.target.blur();
		},
		copyLocationOrigin: function(){
			GX.SNS.copyUrlToClipboard(location.origin, '카메라 허용 URL 주소 복사');
			event.target.blur();
		}
	},
	mounted(){
		const vThis = this;
		GX.Calendar.datePicker('gx-datepicker', {
			height:'400px',
			//format:'Y-M-D',
			monthSelectWidth:'25%',//25% or 100%
			callback: function(result, attribute){
				const openerObj = document.querySelector('[name="'+GX.Calendar.openerName+'"]');
				const info = GX.Calendar.dateFormatInfo(openerObj);
				let keys = attribute.split('.');
				if(keys.length == 1 && vThis[keys[0]] != null) vThis[keys[0]] = (result.length == 0) ? '' : GX.formatDate(result, info.format);
				else if(keys.length == 2 && vThis[keys[0]][keys[1]] != null) vThis[keys[0]][keys[1]] = (result.length == 0) ? '' : GX.formatDate(result, info.format);
				else if(keys.length == 3 && vThis[keys[0]][keys[1]][keys[2]] != null) vThis[keys[0]][keys[1]][keys[2]] = (result.length == 0) ? '' : GX.formatDate(result, info.format);
			}
		});//.set(2022, 1);
		// if(GX.Cookie.get('DBName') !=null){
		// 	if(GX.Cookie.get('DBName') == 'JPDCPTSDSN')	{
		// 		document.querySelector('[name="DBName"]')[0].selected = true;
		// 	}else{
		// 		document.querySelector('[name="DBName"]')[1].selected = true;
		// 	}
		// }
		
	},
	created(){
		const vThis = this;
		//GX.SpinnerBootstrap.init();
		GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>로딩중입니다...</span></div>');
			

		for(let i in this.settingItems){
			let key = 'gx_' + i;
			if(this.settingItems.hasOwnProperty(i) && GX.Storage.data.hasOwnProperty(key)) this.settingItems[i] = GX.Storage.get(key);
		}

		this.settingItems.serverAddr = this.settingItems.serverAddr.replace(':'+this.settingItems.port,'');
		
		// select box에 scannr enter evnet 막기 시작 /////////////
		GX.SelectBoxEnterPrevention.init();
		// select box에 scannr enter evnet 막기 끝 /////////////

		// 스캐너 입력이 하나인 경우 포커스 없이도 해당 스캔 입력박스에 스캔값 입력처리를 위한 이벤트
		document.body.addEventListener('paste', this.scanBarCode, false);

		// 다음 입력창 이동을 위한 tab index 부여 시작 /////////////
		GX.TabIndex.indexing();
		// 다음 입력창 이동을 위한 tab index 부여 끝 /////////////

		// 스캐너 입력박스 - 기본 모바일 가상 키보드 막기 시작 /////////////
		GX.VirtualKeyboardPrevention.init('[gx-scanner="Y"]');
		// 스캐너 입력박스 - 기본 모바일 가상 키보드 막기 끝 /////////////


		if(this.isAllowedCamera){ // scanner 관련
			//this.isInfoBox = false;
			html5QrCode = new Html5Qrcode("qr-reader");
			//const vThis = this;
			// Current approach
			Html5Qrcode.getCameras().then(cameras => {
				vThis.isReadyCamera = true;
				console.log(cameras);
				// assuming at least one camera exists 
				//html5QrCode.start(cameras[0].deviceId, config, qrCodeSuccessCallback);
				// .... new alternatives for mobile devices
	
				// If you want to prefer front camera
				//html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback);
	
				// If you want to prefer back camera
				//html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
	
				// front camera or fail
				//html5QrCode.start({ facingMode: { exact: "user"} }, config, qrCodeSuccessCallback);
	
				// back camera or fail
				//html5QrCode.start({ facingMode: { exact: "environment"} }, config, qrCodeSuccessCallback);
				console.log(cameras, html5QrCode.isScanning, html5QrCode.getState());
			});
		}
		//else document.getElementById('info-container').style.display = 'block';//this.isInfoBox = true; // scanner 관련



		let objs = document.querySelectorAll('input');
			
		for(let oi in objs){
			if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
		}

	}
});

function responseApp(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') {
			app.setItems(result.result);
		}
	}
}