import { Router } from "@vaadin/router";
import {state} from "../../state"
import {map} from "lodash"
customElements.define("my-reports", class MyReportsPage extends HTMLElement{
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
  async addListeners(){
    const cs = state.getState()
    const petsContainer = this.querySelector(".pets-container")
    const titleContainer = this.querySelector(".title__container")
    const getPets = await state.getMyPets()
    if(getPets){
    const petsToList = map(getPets)
    console.log(getPets);
        let pets = petsToList.map(pet=>{return {
          id: pet.id,
          name: pet.name,
          imageURL:pet.image_URL,
          found:pet.found,
          lat:pet.lat,
          lng:pet.lng
        }})
        console.log("pets", pets);
        
        
        pets.forEach((pet)=>{
            const petCard = document.createElement("pet-card")
            petCard.setAttribute("name",pet.name)
            petCard.setAttribute("source",pet.imageURL)
            petCard.setAttribute("id",(pet.id).toString())
            petCard.setAttribute("found",pet.found)
            petCard.setAttribute("reportable","false")
            
            cs.userPets = pets
            petsContainer.appendChild(petCard)
        })
        state.setState(cs)
      }else{
        let noPetsEl = document.createElement("h3")
        noPetsEl.textContent="Aún no tenes mascotas reportadas"
        titleContainer.appendChild(noPetsEl)
      }
  }

  render(){
    
    this.innerHTML=`
      <header-el></header-el>
      <section class="report-pet-info__container">
      <div class="content">
      <div class="title__container">
      <h2>Mis mascotas reportadas</h2>
      </div>
      <div class="pets-container"></div>
    
      
      </div>
      </section>
    `
    const style = document.createElement("style")
    style.innerHTML = `
    .content{
      width:70vw;
      height: 100%;
    }
   .report-container{
      width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items:center;
      gap:20px;
   }
   .title__container{
      width:100%;
      display: inline-block;
      text-align:center;
      margin: 50px 0 50px 0;
  } 
  .pets-container{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:20px;
  }
  .report-pet-info__container{
    font-family: 'Poppins';
    width: 100vw;
    display: grid;
    justify-content: center;
    grid-auto-columns: auto;
    align-items: center;
    margin-bottom:40px;
  }

    `
    this.appendChild(style)
     this.addListeners()
  }
})