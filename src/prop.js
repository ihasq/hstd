import { createPtr } from "./$.js"

export const createProp = (bundled, cache, callback, nameFn) => new Proxy({}, {
	get(_, prop) {
		return (
			prop === Symbol.toPrimitive	? () => bundled.publish()
			: prop === "$"				? bundled.publish()
			:							(cache[prop] ||= createPtr(callback.bind(null, prop), void 0, { name: nameFn(prop) })).publish()
		)
	}
});