import { isPtr } from "./$.js"
import { prop } from "./prop.js";

const

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	css = prop(

		function(styleProp, styleValue, ref) {
			ref.style[styleProp] = (
				isPtr(styleValue)
					? (styleValue.watch($ => ref.style[styleProp] = $), styleValue.$)
					: styleValue
			)
		},

		prop => "css-" + (formedStyleProp[prop] ||= prop.replaceAll(formerRegex, lowercaseMatcher))

	)
;

export { css }