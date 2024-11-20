import { $ } from "./$.js"

const

	{ toPrimitive: Symbol_toPrimitive } = Symbol,

	styleCache = {},

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowerCaseCache = {},

	css = new Proxy({}, {
		get(_, styleProp) {
			return styleProp === Symbol_toPrimitive
			? ""
			: (styleCache[styleProp] ||= $((value, ref) => {
				ref.attributeStyleMap.set(
					formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, (match) => (lowerCaseCache[match] ||= "-" + match.toLowerCase())),
					value
				)
			}))[Symbol_toPrimitive](0x0001)
		}
	})
;

export { css }