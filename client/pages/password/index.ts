import { Router } from "@vaadin/router";
import {state} from "../../state"
customElements.define("password-page", class PasswordPage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    const cs = state.getState()
    console.log("new user:", cs.newUser);
    console.log("cs.activeSession:", cs.activeSession);
    
    if(!cs.activeSession && !cs.newUser && !cs.email){
      console.log("going to email check");
      
      Router.go("/checkEmail")
    }
    this.render()
  }
  addListeners(){
    const buttonSubmit = this.querySelector(".submit-button")
    const formEl = this.querySelector(".password__form")
    buttonSubmit.addEventListener("click",(e)=>{
      e.preventDefault();
      formEl?.dispatchEvent(new Event("submit"))
    })
    formEl.addEventListener("submit",async (e)=>{
      e.preventDefault();
      const target = e.target as any;
      if(!target["password"].value){
        alert("Ingrese una contraseña")
      }
      const cs = state.getState()
      console.log(target["password"].value);
        const token = await state.signIn(target["password"].value)
        if(token){
            cs.token = token
            cs.activeSession = true
            state.setState(cs)
            
            Router.go("/home")
        }else{
            alert("Contraseña incorrecta, intente de nuevo")
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
        <form id="data__form" class="password__form">
          <div class="form-inputs">
            <label class="form-label">Contraseña</label>
             <input class="form-input name" name="password" type="password"></input>
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
    .password__form{
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