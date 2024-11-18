
const { assign: Object_assign } = Object;

const
	{ toPrimitive: Symbol_toPrimitive, dispose: Symbol_dispose } = Symbol,
	ESC_REGEX = /["&'<>`]/g,
	ESC_CHARCODE_BUF = {},
	ESC_FN = (match) => `&#x${ESC_CHARCODE_BUF[match] ||= match.charCodeAt(0).toString(16)};`,
	initTasks = {}
;

let elementName;

const OBJ_PROTO = Reflect.getPrototypeOf({});

const
	generateToken = () => {
		let buf = Math.floor(Math.random() * 36) + 48;
		return 39 * (buf > 57) + buf
	},
	generatorTemp = { length: 6 }
;

while(customElements.get(elementName = `s-${String.fromCharCode.apply(null, Array.from(generatorTemp, generateToken))}`)) {}

customElements.define(elementName, class extends HTMLBRElement {
	constructor() {
		super();
		this.hidden = true;
	}
	connectedCallback() {
		const
			shouldInit = document.querySelector(elementName) === this,
			uuid = this.getAttribute("init-uuid")
		;
		this.remove();
		if(uuid in initTasks && shouldInit) return;
		const initTask = initTasks[uuid];
		delete initTasks[uuid];
		document.querySelectorAll(`[${uuid}]`).forEach(initTask);
	}
});

const resolveTemp = (v) => {

}

const isPtr = (ptr) => {
	const sym = ptr[Symbol_toPrimitive]?.();
	return globalThis[sym?.description?.slice(0, 16)]?.(sym) === ptr;
}

const resolveFrag = ({ s, v }, cmd = []) => {
	cmd.push([0, s[0], undefined]);
	v.forEach((vBuf, vIndex) => {
		cmd.push([
			vBuf[Symbol_toPrimitive]?.(STRIX_HTML_IDENTIFIER) === 0
			? (resolveFrag(vBuf, cmd), 0)
			: (isPtr(vBuf))
			? 1
			: vBuf.constuctor === Object
			? 2
			: 3
		, s[vIndex + 1], vBuf])
	})
	return cmd;
}

const structTemp = (resolvedFrag, PARSER_UUID) => {
	let resultBuf;
	initTasks[PARSER_UUID] = (initTarget) => {
		initTarget.getAttribute(PARSER_UUID)
	}
	resolvedFrag.forEach(([CMD, TEMP_STR, TEMP_VAL], CMD_INDEX) => {
		tempBuf +=
			CMD == 0
			? TEMP_STR
			: CMD == 1
			? `<br ${PARSER_UUID}="ptr" ${PTR_PARSER_TOKEN}="${CMD_INDEX}" hidden>${TEMP_VAL.$}<!---->${TEMP_STR}`
			: CMD == 2
			? ` ${PARSER_UUID}="attr" ${ATTR_PARSER_TOKEN}-${CMD_INDEX}="${CMD_INDEX}"${TEMP_STR}`
			: CMD == 3
			? (TEMP_VAL + '').replace(ESC_REGEX, ESC_FN) + TEMP_STR
			: ''
	});
	return resultBuf;
}


const fragmentTemp = {
	then(onloadCallbackFn) {
		Object_assign(this, { onloadCallbackFn });
		delete this.then;
		return this;
	},
	[Symbol_toPrimitive](hint) {
		if(hint !== "string") return (hint === STRIX_HTML_IDENTIFIER || hint === "number") ? 0 : this;
		return `<br is='${elementName}' init-uuid=${initUUID}>${structTemp(resolveFrag(this), initUUID)}`
	}
}

export const h = (s, ...v) => {
	return Object_assign(
		function*() {
			
		},
		{
			0: s,
			1: v,
			2: STRIX_HTML_IDENTIFIER,
			s,
			v,
			[STRIX_HTML_IDENTIFIER]: true,

		},
		fragmentTemp
	);
}


function Component() {

	const count = $(0);

	return html`
		<button ${{ [on.click]: () => count.$++ }}>
			I got clicked ${count} times!
		</button>
	`
}

document.body.innerHTML = Component();

// $