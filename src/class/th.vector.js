import {
	Setting
} from "../object/th.setting.js"

export let Vector2 = THREE.Vector2;
export let Vector3 = THREE.Vector3;

// 该坐标为游戏内坐标，非THREE场景坐标
export class Position extends Vector3 {
	constructor(x = 0, y = 0, z = 0) {
		super(x, y, z);
	}
	// 获取相对坐标
	getRelativePos(obj) {
		let px, py, pz;
		if (obj instanceof Object) {
			({
				x: px,
				y: py,
				z: pz
			} = obj.position);
		} else if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
			({
				x: px,
				y: py,
				z: pz
			} = obj);
		} else {
			throw new Error('TH.Position(class): getRelativePos: 参数必须是 Entity 或者具有 x,y,z 的对象');
		}
		return new Position(this.x - px, this.y - py, this.z - pz);
	}

	// 转为THREE坐标（考虑倾斜角和z轴方向）
	toTHREE() {
		const a = Setting.get("y_tilt");
		// 游戏y轴投影到THREE的y和z轴
		// THREE的z轴方向与游戏相反，取反
		return new THREE.Vector3(
			this.x,
			this.y * Math.cos(a),
			this.y * Math.sin(a) - this.z
		);
	}

	static fromTHREE(v) {
		const a = Setting.get("y_tilt");
		// 反向投影并转换为游戏坐标系
		return new Position(
			v.x,
			v.y / Math.cos(a),
			v.y * Math.tan(a) - v.z
		);
	}
}