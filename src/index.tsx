import * as React from "react";
import { usePanResponder } from "pan-responder-hook";
import { animated, useSpring } from "react-spring";

/**
 * Basic plan:
 *
 * Have a primary container which has overflow hidden. Gestures are mapped to this.
 *
 * Have a secondary container which is responsible for animations. It has the attributes:
 * - flexDirection: row
 * - direction: ltr;
 * - display: flex;
 * - willChange: transform;
 * - transform: translate(0%, 0px);
 *
 * - transform related to index: translate(-100%, 0px) (for 1st index)
 *
 * Each child has, width: 100%; flex-shrink: 0; overflow: auto;
 *
 */

export function GestureView() {
  const initialDirection = React.useRef<"vertical" | "horizontal" | null>(null);
  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  function onEnd() {
    console.log("end!");
  }

  const { bind } = usePanResponder({
    onStartShouldSet: () => {
      initialDirection.current = null;
      return false;
    },
    onMoveShouldSet: ({ initial, xy }) => {
      const gestureDirection =
        initialDirection.current || getDirection(initial, xy);

      if (!initialDirection.current) {
        initialDirection.current = gestureDirection;
      }

      return gestureDirection === "horizontal";
    },
    onMove: state => {
      console.log("state", state);
    },
    onRelease: onEnd,
    onTerminate: onEnd
  });

  return (
    <div
      {...bind}
      style={{
        overflowX: "hidden"
      }}
    >
      <animated.div
        style={{
          flexDirection: "row",
          direction: "ltr",
          display: "flex",
          transform: x.interpolate(x => `translateX(${x}%)`)
        }}
      >
        <div
          style={{
            width: "100%",
            flexShrink: 0,
            overflow: "auto",
            minHeight: "400px",
            background: "yellow"
          }}
        />
        <div
          style={{
            width: "100%",
            flexShrink: 0,
            overflow: "auto",
            minHeight: "400px",
            background: "blue"
          }}
        />

        <div
          style={{
            width: "100%",
            flexShrink: 0,
            overflow: "auto",
            minHeight: "400px",
            background: "red"
          }}
        />
      </animated.div>
    </div>
  );
}

/**
 * Compare two positions and determine the direction
 * the gesture is moving (horizontal or vertical)
 *
 * If the difference is the same, return null. This happends
 * when only a click is registered.
 *
 * @param initial
 * @param xy
 */

function getDirection(initial: [number, number], xy: [number, number]) {
  const xDiff = Math.abs(initial[0] - xy[0]);
  const yDiff = Math.abs(initial[1] - xy[1]);

  // just a regular click
  if (xDiff === yDiff) {
    return null;
  }

  if (xDiff > yDiff) {
    return "horizontal";
  }

  return "vertical";
}
