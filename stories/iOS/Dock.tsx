import * as React from "react";
import "./Dock.css";

interface DockProps {}

export function Dock(props: DockProps) {
  return (
    <div className="Dock">
      <div className="Dock__content">{/* render icons here */}</div>
    </div>
  );
}
