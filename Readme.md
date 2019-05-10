<div align="center">
 <img 
    max-width="300px"
    alt="A demo showing views being swiped left and right."
     src="https://raw.githubusercontent.com/bmcmahen/react-gesture-view/master/demo.gif">
</div>

# react-gesture-view

[![npm package](https://img.shields.io/npm/v/react-gesture-view/latest.svg)](https://www.npmjs.com/package/react-gesture-view)
[![Follow on Twitter](https://img.shields.io/twitter/follow/benmcmahen.svg?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=benmcmahen)

React-gesture-view is a react library for providing views that can be swiped left or right. It was originally built for use in [Sancho UI](https://github.com/bmcmahen/sancho).

## Features

- **Built with [react-gesture-responder](https://github.com/bmcmahen/react-gesture-responder) to enable better control over gesture delegation.** This means that you can embed gesture based controls within this gesture view (or embed multiple gesture views within eachother) and delegate between them.
- **Configurable**. Configure the animation spring, enable mouse support, use child render callbacks, etc.
- **Optional lazy loading**.

## Install

Install `react-gesture-view` and its peer dependency `react-gesture-responder` using yarn or npm.

```
yarn add react-gesture-view react-gesture-responder
```

## Basic usage

The gesture view should be provided with a collection of children, each representing a panel. By default, each child will be wrapped in an element wiith the recommended props. If you'd rather render the element yourself, provide a render callback for each child instead.

```jsx
import GestureView from "react-gesture-view";

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

| Name                 | Type                              | Default Value                             | Description                                                                                             |
| -------------------- | --------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| value\*              | number                            |                                           | The current index to show                                                                               |
| onRequestChange\*    | (value: number) => void;          |                                           | A callback for handling index changes                                                                   |
| lazyLoad             | boolean                           | false                                     | Lazy load pane contents                                                                                 |
| enableMouse          | boolean                           | false                                     | By default mouse gestures are not enabled                                                               |
| enableGestures       | boolean                           | true                                      | By default gestures are enabled                                                                         |
| animationConfig      | SpringConfig                      | { tension: 190, friction: 20, mass: 0.4 } | A react-spring config for animations                                                                    |
| onTerminationRequest | (state) => boolean;               |                                           | Optionally prevent parent views from claiming the pan-responder. Useful for embedded gesture views      |
| onMoveShouldSet      | (state, e, suggested) => boolean; |                                           | Optionally override the default onMoveShouldSet behaviour. Useful for embedding multiple gesture views. |
| enableScrollLock     | boolean                           | true                                      | Lock all page scrolling when making swiping gestures. This is generally the desired behaviour.          |

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

## Embedding Views

Each GestureView exposes the `react-gesture-responder` `onTerminationRequest` function which allows you to negotiate between gesture views competing for the responder. Typically, you'll want the child view to prevent the parent from claiming the responder.

```jsx
<GestureView>
  <div>Left parent pane</div>
  <GestureView onTerminationRequest={() => false}>
    <div>child pane</div>
    <div>another child</div>
  </GestureView>
</GestureView>
```

The logic can become more sophisticated. In the gif at the top of the readme, our parent claims the responder (and prevents the child from stealing it) when showing the first child pane and moving left. The code will look something like this:

```jsx
const [childIndex, setChildIndex] = React.useState(0);
const [parentIndex, setParentIndex] = React.useState(0);

function onMoveShouldSet(state, e, suggested) {
  if (suggested) {
    if (parentIndex === 0 || (state.delta[0] > 0 && childIndex === 0)) {
      return true;
    }
  }

  return false;
}

function onTerminationRequest(state) {
  if (state.delta[0] > 0 && childIndex === 0) {
    return false;
  }

  return true;
}

<GestureView
  onMoveShouldSet={onMoveShouldSet}
  onTerminationRequest={onTerminationRequest}
  value={parentIndex}
  onRequestChange={i => setParentIndex(i)}
>
  <div>Left parent pane</div>
  <GestureView value={childIndex} onRequestChange={i => setChildIndex(i)}>
    <div>child pane</div>
    <div>another child</div>
  </GestureView>
</GestureView>;
```
