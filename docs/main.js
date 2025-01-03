import { $, h as html, on, css } from "libh";

const Title = () => {
	return html`
		<h1>lib<a ${{ href: "https://libh.js.org" }}>h</a></h1>
	`
}

document.body.append(...html`
	${Title()}
	${Summary()}
`)

const Canvas = () => {
	
	return html`
		<canvas ${{ [on.load]: (canvas) => {

		} }}></canvas>
	`
}