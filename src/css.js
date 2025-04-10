import { createPtr, isPtr } from "./$.js"
import { createProp } from "./prop.js";

const

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	css = createProp(

		function(styleProp, value, ref) {
			return isPtr(value)
				? (value.watch($ => ref.style[formStyleProp(styleProp)] = $), value.$)
				: value
		},

		name => "css-" + formStyleProp(name),

		(map, ref) => ref.style.cssText = map.join("")

	)
;

export { css } 