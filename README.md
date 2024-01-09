# domx

## A novel UI library for managing the DOM without javascript

[domx.js.org →](https://domx.js.org)

## Why?

I wanted a library of isolated web components to manage DOM states, styles and behaviors from the backend without javascript and having HTMX, Tailwind and XState-like features.

## Features:

- 🚯 No Javascript
- 💫 Reactive DOM
- 💅 Responsive Styles
- 📼 State Management
- 💩 No Virtual DOM
- 🪶 Flyweight Size
- 📬 HTMX-esque features
- 💨 Tailwind-esque features
- 🤖 XState-esque features

## Quick Start

- Download via CDN [unpkg](https://unpkg.com/@linttrap/domx@latest/dist/domx.zip)
- or you can also install and bundle things yourself `npm i @linttrap/domx`



## How It Works

domx works by introducing the idea of modeling DOM transformations in a simple state machine on the backend in a JSON configuration object. The state machine is then loaded into the dx-state component which handles all the transformations based on state and exposes it's API to the DOM.

### Step 1: Define the state machine on the server

```json
{
 "$schema": "domx.json",
 "initialState": "red",
 "listeners": [
   ["#stoplight", "click", "changeState"],
 ],
 "actions": {
   "reset": [
     ["attr", "#stoplight__red", "opacity", "0.25"],
     ["attr", "#stoplight__yellow", "opacity", "0.25"],
     ["attr", "#stoplight__green", "opacity", "0.25"]
   ]
 },
 "states": {
   "red": {
     "entry": [
       ["action", "reset"],
       ["attr", "#stoplight__red", "opacity", "1"],
       ["dispatch", "changeState", 2000]
     ],
     "changeState": [["state", "yellow"]]
   },
   "yellow": {
     "entry": [
       ["action", "reset"],
       ["attr", "#stoplight__yellow", "opacity", "1"],
       ["dispatch", "changeState", 2000]
     ],
     "changeState": [["state", "green"]]
   },
   "green": {
     "entry": [
       ["action", "reset"],
       ["attr", "#stoplight__green", "opacity", "1"],
       ["dispatch", "changeState", 2000]
     ],
     "changeState": [["state", "red"]]
   }
 }
}
     
```

### Step 2: Wrap markup with the dx-state component

```html
<-- Some styles omitted for brevity -->
<dx-state src="/api/stoplight.json">
 <dx-row>
   <dx-box
     id="stoplight__red"
     background-color="red"
     opacity="0.25"
   ></dx-box>
   <dx-box
     id="stoplight__yellow"
     background-color="yellow"
     opacity="0.25"
   ></dx-box>
   <dx-box
     id="stoplight__green"
     background-color="#07e407"
     opacity="0.25"
   ></dx-box>
 </dx-row>
</dx-state>
```

## The State Machine

The state machine is an XState inspired JSON configration object which takes the following format:

```js

{
  // the domx schema
  "$schema": "domx.json",
  // an initial state
  "initialState": "red",
  // list of event listeners to attach
  "listeners": [
    // selector, event, event name
    ["#some-btn",'click','handleClick']
  ],
  // common transformation objects
  "actions": {
    // action name
    "reset": TRANSFORMATION_OBJECT
  },
  // state machine
  "states": {
    // current state
    "red": {
      // automatically run when state is entered
      "entry": TRANSFORMATION_OBJECT,
      // run when the "changeState" event is dispatched
      "changeState": TRANSFORMATION_OBJECT,
      // automatically run when state is exited
      "exit": TRANSFORMATION_OBJECT
    },
    // ...more states
  }
}
```

## The Transformation Object
When a state machine event is triggered, the [current state] -> [event name] transformation object is processed. Each item in the transformation object is responsible for a specific transformation which is called a "trait". Here are examples of all the traits:

```js
[
  // Name: Action
  // Desc: Trigger an action
  // Type: [dx: "action", action: string];
  ["action", "reset"],

  // Name: Append
  // Desc: Append to element
  // Type: [dx: "append", selector: string, html: string];
  ["append", "#list", "<li>new item</li>"],

  // Name: Attr
  // Desc: Set an attribute
  // Type: [dx: "attr", selector: string, attr: string, value: string];
  ["attr", "#dialog", "open", "true"],

  // Name: Call
  // Desc: Call a method on an object
  // Type: [dx: "call", selector: string, method: string, ...args: any[]];
  ["call", "#custom-drawer-component", "toggle"],

  // Name: Click
  // Desc: Attach a click handler to trigger an action
  // Type: [dx: "click", selector: string, action: string];
  ["click", "#btn", "reset"],

  // Name: Dispatch
  // Desc: Dispatch an action
  // Type: [dx: "dispatch", action: string, delay?: number];
  ["dispatch", "reset", 2000],

  // Name: Get
  // Desc: Trigger a get request and process the result (a transformation object)
  // Type: [dx: "get", url: string, ...args: any[]];
  ["get", "/some/endpoint"],

  // Name: Post
  // Desc: Post selected data to endpoint and process the result (a transformation object)
  // Type: [dx: "post", url: string, ...data: [key: string, selector: string, val: "value" | "dataset" | "formData"][]];
  ["post", "/some/endpoint", [
    ["form-data", "#todoForm", "formData"]
  ]],

  // Name: Replace
  // Desc: Replace an element
  // Type: [dx: "replace", selector: string, html: string];
  ["replace", "#list", "<li>updated item</li>"],

  // Name: State
  // Desc: Change current state
  // Type: [dx: "state", state: string];
  ["state", "processing"],

  // Name: Text
  // Desc: Update text
  // Type: [dx: "text", selector: string, text: string];
  ["text", "#msg", "Hello World"],

  // Name: Wait
  // Desc: Add a wait between transformations
  // Type: [dx: "wait", ms: number];
  ["wait", 2000],
]
```

## Web Components

### `dx-state`
The state machine component

```html
<!-- 
  Attributes:
  - [src]=[/path/to/state.json]
-->

<dx-state src="/todo-machine.json">
  <!-- DOM scope -->
</dx-state>
```

### `dx-text`
The text component

```html
<!-- 
  Attributes:
  - [prop]=[value]
  - [css-prop]:[psuedo-el]--[breakpoint]="[css-value]"
-->

<!-- Basic flexbox -->
<dx-text>Hello World</dx-text>

<!-- font size of 21px with white text that turns red on hover -->
<dx-text font-size="21px" color="white" color:hover="red">Hello World</dx-text>
```

### `dx-box, dx-row, dx-col`
The flexbox component

```html
<!-- 
  Attributes:
  - [prop]=[value]
  - [css-prop]:[psuedo-el]--[breakpoint]="[css-value]"
-->

<!-- Basic flexbox -->
<dx-box>Hello World</dx-box>

<!-- 10px padding with white text that turns red on hover -->
<dx-box padding="10px" color="white" color:hover="red">Hello World</dx-box>

<!-- column on mobile, row at 960px -->
<dx-box flex-direction="column" flex-direction--960="row">Hello World</dx-box>

<!-- Same as dx-box but flex-direction is preset to column -->
<dx-col>Hello World</dx-col>

<!-- Same as dx-box but flex-direction is preset to row -->
<dx-row>Hello World</dx-row>
```

### `dx-grid`
The grid component

```html
<!-- 
  Attributes:
  - [prop]=[value]
  - [css-prop]:[psuedo-el]--[breakpoint]="[css-value]"
-->

<!-- 1 column on mobile, 2 columns at 960px -->
<dx-grid
  grid-template-columns="1fr"
  grid-template-columns--960="1fr 1fr"
  gap="30px"
>
  <div>Cell One</div>
  <div>Cell Two</div>
</dx-grid>

```

## domx

©Copyright 2023 All rights reserved. Made in the USA 🇺🇸 by [Kevin Lint](http://kevinlint.com) as a product of [Lint Trap Media](http://linttrap.media).
