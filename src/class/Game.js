import {
	Scene
} from "./th.scene.js"
import {
	Camera
} from "./th.camera.js"
import {
	Position
} from "./th.vector.js"
import {
	Setting
} from "../object/th.setting.js"

class Game {
	constructor(args = {}) {
		this.threeRenderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.threeRenderer.setSize(args.width || window.innerWidth, args.height || window.innerHeight);
		this.threeRenderer.setClearColor(0x000000);
		this.threeRenderer.setPixelRatio(window.devicePixelRatio)
		document.getElementById(args.output).appendChild(this.threeRenderer.domElement);

		let camera = new Camera({
			fov: 64,
			near: 0.1,
			far: 1000,
			aspect: (args.width || window.innerWidth) / (args.height || window.innerHeight)
		});
		
		this.nowCamera = camera;
		camera.three.position.set(0, 10, 10);
		const controls = new THREE.OrbitControls(camera.three, this.threeRenderer.domElement);
		this.cameraContronls = controls;

		this.scene = new Scene();
		this.scene.three.add(this.nowCamera.three);
		console.log(`[Game]\ngame对象已注入globalThis`, this);
	}

	render() {
		this.threeRenderer.render(this.scene.three, this.nowCamera.three)
	}
	
	update() {
		this.scene.update();
	}
}

export {
	Game
}

//
//   _______________________________
//  /\                              \
// /++\    __________________________\
// \+++\   \ ************************/
//  \+++\   \___________________ ***/
//   \+++\   \             /+++/***/
//    \+++\   \           /+++/***/
//     \+++\   \         /+++/***/
//      \+++\   \       /+++/***/
//       \+++\   \     /+++/***/
//        \+++\   \   /+++/***/
//         \+++\   \ /+++/***/
//          \+++\   /+++/***/
//           \+++\ /+++/***/
//            \+++++++/***/
//             \+++++/***/
//              \+++/***/
//               \+/___/
// 
//