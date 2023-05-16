var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		convertKeys:{
			WorkHour:'time',
			PalletTotal:'quantity',
			BottleTotal:'quantity',
			PalletOK:'quantity',
			BottleOK:'quantity',
			PalletBad:'quantity',
			BottleBad:'quantity',
			Supply:'quantity',
			WorkCondition4:'quantity',
			Qty:'quantity',
			StdUnitQty:'quantity'
		},
		sheetRow:{
			WorkReportSeq: '0',
			WorkOrderSeq: '0',
			WorkOrderSerl: '0',
			WorkCenterName: '',
			WorkCenterSeq: '0',
			GoodItemName: '',
			GoodItemNo: '',
			GoodItemSpec: '',
			GoodItemSeq: '0',
			AssyItemName: '',
			AssyItemNo: '',
			AssyItemSpec: '0',
			AssyItemSeq: '0',
			ItemBomRevName: '',
			ItemBomRev: '',
			ProcName: '',
			ProcSeq: '0',
			ProcRevName: '',
			ProcRev: '',
			MatItemName: '',
			MatItemNo: '',
			MatItemSpec: '',
			MatItemSeq: '0',
			LotNo: '',
			Qty: '0',
			StdUnitQty: '0',
			MatUnitName: '',
			MatUnitSeq: '0',
			StdUnitName: '',
			StdUnitSeq: '0',
			WorkOrderNo: '',
			OrderQty: '0',
			WorkTypeName: '',
			WorkType: '0',
			ProdUnitName: '',
			ProdUnitSeq: '0',
			RealLotNo: '',
			WorkCondition3: '',
			ProdQty: '0',
			OKQty: '0',
			BadQty: '0',
			StdUnitProdQty: '0',
			StdUnitOKQty: '0',
			StdUnitBadQty: '0',
			WorkStartTime: '',
			WorkEndTime: '',
			ChainGoodsSeq: '0',
			Remark: '',
			IsProcQC: '0',
			IsLastProc: '0',
			WorkHour: '0',
			ProcHour: '0',
			WorkerQty: '0',
			WorkCondition1: '',
			WorkCondition2: '',
			WorkCondition4: '0',
			WorkCondition5: '0',
			WorkCondition6Name: '',
			WorkCondition6: '0',
			WorkCondition7: '0',
			IsPjt: '0',
			PJTSeq: '0',
			WBSSeq: '0',
			SubEtcInSeq: '0'
		},
		rows:{
			'Query':[],
			'wkTeamNameListQuery':[],
			'workCenterNameListQuery':[],
			'goodItemNameListQuery':[],
			'itemBomRevNameListQuery':[],
			'procNameListQuery':[],
			'assyItemNameListQuery':[],
			'procRevNameListQuery':[],
			'lotNoListQuery':[],
			'matItemNameListQuery':[],
			'matUnitNameListQuery':[],
			'totInputQty':[]
		},
		addForm:{
			WorkDate:'',
			WkTeamSeq:'0',
			WkTeamName:'',
			WorkCenterSeq:'0',
			WorkCenterName:'',
			GoodItemSeq:'0',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			ItemBomRev:'0',
			ItemBomRevName:'',
			ProcSeq:'0',
			ProcName:'',
			AssyItemSeq:'0',
			AssyItemName:'',
			AssyItemNo:'',
			ProcRev:'0',
			ProcRevName:'',
			LotSeq:'0',
			LotNo:'',
			MatItemSeq:'0',
			MatItemName:'',
			MatItemNo:'',
			MatUnitSeq:'0',
			MatUnitName:'',
			Qty:'0',

			StdUnitName:'',//기준단위
			StdUnitSeq:'0',//기준단위내부코드
			StdUnitQty:'', //기준수량
		
			WorkReportSeq:'0', //생산실적코드	
			WorkOrderSeq:'0', //작업지시코드
			WorkOrderSerl:'0', //작업지시순번

			Remark:'', //비고
			FactUnit:'', //생산사업장
			DeptSeq:'0', //작업부서코드
			ProdUnitSeq:'0', //생산단위
			IsLastProc:'0', //최종공정여부
			IsProcQC:'0' //공정검사여부
		},
		addForm2:{
			LotNo:'',
			MatItemSeq:'0',
			MatItemName:'',
			MatItemNo:'',
			MatUnitSeq:'0',
			MatUnitName:'',
			Qty:'0',

			StdUnitName:'',//기준단위
			StdUnitSeq:'0',//기준단위내부코드
			StdUnitQty:'', //기준수량
		
			WorkReportSeq:'0', //생산실적코드	
			WorkOrderSeq:'0', //작업지시코드
			WorkOrderSerl:'0', //작업지시순번

			Remark:'', //비고
			FactUnit:'', //생산사업장
			DeptSeq:'0', //작업부서코드
			ProdUnitSeq:'0', //생산단위
			IsLastProc:'0', //최종공정여부
			IsProcQC:'0' //공정검사여부
		},
		codeHelp:{
			WkTeamName:'',
			WorkCenterName:'',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			ItemBomRevName:'',
			ProcName:'',
			AssyItemName:'',
			AssyItemNo:'',
			ProcRevName:'',
			LotNo:'',
			MatItemName:'',
			MatItemNo:'',
			MatUnitName:''
		},
		codeHelpRequest:{
			WkTeamName:['WkTeamName'],
			WorkCenterName:['WorkCenterName'],
			GoodItemName:['GoodItemName'],
			GoodItemNo:['GoodItemNo'],
			GoodItemSpec:['GoodItemSpec'],
			ItemBomRevName:['GoodItemSeq','ItemBomRevName'],
			ProcName:['GoodItemSeq','ProcRev','ProcName'],
			AssyItemName:['AssyItemName'],
			AssyItemNo:['AssyItemNo'],
			ProcRevName:['GoodItemSeq','ProcRevName'],
			//LotNo:['Qty','LotNoMat=LotNo','MatItemSeq'],
			LotNo:['Qty','LotNo','MatItemSeq'],
			MatItemName:['Qty','MatItemName'],
			MatItemNo:['Qty','MatItemNo'],
			MatUnitName:['Qty','MatItemSeq','MatUnitName']
		},
		codeHelpResponse:{
			WkTeamName:['WkTeamSeq','WkTeamName'],
			WorkCenterName:['WorkCenterSeq','WorkCenterName', 'FactUnit'],
			GoodItemName:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemNo:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemSpec:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			ItemBomRevName:['ItemBomRev','ItemBomRevName'],
			ProcName:['ProcSeq','ProcName'],
			AssyItemName:['AssyItemSeq','AssyItemName','AssyItemNo'],
			AssyItemNo:['AssyItemSeq','AssyItemName','AssyItemNo'],
			ProcRevName:['ProcRev','ProcRevName'],
			LotNo:['LotSeq','LotNo', 'MatItemName','MatItemNo','MatItemSeq','MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			//[error] STDUnitName:대소문자 오류StdUnitName
			//[error] STDUnitSeq:대소문자 오류StdUnitSeq
			MatItemName:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			MatItemNo:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			MatUnitName:['MatUnitSeq','MatUnitName','Qty','StdUnitName','StdUnitSeq','StdUnitQty']
		},
		codeHelpDependencyKey:{
			GoodItemNo:'GoodItemName',
			GoodItemSpec:'GoodItemName',
			AssyItemNo:'AssyItemName',
			MatItemNo:'MatItemName'
		},
		codeHelpGroupKey:{
			GoodItemName:'GoodItemNo',
			AssyItemName:'AssyItemNo',
			MatItemName:'MatItemNo'
		},
		codeHelpQryTypeMapKey:{
			LotNo:'LotNoMat'
		},
		isCheckList:[],
		isAllowedCamera: (typeof navigator.getUserMedia == 'function'), // scanner 관련
		isScanning: false, // scanner 관련
		isReadyCamera: false // scanner 관련
	},
	methods:{
		selectAll: function(){
			//console.log("selectAll");
			let obj = document.querySelectorAll('[name="WorkOrderSerl"]');
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

		setJumpInQuery: function(params){
			const vThis = this;
			GX._METHODS_
			.setMethodId('MatInput')
			.ajax([params], [function(data){
				if(data != null && data.length > 0) {
					//data = GX.reductionItemByRows(['Qty','StdUnitQty'], GX.deepCopy(data));
					let formData = GX.reductionItemByRows(Object.keys(vThis.addForm), GX.deepCopy(data));
					if(formData[0].Qty != null) formData[0].Qty = '';//GX.NumberType.quantity(formData[0].Qty);
					if(formData[0].StdUnitQty != null) formData[0].StdUnitQty = GX.NumberType.quantity(formData[0].StdUnitQty);
					if(formData[0].WorkOrderNo != null) formData[0].WorkOrderNo = '';
					if(formData[0].WorkOrderSeq != null) formData[0].WorkOrderSeq = '0';
					if(formData[0].WorkOrderSerl != null) formData[0].WorkOrderSerl = '0';
					if(formData[0].WorkReportSeq != null) formData[0].WorkReportSeq = '0';
					
					// 초기화
					if(formData[0].LotSeq != null) formData[0].LotSeq = '0';
					if(formData[0].LotNo != null) formData[0].LotNo = '';
					if(formData[0].MatItemSeq != null) formData[0].MatItemSeq = '0';
					if(formData[0].MatItemName != null) formData[0].MatItemName = '';
					if(formData[0].MatItemNo != null) formData[0].MatItemNo = '';
					if(formData[0].MatUnitSeq != null) formData[0].MatUnitSeq = '0';
					if(formData[0].MatUnitName != null) formData[0].MatUnitName = '';
					//if(formData[0].Qty != null) formData[0].Qty = '';

					vThis.addForm = formData[0];
					

					for(let di in data){
						if(data.hasOwnProperty(di)){
							data[di].SerialNo = Number(di)+1;
							if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity2(data[di].Qty);
							if(data[di].StdUnitQty != null) data[di].StdUnitQty = GX.NumberType.quantity(data[di].StdUnitQty);
						}
					}

					vThis.rows['Query'] = data;
				}

			}]);

		},


		chageQty: function(){
			var vThis = this;
			let params = {QryType:'Qty'};
			let inputData = GX.deepCopy(GX.makeParamByForm(['Qty','MatItemSeq'])); //참조없는 복사

			if(inputData.Qty.length > 0){
				Object.assign(params, inputData);

				GX._METHODS_
				.setMethodId('Main')
				.ajax([params], [function(data){
					data = GX.reductionItemByRows(['Qty','StdUnitQty'], GX.deepCopy(data));
					if(data != null && data.length > 0) {
						//vThis.addForm.Qty = data[0].Qty;
						//vThis.addForm.StdUnitQty = data[0].StdUnitQty;
						if(data[0].Qty != null) vThis.addForm.Qty = GX.NumberType.quantity2(data[0].Qty);
						if(data[0].StdUnitQty != null) vThis.addForm.StdUnitQty = GX.NumberType.quantity(data[0].StdUnitQty);
					}
				}]);
			}

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

			this.addForm = GX.getInitVueModelByFormDefault(this.addForm);
			GX.initForm('addForm', ['gx-pre-value']);

			if(event.type == 'click') event.target.blur();
		},
		add: function(){
			if(GX.Validation.run('', 'validate')){
				let nowTime = GX.formatDate(GX.nowDate().full, 'H:I');
				let formData = GX.deepCopy(this.addForm); //참조없는 복사
				formData.WorkStartTime = nowTime;
				formData.WorkEndTime = nowTime;

				let sheetData = GX.deepCopy(this.sheetRow); //참조없는 복사
				Object.assign(sheetData, formData);
				for(let i in formData){
					if(formData.hasOwnProperty(i)){
						sheetData.SerialNo = 'A';
						if(i == 'WkTeamSeq') sheetData.WorkCondition6 = formData[i];
						else if(i == 'WkTeamName') sheetData.WorkCondition6Name = formData[i];
						else if(i == 'Qty') sheetData.Qty = GX.NumberType.quantity2(formData[i]);
					}
				}

				this.rows.Query.splice(0, 0, sheetData);
				this.initSelected();

				//if(event.type == 'click') event.target.blur();
				if(event.type == 'click') {
					let initItems = ['LotSeq','LotNo','MatItemSeq','MatItemName','MatItemNo','MatUnitSeq','MatUnitName','Qty'];
					for(let ii in initItems){
						if(initItems.hasOwnProperty(ii)){
							let obj = document.querySelector('[name="'+initItems[ii]+'"]');
							if(obj != null){
								obj.value = obj.getAttribute('gx-default');
								this.addForm[initItems[ii]] = obj.getAttribute('gx-default');
							}
						}
					}

					document.querySelector('[name="LotNo"]').focus();
				}
				this.totalQty();
			}

		},
		save: function(){
			var vThis = this;
			let params = {QryType:'NewSave'};
			let newData = [];
			let queryData = GX.deepCopy(this.rows.Query);
			for(let qi in queryData){
				if(queryData.hasOwnProperty(qi) && String(queryData[qi].WorkOrderSerl) == '0'){
					if(queryData[qi].LotSeq == null) queryData[qi].LotSeq = 0;
					newData.push(Object.assign(params, queryData[qi]));
				}
			}



			if(newData.length > 0){
				GX._METHODS_
				.setMethodId('MatInPut')
				.ajax(newData, [function(data){
					console.log(data);
					//location.replace(location.origin + location.pathname + GX.makeSearch({QryType:'Query', ReqSeq: data[0].ReqSeq}));

					//vThis.search({QryType:'Query', InOutSeq: data[0].InOutSeq});
					if(data != null && data[0] != null){
						let isExist = true;
						if((data[0].Status != null && data[0].Status > 0) || (data[0].Result != null && data[0].Result != '')) {
							isExist = false;
						}

						if(isExist){
							for(var di in data){
								if(data.hasOwnProperty(di)){
									data[di].SerialNo = Number(di)+1;
		
									if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity2(data[di].Qty);
								}
							}
		
							vThis.rows['Query'] = data;
						}

					}


				}]);
			}

			//lot~투입수량 초기화
			this.addForm2 = GX.getInitVueModelByFormDefault(this.addForm2);
			GX.initForm('addForm2', ['gx-pre-value']);

			this.rows.Query = [];
			this.rows.totInputQty = [];

			if(event.type == 'click') event.target.blur();
		},
		del: function(){
			if(confirm('삭제되면 복구할 수 없습니다. 정말 삭제하시겠습니까?')){
				var vThis = this;
				let qryType = (document.querySelectorAll('[name="WorkOrderSerl"]:checked').length > 0) ? 'SheetDelete' : 'MDelete';
				let params = {QryType:qryType};

				let queryData = GX.deepCopy(this.rows.Query);
				let checkList = [];
				let checkUnsavedList = [];
				let checkAllList = [];
				let remainList = [];
				let remainUnsavedList = [];
				let remainAllList = [];
				let objs = document.querySelectorAll('[name="WorkOrderSerl"]');
				for(let ci in objs){
					if(objs.hasOwnProperty(ci)){
						console.log('zz', ci, queryData, queryData[ci])
						Object.assign(queryData[Number(ci)], params);

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
					GX._METHODS_
					.setMethodId('MatInPut')
					.ajax(checkList, [function(data){
						vThis.rows.Query = remainAllList;
						vThis.initSelected();

						if(remainList.length == 0){
							//vThis.queryForm.InOutSeq = '';
							//vThis.queryForm.InOutNo = '';
							//vThis.queryForm.WHSeq = '';
							//vThis.IsRecall = [];
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
		totalQty: function(){
			var vThis = this;
			let params2 = {QryType:'ItemAdd'};
			let inputData = GX.deepCopy(this.rows.Query);
			let params = GX.reductionItemByRows(['WorkingTag','CompanySeq','UserId','QryType','WorkCenterSeq','MatItemSeq','Qty'], inputData);

			for(let ri in params){
				if(params.hasOwnProperty(ri)){
					params[ri].IDX_NO = Number(ri)+1;
					Object.assign(params[ri], params2);
				}
			}

			if(params.length > 0){
				
				//Object.assign(params2, params);

				GX._METHODS_
				.setMethodId('MatInPut')
				.ajax(params, [function(data){
					if(data != null && data.length > 0) {
						
						if(data[0].TotInputQty != null) data[0].TotInputQty = GX.NumberType.quantity2(data[0].TotInputQty);
						if(data[0].TotStockQty != null) data[0].TotStockQty = GX.NumberType.quantity2(data[0].TotStockQty);

						vThis.rows.totInputQty = data;
					}
				}]);
			}
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
					let nextAddIdx = 1;
					if(this.queryForm[activeObjName] != null) {
						this.queryForm[activeObjName] = QRCodeData;
						nextAddIdx = 1;
					}
					else if(this.itemData[activeObjName] != null) {
						this.itemData[activeObjName] = QRCodeData;
						nextAddIdx = 4;
					}

					//GX.eventTrigger('[gx-scanner="Y"]:focus', 'change');//2개 있을 때
					//GX.eventTrigger('[gx-scanner="Y"]', 'change');//1개 있을 때
					//GX.eventTrigger('[name="'+activeObjName+'"]', 'change');//1 또는 2개 있을 때
	
					GX.TabIndex.next(activeObjName);
					event.preventDefault();
				}
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
			if(this.addForm[targetName] != null && this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;

			if(event.type == 'click'){
				if(tempTargetName != targetName && this.codeHelp[tempTargetName] != null) this.setSearchCodeHelp(tempTargetName, ''); //this.codeHelp[tempTargetName] = '';

				for(let i in this.codeHelpDependencyKey) {
					if(this.codeHelpDependencyKey.hasOwnProperty(i) && this.codeHelpDependencyKey[i] == tempTargetName){
						this.setSearchCodeHelp(i, ''); //this.codeHelp[i] = '';
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

					params[paramKeyParse[0]] = (this.codeHelp[dataKey] != null) ? this.codeHelp[dataKey] : this.addForm[dataKey];
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
						//data[di].SerialNo = Number(di)+1;
						data[di].SerialNo = Number(di)+1 + (params.PageSize * (params.PageCount - 1));

						if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity2(data[0].Qty);
					}
				}

				if(isOnePick){
					if(data.length == 1){
						for(let i in keys) {
							if(keys.hasOwnProperty(i)) vThis.addForm[keys[i]] = data[0][keys[i]];
						}

						GX.TabIndex.next2(tempTargetName);
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
			let keys = this.codeHelpResponse[targetName];
			let obj = document.querySelector('#grid-'+(targetName.toLowerCase())+' tbody tr.check');
			if(obj != null) {
				for(let i in keys) {
					if(keys.hasOwnProperty(i)) this.addForm[keys[i]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][keys[i]];
				}

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

			
		if(GX.Cookie.get('WkTeamName') != null && GX.Cookie.get('WkTeamName').length > 0){
			this.addForm.WkTeamName = GX.Cookie.get('WkTeamName');
			this.addForm.WkTeamSeq = GX.Cookie.get('WkTeamSeq');
			//this.addForm.UMWkTypeName = GX.Cookie.get('UMWkTypeName');
			//this.addForm.UMWkType = GX.Cookie.get('UMWkType');
			this.addForm.WorkCenterName = GX.Cookie.get('WorkCenterName');
			this.addForm.WorkCenterSeq = GX.Cookie.get('WorkCenterSeq');
			document.querySelector('[name="GoodItemName"]').focus();
		}

		//JumpInQuery or JumpQuery ???
		if(this.params != null && this.params.QryType == 'JumpInQuery'){
			this.setJumpInQuery(this.params);
			//this.params.QryType
			//this.params.IDX_NO
			//this.params.WorkReportSeq
		}
	},

	created(){
		//if(!GX._METHODS_.isLogin()) location.replace('login.html');
		//else {
			const vThis = this;
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//this.queryForm.CompleteWishDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			this.addForm.WorkDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			document.querySelector('[name="WorkDate"]').setAttribute('gx-default', this.addForm.WorkDate);


			GX.VueGrid
			.bodyRow(':class="{\'check\':isChecked(index)}"')
			.item('WorkOrderSerl', {rowspan:3}).head('<div class="chkBox"><input type="checkbox" @click="selectAll();" /></div>', '')
										.body('<div class="chkBox"><input type="checkbox" name="WorkOrderSerl" :value="row.WorkOrderSerl" @click="selectedMark(index);" /></div>', '')
			.item('SerialNo', {rowspan:3}).head('번호', 'num')
										//.body(null, 'num')
			.item('GoodItemName').head('완성품명', '')
			.item('ItemBomRevName').head('BOM차수', '')
			.item('AssyItemName').head('공정품명', '')
			.item('MatItemName').head('자재명', '')
			.item('LotNo').head('Lot No', '')
			.item('WorkStartTime', {rowspan:3}).head('투입시간', '')
			.nl()
			.item('GoodItemNo').head('완성품번', '')
			.item('ProcName').head('공정', '')
			.item('AssyItemNo').head('공정품번', '')
			.item('MatItemNo').head('자재번호', '')
			.item('MatUnitName').head('투입단위', 'border-r')
			.nl()
			.item('GoodItemSpec').head('완성규격', '')
			.item('ProcRevName').head('공정흐름차수', '')
			.item('AssyItemSpec').head('공정규격', '')
			.item('MatItemSpec').head('자재규격', '')
			.item('Qty').head('투입수량', 'border-r')
			.loadTemplate('#grid', 'rows.Query');
			//if(this.params.QryType != null && this.params.QryType == 'Query') this.search(this.params);

			// select box에 scannr enter evnet 막기 시작 /////////////
			GX.SelectBoxEnterPrevention.init();
			// select box에 scannr enter evnet 막기 끝 /////////////

			// 스캐너 입력이 하나인 경우 포커스 없이도 해당 스캔 입력박스에 스캔값 입력처리를 위한 이벤트
			document.body.addEventListener('paste', this.scanBarCode, false);

			// 다음 입력창 이동을 위한 tab index 부여 시작 /////////////
			GX.TabIndex.indexing(['GoodItemName','LotNo','Qty','MatUnitName']);
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
			.bodyRow('')
			.item('TotInputQty').head('총투입수량', '')
			.item('TotStockQty').head('재고수량', '')
			.loadTemplate('#grid-totinputqty', 'rows.totInputQty');

			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('WkTeamName').head('근무조', '')
			.item('WkTeamSeq').head('근무조내부코드', '')
			.loadTemplate('#grid-wkteamname', 'rows.wkTeamNameListQuery');
			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('WorkCenterName').head('워크센터', '')
			.item('WorkCenterSeq').head('워크센터내부코드', '')
			.item('FactUnitName').head('생산사업장', '')
			.item('FactUnit').head('생산사업장내부코드', '')
			.loadTemplate('#grid-workcentername', 'rows.workCenterNameListQuery');
					
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('GoodItemName').head('완성품명', '')
			.item('GoodItemNo').head('완성품번', '')
			//.item('GoodItemSpec').head('완성품규격', '')
			.item('GoodItemSeq').head('완성품내부코드', '')
			//.item('ItemBomRev').head('BOM차수코드', '')
			//.item('ItemBomRevName').head('BOM차수명', '')
			.item('BOMRevName').head('BOM차수', '')
			//.item('ProcRev').head('공정차수코드', '')
			//.item('ProcRevName').head('공정차수명', '')
			//.item('ProdUnitName').head('생산단위', '')
			//.item('ProdUnitSeq').head('생산단위내부코드', '')
			.loadTemplate('#grid-gooditemname', 'rows.goodItemNameListQuery');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('ItemBomRevName').head('BOM차수', '')
			.item('ItemBomRev').head('BOM차수코드', '')
			.loadTemplate('#grid-itembomrevname', 'rows.itemBomRevNameListQuery');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('ProcName').head('공정', '')
			.item('ProcSeq').head('공정내부코드', '')
			.item('IsProcQC').head('공정검사여부', '')
			.item('IsLastProc').head('최종검사여부', '')
			.item('ProdUnitName').head('생산단위', '')
			.item('ProdUnitSeq').head('생산단위내부코드', '')
			.item('AssyItemName').head('공정품명', '')
			.item('AssyItemNo').head('공정품번', '')
			.item('AssyItemSpec').head('공정품규격', '')
			.item('AssyItemSeq').head('공정품내부코드', '')
			.loadTemplate('#grid-procname', 'rows.procNameListQuery');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('AssyItemName').head('공정품명', '')
			.item('AssyItemNo').head('공정품번', '')
			.item('AssyItemSeq').head('공정품내부코드', '')
			.loadTemplate('#grid-assyitemname', 'rows.assyItemNameListQuery');
			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('ProcRevName').head('공정흐름차수', '')
			.item('ProcRev').head('공정흐름차수코드', '')
			.loadTemplate('#grid-procrevname', 'rows.procRevNameListQuery');

						
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('LotNo').head('LotNo', '')
			.item('LotSeq').head('LotSeq', '')
			.item('MatItemName').head('자재명', '')
			.item('MatItemNo').head('자재번호', '')
			.item('MatItemSpec').head('자재규격', '')
			.item('MatItemSeq').head('자재내부코드', '')
			.item('MatUnitName').head('투입단위', '')
			.item('MatUnitSeq').head('투입단위내부코드', '')
			.item('Qty').head('투입수량', '')
			.item('StdUnitName').head('기준단위', '')
			.item('StdUnitSeq').head('기준단위내부코드', '')
			.item('StdUnitQty').head('기준단위수량', '')
			.loadTemplate('#grid-lotno', 'rows.lotNoListQuery');
			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('MatItemName').head('자재명', '')
			.item('MatItemNo').head('자재번호', '')
			.item('MatItemSpec').head('자재규격', '')
			.item('MatItemSeq').head('자재내부코드', '')
			.item('MatUnitName').head('투입단위', '')
			.item('MatUnitSeq').head('투입단위내부코드', '')
			.item('Qty').head('투입수량', '')
			.item('StdUnitName').head('기준단위', '')
			.item('StdUnitSeq').head('기준단위내부코드', '')
			.item('StdUnitQty').head('기준단위수량', '')
			.loadTemplate('#grid-matitemname', 'rows.matItemNameListQuery');
			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('MatUnitName').head('투입단위', '')
			.item('MatUnitSeq').head('투입단위내부코드', '')
			.item('StdUnitName').head('기준단위', '')
			.item('StdUnitSeq').head('기준단위내부코드', '')
			.item('Qty').head('투입수량', '')
			.item('StdUnitQty').head('기준단위수량', '')
			.loadTemplate('#grid-matunitname', 'rows.matUnitNameListQuery');

			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		//}
	}

});

function responseAppLotNo(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') {
			app.addForm.LotNo = result.result;
			GX.TabIndex.next('LotNo');
		}
	}
}
