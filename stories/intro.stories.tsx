import * as React from "react";
import { storiesOf } from "@storybook/react";
import GestureView, { CallbackProps, GestureViewHandles } from "../src";
import { StateType } from "pan-responder-hook";

import { useTouchable } from "touchable-hook";
import { IOS } from "./iOS";

function TouchableHighlight({ onPress, children }: any) {
  const { bind, active, hover } = useTouchable({
    onPress,
    behavior: "button" // or 'link'
  });

  return (
    <div role="button" tabIndex={0} {...bind}>
      {children}
    </div>
  );
}

storiesOf("Hello", module)
  .add("prevent scroll", () => (
    <div
      style={{
        height: "400px",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "10px",
        border: "1px solid black"
      }}
    >
      <GestureView
        style={{
          touchAction: "pan-x",
          height: "600px",
          width: "300px"
        }}
        enableMouse
        value={0}
        onRequestChange={i => console.log(i)}
      >
        <div style={{ flex: "1", background: "blue" }}>hello</div>
        <div>yeaaah</div>
      </GestureView>
    </div>
  ))
  .add("Example", () => (
    <div
      style={{
        height: "400px",
        overflowY: "auto"
      }}
    >
      <div>hi</div>
      <ControlledExample />
    </div>
  ))
  .add("initial index", () => (
    <div>
      <div>hi</div>
      <ControlledExample defaultIndex={1} />
    </div>
  ))
  .add("lazy loading", () => <LazyExample />)
  .add("Embedded with parent takeover", () => <ParentTakeoverExample />)
  .add("disable gestures", () => <DisabledExample />)
  .add("iphone example", () => <IOS />);

function DisabledExample({ defaultIndex = 0 }) {
  const [index, setIndex] = React.useState(defaultIndex);

  return (
    <BasicExample
      enableGestures={false}
      onRequestChange={(i: number) => setIndex(i)}
      value={index}
    />
  );
}

function ControlledExample({ defaultIndex = 0 }) {
  const [index, setIndex] = React.useState(defaultIndex);

  return (
    <BasicExample onRequestChange={(i: number) => setIndex(i)} value={index} />
  );
}

function ParentTakeoverExample() {
  const [childIndex, setChildIndex] = React.useState(0);
  const [parentIndex, setParentIndex] = React.useState(0);

  function onParentTerminationRequest({ delta }: StateType) {
    if (childIndex !== 0) {
      return true;
    }

    const [x] = delta;

    if (x < 0) {
      return true;
    }

    return false;
  }

  function onChildTerminationRequest({ delta }: StateType) {
    if (childIndex > 0) {
      return false;
    }

    const [x] = delta;

    if (x < 0) {
      return false;
    }

    return true;
  }

  return (
    <BasicExample
      value={parentIndex}
      onRequestChange={(i: number) => setParentIndex(i)}
      onTerminationRequest={onParentTerminationRequest}
      id="parent"
    >
      <BasicExample
        id="child"
        style={{
          height: "300px",
          overflow: "hidden"
        }}
        value={childIndex}
        onRequestChange={(i: number) => setChildIndex(i)}
        onTerminationRequest={onChildTerminationRequest}
      />
    </BasicExample>
  );
}

function BasicExample({
  onTerminationRequest,
  style,
  enableGestures,
  id,
  onRequestChange,
  value,
  children
}: any) {
  const ref = React.useRef<GestureViewHandles>(null);

  React.useEffect(() => {
    ref.current!.focus();
  }, []);

  return (
    <GestureView
      ref={ref}
      value={value}
      enableGestures={enableGestures}
      id={id}
      onTerminationRequest={onTerminationRequest}
      onRequestChange={onRequestChange}
      style={{
        width: "300px",
        height: "500px",
        ...style
      }}
    >
      <div style={{ flex: 1, background: "blue" }}>
        <div>
          <TouchableHighlight onPress={() => onRequestChange(1)}>
            next
          </TouchableHighlight>
          <RandomContent />
        </div>
      </div>
      <div style={{ flex: 1, background: "yellow" }}>
        <TouchableHighlight onPress={() => onRequestChange(0)}>
          prev
        </TouchableHighlight>
      </div>
      {(props: CallbackProps, active: boolean) => {
        return <div {...props}>Render callback</div>;
      }}
      <div
        style={{
          flex: 1,
          background: "green",
          paddingTop: "200px"
        }}
      >
        {children}
      </div>
    </GestureView>
  );
}

function LazyExample() {
  const [index, setIndex] = React.useState(0);
  return (
    <GestureView
      lazyLoad
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
      <div style={{ flex: 1, background: "green" }}>
        <RandomContent />
      </div>
    </GestureView>
  );
}

export function RandomContent() {
  React.useEffect(() => {
    console.log("mounted!");
  }, []);
  return (
    <React.Fragment>
      <p>
        Sunt consequat officia velit mollit nisi ex ut voluptate. Ipsum mollit
        fugiat non ipsum ea duis adipisicing duis tempor veniam et anim.
        Voluptate minim deserunt ipsum laboris duis aliquip consequat velit
        ipsum deserunt minim sit sint. Cillum aliqua mollit duis sunt minim elit
        ea laboris esse ipsum proident consequat enim. Deserunt quis ex labore
        amet officia veniam fugiat. Reprehenderit pariatur cillum consectetur
        consectetur ut.
      </p>
      <p>
        Sunt consequat officia velit mollit nisi ex ut voluptate. Ipsum mollit
        fugiat non ipsum ea duis adipisicing duis tempor veniam et anim.
        Voluptate minim deserunt ipsum laboris duis aliquip consequat velit
        ipsum deserunt minim sit sint. Cillum aliqua mollit duis sunt minim elit
        ea laboris esse ipsum proident consequat enim. Deserunt quis ex labore
        amet officia veniam fugiat. Reprehenderit pariatur cillum consectetur
        consectetur ut.
      </p>
      <p>
        Sunt consequat officia velit mollit nisi ex ut voluptate. Ipsum mollit
        fugiat non ipsum ea duis adipisicing duis tempor veniam et anim.
        Voluptate minim deserunt ipsum laboris duis aliquip consequat velit
        ipsum deserunt minim sit sint. Cillum aliqua mollit duis sunt minim elit
        ea laboris esse ipsum proident consequat enim. Deserunt quis ex labore
        amet officia veniam fugiat. Reprehenderit pariatur cillum consectetur
        consectetur ut.
      </p>
      <p>
        Sunt consequat officia velit mollit nisi ex ut voluptate. Ipsum mollit
        fugiat non ipsum ea duis adipisicing duis tempor veniam et anim.
        Voluptate minim deserunt ipsum laboris duis aliquip consequat velit
        ipsum deserunt minim sit sint. Cillum aliqua mollit duis sunt minim elit
        ea laboris esse ipsum proident consequat enim. Deserunt quis ex labore
        amet officia veniam fugiat. Reprehenderit pariatur cillum consectetur
        consectetur ut.
      </p>
      <p>
        Sunt consequat officia velit mollit nisi ex ut voluptate. Ipsum mollit
        fugiat non ipsum ea duis adipisicing duis tempor veniam et anim.
        Voluptate minim deserunt ipsum laboris duis aliquip consequat velit
        ipsum deserunt minim sit sint. Cillum aliqua mollit duis sunt minim elit
        ea laboris esse ipsum proident consequat enim. Deserunt quis ex labore
        amet officia veniam fugiat. Reprehenderit pariatur cillum consectetur
        consectetur ut.
      </p>
    </React.Fragment>
  );
}
