// ihasq/h ❤ lit-html's textEndRegex ❤

let rand = Math.floor(Math.random() * (2 ** 32 - 1));

const

	ESC_REGEX = /["&'<>`]/g,
	ESC_CHARCODE_BUF = {},
	ESC_FN = (match) => `&#x${ESC_CHARCODE_BUF[match] ||= match.charCodeAt(0).toString(16)};`,

	TOKEN_LENGTH = 16,

	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
	HTML_IDENTIFIER = Symbol.for("HTML_IDENTIFIER"),

	createToken = function*(length = TOKEN_LENGTH) {
		for(let i = 0; i < length; i++) {
			yield Math.floor(Math.random() * 26) + 97
		}
	},

	elementTempMap = new WeakMap(),

	transformFrag = ({ s, v }, idList) => {
		let elementTemp = elementTempMap.get(s);

		console.log(s, elementTemp?.node?.innerHTML)

		if(!elementTemp) {

			let joined = s.join(""), tokenBuf;

			while(joined.includes(tokenBuf = String.fromCharCode(...createToken()))) {};

			joined = s.join(tokenBuf);

			const attrMatch = Array.from(joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*?${tokenBuf}`, "g")).map(({ 0: { length }, index }) => index + length));
			const placeholder = {};

			const tempDiv = document.createElement("div")
			df.appendChild(tempDiv);

			tempDiv.innerHTML = joined.replaceAll(tokenBuf, (match, index) => {
				let id = String.fromCharCode(...createToken());

				return (placeholder[id] = attrMatch.includes(index + TOKEN_LENGTH)) ? id : `<br ${id}>` 
			});

			console.log(tempDiv)

			elementTempMap.set(s, elementTemp = { node: tempDiv, placeholder })
		};

		const { node, placeholder } = elementTemp;
		const newNode = node.cloneNode(true);
		Object.keys(placeholder).forEach((id, index) => {
			const ref = newNode.querySelector(`[${id}]`);
			const attrBody = v[index];
			if(placeholder[id]) {
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

						} else if(attrProp === "id" && !(attrValue in idList)) {
							idList[attrValue] = ref;
						} else {
							ref[attrProp] = attrValue;
						}
					}
				});
				ref.removeAttribute(id)
			} else {
				const primitiveDef = attrBody[Symbol.toPrimitive];
				if(primitiveDef?.(HTML_IDENTIFIER)) {
					ref.replaceWith(...transformFrag(attrBody))
				} else if(primitiveDef?.(PTR_IDENTIFIER)) {
					const txt = new Text("")
					attrBody.watch($ => txt.textContent = $);
					ref.replaceWith(txt)
				} else {
					ref.replaceWith(attrBody)
				}
			}
		})

		return newNode.childNodes;
	},

	resolveFrag = ({ s, v }) => {
		const profile = transformFrag({ s });

	},

	structFrag = ([s, v], str = [], val = [], marker, globalMarkerToken) => {
		if(elementTempMap.has(s)) {
			const { node, token, placeholder } = elementTempMap.get(s);
			/**
			 * 
			 * 	{
			 * 		"9wjsfd": "attribute"
			 * 	}
			 */
			return {
				cloned: node.cloneNode(true),
				placeholder
			}
			thisEval.evaluate(elementTempMap.get(s).cloneNode(true));
		}
		const markerToken = String.fromCharCode(...createToken())
		marker.push([s, markerToken])
		str[str.length - 1] += s[0];
		v.forEach((vBuf, vIndex) => {
			if(vBuf[Symbol.toPrimitive]?.(HTML_IDENTIFIER)) {
				structFrag(vBuf, str, val, marker, globalMarkerToken)
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
			return typeof hint == "string" ? HTML_IDENTIFIER : hint === HTML_IDENTIFIER
		},
		[Symbol.iterator]: function* () {

			for(const child of transformFrag(this)) yield child;

			return;

			const
				str = [""],
				val = [],
				marker = [],
				globalMarkerToken = String.fromCharCode(...createToken())
			;

			structFrag(this, str, val, marker, globalMarkerToken);

			let joined = str.join(""), tokenBuf, hasId = false;

			while(joined.includes(tokenBuf = String.fromCharCode(...createToken()))) {};

			joined = str.join(tokenBuf);

			const
				attrMatch = Array.from(joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*?${tokenBuf}`, "g")).map(({ 0: { length }, index }) => index + length)),
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

						} else if(attrProp === "id" && !(attrValue in idList)) {
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
	h = (s, ...v) => Object.assign({ s, v }, fragmentTemp)
;

// console.log(transformFrag(h`<div ${{ onclick: "ow" }}>${h`<div>wow</div>`}</div><input ${{}}><input ${{}}><input ${{}}>`))

/**
 * 
 */
export { h }