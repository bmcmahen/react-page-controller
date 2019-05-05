import * as React from "react";
import { storiesOf } from "@storybook/react";
import { GestureView } from "../src";

storiesOf("Hello", module)
  .add("Example", () => (
    <div>
      <div>hi</div>
      <BasicExample />
    </div>
  ))
  .add("initial index", () => (
    <div>
      <div>hi</div>
      <BasicExample defaultIndex={1} />
    </div>
  ));

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

function RandomContent() {
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
