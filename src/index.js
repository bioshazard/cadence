import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./routes/home";
import Manage from './routes/manage';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import {
  // createBrowserRouter as createRouter,
  createHashRouter as createRouter,
  RouterProvider,
} from "react-router-dom";

// https://github.com/vuejs/vue-router/issues/2125#issuecomment-519521424
// Force search params to be after hash since we are using a hash router
if (window.location.search) {
  window.location.replace(window.location.pathname + window.location.hash + window.location.search)
}

const router = createRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "manage/:activityId",
    element: <Manage />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// ty https://stackoverflow.com/a/60263791
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    alert("New version available!  Ready to update?");
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
