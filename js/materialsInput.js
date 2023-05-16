var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		rows:{
			ListQuery:[],
			lotNoListQuery:[],
			matItemNameListQuery:[],
			matUnitNameListQuery:[]
		},
		tempForm:{
			RealLotNo:'abc'
		},
		addForm:{
			WorkReportSeq:'0',
			Qty:'0',
			LotNo:'',
			LotSeq:'0',
			MatItemName:'',
			MatItemNo:'',
			MatItemSpec:'',
			MatItemSeq:'0'
		},
		codeHelp:{
			LotNo:'',
			MatItemName:'',
			MatItemNo:'',
			MatItemSpec:'',
			MatUnitName:''
		},
		codeHelpRequest:{
			//UMNonWorkTypeLName:['UMNonWorkTypeLName'],
			//StopTypeName:['UMNonWorkTypeLName'],
			//UMNonWorkTypeSName:['UMNonWorkTypeSName'],
			//StopReasonName:['UMNonWorkTypeSName']

			LotNo:['Qty','LotNo','MatItemSeq'],
			MatItemName:['Qty','MatItemName'],
			MatItemNo:['Qty','MatItemNo'],
			MatItemSpec:['Qty','MatItemSpec'],
			MatUnitName:['Qty','MatItemSeq','MatUnitName']

		},
		codeHelpResponse:{
			//UMNonWorkTypeLName:['UMNonWorkTypeL','UMNonWorkTypeLName'],
			//UMNonWorkTypeSName:['UMNonWorkTypeS','UMNonWorkTypeSName'],
			//StopTypeName:['StopType=UMNonWorkTypeL','StopTypeName=UMNonWorkTypeLName'],
			//StopReasonName:['StopReason=UMNonWorkTypeS','StopReasonName=UMNonWorkTypeSName']
			LotNo:['LotSeq', 'RealLotNo=LotNo', 'IDX_NO', 'MatItemSeq', 'MatItemName', 'MatItemNo', 'MatItemSpec', 'MatUnitName', 'MatUnitSeq', 'Qty', 'StdUnitName', 'StdUnitQty', 'StdUnitSeq'],
			MatItemName:['MatItemSeq', 'MatItemName', 'MatItemNo', 'MatItemSpec', 'MatUnitName', 'MatUnitSeq', 'Qty', 'StdUnitName', 'StdUnitQty', 'StdUnitSeq'],
			MatItemNo:['MatItemSeq', 'MatItemName', 'MatItemNo', 'MatItemSpec', 'MatUnitName', 'MatUnitSeq', 'Qty', 'StdUnitName', 'StdUnitQty', 'StdUnitSeq'],
			MatItemSpec:['MatItemSeq', 'MatItemName', 'MatItemNo', 'MatItemSpec', 'MatUnitName', 'MatUnitSeq', 'Qty', 'StdUnitName', 'StdUnitQty', 'StdUnitSeq'],
			MatUnitName:['MatUnitSeq','MatUnitName', 'Qty', 'StdUnitName', 'StdUnitQty', 'StdUnitSeq'],


/*
			LotNo:['LotSeq','LotNo', 'MatItemName','MatItemNo','MatItemSeq','MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			//[error] STDUnitName:대소문자 오류StdUnitName
			//[error] STDUnitSeq:대소문자 오류StdUnitSeq
			MatItemName:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			MatItemNo:['MatItemSeq','MatItemName','MatItemNo', 'MatUnitName','MatUnitSeq','Qty','StdUnitName','StdUnitSeq','StdUnitQty'],
			MatUnitName:['MatUnitSeq','MatUnitName','Qty','StdUnitName','StdUnitSeq','StdUnitQty']
*/
		},
		codeHelpDependencyKey:{
			MatItemNo:'MatItemName',
			MatItemSpec:'MatItemName'
		},
		codeHelpGroupKey:{
			MatItemName:'MatItemNo'
		},
		codeHelpQryTypeMapKey:{
			LotNo:'LotNoMat'
			//MatItemNo:'MatItemName',
			//MatItemSpec:'MatItemName'
		},
		codeHelpRelationIndex:-1,
		isCheckList:[],
		isClickItem:-1
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
		fromMaterialsInputInquiry: function(params){
			//console.log(this.params);
			const vThis = this;
			GX._METHODS_
			.setMethodId('ReportInPut')
			.ajax([params], [function(data){
				if(data.length > 0 && data[0].Result == null){
					for(var di in data){
						if(data.hasOwnProperty(di)){
							data[di].SerialNo = Number(di)+1;
							if(data[di].NeedQty != null) data[di].NeedQty = GX.NumberType.quantity(data[0].NeedQty);
							if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity2(data[0].Qty);
							if(data[di].StdUnitQty != null) data[di].StdUnitQty = GX.NumberType.quantity(data[0].StdUnitQty);
						}
					}

					vThis.rows['ListQuery'] = data;
				}
			}]);

		},
		search: function(){
			this.initSelected();
			let params = GX.deepCopy(this.params);
			params.QryType = 'NeedMat';
			var vThis = this;
			GX._METHODS_
			.setMethodId('ReportInPut')
			.ajax([params], [function(data){
				if(data.length == 0) alert('조회된 데이터가 없습니다.');
				if(data.length > 0 && data[0].Result == null){
					if(data[0].ExistsYn == '1' && confirm('알림\n이미 투입된 자재가 있습니다. 계속 진행하시겠습니까?')){
						for(var di in data){
							if(data.hasOwnProperty(di)){
								data[di].SerialNo = Number(di)+1;
								if(data[di].NeedQty != null) data[di].NeedQty = GX.NumberType.quantity(data[0].NeedQty);
								if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity2(data[0].Qty);
								if(data[di].StdUnitQty != null) data[di].StdUnitQty = GX.NumberType.quantity(data[0].StdUnitQty);
							}
						}
	
						vThis.rows['ListQuery'] = data;
					}
				}
			}]);
		},
