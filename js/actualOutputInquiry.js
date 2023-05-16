var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		rows:{
			'ListQuery':[],
			'wkTeamNameListQuery':[],
			'workCenterNameListQuery':[],
			'goodItemNameListQuery':[],
			'itemBomRevNameListQuery':[],
			'procNameListQuery':[],
			'assyItemNameListQuery':[],
			'procRevNameListQuery':[],
			'matItemNameListQuery':[],
			'empNameListQuery':[]
		},
		convertKeys:{
			WorkHour:'time',
			PalletTotal:'quantity',
			BottleTotal:'quantity',
			PalletOK:'quantity',
			BottleOK:'quantity',
			PalletBad:'quantity',
			BottleBad:'quantity',
			Supply:'quantity',
			WorkCondition4:'quantity'
		},
		listQueryForm:{
			WorkDateFr:'',
			WorkDateTo:'',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',//hidden:화면에 없어도 코드도움 조회 입력항목이 있어서 추가해줘야 코드도움 정상동작 함.
			AssyItemName:'',
			AssyItemNo:'',
			WorkCenterName:'',
			ProcName:'',
			EmpName:'',
			WkTeamName:'',
			GoodItemSeq:'0',
			AssyItemSeq:'0',
			WorkCenterSeq:'0',
			ProcSeq:'0',
			EmpSeq:'0',
			WkTeamSeq:'0'
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
			MatItemName:'',
			MatItemNo:'',
			EmpName:''
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
			MatItemName:['Qty','MatItemName'],
			MatItemNo:['Qty','MatItemNo'],
			EmpName:['EmpName']
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
			MatItemName:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			MatItemNo:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			EmpName:['EmpSeq','EmpName']
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
		},
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

		init: function(){
			this.listQueryForm = GX.getInitVueModelByFormDefault(this.listQueryForm);
			GX.initForm('queryForm');

			if(event.type == 'click') event.target.blur();
		},
		search: function(){
			this.initSelected();
			const vThis = this;
			let params = GX.deepCopy(this.listQueryForm);
			params.QryType = 'Query';
			params.WorkDateFr = (params.WorkDateFr.length > 0) ? GX.formatDate(params.WorkDateFr, 'YMD') : '';
			params.WorkDateTo = (params.WorkDateTo.length > 0) ? GX.formatDate(params.WorkDateTo, 'YMD') : '';

			GX._METHODS_
			.setMethodId('WorkReportLine')
			.ajax([params], [function(data){
				for(var di in data){
					if(data.hasOwnProperty(di)){
						data[di].SerialNo = Number(di)+1;
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
					let goUrl = '';
					if(Number(queryData[index].PgmSeq) == 92820503) goUrl = '/actualInjectionProcess.html';
					else if(Number(queryData[index].PgmSeq) == 92820464) goUrl = '/actualOutputProcess.html';
					
					if(goUrl.length > 0){
						let params = {QryType:'JumpOut'};
						params.WorkReportSeq = queryData[index].WorkReportSeq;
						location.href = GX.makeBaseUrl(goUrl) + GX.makeQueryString(params);
					}
				}
			});
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
			if(this.listQueryForm[targetName] != null && this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;

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

						this.listQueryForm[keyParse[0]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey];
					}
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

		GX.NumberType.init(GX._DATAS_.convertRules);

		GX.InValidInputTimePrevention.init();
	},

	created(){
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			const vThis = this;
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//if(this.params.QryType != null && this.params.QryType == 'Query') this.search(this.params);

			// select box에 scannr enter evnet 막기 시작 /////////////
			GX.SelectBoxEnterPrevention.init();
			// select box에 scannr enter evnet 막기 끝 /////////////

			// 스캐너 입력이 하나인 경우 포커스 없이도 해당 스캔 입력박스에 스캔값 입력처리를 위한 이벤트
			//document.body.addEventListener('paste', this.scanBarCode, false);

			// 다음 입력창 이동을 위한 tab index 부여 시작 /////////////
			GX.TabIndex.indexing();
			// 다음 입력창 이동을 위한 tab index 부여 끝 /////////////


			GX.VueGrid
			.bodyRow('@click="process(index);" :class="{\'check\':isChecked(index)}"')
			.item('SerialNo', {rowspan:3}).head('<input type="checkbox" @click="selectAll();" style="display:none;" />번호', 'num')
										.body('<input type="checkbox" name="SerialNo" :value="row.SerialNo" @click="selectedMark(index);" style="display:none;" />{{row.SerialNo}}', '')		
			.item('GoodItemName').head('완성품명', '')
			.item('ItemBomRevName').head('BOM차수', '')
			.item('AssyItemName').head('공정품명', '')
			.item('WkTeamName').head('근무조', '')
			.item('EmpName').head('작업자', '')
			.nl()
			.item('GoodItemNo').head('완성품번', '')
			.item('ProcName').head('공정', '')
			.item('AssyItemNo').head('공정품번', '')
			.item('ProdUnitName').head('생산단위', '')
			.item('WorkStartTime').head('작업시작', '')
			.nl()
			.item('GoodItemSpec').head('완성규격', '')
			.item('ProcRevName').head('공정흐름차수', '')
			.item('AssyItemSpec').head('공정규격', '')
			.item('ProdQty').head('생산수량', '')
			.item('WorkEndTime').head('작업종료시간', '')
			.loadTemplate('#grid', 'rows.ListQuery');
			
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
			.item('EmpName').head('사원', '')
			.item('EmpSeq').head('사원내부코드', '')
			.loadTemplate('#grid-empname', 'rows.empNameListQuery');

			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}

		}
	}

});

