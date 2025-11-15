import {Entity} from "./th.entity.js"

class Component {
	constructor(opts) {
		this._useOn = opts.useTarget || null; // 作用对象
		this.method = opts.method || () => {}; // 触发时执行的方法
	}
}

class EntityComponent extends Component{
	constructor(opts) {
		if (!(opts.entity instanceof Entity)) console.error(`[EntityComponent]\ntarget is not instance of Entity`);
		super({
			useTarget: opts.entity,
			method: opts.method,
			
		});
	}
}

EntityComponent.components = new Map(); // 实体组件映射