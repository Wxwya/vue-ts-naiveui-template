// 字体图标 url
const cssCdnUrlList = ["https://cdn.jsdelivr.net/npm/vfonts@0.0.3/Lato.css","https://cdn.jsdelivr.net/npm/vfonts@0.0.3/FiraCode.css"];
// 第三方 js url https://raw.githubusercontent.com/iconify/icon-sets/refs/heads/master/json/
const jsCdnUrlList = [];
// 使用到的图标库
const iconifyLib = ["solar"];
// 动态批量设置字体图标
export function setCssCdn() {
	if (cssCdnUrlList.length <= 0) return false;
	cssCdnUrlList.map((v) => {
		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = v;
		link.crossOrigin = 'anonymous';
		document.getElementsByTagName('head')[0].appendChild(link);
	});
}

// 动态批量设置第三方js
export function setJsCdn() {
	if (jsCdnUrlList.length <= 0) return false;
	jsCdnUrlList.map((v) => {
		let link = document.createElement('script');
		link.src = v;
		document.body.appendChild(link);
	});
}


export function isIconType(icon){
  if (icon.startsWith("icon-")) { 
    return "ali"
  }
  if (iconifyLib.some(prefix => icon.startsWith(prefix))) { 
    return "iconify"
	}
	return "local"
}

