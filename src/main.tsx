import React from "react"
import ReactDOM from "react-dom/client"
import { scan } from "react-scan"
import Game from "./Game"

import "./styles/main.css"
import "./styles/fonts.css"

if (import.meta.env.DEV) {
  scan()
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
)
