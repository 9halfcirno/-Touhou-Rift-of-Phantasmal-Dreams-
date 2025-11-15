
export default {
	RunFrame: 0,
	ALL_PATH: ["th"],
	PATH: "th",
	BASE_URL: window.location.href.substring(0, window.location.href.lastIndexOf("/")),
	GAME: { // 東方幻夢鄉 使用的属性
		CAMERA_INCLINATION: Math.PI / -3, // 相机倾角
		PLANE_INCLINATION: 0, // 地图(平面)倾角
		PLACEMENT_INCLINATION: Math.PI / -3, // 植物，实体，弹幕等倾角
		MAP_MAX_VISIBLE_WIDTH: 20, // 最大可见宽度 竖屏减半
	}
}