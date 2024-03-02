## DOM Parse Filter Challenge

### Transform and Filter DOM

- Output match `Node` type
- Unsupported DOM nodes should be filtered out
- Supported types are stated in `Type` enum

```ts
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
```

### Solution

- recursively iterate DOM nodes
- leaf nodes are determined by looking at `children.length`

```ts
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
```

### Steps to run example

```
yarn
yarn run dev
```

- Above assumes node and yarn are pre-installed
- Output is displayed in the dev consoles

### Screenshots

Screenshots can be found at screenshots folder

![Screenshot 1](https://github.com/bigappleinsider/dom-parse-filter/blob/main/screenshots/Screen1.png?raw=true)
