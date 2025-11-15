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
	Object2D
} from "./th.object.js"

export class Entity extends Object2D {
	constructor(id, ex) {
		super("entity", id);
		this.definition = Definition_Manager.get("entity", id);
		this.three.rotation.x = Setting.get("object2d_tilt");
		
		// 实体属性
		this.properities = new Map();
		
		// 注册实体死亡事件处理
		this.registerEventHandler("die", this._handleSucDie);
	}
	
	getProperity(k) {
		return this.properities.get(k)
	}
	
	setProperity(k, v) {
		return this.properities.set(k, v)
	}
	
	removeProperity(k) {
		return this.properities.remove(k)
	}
	
	addComponent(com) { //添加组件
	
	}
	
	removeComponent(com) { // 移除组件
	
	}
	
	move(){}
	
	die(args) {
		this.sendEvent("die", {
			cause: args.cause || "unknown",
			by: args.by || "system"
		})
	}
	
	_handleSucDie() { // 处理成功死亡(未阻止)
		// 移除
		
	}
}