var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		rows:{
			ListQuery:[],
			empNameListQuery:[],
			wkTeamNameListQuery:[],
			deptNameListQuery:[],
			workCenterNameListQuery:[],
			procNameListQuery:[],
			lotNoListQuery:[],
			goodItemNameListQuery:[],
			assyItemNameListQuery:[],
			matItemNameListQuery:[]
		},
		listQueryForm:{
			WorkDateFr:'',
			WorkDateTo:'',
			DeptName:'',
			DeptSeq:'0',
			WkTeamName:'',
			WkTeamSeq:'0',
			EmpName:'',
			EmpSeq:'0',
			WorkCenterName:'',
			WorkCenterSeq:'0',
			ProcName:'',
			ProcSeq:'0',
			LotNo:'',
			LotSeq:'0',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			GoodItemSeq:'0',
			AssyItemName:'',
			AssyItemNo:'',
			AssyItemSpec:'',
			AssyItemSeq:'0',
			MatItemName:'',
			MatItemNo:'',
			MatItemSpec:'',
			MatItemSeq:'0',

			ProcRev:''

		},
		codeHelp:{
			DeptName:'',
			WkTeamName:'',
			EmpName:'',
			WorkCenterName:'',
			ProcName:'',
			LotNo:'',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			AssyItemName:'',
			AssyItemNo:'',
			AssyItemSpec:'',
			MatItemName:'',
			MatItemNo:'',
			MatItemSpec:''
		},
		codeHelpRequest:{
			DeptName:['DeptName'],
			WkTeamName:['WkTeamName'],
			EmpName:['EmpName'],
			WorkCenterName:['WorkCenterName'],
			ProcName:['GoodItemSeq','ProcRev','ProcName'],
			LotNo:['LotNo'],
			GoodItemName:['GoodItemName'],
			GoodItemNo:['GoodItemNo'],
			GoodItemSpec:['GoodItemSpec'],
			AssyItemName:['AssyItemName'],
			AssyItemNo:['AssyItemNo'],
			AssyItemSpec:['AssyItemSpec'],
			MatItemName:['Qty','MatItemName'],
			MatItemNo:['Qty','MatItemNo'],
			MatItemSpec:['Qty','MatItemSpec']
		},
		codeHelpResponse:{			
			DeptName:['DeptName','DeptSeq'],
			WkTeamName:['WkTeamName','WkTeamSeq'],
			EmpName:['EmpName','EmpSeq'],
			WorkCenterName:['WorkCenterName','WorkCenterSeq'],
			ProcName:['ProcName','ProcSeq','AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec'],
			LotNo:['LotNo'],//LotSeq
			GoodItemName:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemNo:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemSpec:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			AssyItemName:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec'],

			AssyItemNo:['AssyItemNo'],
			AssyItemSpec:['AssyItemSpec'],
			MatItemName:['MatItemName','MatItemNo','MatItemSpec','MatItemSeq','MatUnitName','MatUnitSeq','Qty','STDUnitName','STDUnitSeq','STDUnitQty'],
			MatItemNo:['MatItemName','MatItemNo','MatItemSpec','MatItemSeq','MatUnitName','MatUnitSeq','Qty','STDUnitName','STDUnitSeq','STDUnitQty'],
			MatItemSpec:['MatItemName','MatItemNo','MatItemSpec','MatItemSeq','MatUnitName','MatUnitSeq','Qty','STDUnitName','STDUnitSeq','STDUnitQty']
		},
		codeHelpDependencyKey:{
			GoodItemNo:'GoodItemName',
			GoodItemSpec:'GoodItemName',
			AssyItemNo:'AssyItemName',
			AssyItemSpec:'AssyItemName',
			MatItemNo:'MatItemName',
			MatItemSpec:'MatItemName'
		},
		codeHelpGroupKey:{
			GoodItemName:'GoodItemNo',
			AssyItemName:'AssyItemNo',
			MatItemName:'MatItemNo'
		},
		codeHelpQryTypeMapKey:{
			//LotNo:'LotNoMat'
		},
		isCheckList:[],
		isAllowedCamera: (typeof navigator.getUserMedia == 'function'), // scanner 관련
		isScanning: false, // scanner 관련
		isReadyCamera: false // scanner 관련
	},
	methods:{
		selectAll: function(){
			//console.log("selectAll");
			let obj = document.querySelectorAll('[name="SerialNo"]');
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
		checkedMark: function(index){
			let isCheckList = [];
			let objs = document.querySelectorAll('tbody [type="checkbox"]');
			for(let i in objs){
				if(objs.hasOwnProperty(i)) {
					objs[i].checked = (Number(i) == index);
					if(objs[i].checked) isCheckList.push(Number(i));
				}
			}
			this.isCheckList = isCheckList;
		},
		selectedMark: function(index){
			let idx = this.isCheckList.indexOf(index);
			if(event.target.checked) this.isCheckList.push(index);
			else if(idx != -1) this.isCheckList.splice(idx, 1);
		},
		init: function(){
			this.listQueryForm = GX.getInitVueModelByFormDefault(this.listQueryForm);
			GX.initForm('queryForm');

			if(event.type == 'click') event.target.blur();
		},
		search: function(){
			let params = GX.deepCopy(this.listQueryForm);
			params.QryType = 'Query';
			params.WorkDateFr = (params.WorkDateFr.length > 0) ? GX.formatDate(params.WorkDateFr, 'YMD') : '';
			params.WorkDateTo = (params.WorkDateTo.length > 0) ? GX.formatDate(params.WorkDateTo, 'YMD') : '';

			var vThis = this;
			GX._METHODS_
			.setMethodId('ReportInPut')
			.ajax([params], [function(data){
				for(var di in data){
					if(data.hasOwnProperty(di)){
						data[di].SerialNo = Number(di)+1;
						if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity2(data[di].Qty);
					}
					
					
				}

				vThis.rows['ListQuery'] = data;
			}]);

			if(event.type == 'click') event.target.blur();
		},
		process: function(index){
			const vThis = this;

			this.checkedMark(index);

			GX.doubleClickRun(event.target, function(){
				
				let queryData = GX.deepCopy(vThis.rows.ListQuery);

				if(queryData[index] != null){
					let params = {QryType:'SS1Db'};
					params.WorkReportSeq = queryData[index].WorkReportSeq;
					location.href = GX.makeBaseUrl('/materialsInput.html') + GX.makeQueryString(params);
				}
			});
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
					if(this.listQueryForm[activeObjName] != null) this.listQueryForm[activeObjName] = QRCodeData;

					//GX.eventTrigger('[gx-scanner="Y"]:focus', 'change');//2개 있을 때
					//GX.eventTrigger('[gx-scanner="Y"]', 'change');//1개 있을 때
					GX.eventTrigger('[name="'+activeObjName+'"]', 'change');//1 또는 2개 있을 때

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
		},
		focusCodeHelp: function(targetName){
			let tempTargetName = (this.codeHelpDependencyKey[targetName] != null) ? this.codeHelpDependencyKey[targetName] : targetName;
			if(this.listQueryForm[targetName] != null && this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;//this.setSearchCodeHelp(tempTargetName, ''); //this.codeHelpGroupKey[tempTargetName] = targetName;

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

					params[paramKeyParse[0]] = (this.codeHelp[dataKey] != null) ? this.codeHelp[dataKey] : this.listQueryForm[dataKey];
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
							if(keys.hasOwnProperty(i)) vThis.listQueryForm[keys[i]] = data[0][keys[i]];
						}
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
					if(keys.hasOwnProperty(i)) this.listQueryForm[keys[i]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][keys[i]];
				}

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
	},

	created(){
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			const vThis = this;
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');

			GX.VueGrid
			.bodyRow('@click="process(index);" :class="{\'check\':isChecked(index)}"')
			.item('SerialNo', {rowspan:3}).head('<input type="checkbox" @click="selectAll();" style="display:none;" />번호', 'num')
										.body('<input type="checkbox" name="SerialNo" :value="row.SerialNo" @click="selectedMark(index);" style="display:none;" />{{row.SerialNo}}', '')		
			.item('GoodItemName').head('완성품명', '')
			.item('ItemBomRevName').head('BOM차수', '')
			.item('AssyItemName').head('공정품명', '')
			.item('MatItemName').head('자재명', '')
			.item('LotNo').head('Lot No', '')
			.nl()
			.item('GoodItemNo').head('완성품번', '')
			.item('ProcName').head('공정', '')
			.item('AssyItemNo').head('공정품번', '')
			.item('MatItemNo').head('자재번호', '')
			.item('MatUnitName').head('투입단위', '')
			.nl()
			.item('GoodItemSpec').head('완성규격', '')
			.item('ProcRevName').head('공정흐름차수', '')
			.item('AssyItemSpec').head('공정규격', '')
			.item('MatItemSpec').head('자재규격', '')
			.item('Qty').head('투입수량', '')
			.loadTemplate('#grid', 'rows.ListQuery');


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

			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('EmpName').head('사원', '')
			.item('EmpSeq').head('사원내부코드', '')
			.loadTemplate('#grid-empname', 'rows.empNameListQuery');
			
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
			.item('DeptName').head('부서', '')
			.item('WkTeamSeq').head('부서내부코드', '')
			.loadTemplate('#grid-deptname', 'rows.deptNameListQuery');
			
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
			.item('LotNo').head('LotNo', '')
			.item('ItemName').head('품명', '')
			.item('ItemNo').head('품번', '')
			.item('Spec').head('규격', '')
			.item('ItemSeq').head('품목내부코드', '')
			.loadTemplate('#grid-lotno', 'rows.lotNoListQuery');
			

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('GoodItemName').head('완성품명', '')
			.item('GoodItemNo').head('완성품번', '')
			// .item('GoodItemSpec').head('완성품규격', '')
			.item('GoodItemSeq').head('완성품내부코드', '')
			// .item('ItemBomRev').head('BOM차수코드', '')
			// .item('ItemBomRevName').head('BOM차수명', '')
			.item('BOMRevName').head('BOM차수', '')
			// .item('ProcRev').head('공정차수코드', '')
			// .item('ProcRevName').head('공정차수명', '')
			// .item('ProdUnitName').head('생산단위', '')
			// .item('ProdUnitSeq').head('생산단위내부코드', '')
			.loadTemplate('#grid-gooditemname', 'rows.goodItemNameListQuery');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('AssyItemName').head('공정품명', '')
			.item('AssyItemNo').head('공정품번', '')
			.item('AssyItemSpec').head('공정품규격', '')
			.item('AssyItemSeq').head('공정품내부코드', '')
			.loadTemplate('#grid-assyitemname', 'rows.assyItemNameListQuery');

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
			

			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});

function responseAppLotNo(action, result){
	if(action == 'QRCodeScanner'){ // scanner 관련
		if(typeof result == 'object' && result.param == 'once') {
			app.listQueryForm.LotNo = result.result;
			GX.TabIndex.next('LotNo');
		}
	}
}
