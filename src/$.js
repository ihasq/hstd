const
	RAF = globalThis.requestAnimationFrame,
	Symbol_dispose = Symbol.dispose,
	Symbol_toPrimitive  = Symbol.toPrimitive,
	Object_assign = Object.assign,
	Object_freeze = Object.freeze,
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
	publishedPtr = {}
;

let resolverSignature;

while((resolverSignature = String.fromCharCode.apply(null, Array.from(resolverSignatureGenObj, resolverSignatureGenCB))) in globalThis) {};

Object.defineProperty(globalThis, resolverSignature, {
	value: (symbol) => publishedPtr[symbol],
	configurable: false,
	enumerable: false
});

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
	return publishedPtr[symbol] = Object.freeze(Object.assign.apply(
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
			"number string".includes(typeof value) ? PRIM_TEMP : undefined,
			typeof value == "number" ? NUM_TEMP : undefined,
			Array.isArray(value) ? ARR_TEMP : undefined,
			Symbol_dispose ? DISPOSER_TEMP : undefined,
		]
	))
};