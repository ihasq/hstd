import { $ } from "./$.js"

const

	styleCache = {},

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	bundledProp = $((value, ref) => ref.style.cssText = Object.keys(value).map(prop => `${formStyleProp(prop)}:${value[prop]};`).join("")),

	getBundled = () => bundledProp.publish(),

	css = new Proxy({}, {
		get(_, styleProp) {
			return styleProp === Symbol.toPrimitive
			? getBundled
			: styleProp === "$"
			? getBundled()
			: (styleCache[styleProp] ||= $((value, ref) => {
				ref.style[formStyleProp(styleProp)] = value
			})).publish()
		}
	})
;

export { css }