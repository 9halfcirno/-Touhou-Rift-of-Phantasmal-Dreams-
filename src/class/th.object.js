import {
	Setting
} from "../object/th.setting.js"
import {
	Texture_Manager
} from "../object/th.texture_manager.js"
import {
	Definition_Manager
} from "../object/th.definition_manager.js"
import {
	Position
} from "./th.vector.js"
import {
	GameEvent
} from "./th.event.js"

class ObjectD extends GameEvent {
	constructor() {
		super();
		this._className = new.target.name; // 调试信息用
		this.three = null;
		this.position = new Position(0, 0, 0); // 设置坐标
		this.father = null; // 存储父容器信息
	}

	createThreeMesh(geo, mat) { // 创建mesh方法
		this.three = new THREE.Mesh(geo, mat);
	}

	get textureId() { // 返回texture的id
		return this.texture.textureId
	}
	set textureId(newid) { // 设置这个值会直接修改材质引用
		if (this.texture.textureId === newid) return;
		let newTex = Texture_Manager.get(id);
		if (newTex) {
			this.texture = newTex
		}
	}

	get texture() {
		return this.three.material.map;
	}

	set texture(t) {
		if (!t || !(t instanceof THREE.Texture)) {
			console.warn(`[(${this._className})Object.set texture]\ninvalid texture`);
			return; // 无效修改
		};
		t.magFilter = THREE.NearestFilter;
		t.minFilter = THREE.NearestFilter;
		this.three.material.map = t;
	}

	updateThreePosition() {
		// 只同步坐标，不处理模型位移(交给子类)
		this.three.position.copy(this.position.toTHREE())
	}
}

// 这个类是其他在three.js中显示的2d物体的类
export class Object2D extends ObjectD {
	constructor(type, id, args = {}) {
		super();
		let geo = new THREE.PlaneGeometry(1, 1);
		let mat = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			transparent: true, // 使纹理透明
			alphaTest: true // 防止透明像素遮挡后方
		});
		this.createThreeMesh(geo, mat); // 创建mesh
		this.definition = Definition_Manager.get(type, id);
		this.texture = Texture_Manager.get(this.definition.texture);
	}

	/*  */
	disposeThree() {
		this.three.geometry.dispose();
		this.three.material.dispose();
	}

	/* 显示相关 */

	get texture() {
		return super.texture
	}

	set texture(t) {
		super.texture = t;
		this._resizeMeshByTexture();
		return this;
	}

	_resizeMeshByTexture() { // 应该考虑repeat
		let tex = this.texture;
		if (!tex || !tex.image) return;
		const img = tex.image;
		const unit = tex.pixelsPerUnit; // 16像素 = 1单位
		const width = img.width * tex.repeat.x / unit;
		const height = img.height * tex.repeat.y / unit;
		// 调整 mesh 的缩放
		this.three.scale.set(width, height, 1);
	}

	updateThreePosition() {
		super.updateThreePosition();
		this._fixThreePosition();
	}

	_fixThreePosition() { // 修正网格位置
		if (this.three) {
			const height = this.texture.image.height * this.texture.repeat.y / this.texture.pixelsPerUnit;
			let tilt = Setting.get("object2d_tilt");
			this.three.position.y += Math.cos(tilt) * height / 2;
			this.three.position.z += Math.sin(tilt) * height / 2;
		}
	}
}