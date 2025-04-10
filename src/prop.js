import { createPtr } from "./$.js"

export const prop = (callback, nameFn, bundler) => {

	const
		cache = {},
		bundled = createPtr((value, ref) => bundler?.(Object.entries(value).map(([prop, fn]) => callback(prop, fn, ref)), ref)),
		publisher = () => bundled.publish()
	;

	return new Proxy({}, {
		get(_, prop) {
			return (
				prop === Symbol.toPrimitive	? publisher
				: prop === "$"				? publisher()
				:							(cache[prop] ||= createPtr(callback.bind(null, prop), void 0, { name: nameFn(prop) })).publish()
			)
		}
	})

};