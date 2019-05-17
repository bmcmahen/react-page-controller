import * as React from "react";
import GestureView, { CallbackProps, GestureViewHandles } from "../src";
import "./images.css";

export function ImagesExample() {
  const [index, setIndex] = React.useState(0);

  const images = [
    {
      src:
        "https://images.unsplash.com/photo-1557958114-3d2440207108?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
    },
    {
      src:
        "https://images.unsplash.com/photo-1557939403-1760a0e47505?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1931&q=80"
    },
    {
      src:
        "https://images.unsplash.com/photo-1558029062-a37889b87526?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
    },
    {
      src:
        "https://images.unsplash.com/photo-1558088458-b65180740294?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1579&q=80"
    },
    {
      src:
        "https://images.unsplash.com/photo-1558039719-79cb7b60d279?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
    }
  ];

  return (
    <GestureView
      lazyLoad
      onSetLazy={i => {
        const indexes = [i];
        if (i > 0) {
          indexes.unshift(i - 1);
        }

        if (i < images.length) {
          indexes.push(i + 1);
        }

        return indexes;
      }}
      style={{
        width: "100vw",
        height: "600px"
      }}
      value={index}
      onRequestChange={i => setIndex(i)}
      enableMouse
    >
      {images.map(image => (
        <div key={image.src} style={{ flex: 1, overflow: "hidden" }}>
          <img
            onDragStart={e => e.preventDefault()}
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "0 auto",
              display: "block",
              maxHeight: "100%",
              objectFit: "contain"
            }}
            src={image.src}
          />
        </div>
      ))}
    </GestureView>
  );
}
