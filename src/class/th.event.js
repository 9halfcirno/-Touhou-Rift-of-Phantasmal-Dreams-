export class GameEvent {
	constructor() {
		this._className = new.target.name;
		this._event = new Map();
		this._onBeforeEvent = new Map();
		this._onAfterEvent = new Map();
	}

	/* 在事件发生前 */
	// 注册
	onBeforeEvent(event, handler) {
		if (!this._onBeforeEvent.get(event)) {
			this._onBeforeEvent.set(event, []);
		}
		const handlers = this._onBeforeEvent.get(event);
		if (typeof handler === "function" && !handlers.includes(handler)) {
			handlers.push(handler);
		}
		return this;
	}
	// 注销
	offBeforeEvent(event, handler) {
		const handlers = this._onBeforeEvent.get(event);
		if (!handlers) return this;

		const index = handlers.indexOf(handler);
		if (index > -1) handlers.splice(index, 1);

		// 清理空数组
		if (handlers.length === 0) {
			this._onBeforeEvent.delete(event);
		}
		return this;
	}

	/* 在事件发生后 */
	// 注册
	onAfterEvent(event, handler) {
		if (!this._onAfterEvent.get(event)) {
			this._onAfterEvent.set(event, []);
		}
		const handlers = this._onAfterEvent.get(event);
		if (typeof handler === "function" && !handlers.includes(handler)) {
			handlers.push(handler);
		}
	}
	// 注销
	offAfterEvent(event, handler) {
		const handlers = this._onAfterEvent.get(event);
		if (!handlers) return this;

		const index = handlers.indexOf(handler);
		if (index > -1) handlers.splice(index, 1);

		// 清理空数组
		if (handlers.length === 0) {
			this._onAfterEvent.delete(event);
		}
		return this
	}

	/* 注册/发送事件*/
	registerEventHandler(name, handler, opts = {}) {
		if (!name || !handler) {
			throw new Error(`[(${this._className})Event.registerEventHandler] 缺少参数`);
		}

		const options = {
			canCancel: true,
			...opts
		};

		this._event.set(name, {
			handler,
			options
		});
		return this;
	}

	// 注销主事件
	unregisterEventHandler(name) {
		this._event.delete(name);
	}

	// 检查事件是否存在
	hasEvent(name) {
		return this._event.has(name);
	}

	// 获取所有注册的事件名
	getEventNames() {
		return Array.from(this._event.keys());
	}

	sendEvent(name, data = {}) {
		const eventObj = this._event.get(name);

		// 即使没有主事件，也使用默认选项
		const options = eventObj?.options || {
			canCancel: true
		};
		const handler = eventObj?.handler;

		// 执行前置钩子
		const beforeHandlers = this._onBeforeEvent.get(name);
		if (Array.isArray(beforeHandlers)) {
			for (const fn of beforeHandlers) {
				if (typeof fn === "function") {
					try {
						fn(name, data);
					} catch (error) {
						console.error(`[(${this._className})Event.sendEvent] 前置钩子执行错误:`, error);
					}
				}
			}
		}

		// 检查是否取消 - 即使没有主事件也保持取消机制
		if (data.cancel === true) {
			if (options.canCancel) {
				return; // 事件被取消
			} else {
				console.warn(`[(${this._className})Event.sendEvent] 无法取消事件 "${name}"`);
				// 继续执行，但移除取消标记
				delete data.cancel;
			}
		}

		// 执行主处理函数（如果有）
		if (typeof handler === "function") {
			try {
				handler(data);
			} catch (error) {
				console.error(`[(${this._className})Event.sendEvent] 主处理函数执行错误:`, error);
			}
		}

		// 执行后置钩子
		const afterHandlers = this._onAfterEvent.get(name);
		if (Array.isArray(afterHandlers)) {
			for (const fn of afterHandlers) {
				if (typeof fn === "function") {
					try {
						fn(name, data);
					} catch (error) {
						console.error(`[(${this._className})Event.sendEvent] 后置钩子执行错误:`, error);
					}
				}
			}
		}
		return data; // 返回data对象
	}

	// 清空所有事件
	clear() {
		this._event.clear();
		this._onBeforeEvent.clear();
		this._onAfterEvent.clear();
	}

	// 获取事件统计信息（用于调试）
	getEventStats() {
		return {
			mainEvents: this._event.size,
			beforeEvents: this._onBeforeEvent.size,
			afterEvents: this._onAfterEvent.size,
			mainEventNames: Array.from(this._event.keys()),
			beforeEventNames: Array.from(this._onBeforeEvent.keys()),
			afterEventNames: Array.from(this._onAfterEvent.keys())
		};
	}
}