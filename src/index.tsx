import * as React from "react";
import { usePanResponder, StateType } from "pan-responder-hook";
import { animated, useSpring } from "react-spring";
import { useMeasure } from "./use-measure";

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

interface GestureViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: number;
  onRequestChange: (value: number) => void;
}

export function GestureView({ children, style, ...other }: GestureViewProps) {
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef(null);
  const { width } = useMeasure(containerRef);
  const initialDirection = React.useRef<"vertical" | "horizontal" | null>(null);
  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  // gesture view counts
  const childCount = React.Children.count(children);
  const maxIndex = childCount - 1;
  const minIndex = 0;

  // if our index changes animate into position
  React.useEffect(() => {
    set({ x: index * -100 });
  }, [index]);

  /**
   * Gesture end event
   */

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
      ref={containerRef}
      className="Gesture-view"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        ...style
      }}
      {...other}
    >
      <animated.div
        className="Gesture-view__animated-container"
        style={{
          flexDirection: "row",
          direction: "ltr",
          willChange: "transform",
          minHeight: 0,
          flex: 1,
          display: "flex",
          transform: x.interpolate(
            x => `translateX(${taper(x, maxIndex * -100)}%)`
          )
        }}
      >
        {React.Children.map(children, (child, i) => {
          const styles: React.CSSProperties = {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignSelf: "stretch",
            flexShrink: 0,
            overflow: "auto"
          };

          const props = {
            style: styles,
            "aria-hidden": i !== index
          };

          if (typeof child === "function") {
            return child(props, index === i);
          }

          return (
            <div className="Gesture-view__pane" {...props}>
              {child}
            </div>
          );
        })}
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

/**
 * Add some resistance when swiping in a direction
 * that doesn't contain another pane
 */

function taper(x: number, maxWidth: number) {
  if (x > 0) {
    return x * 0.3;
  }

  if (x < maxWidth) {
    const diff = x - maxWidth;
    return x - diff * 0.7;
  }

  return x;
}
