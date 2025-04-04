# 🐛 lib[h](https://libh.js.org)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/vitejs-vite-vcga6uwx?file=main.js)
[![NPM Version](https://img.shields.io/npm/v/libh?logo=npm&color=%23CC3534)](https://www.npmjs.com/package/libh)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/libh?logo=stackblitz)](https://bundlephobia.com/package/libh)
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
- **[Demo](#demo)**
- **[License](#license)**

---

## Install
```sh
npm i libh
```

## Download
```javascript
import { $, h as html } from "https://libh.dev";
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
        <ul>${customers.into(({ name, email }, ref) => html`
            <li>name: ${name}, email: ${email}</li>
            <button ${{
                [on.click]() {
                    ref.removeOf(this[html])
                }
            }}>x</button>
        `, { sync: true, draggable: true })}</ul>
        <input ${{ value: name, type: "string" }}>
        <input ${{ value: email, type: "email" }}>

        <button ${{ [on.click]: () => {
            customers.push({ name: name.$, email: email.$ });
            name.$ = "";
            email.$ = "";
        } }}>submit</button>
    `
}
```

## Demo
+ [Passcore](https://ihasq.com/passcore) - Random Password Generator ([code](https://github.com/ihasq/passcore))

## License

libh is [WTFPL](http://www.wtfpl.net/about/) licensed.