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

	bundled = $((value, ref) => ref.style.cssText = Object.keys(value).map(styleProp => `${formStyleProp(styleProp)}:${applyValue(styleProp, value[styleProp], ref)};`).join("")),

	publisher = bundled.publish.bind(bundled),

	css = new Proxy({}, {
		get(_, styleProp) {
			return (
				styleProp === Symbol.toPrimitive	? publisher
				: styleProp === "$"					? publisher()
				: styleCache[styleProp] ||= $((value, ref) => applyValue(styleProp, value, ref)
			).publish())
		}
	})
;

export { css } 