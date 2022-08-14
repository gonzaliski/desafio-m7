import { Router } from "@vaadin/router";
import { state} from "../../state"
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { initMapboxGlobe } from "../../lib/mapbox";
import { LogOutput } from "concurrently";
customElements.define("home-page", class HomePage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    this.render()
  }
  addListeners(){
    console.log(state.data);
    
    // Router.go("/checkEmail")
  }

  async render(){
    
    this.innerHTML=`
      <header-el></header-el>
      <div class="pets-container"></div>
      <div class="mapbox-globe-el" style="width: 100%; height:calc(100vh - 74px)"></div>

    `
    const cs = state.getState()
    const petContainerEl = this.querySelector(".pets-container")
    const mapDiv = this.querySelector(".mapbox-globe-el")
      const map = await initMapboxGlobe(mapDiv)
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
        })
      map.addControl(geolocate);
        
      const locatorButtonContainer = document.querySelector(".mapboxgl-ctrl-top-right")
      const locatorButton = document.querySelector(".mapboxgl-ctrl.mapboxgl-ctrl-group")
      console.log(locatorButton);
      const locatorTittle = document.createElement("h3")
      locatorTittle.textContent = "Mi ubicación"
      locatorTittle.className = "locator-tittle"
      locatorButtonContainer.appendChild(locatorTittle)
      
      

      locatorButtonContainer.addEventListener("click",(e)=>{
        e.preventDefault()
        navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
          console.log("coordenadas actualeS:",position.coords);
          cs.lat = position.coords.latitude
          cs.lng = position.coords.longitude
          state.setState(cs)
        })

        state.nearPets().then((pets)=>{
          console.log(pets);
          let userPetsbyId = cs.userPets.map((p)=>{p.id})
          pets.forEach(pet => {
            const {lat,lng} = pet._geoloc
            const popup = new mapboxgl.Popup({
              offset: 25,
              className: "popup-styling",
            }).setHTML(`<h4 class="pet__popup-title">${pet.name}</h4>`);
            
            popup.on("open", () => {
              const petEl = document.createElement("div")
              console.log("pet card ");
              
              petEl.innerHTML =`<pet-card class="pet-card popup" name=${pet.name} source=${pet.imageURL} id=${pet.Id}
              reportable=${userPetsbyId.includes(pet.id) ? "false" : pet.id}></pet-card>`
              petEl.className="pet-el__container"
              petContainerEl.appendChild(petEl);
            });
            // const popup = new mapboxgl.Popup({ closeOnClick: false })
            // .setLngLat([lng, lat])
            // .setHTML(`<pet-card name=${pet.name} source=${pet.imageURL} id=${pet.Id}
            // reportable=${userPetsbyId.includes(pet.id) ? "false" : pet.id}></pet-card>`)
            // .addTo(map);
            popup.on("close", () => {
              const div = this.querySelector(
                ".pet-el__container"
              ) as any;
              console.log(div);
              
              if (div) {
                div.remove();
              }
            });
            const marker = new mapboxgl.Marker()
            .setLngLat([lng,lat])
            .setPopup(popup)
            .addTo(map);
          });
        })
        
      })

    const style = document.createElement("style")
    style.innerHTML = `
    .pets-container{
      height:auto;
    }    
 
     
    .pet-card.popup{
      width:300px;
      z-index:3;
      position:fixed;
      right:0;
      left:0;
      bottom:5%;
      margin:auto;
    }
    .map__container{
      display:flex;
      flex-flow:column;
      height:100vh;
    }
    .mapboxgl-ctrl-top-right {
      display: flex;
      top: 80%;
      right: 10%;
      flex-direction: row-reverse;
      align-items: center;
      gap: 15px;
      height: 40px;
  }
    .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
    margin: 0;
    }
    .locator-tittle{
      font-family:'Poppins';
      color:white;
      text-shadow: 2px 2px 4px #000000;
    }
    @media(min-width:768px){
      .locator-tittle{
        font-size:20px;
      }
    }
    .mapboxgl-ctrl-group button:only-child {
      border-radius: inherit;
      width: 40px;
      height: 40px;
  }
  @media(min-width:768px){
    .mapboxgl-ctrl-group button:only-child {
      width: 50px;
      height: 50px;
  }
  }
    `
    this.appendChild(style)
     this.addListeners()
  }
})