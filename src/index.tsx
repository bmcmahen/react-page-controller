import * as React from "react";
import {
  useGestureResponder,
  StateType,
  Callbacks,
  ResponderEvent
} from "react-gesture-responder";
import { animated, useSpring, SpringConfig } from "react-spring";
import { useMeasure } from "./use-measure";
import useScrollLock from "use-scroll-lock";
import { usePrevious } from "./use-previous";

/**
 * ReactPager
 *
 * Provide views that can be swiped left or right (with touch devices).
 */

export interface PagerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: Array<React.ReactNode | CallbackProps>;
  value: number;
  enableMouse?: boolean;
  enableGestures?: boolean;
  focusOnChange?: boolean;
  enableScrollLock?: boolean;
  onRequestChange: (value: number) => void;
  animationConfig?: SpringConfig;
  lazyLoad?: boolean;
  onSetLazy?: (suggestedIndex: number) => number[];
  onTerminationRequest?: Callbacks["onTerminationRequest"];
  /** Optionally override onMoveShouldSet defaults */
  onMoveShouldSet?: (
    state: StateType,
    e: ResponderEvent,
    suggested: boolean
  ) => boolean;
}

export interface PagerHandles {
  focus(i?: number): void;
}

export interface CallbackProps {
  style: React.CSSProperties;
  "aria-hidden": boolean;
  ref: (el: HTMLDivElement | null) => void;
}

export type PagerChildCallback = (
  props: CallbackProps,
  active: boolean,
  load: boolean
) => React.ReactNode;

const Pager: React.RefForwardingComponent<PagerHandles, PagerProps> = (
  {
    children,
    id,
    value: index,
    onRequestChange,
    focusOnChange = false,
    enableScrollLock = true,
    enableGestures = true,
    enableMouse = false,
    lazyLoad = false,
    onSetLazy,
    animationConfig = { tension: 190, friction: 20, mass: 0.4 },
    onTerminationRequest,
    onMoveShouldSet,
    style,
    ...other
  },
  ref
) => {
  const containerRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [loaded, setLoaded] = React.useState(
    () => new Set(onSetLazy ? onSetLazy(index) : [index])
  );
  const { width } = useMeasure(containerRef);
  const childrenRefs = React.useRef<Map<number, HTMLDivElement | null>>(
    new Map()
  );

  const previousIndex = usePrevious(index);
  const shouldFocusRef = React.useRef<number | null>(null);

  useScrollLock(isDragging && enableScrollLock, containerRef);

  React.useEffect(() => {
    if (typeof previousIndex === "number" && previousIndex !== index) {
      shouldFocusRef.current = index;
    } else {
      shouldFocusRef.current = null;
    }
  }, [previousIndex, index]);

  function focusByIndex(i: number) {
    const el = childrenRefs.current.get(i);
    if (el) {
      el.focus();
    }
  }

  // expose an imperative focus function which focuses
  // the currently active index
  React.useImperativeHandle(ref, () => ({
    focus: (i?: number) => {
      focusByIndex(i || index);
    }
  }));

  const [{ x }, set] = useSpring(() => ({
    x: index * -100,
    config: animationConfig
  }));

  /**
   * Potentially autofocus after our animation
   */

  function onRest() {
    if (typeof shouldFocusRef.current === "number") {
      focusByIndex(shouldFocusRef.current);
    }
  }

  const renderableChildren = children.filter(child => child !== null);

  // gesture view counts
  const childCount = renderableChildren.length;
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

    let indexes: number | number[] = index;

    // allow the user to customize which indexes to load
    if (onSetLazy) {
      indexes = onSetLazy(index);
    }

    const indexesArray = Array.isArray(indexes) ? indexes : [indexes];
    const next = new Set(loaded);

    indexesArray.forEach(i => {
      // don't set items which are already loaded or are invalid
      if (loaded.has(i) || !isValidNextIndex(index)) {
        return;
      }

      next.add(i);
    });

    setLoaded(next);
  }

  // animate into position if our index changes
  React.useEffect(() => {
    set({
      x: index * -100,
      onRest
    });
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
      set({ x: index * -100, onRest });
    }
  }

  function onTermination({ delta }: StateType) {
    setIsDragging(false);
    releaseToPosition(delta[0]);
  }

  function onEnd({ delta, velocity, direction }: StateType) {
    const [x] = delta;
    setIsDragging(false);

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
        if (!enableGestures) {
          return false;
        }

        return false;
      },
      onMoveShouldSet: (state, e) => {
        const { initial, xy, initialDirection } = state;
        if (!enableGestures) {
          return false;
        }

        const set = initialDirection[0] != 0;

        // allow the user to tap into this component to potentially
        // override it
        if (onMoveShouldSet) {
          return onMoveShouldSet(state, e, set);
        }

        return set;
      },
      onGrant: () => {
        setIsDragging(true);
      },
      onMove: ({ delta, direction }) => {
        const [x] = delta;
        const xPos = (x / width) * 100 + index * -100;

        set({
          x: xPos,
          immediate: true,
          onRest: () => {}
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
        {renderableChildren.map((child, i) => {
          const styles: React.CSSProperties = {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignSelf: "stretch",
            justifyContent: "flex-start",
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
            outline: "none"
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

export default React.forwardRef(Pager);

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
