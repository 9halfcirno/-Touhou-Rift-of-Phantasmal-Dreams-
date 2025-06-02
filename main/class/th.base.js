(function() {
	class Base {
		constructor(fullId) {
			this.thid = fullId || "default:null";
			let idObj = TH.Id.parseId(this.thid);
			this.thType = idObj.type;
			this.define = TH.Resource.getDefine(fullId);
			this[ `is${idObj.type.substring(0, 1).toUpperCase() + idObj.type.substring(1)}`] = true;
			this.uuid = TH.Tool.uuid();
		}
	};
	TH.Base = Base;
})()
