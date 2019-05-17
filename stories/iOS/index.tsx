import GestureView from "../../src";
import * as React from "react";
import { StateType, ResponderEvent } from "react-gesture-responder";
import { Pane } from "./Pane";
import { Dots } from "./Dots";
import "./styles.css";
import { Dock } from "./Dock";
import { IconGrid } from "./IconGrid";
import { Status } from "./Status";

export function IOS() {
  const [childIndex, setChildIndex] = React.useState(0);
  const [parentIndex, setParentIndex] = React.useState(1);

  function onMoveShouldSetParent(
    state: StateType,
    _e: ResponderEvent,
    suggested: boolean
  ) {
    if (suggested) {
      if (parentIndex === 0 || (state.delta[0] > 0 && childIndex === 0)) {
        return true;
      }
    }

    return false;
  }

  function onTerminationRequestParent(state: StateType) {
    if (state.delta[0] > 0 && childIndex === 0) {
      return false;
    }

    return true;
  }

  return (
    <div className="IOS" style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          boxSizing: "border-box",
          top: 0,
          padding: "1.35rem"
        }}
      >
        <Status />
      </div>
      <GestureView
        className="Gesture__parent"
        enableMouse
        value={parentIndex}
        id="parent"
        onRequestChange={i => setParentIndex(i)}
        onMoveShouldSet={onMoveShouldSetParent}
        onTerminationRequest={onTerminationRequestParent}
      >
        <Pane>widget crap</Pane>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <GestureView
            className="Gesture__apps"
            id="child"
            enableMouse
            value={childIndex}
            onRequestChange={i => setChildIndex(i)}
          >
            <Pane>
              <IconGrid />
            </Pane>
            <Pane>2</Pane>
            <Pane>3</Pane>
          </GestureView>
          <Dots count={3} activeIndex={childIndex} />
          <Dock />
        </div>
      </GestureView>
    </div>
  );
}
