const tween = {
	linear: x => x,
	
	easeInSine: x => 1 - Math.cos((x * Math.PI) / 2),
	easeOutSine: x => Math.sin((x * Math.PI) / 2),
	easeInOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,

	easeInQuad: x => x * x,
	easeOutQuad: x => 1 - (1 - x) * (1 - x),
	easeInOutQuad: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,

	easeInCubic: x => x ** 3,
	easeOutCubic: x => 1 - Math.pow(1 - x, 3),
	easeInOutCubic: x => x < 0.5 ? 4 * (x ** 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,

	easeInQuart: x => x ** 4,
	easeOutQuart: x => 1 - Math.pow(1 - x, 4),
	easeInOutQuart: x => x < 0.5 ? 8 * (x ** 4) : 1 - Math.pow(-2 * x + 2, 4) / 2,

	easeInQuint: x => x ** 5,
	easeOutQuint: x => 1 - Math.pow(1 - x, 5),
	easeInOutQuint: x => x < 0.5 ? 16 * (x ** 5) : 1 - Math.pow(-2 * x + 2, 5) / 2,

	easeInExpo: x => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
	easeOutExpo: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
	easeInOutExpo: x => x === 0 ?
		0 :
		x === 1 ?
		1 :
		x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
		(2 - Math.pow(2, -20 * x + 10)) / 2,

	easeInCirc: x => 1 - Math.sqrt(1 - Math.pow(x, 2)),
	easeOutCirc: x => Math.sqrt(1 - Math.pow(x - 1, 2)),
	easeInOutCirc: x => x < 0.5 ?
		(1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 :
		(Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,

	easeInBack: x =>{
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return c3 * x * x * x - c1 * x * x;
	},
	easeOutBack: x =>{
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
	},
	easeInOutBack: x =>{
		const c1 = 1.70158;
		const c2 = c1 * 1.525;
		return x < 0.5 ?
			(Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 :
			(Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
	},

	easeInElastic: x =>{
		const c4 = (2 * Math.PI) / 3;
		return x === 0 ?
			0 :
			x === 1 ?
			1 :
			-Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
	},
	easeOutElastic: x =>{
		const c4 = (2 * Math.PI) / 3;
		return x === 0 ?
			0 :
			x === 1 ?
			1 :
			Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
	},
	easeInOutElastic: x =>{
		const c5 = (2 * Math.PI) / 4.5;
		return x === 0 ?
			0 :
			x === 1 ?
			1 :
			x < 0.5 ?
			-(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 :
			(Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
	},

	_easeOutBounce(x) {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	easeInBounce: x => 1 - tween._easeOutBounce(1 - x),
	easeOutBounce: x => tween._easeOutBounce(x),
	easeInOutBounce: x => x < 0.5 ?
		(1 - tween.easeOutBounce(1 - 2 * x)) / 2 :
		(1 + tween.easeOutBounce(2 * x - 1)) / 2
}
window.tween = tween;