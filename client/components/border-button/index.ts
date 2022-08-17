
customElements.define("border-button", class BorderButton extends HTMLElement{
  shadow: ShadowRoot;
  constructor() {
    super();
  }
  connectedCallback(){
    this.shadow = this.attachShadow({ mode: "open" });

    this.render()
  }


  render(){
    this.shadow.innerHTML=`
 
          <button class="border-button">${this.textContent}</button>
      
    `
    const style = document.createElement("style")
    style.innerHTML = `
  
    .border-button{
        font-family:'Poppins';
        font-weight:bold;
        font-size:18px;
        color:var(--main-color);
        background:transparent;
        border: solid 3px var(--main-color);
        border-radius: 4px;
        width:100%;
        height:50px;
        transition:0.7s ease;
        cursor:pointer;
    }

    .border-button:hover{
      background-color: var(--main-color);
      color:white;
    }
    `
    this.shadow.appendChild(style)
  }
})