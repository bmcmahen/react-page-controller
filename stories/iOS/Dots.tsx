import * as React from "react";
import cx from "classnames";
import "./Dots.css";

export interface DotsProps {
  count: number;
  activeIndex: number;
}

export function Dots({ count, activeIndex }: DotsProps) {
  return (
    <div className="Dots">
      <Dot active={false} />
      {Array.from(new Array(count)).map((_v, i) => {
        return <Dot key={i} active={i === activeIndex} />;
      })}
    </div>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <div
      className={cx("Dot", {
        "Dot--active": active
      })}
    />
  );
}
