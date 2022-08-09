import { Router } from "@vaadin/router";
import {state} from "../../state"
customElements.define("check-page", class CheckPage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    this.render()
  }
  addListeners(){
    const formEl = this.querySelector(".form__container")
    formEl.addEventListener("submit",async (e)=>{
      e.preventDefault();
      const target = e.target as any;
      console.log(target["email"].value);
      const emailExistRes = await state.processEmail(target["email"].value)
      if(emailExistRes!=null){
        Router.go("/password")
      }else{
        Router.go("/myData")
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
        <form id="data__form" class="form__container">
          <div class="form-inputs">
            <label class="form-label">Email</label>
             <input class="form-input name" name="email" type="text"></input>
          </div>
          <primary-button>Siguiente</primary-button>
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

    `
    this.appendChild(style)
     this.addListeners()
  }
})