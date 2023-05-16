(function(u,p,l,m,v,n,b,o,c){l=function(i){return i.length},m=location.pathname.match(/\/([^\/\.]+\.)html$/i);if(m!=null&&m.length==2)u.push(p+m[1]+'js');v='?v='+Date.now(),n='script',d=document,b=d.getElementsByTagName(n),o=b[l(b)-1],c=function(e,s){if(l(u)>0){s=d.createElement(n),s.src=u[0]+v,s.onload=c,s.defer=true,o.appendChild(s),o.parentNode.insertBefore(s,o)}u.shift()};c(null)})([
	'js/vue.js',
	'js/axios.min.js',
	'js/jquery-3.6.0.js',
	'js/gx.js',
	'js/common.js',
	'js/AppBridge.js',
	'js/html5-qrcode.min.js'
],'js/');