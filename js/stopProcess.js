var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		rows:{
			'ListQuery':[],
			'uMNonWorkTypeLNameListQuery':[],
			'uMNonWorkTypeSNameListQuery':[],
			'toolNameListQuery':[],
			'wHNameListQuery':[]
		},
		listQueryForm:{
			NonWorkDate:'',
			ToolStopYN:'0',
			UMNonWorkTypeLName:'',
			UMNonWorkTypeL:'0',
			UMNonWorkTypeSName:'',
			UMNonWorkTypeS:'0',
			ToolName:'',
			ToolNo:'',
			ToolSeq:'0',
			WorkStartTime:'',
			WorkEndTime:'',
			NonWorkHour:'0',
			Remark:'',
			ActRemark:'',
			ToolSerl:'0',
			Serl:'0',
			WorkReportSeq:'0',
			WHName:'',
			WHSeq:'0'
		},
		convertKeys:{
			NonWorkHour:'time',
			Qty:'quantity'

		},
		codeHelp:{
			UMNonWorkTypeLName:'',
			UMNonWorkTypeSName:'',
			ToolName:'',
			ToolNo:'',
			WHName:''
		},
		codeHelpRequest:{},
		codeHelpResponse:{
			UMNonWorkTypeLName:['UMNonWorkTypeL','UMNonWorkTypeLName'],
			UMNonWorkTypeSName:['UMNonWorkTypeS','UMNonWorkTypeSName'],
			ToolName:['ToolSeq','ToolName','ToolNo'],
			ToolNo:['ToolSeq','ToolName','ToolNo'],
			WHName:['WHSeq','WHName']
		},
		codeHelpDependencyKey:{
			ToolNo:'ToolName'
		},
		codeHelpGroupKey:{
			ToolName:'ToolNo'
		},
		codeHelpQryTypeMapKey:{},
		isCheckList:[],
		isClickItem:-1
	},
	methods:{
		changeCalcWorkTime: function(){
			this.listQueryForm[event.target.name] = event.target.value; // 시간 변경후 가운데 콜론을 삭제후 탭키를 누르면 콜론이 사라지는 문제 해결
			console.log('changeCalcWorkTime');
			const vThis = this;

			let params = {QryType:'NonWorkHour'};
			let inputData = GX.reductionItemByRows(['NonWorkDate','WorkStartTime','WorkEndTime'], [GX.deepCopy(this.listQueryForm)]);
			if(inputData.length > 0){
				Object.assign(params, inputData[0]);
				params.NonWorkDate = (params.NonWorkDate.length > 0) ? GX.formatDate(params.NonWorkDate, 'YMD') : '';
				params.WorkStartTime = (params.WorkStartTime.length > 0) ? params.WorkStartTime.replace(/[^\d]/g, '') : '';
				params.WorkEndTime = (params.WorkEndTime.length > 0) ? params.WorkEndTime.replace(/[^\d]/g, '') : '';

				GX._METHODS_
				.setMethodId('WorkReportNoWork')
				.ajax([params], [function(data){
					if(data != null && data.length > 0) {
						//vThis.listQueryForm.WorkHour = GX.NumberType.convert(data[0].NonWorkHour, 'time');
						vThis.listQueryForm.NonWorkHour = GX.NumberType.time(data[0].NonWorkHour);

					}
				}]);
			}
		},
		getEquipmentPart: function(){
			if(confirm('수리자재 삭제\n기존에 등록된 자료는 삭제됩니다. 삭제하시겠습니까?')){
				const vThis = this;

				let params = {QryType:'MatDelete'};
				let addParams = GX.deepCopy(params);
				let queryForm = GX.deepCopy(this.listQueryForm);
				queryForm.MSerl = queryForm.ToolSerl;
				let queryFormList = GX.reductionItemByRows(['NonWorkDate','ToolSeq','MSerl','ToolSerl','WorkReportSeq'], [queryForm]);
				queryForm = queryFormList[0];
				Object.assign(addParams, queryForm);
				addParams.NonWorkDate = (addParams.NonWorkDate.length > 0) ? GX.formatDate(addParams.NonWorkDate, 'YMD') : '';

				let listQuery = GX.deepCopy(this.rows.ListQuery);
				for(let i in listQuery){
					if(listQuery.hasOwnProperty(i)){
						Object.assign(listQuery[i], addParams);
					}
				}

				GX._METHODS_
				.setMethodId('WorkReportNoWork')
				.ajax([params], listQuery, [function(data){
					if(data != null && data.length > 0) {
						if(data[0].WorkingTag == 'D' && data[0].Status == 0){
							let subParams = {QryType:'MatQuery'};
							queryForm = GX.deepCopy(vThis.listQueryForm);
							let queryFormList = GX.reductionItemByRows(['ToolSeq','WorkReportSeq','WHSeq'], [queryForm]);
							queryForm = queryFormList[0];
							Object.assign(subParams, queryForm);
							GX._METHODS_
							.setMethodId('WorkReportNoWork')
							.ajax([subParams], [function(data){
								if(data != null && data.length > 0) {
									console.log(data);
									//vThis.rows.ListQuery = data;

									for(let di in data){
										if(data.hasOwnProperty(di)){
											data[di].SerialNo = 'A';
											
											if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity(data[0].Qty);

										}
									}
					
									vThis.rows['ListQuery'] = data;

								}
							}]);

						}
					}
				}]);
			}
		},

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
		fromStopProcessInquiry: function(params){
			console.log(this.params);
			const vThis = this;

			GX._METHODS_
			.setMethodId('WorkReportNoWork')
			.ajax([params], [function(data){
				if(data.length == 1 && data[0].Result == null){
					let formData = GX.deepCopy(vThis.listQueryForm);
					Object.assign(formData, data[0]);

					if(formData.NonWorkDate != null && formData.NonWorkDate.length > 0) formData.NonWorkDate = formData.NonWorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
					
					if(formData.WorkStartTime != null && formData.WorkStartTime.length > 0) formData.WorkStartTime = formData.WorkStartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
					
					if(formData.WorkEndTime != null && formData.WorkEndTime.length > 0) formData.WorkEndTime = formData.WorkEndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

					vThis.listQueryForm = formData;

					if(formData.ToolStopYN == '1') {
						document.getElementById('return_chkBox').disabled = false;
						document.getElementById('return_chkBox').checked = true;
						document.getElementById('grid').style.display = 'block';
						document.getElementById('spare-parts').style.display = 'block';
					}
				}
			},
			function(data){
				if(data.length > 1 && data[0].Result == null){
					for(let di in data){
						if(data.hasOwnProperty(di)){
							data[di].SerialNo = Number(di)+1;
							if(data[di].NonWorkDate != null && data[di].NonWorkDate.length > 0) data[di].NonWorkDate = data[di].NonWorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');

							if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity(data[0].Qty);
						}
					}

					vThis.rows.ListQuery = data;
				}
			}]);

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
						if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity(data[0].Qty);
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

		save: function(){
			const vThis = this;
			let params = GX.deepCopy(this.listQueryForm);
			params.QryType = 'NewSave';
			params.NonWorkDate = (params.NonWorkDate.length > 0) ? GX.formatDate(params.NonWorkDate, 'YMD') : '';
			params.WorkStartTime = (params.WorkStartTime.length > 0) ? params.WorkStartTime.replace(/[^\d]/g, '') : '';
			params.WorkEndTime = (params.WorkEndTime.length > 0) ? params.WorkEndTime.replace(/[^\d]/g, '') : '';
			params.MSerl = params.ToolSerl;

			GX._METHODS_
			.setMethodId('WorkReportNoWork')
			.ajax([params], [function(data){
				console.log('zzz', data);

				if(data.length == 1 && data[0].Result == null){
					let formData = GX.deepCopy(vThis.listQueryForm);
					Object.assign(formData, data[0]);

					if(formData.NonWorkDate != null && formData.NonWorkDate.length > 0) formData.NonWorkDate = formData.NonWorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
					
					if(formData.WorkStartTime != null && formData.WorkStartTime.length > 0) formData.WorkStartTime = formData.WorkStartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
					
					if(formData.WorkEndTime != null && formData.WorkEndTime.length > 0) formData.WorkEndTime = formData.WorkEndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

					vThis.listQueryForm = formData;

					let subParams = {QryType:'SheetSave'};
					let addParamList = GX.reductionItemByRows(['NonWorkDate','ToolSeq','ToolSerl','WorkReportSeq'], [GX.deepCopy(vThis.listQueryForm)]);
					let addParams = addParamList[0];
					addParams.NonWorkDate = (addParams.NonWorkDate.length > 0) ? GX.formatDate(addParams.NonWorkDate, 'YMD') : '';
					addParams.MSerl = addParams.ToolSerl;
					Object.assign(addParams, subParams);
					console.log('check addParams', addParams)
					let listQuery = GX.deepCopy(vThis.rows.ListQuery);
					for(let i in listQuery){
						if(listQuery.hasOwnProperty(i)){
							addParams.IDX_NO = Number(i) + 1;
							Object.assign(listQuery[i], addParams);
						}
					}
	console.log('check listQuery2', JSON.stringify(listQuery))
					GX._METHODS_
					.setMethodId('WorkReportNoWork')
					.ajax([subParams], listQuery, [function(data){
						if(data != null && data.length > 0 && (data[0].Result == null || data[0].Result.length == 0)) {
							for(let di in data){
								if(data.hasOwnProperty(di)){
									data[di].SerialNo = Number(di)+1;
									if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity(data[0].Qty);
								}
							}
			
							vThis.rows['ListQuery'] = data;

							
						}
					}]);

					document.getElementById('return_chkBox').disabled = false;

					
				}
			}]);

			if(event.type == 'click') event.target.blur();
		},
		del: function(){
			if(confirm('삭제되면 복구할 수 없습니다. 정말 삭제하시겠습니까?')){
				var vThis = this;
				let qryType = (document.querySelectorAll('[name="InOutSerl"]:checked').length > 0) ? 'SheetCut' : 'MDelete';
				let params = {QryType:qryType};

				let queryData = GX.deepCopy(this.rows.ListQuery);
				let checkList = [];
				let checkUnsavedList = [];
				let checkAllList = [];
				let remainList = [];
				let remainUnsavedList = [];
				let remainAllList = [];
				let objs = document.querySelectorAll('[name="InOutSerl"]');


				let formData = GX.deepCopy(this.listQueryForm);
				Object.assign(formData, params);

				if(formData.NonWorkDate != null && formData.NonWorkDate.length > 0) formData.NonWorkDate = formData.NonWorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
				
				if(formData.WorkStartTime != null && formData.WorkStartTime.length > 0) formData.WorkStartTime = formData.WorkStartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
				
				if(formData.WorkEndTime != null && formData.WorkEndTime.length > 0) formData.WorkEndTime = formData.WorkEndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

				formData.MSerl = formData.ToolSerl;
				let formDataList = GX.reductionItemByRows(['NonWorkDate','ToolSeq','MSerl','ToolSerl','WorkReportSeq'], [formData]);
				formData = formDataList[0];

				for(let ci in objs){
					if(objs.hasOwnProperty(ci)){
						console.log('zz', ci, queryData, queryData[ci])
						Object.assign(queryData[Number(ci)], formData);

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
					.setMethodId('WorkReportNoWork')
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

			if(event.type == 'click') event.target.blur();
		},


		isClicked: function(index){
			return (this.isClickItem == index);
		},
		isEquipmentRegistrationRepair: function(){
			const vThis = this;
			let toolStopYn = '0';
			let display = 'none';
			if(event.target.checked){
				toolStopYn = '1';
				display = 'block';	
			}
			this.listQueryForm.ToolStopYN = toolStopYn;
			document.getElementById('grid').style.display = display;
			document.getElementById('spare-parts').style.display = display;


	
			let subParams = {QryType:'ToolStop'};
			let paramList = GX.reductionItemByRows(['ActRemark','ToolStopYN','NonWorkDate','WorkStartTime','WorkEndTime','NonWorkHour','Remark','ToolSeq','ToolSerl'], [GX.deepCopy(this.listQueryForm)]);
			let params = paramList[0];
			params.NonWorkDate = (params.NonWorkDate.length > 0) ? GX.formatDate(params.NonWorkDate, 'YMD') : '';
			params.WorkStartTime = (params.WorkStartTime.length > 0) ? params.WorkStartTime.replace(/[^\d]/g, '') : '';
			params.WorkEndTime = (params.WorkEndTime.length > 0) ? params.WorkEndTime.replace(/[^\d]/g, '') : '';
			Object.assign(params, subParams);

			let addParamList = GX.reductionItemByRows(['NonWorkDate','ToolSeq','ToolSerl','WorkReportSeq'], [GX.deepCopy(this.listQueryForm)]);
			let addParams = addParamList[0];
			addParams.NonWorkDate = (addParams.NonWorkDate.length > 0) ? GX.formatDate(addParams.NonWorkDate, 'YMD') : '';
			addParams.MSerl = addParams.ToolSerl;
			Object.assign(addParams, subParams);
			
			let listQuery = GX.deepCopy(this.rows.ListQuery);
			for(let i in listQuery){
				if(listQuery.hasOwnProperty(i)){
					Object.assign(listQuery[i], addParams);
				}
			}

			GX._METHODS_
			.setMethodId('WorkReportNoWork')
			.ajax([params], listQuery, [function(data){
				if(data.length == 1 && data[0].Result == null){
					let formData = GX.deepCopy(vThis.listQueryForm);
					Object.assign(formData, data[0]);

					if(formData.NonWorkDate != null && formData.NonWorkDate.length > 0) formData.NonWorkDate = formData.NonWorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
					
					if(formData.WorkStartTime != null && formData.WorkStartTime.length > 0) formData.WorkStartTime = formData.WorkStartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
					
					if(formData.WorkEndTime != null && formData.WorkEndTime.length > 0) formData.WorkEndTime = formData.WorkEndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

					vThis.listQueryForm = formData;
				}
			},
			function(data){
				if(data.length > 1 && data[0].Result == null){
					for(let di in data){
						if(data.hasOwnProperty(di)){
							data[di].SerialNo = Number(di)+1;
							if(data[di].NonWorkDate != null && data[di].NonWorkDate.length > 0) data[di].NonWorkDate = data[di].NonWorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');

							if(data[di].Qty != null) data[di].Qty = GX.NumberType.quantity(data[0].Qty);
						}
					}

					vThis.rows.ListQuery = data;
				}
			}]);

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
console.log(tempQryType)
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

			if(this.params.QryType != null){
				if(this.params.QryType == 'SS1Db') this.fromStopProcessInquiry(this.params);
			}
			else if(this.params.WorkReportSeq != null) this.listQueryForm.WorkReportSeq = this.params.WorkReportSeq;

			var vThis = this;

			GX.VueGrid
			.bodyRow(':class="{\'check\':isChecked(index)}"')
			.item('InOutSerl', {rowspan:2}).head('<div class="chkBox"><input type="checkbox" @click="selectAll();" /></div>', '')
							.body('<div class="chkBox"><input type="checkbox" name="InOutSerl" :value="row.InOutSerl" @click="selectedMark(index);" /></div>', '')
			.item('SerialNo', {rowspan:2}).head('번호', 'num')
										//.body(null, 'num')
			.item('ItemName').head('소요자재명', '')
							//.body(null, 'item_num')
			.item('ItemNo', {colspan:2}).head('소요자재번호', '')
			.item('Spec').head('소요자재규격', '')
			.nl()
			.item('UnitName').head('단위', '')
			.item('Qty').head('수량', '')
			.item('Remark', {colspan:2}).head('비고', '')
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
			.item('WHName').head('창고명', '')
			.item('WHSeq').head('창코내부코드', '')
			.loadTemplate('#grid-whname', 'rows.wHNameListQuery');


			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});


