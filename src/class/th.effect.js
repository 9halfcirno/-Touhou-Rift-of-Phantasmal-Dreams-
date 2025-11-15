/**
*	effect 对象行为
*	创建时:
		从传入的args加载实例所需的数据
		从define中获取一些args中没有的默认数据
		不会在创建时调用自身.onbegin()方法
	触发时:
		将自己推入实体的效果列表
		若实体为玩家操控，刷新显示
		调用.begin()方法
		记录自身的生效时间
	持续时:
		调用.effect()方法
	结束时:
		将自己从实体的效果列表移除
		若实体为玩家操控，刷新显示
		调用.end()方法
	叠加时:
		依据自己的.stackType属性来决定
*/
export class Effect {
	constructor(fullId = 'default:effect', args = {}) {
		this.uuid = args.uuid || this.uuid
		this.level = args.level ?? 1; // 效果等级
		this.duration = args.duration ?? this.definition.defaultDuration ?? 0; // 效果持续时间
		this.elapsedTime = this.elapsedTime || this.duration;
		this.sender = args.sender || new TH.Entity('default:entity_null');
		this.target = args.target || new TH.Entity('default:entity_null');
		this.stackType = this.definition.stackType || Effect.default.stackType.cover;
		this.state = args.state || 'ready';
		this._pause = args.pause || false;
	}
	setLevel(lv) {
		this.level = lv;
	}
	setElapsedTime(t) {
		let e = this.elapsedTime;
		this.duration += (e > t ? e : t) - e;
		this.elapsedTime = t;
	}
	// 叠加效果
	stack(newEffect) {
		if (!(newEffect instanceof Effect) || newEffect.thType != "effect") throw new Error(`TH.Effect.stack(): object must instance of TH.Effect`);
		switch (this.stackType) {
			case Effect.default.stackType.cover:
				this.target.addEffect(newEffect);
				this.target.removeEffect(this);
				break;
			case Effect.default.stackType.timeCover:
				this.elapsedTime = newEffect.elapsedTime;
				break;
			case Effect.default.stackType.levelCover:
				this.level = newEffect.level;
				break;
			case Effect.default.stackType.timeStack:
				this.elapsedTime += newEffect.elapsedTime;
				break;
			case Effect.default.stackType.levelStack:
				this.level += newEffect.level;
				break;
			case Effect.default.stackType.allStack:
				this.elapsedTime += newEffect.elapsedTime;
				this.level += newEffect.level;
				break;
			case Effect.default.stackType.coexist:
				newEffect.target = this.target;
				this.target.addEffect(newEffect);
				break;
			case Effect.default.stackType.define:
				if (this.definition.onstack) return this.definition.onstack.call(this, this, newEffect);
				else Effect.default.onstack.call(this, this, newEffect);
				break;
			default:
				// do nothing
				break;
		}
	}
	trigger(target, sender) {
		if (target instanceof TH.Entity) this.target = target;
		if (sender instanceof TH.Entity) this.sender = sender;
		this.state = 'ready';
		this.begin();
	}
	update() {
		if (this.state != 'ing') return;
		if (this._pause) return;
		if (this.elapsedTime <= 0) {
			this.end();
		} else {
			this.effect();
			this.elapsedTime--; // 自动更新剩余时间
		}
	}
	// 效果开始
	begin() {
		if (this.state != 'ready') return;
		this.beginTime = TH.RunFrame; // 自动记录触发时间
		this.target.addEffect(this); // 自动把自身推入目标的效果列表
		if (this.definition.onbegin) return this.definition.onbegin.call(this, this);
		else Effect.default.onbegin.call(this, this);
		this.state = 'ing';
	}
	// 效果持续
	effect() {
		if (this.definition.oneffect) return this.definition.oneffect.call(this, this);
		else Effect.default.oneffect.call(this, this);
	}
	// 效果结束
	end() {
		if (this.definition.onend) return this.definition.onend.call(this, this);
		else Effect.default.onend.call(this, this);
		this.target.removeEffect(this) // 移除效果
		if (this.target.controller === TH.Entity.controller.player) { // 若为玩家操控，则更新显示
			this.target.updateEffectDisplay();
		};
		this.state = 'end';
	}
	pause() {
		this._pause = true;
	}
	pursue() {
		this._pause = false;
	}
	forceStop() {
		this.end();
	}
	clone() {
		return new Effect(this.thid, {
			duration: this.duration,
			elapsedTime: this.elapsedTime,
			level: this.level,
			state: this.state,
			target: this.target,
			sender: this.sender,
			pause: this.pause,
			beginTime: this.beginTime,
		});
	}
	toJSON() {
		let json = {};
		json.define = this.thid;
		json.level = this.level;
		json.duration = this.duration;
		json.elapsedTime = this.elapsedTime;
		json.uuid = this.uuid;
		json.target = this.target.uuid;
		json.sender = this.sender.uuid;
		json.pause = this._pause;
		json.beginTime = this.beginTime;
		return JSON.stringify(json);
	}
	static fromJSON(j) {
		if (!j || typeof j != 'object') throw new Error(`TH.Effect.fromJSON(): invalid json`);
		let json = JSON.parse(j);
		if (json.thType != 'effect') throw new Error(`TH.Effect.fromJSON(): cannot load effect by type "${json.thType}"`);
		return new Effect(json.define, {
			duration: json.duration,
			elapsedTime: json.elapsedTime,
			level: json.level,
			state: json.state,
			uuid: json.uuid,
			target: TH.Entity.getEntityByUUID(json.target),
			sender: TH.Entity.getEntityByUUID(json.sender),
			pause: json.pause,
			beginTime: json.beginTime,
		});
	}
}
Effect.default = {
	onbegin(effect) {
		// do nothing now
	},
	oneffect(effect) {
		// do nothing now
	},
	onend(effect) {
		// do nothing now
	},
	onstack(effect, newEffect) {
		// do nothing now
	},
	stackType: {
		cover: 'cover',
		timeCover: 'timeCover',
		levelCover: 'levelCover',
		timeStack: 'timeStack',
		levelStack: 'levelStack',
		allStack: 'allStack',
		coexist: 'coexist',
		define: 'define',
	},
};