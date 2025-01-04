// ihasq/h ❤ lit-html's textEndRegex

const

	ESC_REGEX = /["&'<>`]/g,
	ESC_CHARCODE_BUF = {},
	ESC_FN = (match) => `&#x${ESC_CHARCODE_BUF[match] ||= match.charCodeAt(0).toString(16)};`,

	TOKEN_LENGTH = 16,

	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
	HTML_IDENTIFIER = Symbol.for("HTML_IDENTIFIER"),

	createToken = function*() {
		for(let i = 0; i < TOKEN_LENGTH; i++) {
			yield Math.floor(Math.random() * 26) + 97
		}
	},

	structFrag = ({ s, v }, str = [], val = []) => {
		str[str.length - 1] += s[0];
		v.forEach((vBuf, vIndex) => {
			if(vBuf[Symbol.toPrimitive]?.(HTML_IDENTIFIER)) {
				structFrag(vBuf, str, val)
				str[str.length - 1] += s[vIndex + 1]
			} else if("number string".includes(typeof vBuf)) {
				str[str.length - 1] += String(vBuf).replaceAll(ESC_REGEX, ESC_FN) + s[vIndex + 1]
			} else {
				val.push(vBuf)
				str.push(s[vIndex + 1])
			}
		})
	},

	df = document.createDocumentFragment(),
	tempDiv = document.createElement("div"),

	thisEval = new XPathEvaluator(),

	fragmentTemp = {
		onloadCallbackFn: [],
		then(onloadCallbackFn) {
			if(!this.onloadCallbackFn.length) {
				this.onloadCallbackFn[0] = onloadCallbackFn;
			}
			return this;
		},
		[Symbol.toPrimitive](hint) {
			return hint === HTML_IDENTIFIER
		},
		[Symbol.iterator]: function* () {

			const
				str = [""],
				val = []
			;

			structFrag(this, str, val);

			let joined = str.join(""), tokenBuf, hasId = false;

			while(joined.includes(tokenBuf = String.fromCharCode(...createToken()))) {};

			joined = str.join(tokenBuf);

			const
				attrMatch = Array.from(joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*${tokenBuf}`, "g")).map(({ 0: { length }, index }) => index + length)),
				attrIndex = [],
				ptrIndex = [],
				idList = {}
			;
			
			let attrCount = -1;
			tempDiv.innerHTML = joined.replaceAll(tokenBuf, (match, index) => (attrCount++, attrMatch.includes(index + TOKEN_LENGTH)
				? (attrIndex.push(attrCount), match)
				: (ptrIndex.push(attrCount), `<!--${tokenBuf}-->${tokenBuf}<!---->`)
			));

			const ptrMatch = thisEval.evaluate(`//comment()[contains(.,'${tokenBuf}')]`, tempDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			for(let i = 0; i < ptrIndex.length; i++) {
				const comment = ptrMatch.snapshotItem(i);
				comment.textContent = "";
				const ptrText = comment.nextSibling;
				val[ptrIndex[i]].watch($ => ptrText.textContent = $);
			}

			tempDiv.querySelectorAll(`[${tokenBuf}]`).forEach((ref, index) => {
				const attrBody = val[attrIndex[index]];
				Reflect.ownKeys(attrBody).forEach(attrProp => {
					const
						attrValue = attrBody[attrProp],
						attrPropType = typeof attrProp
					;
					if(attrPropType === "symbol") {
						const ptr = globalThis[attrProp.description.slice(0, 52)]?.(attrProp);
						if(!ptr?.[Symbol.toPrimitive]?.(PTR_IDENTIFIER)) return;
						ptr.$(attrValue, ref);
					} else if(attrPropType === "string") {
						if(attrValue[Symbol.toPrimitive]?.(PTR_IDENTIFIER)) {
							if(attrProp === "value" && ref instanceof HTMLInputElement) {
								const oninput = $ => ref.value = $;
								attrValue.watch(oninput);
								ref.addEventListener("input", ({ target: { value } }) => setTimeout(() => {
									attrValue.ignore.set(oninput);
									attrValue.$ = value
									attrValue.ignore.delete(oninput);
								}), { passive: true })
							} else {
								attrValue.watch($ => ref[attrProp] = $)
							}
						} else if(attrProp === "id") {
							idList[attrValue] = ref;
						} else {
							ref[attrProp] = attrValue;
						}
					}
				});
				ref.removeAttribute(tokenBuf)
			});

			for(const tempNode of tempDiv.childNodes) yield tempNode;

			this.onloadCallbackFn[0]?.(idList)

			return;
		}
	},
	h = (s, ...v) => Object.freeze(Object.assign({ s, v }, fragmentTemp))
;

df.appendChild(tempDiv);

/**
 * 
 */
export { h }