export const Tools = {
	getAttributesBySeparation(obj, str, sep) {
		let ats = str.split(sep); // 获取属性访问列表
		let at;
		for (let i = 0, n = ats.length; i < n; i++) {
			if (at) at = at[ats[i]];
			else at = obj[ats[i]];
			if (at === undefined) return undefined;
		};
		return at;
	},
	getAttributesByArray(obj, arr) {
		let at;
		for (let i = 0, n = arr.length; i < n; i++) {
			if (at) at = at[arr[i]];
			else at = obj[arr[i]];
			if (at === undefined) return undefined;
		};
		return at;
	},
	uuid(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [],
			i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) uuid[i] = chars[0 || Math.random() * radix];
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	},
	checkHex(color) {
		return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color) ||
			/^0x([A-Fa-f0-9]{3}){1,2}$/i.test(color);
	},
	runScript(url, onsuccess, onerror, p = {}) {
		return new Promise((resolve, reject) => {
			if (!url || typeof url != 'string') reject(new Error(`TH.Tool.runScript(): invalid url`));
			let script = document.createElement('script');
			script.async = p.async;
			script.defer = p.defer;
			script.src = url;
			script.onload = e => {
				if (p.temp != false) script.remove()
				if (onsuccess) onsuccess(e);
				resolve(e);
			};
			script.onerror = e => {
				if (p.temp != false) script.remove();
				if (onerror) onerror(e);
				reject(e);
			};
			document.head.append(script);
		});
	},
};
