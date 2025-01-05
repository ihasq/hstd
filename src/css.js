import { $ } from "./$.js"

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

	getBundled = () => bundledProp.publish(),

	css = new Proxy({}, {
		get(_, styleProp) {
			return styleProp === Symbol.toPrimitive
			? getBundled
			: styleProp === "$"
			? bundledProp.publish()
			: (styleCache[styleProp] ||= $((value, ref) => {
				ref.attributeStyleMap.set(
					formStyleProp(styleProp),
					value
				)
			})).publish()
		}
	})
;

export { css }