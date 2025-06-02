(async function loadClass() {
	const urls = TH.CLASS.map(c => `${TH.BASE_PATH}/main/class/th.${c}.js`);
	for (let url of urls) {
		await TH.Tool.runScript(url);
	}
})()
