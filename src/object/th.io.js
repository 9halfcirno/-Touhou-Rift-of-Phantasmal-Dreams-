let IO = {
	readFile(...args) {
		if (fetch) {
			return fetch(...args)
		}
	}
}
export {
	IO
}