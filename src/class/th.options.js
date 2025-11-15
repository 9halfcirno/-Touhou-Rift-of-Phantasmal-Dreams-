export class Options {
	constructor(map) {
		this._map = new Map(map);
	}
	newOption(key, type, name, args = {}) {
		if (typeof key != "string" || typeof type != "string") throw new Error("TH.Options.newOption(): invalid key or type");
		let option = {
			type: type, // 类型
			name: name ?? "default" // 外显名字
		};
		switch (type) {
			// 开关
			case Options.optionType.switch:
				option.value = args.value ?? args.default ?? false;
				break;
				// 数值范围，滑条
			case Options.optionType.range:
				option.max = args.max ?? 100;
				option.min = args.min ?? 0;
				option.value = args.value ?? args.default ?? 0;
				break;
				// 列表
			case Options.optionType.menu:
				option.menu = args.menu ?? args.list ?? ["default"];
				option.value = args.value ?? args.default ?? "default";
				break;
			// 输入框
			case Options.optionType.input:
				// 只接受的值的类型
				option.valueType = args.type || Options.valueType.string;
				option.value = args.value ?? args.default ?? "";
				break;
			default:
				break;
		};
		this._map.set(key, option);
		return this;
	}
	get(key) {
		return this._map.get(key);
	}
	
	set(key, value) {
		let option = this._map.get(key);
		if(!key) throw new Error(`TH.Options.set(): cannot set undefined option: "${key}"`);
		let type = option.type;
		if (type == Options.optionType.switch && typeof value !== "boolean") throw new Error(`TH.Options.set(): invalid value "${value}" on setting "${key}"`);
		if (type == Options.optionType.range && typeof value !== "number") throw new Error(`TH.Options.set(): invalid value "${value}" on setting "${key}"`);
		if (type == Options.optionType.input && typeof value !== "string") throw new Error(`TH.Options.set(): invalid value "${value}" on setting "${key}"`);
		this._map.set(key, value);
	}
}
Options.optionType = {
	input: "input",
	menu: "menu",
	range: "range",
	switch: "switch",
	text: "text",
};
Options.valueType = {
	string: "string"
}
