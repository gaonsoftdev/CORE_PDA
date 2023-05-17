GX._DATAS_ = {
	ajaxDataBlockKeys:['DataBlock1','DataBlock2'],
	ajaxTableNameKeys:['DataBlock1','DataBlock11'],
	ajaxUrl:{
		//get:'http://121.146.68.20:8081/Angkor.Ylw.Common.HttpExecute/RestOutsideService.svc/GetServiceMethodJson',
		//post:'http://121.146.68.20:8081/Angkor.Ylw.Common.HttpExecute/RestOutsideService.svc/OpenApi/IsStoredProcedure/{methodId}'
		get:'/Angkor.Ylw.Common.HttpExecute/RestOutsideService.svc/GetServiceMethodJson',
		post: '',
		postTemplate:'/Angkor.Ylw.Common.HttpExecute/RestOutsideService.svc/OpenApi/{methodId}'
	},
	ajaxSecurity:{
		//get:'{certId:KNICDEV,certKey:KNIC,dsnOper:knicdev_oper,dsnBis:knicdev_oper,dsn:knicdev_bis,workingTag:,securityType:1,isDebug:0,companySeq:1,languageSeq:1,serviceId:IsStoredProcedure,methodId:?,hostComputername:,hostIPAddress:,userId:nababa4826,userPwd:,empSeq:2421}',
		// post:{
		// 	"certId":"KNICDEV",
		// 	"certKey":"KNIC",
		// 	"dsnOper":"knicdev_oper",
		// 	"dsnBis":"knicdev_oper",
		// 	"dsn":"knicdev_bis",
		// 	"securityType":1,
		// 	"companySeq":1,
		// 	"languageSeq":1,
		// 	"userId":"nababa4826"
		// }
		get:'{certId:KNICDEV,certKey:KNIC,dsnOper:?,dsnBis:?,dsn:?,workingTag:,securityType:1,isDebug:0,companySeq:?,languageSeq:1,serviceId:IsStoredProcedure,methodId:?,hostComputername:,hostIPAddress:,userId:?,userPwd:,empSeq:?}',
		post:{
			"certId":"Core_APIIntegration",
			"certKey":"EM2NKTZDQ5J7UYF0NPD603QXBSDL8VZR",
			"dsnOper":"core_oper",
			"dsnBis":"core_bis",
			// "dsn":"",
			"securityType":0,
			"companySeq":1, //1
			"languageSeq":1,
			"userId":"",
			// "DBName":""
		}
	},
	ajaxBaseDataBlock:{
		"WorkingTag": "",
		"IDX_NO": 0,
		"Status": "0",
		"DataSeq": 1,
		"Selected": 1,
		"TABLE_NAME": "",
		"UserName": "",
		//,"ItemNo":""
		//,"QryType":"Main" // 
	},
	ajaxInputData:{
		"ROOT":{
			//"DataBlock1":[],
			//"DataBlock2":[]
		}
	},
	pageUrls:{
		'1':{link:'packProcessing.html', icon:'img/ic_mainmenu_01.png', groupTitle:'제품추적관리', subTitle:'제품출고처리'},//명세입고처리_TDI
		'2':{link:'packProcessing.html', icon:'img/ic_mainmenu_02.png', groupTitle:'제품추적관리', subTitle:'구매납품처리'}, //재고실사등록_TDI
		'3':{link:'packProcessing.html', icon:'img/ic_mainmenu_03.png', groupTitle:'제품추적관리', subTitle:'이동입력처리'}, 
		'4':{link:'specificationReceiptProcessing.html', icon:'img/ic_mainmenu_04.png', groupTitle:'제품추적관리', subTitle:'창고재고실사처리'}, 
		// '5':{link:'otherShipmentProcessing.html', icon:'img/ic_mainmenu_05.png', groupTitle:'제품추적관리', subTitle:'기타출고처리'},
		// '6':{link:'reworkProcessing.html', icon:'img/ic_mainmenu_06.png', groupTitle:'제품추적관리', subTitle:'재작업'}, 
		// '7':{link:'packRework.html', icon:'img/ic_mainmenu_07.png', groupTitle:'제품추적관리', subTitle:'팩재작업'}, 
		// '8':{link:'palletForwarding.html', icon:'img/ic_mainmenu_08.png', groupTitle:'제품추적관리', subTitle:'팔레트출고'}, 
		// // '8':{link:'test.html', icon:'img/ic_mainmenu_09.png', groupTitle:'제품추적관리', subTitle:'데이터관리'},
		// '9':{link:'palletTracking.html', icon:'img/ic_mainmenu_11.png', groupTitle:'제품추적관리', subTitle:'팔레트추적'},
		// '10':{link:'palletLookup.html', icon:'img/ic_mainmenu_10.png', groupTitle:'제품추적관리', subTitle:'팔레트조회'},
	}

};

