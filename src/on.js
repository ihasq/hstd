import { prop } from "./prop.js";

let registeredEvent = "\0";

const

	targetMap = new WeakMap(),

	on = prop(

		function (eventName, callbackFn, ref) {

			if(!registeredEvent.includes(`\0${eventName}\0`)) {
				globalThis.addEventListener(
					eventName,
					e => targetMap.get(e.target)?.[eventName]?.forEach(x => x(e)),
					{ passive: !0 }
				);
				registeredEvent += eventName + "\0";
			};
	
			if(!targetMap.has(ref)) targetMap.set(ref, {});
	
			(targetMap.get(ref)[eventName] ||= []).push(callbackFn);
	
		},

		prop => "on." + prop

	)
;

export { on }