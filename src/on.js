import { createPtr } from "./$.js"
import { createProp } from "./prop.js";

let registeredEvent = "\0";

const

	handlerCache = {},

	targetMap = new WeakMap(),

	aEL = function (eventName, callbackFn, ref) {

		registeredEvent.includes(`\0${eventName}\0`) ? 0
			: (
				globalThis.addEventListener(
					eventName,
					e => targetMap.get(e.target)?.[eventName]?.forEach(x => x(e)),
					{ passive: !0 }
				),
				registeredEvent += eventName + "\0"
			)
		;

		targetMap.has(ref) ? 0 : targetMap.set(ref, {});

		(targetMap.get(ref)[eventName] ||= []).push(callbackFn);

	},

	bundled = createPtr((callbacks, ref) => Object.keys(callbacks).forEach(eventName => aEL(eventName, callbacks[eventName], ref))),

	// publisher = bundled.publish.bind(bundled),

	// on = new Proxy({}, {
	// 	get(_, eventName) {

	// 		return (

	// 			eventName === Symbol.toPrimitive	? publisher
	// 			: eventName === "$"					? publisher()
	// 			:									(handlerCache[eventName] ||= createPtr(aEL.bind(null, eventName), void 0, { name: "on." + eventName })).publish()
	// 		)
	// 	}
	// }),

	on = createProp(bundled, handlerCache, aEL, name => "on." + name)
;

export { on }