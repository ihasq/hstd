const
	{
		// Array: { isArray: Array_isArray },
		Object: { assign: Object_assign, defineProperty: Object_defineProperty, freeze: Object_freeze },
		globalThis: GLOBALTHIS
	} = globalThis,
	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
	// NUM_TEMP = {
	// 	to(destination, duration, curve) {
	// 		if(!RAF) return this;
			
	// 	}
	// },
	// ARR_TEMP = {
	// 	/**
	// 	 * 
	// 	 * @param { number } a 
	// 	 * @param { number } b 
	// 	 */
	// 	swap(a, b) {
	// 		let buf = this[a];
	// 		this[a] = this[b];
	// 		this[b] = buf;
	// 		return this;
	// 	},

	// 	/**
	// 	 * 
	// 	 * @param { any } a 
	// 	 * @param { any } b 
	// 	 */
	// 	swapOf(a, b) {
	// 		return this.swap(this.indexOf(a), this.indexOf(b))
	// 	},

	// 	into(transformerFn) {

	// 	}
	// },
	UNIVERSAL_TEMP = {
		into(transformerFn) {

			const
				ptr = $(transformerFn(this.$)),
				ancestor = this
			;
	
			this.watch($ => ptr.$ = transformerFn($));
	
			return Object.assign(ptr, { ancestor });
		},
		refresh() {
			this.$ = this.$
		}
	},
	createPrimitiveTemplate = ({ prototype }, base = {}) => Object.assign(
		base,
		...Reflect.ownKeys(prototype)
			.filter(x => x != "constructor")
			.map(x => ({
				[x](...args) {
					return this.into(newValue => newValue[x].apply(newValue, args))
				}
			}))
	),
	BOOL_TEMP = createPrimitiveTemplate(Boolean, {
		switch() {
			this.$ = !this.$;
		},
		branch(ifTrue, ifFalse) {
			return this.into(x => x ? ifTrue : ifFalse);
		}
	}),
	NUM_TEMP = createPrimitiveTemplate(Number),
	STR_TEMP = createPrimitiveTemplate(String),
	setterFnTemp = $ => $,
	resolverSignatureGenCB = function*(length = 52) {
		let buf;
		for(let i = 0; i < length; i++) {
			buf = Math.floor(Math.random() * 31)
			yield 0x7f + buf + (buf > 0x8d) + (buf > 0x9c)
		}
	},
	publishedPtr = {},
	isPtr = (maybePtr) => maybePtr?.[Symbol.toPrimitive]?.(PTR_IDENTIFIER),

	createPtr = (value, setterFn = setterFnTemp, options) => {

		const
			typeofValue = typeof value,
			description = resolverSignature + (options?.name || ""),
			symbol = Symbol(description),
			execWatcher = watcherFn => watcherIgnoreList.get(watcherFn) ? undefined : watcherFn(value),
			afterResolved = resolvedNewValue => {
				value = resolvedNewValue
				watchers.forEach(execWatcher)
			},

			/**@type { { Function[] } } */
			watchers = [],

			// /**@type { { callback: Function, timeout: number }[] } */
			// timeoutedWatchers = [],

			watcherMap = new WeakMap(),
			watcherIgnoreList = new WeakMap()
		;

		return publishedPtr[symbol] = /**Array_isArray(value)
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
		: */Object_assign(
			{
				[Symbol.toPrimitive](hint) {
					return (typeof hint) == "symbol" ? hint === PTR_IDENTIFIER : symbol;
				},
				publish() {
					const symbol = Symbol(description);
					publishedPtr[symbol] = this;
					return symbol
				},
				watch(watcherFn, timeout) {
					// if(typeof timeout == "number") {
					// 	const id = setTimeout(() => watcherFn(value), timeout);
					// } else {
					// 	watcherFn(value);
					// }
					watcherMap.set(watcherFn, { index: watchers.push(watcherFn) - 1, timeout });
					return this;
				},
				ignore: {
					set(watcherFn) {
						watcherIgnoreList.set(watcherFn, !0);
					},
					delete(watcherFn) {
						watcherIgnoreList.set(watcherFn, !1);
					},
				},
				abort(watcherFn) {
					delete watchers[watcherMap.get(watcherFn).index || -1]
				},
				until(value) {
					let watcherFn;
					return new Promise(resolveWait => this.watch(watcherFn = newValue => {
						if(typeof value == "function" ? value(newValue) : newValue === value) {
							this.abort(watcherFn);
							resolveWait(newValue);
						};
					}))
				},
				get setter() {
					return setterFn
				},
				get $() {
					return value
				},
				set $(newValue) {
					if(typeof newValue !== typeofValue) return;
					newValue = setterFn(newValue);
					if(newValue instanceof Promise) {
						newValue.then(afterResolved)
					} else if(value !== newValue) {
						value = newValue;
						watchers.forEach(execWatcher)
					}
				},

				text() {
					const textNode = new Text(this.$);
					this.watch(newValue => textNode.textContent = newValue);
					return [textNode];
				},
			},
			UNIVERSAL_TEMP,
			typeofValue == "boolean" ? BOOL_TEMP : !1,
			typeofValue == "number" ? NUM_TEMP : !1,
			typeofValue == "string" ? STR_TEMP : !1,
		)
	},

	createTemplate = (s, v) => {

		const temp = [];

		s.forEach((sBuf, sIndex) => temp[sIndex * 2] = sBuf);

		v.forEach((vBuf, vIndex) => {

			const tempIndex = (vIndex * 2) + 1;

			temp[tempIndex] = isPtr(vBuf)
				? (vBuf.watch(newValue => {
					temp[tempIndex] = newValue;
					ptr.$ = temp.join("")
				}), vBuf.$)
				: String(vBuf)

		})

		const ptr = createPtr(temp.join(""));

		return ptr;

	},

	isFrozenArray = (x) => Array.isArray(x) && Object.isFrozen(x),

	$ = (s, ...v) => isFrozenArray(s) && isFrozenArray(s.raw)
		? createTemplate(s, v)
		: createPtr(s, ...v)
;

let resolverSignature;

while((resolverSignature = String.fromCharCode(...resolverSignatureGenCB())) in globalThis) {};

Object_defineProperty(globalThis, resolverSignature, {
	value: (symbol) => publishedPtr[symbol],
	configurable: !1,
	enumerable: !1
});

/**
 * 
 * @param { number | string | any[] } value 
 * @param { Function } setterFn 
 * @param { object } options 
 * @returns { object }
 */
export { $, isPtr };