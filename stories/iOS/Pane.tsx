import * as React from "react";
import "./Pane.css";

export interface PaneProps {
  color?: string;
  children?: React.ReactNode;
}

export function Pane({ color = "transparent", children }: PaneProps) {
  return (
    <div className="Pane" style={{ background: color }}>
      {children}
    </div>
  );
}
