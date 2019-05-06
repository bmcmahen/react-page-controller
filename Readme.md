# react-gesture-view

[![npm package](https://img.shields.io/npm/v/react-gesture-view/latest.svg)](https://www.npmjs.com/package/react-gesture-view)
[![Follow on Twitter](https://img.shields.io/twitter/follow/benmcmahen.svg?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=benmcmahen)

React-gesture-view is a react library for providing views that can be swiped left or right. It was originally built for use in [Sancho UI](https://github.com/bmcmahen/sancho).

## Features

- **Built with [pan-responder-hook](https://github.com/bmcmahen/pan-responder-hook) to enable better control over gesture delegation.** This means that you can embed gesture based controls within this gesture view (or embed multiple gesture views within eachother) and delegate between them.
- **Configurable**. Configure the animation spring, enable mouse support, use child render callbacks, etc.
- **Optional lazy loading**.

## Install

```
yarn add react-gesture-view
```

## Basic usage

```jsx
function BasicExample({ defaultIndex = 0 }: any) {
  const [index, setIndex] = React.useState(defaultIndex);
  return (
    <GestureView
      value={index}
      onRequestChange={i => setIndex(i)}
      style={{
        width: "300px",
        height: "500px"
      }}
    >
      <div style={{ flex: 1, background: "blue" }}>
        <div>
          <button onClick={() => setIndex(1)}>next</button>
          <RandomContent />
        </div>
      </div>
      <div style={{ flex: 1, background: "yellow" }}>
        <button onClick={() => setIndex(0)}>prev</button>
      </div>
      <div style={{ flex: 1, background: "green" }} />
    </GestureView>
  );
}
```

## API

| Name              | Type                     | Default Value                             | Description                               |
| ----------------- | ------------------------ | ----------------------------------------- | ----------------------------------------- |
| value\*           | number                   |                                           | The current index to show                 |
| onRequestChange\* | (value: number) => void; |                                           | A callback for handling index changes     |
| lazyLoad          | boolean                  | false                                     | Lazy load pane contents                   |
| enableMouse       | boolean                  | false                                     | By default mouse gestures are not enabled |
| animationConfig   | SpringConfig             | { tension: 190, friction: 20, mass: 0.4 } | A react-spring config for animations      |
