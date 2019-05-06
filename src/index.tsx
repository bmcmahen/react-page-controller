import * as React from "react";
import { usePanResponder, StateType } from "pan-responder-hook";
import { animated, useSpring, SpringConfig } from "react-spring";
import { useMeasure } from "./use-measure";

/**
 * ReactGestureView
 *
 * Provide views that can be swiped left or right (with touch devices).
 */

interface GestureViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: number;
  enableMouse?: boolean;
  onRequestChange: (value: number) => void;
  animationConfig?: SpringConfig;
  lazyLoad?: boolean;
}

export function GestureView({
  children,
  value: index,
  onRequestChange,
  enableMouse = false,
  lazyLoad = false,
  animationConfig = { tension: 190, friction: 20, mass: 0.4 },
  style,
  ...other
}: GestureViewProps) {
  const containerRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(() => new Set([index]));
  const { width } = useMeasure(containerRef);
  const initialDirection = React.useRef<"vertical" | "horizontal" | null>(null);
  const [{ x }, set] = useSpring(() => ({
    x: index * -100,
    config: animationConfig
  }));

  // gesture view counts
  const childCount = React.Children.count(children);
  const maxIndex = childCount - 1;
  const minIndex = 0;

  function isValidNextIndex(index: number) {
    return index > 0 && index <= maxIndex;
  }

  function addIndexToLoaded(index: number) {
    if (!isValidNextIndex(index)) {
      return;
    }

    if (loaded.has(index)) {
      return;
    }

    const next = new Set(loaded);
    next.add(index);
    setLoaded(next);
  }

  // if our index changes animate into position
  React.useEffect(() => {
    set({ x: index * -100 });
    loaded.add(index);
  }, [index]);

  /**
   * Gesture end event
   */

  function onEnd({ delta, velocity, direction }: StateType) {
    const [x] = delta;

    // 1. If the force is great enough, switch to the next index
    if (velocity > 0.2 && direction[0] > 0 && index > minIndex) {
      return onRequestChange(index - 1);
    }

    if (velocity > 0.2 && direction[0] < 0 && index < maxIndex) {
      return onRequestChange(index + 1);
    }

    // 2. if it's over 50% in either direction, move to it.
    // otherwise, snap back.
    const threshold = width / 2;
    if (Math.abs(x) > threshold) {
      if (x < 0 && index < maxIndex) {
        onRequestChange(index + 1);
      } else if (x > 0 && index > minIndex) {
        onRequestChange(index - 1);
      } else {
        set({ x: index * -100 });
      }
    } else {
      // return back!
      set({ x: index * -100 });
    }
  }

  const { bind } = usePanResponder(
    {
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
      onMove: ({ delta, direction }) => {
        const [x] = delta;
        const xPos = (x / width) * 100 + index * -100;

        set({
          x: xPos,
          immediate: true
        });

        // potentially lazy load the item we are swiping towards
        addIndexToLoaded(direction[0] > 0 ? index - 1 : index + 1);
      },
      onRelease: onEnd,
      onTerminate: onEnd
    },
    {
      enableMouse
    }
  );

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
            WebkitOverflowScrolling: "touch",
            overflow: "auto"
          };

          const props = {
            style: styles,
            "aria-hidden": i !== index
          };

          const load = !lazyLoad || index === i || loaded.has(i);

          if (typeof child === "function") {
            return child(props, index === i, load);
          }

          return (
            <div className="Gesture-view__pane" {...props}>
              {load && child}
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
