import { isPtr } from "./$.js"
import { prop } from "./prop.js";

const

	formerRegex = /[A-Z]{1}/g,

	lowercaseCache = {},
	lowercaseMatcher = (match) => lowercaseCache[match] ||= "-" + match.toLowerCase(),

	formedStyleProp = {},
	formStyleProp = (styleProp) => formedStyleProp[styleProp] ||= styleProp.replaceAll(formerRegex, lowercaseMatcher),

	css = prop(

		function(styleProp, styleValue, { style: styleDec }) {

			const
				formedStylePropBuf = formStyleProp(styleProp)
			;

			styleDec.setProperty(

				formedStylePropBuf,

				isPtr(styleValue)
					? (
						styleValue.watch($ => styleDec.setProperty(formedStylePropBuf, $)),
						styleValue.$
					)
					: styleValue
			)
		},

		prop => "css-" + formStyleProp(prop)

	)
;

export { css }