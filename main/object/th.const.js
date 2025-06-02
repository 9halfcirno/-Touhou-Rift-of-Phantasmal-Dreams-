window.TH = window.TH || {}; // 「東方幻夢鄉」全局命名空间
TH.RunFrame = 0;
TH.CLASS = ["effect"]
TH.ALL_PATH = ["th"];
TH.PATH = "th";
TH.BASE_PATH = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
TH.GAME = { // 東方幻夢鄉 使用的属性
	CAMERA_INCLINATION: Math.PI / -3, // 相机倾角
	PLANE_INCLINATION: 0, // 地图(平面)倾角
	PLACEMENT_INCLINATION: Math.PI / -3, // 植物，实体，弹幕等倾角
	MAP_MAX_VISIBLE_WIDTH: 20, // 最大可见宽度 竖屏减半
}
TH.THREE = { // THREE 使用的属性
	TextureLoader: new THREE.TextureLoader(), // 材质加载器
	TexturesMap: new Map(), // 材质缓存映射
	Images: new Map()
}
TH.THREE.Images.set('error', TH.THREE.TextureLoader.load('res/test.jpg'));