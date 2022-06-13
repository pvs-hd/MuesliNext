import React, { useState } from "react";
import Layout, { LayoutStyle } from "./components/internal/Layout";
import Page from "./components/Page";
import Button from "./components/Widgets/ButtonWidget";
import Text from "./components/Widgets/TextWidget";
import { UserMetaData } from "./data/meta-data";

import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./components/internal/tools";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface Block {
  id?: string;
  type: string;
  data: any;
}
interface EditorData {
  time: number;
  blocks: Block[];
  version: string;
}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // could be fetched from backend
  const userData: UserMetaData = {
    name: "John",
    id: "123",
  };

  const editorCore = React.useRef<typeof ReactEditorJS>(null);

  const handleInitialize = React.useCallback((instance: any) => {
    editorCore.current = instance;
  }, []);

  const handleSave = React.useCallback(async () => {
    const savedData = await editorCore.current.save();
    console.log(JSON.stringify(savedData));
    localStorage.setItem("editor-content", JSON.stringify(savedData));
  }, []);

  const ReactEditorJS = createReactEditorJS();
  const exampleData: EditorData = {
    time: 1655066094269,
    blocks: [
      {
        id: "8ZoVTZZ9jg",
        type: "header",
        data: { text: "This is an example page", level: 2 },
      },
      {
        id: "LYJ1EHOLmQ",
        type: "paragraph",
        data: { text: "This is some text <b>with </b><i>styling</i>" },
      },
      {
        id: "qYaxKJcXGD",
        type: "paragraph",
        data: {
          text: 'This is a <a href="http://www.google.com">link</a><br>',
        },
      },
      {
        id: "cMoaX5FzF4",
        type: "paragraph",
        data: { text: "This is a list" },
      },
      {
        id: "D0jErz3_xG",
        type: "list",
        data: { style: "ordered", items: ["this", "that"] },
      },
      {
        id: "JxFUMr6p2l",
        type: "button",
        data: {
          link: "www.google.com",
          text: "A button (that is just a link)",
        },
      },
      {
        id: "O8eLtHr6Q-",
        type: "table",
        data: {
          withHeadings: false,
          content: [
            ["This", "is"],
            ["a", "Table"],
          ],
        },
      },
      {
        id: "3e5YMNDp_W",
        type: "code",
        data: { code: "A code block" },
      },
      {
        id: "e-E8VunCZv",
        type: "checklist",
        data: {
          items: [
            { text: "do this", checked: false },
            { text: "do that", checked: false },
            { text: "do yet another thing", checked: false },
          ],
        },
      },
      {
        id: "8oIBCrULms",
        type: "quote",
        data: {
          text: "This is a quote<br>",
          caption: "caption<br>",
          alignment: "left",
        },
      },
      {
        id: "QhXvUN9Amt",
        type: "raw",
        data: { html: "<p>custom html</p>" },
      },
    ],
    version: "2.24.3",
  };

  const defaultData: EditorData = {
    time: 0,
    blocks: [
      {
        type: "header",
        data: {
          text: "Welcome to your page!",
          level: 2,
        },
      },
      {
        type: "paragraph",
        data: { text: "Start writing here.." },
      },
    ],
    version: "2.11.10",
  };

  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);
  const dataString = localStorage.getItem("editor-content");
  if (dataString && !loaded) {
    setLoaded(true);
    setData(JSON.parse(dataString));
  }

  const loadExampleData = () => {
    localStorage.setItem("editor-content", JSON.stringify(exampleData));
    setData(exampleData);
    editorCore.current.render(exampleData);
  };

  const clearData = () => {
    localStorage.setItem("editor-content", JSON.stringify(defaultData));
    setData(defaultData);
    editorCore.current.render(defaultData);
  };

  return (
    <Page
      title="Demo Page"
      layout={LayoutStyle.default}
      metadata={{ visible: true, userData, showDebugInformation: false }}
    >
      <div>
        <ReactEditorJS
          data={data}
          tools={EDITOR_JS_TOOLS}
          onInitialize={handleInitialize}
          onChange={handleSave}
          placeholder="start writing here..."
        />
        {/* <ReactEditorJS tools={EDITOR_JS_TOOLS} /> */}
        <div className="float-right m-5">
          <Button text="load Example Data" onClick={loadExampleData} />
          <Button text="clear" onClick={clearData} />
        </div>
      </div>
    </Page>
  );
};

export default App;
