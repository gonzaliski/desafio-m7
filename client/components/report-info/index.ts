import { Router } from "@vaadin/router"
import { state } from "../../state";

customElements.define(
  "report-info",
  class ReportInfo extends HTMLElement {
    id: string;
    name: string;
    constructor() {
      super();
    }
    connectedCallback() {
      this.id = this.getAttribute("id");
      this.name = this.getAttribute("name");
      this.render();
    }
    addListeners() {
      const formEl = this.querySelector("#send-info__form");
      const sendButton = this.querySelector(".send-button");
      const closeButton = this.querySelector(".close__container");
      sendButton.addEventListener("click", (e) => {
        e.preventDefault();
        formEl.dispatchEvent(new Event("submit"));
      });
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        let data = {
            petName:this.name,
            reporterName:target["name"].value,
            phoneNumber:target["phone-number"].value,
            lastSeenLocation:target["last-seen-location"].value
        }
        if(data.reporterName &&
        data.phoneNumber &&
        data.lastSeenLocation){
            state.reportInfo(data,this.id).then(()=>{
                alert("Informacion enviada")
                this.remove()
            })

        }        
      });
      closeButton.addEventListener("click",()=>{
        this.remove()
      })
    }

    render() {
      this.innerHTML = `
        <div class="content">
          <div class="close__container">
             <i class="fa-solid fa-x"></i>
      
          </div>
            <div class="title__container">
              <h2>Reportar info de ${this.name}</h2>
            </div>
            <form id="send-info__form" class="form__container">
              <ul class="form-inputs">
                <label class="form-label">Tu nombre</label>
                <li>
                     <input class="form-input"  name="name" type="text"/>
                </li>
                     <label class="form-label">Tu telefono</label>
                <li>
                     <input class="form-input" name="phone-number" type="number" max="15"/>
                </li>
                     <label class="form-label">Donde lo viste?</label>
                <li>
                     <textarea class="form-input large" name="last-seen-location" type="text" rows="5" ></textarea>
                </li>
            
              </ul>
              <primary-button class="send-button" >Enviar</primary-button>
            </form>
          </div>
        `;
      const style = document.createElement("style");
      style.innerHTML = `
        .content{
            font-family:'Poppins';
            padding: 10% 20%;
            width: 100%;
            height: 100vh;
            position: relative;
            z-index: 9;
            background-color: white;
            
          }
          @media(min-width:768px){
            .content{
              padding: 10% 40%;
            }
          }

          .close__container{
            position: absolute;
            top:5%;
            right:20%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid;
          }
          

          .form__container{
              width:100%;
              height:100%;
              display:flex;
              flex-direction:column;
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
          .form-input.large{
            height:auto;
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
        `;
      this.appendChild(style);
      this.addListeners();
    }
  }
);
