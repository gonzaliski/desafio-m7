import { Router } from "@vaadin/router"
import {state} from "../../state"

customElements.define("user-data", class UserData extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
      const cs = state.getState()
      if(!cs.activeSession && !cs.newUser){
        Router.go("/checkEmail")
      }
      this.render()
    }

    addListeners(){
      const userDataForm = this.querySelector("#user-data__form")
      const sendButton = this.querySelector(".send-button")
      sendButton.addEventListener("click",(e)=>{
        e.preventDefault();
        userDataForm.dispatchEvent(new Event("submit"))
      })
      userDataForm.addEventListener("submit",async(e)=>{
        const cs = state.getState()
        e.preventDefault()
        const target = e.target as any;
        if(target["password"].value == target["repeat-password"].value){
          const userData = {
            email:cs.email,
            fullName:target["name"].value,
            password:target["password"].value,
          }
          state.updateOrCreateUser(userData).then(()=>{
            Router.go("/home")
          })
          
        }else{
            alert("La contraseña no coincide")
          }
        
        // state.newUserData(target)
      })
    }
  
    render(){
      const cs = state.getState()
      this.innerHTML=`
        <header-el></header-el>
        <div class="content__container">
          <div class="content">
            <div class="title__container">
              <h2>Mis Datos</h2>
            </div>
            <form id="user-data__form" class="form__container">
              <ul class="form-inputs">
                <label class="form-label">Nombre</label>
                <li>
                <input class="form-input name" name="name" type="text" placeholder=${cs.fullName || ""}></input>
                </li>
          
                <li>
                <label class="form-label">Contraseña</label>
                <li>
                  <input class="form-input" name="password" type="password"></input>
                </li>
              <label class="form-label">Repetir contraseña</label>
              <li>
                  <input class="form-input" name="repeat-password" type="password"></input>
              </li>
                </li>
              </ul>
              <primary-button class="send-button" >Guardar</primary-button>
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
        }
        .form-inputs{
            width:100%;
            padding:0;
        }
        li{
            list-style:none;
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
            margin-bottom:20px;
        }
        .form-input.name{
          margin-bottom:60px;
        }

        .title__container{
            width:100%;
            display: inline-block;
            text-align:left;
            margin-bottom:30px;
        }
        .send-button{
          width:100%;
        }

      `
      this.appendChild(style)
      this.addListeners()
    }
  })