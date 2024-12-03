# ⚙ lib[h](https://libh.js.org)

```javascript
// Import some stuff

import { $, h as html, on } from "libh"


// Design your component

function Component() {

    const count = $(0);

    return html`
        <h1>Count is ${count}</h1>
        <button ${{ [on.click]: () => count.$++ }}>
            Add more!
        </button>
    `;
}


// Put into the DOM

document.body.append(...Component());


// See live demo at https://ihasq.com/libh/demo/count 
```

## Install
```sh
npm i libh
```