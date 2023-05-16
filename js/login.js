var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		rows:{
			'IDCheck':[]
		},
		companySeq:'',
		userId:'',
		userPwd:'',
		userHP:'',
		isSaveIds:[]
	},
	methods:{
		autoSettings: function(){
			let sDsn = 'knicdev_oper';
			let sWork = 'KNIC DEV';
			let serverAddr = (this.params.mode != null && this.params.mode == 'dev') ? 'http://192.168.205.20:8113' : 'http://222.97.61.224:8100';
			if(GX._DATAS_.ajaxHeaders != null){
				if(serverAddr == 'http://192.168.205.20:8113') GX._DATAS_.ajaxHeaders.guid = 'CB211D39-F77E-E111-BDAF-0010182FC8D5';
				else if(serverAddr == 'http://222.97.61.224:8100'){
					GX._DATAS_.ajaxHeaders.guid = '4CB521B9-3ACC-DF11-A3B6-001A6424E3C6';
					sDsn = 'jpdc_oper';
					sWork = '대창단조';
				}
			}
			else serverAddr = 'http://192.168.205.20:8113';

			console.log('mode',this.params.mode, GX._DATAS_.ajaxHeaders)
			//let settingItems = {dsn:'knicdev_oper', work:'KNIC DEV', serverAddr:'http://192.168.205.20:8111', anotherDsn:''};
			let settingItems = {dsn:sDsn, work:sWork, serverAddr:serverAddr, anotherDsn:''};			
			for(let i in settingItems){
				if(settingItems.hasOwnProperty(i)) GX.Storage.set('gx_' + i, settingItems[i]);
			}
		},

		login: function(){
			if(event.type == 'click' || (event.type == 'keyup' && event.key == 'Enter')){
			//if(event.type == 'click'){
				var vThis = this;
				let params = {
					UCompanySeq: vThis.companySeq,
					AccID: vThis.userId,
					AccPW: vThis.userPwd,
					EmpID: '',
					AppDate: '',
					VacFrDate: '',
					VacToDate: '',
					VacReason: '',
					WkEmpName: '',
					TelNo: '',
					WkItemSeq: 0,
					WkItemName: '',
				}
				// this.userHP = document.querySelector('[name="UserHP"]').value;
				// this.userHP = '01068030132';
				GX._METHODS_
				.setMethodId('Genuine.tdiModuleName.BisSIIntegratedAPI_tdi/Login')
				.ajax([params], [function(data){
					//if(data[0] != null && data[0].UserSeq != null){
					console.log('data',data);
					if(data[0] != null && data[0].ErrCode != '99999'){	
						GX.Cookie.set('UserId', vThis.userId, 365*100);
						GX.Cookie.set('UserSeq', data[0].UserSeq, 365*100);
						GX.Cookie.set('UserName', data[0].UserName, 365*100);
						GX.Cookie.set('DeptName', data[0].DeptName, 365*100);
						GX.Cookie.set('SiteInit', data[0].SiteInit, 365*100);	//JPDC
						GX.Cookie.set('pdaPort', '8113', 365*100);	//JPDC 미들웨어포트

						GX.Cookie.set('EmpName', data[0].EmpName, 365*100);
						GX.Cookie.set('EmpSeq', data[0].EmpSeq, 365*100);
						GX.Cookie.set('DeptName', data[0].DeptName, 365*100);
						GX.Cookie.set('DeptSeq', data[0].DeptSeq, 365*100);
						GX.Cookie.set('UCompanySeq', vThis.companySeq, 365*100);
						
						GX.Cookie.set('WkTeamName', data[0].WkTeamName, 365*100);
						GX.Cookie.set('WkTeamSeq', data[0].WkTeamSeq, 365*100);
						GX.Cookie.set('UMWkTypeName', data[0].UMWkTypeName, 365*100);
						GX.Cookie.set('UMWkType', data[0].UMWkType, 365*100);
						GX.Cookie.set('WorkCenterName', data[0].WorkCenterName, 365*100);
						GX.Cookie.set('WorkCenterSeq', data[0].WorkCenterSeq, 365*100);

						GX.Cookie.set('PackageWorkCenterName', data[0].PackageWorkCenterName, 365*100);
						GX.Cookie.set('PackageWorkCenterSeq', data[0].PackageWorkCenterSeq, 365*100);
						
						location.replace('main.html');
					} else {
						vThis.userPwd = '';
						alert('You entered the wrong ID/PW.');

					}
				}], true);
			}
			
			event.preventDefault();
			// GX.Cookie.set('UserId', 'test', 365*100);
			// location.replace('main.html');
		},
		selectedcompany: function(){
			//console.log('selectedcompany', event.target.selectedIndex);
			let dsn = (event.target.selectedIndex > 0) ? this.rows['IDCheck'][event.target.selectedIndex - 1].Dsn : ''
			GX.Storage.set('gx_anotherDsn', dsn);
		},
		checkId: function(){
			var vThis = this;
			GX._METHODS_
			.setMethodId('Genuine.tdiModuleName.BisSIIntegratedAPI_tdi/GetBizUnit')
			.ajax([{}], [function(data){
				console.log(data);
				vThis.rows['IDCheck'] = (data[0] != null && data[0].Result != null) ? [] : data;
				if(data.length == 1) {
					vThis.companySeq = data[0].UCOmpanySeq;
					GX.Storage.set('gx_anotherDsn', data[0].Dsn); 
				}
				else {
					vThis.companySeq = "";
					GX.Storage.set('gx_anotherDsn', '');
				}
			}], true);
		},
		saveId: function(){
			if(event.target.checked){
				if(this.userId.trim().length > 0) GX.Storage.set('gx_saveId', this.userId);
			}
			else GX.Storage.remove('gx_saveId');
		},
		scanBarCode: function(){
			let clipboardData = event.clipboardData || window.clipboardData;
			if(clipboardData != null){
				let QRCodeData = clipboardData.getData('Text');
				let activeObjName = '';
				let activeTabIdx = '';
				let isFocused = (document.querySelector('input:focus') != null);

				if(isFocused) {
					if(event.target.hasAttribute('gx-scanner') && event.target.getAttribute('gx-scanner') == 'Y'){
						activeObjName = event.target.name;
						activeTabIdx = event.target.tabIndex;
					}
				}
				else {
					let scannerObj = document.querySelectorAll('[gx-scanner="Y"]');
					if(scannerObj.length == 1){
						activeObjName = scannerObj[0].name;
						activeTabIdx = scannerObj[0].tabIndex;
					}
				}

				if(activeObjName.length > 0){
					
					if(this[activeObjName.capitalizeFirstLetter('L')] != null) this[activeObjName.capitalizeFirstLetter('L')] = QRCodeData;

					//GX.eventTrigger('[gx-scanner="Y"]:focus', 'change');//2개 있을 때
					//GX.eventTrigger('[gx-scanner="Y"]', 'change');//1개 있을 때
					//GX.eventTrigger('[name="'+activeObjName+'"]', 'change');//1 또는 2개 있을 때

					GX.TabIndex.next(activeObjName);

					event.preventDefault();
				}
			}
		}

	},
	mounted(){
		//this.autoSettings();
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
		let appInfo = GAON.AppBridge.getAppInfo();
		if(appInfo.GaonIsApp != ''){
			GAON.AppBridge.requestApp('phoneNumber','','responseApp');
		}
		
	},
	created(){
		
		if(GX._METHODS_.isLogin()) location.replace('main.html');
		else{
			
			//settingItems:{dsn:'', work:'', serverAddr:'', anotherDsn:''},



			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			//nababa4826

			if(GX.Storage.get('gx_saveId') != null && GX.Storage.get('gx_saveId').length > 0){
				this.isSaveIds = [1];
				this.userId = GX.Storage.get('gx_saveId');
				this.checkId();
			}

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

			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}

	}

});
