# [libh](https://libh.js.org)

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
```

## Install
```sh
npm i libh
```