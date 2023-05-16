var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		convertKeys:{
			ReqQty:'quantity2'
		},
		rows:{
			'WHName':[],
			'UnitName':[],
			'Query':[],
			'carNoListQuery':[],
			'MoveData':[]
		},
		queryForm:{
			MovementDate:'',
			InOutType:'',
			ReqNo:'',
			CarNo:'',
			CarSeq:'',
			BarCode:''
		},
		QtyData:{
			ItemName:'',
			TotalQty:0
		},
		itemData:{
			ItemName:'',
			ItemNo:'',
			ItemSeq: 0,
			Result:'',
			Spec:'',
			Status:0,
			UnitSeq:''
		},
		codeHelp:{
			CarNo:''
		},
		codeHelpRequest:{
			CarNo:['CarNo'],
		},
		codeHelpResponse:{
			CarNo:['CarNo','CarSeq','CarSNo'],
		},
		codeHelpDependencyKey:{},
		codeHelpGroupKey:{},
		codeHelpQryTypeMapKey:{},
		isReCalls:[],
		isCheckList:[],
		isAllowedCamera: (typeof navigator.getUserMedia == 'function'), // scanner 관련
		isScanning: false, // scanner 관련
		isReadyCamera: false, // scanner 관련
		pdaPort: GX.Cookie.get('pdaPort')
	},
	methods:{
		//출고증조회
		ReqNoSel: function(){
			var vThis = this;
			let InOutType = document.querySelector('input[type=radio][name=InOutType]:checked');
			let params = {QryType:'ReqNoQuery',Gubun:'IDD_PALLET_OUT' ,InOutType:InOutType.value};
			let inputData = GX.deepCopy(GX.makeParamByForm(['ReqNo'])); //참조없는 복사
			Object.assign(params, inputData);
			GX._METHODS_
			.setMethodId('PalOut')
			.ajax([params],[
				function(data){
					if(data != null){
						data[0].InOutType = params.InOutType;
						vThis.rows['ReqNoData'] = data;
					}
					
				}
			]);
		},
		//바코드조회
		BarCodeSel: function(){
			var vThis = this;
			bk1: if(vThis.queryForm.ReqNo != '' && vThis.queryForm.BarCode != ''){
				let InOutType = document.querySelector('input[type=radio][name=InOutType]:checked');
				let params = {QryType:'BarCodeQuery',Gubun:'IDD_PALLET_OUT' ,InOutType:InOutType.value};
				let inputData = GX.deepCopy(GX.makeParamByForm(['ReqNo','BarCode'])); //참조없는 복사
				Object.assign(params, inputData);
				for(let i in vThis.rows.Query){
					if(vThis.rows.Query[i].InputPallet.replaceAll(' ','') == params.InputPallet.replaceAll(' ','')){
						alert('이미 스캔된 바코드입니다.');
						break bk1;
					}
				}
				GX._METHODS_
				.setMethodId('PalOut')
				.ajax([params],[
					function(data){
						if(data != null){
							
							data[0].SerialNo = Number(vThis.rows.Query.length)+1;
							data[0].SendType = params.InOutType == '1'?'0':'1';
							data[0].OutNo = data[0].ReqNo;
							data[0].Date = vThis.queryForm.MovementDate.replaceAll('-','');
							data[0].Qty = GX.NumberType.quantity(data[0].Qty);
							data[0].CarNo = vThis.queryForm.CarNo;
							data[0].CarSeq = vThis.queryForm.CarSeq;
							vThis.QtyData.ItemName = data[0].ItemName;
							vThis.QtyData.TotalQty = Number(vThis.QtyData.TotalQty) + Number(data[0].Qty);
							vThis.rows.Query.splice(0, 0, data[0]);
							vThis.initSelected();
							
							
						}//data not null

					}//function
				]);
			}
		},
		save2: function(){
			var vThis = this;
			let params = {QryType:'NewSave',Gubun:'IDD_PALLET_OUT'};
			let newData = [];
			let queryData = GX.deepCopy(this.rows.Query);
			for(let qi in queryData){
				
				if(queryData.hasOwnProperty(qi)){
					newData.push(Object.assign(queryData[qi], params));
				}
			}
			if(newData.length > 0){
				GX._METHODS_
				.setMethodId('PalOut')
				.ajax(newData, [function(data){
					console.log(data);
					vThis.init();
				}]);
			}
			
		},
		selectAll: function(){
			//console.log("selectAll");
			let obj = document.querySelectorAll('[name="ReqSerl"]');
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
			this.rows.Query = [];
			this.rows.carNoListQuery = [];
			this.QtyData.ItemName = '품명';
			this.QtyData.TotalQty = '0';
			this.queryForm = GX.getInitVueModelByFormDefault(this.queryForm);
			this.queryForm.MovementDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			GX.initForm('addForm');	
			if(event.type == 'click') event.target.blur();
		},
		search: function(params){
			this.initSelected();

			var vThis = this;
			GX._METHODS_
			.setMethodId('TransReq')
			.ajax([params], [function(data){
				data = GX.reductionItemByRows(['ReqSeq','CompleteWishDate','IsReCall','ReqNo','WHSeq'], GX.deepCopy(data));
				for(var di in data){
					if(data.hasOwnProperty(di)){
						data[di].CompleteWishDate = (data[di].CompleteWishDate.trim().length > 0)
						? data[di].CompleteWishDate.replace(/^(\d{4,})(\d{2,2})(\d{2,2})$/g,'$1-$2-$3')
						: GX.formatDate(GX.nowDate().full, 'Y-M-D');
						
						//data[di].CompleteWishDate.replace(/-/g,'')
						if(data[di].IsReCall == '1') vThis.isReCalls[0] = vThis.queryForm.IsReCall;
					}
				}
				console.log('ReqNo',data);
	
				if(data != null && data.length > 0) vThis.queryForm = data[0];

			}, function(data){
				for(var di in data){
					if(data.hasOwnProperty(di)){
						data[di].SerialNo = Number(di)+1;
						if(data[di].ReqQty != null) data[di].ReqQty = GX.NumberType.quantity2(data[di].ReqQty);
					}
				}

				vThis.rows['Query'] = data;
			}]);
		},
		add: function(){
			if(GX.Validation.run('', 'validate')){
				var vThis = this;
				let params = {QryType:'ItemAdd'};
				let inputData = GX.deepCopy(GX.makeParamByForm(['ReqSeq','WHSeq','IsRecall','CompleteWishDate','ItemSeq','ReqQty','UnitSeq'])); //참조없는 복사

				if(inputData.ReqQty != null) inputData.ReqQty = GX.NumberType.quantity2(inputData.ReqQty);

				if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
				if(inputData.CompleteWishDate != null) inputData.CompleteWishDate = inputData.CompleteWishDate.replace(/-/g,'');//GX.formatDate(inputData.CompleteWishDate, 'YMD')
				Object.assign(params, inputData);
				
				GX._METHODS_
				.setMethodId('TransReq')
				.ajax([params], [
					function(data){
						let rowData = {ReqSeq: '0', ReqSerl:'0', SerialNo:'0'};
						Object.assign(rowData, data[0]);
						let row = GX.deepCopy(rowData); //참조없는 복사
						if(row.ReqQty != null) row.ReqQty = GX.NumberType.quantity2(row.ReqQty);
						row.SerialNo = 'A';
						vThis.rows.Query.splice(0, 0, row);
						//console.log('ItemAdd', vThis.rows.Query);

						vThis.initSelected();
					}
				]);
			}
			if(event.type == 'click') event.target.blur();
		},
		save: function(){
			var vThis = this;
			let params = {QryType:'NewSave'};
			let inputData = GX.deepCopy(GX.makeParamByForm(['ReqSeq','WHSeq','IsRecall','CompleteWishDate'])); //참조없는 복사
			if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
			if(inputData.CompleteWishDate != null) inputData.CompleteWishDate = inputData.CompleteWishDate.replace(/-/g,'');//GX.formatDate(inputData.CompleteWishDate, 'YMD')
			Object.assign(params, inputData);

			let newData = [];
			let queryData = GX.deepCopy(this.rows.Query);
			for(let qi in queryData){
				if(queryData.hasOwnProperty(qi) && String(queryData[qi].ReqSerl) == '0') newData.push(queryData[qi]);
			}

			if(newData.length > 0){
				let params2 = GX.reductionItemByRows(['ReqSeq','ReqSerl','ItemSeq','UnitSeq','Qty','STDUnitSeq','STDQty'], newData);
				GX._METHODS_
				.setMethodId('TransReq')
				.ajax([params], params2, [function(data){}, function(data){
					//location.replace(location.origin + location.pathname + GX.makeSearch({QryType:'Query', ReqSeq: data[0].ReqSeq}));

					vThis.search({QryType:'Query', ReqSeq: data[0].ReqSeq});

				}]);
			}
			if(event.type == 'click') event.target.blur();
		},
		del2: function(){
			if(confirm('삭제되면 복구할 수 없습니다. 정말 삭제하시겠습니까?')){
				var vThis = this;
				let qryType = (document.querySelectorAll('[name="ReqSerl"]:checked').length > 0) ? 'SheetDelete' : 'MDelete';
				let params = {QryType:qryType};
				let inputData = GX.deepCopy(GX.makeParamByForm(['ReqSeq'])); //참조없는 복사
				if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
				if(inputData.CompleteWishDate != null) inputData.CompleteWishDate = inputData.CompleteWishDate.replace(/-/g,'');//GX.formatDate(inputData.CompleteWishDate, 'YMD')
				Object.assign(params, inputData);

				let queryData = GX.deepCopy(this.rows.Query);

				let objs = document.querySelectorAll('[name="ReqSerl"]');
				let checkList = [];
				let remainList = [];
				let savedRemainList = [];
				for(let ci in objs){
					if(objs.hasOwnProperty(ci)){
						if(objs[ci].checked){
							objs[ci].checked = false;
							if(objs[ci].value != 0) checkList.push(queryData[ci]);
						}
						else{
							if(objs[ci].value != 0) savedRemainList.push(queryData[ci]);
							remainList.push(queryData[ci]);
						}
					}
				}
				//console.log('del', checkList, remainList);

				if(checkList.length > 0 || (checkList.length == 0 && remainList.length > 0)){
					let params2 = GX.reductionItemByRows(['ReqSeq','ReqSerl','ItemSeq','UnitSeq','Qty','STDUnitSeq','STDQty'], checkList);
					GX._METHODS_
					.setMethodId('TransReq')
					.ajax([params], params2, [function(data){}, function(data){
						if(data.length == 0) location.replace(location.origin + location.pathname);
						else {
							if(checkList.length == 0){
								checkList = savedRemainList;
								vThis.rows.Query = [];
							} 
							else vThis.rows.Query = remainList;
						}
					}]);
				}
			}
			if(event.type == 'click') event.target.blur();
		},
		del: function(){
			if(confirm('삭제되면 복구할 수 없습니다. 정말 삭제하시겠습니까?')){
				var vThis = this;
				let qryType = (document.querySelectorAll('[name="ReqSerl"]:checked').length > 0) ? 'SheetDelete' : 'MDelete';
				let params = {QryType:qryType};
				let inputData = GX.deepCopy(GX.makeParamByForm(['ReqSeq'])); //참조없는 복사
				if(inputData.ReqSeq != null && inputData.ReqSeq.length == 0) inputData.ReqSeq = '0';
				if(inputData.CompleteWishDate != null) inputData.CompleteWishDate = inputData.CompleteWishDate.replace(/-/g,'');//GX.formatDate(inputData.CompleteWishDate, 'YMD')
				Object.assign(params, inputData);

				let queryData = GX.deepCopy(this.rows.Query);
				let checkList = [];
				let checkUnsavedList = [];
				let checkAllList = [];
				let remainList = [];
				let remainUnsavedList = [];
				let remainAllList = [];
				let MoveData = GX.deepCopy(vThis.rows.MoveData);
				let MovPalletNo = [];
				let InvQtyCnt = [];
				let objs = document.querySelectorAll('[name="ReqSerl"]');
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
							//InvQtyCnt += Number(queryData[ci].InvQty);
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

				// if(checkList.length > 0){
				// 	let params2 = GX.reductionItemByRows(['ReqSeq','ReqSerl','ItemSeq','UnitSeq','Qty','STDUnitSeq','STDQty'], checkList);
				// 	GX._METHODS_
				// 	.setMethodId('TransReq')
				// 	.ajax([params], params2, [function(data){}, function(data){
				// 		vThis.rows.Query = remainAllList;
				// 		vThis.initSelected();
				// 		//console.log();
				// 		if(remainList.length == 0){
				// 			vThis.queryForm.ReqSeq = '';
				// 			vThis.queryForm.ReqNo = '';
				// 			//vThis.queryForm.WHSeq = '';
				// 			vThis.IsRecall = [];
				// 		}
						
				// 	}]);
				// }
				// else {
				// 	vThis.rows.Query = remainAllList;
				// 	vThis.initSelected();
				// }
				
				vThis.rows.Query = remainAllList;
				// vThis.rows.MoveData = MoveData;
				//vThis.QtyData.InvQty = InvQtyCnt;
				vThis.initSelected();

			}
			if(event.type == 'click') event.target.blur();
		},
		scanBarCode: function(){
			var vThis = this;
			let clipboardData = event.clipboardData || window.clipboardData;
			if(clipboardData != null){
				let QRCodeData = clipboardData.getData('Text');
				let activeObjName = '';
				let activeTabIdx = '';
				let isFocused = (document.querySelector('input:focus') != null);
				let isChange = '';
				
				let scannerObj = document.querySelectorAll('[gx-scanner="Y"]');
					
				if(scannerObj.length > 0){
					if(QRCodeData.includes('MO') || QRCodeData.includes('IV')){
						this.init();
						activeObjName = scannerObj[0].name;
						activeTabIdx = scannerObj[0].tabIndex;	
						document.querySelector('[name="ReqNo"]').focus();
						isChange = 'ReqNo';
					} else if(QRCodeData.includes('P') || QRCodeData.includes('R') || QRCodeData.includes('H')){
						activeObjName = scannerObj[1].name;
						activeTabIdx = scannerObj[1].tabIndex;
						document.querySelector('[name="BarCode"]').focus();
						isChange = 'BarCode';
					}
				}

				// if(isFocused) {
				// 	if(event.target.hasAttribute('gx-scanner') && event.target.getAttribute('gx-scanner') == 'Y'){
				// 		activeObjName = event.target.name;
				// 		activeTabIdx = event.target.tabIndex;
				// 		if(event.target.name == 'ReWorkPallet'){
				// 			this.init();
				// 			// document.querySelector('[name="BarCode"]').focus();
				// 			isChange = 'ReWorkPallet';
				// 		}else if(event.target.name == 'InputPallet'){
				// 			isChange = 'InputPallet';
				// 		}
				// 	}
				// }
				// else {
				// 	let scannerObj = document.querySelectorAll('[gx-scanner="Y"]');
					
				// 	if(scannerObj.length > 0){
				// 		if(QRCodeData.includes('R')){
				// 			this.init();
				// 			activeObjName = scannerObj[0].name;
				// 			activeTabIdx = scannerObj[0].tabIndex;	
				// 			// document.querySelector('[name="BarCode"]').focus();
				// 			isChange = 'ReWorkPallet';
				// 		} else if(QRCodeData.includes('P')){
				// 			activeObjName = scannerObj[1].name;
				// 			activeTabIdx = scannerObj[1].tabIndex;
				// 			isChange = 'InputPallet';
				// 		}
				// 	}
				// }
				if(activeObjName.length > 0){
					
					//if(this[activeObjName.capitalizeFirstLetter('L')] != null) this[activeObjName.capitalizeFirstLetter('L')] = QRCodeData;
					if(vThis.queryForm[activeObjName] != null) vThis.queryForm[activeObjName] = QRCodeData;
					
					
					//GX.eventTrigger('[gx-scanner="Y"]:focus', 'change');//2개 있을 때
					//GX.eventTrigger('[gx-scanner="Y"]', 'change');//1개 있을 때
					//GX.eventTrigger('[name="'+activeObjName+'"]', 'change');//1 또는 2개 있을 때

					//GX.TabIndex.next(activeObjName);
					
					if(isChange =='ReqNo'){
						document.querySelector('[name="ReqNo"]').value = QRCodeData.replaceAll(' ','');
						vThis.ReqNoSel();
					}else if(isChange =='BarCode'){
						if(vThis.queryForm.CarNo == ''){
							alert('차량번호를 입력하세요.');
							document.querySelector('[name="BarCode"]').value = '';
						}else{
						document.querySelector('[name="BarCode"]').value = QRCodeData.replaceAll(' ','');
						vThis.BarCodeSel();
						}
					}
				}
				
				event.preventDefault();
			}
		},
		setProduction: function(){
			console.log('setProduction');
			console.log(event.target.value + ' != ' + this.itemData.ItemNo);
			if(event.target.value != this.itemData.ItemNo) {console.log('setProduction1', event.target.value+' != '+this.itemData.ItemNo);
				////////////////////////////////////////////////////////////////////
				var vThis = this;
				let itemNo = (this.itemData.ItemNo != null) ? this.itemData.ItemNo : '';
				
				if(itemNo.length > 0){
					GX._METHODS_
					.setMethodId('Main')
					.ajax([{QryType:'ItemNo', ItemNo:itemNo}], [function(data){
						console.log('ItemNo',data);
						if(data[0].ItemNo != null){
							let itemData = GX.deepCopy(vThis.itemData); //참조없는 복사
							Object.assign(itemData, data[0]);
							vThis.itemData = itemData;
							vThis.itemData.ItemNo = itemNo;
						}
						else {
							vThis.init();// itemData 초기화
						}
	
						/////////////////////////////////// 후처리 시작
						vThis.postProcessingCodeHelp();
						/////////////////////////////////// 후처리 끝
	
					}], true);
					// .ajax([{QryType:'UnitName', ItemNo:itemNo}], [function(data){
					// 	//console.log('UnitName',data);
					// 	if(data[0].UnitSeq != null){
					// 		//console.log(Object.keys(data[0]));
					// 		vThis.rows['UnitName'] = data;
					// 	}
					// 	else {
					// 		vThis.rows['UnitName'] = [];
					// 	}
					// }], false);
				}
				else{
					this.itemData = GX.getInitVueModelByFormDefault(this.itemData);
					this.rows.UnitName = [];
				}
				////////////////////////////////////////////////////////////////////
			}
			else {
				console.log(event.target.value + ' @!= ' + this.itemData.ItemNo);
				this.inputSearchCodeHelp();
			}

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
								if(this.codeHelp[keys[i]] != null) this.codeHelp[keys[i]] = '';
								let comebackObj = document.querySelector('[check-double-click][name="' + keys[i] + '"]');
								console.log(i, keys[i], comebackObj)
								if(comebackObj != null) comebackObj.focus();
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

					params[paramKeyParse[0]] = (this.codeHelp[dataKey] != null) ? this.codeHelp[dataKey] : this.itemData[dataKey];
				}
			}

			// params.QryType = (this.codeHelpQryTypeMapKey[targetName] != null) ? this.codeHelpQryTypeMapKey[targetName] : targetName;//'EmpName';
			params.Gubun = 'IDD_PALLET_OUT';
			params.QryType = 'CarCodeHelp';
			let pageCountObj = document.querySelector('[code-help="'+tempTargetName+'"] [name="PageCount"]');
			let pageSizeObj = document.querySelector('[code-help="'+tempTargetName+'"] [name="PageSize"]');
			if(pageCountObj != null && pageCountObj.value.match(/^[^0]\d*$/) == null) pageCountObj.value = 1;
			params.PageCount = (pageCountObj != null) ? pageCountObj.value : 1;
			params.PageSize = (pageSizeObj != null) ? pageSizeObj.value : 50;

			var vThis = this;
			GX._METHODS_
			.setMethodId('PalOut')
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

						this.queryForm[keyParse[0]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey];
					}
				}


				/////////////////////////////////// 후처리 시작
				this.postProcessingCodeHelp();
				/////////////////////////////////// 후처리 끝

				this.closeCodeHelp(targetName);
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
						console.log(data);
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
		},
		toggle: function(){
			document.getElementsByClassName('toggle-switch')[0].classList.toggle('active');
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
		this.QtyData.ItemName = '품명';
		this.QtyData.TotalQty = '0';
		document.querySelector('[name="ReqNo"]').focus();
	},
	created(){
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			const vThis = this;
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			this.queryForm.MovementDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			//.bodyRow('@click="selectGrid(index); search2(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('PalletNo').head('PalletNo', '')
			.item('InOutTypeName').head('구분', '')
			.item('ReqNo').head('입출번호', '')
			.item('ItemName').head('품명', '')
			.item('ItemNo').head('품번', '')
			.item('WhName').head('위치', '')
			.loadTemplate('#grid', 'rows.Query');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('CarNo').head('차량번호', '')
			.item('CarSeq').head('CarSeq', '')
			.loadTemplate('#grid-carno', 'rows.carNoListQuery');

			if(this.params.QryType != null && this.params.QryType == 'Query') this.search(this.params);

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
	}

});

function responseAppReqNo(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') {
			app.queryForm.ReqNo = result.result;
			// GX.TabIndex.next('ItemNo');
		}
	}
}

function responseAppBarCode(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') {
			app.queryForm.BarCode = result.result;
		}
	}
}
