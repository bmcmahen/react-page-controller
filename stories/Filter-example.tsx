import * as React from "react";
import GestureView, { CallbackProps, GestureViewHandles } from "../src";
import "./images.css";

export function FilterExample() {
  const [index, setIndex] = React.useState(0);

  return (
    <GestureView
      lazyLoad
      style={{
        width: "300px",
        height: "500px",
        border: "1px solid #eee"
      }}
      value={index}
      onRequestChange={i => setIndex(i)}
      enableMouse
    >
      {null}
      <div>I should appear first</div>
      <div>I should appear last</div>
      {null}
    </GestureView>
  );
}
