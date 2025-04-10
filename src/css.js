import { $, isPtr } from "./$.js"

const

	styleCache = {},

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	applyValue = (styleProp, value, ref) => (
		isPtr(value)
			? (value.watch($ => ref.style[formStyleProp(styleProp)] = $), value.$)
			: value
	),

	bundledProp = $((value, ref) => ref.style.cssText = Object.keys(value).map(styleProp => `${formStyleProp(styleProp)}:${applyValue(styleProp, value[styleProp], ref)};`).join("")),

	getBundled = () => bundledProp.publish(),

	css = new Proxy({}, {
		get(_, styleProp) {
			return (
				styleProp === Symbol.toPrimitive	? getBundled
				: styleProp === "$"					? getBundled()
				: styleCache[styleProp] ||= $((value, ref) => applyValue(styleProp, value, ref)
			).publish())
		}
	})
;

export { css } 