/*
		save: function(){
			const vThis = this;
			let params = GX.deepCopy(this.addForm);
			params.QryType = 'NewSave';
			params.WorkDate = (params.WorkDate.length > 0) ? GX.formatDate(params.WorkDate, 'YMD') : '';
			params.StartTime = (params.StartTime.length > 0) ? params.StartTime.replace(/[^\d]/g, '') : '';
			params.EndTime = (params.EndTime.length > 0) ? params.EndTime.replace(/[^\d]/g, '') : '';

			GX._METHODS_
			.setMethodId('EquipNoWork')
			.ajax([params], [function(data){}]);

			if(event.type == 'click') event.target.blur();
		},

*/
		save: function(){
			var vThis = this;
			let addParams = {QryType:'NewSave'};

			let params = {};
			Object.assign(params, addParams);

			let params2 = GX.deepCopy(this.rows.ListQuery);
			for(let qi in params2){
				if(params2.hasOwnProperty(qi)) {
					params2[qi].IDX_No = Number(qi) + 1;
					Object.assign(params2[qi], addParams);
				}
			}

			if(params2.length > 0){
				GX._METHODS_
				.setMethodId('ReportInPut')
				.ajax([params], params2, [function(data){}]);
			}

			if(event.type == 'click') event.target.blur();
		},


		del: function(){
			if(confirm('삭제되면 복구할 수 없습니다. 정말 삭제하시겠습니까?')){
				var vThis = this;
				let qryType = (document.querySelectorAll('[name="InOutSerl"]:checked').length > 0) ? 'SheetDelete' : 'MDelete';
				if(qryType == 'SheetDelete')  {

					let params = {QryType:qryType};

					let queryData = GX.deepCopy(this.rows.ListQuery);
					let checkList = [];
					let checkUnsavedList = [];
					let checkAllList = [];
					let remainList = [];
					let remainUnsavedList = [];
					let remainAllList = [];
					let objs = document.querySelectorAll('[name="InOutSerl"]');


					let formData = GX.deepCopy(this.addForm);
					params.WorkReportSeq = formData.WorkReportSeq

					for(let ci in objs){
						if(objs.hasOwnProperty(ci)){
							console.log('zz', ci, queryData, queryData[ci])
							Object.assign(queryData[Number(ci)], params);
							queryData[Number(ci)].IDX_No = Number(ci) + 1;

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
						.setMethodId('ReportInPut')
						.ajax([params], checkList, [function(data){
							vThis.rows.ListQuery = remainAllList;
							vThis.initSelected();

							if(remainList.length == 0){
								//vThis.queryForm.InOutSeq = '';
								//vThis.queryForm.InOutNo = '';
								//vThis.queryForm.WHSeq = '';
								//vThis.IsRecall = [];
							}
							
							if(checkAllList.length == 0) location.replace(location.href);
						}]);
					}
					else {
						vThis.rows.ListQuery = remainAllList;
						vThis.initSelected();
						if(checkAllList.length == 0) location.replace(location.href);
					}
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
			if(this.addForm[targetName] != null && this.codeHelpGroupKey[tempTargetName] != null) this.codeHelpGroupKey[tempTargetName] = targetName;

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
			
			console.log('qaqaq', targetName, isOnePick, tempTargetName, this.codeHelpDependencyKey[targetName], this.codeHelpGroupKey[tempTargetName], this.codeHelpRequest[targetName]);

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
				let listKey = this.codeHelpRelationIndex;
				
				for(let i in keys) {
					if(keys.hasOwnProperty(i)) {

						keyParse = keys[i].split('=');
						dataKey = (keyParse.length == 2) ? keyParse[1] : keyParse[0];

						this.addForm[keyParse[0]] = GX.deepCopy(this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey]);

						console.log('keyParse', keyParse, typeof this.rows.ListQuery[listKey][keyParse[0]]);

						if(listKey != null && listKey > -1 && this.rows.ListQuery[listKey] != null) {

							console.log('listKey', listKey, keyParse[0], (this.rows.ListQuery[listKey][keyParse[0]] != null));

							if(typeof this.rows.ListQuery[listKey][keyParse[0]] != 'undefined') this.rows.ListQuery[listKey][keyParse[0]] = GX.deepCopy(this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey]); 
						}
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
		},
		
		gridEditor: function(key, action, index){
			//console.log(document.querySelectorAll('[grid-editor="'+action+'"]'), action, event.target);
			//console.log(Array.prototype.indexOf.call(document.querySelectorAll('[grid-editor]'), document.querySelector('[grid-editor="'+action+'"]')));
			let anotherAction = (action == 'Y') ? 'N' : 'Y';
			let obj = document.querySelectorAll('[grid-editor-'+key+'="'+action+'"]')[index];
			obj.style.display = 'block';
			if(action == 'Y') {
				obj.focus();
				obj.style.width = event.target.offsetWidth + 'px';
			}
			document.querySelectorAll('[grid-editor-'+key+'="'+anotherAction+'"]')[index].style.display = 'none';
		},
		gridEditorInputCodeHelpTrigger: function(key, index){
			const vThis = this;
			let parse = key.split('=');
			let name = (parse.length == 2) ? parse[1] : parse[0];
			//RealLotNo=LotNo
			if(vThis.rows.ListQuery[index] != null) {

				if(vThis.codeHelpRequest != null && vThis.codeHelpRequest[name] != null){
					let paramItems = vThis.codeHelpRequest[name];
					let pi = '';
					let v = '';
					let parts = []
					for(let i in paramItems){
						if(paramItems.hasOwnProperty(i)){
							pi = paramItems[i];
							v = vThis.rows.ListQuery[index][pi];
							vThis.addForm[pi] = (v != null) ? v : '0';
						}
					}
					vThis.codeHelpRelationIndex = index;
					const selectorStr = '[name="'+name+'"]';
					let codeHelpObj = document.querySelector(selectorStr);
					codeHelpObj.value = event.target.value;
					GX.eventTrigger(selectorStr, 'change');
				}
			}
		},
		gridEditorCodeHelpTrigger: function(key, index){
			const vThis = this;
			GX.doubleClickRun(event.target, function(){
				let parse = key.split('=');
				let name = (parse.length == 2) ? parse[1] : parse[0];
				//RealLotNo=LotNo
				if(vThis.rows.ListQuery[index] != null) {

					if(vThis.codeHelpRequest != null && vThis.codeHelpRequest[name] != null){
						let paramItems = vThis.codeHelpRequest[name];
						let pi = '';
						let v = '';
						let parts = []
						for(let i in paramItems){
							if(paramItems.hasOwnProperty(i)){
								pi = paramItems[i];
								v = vThis.rows.ListQuery[index][pi];
								vThis.addForm[pi] = (v != null) ? v : '0';
							}
						}
						vThis.codeHelpRelationIndex = index;

						let codeHelpObj = document.querySelector('[name="'+name+'"]');
						codeHelpObj.value = event.target.value;
						codeHelpObj.click();
						codeHelpObj.click();
					}
				}


			});
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
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//this.queryForm.CompleteWishDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			
			//var p = (GX.getParameters().p != null) ? GX.getParameters().p : 1;
			//console.log('seeeeeeeeeeeesssssssss',GX.getParameters().sa)

			if(this.params.WorkReportSeq != null) this.addForm.WorkReportSeq = this.params.WorkReportSeq;

			if(this.params.QryType != null){
				if(this.params.QryType == 'SS1Db') this.fromMaterialsInputInquiry(this.params);
			}
			


			let spanEvents = {
				MatItemName:[
					'@click="gridEditor(\'MatItemName\', \'Y\', index);"'
				],
				MatItemNo:[
					'@click="gridEditor(\'MatItemNo\', \'Y\', index);"'
				],
				MatItemSpec:[
					'@click="gridEditor(\'MatItemSpec\', \'Y\', index);"'
				],
				RealLotNo:[
					'@click="gridEditor(\'RealLotNo\', \'Y\', index);"'
				],
				Remark:[
					'@click="gridEditor(\'Remark\', \'Y\', index);"'
				],
				MatUnitName:[
					'@click="gridEditor(\'MatUnitName\', \'Y\', index);"'
				],
				Qty:[
					'@click="gridEditor(\'Qty\', \'Y\', index);"'
				]
			};
			let inputEvents = {
				MatItemName:[
					'@change="gridEditorInputCodeHelpTrigger(\'MatItemName\', index);"',
					'@click="gridEditorCodeHelpTrigger(\'MatItemName\', index);"',
					'@blur="gridEditor(\'MatItemName\', \'N\', index);"'
				],
				MatItemNo:[
					'@change="gridEditorInputCodeHelpTrigger(\'MatItemNo\', index);"', 
					'@click="gridEditorCodeHelpTrigger(\'MatItemNo\', index);"',
					'@blur="gridEditor(\'MatItemNo\', \'N\', index);"'
				],
				MatItemSpec:[
					'@change="gridEditorInputCodeHelpTrigger(\'MatItemSpec\', index);"', 
					'@click="gridEditorCodeHelpTrigger(\'MatItemSpec\', index);"',
					'@blur="gridEditor(\'MatItemSpec\', \'N\', index);"'
				],
				RealLotNo:[
					'@change="gridEditorInputCodeHelpTrigger(\'MatItemName\', index);"', 
					'@click="gridEditorCodeHelpTrigger(\'RealLotNo=LotNo\', index);"',
					'@blur="gridEditor(\'RealLotNo\', \'N\', index);"'
				],
				Remark:[
					'@blur="gridEditor(\'Remark\', \'N\', index);"'
				],
				MatUnitName:[
					'@change="gridEditorInputCodeHelpTrigger(\'MatItemName\', index);"', 
					'@click="gridEditorCodeHelpTrigger(\'MatUnitName\', index);"',
					'@blur="gridEditor(\'MatUnitName\', \'N\', index);"'
				],
				Qty:[
					'@blur="gridEditor(\'Qty\', \'N\', index);"'
				]
			};

			const vThis = this;
			GX.VueGrid
			.bodyRow(':class="{\'check\':isChecked(index)}"')
			.item('InOutSerl', {rowspan:2}).head('<div class="chkBox"><input type="checkbox" @click="selectAll();" /></div>', '')
										.body('<div class="chkBox"><input type="checkbox" name="InOutSerl" :value="row.InOutSerl" @click="selectedMark(index);" /></div>', '')
			.item('SerialNo', {rowspan:2}).head('번호', 'num')
										//.body(null, 'num')
			.item('MatItemName').head('자재명', '')
								.body('<span grid-editor-MatItemName="N" style="min-width:100%; min-height:50%;" '+spanEvents.MatItemName.join(' ')+'>{{row.MatItemName}}</span><input type="text" grid-editor-MatItemName="Y" v-model="row.MatItemName" style="display:none;" '+inputEvents.MatItemName.join(' ')+'>', 'code-help')
			.item('MatItemNo').head('자재번호', '')
								.body('<span grid-editor-MatItemNo="N" style="min-width:100%; min-height:50%;" '+spanEvents.MatItemNo.join(' ')+'>{{row.MatItemNo}}</span><input type="text" grid-editor-MatItemNo="Y" v-model="row.MatItemNo" style="display:none;" '+inputEvents.MatItemNo.join(' ')+'>', 'code-help')
			.item('MatItemSpec').head('자재규격', '')
								.body('<span grid-editor-MatItemSpec="N" style="min-width:100%; min-height:50%;" '+spanEvents.MatItemSpec.join(' ')+'>{{row.MatItemSpec}}</span><input type="text" grid-editor-MatItemSpec="Y" v-model="row.MatItemSpec" style="display:none;" '+inputEvents.MatItemSpec.join(' ')+'>', 'code-help')
			.item('RealLotNo').head('Lot No', '')
								.body('<span grid-editor-RealLotNo="N" style="min-width:100%; min-height:50%;" '+spanEvents.RealLotNo.join(' ')+'>{{row.RealLotNo}}</span><input type="text" grid-editor-RealLotNo="Y" v-model="row.RealLotNo" style="display:none;" '+inputEvents.RealLotNo.join(' ')+'>', 'code-help')
			.item('Remark').head('비고', '')
							.body('<span grid-editor-Remark="N" style="min-width:100%; min-height:50%;" '+spanEvents.Remark.join(' ')+'>{{row.Remark}}</span><input type="text" grid-editor-Remark="Y" v-model="row.Remark" style="display:none;" '+inputEvents.Remark.join(' ')+'>', '')
			.nl()
			.item('NeedQty').head('소요량', '')
							.body('{{row.NeedQty}}', 'read-only')
			.item('MatUnitName').head('투입단위', '')
								.body('<span grid-editor-MatUnitName="N" style="min-width:100%; min-height:50%;" '+spanEvents.MatUnitName.join(' ')+'>{{row.MatUnitName}}</span><input type="text" grid-editor-MatUnitName="Y" v-model="row.MatUnitName" style="display:none;" '+inputEvents.MatUnitName.join(' ')+'>', 'code-help')
			.item('Qty').head('투입수량', '')
						.body('<span grid-editor-Qty="N" style="min-width:100%; min-height:50%;" '+spanEvents.Qty.join(' ')+'>{{row.Qty}}</span><input type="text" grid-editor-Qty="Y" v-model="row.Qty" style="display:none;" '+inputEvents.Qty.join(' ')+'>', '')
			.item('StdUnitName').head('기본단위', '')
								.body('{{row.StdUnitName}}', 'read-only')
			.item('StdUnitQty').head('기본수량', '')
								.body('{{row.StdUnitQty}}', 'read-only')
			.loadTemplate('#grid', 'rows.ListQuery');

			//if(this.params.QryType != null && this.params.QryType == 'ListQuery') this.search(this.params);
			if(this.params.WorkReportSeq != null) {
				this.addForm.WorkReportSeq = this.params.WorkReportSeq;
			}

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
		}
	}

});


