import { $ } from "$.js"

const handlerCache = {};

export const on = new Proxy({}, {
	get(_, event) {
		return event === Symbol.toPrimitive
		? $((callbacks, ref) => Object.keys(callbacks).forEach(event => ref.addEventListener(event, callbacks[event], { passive: true })))
		: handlerCache[event] ||= $((callbackFn, ref) => ref.addEventListener(event, callbackFn, { passive: true }))
	}
})