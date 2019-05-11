import * as React from "react";
import { useSprings, animated, interpolate, SpringValue } from "react-spring";
import {
  useGestureResponder,
  CallbackType,
  StateType
} from "react-gesture-responder";
import clamp from "lodash-es/clamp";
import swap from "./move";

interface ItemType {
  name: string;
}

const griditems: Array<ItemType> = [
  {
    name: "Ben"
  },
  {
    name: "Joe"
  },
  {
    name: "Ken"
  },
  {
    name: "Rod"
  },
  {
    name: "Bob"
  }
];

interface StyleProps {
  [x: string]: SpringValue<any>;
  xy: SpringValue<number[]>;
  width: SpringValue<number>;
  height: SpringValue<number>;
  zIndex: SpringValue<string>;
  scale: SpringValue<number>;
  opacity: SpringValue<number>;
}

export function IconGrid() {
  const order = React.useRef(griditems.map((_, i) => i));
  const [springs, setSprings] = useSprings(
    griditems.length,
    positions(order.current)
  );

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        padding: "0.5rem",
        paddingTop: "50px"
      }}
    >
      {springs.map((styles: StyleProps, i: number) => {
        /**
         * Handle dragging
         */

        function handleMove(state: StateType, down: boolean) {
          const curIndex = order.current.indexOf(i);
          const targetIndex = clamp(
            getTargetIndex(curIndex, state.delta[0], state.delta[1]),
            griditems.length - 1
          );

          const newOrder = swap(
            order.current,
            curIndex,
            targetIndex
          ) as number[];

          setSprings(positions(newOrder, down, i, curIndex, state.delta));

          if (!down) {
            order.current = newOrder;
          }
        }

        /**
         * Handle releases
         */

        function onEnd(state: StateType) {
          handleMove(state, false);
        }

        function onMove(state: StateType) {
          handleMove(state, true);
        }

        return (
          <Icon
            key={griditems[i].name}
            item={griditems[i]}
            styles={styles}
            onMove={onMove}
            onEnd={onEnd}
          />
        );
      })}
    </div>
  );
}

interface ItemProps {
  item: ItemType;
  styles: StyleProps;
  onMove: CallbackType;
  onEnd: (state: StateType) => void;
}

function Icon({ styles, item, onMove, onEnd }: ItemProps) {
  const dragging = React.useRef(false);

  const { bind } = useGestureResponder(
    {
      onMoveShouldSet: () => {
        // should only be true once long press triggers edit
        dragging.current = true;
        return true;
      },
      onMove: onMove,
      onTerminationRequest: () => {
        // once we are dragging, prevent other responders
        // from taking over
        if (dragging.current) {
          return false;
        }

        return true;
      },
      onTerminate: (state, e) => {
        dragging.current = false;
        onEnd(state);
      },
      onRelease: (state, e) => {
        dragging.current = false;
        onEnd(state);
      }
    },
    {
      enableMouse: true
    }
  );

  return (
    <animated.div
      {...bind}
      style={{
        padding: "0.5rem",
        width: styles.width,
        height: styles.height,
        zIndex: styles.zIndex,
        opacity: styles.opacity,
        boxSizing: "border-box",
        position: "absolute",
        transform: interpolate(
          [styles.xy, styles.scale],
          (x: any, s) => `translate3d(${x[0]}px, ${x[1]}px, 0) scale(${s})`
        )
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          background: "white",
          width: "100%",
          height: "100%"
        }}
      >
        {item.name}
      </div>
    </animated.div>
  );
}

// potentially make these things dynamic by actually
// measuring stuff and keeping it in state
const containerWidth = 375 - 16;
const bpr = 4;
const containerHeight = 800;
const rows = 6;
const rh = containerHeight / rows; // row height
const cw = containerWidth / bpr; // column width

function positions(
  order: number[],
  down?: boolean,
  originalIndex?: number,
  curIndex?: number,
  delta?: [number, number]
) {
  return (i: number) => {
    const pos =
      down && i === originalIndex
        ? {
            ...getDragPosition(curIndex!, delta![0], delta![1]),
            immediate: true,
            zIndex: "1",
            scale: 1.1,
            opacity: 0.8
          }
        : {
            ...getPositionForIndex(order.indexOf(i)),
            immediate: false,
            zIndex: "0",
            scale: 1,
            opacity: 1
          };

    return pos;
  };
}

function getPositionForIndex(i: number) {
  const left = (i % bpr) * cw;
  const top = Math.floor(i / bpr) * rh;
  return {
    xy: [left, top],
    width: cw,
    height: rh
  };
}

function getDragPosition(
  startIndex: number,
  dx: number,
  dy: number,
  center: boolean = false
) {
  // get starting position
  const {
    xy: [left, top],
    width,
    height
  } = getPositionForIndex(startIndex);

  // get current position by adding dy / dx to
  // the starting position
  return {
    xy: [
      left + dx + (center ? width / 2 : 0),
      top + dy + (center ? height / 2 : 0)
    ],
    width,
    height
  };
}

function getTargetIndex(startIndex: number, dx: number, dy: number) {
  const {
    xy: [cx, cy]
  } = getDragPosition(startIndex, dx, dy, true);

  // get the target index
  return getIndexFromCoordinates(cx, cy);
}

function getIndexFromCoordinates(x: number, y: number) {
  return Math.floor(y / rh) * bpr + Math.floor(x / cw);
}
