import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./RootLayout.tsx";
import "./index.css";
import App from "./App.tsx";

import HardSlot from "./Pages/HardSlot/HardSlot.tsx";
import Mines from "./Pages/Mines/Mines.tsx";
import Plinko from "./Pages/Plinko/Plinko.tsx";
import BlackJack from "./Pages/BlackJack/BlackJack.tsx";
import SimpleSlot from "./Pages/SimpleSlot/SimpleSlot.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { 
        index: true,
        element: <App />,
      },
      {
        path: "HardSlot",
        element: <HardSlot />,
      },
      {
        path: "Mines",
        element: <Mines />,
      },
      {
        path: "Plinko",
        element: <Plinko />,
      },
      {
        path: "BlackJack",
        element: <BlackJack />,
      },
      {
        path: "SimpleSlot",
        element: <SimpleSlot />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
