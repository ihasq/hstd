import { $, css, h as html, on } from "../pkg/libh/src/mod.js"

function Component() {

	const count = $(0);

	const checked = $(true);

	count.watch(() => checked.switch());

	const copy = $((value) => ({
		[css.color]: value
	}))

	return html`
		<h1>Count is ${count}</h1>
		<button ${{ [on.click]: () => count.$++, [copy]: "red" }}>
			add more!
		</button>
		<input ${{ type: "checkbox", checked }}>
		${checked}
	`;
}

document.body.append(...Component())