import {
	Scene
} from "./th.scene.js"
import {
	Position
} from "./th.vector.js"
import {
	Setting
} from "../object/th.setting.js"

export class Camera {
	constructor(args = {}) {
		this.three = new THREE.PerspectiveCamera(args.fov || 60,
			args.aspect || (window.innerWidth / window.innerHeight),
			args.near || 0,
			args.far || 500);
		window.addEventListener('resize', () => {
			this.three.aspect = args.aspect || window.innerWidth / window.innerHeight;
			this.three.updateProjectionMatrix();
		}); // 配置three相机
		this.three.rotation.x = Setting.get('y_tilt')
	}
}