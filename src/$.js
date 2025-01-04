const
	{
		Array: { isArray: Array_isArray },
		Object: { assign: Object_assign, defineProperty: Object_defineProperty, freeze: Object_freeze },
		globalThis: GLOBALTHIS
	} = globalThis,
	RAF = GLOBALTHIS.requestAnimationFrame,
	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
	// NUM_TEMP = {
	// 	to(destination, duration, curve) {
	// 		if(!RAF) return this;
			
	// 	}
	// },
	ARR_TEMP = {
		/**
		 * 
		 * @param { number } a 
		 * @param { number } b 
		 */
		swap(a, b) {
			let buf = this[a];
			this[a] = this[b];
			this[b] = buf;
			return this;
		},

		/**
		 * 
		 * @param { any } a 
		 * @param { any } b 
		 */
		swapBy(a, b) {
			return this.swap(this.indexOf(a), this.indexOf(b))
		},
	},
	into = function(transformerFn) {
		const ptr = $(undefined);
		this.watch($ => ptr.$ = $);
		return ptr;
	},
	setterFnTemp = $ => $,
	resolverSignatureGenCB = function*(length = 52) {
		let buf;
		for(let i = 0; i < length; i++) {
			buf = Math.floor(Math.random() * 31)
			yield 0x7f + buf + (buf > 0x8d) + (buf > 0x9c)
		}
	},
	publishedPtr = {},
	$ = (value, setterFn = setterFnTemp, options) => {
		const
			description = resolverSignature + (options?.name || ""),
			symbol = Symbol(description),
			execWatcher = watcherFn => watcherIgnoreList.get(watcherFn) ? undefined : watcherFn(value),
			afterResolved = resolvedNewValue => {
				value = resolvedNewValue
				watchers.forEach(execWatcher)
			},
			watchers = [],
			watcherMap = new WeakMap(),
			watcherIgnoreList = new WeakMap()
		;

		return publishedPtr[symbol] = Array_isArray(value)
			? Object_assign(
				value,
				ARR_TEMP
			)
			: Object_freeze(Object_assign(
				{
					[Symbol.toPrimitive](hint) {
						if(hint === 0x0001) {
							const symbol = Symbol(description);
							publishedPtr[symbol] = this;
							return symbol
						}
						return hint === PTR_IDENTIFIER;
					},
					watch(watcherFn) {
						watcherFn(value);
						watcherMap.set(watcherFn, watchers.push(watcherFn) - 1);
						return this;
					},
					ignore: {
						set(watcherFn) {
							watcherIgnoreList.set(watcherFn, true);
						},
						delete(watcherFn) {
							watcherIgnoreList.set(watcherFn, false);
						},
					},
					abort(watcherFn) {
						delete watchers[watcherMap.get(watcherFn) || -1]
					},
					get setter() {
						return setterFn
					},
					get $() {
						return value
					},
					set $(newValue) {
						newValue = setterFn(newValue);
						if(newValue instanceof Promise) {
							newValue.then(afterResolved)
						} else if(value !== newValue) {
							value = newValue;
							watchers.forEach(execWatcher)
						}
					},
	
					into
				},
				// "number string".includes(typeof value) ? {

				// } : undefined,
				// typeof value == "number" ? NUM_TEMP : undefined,
			))
	}
;

let resolverSignature;

while((resolverSignature = String.fromCharCode(...resolverSignatureGenCB())) in globalThis) {};

Object_defineProperty(globalThis, resolverSignature, {
	value: (symbol) => publishedPtr[symbol],
	configurable: false,
	enumerable: false
});

/**
 * 
 * @param { number | string | any[] } value 
 * @param { Function } setterFn 
 * @param { object } options 
 * @returns { object }
 */
export { $ };