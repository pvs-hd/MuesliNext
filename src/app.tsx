import React, { useState } from "react";
import { defaultMetadata, PageMetaData, UserMetaData } from "./data/meta-data";

import PageEdit, { EditorData } from "./components/internal/PageEdit";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import OverviewPanel from "./components/internal/OverviewPanel";
import { LocalStorageService as StorageService } from "./data/localStorage";
import General from "./components/internal/General";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export interface Page {
  title: string;
  path: string;
  metadata: PageMetaData;
  content?: EditorData;
}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // Services here
  const storageService = new StorageService();

  // could be fetched from backend
  const userData: UserMetaData = {
    name: "John",
    id: "123",
  };

  const defaultPages: Page[] = [
    {
      title: "Welcome",
      path: "welcome-page",
      metadata: defaultMetadata,
    },
  ];

  const [pages, setPages] = useState(defaultPages);
  const [loaded, setLoaded] = useState(false);

  const onAddPage = (page: Page) => {
    setPages([...pages, page]);
    //localStorage.setItem("pages", JSON.stringify([...pages, page]));
    storageService.set("pages", [...pages, page]);
    location.replace(`/pages/${page.path}`);
  };

  const onChangePage = (uuid: string, content: EditorData): void => {
    // find page by uuid and update content
    const page = pages.find((p) => p.path === uuid);
    if (page) {
      page.content = content;
      //localStorage.setItem("pages", JSON.stringify(pages));
    }

    setPages([...pages]);
    storageService.set("pages", pages);
  };

  const onSetMetadata = (uuid: string, metadata: PageMetaData): void => {
    // find page by uuid and update content
    const page = pages.find((p) => p.path === uuid);
    if (page) {
      page.metadata = metadata;
    }

    setPages([...pages]);
    storageService.set("pages", pages);
  };

  // const pagesString = localStorage.getItem("pages");
  const pagesString = storageService.get("pages");
  if (pagesString && !loaded) {
    setLoaded(true);
    setPages(JSON.parse(pagesString));
  }

  const onExportData = () => {
    console.log("export data");
    storageService.exportToJsonFile();
  };

  const onLoadData = () => {
    console.log("load data");
    storageService.importFromJsonFile();
  };

  const onSaveData = (raw: string): boolean => {
    console.log("save data");
    return !storageService.save(raw);
  };

  const onResetData = () => {
    console.log("reset data");
    storageService.set("pages", defaultPages);
    // TODO: maybe not mix react and plain javascript
    document.location.reload();
  };

  return (
    <body className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-6 gap-4">
        <OverviewPanel
          pages={pages}
          onAddPage={onAddPage}
          onSetMetadata={onSetMetadata}
          col-span-1
        />
        <div className="grow col-start-3 col-span-3">
          <Router>
            <Routes>
              {pages.map((page) => (
                <Route
                  key={page.path}
                  path={`/pages/${page.path}`}
                  element={
                    <PageEdit
                      title={page.title}
                      uuid={page.path}
                      content={page.content}
                      metadata={page.metadata}
                      onChangePage={onChangePage}
                    />
                  }
                />
              ))}
              <Route
                path="/general"
                element={
                  <General
                    configuration={storageService.getConfiguration()}
                    onSaveData={onSaveData}
                    onExportData={onExportData}
                    onLoadData={onLoadData}
                    onResetData={onResetData}
                  />
                }
              />
              <Route
                path="/"
                element={<Navigate replace to="/pages/welcome-page" />}
              />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </Router>
        </div>
      </div>
    </body>
  );
};

export default App;
