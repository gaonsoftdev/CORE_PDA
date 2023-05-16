var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		rows:{
			'ListQuery':[],
			'ListQuery2':[],
			'empNameListQuery':[],
			'wkTeamNameListQuery':[],
			'toolNameListQuery':[],
			'uMNonWorkTypeLNameListQuery':[],
			'uMNonWorkTypeSNameListQuery':[],
			'workCenterNameListQuery':[],
			'goodItemNameListQuery':[],
			'itemNameListQuery':[]
			
		},
		listQueryForm:{
			WorkDateFr:'',
			WorkDateTo:'',
			NonWorkDateFr:'',
			NonWorkDateTo:'',
			WkTeamName:'',
			WkTeamSeq:'0',
			EmpName:'',
			EmpSeq:'0',
			ToolName:'',
			ToolNo:'',
			ToolSeq:'0',
			UMNonWorkTypeLName:'',
			UMNonWorkTypeLSeq:'0',
			UMNonWorkTypeSName:'',
			UMNonWorkTypeSSeq:'0',
			WorkCenterName:'',
			WorkCenterSeq:'0',
			GoodItemName:'',
			GoodItemNo:'',//hidden
			GoodItemSeq:'0',//hidden
			ItemName:'',
			ItemNo:'',
			ItemSeq:'0'

		},
		codeHelp:{
			EmpName:'',
			WkTeamName:'',
			ToolName:'',
			ToolNo:'',
			UMNonWorkTypeLName:'',
			UMNonWorkTypeSName:'',
			WorkCenterName:'',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			ItemName:'',
			ItemNo:''

		},
		codeHelpRequest:{},
		codeHelpResponse:{
			EmpName:['EmpSeq','EmpName'],
			WkTeamName:['WkTeamSeq','WkTeamName'],
			ToolName:['ToolSeq','ToolName','ToolNo'],
			ToolNo:['ToolSeq','ToolName','ToolNo'],
			UMNonWorkTypeLName:['UMNonWorkTypeL','UMNonWorkTypeLName'],
			UMNonWorkTypeSName:['UMNonWorkTypeS','UMNonWorkTypeSName'],
			WorkCenterName:['WorkCenterSeq','WorkCenterName'],
			//GoodItemName:['GoodItemSeq','GoodItemName'],//응답이 하나면 코드도움이 여러개여도 상관이 없음, listQueryForm hidden 항목 없어도 동작
			//GoodItemNo:['GoodItemSeq','GoodItemName'],//응답이 하나면 코드도움이 여러개여도 상관이 없음, listQueryForm hidden 항목 없어도 동작
			//GoodItemSpec:['GoodItemSeq','GoodItemName'],//응답이 하나면 코드도움이 여러개여도 상관이 없음, listQueryForm hidden 항목 없어도 동작
			GoodItemName:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemSpec:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemSpec:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],			
			ItemName:['ItemSeq','ItemName','ItemNo'],
			ItemNo:['ItemSeq','ItemName','ItemNo']
		},
		codeHelpDependencyKey:{
			ToolNo:'ToolName',
			GoodItemNo:'GoodItemName',
			GoodItemSpec:'GoodItemName',
			ItemNo:'ItemName',
		},
		codeHelpGroupKey:{
			ToolName:'ToolNo',
			GoodItemName:'GoodItemNo',
			ItemName:'ItemNo'
		},
		codeHelpQryTypeMapKey:{},
		isClickItem:-1,
		selectedFirstSheetIndex:-1
	},
	methods:{
		init: function(){
			this.listQueryForm = GX.getInitVueModelByFormDefault(this.listQueryForm);
			GX.initForm('queryForm');

			if(event.type == 'click') event.target.blur();
		},
		search: function(){
			let params = GX.deepCopy(this.listQueryForm);
			let paramList = GX.reductionItemByRows(['WorkDateFr','WorkDateTo','NonWorkDateFr','NonWorkDateTo','WkTeamSeq','EmpSeq','ToolSeq','UMNonWorkTypeLSeq','UMNonWorkTypeSSeq','WorkCenterSeq','GoodItemSeq','ItemSeq'], [params]);
			params = paramList[0];
			params.QryType = 'ListQuery';
			params.WorkDateFr = (params.WorkDateFr.length > 0) ? GX.formatDate(params.WorkDateFr, 'YMD') : '';
			params.WorkDateTo = (params.WorkDateTo.length > 0) ? GX.formatDate(params.WorkDateTo, 'YMD') : '';
			params.NonWorkDateFr = (params.NonWorkDateFr.length > 0) ? GX.formatDate(params.NonWorkDateFr, 'YMD') : '';
			params.NonWorkDateTo = (params.NonWorkDateTo.length > 0) ? GX.formatDate(params.NonWorkDateTo, 'YMD') : '';

			var vThis = this;
			GX._METHODS_
			.setMethodId('WorkReportNoWork')
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
		search2: function(index){
			const vThis = this;
			this.isClickItem = Number(index);
			this.selectedSheetIndex1 = Number(index);

			let queryData = GX.deepCopy(this.rows.ListQuery);
			if(queryData[index] != null){
				let paramList = GX.reductionItemByRows(['ToolSeq','NonWorkDate','ToolSerl'], [queryData[index]]);
				let params = paramList[0];
				console.log(queryData);
				params.QryType = 'SS2Query';
				GX._METHODS_
				.setMethodId('WorkReportNoWork')
				.ajax([params], [function(data){
					for(let di in data){
						if(data.hasOwnProperty(di)){
							data[di].SerialNo = Number(di)+1;
						}
					}
	
					vThis.rows['ListQuery2'] = data;
				}]);

				GX.doubleClickRun(event.target, function(){
					let queryData2 = GX.deepCopy(vThis.rows.ListQuery);
					let params2 = {QryType:'SS1Db'};
					params2.WorkReportSeq = queryData2[index].WorkReportSeq;
					params2.Serl = queryData2[index].Serl;
					location.href = GX.makeBaseUrl('/stopProcess.html') + GX.makeQueryString(params2);
				});
			}
		},
		process: function(index){
			const vThis = this;

			this.isClickItem = Number(index);

			GX.doubleClickRun(event.target, function(){
				
				//selectedFirstSheetIndex

				let queryData = GX.deepCopy(vThis.rows.ListQuery);

				if(queryData[index] != null){
					let params = {QryType:'SS1Db'};
					params.Seq = queryData[index].Seq;
					location.href = GX.makeBaseUrl('/equipmentDailyReportInput.html') + GX.makeQueryString(params);

					let paramList = GX.reductionItemByRows(['ToolSeq','NonWorkDate','ToolSerl'], [params]);
					params = paramList[0];
					params.QryType = 'SS2Query';
					queryData
					
					params.WorkDateFr = (params.WorkDateFr.length > 0) ? GX.formatDate(params.WorkDateFr, 'YMD') : '';
					params.WorkDateTo = (params.WorkDateTo.length > 0) ? GX.formatDate(params.WorkDateTo, 'YMD') : '';
					params.NonWorkDateFr = (params.NonWorkDateFr.length > 0) ? GX.formatDate(params.NonWorkDateFr, 'YMD') : '';
					params.NonWorkDateTo = (params.NonWorkDateTo.length > 0) ? GX.formatDate(params.NonWorkDateTo, 'YMD') : '';
		
					var vThis = this;
					GX._METHODS_
					.setMethodId('WorkReportNoWork')
					.ajax([params], [function(data){
						for(var di in data){
							if(data.hasOwnProperty(di)){
								data[di].SerialNo = Number(di)+1;
							}
						}
		
						vThis.rows['ListQuery'] = data;
					}]);

				}
			});
		},

		isClicked: function(index){
			return (this.isClickItem == index);
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
				vThis.codeHelp[targetName] = targetValue;
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

					let keys = this.codeHelpResponse[targetName];

					for(let i in keys) {
						if(keys.hasOwnProperty(i)){
							if(this.codeHelp[keys[i]] != null) this.codeHelp[keys[i]] = '';
							let comebackObj = document.querySelector('[check-double-click][name="' + keys[i] + '"]');
							if(comebackObj != null) comebackObj.focus();
						}
					}
				}
			}
		},
		focusCodeHelp: function(targetName){
			let tempTargetName = (this.codeHelpDependencyKey[targetName] != null) ? this.codeHelpDependencyKey[targetName] : targetName;
			if(this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;

			if(event.type == 'click'){
				if(tempTargetName != targetName && this.codeHelp[tempTargetName] != null) this.codeHelp[tempTargetName] = '';

				for(let i in this.codeHelpDependencyKey) {
					if(this.codeHelpDependencyKey.hasOwnProperty(i) && this.codeHelpDependencyKey[i] == tempTargetName){
						this.codeHelp[i] = '';
					} 
				}
			}
		},
		inputSearchCodeHelp: function(){
			this.focusCodeHelp(event.target.name);
			this.codeHelp[event.target.name] = event.target.value;
			this.searchCodeHelp(event.target.name, true);
		},
		searchCodeHelp: function(qryType, isOnePick){
			let keys = this.codeHelpResponse[qryType];
			let tempQryType = (this.codeHelpDependencyKey[qryType] != null) ? this.codeHelpDependencyKey[qryType] : qryType;

			//let targetName = (this.codeHelpDependencyKey[tempQryType] != null) ? this.codeHelpDependencyKey[event.target.name] : event.target.name;
			if(this.codeHelpGroupKey[tempQryType] != null) qryType = this.codeHelpGroupKey[tempQryType];

			let obj = document.querySelector('#grid-'+(tempQryType.toLowerCase())+' tbody tr.check');
			if(obj != null) obj.className = '';

			let params = {};
			//if(this.codeHelp[qryType] != null) params[qryType] = this.codeHelp[qryType];
			if(this.codeHelpRequest[qryType] == null) this.codeHelpRequest[qryType] = [qryType];

			let paramKeyParse = [];
			let dataKey = '';
			for(let i in this.codeHelpRequest[qryType]){
				if(this.codeHelpRequest[qryType].hasOwnProperty(i)){
					paramKeyParse = this.codeHelpRequest[qryType][i].split('=');
					dataKey = (paramKeyParse.length == 2) ? paramKeyParse[1] : paramKeyParse[0];

					params[paramKeyParse[0]] = (this.codeHelp[dataKey] != null) ? this.codeHelp[dataKey] : this.listQueryForm[dataKey];
				}
			}


			params.QryType = qryType;//'EmpName';

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
					else if(data.length > 1) vThis.showCodeHelp(tempQryType);
				}

				vThis.rows[tempQryType.capitalizeFirstLetter('L') + 'ListQuery'] = (data.length == 0 || (data[0].Status != null && String(data[0].Status).length > 0)) ? [] : data; //empNameListQuery
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
		selectedApplyCodeHelp: function(qryType){
			let keys = this.codeHelpResponse[qryType];
			let obj = document.querySelector('#grid-'+(qryType.toLowerCase())+' tbody tr.check');
			if(obj != null) {
				for(let i in keys) {
					if(keys.hasOwnProperty(i)) this.listQueryForm[keys[i]] = this.rows[qryType.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][keys[i]];
				}

				this.closeCodeHelp(qryType);
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

	},

	created(){
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//this.queryForm.CompleteWishDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			
			//var p = (GX.getParameters().p != null) ? GX.getParameters().p : 1;
			//console.log('seeeeeeeeeeeesssssssss',GX.getParameters().sa)

			var vThis = this;

			GX.VueGrid
			.bodyRow('@click="search2(index);" :class="{\'check\':isClicked(index)}"')
			.item('SerialNo', {rowspan:5}).head('번호', 'num')
										//.body(null, 'num')
			.item('WorkDate').head('비가동일', '')
							//.body(null, 'item_num')
			.item('UMNonWorkTypeLName').head('중단구분', '')
			.item('UMNonWorkTypeSName', {colspan:2}).head('중단코드', '')
			.nl()
			.item('NonWorkDate').head('수리일자', '')
			.item('WorkStartTime').head('수리시작시간', '')
			.item('WorkEndTime').head('수리종료시간', '')
			.item('NonWorkHour').head('수리시간', '')
			.nl()
			.item('ToolName', {colspan:2}).head('설비명', '')
			.item('ToolNo', {colspan:2}).head('설비번호', '')
			.nl()
			.item('Remark', {colspan:4}).head('고장원인', '')
			.nl()
			.item('ActRemark', {colspan:4}).head('수리내역', '')
			.loadTemplate('#grid', 'rows.ListQuery');


			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('ItemName').head('소요예비품명', '')
			.item('ItemNo').head('소요예비품번호', '')
			.item('UnitName').head('단위', '')
			.item('Qty').head('수량', '')
			.loadTemplate('#grid2', 'rows.ListQuery2');

			//if(this.params.QryType != null && this.params.QryType == 'ListQuery') this.search(this.params);

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
			.item('ToolName').head('금형명', '')
			.item('ToolNo').head('금형번호', '')
			.item('Spec').head('규격', '')
			.item('ToolSeq').head('금형내부코드', '')
			.item('UMToolKindName').head('설비종류', '')
			.item('PrePlace').head('현재위치', '')
			.item('SMStatusName').head('상태', '')
			.loadTemplate('#grid-toolname', 'rows.toolNameListQuery');

			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('UMNonWorkTypeLName').head('중단구분', '')
			.item('UMNonWorkTypeL').head('중단구분내부코드', '')
			.loadTemplate('#grid-umnonworktypelname', 'rows.uMNonWorkTypeLNameListQuery');
			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('UMNonWorkTypeSName').head('중단코드', '')
			.item('UMNonWorkTypeS').head('중단코드내부코드', '')
			.loadTemplate('#grid-umnonworktypesname', 'rows.uMNonWorkTypeSNameListQuery');

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
			.item('ItemName').head('품명', '')
			.item('ItemNo').head('품번', '')
			.item('Spec').head('규격', '')
			.item('ItemSeq').head('품목내부코드', '')
			.item('AssetName').head('자산분류', '')
			.item('ItemClassLName').head('대분류', '')
			.item('ItemClassMName').head('중분류', '')
			.item('ItemClassName').head('소분류', '')
			.loadTemplate('#grid-itemname', 'rows.itemNameListQuery');


			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});


