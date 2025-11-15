import {
	default as Constant
} from "./th.const.js"

let Texture_Manager = {
	cache: new Map(), // 键名应该是图片url
	textureUrls: new Map(), // 纹理id => url
	textureLoader: new THREE.TextureLoader(),
	load(id = "th:null") {
		return new Promise((resolve, reject) => {
			// 因为THREE.TextureLoader.load()是同步返回，所以必须用期约来等待加载完成
			if (!id.includes(":")) throw new Error(`[Texture_Manager.load] unable to determine namespace: "${id}"`);
			let url = this.textureUrls.get(id);
			if (!url) {
				console.warn(`[Texture_Manager.load] invalid url by id: "${id}"`)
			}
			let texture = this.textureLoader.load(url, tex => {
				if (tex) {
					tex.magFilter = THREE.NearestFilter;
					tex.minFilter = THREE.NearestFilter;
					tex.textureId = id; // 在材质中保存id
					tex.pixelsPerUnit = 16;
					this.cache.set(url, tex); // 在缓存中保存它
					resolve(tex);
				}
			}, () => {}, reject)
		})
	},
	async loadAllTextures() {
		console.groupCollapsed(`[Texture_Manager] 开始载入所有纹理`);
		let texs = [];
		for (let id of this.textureUrls.keys()) {
			try {
				texs.push(await this.load(id));
				console.log(`已载入: "${id}"\n${this.textureUrls.get(id)}`)
			} catch (e) {
				console.error(`无法载入: "${id}"\n${this.textureUrls.get(id)}`)
			}
		};
		console.groupEnd();
		return texs;
	},
	get(id) {
		if (!id) return;
		if (!id.includes(":")) {
			console.error(`[Texture_Manager.get] unable to determine namespace: "${id}"`);
			return this.cache.get(this.textureUrls.get("th:null"))
		}
		let tex = this.cache.get(this.textureUrls.get(id)).clone();
		tex.textureId = id; // 在材质中保存id
		tex.pixelsPerUnit = 16;
		return tex;
	},
}

export {
	Texture_Manager
}