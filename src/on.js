import { $ } from "./$.js"

let registeredEvent = "";

const
	handlerCache = {},
	runAEL = (callback, ref, eventName) => ref.addEventListener(eventName, callback, { passive: !0 }),
	bundled = $((callbacks, ref) => Object.keys(callbacks).forEach(eventName => runAEL(callbacks[eventName], ref, eventName))),
	targetMap = new WeakMap(),
	bundledPublishFn = () => bundled.publish(),
	on = new Proxy({}, {
		get(_, eventName) {

			return (

				eventName === Symbol.toPrimitive	? bundledPublishFn
				: eventName === "$"					? bundledPublishFn()

				: (
					handlerCache[eventName] ||= $((callbackFn, ref) => {

						if(!(registeredEvent.includes(eventName))) {
							runAEL(e => targetMap.get(e.target)?.[eventName]?.forEach?.(x => x(e)), globalThis, eventName);
							registeredEvent += eventName + "\0"
						}

						if(typeof callbackFn == "object") {
							const callbackFnBody = callbackFn.fn;
							callbackFn = callbackFnBody;
						};

						if(!targetMap.has(ref)) targetMap.set(ref, {});

						(targetMap.get(ref)[eventName] ||= []).push(callbackFn)

					}, undefined, { name: "on." + eventName })

				).publish()
			)
		}
	})
;

export { on }