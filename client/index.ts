import "./components/header"
import "./components/burger-menu"
import "./components/mapbox"
import "./components/primary-button"
import "./pages/home"
import "./pages/userData"
import "./pages/checkEmail"
import "./pages/password"
import "./root"
import {state} from "./state"
import { Router } from "@vaadin/router";
(function main(){
   Router.go("/home")
})();