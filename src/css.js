import { isPtr } from "./$.js"
import { prop } from "./prop.js";

const

	formedStyleProp = {},
	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	css = prop(

		function(styleProp, value, ref) {
			return `${formStyleProp(styleProp)}:${
				isPtr(value)
					? (value.watch($ => ref.style[formStyleProp(styleProp)] = $), value.$)
					: value
			};`
		},

		prop => "css-" + formStyleProp(prop),

		(map, ref) => ref.style.cssText = map.join("")

	)
;

export { css }