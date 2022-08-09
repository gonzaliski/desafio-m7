
customElements.define("primary-button", class PrimaryButton extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    this.render()
  }
  addListeners(){
    // Router.go("/myData")
  }

  render(){
    this.className="container"
    this.innerHTML=`
 
          <button class="save-button">${this.textContent}</button>
      
    `
    const style = document.createElement("style")
    style.innerHTML = `
    .container{
        width:100%;
    }
    .save-button{
        font-family:'Poppins';
        font-weight:bold;
        font-size:18px;
        background: #FF9DF5;
        border-radius: 4px;
        width:100%;
        height:50px;
    }
    `
    this.appendChild(style)
     this.addListeners()
  }
})