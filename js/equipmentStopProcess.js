var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		params: GX.getParameters(),
		rows:{
			'uMNonWorkTypeLNameListQuery':[],
			'uMNonWorkTypeSNameListQuery':[]
		},
		addForm:{
			Seq:'0',
			StopTypeName:'',
			StopType:'0',
			StopReasonName:'',
			StopReason:'0',
			StartTime:'',
			EndTime:'',
			StopContents:'',
			ProcRemark:'',
			Serl:'0',
			WorkDate:''
		},
		codeHelp:{
			UMNonWorkTypeLName:'',
			UMNonWorkTypeSName:''
		},
		codeHelpRequest:{
			//UMNonWorkTypeLName:['UMNonWorkTypeLName'],
			StopTypeName:['UMNonWorkTypeLName'],
			//UMNonWorkTypeSName:['UMNonWorkTypeSName'],
			StopReasonName:['UMNonWorkTypeSName']
		},
		codeHelpResponse:{
			//UMNonWorkTypeLName:['UMNonWorkTypeL','UMNonWorkTypeLName'],
			//UMNonWorkTypeSName:['UMNonWorkTypeS','UMNonWorkTypeSName'],
			StopTypeName:['StopType=UMNonWorkTypeL','StopTypeName=UMNonWorkTypeLName'],
			StopReasonName:['StopReason=UMNonWorkTypeS','StopReasonName=UMNonWorkTypeSName']
		},
		codeHelpDependencyKey:{
			StopTypeName:'UMNonWorkTypeLName',
			StopReasonName:'UMNonWorkTypeSName'
		},
		codeHelpGroupKey:{
			UMNonWorkTypeLName:'StopTypeName',
			UMNonWorkTypeSName:'StopReasonName'
		},
		codeHelpQryTypeMapKey:{
			StopTypeName:'UMNonWorkTypeLName',
			StopReasonName:'UMNonWorkTypeSName'
		},
		isCheckList:[],
		isClickItem:-1
	},
	methods:{
		fromEquipmentStopProcessInquiry: function(params){
			console.log(this.params);
			const vThis = this;
			GX._METHODS_
			.setMethodId('EquipNoWork')
			.ajax([params], [function(data){
				if(data.length == 1 && data[0].Result == null){
					let formData = GX.deepCopy(vThis.addForm);
					Object.assign(formData, data[0]);

					if(formData.WorkDate != null && formData.WorkDate.length > 0) formData.WorkDate = formData.WorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
					
					if(formData.StartTime != null && formData.StartTime.length > 0) formData.StartTime = formData.StartTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');
					
					if(formData.EndTime != null && formData.EndTime.length > 0) formData.EndTime = formData.EndTime.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/,'$1:$2');

					vThis.addForm = formData;
				}
			}]);

		},

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
				
				for(let i in keys) {
					if(keys.hasOwnProperty(i)) {

						keyParse = keys[i].split('=');
						dataKey = (keyParse.length == 2) ? keyParse[1] : keyParse[0];

						this.addForm[keyParse[0]] = this.rows[targetName.capitalizeFirstLetter('L') + 'ListQuery'][obj.selectedIndex][dataKey];
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
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');
			
			//this.queryForm.CompleteWishDate = GX.formatDate(GX.nowDate().full, 'Y-M-D');
			
			//var p = (GX.getParameters().p != null) ? GX.getParameters().p : 1;
			//console.log('seeeeeeeeeeeesssssssss',GX.getParameters().sa)

			if(this.params.QryType != null){
				if(this.params.QryType == 'SS1Db') this.fromEquipmentStopProcessInquiry(this.params);
			}
			else if(this.params.Seq != null && this.params.WorkDate != null) {
				this.addForm.Seq = this.params.Seq;
				this.addForm.WorkDate = this.params.WorkDate.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
			}

			const vThis = this;


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
			
			let objs = document.querySelectorAll('input');
			
			for(let oi in objs){
				if(objs.hasOwnProperty(oi)) objs[oi].setAttribute('autocomplete', 'off');
			}
		}
	}

});


