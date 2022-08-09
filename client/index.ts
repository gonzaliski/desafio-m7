import "./components/header"
import "./components/burger-menu"
import "./components/mapbox"
import "./components/primary-button"


import "./pages/home"
import "./pages/userData"
import "./pages/checkEmail"
import "./pages/password"
import "./router"
import {state} from "./state"
import { initRouter } from "./router"
(function main(){
   
  initRouter(document.querySelector(".root"))
})();