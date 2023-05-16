var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameterValues(),
		convertKeys:{
			ReqQty:'quantity2'
		},
		rows:{
			'InWHName':[],
			'OutWHName':[],
			'LotNo':[],
			'UnitName':[],
			'checkListQuery':[],
			'Query':[],
			'lotNoListQuery':[]
		},
		queryForm:{
			InOutNo:'',
			InOutSeq:'0',
			InWHName:'',
			InWHSeq:'0',
			OutWHName:'',
			OutWHSeq:'0',
			LotNo:'',
			ItemNo:'',
			ItemName:'',
			ItemSeq:'0',
			ReqQty:'',
			UnitName:'',
			UnitSeq:'0',
			ReqNo:'',
			ReqSeq:'0'
		},
		itemData:{
			LotNo:'',
			ItemName:'',
			ItemNo:'',
			ItemSeq: 0,
			Result:'',
			Spec:'',
			Status:0,
			UnitSeq:'',
			ReqQty:''
		},
		codeHelp:{
			LotNo:''
		},
		codeHelpRequest:{
			LotNo:['LotNo','OutWHSeq']
		},
		codeHelpResponse:{
			LotNo:['LotNo', 'ItemName','ItemNo','ItemSeq','ReqQty','UnitSeq']
		},
		codeHelpDependencyKey:{
		},
		codeHelpGroupKey:{
		},
		codeHelpQryTypeMapKey:{
			LotNo:'MoveLotNo'
		},
		isCheckList:[],
		isAllowedCamera: (typeof navigator.getUserMedia == 'function'), // scanner 관련
		isScanning: false, // scanner 관련
		isReadyCamera: false // scanner 관련
	},
	methods:{
		selectAll: function(){
			//console.log("selectAll");
			let obj = document.querySelectorAll('[name="InOutSerl"]');
			let isCheckList = [];
			for(let i in obj){
				if(obj.hasOwnProperty(i)){
					obj[i].checked = event.target.checked;
					if(event.target.checked) isCheckList.push(Number(i));
				}
			}
			this.isCheckList = isCheckList;
		},
		initSelected: function(){
			this.isCheckList = [];
			let selAllObj = document.querySelector('thead [type="checkbox"]');
			//console.log(selAllObj);
			if(selAllObj != null){
				selAllObj.checked=true;
				selAllObj.click();	
			}
		},
		isChecked: function(index){
			return (this.isCheckList.indexOf(index) != -1);
		},
		selectedMark: function(index){
			let idx = this.isCheckList.indexOf(index);
			if(event.target.checked) this.isCheckList.push(index);
			else if(idx != -1) this.isCheckList.splice(idx, 1);
		},
		init: function(){
			// let itemData = GX.deepCopy(this.itemData);
			// for(let key in itemData){
			// 	if(itemData.hasOwnProperty(key)){
			// 		let obj = document.querySelector('[name="'+key+'"]');
			// 		if(obj != null && obj.hasAttribute('gx-default')) itemData[key] = obj.getAttribute('gx-default');
			// 	}
			// }
			// console.log(itemData)
			// this.itemData = itemData;
			// GX.initForm('addForm', ['gx-pre-value']);

			this.itemData = GX.getInitVueModelByFormDefault(this.itemData);
			GX.initForm('addForm', ['gx-pre-value']);

			if(event.type == 'click') event.target.blur();
		},
		searchMoveJump: function(dataMap){
			var vThis = this;
			let params = [];
			console.log(dataMap);
			for(let _rsi in dataMap._ReqSerl){
				if(dataMap._ReqSerl.hasOwnProperty(_rsi)){
					params.push({ReqSeq: dataMap.ReqSeq, ReqSerl: dataMap._ReqSerl[_rsi], QryType:'MoveJump'});
				}
			}

			if(params.length > 0){
				GX._METHODS_
				.setMethodId('TransReq')
				.ajax(params, params, [function(data){
					console.log(data);
					if(data.length > 0 && data[0].Result == null){

						for(var di in data){
							if(data.hasOwnProperty(di)){
								data[di].SerialNo = Number(di)+1;
							}
						}

						vThis.rows.checkListQuery = data;

					}
					
				}]);
			}
		},
		search: function(params){
			this.initSelected();

			var vThis = this;
			GX._METHODS_
			.setMethodId('MoveMat')
			.ajax([params], [function(data){
				data = GX.reductionItemByRows(['InOutNo','InOutSeq','InWHName','InWHSeq','OutWHName','OutWHSeq'], GX.deepCopy(data));
				for(var di in data){
					
					if(data.hasOwnProperty(di)){
						if(vThis.queryForm.ReqSeq != null){
							data[di].ReqSeq = String(vThis.queryForm.ReqSeq);
							data[di].ReqNo = vThis.queryForm.ReqNo;
						}
					}
				}
	
				if(data != null && data.length > 0) vThis.queryForm = data[0];

			}, function(data){
				for(var di in data){
					if(data.hasOwnProperty(di)){
						data[di].SerialNo = Number(di)+1;
						data[di].Qty = (data[di].Qty == null) ? 0 : GX.NumberType.quantity2(data[di].Qty);
						data[di].STDQty = (data[di].STDQty == null) ? 0 : GX.NumberType.quantity(data[di].STDQty);
						data[di].STDStockQty = (data[di].STDStockQty == null) ? 0 : GX.NumberType.quantity2(data[di].STDStockQty);
						data[di].FromSTDQty = (data[di].FromSTDQty == null) ? 0 : GX.NumberType.quantity(data[di].FromSTDQty);
					}
				}

				vThis.rows['Query'] = data;
			}]);
		},
		add: function(){
			if(GX.Validation.run('', 'validate')){
				var vThis = this;
				let params = {QryType:'MoveItemAdd'};
				let tempForm = GX.deepCopy(this.queryForm); //참조없는 복사
				let tempForm2 = GX.deepCopy(this.itemData); //참조없는 복사
				Object.assign(tempForm, tempForm2);
				let tempForms = GX.reductionItemByRows(['ReqNo','ReqSeq','ItemSeq','LotNo','OutWHSeq','InWHSeq','UnitSeq','ReqQty'], [tempForm]);
				let inputData = tempForms[0];
				if(inputData.ReqQty != null) inputData.ReqQty = GX.NumberType.quantity2(inputData.ReqQty);
				if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
				Object.assign(params, inputData);
				
				GX._METHODS_
				.setMethodId('MoveMat')
				.ajax([params], [
					function(data){
						if(data[0].Result == null){
							let tempGroups = {};
							let tempKey = '';
							let tempKeys = [];
							for(let di in data){
								if(data.hasOwnProperty(di)){
									data[di].Qty = (data[di].Qty == null) ? 0 : GX.NumberType.quantity2(data[di].Qty);
									data[di].STDQty = (data[di].STDQty == null) ? 0 : GX.NumberType.quantity(data[di].STDQty);
									data[di].STDStockQty = (data[di].STDStockQty == null) ? 0 : GX.NumberType.quantity2(data[di].STDStockQty);
									data[di].FromSTDQty = (data[di].FromSTDQty == null) ? 0 : GX.NumberType.quantity(data[di].FromSTDQty);

									tempKey = data[di].ItemSeq+'-'+data[di].LotNo+'-'+data[di].FromSeq+'-'+data[di].FromSerl;
									tempKeys.push(tempKey);
									if(tempGroups[tempKey] == null) tempGroups[tempKey] = {};
									if(tempGroups[tempKey].SumQty == null) tempGroups[tempKey].SumQty = 0;
									
									data[di].SumQty = Number(tempGroups[tempKey].SumQty) + Number(data[di].Qty);

									tempGroups[tempKey] = data[di];
								}
							}
							data = [];
							for(let i in tempKeys){
								tempKey = tempKeys[i];
								if(tempGroups.hasOwnProperty(tempKey)) data.push(tempGroups[tempKey]);
							}

							let rowData = {InOutSerl: '0', SerialNo:'0'};
							Object.assign(rowData, data[0]);
							let row = GX.deepCopy(rowData); //참조없는 복사
							row.SerialNo = 'A';
							vThis.rows.Query.splice(0, 0, row);
							//console.log('ItemAdd', vThis.rows.Query);
							vThis.initSelected();


							let initItems = ['LotNo','ItemNo','ItemSeq','ItemName','ReqQty','UnitSeq'];
							for(let ii in initItems){
								if(initItems.hasOwnProperty(ii)){
									let obj = document.querySelector('[name="'+initItems[ii]+'"]');
									if(obj != null){
										obj.value = obj.getAttribute('gx-default');
										vThis.itemData[initItems[ii]] = obj.getAttribute('gx-default');
									}
								}
							}
		
							document.querySelector('[name="LotNo"]').focus();

						}
					}
				]);

			}

			if(event.type == 'click') event.target.blur();
		},
		save: function(){
			var vThis = this;
			let baseParams = {QryType:'MoveNewSave'};
			let params = GX.deepCopy(baseParams);
			let tempForm = GX.deepCopy(this.queryForm); //참조없는 복사
			let tempForm2 = GX.deepCopy(this.itemData); //참조없는 복사
			Object.assign(tempForm, tempForm2);
			let tempForms = GX.reductionItemByRows(['InOutSeq','ReqNo','ReqSeq','OutWHSeq','InWHSeq'], [tempForm]);
			let inputData = tempForms[0];

			if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
			Object.assign(params, inputData);

			let newData = [];
			let queryData = GX.deepCopy(this.rows.Query);
			for(let qi in queryData){
				if(queryData.hasOwnProperty(qi) && String(queryData[qi].InOutSerl) == '0') {
					queryData[qi].OutWHSeq = inputData.OutWHSeq;
					queryData[qi].InWHSeq = inputData.InWHSeq;
					queryData[qi].QryType = baseParams.QryType;
					newData.push(queryData[qi]);
				}
			}

			if(newData.length > 0){
				let params2 = newData;// GX.reductionItemByRows(['ReqSeq','ReqSerl','ItemSeq','UnitSeq','Qty','STDUnitSeq','STDQty'], newData);
				GX._METHODS_
				.setMethodId('MoveMat')
				.ajax([params], params2, [function(data){}, function(data){
					//location.replace(location.origin + location.pathname + GX.makeSearch({QryType:'Query', ReqSeq: data[0].ReqSeq}));
					vThis.search({QryType:'MoveQuery', InOutSeq: data[0].InOutSeq});

				}]);
			}

			if(event.type == 'click') event.target.blur();
		},
		del: function(){
			if(confirm('삭제되면 복구할 수 없습니다. 정말 삭제하시겠습니까?')){
				var vThis = this;
				let qryType = (document.querySelectorAll('[name="InOutSerl"]:checked').length > 0) ? 'MoveSheetDelete' : 'MoveMDelete';
				let params = {QryType:qryType};
				
				let tempForm = GX.deepCopy(this.queryForm); //참조없는 복사
				let tempForm2 = GX.deepCopy(this.itemData); //참조없는 복사
				Object.assign(tempForm, tempForm2);
				let tempForms = GX.reductionItemByRows(['InOutSeq','ReqNo','ReqSeq','OutWHSeq','InWHSeq'], [tempForm]);
				let inputData = tempForms[0];
				if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
				Object.assign(params, inputData);



				let queryData = GX.deepCopy(this.rows.Query);
				let checkList = [];
				let checkUnsavedList = [];
				let checkAllList = [];
				let remainList = [];
				let remainUnsavedList = [];
				let remainAllList = [];
				let objs = document.querySelectorAll('[name="InOutSerl"]');
				for(let ci in objs){
					if(objs.hasOwnProperty(ci)){
						Object.assign(queryData[ci], params);

						if(objs[ci].checked){
							objs[ci].checked = false;
							if(String(objs[ci].value) != '0') checkList.push(queryData[ci]);
							else checkUnsavedList.push(queryData[ci]);
							checkAllList.push(queryData[ci]);
						}
						else {
							if(String(objs[ci].value) != '0') remainList.push(queryData[ci]);
							else remainUnsavedList.push(queryData[ci]);
							remainAllList.push(queryData[ci]);
						}
					}
				}

				if(checkAllList.length == 0){
					if(remainList.length > 0){
						checkList = GX.deepCopy(remainList);
						remainList = [];
					}
					if(remainUnsavedList.length > 0) checkUnsavedList = GX.deepCopy(remainUnsavedList);
					remainAllList = [];
				}

				if(checkList.length > 0){
					
					let params2 = checkList;
					GX._METHODS_
					.setMethodId('MoveMat')
					.ajax([params], params2, [function(data){}, function(data){
						vThis.rows.Query = remainAllList;
						vThis.initSelected();

						if(remainList.length == 0){
							vThis.queryForm.InOutSeq = '';
							vThis.queryForm.InOutNo = '';
							//vThis.queryForm.WHSeq = '';

						}
						
					}]);
				}
				else {
					vThis.rows.Query = remainAllList;
					vThis.initSelected();
				}

			}

			if(event.type == 'click') event.target.blur();
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
					if(this.itemData[activeObjName] != null) this.itemData[activeObjName] = QRCodeData;

					//GX.eventTrigger('[gx-scanner="Y"]:focus', 'change');//2개 있을 때
					//GX.eventTrigger('[gx-scanner="Y"]', 'change');//1개 있을 때
					GX.eventTrigger('[name="'+activeObjName+'"]', 'change');//1 또는 2개 있을 때
	
					//GX.TabIndex.next(activeObjName);
					event.preventDefault();
				}
			}
		},




		setLotNo: function(){
			var vThis = this;
			let lotNo = (this.itemData.LotNo != null) ? this.itemData.LotNo : '';
			let OutWHSeq = (this.queryForm.OutWHSeq != null) ? this.queryForm.OutWHSeq : '0';

			GX._METHODS_
			.setMethodId('Main')
			.ajax([{QryType:'MoveLotNo', LotNo:lotNo, OutWHSeq:OutWHSeq}], [function(data){
				//console.log('LotNo',data, vThis.itemData);

				if(data[0].Result == null){
					data[0].ReqQty = (data[0].ReqQty == null) ? 0 : GX.NumberType.quantity(data[0].ReqQty);
					let itemData = GX.deepCopy(vThis.itemData); //참조없는 복사
					Object.assign(itemData, data[0]);
					vThis.itemData = itemData;
					console.log(vThis.itemData);

					GX.TabIndex.next2('LotNo');

					/*-----------------------------------------------------------
					let itemNo = (itemData.ItemNo != null) ? itemData.ItemNo : '';
					GX._METHODS_
					.ajax([{QryType:'UnitName', ItemNo:itemNo}], [function(data){
						//console.log(Object.keys(data[0]));
						vThis.rows['UnitName'] = data;

						////////////////////////////////////////
						if(vThis.itemData.UnitSeq != null) {
							let obj = document.querySelector('[name="UnitSeq"]');
							if(obj != null) obj.value = vThis.itemData.UnitSeq;
						}
						////////////////////////////////////////
					}], false);
					*/
				}
				else {
					vThis.init();// itemData 초기화 
					vThis.rows['UnitName'] = [];
				}

				/////////////////////////////////// 후처리 시작
				vThis.postProcessingCodeHelp();
				/////////////////////////////////// 후처리 끝

			}], true);
		},
		runScanner: function(inputName){ // scanner 관련

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
									else{
										const namePart = inputName.split('.');

										if(namePart.length == 1) vThis[namePart[0]] = QRCodeData;
										else if(namePart.length == 2) vThis[namePart[0]][namePart[1]] = QRCodeData;
										else if(namePart.length == 3) vThis[namePart[0]][namePart[1]][namePart[2]] = QRCodeData;
										
										//GX.TabIndex.next(namePart[namePart.length - 1]);
										const name = namePart[namePart.length - 1];
										document.querySelector('[name="'+name+'"]').value = QRCodeData;
										GX.TabIndex.next(name);
									}
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
		stopScanner: function(){ // scanner 관련
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
		closeInfo: function(){ // scanner 관련
			//this.isInfoBox = false;
			document.getElementById('info-container').style.display = 'none';
			event.target.blur();
		},
		copyUnsafelyUrl: function(){ // scanner 관련
			GX.SNS.copyUrlToClipboard('chrome://flags/#unsafely-treat-insecure-origin-as-secure', '카메라 접근 예외 설정 주소 복사');
			event.target.blur();
		},
		copyLocationOrigin: function(){ // scanner 관련
			GX.SNS.copyUrlToClipboard(location.origin, '카메라 허용 URL 주소 복사');
			event.target.blur();
		},

		showCodeHelp: function(targetName){
			let obj = document.querySelector('[code-help="'+targetName+'"]');
			if(obj != null) {
				if(!GX.isShowElement(obj)){
					document.body.style.overflow = 'hidden';
					obj.style.display = 'block';
				}
			}
		},
		anotherDisplayCodeHelp: function(targetName, display){
			let obj = document.querySelector('[code-help="'+targetName+'"]');
			if(obj != null) {
				let objs = obj.parentElement.children;
				for(let i in objs){
					if(objs.hasOwnProperty(i) && !objs[i].hasAttribute('code-help') && !objs[i].hasAttribute('gx-layer')) objs[i].style.display = display;
				}
			}
		},
		openCodeHelp: function(){
			let targetName = event.target.name;
			let targetValue = event.target.value;
			let vThis = this;
			GX.doubleClickRun(event.target, function(){
				vThis.focusCodeHelp(targetName);
				vThis.setSearchCodeHelp(targetName, targetValue); //vThis.codeHelp[targetName] = targetValue;
				vThis.searchCodeHelp(event.target.name, false);

				if(vThis.codeHelpDependencyKey[targetName] != null) targetName = vThis.codeHelpDependencyKey[targetName];

				vThis.showCodeHelp(targetName);
				vThis.anotherDisplayCodeHelp(targetName, 'none');

			});
		},
		closeCodeHelp: function(targetName){
			let obj = document.querySelector('[code-help="'+targetName+'"]');
			if(obj != null) {
				if(GX.isShowElement(obj)){	
					obj.style.display = 'none';
					document.body.style.overflow = 'unset';

					this.anotherDisplayCodeHelp(targetName, 'block');

					let keys = null;
					let responseKeys = this.codeHelpResponse[targetName];
					if(responseKeys != null) keys = GX.deepCopy(responseKeys); 
					else if(this.codeHelpGroupKey[targetName] != null) keys = [this.codeHelpGroupKey[targetName]];
					if(keys != null){
						console.log('ss-targetName', keys, targetName)
						for(let i in keys) {
							if(keys.hasOwnProperty(i)){
								// if(this.codeHelp[keys[i]] != null) this.codeHelp[keys[i]] = '';
								// let comebackObj = document.querySelector('[check-double-click][name="' + keys[i] + '"]');
								// console.log(i, keys[i], comebackObj)
								// if(comebackObj != null) comebackObj.focus();
								let key = keys[i].split('=')[0];
								if(this.codeHelp[key] != null) this.codeHelp[key] = '';
								let comebackObj = document.querySelector('[check-double-click][name="' + key + '"]');
								console.log(i, key, comebackObj, targetName)
								//if(comebackObj != null) comebackObj.focus();	
								GX.TabIndex.next2(key);
							}
						}	
					}	
				}
			}
		},
		setSearchCodeHelp: function(key, value){
			const idx = (this.codeHelp[key] == null && this.codeHelpDependencyKey[key] != null) ? this.codeHelpDependencyKey[key] : key;
			if(this.codeHelp[idx] != null){
				this.codeHelp[idx] = value;
			}
			this.initPagingCodeHelp(key);
		},
		focusCodeHelp: function(targetName){
			let tempTargetName = (this.codeHelpDependencyKey[targetName] != null) ? this.codeHelpDependencyKey[targetName] : targetName;
			if(this.itemData[targetName] != null && this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;

			if(event.type == 'click'){
				if(tempTargetName != targetName && this.codeHelp[tempTargetName] != null) {
					if(this.codeHelp[tempTargetName] != null) this.setSearchCodeHelp(tempTargetName, ''); //this.codeHelp[tempTargetName] = '';
				}

				for(let i in this.codeHelpDependencyKey) {
					if(this.codeHelpDependencyKey.hasOwnProperty(i) && this.codeHelpDependencyKey[i] == tempTargetName){
						this.setSearchCodeHelp(i, ''); //this.codeHelp[i] =  '';
					} 
				}
			}
		},
		inputSearchCodeHelp: function(){
			this.focusCodeHelp(event.target.name);
			this.setSearchCodeHelp(event.target.name, event.target.value); //this.codeHelp[event.target.name] = event.target.value;
			this.searchCodeHelp(event.target.name, true);
		},
		searchCodeHelp: function(targetName, isOnePick){
			let keys = this.codeHelpResponse[targetName];
			let tempTargetName = (this.codeHelpDependencyKey[targetName] != null) ? this.codeHelpDependencyKey[targetName] : targetName;

			//let targetName = (this.codeHelpDependencyKey[temptargetName] != null) ? this.codeHelpDependencyKey[event.target.name] : event.target.name;
			if(this.codeHelpGroupKey[tempTargetName] != null) targetName = this.codeHelpGroupKey[tempTargetName];

			let obj = document.querySelector('#grid-'+(tempTargetName.toLowerCase())+' tbody tr.check');
			if(obj != null) obj.className = '';

			let params = {};
			//if(this.codeHelp[targetName] != null) params[targetName] = this.codeHelp[targetName];		
			if(this.codeHelpRequest[targetName] == null) this.codeHelpRequest[targetName] = [targetName];

			let paramKeyParse = [];
			let dataKey = '';
			for(let i in this.codeHelpRequest[targetName]){
				if(this.codeHelpRequest[targetName].hasOwnProperty(i)){
					paramKeyParse = this.codeHelpRequest[targetName][i].split('=');
					dataKey = (paramKeyParse.length == 2) ? paramKeyParse[1] : paramKeyParse[0];
					/////////////////////////////////// 예외 처리 커스터마이징 시작
					if(this.codeHelp[dataKey] != null){
						params[paramKeyParse[0]] = this.codeHelp[dataKey];
					}
					else if(this.itemData[dataKey] != null) params[paramKeyParse[0]] = this.itemData[dataKey];
					else if(this.queryForm[dataKey] != null) params[paramKeyParse[0]] = this.queryForm[dataKey];
					/////////////////////////////////// 예외 처리 커스터마이징 끝

				}
			}

			params.QryType = (this.codeHelpQryTypeMapKey[targetName] != null) ? this.codeHelpQryTypeMapKey[targetName] : targetName;//'EmpName';

			let pageCountObj = document.querySelector('[code-help="'+tempTargetName+'"] [name="PageCount"]');
			let pageSizeObj = document.querySelector('[code-help="'+tempTargetName+'"] [name="PageSize"]');
			if(pageCountObj != null && pageCountObj.value.match(/^[^0]\d*$/) == null) pageCountObj.value = 1;
			params.PageCount = (pageCountObj != null) ? pageCountObj.value : 1;
			params.PageSize = (pageSizeObj != null) ? pageSizeObj.value : 50;

			var vThis = this;
			GX._METHODS_
			.setMethodId('Main')
			.ajax([params], [function(data){
				for(var di in data){
					if(data.hasOwnProperty(di)){
						data[di].SerialNo = Number(di)+1 + (params.PageSize * (params.PageCount - 1));
					}
				}

				if(isOnePick){
					if(data.length == 1){
						for(let i in keys) {
							if(keys.hasOwnProperty(i)) vThis.itemData[keys[i]] = data[0][keys[i]];
						}

						GX.TabIndex.next2(tempTargetName);

						/////////////////////////////////// 후처리 시작
						vThis.postProcessingCodeHelp();
						/////////////////////////////////// 후처리 끝
					}
					else if(data.length > 1) vThis.showCodeHelp(tempTargetName);
				}

				vThis.rows[tempTargetName.capitalizeFirstLetter('L') + 'ListQuery'] = (data.length == 0 || (data[0].Status != null && String(data[0].Status).length > 0)) ? [] : data; //empNameListQuery
			}]);

			if(event.type == 'click') event.target.blur();
		},
		selectCodeHelp: function(index){
			if(event.target.closest('tr') != null) {
				event.target.selectedIndex = index;
				let obj = event.target.closest('tbody').children;
				for(let i in obj){
					if(obj.hasOwnProperty(i)) {
						obj[i].selectedIndex = i;
						obj[i].className = (i == String(index)) ? 'check' : '';
					}
				}				
			}
			else {
				event.target.selectedIndex = index;
				event.target.className = 'check';
			}
		},
		selectedApplyCodeHelp: function(targetName){

			let obj = document.querySelector('#grid-'+(targetName.toLowerCase())+' tbody tr.check');

			let tempTargetName = (this.codeHelpGroupKey[targetName] != null) ? this.codeHelpGroupKey[targetName] : targetName;

			let keys = this.codeHelpResponse[tempTargetName];

			if(obj != null) {
				
				let keyParse = [];
				let dataKey = '';
				
				for(let i in keys) {
					if(keys.hasOwnProperty(i)) {

						keyParse = keys[i].split('=');
						dataKey = (keyParse.length == 2) ? keyParse[1] : keyParse[0];

						this.itemData[keyParse[0]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey];
					}
				}


				/////////////////////////////////// 후처리 시작
				this.postProcessingCodeHelp();
				/////////////////////////////////// 후처리 끝

				this.closeCodeHelp(targetName);

				GX.TabIndex.next2(targetName);
			}
			else alert('시트에서 사용할 코드를 선택후 선택하기 버튼을 눌러주세요.');
		},
		initPagingCodeHelp: function(targetName){
			let pageCountObj = document.querySelector('[code-help="'+targetName+'"] [name="PageCount"]');
			let pageSizeObj = document.querySelector('[code-help="'+targetName+'"] [name="PageSize"]');
			if(pageCountObj != null) pageCountObj.value = 1;
			if(pageSizeObj != null) pageSizeObj.value = 50;
		},
		pagingCodeHelp: function(targetName, action){
			let pageCountObj = document.querySelector('[code-help="'+targetName+'"] [name="PageCount"]');
			if(pageCountObj != null){
				let count = pageCountObj.value;
				if(action == 'prev' && pageCountObj.value > 1) pageCountObj.value--;
				else if(action == 'next') pageCountObj.value++;

				if(count != pageCountObj.value) this.searchCodeHelp(targetName);
			}
		},
		postProcessingCodeHelp: function(){
			let vThis = this;
			let itemNo = (this.itemData.ItemNo != null) ? this.itemData.ItemNo : '';
			console.log('sssssssss['+itemNo+']'+this.itemData.UnitSeq);
			if(itemNo.length > 0){
				GX._METHODS_
				.setMethodId('Main')
				.ajax([{QryType:'UnitName', ItemNo:itemNo}], [function(data){
					//console.log('UnitName',data);
					if(data[0].UnitSeq != null){
						//console.log(Object.keys(data[0]));
						vThis.rows['UnitName'] = data;
						console.log(data,'11111111111111111122222222');
						////////////////////////////////////////
						if(vThis.itemData.UnitSeq != null) {
							let obj = document.querySelector('[name="UnitSeq"]');
							if(obj != null) obj.value = vThis.itemData.UnitSeq;
						}
						////////////////////////////////////////
					}
					else {
						vThis.rows['UnitName'] = [];
					}
				}], false);

			}
			else{
				this.itemData = GX.getInitVueModelByFormDefault(this.itemData);
				this.rows.UnitName = [];
			}
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

		GX.NumberType.init(GX._DATAS_.convertRules);


		if(this.params.QryType == null && this.params.ReqSeq != null) {
			//원부자재이동요청조회에서 jump한 데이터
			let queryForm = GX.deepCopy(this.queryForm); //참조없는 복사
			let response = GX.deepCopy(this.params); //참조없는 복사
			//let response = GX.getParameters();
			Object.assign(queryForm, response);
			this.queryForm = queryForm;

			if(this.params._ReqSerl != null) this.searchMoveJump(this.params);
		}
		

		GX._METHODS_
		.setMethodId('Main')
		.ajax([{QryType:'InWHName2', InWHName:''}], [
			function(data){
				vThis.rows['InWHName'] = data;
				
				if(data.length > 0){
					let isNotExistSeq = true;

					for(let i in data){
						if(data.hasOwnProperty(i) && Number(vThis.queryForm.InWHSeq) == Number(data[i].InWHSeq)){
							isNotExistSeq = false;
						}
					}

					if(isNotExistSeq) vThis.queryForm.InWHSeq = data[0].InWHSeq;

				}
				//console.log('InWHName', vThis.rows['InWHName']);
			}
		]);

		GX._METHODS_
		.setMethodId('Main')
		.ajax([{QryType:'OutWHName2', OutWHName:''}], [
			function(data){
				vThis.rows['OutWHName'] = data;

				if(data.length > 0){
					let isNotExistSeq = true;

					for(let i in data){
						if(data.hasOwnProperty(i) && Number(vThis.queryForm.OutWHSeq) == Number(data[i].OutWHSeq)){
							isNotExistSeq = false;
						}
					}
					
					if(isNotExistSeq) vThis.queryForm.OutWHSeq = 3;//data[0].OutWHSeq;

				}
				//console.log('OutWHName', vThis.rows['OutWHName']);
			}
		]);
	},

	created(){
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			const vThis = this;
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//this.queryForm.CompleteWishDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			
			//var p = (GX.getParameters().p != null) ? GX.getParameters().p : 1;
			//console.log('seeeeeeeeeeeesssssssss', GX.getParameters(), decodeURIComponent(GX.getParameters().WHName))
			



			GX.VueGrid
			//.bodyRow(':class="{\'check\':isChecked(index)}"')
			.item('SerialNo', {rowspan:2}).head('번호', 'num')
			.item('ItemNo').head('품번', '')
			.item('Spec').head('규격', '')
			.item('ReqProcTypeName').head('진행', '')
			.item('DeptName').head('요청부서', '')
			.nl()
			.item('ItemName').head('품명', '')
			.item('UnitName').head('단위', '')
			.item('Qty').head('요청량', '')
			.item('EmpName').head('요청자', '')
			.loadTemplate('#grid-checklist', 'rows.checkListQuery');

			GX.VueGrid
			.init()
			.bodyRow(':class="{\'check\':isChecked(index)}"')
			.item('InOutSerl', {rowspan:2}).head('<div class="chkBox"><input type="checkbox" @click="selectAll();" /></div>', '')
										.body('<div class="chkBox"><input type="checkbox" name="InOutSerl" :value="row.InOutSerl" @click="selectedMark(index);" /></div>', '')
			.item('SerialNo', {rowspan:2}).head('번호', 'num')
										//.body(null, 'num')
			.item('LotNo', {rowspan:2}).head('Lot No', 'num')
			.item('ItemNo').head('품번', '')
							//.body(null, 'item_num')
			.item('Spec').head('규격', '')
			.item('FromQty').head('요청량', '')
			.item('SumQty').head('이동량 누계', '')
			.nl()
			.item('ItemName').head('품명', '')
			.item('UnitName').head('단위', '')
			.item('Qty').head('이동량', '')
			.item('STDStockQty').head('재고량', '')
			.loadTemplate('#grid', 'rows.Query');

			if(this.params.QryType != null && this.params.QryType == 'MoveQuery') this.search(this.params);
			

			// select box에 scannr enter evnet 막기 시작 /////////////
			GX.SelectBoxEnterPrevention.init();
			// select box에 scannr enter evnet 막기 끝 /////////////

			// 스캐너 입력이 하나인 경우 포커스 없이도 해당 스캔 입력박스에 스캔값 입력처리를 위한 이벤트
			document.body.addEventListener('paste', this.scanBarCode, false);

			// 다음 입력창 이동을 위한 tab index 부여 시작 /////////////
			//GX.TabIndex.indexing();
			GX.TabIndex.indexing(['InWHSeq','OutWHSeq','LotNo','ReqQty','UnitSeq']);
			// 다음 입력창 이동을 위한 tab index 부여 끝 /////////////

			// 스캐너 입력박스 - 기본 모바일 가상 키보드 막기 시작 /////////////
			GX.VirtualKeyboardPrevention.init('[gx-scanner="Y"]');


			/*
			let scannerObj = document.querySelectorAll('[gx-scanner="Y"]');
			for(let i in scannerObj){
				if(scannerObj.hasOwnProperty(i)){
					scannerObj[i].setAttribute('inputmode', 'none'); // 스캐너 입력박스 - 포커스 인 일때 모바일 가상 키보드 막기 기본 설정
					scannerObj[i].setAttribute('onclick', 'app.scanBoxClick();'); // 스캐너 입력박스 - 클릭시에 가상 가상 키보드 막기 해제(입력시작)
					scannerObj[i].setAttribute('onblur', 'app.scanBoxBlur();'); // 스캐너 입력박스 - 포커스 아웃 일때 가상 가상 키보드 막기 설정(입력완료)
				}
			}
			*/
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


			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('LotNo').head('LotNo', '')
			.item('ItemName').head('품명', '')
			.item('ItemNo').head('품번', '')
			.item('ItemSeq').head('품목내부코드', '')
			.loadTemplate('#grid-lotno', 'rows.lotNoListQuery');


			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});

function responseAppReqNo(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') {
			app.queryForm.ReqNo = result.result;
			GX.TabIndex.next('ReqNo');
		}
	}
}

function responseAppLotNo(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') app.itemData.LotNo = result.result;
	}
}
