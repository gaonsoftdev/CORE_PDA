var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		deptName:'',
		userName:'',
		pageUrls:GX._DATAS_.pageUrls,
		params: GX.getParameters(),
		clusterIndexes:[],
		clustering: {},
		menu: [{PgmMinorSeq:'1'}, {PgmMinorSeq:'2'}],
	},
	methods:{
		goPage: function(url){
			location.href = url;
		},
		logout: function(){
			GX.Cookie.set('UserId', '', 0);
			GX.Cookie.set('UserSeq', '', 0);
			GX.Cookie.set('UserName', '', 0);
			GX.Cookie.set('EmpSeq', '', 0);
			GX.Cookie.set('DeptName', '', 0);
			GX.Cookie.set('DeptSeq', '', 0);
			GX.Cookie.set('CompanySeq', '', 0);

			GX.Cookie.set('WkTeamName', '', 0);
			GX.Cookie.set('WkTeamSeq', '', 0);
			GX.Cookie.set('UMWkTypeName', '', 0);
			GX.Cookie.set('UMWkType', '', 0);
			GX.Cookie.set('WorkCenterName', '', 0);
			GX.Cookie.set('WorkCenterSeq', '', 0);

			GX.Cookie.set('PackageWorkCenterName', '', 0);
			GX.Cookie.set('PackageWorkCenterSeq', '', 0);

			location.href = 'login.html';
		},scanBarCode: function(){
			var vThis = this;
			let clipboardData = event.clipboardData || window.clipboardData;
			if(clipboardData != null){
				let QRCodeData = clipboardData.getData('Text');

				if(QRCodeData.includes('MO')){
					GX.Storage.set('MoveNo',QRCodeData);
					location.href = 'movingShipmentProcessing.html';
				}else if(QRCodeData.includes('IV')){
					GX.Storage.set('InvoiceNo',QRCodeData);
					location.href = 'specificationShipmentProcessing.html';
				}
				
			}
		}

	},
	updated(){


		

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
		GX.Storage.set('MoveNo','');
		GX.Storage.set('InvoiceNo','');
	},
	created(){
		//console.log('created xxxx '+document.querySelector('.menu-wrap').children[0].clientWidth);
		if(!GX._METHODS_.isLogin()) location.replace('login.html');
		else {
			this.deptName = GX.Cookie.get('DeptName');
			this.userName = GX.Cookie.get('UserName');
			//console.log('aaaaaaaaaaaa' + this.userName);
			//GX.SpinnerBootstrap.init();
			GX.SpinnerBootstrap.init('loading', 'loading-wrap', '<div class="container"><img src="img/loading.gif" alt=""><span>처리중입니다...</span></div>');

			document.body.addEventListener('paste', this.scanBarCode, false);

			//var p = (GX.getParameters().p != null) ? GX.getParameters().p : 1;
			var vThis = this;

			let callbacks = [
				function (data) {
					}
			];
			let clusterIndexes = [];
			let clustering = {};
			let obj = null;
			let data = this.menu;

			

			for(let i in data){
				if(data.hasOwnProperty(i)){
					obj = vThis.pageUrls[data[i].PgmMinorSeq];
					if(obj != null) {
						data[i].pageUrl = obj.link;
						data[i].iconImg = obj.icon + '?v=20220923';//+Date.now();
						data[i].groupTitle = obj.groupTitle;
						data[i].subTitle = obj.subTitle;

						if(clusterIndexes.indexOf(obj.groupTitle) == -1){
							clusterIndexes.push(obj.groupTitle);
						}

						if(clustering[obj.groupTitle] == null) clustering[obj.groupTitle] = [];
						clustering[obj.groupTitle].push(data[i]);
					}
				}
			}

			vThis.clusterIndexes = clusterIndexes;
			vThis.clustering = clustering;

					
				

			// GX._METHODS_
			// .setMethodId('Main')
			// .ajax([{QryType:'Main'}], callbacks);

		}
	}
});
