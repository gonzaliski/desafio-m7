const Router = require("@vaadin/router")
import {state} from "../../state"
customElements.define("check-page", class CheckPage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    console.log("check email page");
    
    this.render()
  }
  addListeners(){
    const buttonSubmit = this.querySelector(".submit-button")
    const formEl = this.querySelector("#email-form")
    buttonSubmit.addEventListener("click",(e)=>{
      e.preventDefault();
      formEl?.dispatchEvent(new Event("submit"))
    })
    formEl.addEventListener("submit",async (e)=>{
      const cs = state.getState()
      e.preventDefault();
      const target = e.target as any;
      if(!target["email"].value){
        alert("Ingrese un email")
      }else{

      console.log(target["email"].value);
      const emailExistRes = await state.processEmail(target["email"].value)
      if(emailExistRes!=null){
        console.log("a");
        Router.go("/password")
      }else{
        cs.newUser = true;
        state.setState(cs)
        
        Router.go("/myData")
      }
      
    }
      
    })
  }

  render(){
    
    this.innerHTML=`
      <header-el></header-el>
      <div class="content__container">
      <div class="content">
      <div class="title__container">
      <h2>Ingresar</h2>
      </div>
        <form id="email-form" class="form__container">
          <div class="form-inputs">
            <label class="form-label">Email</label>
             <input class="form-input name" name="email" type="text" required />
          </div>
          <primary-button class="submit-button">Siguiente</primary-button>
        </form>
      </div>
      </div>
    `
    const style = document.createElement("style")
    style.innerHTML = `
    .content__container{
      font-family: 'Poppins';
      height: 100%;
      width: 100vw;
      display: grid;
      justify-content: center;
      grid-template-rows: 50vh;
      grid-auto-columns: auto;
      align-items: center;
    }
    .content{
      width:70vw;
    }
    @media(min-width:768px){
      .content{
        max-width:700px;
      }
    }
    .form__container{
      width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items:center;
      gap:20px;
   }
    .form-inputs{
        width:100%;
        padding:0;
    } 
    .form-label{
      font-size:16px;
      font-weight:500;
  }
  .form-input{
      width:100%;
      border: 2px solid #000000;
      border-radius: 4px;
      height:30px;
  }                                         
    .title__container{
      width:100%;
      display: inline-block;
      text-align:left;
      margin-bottom:30px;
  }
  .submit-button{
    width:100%;
  }

    `
    this.appendChild(style)
     this.addListeners()
  }
})