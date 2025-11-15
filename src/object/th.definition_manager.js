let Definition_Manager = {
	definitions: new Map(), // 存放所有定义内容，以ns分类，xx:xxx = {...}
	get(type, id) {
		if (typeof type !== "string") throw new Error(`[Definition_Manager.get] invalid type: "${type}"`)
		if (!id.includes(":")) throw new Error(`[Definition_Manager.get]\nunable to determine namespace of "${id}" `);
		if (!this.definitions.has(type)) return undefined;
		
		let ns = id.slice(0, id.indexOf(":"))
		id = id.slice(id.indexOf(":") + 1)
		if (this.definitions.get(type).has(ns)) {
			return this.definitions.get(type).get(ns).get(id)
		}
		console.warn(`[Definition_Manager.get]\ncannot find definition: "${id}" in "${type}"`)
		return undefined;
	},
	set(type, id, def = {}) {
		if (typeof type !== "string") throw new Error(`[Definition_Manager.set]\ninvalid type: "${type}"`);
		if (!id.includes(":")) throw new Error(`[Definition_Manager.set]\nunable to determine namespace of "${id}" `);
		if (!this.definitions.has(type)) this.definitions.set(type, new Map())
		let ns = id.slice(0, id.indexOf(":"))
		id = id.slice(id.indexOf(":") + 1)
		if (this.definitions.get(type).has(ns)) {
			this.definitions.get(type).get(ns).set(id, def)
		} else {
			this.definitions.get(type).set(ns, new Map([
				[id, def]
			]))
		}
		return this;
	},
	
	// 获取所有定义
	getAllDefintions() {
		let d = {};
		for (let [t, dmap] of this.definitions.entries()) { // 获取所有type
			let d2 = {};
			for (let [n, ds] of dmap.entries()) {
				// n是命名空间，ds是该命名空间的定义
				for (let [k, v] of ds.entries()) {
					d2[`${n}:${k}`] = v;
				}
			}
			d[t] = d2;
		}
		return d;
	}
}

export {
	Definition_Manager
}