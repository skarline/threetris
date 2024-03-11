import React from "react"
import ReactDOM from "react-dom/client"
import Game from "./Game"
import "./styles.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
)
