var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		rows:{
			'ListQuery':[],
			'ListQuery2':[]
		},
		listQueryForm:{
			InOutDateFr:'',
			InOutDateTo:'',
			ReqDeptName:'',
			ReqEmpName:''
		},

		startDatetime:'',
		isCheckList:[]
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


		
		selectGrid: function(index){
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




		inputDateDirectPrevention: function() {
			GX.Calendar.selectMode();
		},
		inputDateCalendar: function() {
			GX.Calendar.open(event.target.name);


		},
		init: function(){
			this.listQueryForm = GX.getInitVueModelByFormDefault(this.listQueryForm);
			GX.initForm('queryForm');

			if(event.type == 'click') event.target.blur();
		},
		search: function(){
			let params = GX.deepCopy(this.listQueryForm);
			params.QryType = 'SS1Query';
			params.InOutDateFr = (params.InOutDateFr.length > 0) ? GX.formatDate(params.InOutDateFr, 'YMD') : '';
			params.InOutDateTo = (params.InOutDateTo.length > 0) ? GX.formatDate(params.InOutDateTo, 'YMD') : '';
			const vThis = this;
			GX._METHODS_
			.setMethodId('MoveMat')
			.ajax([params], [function(data){
				//grid check class 초기화
				let checkedGridRowObj = document.querySelector('#grid tr[class="check"]');
				if(checkedGridRowObj != null) checkedGridRowObj.className = '';

				for(let di in data){
					if(data.hasOwnProperty(di)){
						data[di].SerialNo = Number(di)+1;
					}
				}

				vThis.rows['ListQuery'] = data;

				//grid2 데이터 초기화
				vThis.initSelected();
				vThis.rows['ListQuery2'] = [];

			}]);

			if(event.type == 'click') event.target.blur();
		},
		search2: function(idx){
			let params = GX.deepCopy(this.rows.ListQuery[idx]);
			params.QryType = 'SS2Query';
			if(params.OutWHSeq == null || String(params.OutWHSeq).length == 0) params.OutWHSeq = '0';
			if(params.InWHSeq == null || String(params.InWHSeq).length == 0) params.InWHSeq = '0';

			const vThis = this;

			GX.doubleClickRun(event.target, function(){
				vThis.initSelected();
				GX._METHODS_
				.setMethodId('MoveMat')
				.ajax([params], [function(data){
					for(let di in data){
						if(data.hasOwnProperty(di)){
							data[di].SerialNo = Number(di)+1;
						}
					}
	
					vThis.rows['ListQuery2'] = data;
				}]);
			});

			if(event.type == 'click') event.target.blur();
		},
		process: function(index){
			//console.log('index='+index);
			var vThis = this;
			let queryData = GX.deepCopy(this.rows.ListQuery2);
			let params = [{InOutSeq: queryData[index].InOutSeq, QryType:'JumpMove'}];

			GX.doubleClickRun(event.target, function(){
				GX._METHODS_
				.setMethodId('MoveMat')
				.ajax(params, [function(data){
					console.log(data);
					if(data.length >= 1 && data[0].Result == null){
						data[0].QryType = 'MoveQuery';
						location.href = GX.makeBaseUrl('/rawMaterialsMovementProcess.html') + GX.makeQueryString(data[0]);
					}		
				}]);
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
			.bodyRow('@click="selectGrid(index); search2(index);"')
			.item('SerialNo').head('번호')
			.item('InOutDate').head('이동일')
			.item('OutWHName').head('출고창고', '')
			.item('InWHName').head('입고창고', '')
			.item('EmpName').head('담당자', '')
			.loadTemplate('#grid', 'rows.ListQuery');


			GX.VueGrid
			.init()
			.bodyRow('@click="checkedMark(index); process(index);" :class="{\'check\':isChecked(index)}"')
			.item('SerialNo', {rowspan:2}).head('<input type="checkbox" @click="selectAll();" style="display:none;" />번호', 'num')
										.body('<input type="checkbox" name="SerialNo" :value="row.SerialNo" @click="selectedMark(index);" style="display:none;" />{{row.SerialNo}}', '')
			.item('LotNo', {rowspan:2}).head('Lot No', 'num')
			.item('ItemNo').head('품번', '')
							//.body(null, 'item_num')
			.item('Spec').head('규격', '')
			.item('UnitName').head('단위', '')
			.item('ReqDeptName').head('처리부서', '')
			.nl()
			.item('ItemName').head('품명', '')
			.item('InOutDate').head('이동일', '')
			.item('Qty').head('이동량', '')
			.item('ReqEmpName').head('처리자', '')
			.loadTemplate('#grid2', 'rows.ListQuery2');


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
