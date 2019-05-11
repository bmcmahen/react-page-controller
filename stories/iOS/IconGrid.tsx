import * as React from "react";
import { useSprings, animated } from "react-spring";

const griditems = [
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

export function IconGrid() {
  const order = React.useRef(griditems.map((_, i) => i));
  const [springs, setSprings] = useSprings(
    griditems.length,
    positions(order.current)
  );

  return (
    <div style={{ padding: "0.5rem", paddingTop: "50px" }}>
      {springs.map(({ xy, width, height }: any, i: number) => {
        return (
          <animated.div
            key={i}
            style={{
              padding: "0.5rem",
              width: width,
              height: height,
              boxSizing: "border-box",
              position: "absolute",
              transform: xy.interpolate((x: any, y: any) => {
                return `translate3d(${x}px, ${y}px, 0)`;
              })
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
              {griditems[i].name}
            </div>
          </animated.div>
        );
      })}
    </div>
  );
}

// return (
//   <div
//     key={item.name}
//     style={{
//       padding: "0.5rem",
//       width: item.width + "px",
//       boxSizing: "border-box",
//       height: item.height + "px",
//       position: "absolute",
//       transform: `translate3d(${item.left}px, ${item.top}px, 0)`
//     }}
//   >
//     <div
//       style={{
//         boxSizing: "border-box",
//         background: "white",
//         width: "100%",
//         height: "100%"
//       }}
//     >
//       {item.name}
//     </div>
//   </div>

function Icon() {}

const containerWidth = 375 - 16;
const bpr = 4;
const containerHeight = 800;
const rows = 6;
const rh = containerHeight / rows; // row height
const cw = containerWidth / bpr; // column width

function positions(order: any) {
  return (i: number) => {
    const left = (i % bpr) * cw;
    const top = Math.floor(i / bpr) * rh;
    return {
      xy: [left, top],
      width: cw,
      height: rh
    };
  };
}
