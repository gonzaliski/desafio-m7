
customElements.define("primary-button", class PrimaryButton extends HTMLElement{
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
 
          <button class="save-button">${this.textContent}</button>
      
    `
    const style = document.createElement("style")
    style.innerHTML = `

    .save-button{
        font-family:'Poppins';
        font-weight:bold;
        font-size:18px;
        background-color: var(--secondary-color);
        border-radius: 4px;
        width:100%;
        height:50px;
        transition:0.7s ease;
        cursor:pointer;
    }
    .save-button:hover{
      color:white;
    }
    `
    this.shadow.appendChild(style)
     this.addListeners()
  }
})