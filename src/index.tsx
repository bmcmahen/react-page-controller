import * as React from "react";
import { usePanResponder, StateType } from "pan-responder-hook";
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
  const [index, setIndex] = React.useState(0);
  const initialDirection = React.useRef<"vertical" | "horizontal" | null>(null);
  const [{ x }, set] = useSpring(() => ({ x: 0 }));
  const width = 250;
  const maxIndex = 2;
  const minIndex = 0;

  React.useEffect(() => {
    set({ x: index * -100 });
  }, [index]);

  function onEnd({ delta, velocity, direction }: StateType) {
    const [x] = delta;

    // 1. If the force is great enough, switch to the next index
    if (velocity > 0.2 && direction[0] > 0 && index > minIndex) {
      return setIndex(index - 1);
    }

    if (velocity > 0.2 && direction[0] < 0 && index < maxIndex) {
      return setIndex(index + 1);
    }

    // 2. if it's over 50% in either direction, move to it.
    // otherwise, snap back.

    const threshold = width / 2;
    if (Math.abs(x) > threshold) {
      if (x < 0 && index < maxIndex) {
        setIndex(index + 1);
      } else if (x > 0 && index > minIndex) {
        setIndex(index - 1);
      } else {
        set({ x: index * -100 });
      }
    } else {
      // return back!
      set({ x: index * -100 });
    }
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
    onMove: ({ delta }) => {
      const [x] = delta;
      const xPos = (x / width) * 100 + index * -100;

      set({
        x: xPos,
        immediate: true
      });
    },
    onRelease: onEnd,
    onTerminate: onEnd
  });

  return (
    <div
      {...bind}
      style={{
        width: "250px",
        overflow: "hidden"
      }}
    >
      <animated.div
        style={{
          flexDirection: "row",
          direction: "ltr",
          display: "flex",
          // provide resistance if < 0 or > maxWidth
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
        >
          <button onClick={() => setIndex(1)}>next</button>
        </div>
        <div
          style={{
            width: "100%",
            flexShrink: 0,
            overflow: "auto",
            minHeight: "400px",
            background: "blue"
          }}
        >
          <button onClick={() => setIndex(2)}>next</button>
        </div>

        <div
          style={{
            width: "100%",
            flexShrink: 0,
            overflow: "auto",
            minHeight: "400px",
            background: "red"
          }}
        >
          <button onClick={() => setIndex(0)}>next</button>
        </div>
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
