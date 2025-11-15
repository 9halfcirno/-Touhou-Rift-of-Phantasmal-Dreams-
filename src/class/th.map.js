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

export class GameMap extends GameEvent {
	constructor(mapData) {
		super();
		this.tilesData = mapData.tiles_data || [];
		this.plantsData = mapData.plants_data || [];
		this.tilesKey = mapData.tiles;
		this.plantsKey = mapData.plants;

		this.three = {};
		this.three.group = new THREE.Group();
		this.three.tilesGroup = new THREE.Group(); //存储瓦片
		this.three.tilesGroup.position.y -= 1.5;
		this.three.plantsGroup = new THREE.Group(); // 存储植物
		this.three.entitiesGroup = new THREE.Group(); // 存储实体

		this.entitiesList = []; // Entity数组
		this.plantsList = []; // 植物数组

		this.three.group.add(this.three.tilesGroup);
		this.three.group.add(this.three.plantsGroup);
		this.three.group.add(this.three.entitiesGroup);

		this.registerEventHandler("createMap", () => {
			console.time("[GameMap]\ncreate map");
			this.createTiles();
			this.createPlants();
			console.timeEnd("[GameMap]\ncreate map");
		}, {
			canCancel: false
		});
	}

	update() {
		this.updateObjectDThreePosition();
	}

	get rowLength() {
		return this.tilesData.length;
	}
	get colLength() {
		return Math.max.apply(null, this.tilesData.map(c => c.length))
	}

	createTiles() {
		let tiles = this.tilesData;

		// 创建瓦片类型映射
		let tilesMeshMap = new Map();

		// 第一步：先统计每种瓦片类型的数量
		let tileCounts = new Map();
		for (let y = 0; y < tiles.length; y++) {
			let row = tiles[y];
			for (let x = 0; x < row.length; x++) {
				let tileChar = row[x];
				let type = this.tilesKey[tileChar];
				if (type) {
					tileCounts.set(type, (tileCounts.get(type) || 0) + 1);
				}
			}
		}

		// 第二步：为每种瓦片类型创建InstancedMesh
		tileCounts.forEach((count, type) => {
			let def = Definition_Manager.get("tile", type);
			if (!def) return;
			let tileGeo = new THREE.BoxGeometry(1, 1, def.components?.["th:height"] || 1) // new THREE.PlaneGeometry(1, 1);
			let tileTex = Texture_Manager.get(def?.texture || "th:null");

			// 设置纹理过滤
			if (tileTex) {
				tileTex.magFilter = THREE.NearestFilter;
				tileTex.minFilter = THREE.NearestFilter;
			}

			let tileMat = new THREE.MeshLambertMaterial({
				map: tileTex,
				side: THREE.FrontSide,
				transparent: true,
			});

			// 创建InstancedMesh，指定正确的实例数量
			let im = new THREE.InstancedMesh(tileGeo, tileMat, count);
			im.receiveShadow = true;
			im.castShadow = true;
			im.name = `tiles_${type}`;
			tilesMeshMap.set(type, {
				mesh: im,
				index: 0 // 用于跟踪当前实例索引
			});
		});

		for (let y = 0; y < tiles.length; y++) {
			let row = tiles[y];
			for (let x = 0; x < row.length; x++) {
				let tileChar = row[x];
				let type = this.tilesKey[tileChar];
				let def = Definition_Manager.get("tile", type);

				if (!type || !tilesMeshMap.has(type)) continue;

				let meshInfo = tilesMeshMap.get(type);
				let instancedMesh = meshInfo.mesh;
				let currentIndex = meshInfo.index;

				let position = new Position(x + 0.5, 0, y + 0.5);

				let tempObj = new THREE.Object3D();
				tempObj.position.copy(position.toTHREE()).y = (def?.components?.["th:height"] + 1 || 1) / 2;
				tempObj.rotation.x = Setting.get("tile_tilt"); // 使用设置中的倾斜角度

				tempObj.updateMatrix();
				instancedMesh.setMatrixAt(currentIndex, tempObj.matrix);
				// 更新索引
				meshInfo.index = currentIndex + 1;
			}
		}

		// 第四步：更新所有InstancedMesh并添加到组中
		tilesMeshMap.forEach(meshInfo => {
			meshInfo.mesh.instanceMatrix.needsUpdate = true;
			this.three.tilesGroup.add(meshInfo.mesh);
		});
	}

