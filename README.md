# 🐛 lib[h](https://libh.js.org)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/vitejs-vite-vcga6uwx?file=main.js)
[![NPM Version](https://img.shields.io/npm/v/libh)](https://www.npmjs.com/package/libh)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/libh)](https://bundlephobia.com/package/libh)
```javascript
// get ingredients

import { $, h as html, on } from "libh"


// cook yours

function Component() {

    const count = $(0);

    return html`
        <h1>Count is ${count}</h1>
        <button ${{ [on.click]: () => count.$++ }}>
            Add more!
        </button>
    `;
}


// throw into the DOM

document.body.append(...Component());
```

Visit live [demo](https://ihasq.com/libh/demo/count).

---
- **[Install](#install)**
- **[Examples](#examples)**

---

## Install
```sh
npm i libh
```

## Examples
**[Class-model](#class-model) | [Bidirecetional binding](#bidirecetional-binding) | [Post-processing](#post-processing)**

### Class-model
```javascript
import { $, h as html, on, css } from "libh"

const ButtonClass = {
    [css]: {
        color: "white",
        backgroundColor: "blue",
    },
    [on.click]: () => alert("hi")
}

function Main() {

    const count = $(0);

    return html`
        <button ${{ [on.click]: () => count.$++, ...ButtonClass }}>
            I'm styled ${count}!
        </button>
    `
}
```

### Bidirecetional binding
```javascript
function Linked() {

    const valueHolder = $(0)

    return html`
        <h1>these are linked!</h1>
        <input ${{ value: valueHolder, type: "range" }}>
        <input ${{ value: valueHolder, type: "range" }}>
        <label>value is ${valueHolder}</label>
    `
}
```

### Post-processing
```javascript
function Canvas() {

    const colorSwitch = $(true);

    return html`
        <canvas ${{ id: "color", [on.click]: () => colorSwitch.switch() }}></canvas>

    `.then(({ color }) => {

        const ctx = color.getContext("2d");
        colorSwitch.into($ => $ ? "red" : "blue").watch($ => {
            ctx.fillStyle = $;
            ctx.fillRect(0, 0, 100, 100);
        });
    })
}
```

### Draggable List
```javascript
function Canvas() {

    const customers = $([]);

    const name = $(""), email = $("");

    return html`
        <ul>${customers.into(({ name, email }) => html`
            <li>name: ${name.$}, email: ${email.$}</li>
            <button ${{
                [on.click]() {
                    customers.removeOf(this[html])
                }
            }}>x</button>
        `, { sync: true })}</ul>
        <input ${{ value: name, type: "string" }}>
        <input ${{ value: email, type: "email" }}>

        <button ${{ [on.click]: () => {
            customers.push({ name: name.$, email, email.$ });
            name.$ = "";
            email.$ = "";
        } }}>submit</button>
    `
}
```