var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		rows:{
			'ListQuery':[],
			'empNameListQuery':[],
			'wkTeamNameListQuery':[],
			'workCenterNameListQuery':[],
			'itemNameListQuery':[],
			'toolNameListQuery':[]
		},
		listQueryForm:{
			WorkDateFr:'',
			WorkDateTo:'',
			EmpSeq:'',
			EmpName:'',
			WkTeamSeq:'0',
			WkTeamName:'',
			WorkCenterSeq:'0',
			WorkCenterName:'',
			ItemSeq:'0',
			ItemName:'',
			ToolSeq:'0',
			ToolName:'',
			ToolNo:''
		},
		codeHelp:{
			EmpName:'',
			WkTeamName:'',
			WorkCenterName:'',
			ItemName:'',
			ToolName:'',
			ToolNo:''
		},
		codeHelpRequest:{},
		codeHelpResponse:{
			EmpName:['EmpSeq','EmpName'],
			WkTeamName:['WkTeamSeq','WkTeamName'],
			WorkCenterName:['WorkCenterSeq','WorkCenterName'],
			ItemName:['ItemSeq','ItemName'],
			ToolName:['ToolSeq','ToolName','ToolNo'],
			ToolNo:['ToolSeq','ToolName','ToolNo']
		},
		codeHelpDependencyKey:{
			ToolNo:'ToolName'
		},
		codeHelpGroupKey:{
			ToolName:'ToolNo'
		},
		codeHelpQryTypeMapKey:{},
		isClickItem:-1
	},
	methods:{
		init: function(){
			this.listQueryForm = GX.getInitVueModelByFormDefault(this.listQueryForm);
			GX.initForm('queryForm');

			if(event.type == 'click') event.target.blur();
		},
		search: function(){
			let params = GX.deepCopy(this.listQueryForm);
			let paramList = GX.reductionItemByRows(['WorkDateFr','WorkDateTo','WorkCenterSeq','WkTeamSeq','ItemSeq','ToolSeq','EmpSeq'], [params]);
			params = paramList[0];
			params.QryType = 'Query';
			params.WorkDateFr = (params.WorkDateFr.length > 0) ? GX.formatDate(params.WorkDateFr, 'YMD') : '';
			params.WorkDateTo = (params.WorkDateTo.length > 0) ? GX.formatDate(params.WorkDateTo, 'YMD') : '';

			var vThis = this;
			GX._METHODS_
			.setMethodId('Equip')
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

			this.isClickItem = Number(index);

			GX.doubleClickRun(event.target, function(){
				
				let queryData = GX.deepCopy(vThis.rows.ListQuery);

				if(queryData[index] != null){
					let params = {QryType:'SS1Db'};
					params.Seq = queryData[index].Seq;
					location.href = GX.makeBaseUrl('/equipmentDailyReportInput.html') + GX.makeQueryString(params);
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
			.bodyRow('@click="process(index);" :class="{\'check\':isClicked(index)}"')
			.item('SerialNo', {rowspan:2}).head('번호', 'num')
										//.body(null, 'num')
			.item('ItemNo').head('품목', '')
							//.body(null, 'item_num')
			.item('ToolName').head('금형명', '')
			.item('WkTeamName').head('근무직', '')
			.item('BottleOK').head('양품수량', '')
			.item('FBadQty_kg').head('프리폼 불량', '')
			.item('ProdQty').head('프리폼 생산량', '')
			.nl()
			.item('WorkCenterName').head('워크센터', '')
			.item('ToolNo').head('금형번호', '')
			.item('Waste').head('Waste', '')
			.item('BottleBad').head('불량수량', '')
			.item('BadQty_ea').head('검사기 불량', '')
			.item('BadSum_ea').head('불량합계', '')
			.loadTemplate('#grid', 'rows.ListQuery');

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
			.item('WorkCenterName').head('워크센터', '')
			.item('WorkCenterSeq').head('워크센터내부코드', '')
			.item('FactUnitName').head('생산사업장', '')
			.item('FactUnit').head('생산사업장내부코드', '')
			.loadTemplate('#grid-workcentername', 'rows.workCenterNameListQuery');
			
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

			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});