GX._METHODS_ = {
	isLogin: function(){
		// return (GX.Cookie.get('UserSeq') != null && GX.Cookie.get('UserSeq').length > 0)
		return (GX.Cookie.get('UserId') != null && GX.Cookie.get('UserId').length > 0)
	},
	setSecurityProperty: function(key, value){
		let re = new RegExp('([,\{])' + key + ':[^:,\}]+');
		GX._DATAS_.ajaxSecurity.get = GX._DATAS_.ajaxSecurity.get.replace(re, '$1' + key + ':' + value);

		if (key == 'methodId') {
			// GX._DATAS_.ajaxUrl['post_old'] = GX._DATAS_.ajaxUrl.post;
			// GX._DATAS_.ajaxUrl.post = GX._DATAS_.ajaxUrl.post.replace(/\/[^\/]+$/, '/' + value);
			GX._DATAS_.ajaxUrl.post = GX._DATAS_.ajaxUrl.postTemplate.replace(/\/\{methodId\}$/, '/' + value);
		}
		else GX._DATAS_.ajaxSecurity.post[key] = value;
	},
	setBaseDataBlockProperty: function(key, value){
		if(GX._DATAS_.ajaxBaseDataBlock.hasOwnProperty(key)) GX._DATAS_.ajaxBaseDataBlock[key] = value;
	},
	setMethodId: function(methodId){
		if(this.isLogin()){
			// this.setSecurityProperty('empSeq', GX.Cookie.get('EmpSeq'));
			this.setSecurityProperty('userId', GX.Cookie.get('UserId'));
			this.setSecurityProperty('companySeq', '1');

			this.setBaseDataBlockProperty('UserId', GX.Cookie.get('UserId'));
			this.setBaseDataBlockProperty('CompanySeq', GX.Cookie.get('CompanySeq'));
		}
		else{
			// this.setSecurityProperty('empSeq', '');
			this.setSecurityProperty('userId', '');
			this.setSecurityProperty('companySeq', '1');

			this.setBaseDataBlockProperty('UserId', '');
			this.setBaseDataBlockProperty('CompanySeq', '1');
		}

		this.setSecurityProperty('methodId', methodId);


		if(GX.Storage.data.hasOwnProperty('gx_dsn') && GX.Storage.data.hasOwnProperty('gx_anotherDsn')){
			let dsn = GX.Storage.get('gx_dsn');
			let anotherDsn = (methodId == 'Login') ? dsn : GX.Storage.get('gx_anotherDsn');

			this.setSecurityProperty('dsnOper', 'core_oper');
			this.setSecurityProperty('dsnBis', 'core_bis');
			// this.setSecurityProperty('dsn', anotherDsn); // dsn : knicdev_bis or dsn : knicdev_oper
		}

		return this;
	},
	ajax: function(){
		if(GX.Storage.data.hasOwnProperty('gx_dsn')){
			//[param,param,...], [callback, callback, ..], isMessage
			//[objects], [functions], boolean
			let method = 'post';
			let isMessage = true;
			let i = 0, si = 0;
			let jsonObj = GX.deepCopy(GX._DATAS_.ajaxInputData);
			let inputData = GX.deepCopy(GX._DATAS_.ajaxInputData);
			var callbacks = {};
			let args = arguments;
			for(i in args){
				if(Array.isArray(args[i])){
					for(si in args[i]){
						if(typeof args[i][si] === 'object'){
							let dataBlock = GX.deepCopy(GX._DATAS_.ajaxBaseDataBlock); //참조없는 복사
							Object.assign(dataBlock, args[i][si]);
							
							if(inputData.ROOT[GX._DATAS_.ajaxDataBlockKeys[i]] == null) inputData.ROOT[GX._DATAS_.ajaxDataBlockKeys[i]] = [];
							inputData.ROOT[GX._DATAS_.ajaxDataBlockKeys[i]].push(dataBlock);
						}
						else if(typeof args[i][si] === 'function') callbacks[GX._DATAS_.ajaxTableNameKeys[si]] = args[i][si];
					}
				}
				else if(typeof args[i] === 'boolean') isMessage = args[i];
				else if(typeof args[i] === 'string') method = args[i].toLowerCase();
			}

			if(!this.isLogin() && inputData.ROOT.DataBlock1 != null && inputData.ROOT.DataBlock1.length > 0 && inputData.ROOT.DataBlock1[0].UserId != null){
				this.setSecurityProperty('userId', inputData.ROOT.DataBlock1[0].UserId);
				this.setBaseDataBlockProperty('UserId', inputData.ROOT.DataBlock1[0].UserId);
			}
			
			if(isMessage == null) isMessage = true;
			jsonObj.ROOT = GX.deepCopy(GX._DATAS_.ajaxSecurity.post);
			jsonObj.ROOT.data = inputData;

			let params = {
				get:{
					params:{
						securityJson: GX._DATAS_.ajaxSecurity.get,
						dataJson: JSON.stringify(inputData),
						encryptionType: "0",
						timeOut: "30"
					}
				},
				//post:{data: jsonObj}
				post:jsonObj
			};

			let config = {
				get:{withCredentials:true},
				post:{}
			};

			//console.log(this.params);
			GX.SpinnerBootstrap.show();
			
			console.log("GX.Storage.get('gx_serverAddr')",GX.Storage.get('gx_serverAddr'));
			console.log("GX._DATAS_.ajaxUrl[method]", GX._DATAS_.ajaxUrl[method]);
			console.log("param", params[method]);
			console.log("config[method]", config[method]);
			console.log("method", method);

			axios[method](GX.Storage.get('gx_serverAddr') + GX._DATAS_.ajaxUrl[method], params[method], config[method]).then((response) => {
				try{
					// if(response != null && response.status == 200 && response.statusText == 'OK'){
					if(response != null && response.statusText == 'OK' && response.data != null){
						// console.log(response.data)
						// console.log(JSON.parse(response.data))
						// console.log(response.status)
						// console.log(response.statusText)
						data = (method == 'post') ? response.data : JSON.parse(response.data);
						//console.log(data);

						let msg = '';

						if(method == 'post'){
							if(data != null){
								if(isMessage && data.ErrorMessage != null && data.ErrorMessage[0] != null && data.ErrorMessage[0].Result.length > 0) alert(data.ErrorMessage[0].Result);
								else {
									for(let tableName in data){
										if(data[tableName] != null){
											if(data[tableName].length > 0 && data[tableName][0].Result != null && data[tableName][0].Result.length > 0) {
												if(data[tableName][0].Message != null) msg = data[tableName][0].Message;
												else if(data[tableName][0].Result != null) msg = data[tableName][0].Result;
											}
											if(callbacks[tableName] != null) callbacks[tableName](data[tableName]);
										}
									}
								}
							}
						}
						else {
							if(data['Tables'] != null && data['Tables'].length > 0){
								for(let i in data['Tables']){
									if(data['Tables'][i] != null && data['Tables'][i]['Rows'] != null){
										if(data['Tables'][i]['Rows'].length > 0 && data['Tables'][i]['Rows'][0].Result != null && data['Tables'][i]['Rows'][0].Result.length > 0) {
											if(data[tableName][0].Message != null) msg = data['Tables'][i]['Rows'][0].Message;
											else if(data[tableName][0].Result != null) msg = data['Tables'][i]['Rows'][0].Result;
										}
										if(callbacks[data.Tables[i].TableName] != null) callbacks[data.Tables[i].TableName](data['Tables'][i]['Rows']);
									}
								}
							}
						}

						if(isMessage && msg.length > 0) alert(msg);

						GX.SpinnerBootstrap.hide();
					}
				} catch(err){
					alert('예외 오류가 발생했습니다!');
					GX.SpinnerBootstrap.hide();
					//console.error(err);
					GX._METHODS_.warning();
					console.log(err);
				}
			}).catch((error) => {
				if(error.response != null){
					if(error.response.status == 403){
						alert('로그인 세션이 만료되었습니다.\n다시 로그인 해주십시오');
						location.href = "/login";
					}
					else alert('('+error.response.status+' Internal Server Error) 응용 프로그램에 서버 오류가 있습니다.'); //500 Internal Server Error
				}
				else alert('알 수 없는 서버오류 발생');
	
				GX.SpinnerBootstrap.hide();
				
				//console.log(error.response.status, event.target.status);
				// 예외 처리
			});		
		}
		else alert('환경설정에서 네트워크 통신환경을 설정해주세요!');

		return this;
	},
	warning: function(){
		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
		navigator.vibrate(0);
		// navigator.vibrate(1500);
		navigator.vibrate([10,10,10,1000,1000,10,10,10,1000,1000]);
		var context = new AudioContext()
		var o = context.createOscillator()
		o.type = "sawtooth"
		o.connect(context.destination)
		o.start()
		setTimeout(function() {
			o.stop()
		}, 800);
	}
};


