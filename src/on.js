import { $ } from "./$.js"

let registeredEvent = "\0";

const

	handlerCache = {},

	targetMap = new WeakMap(),

	aEL = (ref, eventName, callbackFn) => {

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

		(targetMap.get(ref)[eventName] ||= []).push(callbackFn)

	},

	bundled = $((callbacks, ref) => Object.keys(callbacks).forEach(eventName => aEL(ref, eventName, callbacks[eventName]))),

	publisher = bundled.publish.bind(bundled),

	on = new Proxy({}, {
		get(_, eventName) {

			return (

				eventName === Symbol.toPrimitive	? publisher
				: eventName === "$"					? publisher()

				: (handlerCache[eventName] ||= $((callbackFn, ref) => aEL(ref, eventName, callbackFn), undefined, { name: "on." + eventName })).publish()
			)
		}
	})
;

export { on }