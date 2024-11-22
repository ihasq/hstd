const
	cache = {},
	Static = new Proxy({}, {
		get: (_, prop) => {
			let result = cache[prop];
			if(!result) {
				let g = globalThis;
				prop.split("$_").forEach(x => g = g[x])
				return cache[prop] = g;
			}
			return result
		}
	})
;

export { Static }