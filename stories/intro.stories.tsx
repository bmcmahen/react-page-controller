import * as React from "react";
import { storiesOf } from "@storybook/react";
import Pager, { CallbackProps, PagerHandles } from "../src";
import { StateType } from "pan-responder-hook";

import { useTouchable } from "touchable-hook";
import { ImagesExample } from "./Images-example";
import { ScrollingExample } from "./Scrolling-example";
import { FilterExample } from "./Filter-example";

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

storiesOf("react-gesture-view", module)
  .add("basic usage", () => <ControlledExample />)
  .add("initial index", () => <ControlledExample defaultIndex={1} />)
  .add("lazy loading", () => <LazyExample />)
  .add("disable gestures", () => <DisabledExample />)
  .add("images example", () => <ImagesExample />)
  .add("scrolling example", () => <ScrollingExample />)
  .add("filtering null children", () => <FilterExample />);

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
  const ref = React.useRef<PagerHandles>(null);

  React.useEffect(() => {
    ref.current!.focus();
  }, []);

  return (
    <Pager
      ref={ref}
      value={value}
      enableGestures={enableGestures}
      enableMouse
      id={id}
      onTerminationRequest={onTerminationRequest}
      onRequestChange={onRequestChange}
      style={{
        width: "300px",
        height: "100%",
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
    </Pager>
  );
}

function LazyExample() {
  const [index, setIndex] = React.useState(0);
  return (
    <Pager
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
    </Pager>
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
