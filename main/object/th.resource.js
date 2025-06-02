(function() {
	"use strict"
	window.TH = window.TH || {};
	//TH.Resource对象负责管理贴图、音频、模型、实例定义等需要加载的资源
	//TH.Resource对象为资源的定义，参见TH.Resource.["image"/"audio"/"model"]
	//图片资源一律以 texture 命名
	//音频资源一律以 audio 命名
	//模型资源一律以 model 命名/模型使用???
	//遵循id参数后跟type等参数
	//遵循命名一律用单数
	//属性尽量混用大小写
	//一律使用TH.ID表示资源
	window.TH.Resource = {
		//loader
		resourceLoader: {
			texture: new THREE.TextureLoader(),
			audio: new THREE.AudioLoader(),
			model: new THREE.ObjectLoader()
		},
		//缓存映射
		resourceCache: {
			texture: new Map(),
			audio: new Map(),
			model: new Map(),
		},
		// 获取资源定义的方法
		// 根据 TH.ID 解析访问 TH.Resource
		getDefine(fullId) {
			// 解析id
			let idObj;
			if (fullId === "default:null") idObj = {
				path: "default",
				type: "null",
				parts: ["default", "null"],
			};
			else idObj = TH.Id.parseId(fullId);

			let pathDef = TH.Define[idObj.path];
			if (!pathDef) {
				console.log(TH.Define.th);
				throw new Error(`TH.Resource.getDefineById(): path "${idObj.path}" is not defined in TH.Define`);
			};
			return TH.Tool.getAttributesByArray(pathDef, idObj.parts.slice(1)) || (function() {
				console.warn(`TH.Resource.getDefineById(): cannot find define, return {}`)
				return TH.Resource.getDefine(`default:${idObj.type}`);
			})(); // 无定义返回空对象
		},
		loadDefine(fullId) {
			return new Promise((resolve, reject) => {
				// 解析id
				let idObj = TH.Id.parseId(fullId);
				// 不是定义的话就reject
				if (idObj.type != 'define') {
					reject(new Error(`TH.Resource.loadDefine(): not a define id: ${fullId}`));
				};
				let path = idObj.path;
				// 如果path有定义就直接resolve
				let pathDef = TH.Define[path];
				// path未定义
				if (!pathDef) reject(new Error(`TH.Resource.loadDefine(): path "${path}" is undefined`));
				// path定义了，type是否定义？
				let type = idObj.type;
				let typeDef = TH.Define[path][type];
				if (typeDef && typeof typeDef === 'object') {
					resolve(typeDef);
					return;
				};
				// 否则加载定义
				let url = `${TH.BASE_PATH}/resources/${path}/defines/${idObj.parts.slice(2).join('_')}.js`;
				TH.Tool.runScript(url,
					() => {
						typeDef = TH.Define[path][type];
						if (!typeDef || (typeof typeDef != "object")) reject(new Error(`TH.Resource.loadDefine(): path"${path}".type"${type}" had loaded, but not defined`));
						else resolve(typeDef);
					},
					e => {
						console.error(e);
						reject(new Error(`TH.Resource.loadDefine(): err on loading "${url}"`));
					}
				);
				return;
			});
		},
		// 期约这一块我也懒得打注释了
		loadPath(path) {
			return new Promise((resolve, reject) => {
				if (!path) return reject(new Error(`TH.Resource.loadPath(): no path`));
				let url = `${TH.BASE_PATH}/resources/${path}/init.js`
				TH.Tool.runScript(url,
					async () => {
							TH.ALL_PATH.push(path);
							let pathDef = TH.Define[path];
							if (!pathDef || (typeof pathDef != "object")) reject(new Error(`TH.Resource.loadPath(): path"${path}" had loaded, but not defined`));
							else {
								await Promise.all(
									pathDef.defines.map(async (f) => {
										let url = `${TH.BASE_PATH}/resources/${path}/defines/${f}`
										await TH.Tool.runScript(url);
									}));
							};
							resolve()
						},
						e => {
							console.error(e);
							reject(new Error(`TH.Resource.loadPath(): err on loading "${url}"`));
						}
				);
			});
		},

		// 将资源加入缓存中
		setCache(fullId, res) {
			let idObj = TH.Id.parseId(fullId);
			// 不缓存其他东西
			if (!['texture', 'audio', 'model'].includes(idObj.type)) {
				throw new Error(`TH.Resource.setCache(): cannot cache resource of type "${idObj.type}"`);
			};
			let define = TH.Resource.getDefine(fullId);
			if (!define || typeof define != 'object') throw new Error(`TH.Resource.setCache(): ${fullId} is not a object`);
			TH.Resource.resourceCache[idObj.type].set(fullId, res)
		},
		getCache(fullId) {
			let idObj = TH.Id.parseId(fullId);
			if (!['texture', 'audio', 'model'].includes(idObj.type)) {
				throw new Error(`TH.Resource.setCache(): cannot cache resource of type "${idObj.type}"`);
			};
			return TH.Resource.resourceCache[idObj.type].get(fullId);
		},
		hasCache(fullId) {
			let idObj = TH.Id.parseId(fullId);
			if (!['texture', 'audio', 'model'].includes(idObj.type)) {
				throw new Error(`TH.Resource.setCache(): cannot cache resource of type "${idObj.type}"`);
			};
			return TH.Resource.resourceCache[idObj.type].has(fullId);
		},
		deleteCache(fullId) {
			let idObj = TH.Id.parseId(fullId);
			if (!['texture', 'audio', 'model'].includes(idObj.type)) {
				throw new Error(`TH.Resource.setCache(): cannot cache resource of type "${idObj.type}"`);
			};
			return TH.Resource.resourceCache[idObj.type].delete(fullId);
		},
		clearCache(type) {
			if (!['texture', 'audio', 'model'].includes(type)) return;
			return TH.Resource.resourceCache[type].clear();
		},
		// 加载资源方法
		// 此为异步操作
		async loadTexture(fullId = "default:texture", onsuccess = () => {}, onerror = () => {}, args = {}) {
			let idObj = TH.Id.parseId(fullId);
			if (idObj.type != 'texture') throw new Error(`TH.Resource.loadTexture(): cannot cache texture of type "${idObj.type}"`);
			let define = TH.Resource.getDefine(fullId);
			if (!define || typeof define != 'object') throw new Error(`TH.Resource.loadTexture(): ${fullId} is not a object`);
			let url = `${TH.BASE_PATH}/resources/textures/${define.url.startsWith('/') ? define.url.substring(1) : define.url}`
			return new Promise((resolve, reject) => {
				if (!args.nocache && TH.Resource.hasCache(fullId)) {
					let res = TH.Resource.getCache(fullId);
					onsuccess(res);
					resolve(res);
				};
				TH.Resource.resourceLoader.texture.load(url, res => {
					TH.Resource.setCache(fullId, res);
					onsuccess(res);
					resolve(res);
				}, e => {
					console.warn(`TH.Resource.loadTexture(): cannot load texture from url "${url}"`);
					onerror(e);
					resolve(TH.Resource.getCache("default:texture"));
				});
			})
		},
		async loadAudio(fullId = "default:audio", onsuccess = () => {}, onerror = () => {}, args = {}) {
			let idObj = TH.Id.parseId(fullId);
			if (idObj.type != 'audio') throw new Error(`TH.Resource.loadAudio(): cannot cache audio of type "${idObj.type}"`);
			let define = TH.Resource.getDefine(fullId);
			if (!define || typeof define != 'object') throw new Error(`TH.Resource.loadAudio(): ${fullId} is not a object`);
			let url = `${TH.BASE_PATH}/resources/audios/${define.url.startsWith('/') ? define.url.substring(1) : define.url}`
			return new Promise((resolve, reject) => {
				if (!args.nocache && TH.Resource.hasCache(fullId)) {
					let res = TH.Resource.getCache(fullId);
					onsuccess(res);
					resolve(res);
				};
				TH.Resource.resourceLoader.audio.load(url, res => {
					TH.Resource.setCache(fullId, res);
					onsuccess(res);
					resolve(res);
				}, e => {
					console.warn(`TH.Resource.loadAudio(): cannot load audio from url "${url}"`);
					onerror(e);
					resolve(TH.Resource.getCache("default:audio"));
				});
			})
		},
		async loadModel(fullId = "default:model", onsuccess = () => {}, onprogress = () => {}, onerror = () => {}, args = {}) {
			let idObj = TH.Id.parseId(fullId);
			if (idObj.type != 'model') throw new Error(`TH.Resource.loadModel(): cannot cache model of type "${idObj.type}"`);
			let define = TH.Resource.getDefine(fullId);
			if (!define || typeof define != 'object') throw new Error(`TH.Resource.loadModel(): ${fullId} is not a object`);
			let url = `${TH.BASE_PATH}/resources/models/${define.url.startsWith('/') ? define.url.substring(1) : define.url}`
			return new Promise((resolve, reject) => {
				if (!args.nocache && TH.Resource.hasCache(fullId)) {
					let res = TH.Resource.getCache(fullId);
					onsuccess(res);
					resolve(res);
				};
				TH.Resource.resourceLoader.model.load(url, (res) => {
						TH.Resource.setCache(fullId, res);
						onsuccess(res);
						resolve(res);
					},
					p => {
						onprogress(p);
					},
					e => {
						console.warn(`TH.Resource.loadModel(): cannot load model from url "${url}"`);
						onerror(e);
						resolve(TH.Resource.getCache("default:model"));
					});
			})
		},
	}
})()