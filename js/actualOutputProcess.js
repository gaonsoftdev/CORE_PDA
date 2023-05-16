var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		rows:{
			'Query':[],
			'wkTeamNameListQuery':[],
			'workCenterNameListQuery':[],
			'goodItemNameListQuery':[],
			'itemBomRevNameListQuery':[],
			'procNameListQuery':[],
			'assyItemNameListQuery':[],
			'procRevNameListQuery':[],
			'matItemNameListQuery':[],
			'prodUnitNameListQuery':[],
			'prodUnitName_2ListQuery':[]
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
			WorkCondition4:'quantity',

			BadQty:'quantity',
			DisuseQty:'quantity',
			LossCostQty:'quantity',
			OKQty:'quantity',
			ProdQty:'quantity',
			ReOrderQty:'quantity'
		},
		addFormDefault:{
			WorkDate:'',
			WkTeamName:'',
			WkTeamSeq:'0',
			WorkCenterName:'',
			WorkCenterSeq:'0',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			GoodItemSeq:'0',
			ItemBomRevName:'',
			ItemBomRev:'',
			ProcName:'',
			ProcSeq:'0',
			AssyItemName:'',
			AssyItemNo:'',
			AssyItemSpec:'',
			AssyItemSeq:'0',
			ProcRevName:'',
			ProcRev:'',
			WorkStartTime:'',
			WorkEndTime:'',
			PalletTotal:'0',
			BottleTotal:'0',
			TmpUnitName1:'',
			TmpUnitSeq1:'0',
			PalletOK:'0',
			BottleOK:'0',
			TmpUnitName2:'',
			TmpUnitSeq2:'0',
			PalletBad:'0',
			BottleBad:'0',
			WorkCondition4:'0',
			Supply:'0',
			WorkHour:'0',
			WorkorderNo:'',
			WorkOrderSeq:'0',
			WorkOrderSerl:'0',
			ProdUnitSeq:'0',
			WorkReportSeq:'0',
			IsProcQC:'',
			IsLastProc:'',
			TmpOKQty:'0',
			TmpBadQty:'0',
			ProdQty:'0',
			OKQty:'0',
			BadQty:'0',
			ReOrderQty:'0',
			LossCostQty:'0',
			DisuseQty:'0'
		},
		addForm:{
			WorkDate:'',
			WkTeamName:'',
			WkTeamSeq:'0',
			WorkCenterName:'',
			WorkCenterSeq:'0',
			GoodItemName:'',
			GoodItemNo:'',
			GoodItemSpec:'',
			GoodItemSeq:'0',
			ItemBomRevName:'',
			ItemBomRev:'',
			ProcName:'',
			ProcSeq:'0',
			AssyItemName:'',
			AssyItemNo:'',
			AssyItemSpec:'',
			AssyItemSeq:'0',
			ProcRevName:'',
			ProcRev:'',
			WorkStartTime:'',
			WorkEndTime:'',
			PalletTotal:'',
			BottleTotal:'',
			TmpUnitName1:'',
			TmpUnitSeq1:'0',
			PalletOK:'',
			BottleOK:'',
			TmpUnitName2:'',
			TmpUnitSeq2:'0',
			PalletBad:'',
			BottleBad:'',
			WorkCondition4:'',
			Supply:'',
			WorkHour:'',
			WorkorderNo:'',
			WorkOrderSeq:'0',
			WorkOrderSerl:'0',
			ProdUnitSeq:'0',
			WorkReportSeq:'0',
			IsProcQC:'',
			IsLastProc:'',
			TmpOKQty:'0',
			TmpBadQty:'0',
			ProdQty:'0',
			OKQty:'0',
			BadQty:'0',
			ReOrderQty:'0',
			LossCostQty:'0',
			DisuseQty:'0'
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
			AssyItemSpec:'',
			ProcRevName:'',
			MatItemName:'',
			MatItemNo:'',
			ProdUnitName:''
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
			AssyItemSpec:['AssyItemSpec'],
			ProcRevName:['GoodItemSeq','ProcRevName'],
			MatItemName:['Qty','MatItemName'],
			MatItemNo:['Qty','MatItemNo'],

			ProdUnitName:['ProdUnitName','AssyItemSeq'],
			ProdUnitName_2:['ProdUnitName=ProdUnitName_2','AssyItemSeq'],
			TmpUnitName1:['ProdUnitName','AssyItemSeq'],
			TmpUnitName2:['ProdUnitName','AssyItemSeq']
		},
		codeHelpResponse:{
			WkTeamName:['WkTeamSeq','WkTeamName'],
			WorkCenterName:['WorkCenterSeq','WorkCenterName', 'FactUnit'],
			GoodItemName:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemNo:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			GoodItemSpec:['AssyItemName','AssyItemNo','AssyItemSeq','AssyItemSpec','BOMRevName','GoodItemName','GoodItemNo','GoodItemSeq','GoodItemSpec','ItemBomRev','ItemBomRevName','ProcName','ProcRev','ProcRevName','ProcSeq','ProdUnitName','ProdUnitSeq'],
			ItemBomRevName:['ItemBomRev','ItemBomRevName'],
			ProcName:['ProcSeq','ProcName'],
			AssyItemName:['AssyItemSeq','AssyItemName','AssyItemNo','AssyItemSpec'],
			AssyItemNo:['AssyItemSeq','AssyItemName','AssyItemNo','AssyItemSpec'],
			AssyItemSpec:['AssyItemSeq','AssyItemName','AssyItemNo','AssyItemSpec'],
			ProcRevName:['ProcRev','ProcRevName'],
			//[error] STDUnitName:대소문자 오류StdUnitName
			//[error] STDUnitSeq:대소문자 오류StdUnitSeq
			MatItemName:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			MatItemNo:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			
			ProdUnitName:['TmpUnitSeq1=UnitSeq','TmpUnitName1=UnitName'],
			ProdUnitName_2:['TmpUnitSeq2=UnitSeq','TmpUnitName2=UnitName'],
			TmpUnitName1:['TmpUnitSeq1=UnitSeq','TmpUnitName1=UnitName'],
			TmpUnitName2:['TmpUnitSeq2=UnitSeq','TmpUnitName2=UnitName']
		},
		codeHelpDependencyKey:{
			GoodItemNo:'GoodItemName',
			GoodItemSpec:'GoodItemName',
			AssyItemNo:'AssyItemName',
			AssyItemSpec:'AssyItemName',
			MatItemNo:'MatItemName',
			TmpUnitName1:'ProdUnitName',
			TmpUnitName2:'ProdUnitName_2'
		},
		codeHelpGroupKey:{
			GoodItemName:'GoodItemNo',
			AssyItemName:'AssyItemNo',
			MatItemName:'MatItemNo',
			//ProdUnitName:'TmpUnitName1'

		},
		codeHelpQryTypeMapKey:{
			TmpUnitName1:'ProdUnitName',
			TmpUnitName2:'ProdUnitName',
			ProdUnitName_2:'ProdUnitName',
		},
		isCheckList:[]
	},
	methods:{
		changeCalcWorkTime: function(){
			this.addForm[event.target.name] = event.target.value; // 시간 변경후 가운데 콜론을 삭제후 탭키를 누르면 콜론이 사라지는 문제 해결
			console.log('changeCalcWorkTime');
			var vThis = this;
			let params = {QryType:'CalcWorkTime'};
			let inputData = GX.reductionItemByRows(['WorkDate','WorkCenterSeq','WorkStartTime','WorkEndTime'], [GX.deepCopy(this.addForm)]);
			if(inputData.length > 0){
				Object.assign(params, inputData[0]);
				params.WorkDate = (params.WorkDate.length > 0) ? GX.formatDate(params.WorkDate, 'YMD') : '';
				params.WorkStartTime = (params.WorkStartTime.length > 0) ? params.WorkStartTime.replace(/[^\d]/g, '') : '';
				params.WorkEndTime = (params.WorkEndTime.length > 0) ? params.WorkEndTime.replace(/[^\d]/g, '') : '';

				GX._METHODS_
				.setMethodId('Main')
				.ajax([params], [function(data){
					data = GX.reductionItemByRows(['WorkHour'], data);
					if(data != null && data.length > 0) {
						
						//vThis.addForm.WorkHour = GX.NumberType.convert(data[0].WorkHour, 'time');
						vThis.addForm.WorkHour = GX.NumberType.time(data[0].WorkHour);
					}
				}]);

				GX.TabIndex.next2(event.target.name);
			}
		},
		changeCalcQty: function(){
			var vThis = this;
			let params = {QryType:'CalcQty'};
			let inputData = GX.getInitVueModelNullOrEmptyByFormDefault(GX.deepCopy(this.addForm), GX.deepCopy(this.addFormDefault));
			
			Object.assign(params, inputData);
			params.WorkDate = (params.WorkDate.length > 0) ? GX.formatDate(params.WorkDate, 'YMD') : '';
			
			GX._METHODS_
			.setMethodId('Main')
			.ajax([params], [function(data){
				if(data != null && data.length > 0){
					for(let key in vThis.convertKeys){
						if(vThis.convertKeys.hasOwnProperty(key) && data[0][key] != null){
							vThis.addForm[key] = GX.NumberType.convert(data[0][key], vThis.convertKeys[key]);
							console.log('changeCalcQty', key);
						}
					}
				}

			}]);
		},
		materialsInput: function(){
			const vThis = this;
			let inputData = GX.getInitVueModelNullOrEmptyByFormDefault(GX.deepCopy(this.addForm), GX.deepCopy(this.addFormDefault));
			let params = {QryType:'MatInPut'};
			params.WorkReportSeq = inputData.WorkReportSeq;
			
			if(params.WorkReportSeq != null && params.WorkReportSeq != '' && params.WorkReportSeq != '0'){
				GX._METHODS_
				.setMethodId('WorkReportLine')
				.ajax([params], [function(data){
					//console.log(data);
					if(data.length == 1 && data[0].Result == null){
						location.href = GX.makeBaseUrl('/materialsInput.html') + GX.makeQueryString(data[0]);
					}
					
				}]);
			}
			else alert('저장된 생산실적이 없습니다!');

			if(event.type == 'click') event.target.blur();
		},
		stopProcess: function(){
			const vThis = this;
			let inputData = GX.getInitVueModelNullOrEmptyByFormDefault(GX.deepCopy(this.addForm), GX.deepCopy(this.addFormDefault));
			let params = {QryType:'NoWork'};
			params.WorkReportSeq = inputData.WorkReportSeq;
			
			if(params.WorkReportSeq != null && params.WorkReportSeq != '' && params.WorkReportSeq != '0'){
				GX._METHODS_
				.setMethodId('WorkReportLine')
				.ajax([params], [function(data){
					//console.log(data);
					if(data.length == 1 && data[0].Result == null){
						location.href = GX.makeBaseUrl('/stopProcess.html') + GX.makeQueryString(data[0]);
					}
					
				}]);
			}
			else alert('저장된 생산실적이 없습니다!');

			if(event.type == 'click') event.target.blur();
		},

		search: function(params){
			const vThis = this;

			GX._METHODS_
			.setMethodId('WorkReportLine')
			.ajax([params], [function(data){
				console.log(data);

				if(data.length == 1 && data[0].Result == null){
					
					let formData = GX.deepCopy(vThis.addForm);
					Object.assign(formData, data[0]);

					if(formData.WorkDate != null && formData.WorkDate.length > 0) formData.WorkDate = formData.WorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
					
					if(formData.WorkStartTime != null && formData.WorkStartTime.length > 0) formData.WorkStartTime = formData.WorkStartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
					
					if(formData.WorkEndTime != null && formData.WorkEndTime.length > 0) formData.WorkEndTime = formData.WorkEndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

					vThis.addForm = GX.getInitVueModelNullOrEmptyByFormDefault(formData, GX.deepCopy(vThis.addFormDefault));
				}
			}]);
		},
		save: function(){
			const vThis = this;
			let params = GX.getInitVueModelNullOrEmptyByFormDefault(GX.deepCopy(this.addForm), GX.deepCopy(this.addFormDefault));
			params.QryType = 'NewSave';
			params.PgmSeq = '92820464';
			params.WorkDate = (params.WorkDate.length > 0) ? GX.formatDate(params.WorkDate, 'YMD') : '';
			params.WorkStartTime = (params.WorkStartTime.length > 0) ? params.WorkStartTime.replace(/[^\d]/g, '') : '';
			params.WorkEndTime = (params.WorkEndTime.length > 0) ? params.WorkEndTime.replace(/[^\d]/g, '') : '';
			params.WorkCondition6Name = params.WkTeamName;
			params.WorkCondition6 = params.WkTeamSeq;
			params.WorkCondition7 = params.Supply;

			GX._METHODS_
			.setMethodId('WorkReportLine')
			.ajax([params], [function(data){
				console.log(data);

				if(data.length == 1 && data[0].Result == null){
					let formData = GX.deepCopy(vThis.addForm);
					Object.assign(formData, data[0]);

					if(formData.WorkDate != null && formData.WorkDate.length > 0) formData.WorkDate = formData.WorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
					
					if(formData.WorkStartTime != null && formData.WorkStartTime.length > 0) formData.WorkStartTime = formData.WorkStartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
					
					if(formData.WorkEndTime != null && formData.WorkEndTime.length > 0) formData.WorkEndTime = formData.WorkEndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

					vThis.addForm = GX.getInitVueModelNullOrEmptyByFormDefault(formData, GX.deepCopy(vThis.addFormDefault));
				}
			}]);

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
		},
		focusCodeHelp: function(targetName){
			let tempTargetName = (this.codeHelpDependencyKey[targetName] != null) ? this.codeHelpDependencyKey[targetName] : targetName;
			if(this.addForm[targetName] != null && this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;
			
console.log(targetName, this.addForm[targetName] != null)
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
						data[di].SerialNo = Number(di)+1 + (params.PageSize * (params.PageCount - 1));
					}
				}

				if(isOnePick){
					if(data.length == 1){
						for(let i in keys) {
							if(keys.hasOwnProperty(i)) vThis.addForm[keys[i]] = data[0][keys[i]];
						}

						GX.TabIndex.next2(tempTargetName);
						console.log('changeCalcQty',tempTargetName);
						if(['TmpUnitName1','TmpUnitName2','ProdUnitName','ProdUnitName_2'].indexOf(tempTargetName) != -1) this.changeCalcQty();
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

						this.addForm[keyParse[0]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey];
					}
				}

				this.closeCodeHelp(targetName);

				GX.TabIndex.next2(targetName);
				console.log('changeCalcQty',targetName);
				if(['TmpUnitName1','TmpUnitName2','ProdUnitName','ProdUnitName_2'].indexOf(targetName) != -1) this.changeCalcQty();
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

					
		if(GX.Cookie.get('WkTeamName') != null && GX.Cookie.get('WkTeamName').length > 0){
			this.addForm.WkTeamName = GX.Cookie.get('WkTeamName');
			this.addForm.WkTeamSeq = GX.Cookie.get('WkTeamSeq');
			//this.addForm.UMWkTypeName = GX.Cookie.get('UMWkTypeName');
			//this.addForm.UMWkType = GX.Cookie.get('UMWkType');
			this.addForm.WorkCenterName = GX.Cookie.get('WorkCenterName');
			this.addForm.WorkCenterSeq = GX.Cookie.get('WorkCenterSeq');
			document.querySelector('[name="GoodItemName"]').focus();
		}
	},

	created(){
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			const vThis = this;
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//this.queryForm.CompleteWishDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			this.addForm.WorkDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			document.querySelector('[name="WorkDate"]').setAttribute('gx-default', this.addForm.WorkDate);

			if(this.params.QryType != null && this.params.QryType == 'JumpOut') this.search(this.params);

			// select box에 scannr enter evnet 막기 시작 /////////////
			GX.SelectBoxEnterPrevention.init();
			// select box에 scannr enter evnet 막기 끝 /////////////

			// 스캐너 입력이 하나인 경우 포커스 없이도 해당 스캔 입력박스에 스캔값 입력처리를 위한 이벤트
			//document.body.addEventListener('paste', this.scanBarCode, false);

			// 다음 입력창 이동을 위한 tab index 부여 시작 /////////////
			//GX.TabIndex.indexing();
			GX.TabIndex.indexing(['GoodItemName','WorkStartTime','WorkEndTime','PalletTotal','TmpUnitName1','PalletOK','TmpUnitName2','PalletBad','Supply','WorkCondition4']);
			// 다음 입력창 이동을 위한 tab index 부여 끝 /////////////


			
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
			.item('AssyItemSpec').head('공정품규격', '')
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
			.item('UnitName').head('생산단위', '')
			.item('UnitSeq').head('생산단위코드', '')
			.loadTemplate('#grid-produnitname', 'rows.prodUnitNameListQuery');
			
			GX.VueGrid
			.init()
			.bodyRow('@click="selectCodeHelp(index);"')
			.item('SerialNo').head('번호', 'num')
			.item('UnitName').head('생산단위', '')
			.item('UnitSeq').head('생산단위코드', '')
			.loadTemplate('#grid-produnitname_2', 'rows.prodUnitName_2ListQuery');

			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});

