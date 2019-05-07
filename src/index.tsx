import * as React from "react";
import {
  useGestureResponder,
  StateType,
  Callbacks
} from "react-gesture-responder";
import { animated, useSpring, SpringConfig } from "react-spring";
import { useMeasure } from "./use-measure";

/**
 * ReactGestureView
 *
 * Provide views that can be swiped left or right (with touch devices).
 */

export interface GestureViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: Array<React.ReactNode | CallbackProps>;
  value: number;
  enableMouse?: boolean;
  onRequestChange: (value: number) => void;
  animationConfig?: SpringConfig;
  lazyLoad?: boolean;
  onTerminationRequest?: Callbacks["onTerminationRequest"];
}

export interface GestureViewHandles {
  focus(i?: number): void;
}

export interface CallbackProps {
  style: React.CSSProperties;
  "aria-hidden": boolean;
  ref: (el: HTMLDivElement | null) => void;
}

export type GestureViewChildCallback = (
  props: CallbackProps,
  active: boolean,
  load: boolean
) => React.ReactNode;

const GestureView: React.RefForwardingComponent<
  GestureViewHandles,
  GestureViewProps
> = (
  {
    children,
    id,
    value: index,
    onRequestChange,
    enableMouse = false,
    lazyLoad = false,
    animationConfig = { tension: 190, friction: 20, mass: 0.4 },
    onTerminationRequest,
    style,
    ...other
  },
  ref
) => {
  const containerRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(() => new Set([index]));
  const { width } = useMeasure(containerRef);
  const initialDirection = React.useRef<"vertical" | "horizontal" | null>(null);
  const childrenRefs = React.useRef<Map<number, HTMLDivElement | null>>(
    new Map()
  );

  // expose an imperative focus function which focuses
  // the currently active index
  React.useImperativeHandle(ref, () => ({
    focus: (i?: number) => {
      const el = childrenRefs.current.get(i || index);
      if (el) {
        el.focus();
      }
    }
  }));

  const [{ x }, set] = useSpring(() => ({
    x: index * -100,
    config: animationConfig
  }));

  // gesture view counts
  const childCount = children.length;
  const maxIndex = childCount - 1;
  const minIndex = 0;

  /**
   * Prevent invalid indexes
   */

  function isValidNextIndex(index: number) {
    return index > 0 && index <= maxIndex;
  }

  /**
   * We keep a set of indexes that should
   * be loaded for lazy loading.
   */

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

  // animate into position if our index changes
  React.useEffect(() => {
    set({ x: index * -100 });
    loaded.add(index);
  }, [index]);

  /**
   * Handle gesture end event (either touchend
   * or pan responder termination).
   */

  function releaseToPosition(x: number) {
    // if it's over 50% in either direction, move to that index.
    // otherwise, snap back to existing index.
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

  function onTermination({ delta }: StateType) {
    releaseToPosition(delta[0]);
  }

  function onEnd({ delta, velocity, direction }: StateType) {
    const [x] = delta;

    // 1. If the force is great enough, switch to the previous index
    if (velocity > 0.2 && direction[0] > 0 && index > minIndex) {
      return onRequestChange(index - 1);
    }

    // or the next index, depending on direction
    if (velocity > 0.2 && direction[0] < 0 && index < maxIndex) {
      return onRequestChange(index + 1);
    }

    releaseToPosition(x);
  }

  /**
   * Observe our pan-responder to enable gestures
   */

  const { bind } = useGestureResponder(
    {
      onTerminationRequest,
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

        // only set when our initial direction is horizontal
        return gestureDirection === "horizontal";
      },
      onMove: ({ delta, direction }) => {
        const [x] = delta;
        const xPos = (x / width) * 100 + index * -100;

        set({
          x: xPos,
          immediate: true
        });

        // lazy load the item we are swiping towards
        addIndexToLoaded(direction[0] > 0 ? index - 1 : index + 1);
      },
      onRelease: onEnd,
      onTerminate: onTermination
    },
    {
      uid: id,
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
        {children.map((child, i) => {
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
            key: i,
            tabIndex: index === i ? 0 : -1,
            style: styles,
            "aria-hidden": i !== index,
            ref: (el: HTMLDivElement | null) => {
              childrenRefs.current!.set(i, el);
            }
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
};

export default React.forwardRef(GestureView);

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