	createPlants() {
		let plants = this.plantsData;

		// 创建瓦片类型映射
		let plantsMeshMap = new Map();

		// 第一步：先统计每种瓦片类型的数量
		let plantCounts = new Map();
		for (let y = 0; y < plants.length; y++) {
			let row = plants[y];
			for (let x = 0; x < row.length; x++) {
				let plantChar = row[x];
				let type = this.plantsKey[plantChar];
				if (type) {
					plantCounts.set(type, (plantCounts.get(type) || 0) + 1);
				}
			}
		}

		// 第二步：为每种瓦片类型创建InstancedMesh
		plantCounts.forEach((count, type) => {
			let plantGeo = new THREE.PlaneGeometry(1, 1);
			let plantTex = Texture_Manager.get(Definition_Manager.get("plant", type)?.texture || "th:null");
			// 设置纹理过滤
			if (plantTex) {
				plantTex.magFilter = THREE.NearestFilter;
				plantTex.minFilter = THREE.NearestFilter;
			}

			let plantMat = new THREE.MeshLambertMaterial({
				map: plantTex,
				side: THREE.DoubleSide,
				transparent: true,
				alphaTest: true
			});

			// 创建InstancedMesh，指定正确的实例数量
			let im = new THREE.InstancedMesh(plantGeo, plantMat, count);
			im.receiveShadow = true;
			im.castShadow = true;
			im.name = `plants_${type}`;
			plantsMeshMap.set(type, {
				mesh: im,
				index: 0 // 用于跟踪当前实例索引
			});
		});

		for (let y = 0; y < plants.length; y++) {
			let row = plants[y];
			for (let x = 0; x < row.length; x++) {
				let plantChar = row[x];
				let type = this.plantsKey[plantChar];

				if (!type || !plantsMeshMap.has(type)) continue;
				let def = Definition_Manager.get("plant", type)
				let meshInfo = plantsMeshMap.get(type);
				let instancedMesh = meshInfo.mesh;
				let currentIndex = meshInfo.index;

				let tile;
				if (this.getTileAt(x, y)) tile = Definition_Manager.get("tile", this.getTileAt(x, y));
				else tile = Definition_Manager.get("tile", this.getTileAt(0, 0));

				let position = new Position(x + 0.5, 0, y + 0.5);
				let tempObj = new THREE.Object3D();
				tempObj.position.copy(position.toTHREE()).y = (tile?.components?.["th:height"] || 1) - Math.cos(Setting.get("placement_tilt")) * 1.5;
				tempObj.rotation.x = Setting.get("placement_tilt"); // 使用设置中的倾斜角度

				tempObj.updateMatrix();
				instancedMesh.setMatrixAt(currentIndex, tempObj.matrix);
				// 更新索引
				meshInfo.index = currentIndex + 1;
			}
		}

		// 更新所有InstancedMesh并添加到组中
		plantsMeshMap.forEach(meshInfo => {
			meshInfo.mesh.instanceMatrix.needsUpdate = true;
			this.three.plantsGroup.add(meshInfo.mesh);
		});
	}

	getTileAt(x, z) {
		return this.tilesKey[this.tilesData[z][x]];
	}

	addEntity(ent) {
		ent.father = this; // 保存地图引用
		this.entitiesList.push(ent);
		this.three.entitiesGroup.add(ent.three);
	}

	removeEntity(ent) {
		let index = this.entitiesList.indexOf(ent);
		this.entitiesList.splice(index, 1);
		this.three.entitiesGroup.remove(ent.three.mesh)
	}

	updateObjectDThreePosition() { // 调用ObjectXD的updateThreePosition来调整自己的网格坐标
		this.entitiesList.forEach(e => {
			e.updateThreePosition();
		})
	}
}