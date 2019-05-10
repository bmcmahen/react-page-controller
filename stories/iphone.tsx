import GestureView from "../src";
import * as React from "react";

export function IOS() {
  const [childIndex, setChildIndex] = React.useState(0);
  const [parentIndex, setParentIndex] = React.useState(1);
  return (
    <GestureView
      style={{ width: "300px", height: "600px" }}
      enableMouse
      value={parentIndex}
      id="parent"
      onRequestChange={i => setParentIndex(i)}
      onMoveShouldSet={(state, _e, suggested) => {
        if (suggested) {
          if (parentIndex === 0 || (state.delta[0] > 0 && childIndex === 0)) {
            return true;
          }
        }

        return false;
      }}
      onTerminationRequest={(state, e) => {
        if (state.delta[0] > 0 && childIndex === 0) {
          return false;
        }

        return true;
      }}
    >
      <Box color="green" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <GestureView
          style={{ flex: 1 }}
          id="child"
          enableMouse
          value={childIndex}
          onRequestChange={i => setChildIndex(i)}
        >
          <Box color="red" />
          <Box color="blue" />
          <Box color="yellow" />
        </GestureView>
        <div style={{ height: "40px", background: "black" }}>dock</div>
      </div>
    </GestureView>
  );
}

function Box({ color = "blue" }: any) {
  return (
    <div style={{ flex: 1, background: color }}>
      Lorem quis labore adipisicing et qui. Adipisicing sunt eu tempor laboris
      ipsum commodo irure dolore proident. Cillum deserunt mollit dolore
      occaecat ea culpa mollit nostrud deserunt ea. Quis ipsum quis cupidatat
      cupidatat tempor consectetur veniam aliqua reprehenderit deserunt. Veniam
      sint voluptate sint excepteur minim Lorem pariatur ad fugiat consequat.
      Exercitation pariatur ex dolore incididunt culpa culpa cupidatat Lorem
      occaecat cillum occaecat irure amet proident.
    </div>
  );
}
