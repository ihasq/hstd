const
	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
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
					// args.forEach(arg => isPtr(arg) ? )
					return this.into(newValue => newValue[x].apply(newValue, args))
				}
			}))
	),
	TEMP = {
		boolean: createPrimitiveTemplate(Boolean, {
			switch() {
				this.$ = !this.$;
			},
			branch(ifTrue, ifFalse) {
				return this.into(x => x ? ifTrue : ifFalse);
			}
		}),
		number: createPrimitiveTemplate(Number),
		string: createPrimitiveTemplate(String)
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
	isPtr = (maybePtr) => !!(maybePtr?.[Symbol.toPrimitive]?.(PTR_IDENTIFIER)),

	createPrimitivePtr = () => {

	},

	createObjectPtr = (obj) => {
		const propCache = {}
		return new Proxy(obj, {
			get(target, prop) {
				let ptr = propCache[prop];
				if(!ptr) {
					ptr = propCache[prop] = $("");
				}
				return ptr;
			},
			set(target, prop, value) {
				if(isPtr(value)) {
					value.watch(x => target[prop] = x)
				} else {
					target[prop] = value;
				}
			}
		});
	},

	createPtr = (value, setterFn = setterFnTemp, options) => {

		const
			description = resolverSignature + (options?.name || ""),
			symbol = Symbol(description),
			typeofValue = typeof value,
			execWatcher = watcherFn => watcherIgnoreList.get(watcherFn) ? undefined : watcherFn(value),
			afterResolved = resolvedNewValue => {
				value = resolvedNewValue
				watchers.forEach(execWatcher)
			},

			/**@type { { Function[] } } */
			watchers = [],

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
		: */Object.assign(
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
					watcherMap.set(watcherFn, { index: watchers.push(watcherFn) - 1, timeout });
					return this;
				},
				ignore: {
					set(watcherFn) {
						watcherIgnoreList.set(watcherFn, !1);
					},
					delete(watcherFn) {
						watcherIgnoreList.set(watcherFn, !0);
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
			TEMP[typeofValue]
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
		: "function object".includes(typeof x)
		? createObjectPtr(s)
		: createPtr(s, ...v)
;

let resolverSignature;

while((resolverSignature = String.fromCharCode(...resolverSignatureGenCB())) in globalThis);

Object.defineProperty(globalThis, resolverSignature, {
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