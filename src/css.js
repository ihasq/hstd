import { createPtr, isPtr } from "./$.js"
import { createProp } from "./prop.js";

const

	styleCache = {},

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	applyValue = function(styleProp, value, ref) {
		return isPtr(value)
			? (value.watch($ => ref.style[formStyleProp(styleProp)] = $), value.$)
			: value
	},

	bundled = createPtr((value, ref) => ref.style.cssText = Object.keys(value).map(styleProp => `${formStyleProp(styleProp)}:${applyValue(styleProp, value[styleProp], ref)};`).join("")),

	css = createProp(bundled, styleCache, applyValue, name => "css-" + formStyleProp(name))
;

export { css } 