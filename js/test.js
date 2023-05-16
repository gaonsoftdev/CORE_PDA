var html5QrCode = null;
var app = new Vue({
	el: '#app',
	data:{
		queryForm: {
			test1:''
		}
	},
	methods:{
		eventCheck: function () {
            let vThis = this;
            let e = event;
			if (e.type === 'keyup' && e.key === 'Enter') {
				if (e.target.getAttribute('name') == 'test1') {
					
					let clipboardData = e.clipboardData || window.clipboardData;
					let QRCodeData = clipboardData.getData('Text');
					vThis.queryForm.test1 = QRCodeData;
					alert(QRCodeData);
				}
			}
		}
	},
	mounted(){
		
	},
	created(){
		const vThis = this;
		document.body.addEventListener('keyup', vThis.eventCheck, false);
	}

});




