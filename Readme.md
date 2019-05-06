# react-gesture-view

[![npm package](https://img.shields.io/npm/v/react-gesture-view/latest.svg)](https://www.npmjs.com/package/react-gesture-view)
[![Follow on Twitter](https://img.shields.io/twitter/follow/benmcmahen.svg?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=benmcmahen)

React-gesture-view is a react library for providing views that can be swiped left or right. It was originally built for use in [Sancho UI](https://github.com/bmcmahen/sancho).

## Features

- **Built with [pan-responder-hook](https://github.com/bmcmahen/pan-responder-hook) to enable better control over gesture delegation.** This means that you can embed gesture based controls within this gesture view (or embed multiple gesture views within eachother) and delegate between them.
- **Configurable**. Configure the animation spring, enable mouse support, use child render callbacks, etc.
- **Optional lazy loading**.

## Install

Install `react-gesture-view` and its peer dependency `pan-responder-hook` using yarn or npm.

```
yarn add react-gesture-view pan-responder-hook
```

## Basic usage

The gesture view should be provided with a collection of children, each representing a panel. By default, each child will be wrapped in an element wiith the recommended props. If you'd rather render the element yourself, provide a render callback for each child instead.

```jsx
function TabContent() {
  const [index, setIndex] = React.useState(0);
  return (
    <GestureView value={index} onRequestChange={i => setIndex(i)}>
      <div>First panel</div>
      <div>Second panel</div>
      <div>Third panel</div>
      {(props, active, load) => <div {...props}>fourth panel</div>}
    </GestureView>
  );
}
```

## API

| Name                 | Type                     | Default Value                             | Description                                                                                        |
| -------------------- | ------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| value\*              | number                   |                                           | The current index to show                                                                          |
| onRequestChange\*    | (value: number) => void; |                                           | A callback for handling index changes                                                              |
| lazyLoad             | boolean                  | false                                     | Lazy load pane contents                                                                            |
| enableMouse          | boolean                  | false                                     | By default mouse gestures are not enabled                                                          |
| animationConfig      | SpringConfig             | { tension: 190, friction: 20, mass: 0.4 } | A react-spring config for animations                                                               |
| onTerminationRequest | (state) => boolean;      |                                           | Optionally prevent parent views from claiming the pan-responder. Useful for embedded gesture views |

## Imperative API

You can use the imperative API to manually focus the active panel, which is something you'll likely want to do for accessibility reasons.

```jsx
function TabContent() {
  const [index, setIndex] = React.useState(0);
  const ref = React.useRef();

  function focusCurrentIndex() {
    ref.current.focus();
  }

  return (
    <GestureView ref={ref} value={index} onRequestChange={i => setIndex(i)}>
      <div>First panel</div>
      <div>Second panel</div>
      <div>Third panel</div>
    </GestureView>
  );
}
```
