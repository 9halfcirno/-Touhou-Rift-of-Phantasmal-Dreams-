import {
	default as Constant
} from "./th.const.js"

import {
	IO
} from "./th.io.js"
import {
	Definition_Manager as DM
} from "./th.definition_manager.js"
import {
	Texture_Manager as TM
} from "./th.texture_manager.js"
import {
	Resource_Manager as RM
} from "./th.resource_manager.js"

let Module_Manager = {
	modules: new Map(),
	async importModule(id) {
		let getJSON = async url => {
			try {
				return JSON.parse(await IO.readFile(url).then(r => r.text()));
			} catch (e) {
				return {}
			}
		}
		let moduleUrl = `${Constant.BASE_URL}/modules/${id}`;
		let moduleObject = {};
		let moduleInfo = await getJSON(`${moduleUrl}/module_info.json`);
		if (moduleInfo) {
			let must = ["module_id", "namespace", "version"]; // 这是必须的属性
			let missing = [];
			for (let k of must) {
				if (!moduleInfo[k]) {
					missing.push(k);
				};
			}
			if (missing.length > 0) {
				throw new Error(`[Module_Manager.importModule]\n模块"${id}"缺少必要的属性: ${missing.join(", ")}`)
			}
		}
		if (this.modules.has(moduleInfo.module_id)) {
			throw new Error(`[Module_Manager.importModule]\n重复的模块: "${moduleInfo.module_id}"`)
		}
		let definitions = await loadDefinitions();
		let resources = await loadResources();
		async function loadDefinitions() {
			let definitions = {};
			let defList = [ // 要加载的东西
				"tiles",
				"entities",
				"maps",
				"plants"
			]
			for (let key of defList) {
				try {
					let list = await getJSON(`${moduleUrl}/definitions/${key}/.list.json`);
					definitions[key] = {
						_list: list[key]
					};
					for (let file of list[key]) {
						let fileUrl = `${moduleUrl}/definitions/${key}/${file}.json`;
						let def = await getJSON(fileUrl);
						definitions[key][file] = def;
					}
				} catch (e) {};
			};
			return definitions;
		};

		async function loadResources() { // 这只是载入资源定义，而不是真正加载资源
			let resources = {};
			let res = [
				"audios",
				"models",
				"textures"
			];
			/* 如:
					textures/
						textures.json
						tiles/
							water.png
						characters/
							reimu/
								reimu.png
				 这样的文件结构
			*/
			for (let f of Object.values(res)) { // 遍历所有资源文件夹
				// f 是资源文件夹名(string)，f2 是分类文件夹名(Array)
				let resUrl = `${moduleUrl}/resources/${f}`;
				let list = await getJSON(`${resUrl}/${f}.json`);
				if (f === "textures") resources[f] = Object.assign({
					pixelsPerUnit: list.pixelsPerUnit,
				}, list.textures);
				else resources[f] = list[f]
			};
			return resources;
		}
		moduleObject = {
			moduleInfo,
			moduleUrl,
			definitions,
			resources
		};
		this.modules.set(moduleInfo.module_id, moduleObject);
		console.log(`[Module_Manager.importModule]\n成功加载模块: "${id}"`, moduleObject);
	},
	getModule(id) {
		return this.modules.get(id);
	},
	getAllModules() {
		return [...this.modules.values()];
	},
	loadAllModules() { // 加载已经导入的模组文件
		let modules = this.getAllModules() // 获取模组文件
		modules.sort((a, b) => {
			a = a.moduleInfo.options?.load_priority ?? 999;
			b = b.moduleInfo.options?.load_priority ?? 999;
			return a - b;
		}); // 按优先级排序
		for (let i = 0, n = modules.length; i < n; i++) {
			let module = modules[i]; // 获取模块
			let moduleUrl = module.moduleUrl;
			/* 载入定义 */
			let definitions = module.definitions;
			if (definitions) {
				let typeMap = { // 将复数转为单数的
					"tiles": "tile",
					"entities": "entity",
					"maps": "map",
					"plants": "plant"
				}
				for (let k of Object.keys(definitions)) { // 遍历所有type，k是type
					for (let [n, d] of Object.entries(definitions[k])) { // 遍历所有定义，n是属性名(不用)，d是definition
						if (n === "_list") continue; // 跳过列表
						let id = d.id.includes(":") ?
							d.id :
							`${module.moduleInfo.namespace}:${d.id}`;
						let type = typeMap[k];
						//console.log(`${type}.${id}`)
						// 将定义注册到Definition_Manager
						DM.set(type, id, d);
					};
				};
			};

			/* 载入纹理 */
			let textures = module.resources;
			let kind = {
				"tiles": "tile",
				"plants": "plant",
				"entities": "entity",
				"characters": "character"
			}
			let textureUrl = `${moduleUrl}/resources/textures`
			for (let t of Object.values(textures)) { // 分类
				if (!t) continue;
				for (let [k2, t2] of Object.entries(t)) {
					if (typeof t2 !== "object") continue;
					for (let [id, u] of Object.entries(t2)) {
						let texId = `${module.moduleInfo.namespace}:${kind[k2]}_${id}`;
						TM.textureUrls.set(texId, `${textureUrl}/${u}.png`)
					}
				}
			}
		};
		console.log(`[Module_Manager] 已加载所有模块`, DM.getAllDefintions())
	}
}

export {
	Module_Manager
}