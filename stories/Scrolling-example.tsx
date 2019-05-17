import * as React from "react";
import GestureView, { CallbackProps, GestureViewHandles } from "../src";
import "./images.css";

export function ScrollingExample() {
  const [index, setIndex] = React.useState(0);

  const content = [
    {
      content:
        "Sint adipisicing dolore fugiat sint ut mollit laboris nisi minim et. Nostrud aliquip ipsum magna ipsum anim nostrud nisi minim duis non. Consectetur dolor do in quis incididunt eu ipsum fugiat laborum minim. Velit nostrud commodo Lorem minim exercitation esse labore esse enim sunt cillum do enim. Exercitation nisi laborum veniam id veniam sunt et qui ad consequat."
    },
    {
      content:
        "Ad cupidatat reprehenderit officia aliqua nostrud ipsum occaecat eu nisi non."
    },
    {
      content:
        "Id id in occaecat officia id ut. Sint anim officia ut dolore qui sint in voluptate fugiat nostrud non. Occaecat velit officia sunt aute in. Minim fugiat elit laboris tempor fugiat veniam qui. Proident veniam quis voluptate consectetur tempor excepteur exercitation duis excepteur exercitation non."
    },
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
        <div key={item.content} style={{ flex: 1, overflow: "auto" }}>
          <p>{item.content}</p>
        </div>
      ))}
    </GestureView>
  );
}
