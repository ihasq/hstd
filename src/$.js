import { Symbol_toPrimitive, UNDEFINED } from "./const.js";

const
	{
		Array: { from: Array_from, isArray: Array_isArray },
		Object: { assign: Object_assign, defineProperty: Object_defineProperty, freeze: Object_freeze },
		Symbol: { dispose: Symbol_dispose },
		globalThis: GLOBALTHIS
	} = globalThis,
	RAF = GLOBALTHIS.requestAnimationFrame,
	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
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
							value = newValue;
							watchers.forEach(execWatcher)
						}
					},
					[Symbol_toPrimitive](hint) {
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
					}
				},
				"number string".includes(typeof value) ? PRIM_TEMP : UNDEFINED,
				typeof value == "number" ? NUM_TEMP : UNDEFINED,
				Array_isArray(value) ? ARR_TEMP : UNDEFINED,
				Symbol_dispose ? DISPOSER_TEMP : UNDEFINED,
			]
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