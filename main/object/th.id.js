window.TH = window.TH || {};
TH.Id = {
	// 将上下文可推断id扩展为完整id
	expandId(id, type, path) {
		if (!id) throw new Error(`TH.Id.expandId(): invalid id`)
		// id为fullId
		if (id.includes(":")) return id;
		if(path) return path + ":" + type + "_" + id;
		if(type) return TH.PATH + ":" + type + "_" + id;
		return TH.PATH + ":" + "unknown_" + id;
	},
	isFullId(id) {
		return id.includes(':')
	},
	parseId(id, t, p) {
		let fullId = TH.Id.expandId(id, t, p);
		let path = fullId.substring(0, fullId.indexOf(":"));
		let idParts = fullId.substring(fullId.indexOf(":") + 1).split("_");
		let type = idParts[0];
		let others = idParts.slice(1);
		return {
			path: path,
			type: type,
			parts: [path].concat(idParts)
		}
	},
};