//InterfaceAPI 개발 : MobileERPSetting://~,knicdev_oper~,KNIC DEV~,http://192.168.205.20:8111/mobileappSvc/~,
//InterfaceAPI 운영 : MobileERPSetting://~,knicdev_oper~,KNIC DEV~,http://14.48.238.61:8111/mobileappSvc/~,
//K-system 개발 : MobileERPSetting://~,knicdev_oper~,KNIC DEV~,http://121.146.68.20:8081/mobileappSvc/~,
//Overriding - InterfaceAPI ////////////////////////////////////////////////////////////////////
if(false){

	GX._DATAS_.ajaxUrl.post = '/InterfaceAPI.aspx';
	GX._DATAS_.ajaxHeaders = {'Content-Type':'application/json', 'Accept': 'application/json', 'Cache-Control': 'no-cache', 'guid':'4CB521B9-3ACC-DF11-A3B6-001A6424E3C6'};
	
	if(GX.Storage.data.hasOwnProperty('gx_serverAddr')){
		console.log(GX.Storage.get('gx_serverAddr'))
		if(GX.Storage.get('gx_serverAddr') == 'http://192.168.205.20:8113') GX._DATAS_.ajaxHeaders.guid = 'CB211D39-F77E-E111-BDAF-0010182FC8D5';
		else if(GX.Storage.get('gx_serverAddr') == 'http://14.48.238.61:8113') GX._DATAS_.ajaxHeaders.guid = '4CB521B9-3ACC-DF11-A3B6-001A6424E3C6';
	}
	
	GX._METHODS_.setMethodId = function(methodId){
		GX._DATAS_.ajaxSecurity.post.methodId = methodId;
		return this;
	};
	GX._METHODS_.ajax = function(){
		if(GX.Storage.data.hasOwnProperty('gx_dsn')){
			console.log('DBName',GX.Cookie.get('DBName'));
			this.setSecurityProperty('DBName', GX.Cookie.get('DBName'));
			this.setBaseDataBlockProperty('DBName', GX.Cookie.get('DBName'));
			if(this.isLogin() && (GX.Cookie.get('UserId') != null && GX.Cookie.get('UserId').length > 0)){
				this.setSecurityProperty('userId', GX.Cookie.get('UserId'));
				this.setBaseDataBlockProperty('UserId', GX.Cookie.get('UserId'));
				
			}
			
			//[param,param,...], [callback, callback, ..], isMessage
			//[objects], [functions], boolean
			let method = 'post';
			let isMessage = true;
			let i = 0, si = 0;
			let jsonObj = GX.deepCopy(GX._DATAS_.ajaxInputData);
			let inputData = GX.deepCopy(GX._DATAS_.ajaxInputData);
			var callbacks = {};
			let args = arguments;
			for(i in args){
				if(Array.isArray(args[i])){
					for(si in args[i]){
						if(typeof args[i][si] === 'object'){
							let dataBlock = GX.deepCopy(GX._DATAS_.ajaxBaseDataBlock); //참조없는 복사
							Object.assign(dataBlock, args[i][si]);
							
							if(inputData.ROOT[GX._DATAS_.ajaxDataBlockKeys[i]] == null) inputData.ROOT[GX._DATAS_.ajaxDataBlockKeys[i]] = [];
							inputData.ROOT[GX._DATAS_.ajaxDataBlockKeys[i]].push(dataBlock);
						}
						else if(typeof args[i][si] === 'function') callbacks[GX._DATAS_.ajaxTableNameKeys[si]] = args[i][si];
					}
				}
				else if(typeof args[i] === 'boolean') isMessage = args[i];
				else if(typeof args[i] === 'string') method = args[i].toLowerCase();
			}
	
			if(!this.isLogin() && inputData.ROOT.DataBlock1 != null && inputData.ROOT.DataBlock1.length > 0 && inputData.ROOT.DataBlock1[0].UserId != null){
				this.setSecurityProperty('userId', inputData.ROOT.DataBlock1[0].UserId);
				this.setBaseDataBlockProperty('UserId', inputData.ROOT.DataBlock1[0].UserId);
			}
			
			if(isMessage == null) isMessage = true;
	
			let params = {
				post:{
					methodId: GX._DATAS_.ajaxSecurity.post.methodId,
					inputData: inputData
				}
			};
	
			let config = {
				post:{headers: GX._DATAS_.ajaxHeaders}
			};
	
			//console.log(this.params);
			GX.SpinnerBootstrap.show();
	
			axios[method](GX.Storage.get('gx_serverAddr') + GX._DATAS_.ajaxUrl[method], params[method], config[method]).then((response) => {
				try{
					// if(response != null && response.status == 200 && response.statusText == 'OK'){
					if(response != null && response.statusText == 'OK' && response.data != null){
						//console.log(response)
						// console.log(JSON.parse(response.data))
						// console.log(response.status)
						// console.log(response.statusText)
						data = (method == 'post') ? response.data : JSON.parse(response.data);
	
						let msg = '';
	
						if(method == 'post'){
							if(data != null){
								if(isMessage && data.error != null && data.error.length > 0) alert(data.error);
								else if(data.result != null){
									let result = data.result;
									if(data.result[0] != null) result = {DataBlock1: data.result};
	
									for(let tableName in result){
										//console.log(result[tableName], tableName);
										if(result[tableName] != null){
											if(result[tableName].length > 0 && result[tableName][0].Result != null && result[tableName][0].Result.length > 0) msg = result[tableName][0].Message;
											if(callbacks[tableName] != null) callbacks[tableName](result[tableName]);
										}
									}
								}
							}
						}
						else {
	
						}
	
						if(isMessage && msg.length > 0) alert(msg);
	
						GX.SpinnerBootstrap.hide();
					}
				} catch(err){
					alert('예외 오류가 발생했습니다!');
					GX.SpinnerBootstrap.hide();
					//console.error(err);
					GX._METHODS_.warning();
					console.log(err);
				}
			}).catch((error) => {
				if(error.response != null){
					if(error.response.status == 403){
						alert('로그인 세션이 만료되었습니다.\n다시 로그인 해주십시오');
						location.href = "/login";
					}
					else alert('('+error.response.status+' Internal Server Error) 응용 프로그램에 서버 오류가 있습니다.'); //500 Internal Server Error
				}
				else alert('알 수 없는 서버오류 발생');
	
				GX.SpinnerBootstrap.hide();
				
				//console.log(error.response.status, event.target.status);
				// 예외 처리
			});	
		}
		else alert('환경설정에서 네트워크 통신환경을 설정해주세요!');
	
		return this;
	};
	
}


GX._DATAS_.convertRules = {
	time:{type:'round', to:1},
	quantity:{type:'round', to:0},
	quantity2:{type:'round', to:2}
};