import { Router } from "@vaadin/router";
import { state } from "../../state";
const editButton = require("../../assets/edit.png")
customElements.define("pet-card", class PetCard extends HTMLElement{
    name:string;
    source:string;
    petId:string;
    reportable:string;
    found:string;
    constructor(){
        super()
    }
    connectedCallback(){
        this.name = this.getAttribute("name")
        this.source = this.getAttribute("source")
        this.petId = this.getAttribute("id")
        this.found = this.getAttribute("found") 
        this.reportable = this.getAttribute("reportable") || "true"
        
        this.render()
    }
    addListeners(){
        const reportButton = this.querySelector(".report-pet-info")
        const editButton = this.querySelector(".edit-button")
        const textContainer = this.querySelector(".text-container")
        const container = this.querySelector(".card-container")
        const foundTittle = this.querySelector(".found-title")
        const deletePetLink = this.querySelector(".delete-pet__link")
        const cs = state.getState()
        
        if(this.reportable == "false"){
            reportButton.className+=' no-report'
            editButton.className+=' no-report'
            textContainer.className+=' no-report'
         
            editButton.addEventListener("click",()=>{
                let reqPet = cs.userPets.find(p=>p.id == this.petId)
                console.log(reqPet, this.petId);
                
                cs.petToEdit = reqPet
                cs.editMode = true
                state.setState(cs)
                Router.go("/reportPet")
            })
        }
        if(this.found == "true"){
            this.reportable = "false"
            container.className+=" found"
            foundTittle.className+=" found"
            editButton.className="edit-button"
            deletePetLink.className+=" found"

            deletePetLink.addEventListener("click",()=>{
                state.deletePet(this.petId)
                alert("Reporte eliminado")
                location.reload()
            })
        }
        }

    render(){
        this.innerHTML=`
        <div class="card-container">
            <img class="pet-img" src=${this.source}></img>
            <div class="text-container">
            <h3 class="pet-name__title">${this.name}</h3>
            <img src=${editButton} class="edit-button"></img>
            <a class="report-pet-info">Reportar información</a>
            <h3 class="found-title">Encontrado!</h3>
            </div>
            <a class="delete-pet__link">Eliminar</a>
        </div>
        `
        const style = document.createElement("style");
        style.innerHTML=`
        .card-container{
          font-family:'Poppins';
            display:flex;
            flex-direction:column;
            width:300px;
            height:auto;
            background-color:white;
            border: solid 2px black;
            border-radius:4px;
        }
        .card-container.found{
            box-shadow:0px 20px 25px -10px var(--found-color);
            border-color:var(--found-color);
        }
        .pet-img{
            width:100%;
        }
        
          .text-container{
            margin:30px 10px;
          }
          .text-container.no-report{
            display:flex;
            justify-content:space-between;
          }

          .report-pet-info.no-report{
            display:none;
          }
          .edit-button{
            display:none;
          }
          .edit-button.no-report{
            display:inline;
            height:24px;
          }
          .found-title{
            display:none;
          }
          .found-title.found{
            display:inline;
            color:var(--found-color);
          }
          .delete-pet__link{
            display:none;
          }
          .delete-pet__link.found{
            margin:10px;
            display:inline;
            text-decoration: underline;
          }
        `
        this.appendChild(style)
        this.addListeners()
    }

})