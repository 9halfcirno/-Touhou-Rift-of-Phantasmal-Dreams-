import * as TH from "./th.main.js";
globalThis.TH = TH;

let stats = new THREE.Stats();
stats.setMode(0);
stats.domElement.style.left = window.innerWidth - 80 + 'px';
stats.domElement.style.top = '0px';
document.body.append(stats.domElement);

TH.Input_Manager.init()

await TH.Module_Manager.importModule('th');
TH.Module_Manager.loadAllModules();
await TH.Texture_Manager.loadAllTextures();

let game = new TH.Game({
	output: "game",
	height: window.innerHeight / 1.6
})
globalThis.game = game
game.scene.loadGameMap("th:main")
game.scene.switchGameMap("th:main")

//let object = new TH.Object2D("entity", "th:reimu")
//game.scene.three.add(object.three.mesh)
//console.log(object.texture.repeat)
let entity = new TH.Entity("th:reimu")
game.scene.nowGameMap.addEntity(entity)

render()

function render() {
	stats.update()
//	entity.position.x += Math.random() * 0.2 - 0.1;
	game.update();
	game.render();
	game.cameraContronls.update()
	requestAnimationFrame(render)
}

let move = {
	up() {
		entity.position.z+=0.5;
	},
	down() {
		entity.position.z-=0.5;
	},
	left() {
		entity.position.x-=0.5;
	},
	right() {
		entity.position.x+=0.5;
	},
}
for (let [f, f2] of Object.entries(move)) {
	document.getElementById(f).onclick = f2;
}