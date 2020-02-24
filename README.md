# Customized built-in elements `<text-clipboard>`

[![npm](https://img.shields.io/npm/v/@gastier/customelement-textclipboard.svg)](http://npm.im/@gastier/customelement-textclipboard)

The goal of this module is to have a reusable component to copied text to clipboard.

* [Demo](https://spooky063.github.io/CustomElement-TextClipboard/)

## Install
```bash
npm i @gastier/customelement-textclipboard
```

## Usage
To attach clipboard button to element, use `target` attribute with existing unique selector.

```html
<-- Create a clipboard button -->
<span id="id">Text to copy</span>
<text-clipboard target="#id"></text-clipboard>
```

```html
<-- Create a clipboard button without attribute select the previous element -->
<code>jdikappelndnso5dfsa</code>
<text-clipboard></text-clipboard>
```

## Attributes

| Attribute | Type     | Description                                     |
|-----------|----------|-------------------------------------------------|
| `target`  | `string` | Selector corresponding to a valid HTML element  |

## Custom event
I create a custom event `afterselect` to add an message flash for example.  
This event is dispatch after the clipboard action is launch.

```javascript
document.addEventListener('afterselect', e => { 
    console.log(`Text copied is ${e.detail.text}`); 
});
```