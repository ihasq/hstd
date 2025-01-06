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
		swapOf(a, b) {
			return this.swap(this.indexOf(a), this.indexOf(b))
		},

		into(transformerFn) {

		}
	},
	BOOL_TEMP = {
		switch() {
			this.$ = !this.$;
		}
	},
	intoFn = function(transformerFn) {
		const ptr = $(undefined);
		this.watch($ => ptr.$ = transformerFn($));
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
	propCache = { swap: true, swapOf: true, into: true },
	$ = (value, setterFn = setterFnTemp, options) => {
		const
			description = resolverSignature + (options?.name || ""),
			symbol = Symbol(description),
			execWatcher = watcherFn => watcherIgnoreList.get(watcherFn) ? undefined : watcherFn(value),
			afterResolved = resolvedNewValue => {
				value = resolvedNewValue
				watchers.forEach(execWatcher)
			},

			/**@type { { Function[] } } */
			watchers = [],

			/**@type { { callback: Function, timeout: number }[] } */
			timeoutedWatchers = [],

			watcherMap = new WeakMap(),
			watcherIgnoreList = new WeakMap()
		;

		return publishedPtr[symbol] = Array_isArray(value)
			? new Proxy({
				element: [],
				reverseObjectMap: new WeakMap(),
				reversePrimitiveMap: new Map(),
				length: 0,
				push(...elements) {
					elements.forEach(element => {
						const index = this.element.length;
						this.element.push(element);
						this[`reverse${"function object".includes(typeof element)? "Object" : "Primitive"}Map`].set(element, index)
					})
				},
				indexOf(searchElement, fromIndex) {
					this[`reverse${"function object".includes(typeof searchElement)? "Object" : "Primitive"}Map`].get(searchElement)?.index || -1;
				},
				into(callbackFn) {

				}

			}, {
				get(target, prop) {
					return typeof prop == "number"
						? target.element[prop]
						: prop in Array.prototype || propCache[prop]
						? target[prop]
						: undefined
					;
				}
			})
			: Object_assign(
				{
					[Symbol.toPrimitive](hint) {
						return hint === PTR_IDENTIFIER;
					},
					publish() {
						const symbol = Symbol(description);
						publishedPtr[symbol] = this;
						return symbol
					},
					watch(watcherFn, timeout) {
						if(timeout >= 0) {
							const id = setTimeout(() => watcherFn(value), timeout);
						} else {
							watcherFn(value);
						}
						watcherMap.set(watcherFn, { index: watchers.push(watcherFn) - 1, timeout });
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
						delete watchers[watcherMap.get(watcherFn).index || -1]
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
	
					into: intoFn
				},
				typeof value == "boolean" ? BOOL_TEMP : undefined,
				// "number string".includes(typeof value) ? {

				// } : undefined,
				// typeof value == "number" ? NUM_TEMP : undefined,
			)
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