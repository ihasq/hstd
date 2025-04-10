import { createPtr } from "./$.js"

export const prop = (callback, nameFn, bundler) => {

	const
		cache = {},
		proxy = new Proxy({}, {
			get(_, prop) {
				return (
					prop === Symbol.toPrimitive	? publisher
					: prop === "$"				? publisher()
					:							(cache[prop] ||= createPtr(callback.bind(null, prop), undefined, { name: nameFn(prop) })).publish()
				)
			}
		}),
		bundled = createPtr((value) => Object.fromEntries(Object.entries(value).map(([prop, fn]) => [proxy[prop], fn]))),
		publisher = () => bundled.publish()
	;

	return proxy

};