
customElements.define("secondary-button", class SecondaryButton extends HTMLElement{
  shadow: ShadowRoot;
  constructor() {
    super();
  }
  connectedCallback(){
    this.shadow = this.attachShadow({ mode: "open" });
    this.render()
  }
  addListeners(){
    // Router.go("/myData")
  }

  render(){
    this.shadow.innerHTML=`
 
          <button class="second-button">${this.textContent}</button>
      
    `
    const style = document.createElement("style")
    style.innerHTML = `
    .second-button{
        font-family:'Poppins';
        font-weight:bold;
        font-size:18px;
        background-color: var(--tertiary-color);
        border-radius: 4px;
        width:100%;
        height:50px;
        cursor:pointer;
    }
    .second-button:hover{
      color:white;
    }
    `
    this.shadow.appendChild(style)
     this.addListeners()
  }
})