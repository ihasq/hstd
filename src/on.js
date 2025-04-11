import { prop } from "./prop.js";

let registeredEvent = "\0";

const

	targetMap = new WeakMap(),

	/**
	 * @param { string } eventName
	 * @param { Function } callbackFn
	 * @param { HTMLElement } ref
	 * 
	 * @returns { void }
	 */
	aEL = function (eventName, callbackFn, ref) {

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

	on = prop(

		aEL,

		prop => "on." + prop

	)
;

export { on, aEL }