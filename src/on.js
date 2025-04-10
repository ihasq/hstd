import { createPtr } from "./$.js"
import { createProp } from "./prop.js";

let registeredEvent = "\0";

const

	targetMap = new WeakMap(),

	on = createProp(

		function (eventName, callbackFn, ref) {

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

		name => "on." + name

	)
;

export { on }