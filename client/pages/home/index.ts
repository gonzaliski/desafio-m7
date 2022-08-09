import { Router } from "@vaadin/router";
import { state} from "../../state"
customElements.define("home-page", class HomePage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    this.render()
  }
  addListeners(){
    console.log(state.data);
    
    // Router.go("/checkEmail")
  }

  render(){
    
    this.innerHTML=`
      <header-el></header-el>
      <mapbox-el></mapbox-el>
    `
    const style = document.createElement("style")
    style.innerHTML = `
    .map__container{
      display:flex;
      flex-flow:column;
      height:100vh;
    }
    #map{
      flex-grow:1;
    }
    `
    this.appendChild(style)
     this.addListeners()
  }
})