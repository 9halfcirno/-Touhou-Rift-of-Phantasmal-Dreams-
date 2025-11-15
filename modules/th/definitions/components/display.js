let com = {
	name: "display.three",
	init(data, obj) {
		if (!obj.three) obj.three = {};
		let mat, geo;
		if (typeof data === "object" && data !== null) {
			mat = new THREE[data.material || "MeshBasicMaterial"]();
			geo = new THREE[data.geometry || "PlaneGeometry"]();
		} else if (data === "default") {
			mat = new THREE.MeshBasicMaterial();
			geo = new THREE.PlaneGeometry();
		}
		obj.three.material = mat;
		obj.three.geometry = geo;
		obj.three.mesh = new THREE.Mesh(geo, mat);
	},

	onRemove(obj) {
		obj.three.geometry.dispose(); // 释放独占的模型
		obj.three.material.dispose(); // 释放材质
		delete obj.three; // 直接删
	},

	onUpdate(obj) { // 这是网格大小适配纹理的逻辑
		if (!obj.three) return;
		let tex = obj.texture;
		if (!tex || !tex.image) return;
		let mesh = obj.three.mesh;
		const img = tex.image;
		const unit = tex.pixelsPerUnit; // 16像素 = 1单位
		const width = img.width * tex.repeat.x / unit;
		const height = img.height * tex.repeat.y / unit;
		// 调整 mesh 的缩放
		obj.three.mesh.scale.set(width, height, 1);
	}
}


/*
 * "th:display.three": {
 * 	"material": "MeshBasicMaterial",
 * 	"geometry": "PlaneGeometry",
 * }
 * 
 * 
 */