import "./components/header"
import "./components/burger-menu"
import "./components/primary-button"
import "./components/secondary-button"
import "./components/border-button"
import "./components/input"
import "./components/pet-card"


import "./pages/home"
import "./pages/user-data"
import "./pages/check-email"
import "./pages/password"
import "./pages/report-pet"
import "./pages/my-reports"
import "./router"
import {state} from "./state"
import { initRouter } from "./router"
(function main(){
  state.init()
  initRouter(document.querySelector(".root"))
})();