import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { store } from "./store/store.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        theme={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Notifications />

        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
);
