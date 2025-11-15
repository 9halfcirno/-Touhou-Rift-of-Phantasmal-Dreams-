let com = {
	name: "property.health", // 注册组件的名字
	// data参数只会初次传入，需要自行
	init(data, entity) { // data为组件的值，entity为持有该组件的实体
		if (typeof data === "number") {
			entity.setProperity("health", data)
		} else {
			console.error(`[EntityComponent]\ncomponent "th:property.health" only allow number`);
			entity.setProperity("health", 1) // 设置血量
		}
	},
	onReomve(entity) { // 传入实体
		// ？你为什么要移除生命值组件？
		// 那你实体干脆直接死吧
		entity.removeProperity("health"); // 移除生命值
		entity.die({
			cause: "th:property.healthRemoved", // 原因就是没有生命值了
			
		})
	}
}