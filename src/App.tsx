import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

enum Type {
  html = "html",
  head = "head",
  meta = "meta",
  script = "script",
  link = "link",
  body = "body",
  div = "div",
  span = "span",
  p = "p",
  button = "button",
  a = "a",
  form = "form",
  input = "input",
  img = "img",
  text = "text",
}

interface Node {
  type: Type;
  attributes: Record<string, string>;
  children: Node[];
  text?: string;
}

const getAttributes = (node: HTMLElement | Element) => {
  const attributeNames = node.getAttributeNames();
  const attributes: Record<string, string> = {};
  attributeNames.forEach((name: string) => {
    const attributeValue = node.getAttribute(name);
    if (attributeValue != null) {
      attributes[name] = attributeValue;
    }
  });
  return attributes;
};

const isSupportedElement = (tagName: string) => {
  return Type[tagName.toLowerCase() as keyof typeof Type];
};

function recursiveTransform(node: HTMLElement | Element): Node {
  if (isSupportedElement(node.tagName) == null) {
    //@ts-expect-error: keep typing in sync with HTMLElement
    return;
  }

  if (node.children.length > 0) {
    const children = [];
    for (const child of node.children) {
      if (isSupportedElement(child.tagName) != null) {
        children.push(recursiveTransform(child));
      }
    }
    return {
      type: Type[node.tagName.toLowerCase() as keyof typeof Type],
      children,
      attributes: getAttributes(node),
    };
  } else {
    return {
      type: Type[node.tagName.toLowerCase() as keyof typeof Type],
      attributes: getAttributes(node),
      text: node.textContent ?? "",
      children: [],
    };
  }
}

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const els = document.getElementsByTagName("html");
    //traverseDOM(els[0]);
    const result = recursiveTransform(els[0]);
    console.log({ result });
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
