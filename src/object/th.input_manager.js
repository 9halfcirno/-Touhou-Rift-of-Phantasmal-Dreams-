let Input_Manager = {
	commandsMap: new Map(), // 存放commands
	init() { // 初始化事件注册，转为游戏内动作
		window.addEventListener("keydown", e => {
			let spK = [];
			if (e.altKey) spK.push("alt");
			if (e.shiftKey) spK.push("shift");
			if (e.ctrlKey) spK.push("ctrl");
			this.action({
				type: "keydown",
				command: `key:${e.key}/${e.repeat ? 'repeat' : 'down'}/${spK.length > 0 ? spK.join() : ""}`,
				event: e
			})
		});
		window.addEventListener("pointerdown", e => {
			this.action({
				type: "pointerdown",
				pointerId: e.pointerId,
				pointerType: e.pointerType,
				isPrimary: e.isPrimary,
				isAlt: e.altKey,
				isShift: e.shiftKey,
				x: e.clientX,
				y: e.clientY,
			})
		});
		window.addEventListener("pointermove", e => {
			this.action({
				type: "pointermove",
				pointerId: e.pointerId,
				pointerType: e.pointerType,
				isPrimary: e.isPrimary,
				isAlt: e.altKey,
				isShift: e.shiftKey,
				x: e.clientX,
				y: e.clientY,
				dx: e.movementX,
				dy: e.movementY,
			})
		})
	},
	action(e) {
		if (e.command) console.log(e.command)
	}
}

export {Input_Manager}