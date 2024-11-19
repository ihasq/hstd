const
	{
		Array: { from: Array_from, isArray: Array_isArray },
		Object: { assign: Object_assign, defineProperty: Object_defineProperty, freeze: Object_freeze },
		Symbol: { dispose: Symbol_dispose, toPrimitive: Symbol_toPrimitive },
		globalThis: GLOBALTHIS
	} = globalThis,
	RAF = GLOBALTHIS.requestAnimationFrame,
	DISPOSER_TEMP = {
		[Symbol_dispose]() {

		}
	},
	PRIM_TEMP = {
		into(transformerFn) {
			const ptr = $(undefined);
			this.watch($ => ptr.$ = $);
			return ptr;
		}
	},
	NUM_TEMP = {
		to(destination, duration, curve) {
			if(!RAF) return this;

		}
	},
	ARR_TEMP = {

	},
	setterFnTemp = $ => $,
	resolverSignatureGenObj = { length: 16 },
	resolverSignatureGenCB = () => {
		let buf = Math.floor(Math.random() * 31)
		return 0x7f + buf + (buf > 0x8d) + (buf > 0x9c) 
	},
	publishedPtr = {},
	UNDEFINED = undefined
;

let resolverSignature;

while((resolverSignature = String.fromCharCode.apply(null, Array_from(resolverSignatureGenObj, resolverSignatureGenCB))) in GLOBALTHIS) {};

Object_defineProperty(GLOBALTHIS, resolverSignature, {
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
export const $ = (value, setterFn = setterFnTemp, options) => {
	const
		symbol = Symbol(resolverSignature + (options?.name || "")),
		execWatcher = watcherFn => watcherFn(value),
		afterResolved = resolvedNewValue => {
			value = resolvedNewValue
			watchers.forEach(execWatcher)
		},
		watchers = [],
		watcherMap = new WeakMap()
	;
	return publishedPtr[symbol] = Object_freeze(Object.assign.apply(
		null,
		[
			{
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
						watchers.forEach(execWatcher)
					}
				},
				[Symbol_toPrimitive](hint) {
					return hint === Symbol.for("PTR_IDENTIFIER") ? true : symbol;
				},
				watch(watcherFn) {
					watcherFn(value);
					watcherMap.set(watcherFn, watchers.push(watcherFn) - 1);
					return this;
				},
				abort(watcherFn) {
					delete watchers[watcherMap.get(watcherFn) || -1]
				}
			},
			"number string".includes(typeof value) ? PRIM_TEMP : UNDEFINED,
			typeof value == "number" ? NUM_TEMP : UNDEFINED,
			Array_isArray(value) ? ARR_TEMP : UNDEFINED,
			Symbol_dispose ? DISPOSER_TEMP : UNDEFINED,
		]
	))
};