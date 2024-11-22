import { $ } from "./$.js"
import { Symbol_toPrimitive } from "./const.js";

const

	styleCache = {},

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	bundledProp = $((value, ref) => Object.keys(value).forEach(styleProp => ref.attributeStyleMap.set(
		formStyleProp(styleProp),
		value[styleProp]
	))),

	getBundled = () => bundledProp[Symbol_toPrimitive](0x0001),

	css = new Proxy({}, {
		get(_, styleProp) {
			return styleProp === Symbol_toPrimitive
			? getBundled
			: styleProp === "$"
			? bundledProp[Symbol_toPrimitive](0x0001)
			: (styleCache[styleProp] ||= $((value, ref) => {
				ref.attributeStyleMap.set(
					formStyleProp(styleProp),
					value
				)
			}))[Symbol_toPrimitive](0x0001)
		}
	})
;

export { css }