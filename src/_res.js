let res = {
	textures: {
		test: {
			type: 'image',
			value: 'res/test.jpg',
		},
		test2: {
			type: 'image',
			value: 'res/test2.jpg',
		},
		blocks: {
			error: {
				type: 'color',
				value: '#ff0000',
			},

			stone: {
				type: 'color',
				value: '#afafaf',
			},
			water: {
				type: 'image',
				value: 'res/water.png',
			}
		},
		entity: {
			player: {
				stand_front: {
					type: 'image',
					value: 'res/reimu.png',
				},
				_stand_front: {
					type: 'sheet',
					value: 'res/player.png',
					animation: [{
							offset: new THREE.Vector2(0, 0),
							repeat: new THREE.Vector2(1 / 12, 1 / 8),
							waitTime: 15,
						},
						{
							offset: new THREE.Vector2(1 / 8, 0),
							repeat: new THREE.Vector2(1 / 12, 1 / 8),
							waitTime: 15,
						},
						{
							offset: new THREE.Vector2(2 / 8, 0),
							repeat: new THREE.Vector2(1 / 12, 1 / 8),
							waitTime: 15,
						}
					]
				},
				walk_front: {
					type: 'color',
					value: '#efefef',
				}
			}
		}
	}
};
window.TH = window.TH || {}
window.TH.res = {};

window.TH.res.texture = {
	textures: res,
	textureMap: {
		block: {
			test: res.textures.test,
			test2: res.textures.test2,
			error: res.textures.blocks.error,
			stone: res.textures.blocks.stone,
			water: res.textures.blocks.water
		},
		entity: {
			player: {
				stand: {
					front: res.textures.entity.player.stand_front
				},
				walk: {
					front: res.textures.entity.player.walk_front
				}
			}
		}
	}
}
