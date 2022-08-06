import { Router } from "@vaadin/router";

customElements.define("home-page", class HomePage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    this.render()
  }
  addListeners(){
    Router.go("/myData")
  }

  render(){
    
    this.innerHTML=`
      <header-el></header-el>
      <mapbox-el></mapbox-el>
    `
    const style = document.createElement("style")
    style.innerHTML = `

    `
    this.appendChild(style)
     this.addListeners()
  }
})