import { $ } from "./$.js"

const handlerCache = {};
const { toPrimitive: Symbol_toPrimitive } = Symbol;
const bundled = $((callbacks, ref) => Object.keys(callbacks).forEach(event => ref.addEventListener(event, callbacks[event], { passive: true })));

export const on = new Proxy({}, {
	get(_, event) {
		return event === Symbol_toPrimitive
		? bundled[Symbol_toPrimitive](0x0001)
		: (handlerCache[event] ||= $((callbackFn, ref) => ref.addEventListener(event, callbackFn, { passive: true }), undefined, { name: "on." + event }))[Symbol_toPrimitive](0x0001)
	}
})