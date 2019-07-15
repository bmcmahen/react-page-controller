import * as React from "react";
import GestureView, { CallbackProps, GestureViewHandles } from "../src";
import "./images.css";

export function ScrollingExample() {
  const [index, setIndex] = React.useState(0);

  const content = [
    {
      content:
        "Eu magna culpa reprehenderit minim veniam culpa in exercitation aliqua laboris elit laboris occaecat consequat."
    },
    {
      content:
        "Dolore cillum adipisicing aliqua voluptate aliqua cupidatat aute dolore in. Exercitation amet consectetur consequat elit Lorem nisi sint. Nostrud voluptate id exercitation ullamco aliquip eu laborum labore duis culpa. Aute proident et ex pariatur nostrud. Sint minim nisi non velit elit consectetur esse sit id laborum ut nulla labore proident. Occaecat ut nulla officia in est occaecat veniam consequat anim exercitation. Fugiat et reprehenderit consectetur aliqua magna do nisi magna voluptate ea aliqua. Commodo sunt dolor est nostrud. Excepteur do aute eu nisi elit ad velit ex. Tempor et quis culpa sint Lorem deserunt minim elit aliqua labore amet ex dolor sint. In incididunt ad do et sit tempor eu sit. Proident dolore pariatur pariatur voluptate eiusmod irure. Sunt culpa enim magna deserunt exercitation cupidatat tempor aliqua in elit veniam non. Ipsum incididunt enim dolore ea consequat et excepteur deserunt velit mollit. Elit commodo ea mollit magna ea dolor non sit adipisicing commodo aute nisi. Incididunt sunt ullamco adipisicing deserunt deserunt in ullamco deserunt deserunt dolore non eu ea occaecat. Labore veniam duis officia amet cupidatat mollit ex. Eiusmod tempor aute labore occaecat."
    }
  ];

  return (
    <div style={{ height: "150vh" }}>
      <GestureView
        lazyLoad
        style={{
          width: "300px",
          height: "500px",
          border: "1px solid #eee"
        }}
        value={index}
        onRequestChange={i => setIndex(i)}
        enableMouse
      >
        {content.map(item => (
          <div
            key={item.content}
            style={{
              flex: 1,
              WebkitOverflowScrolling: "touch",
              overflow: "auto"
            }}
          >
            <p>{item.content}</p>
          </div>
        ))}
      </GestureView>
    </div>
  );
}
