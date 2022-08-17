import { Router } from "@vaadin/router";
import { state} from "../../state"
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { initMapboxGlobe } from "../../lib/mapbox";
customElements.define("home-page", class HomePage extends HTMLElement{
  constructor() {
    super();
  }
  connectedCallback(){
    this.render()
  }
  addListeners(){
    console.log(state.data);
    
  }

  async render(){
    
    this.innerHTML=`
      <header-el></header-el>
      <div class="report-pet-info__container"></div>
      <div class="pets-container"></div>
      <div class="mapbox-globe-el" style="width: 100%; height:calc(100vh - 74px)"></div>

    `
    const cs = state.getState()
    const petContainerEl = this.querySelector(".pets-container")
    const mapDiv = this.querySelector(".mapbox-globe-el")
    const reportPetInfo = this.querySelector(".report-pet-info__container")
    //inicia mapbox como globe
      const map = await initMapboxGlobe(mapDiv)
      
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
        })
        //añade el boton para obtener la ubicacion del usuario y centrar el mapa en ella
      map.addControl(geolocate);
        
      const locatorButtonContainer = document.querySelector(".mapboxgl-ctrl-top-right")
      const locatorButton = document.querySelector(".mapboxgl-ctrl.mapboxgl-ctrl-group")
      const locatorTittle = document.createElement("h3")
      locatorTittle.textContent = "Mi ubicación"
      locatorTittle.className = "locator-tittle"
      locatorButtonContainer.appendChild(locatorTittle)
      
      
    //funcionalidade que se triggerean al tocar el boton de localizacion
      locatorButtonContainer.addEventListener("click",(e)=>{
        e.preventDefault()
        navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
          console.log("coordenadas actualeS:",position.coords);
          cs.lat = position.coords.latitude
          cs.lng = position.coords.longitude
          state.setState(cs)
       

        state.nearPets().then(async (pets)=>{
          console.log(pets);
          //esta variable permite obtener las mascotas del usuario por su id, asi luego podremos determinar si el usuario las
          //puede reportar(si no fue él quien las reportó)
          let userPetsbyId 
            if(cs.userPets){
              userPetsbyId = cs.userPets.map((p)=>{return p.id.toString()})
            }else if(cs.activeSession){
              let getPets  = await state.getMyPets()
              let petsById = getPets.map((p)=>{return p.id.toString()})
              userPetsbyId =  petsById
            }
          
          console.log(userPetsbyId, "userpetsbyid");
          
          pets.forEach(pet => {
            
            const {lat,lng} = pet._geoloc
            const popup = new mapboxgl.Popup({
              offset: 25
            }).setHTML(`<h4 class="pet__popup-title">${pet.name}</h4>`);
            //al momento que se abre el popup se mostrará la mascota 
            popup.on("open", () => {
              const petEl = document.createElement("div")
              petEl.innerHTML =`<pet-card class="pet-card popup-open" name=${pet.name} source=${pet.imageURL} id=${pet.id}
              reportable=${userPetsbyId ? (userPetsbyId.includes(pet.id) ? "false" : "true") : "true"}
              location=${pet.locationName}></pet-card>`
              petEl.className="pet-el__container"

              petEl.addEventListener("report",(e:any)=>{
                console.log("reportando..",e.detail);
                const reportInfoEl = document.createElement("report-info")
                reportInfoEl.setAttribute("id", e.detail.petId) 
                reportInfoEl.setAttribute("name", e.detail.petName) 
                reportPetInfo.appendChild(reportInfoEl)
              })
              petContainerEl.appendChild(petEl);
            });
            //cuando se cierra el popup se borra la tarjeta 
            popup.on("close", () => {
              const div = this.querySelector(
                ".pet-el__container"
              );
              console.log("div",div);
              if (div) {
                const petElToClose = div.querySelector(
                  ".pet-card.popup-open"
                );
                
                petElToClose.className="pet-card popup-close"
                div.remove();
              }
            });
            //el marker que permite marcar las ubicaciones de las mascotas
            const marker = new mapboxgl.Marker()
            .setLngLat([lng,lat])
            .setPopup(popup)
            .addTo(map);
          });                         
        })
      })
      })

    const style = document.createElement("style")
    style.innerHTML = `
    .pets-container{
      height:auto;
    }    
 
     
    .pet-card{
      width:300px;
      z-index:3;
      position:fixed;
      right:0;
      left:0;
      bottom:5%;
      margin:auto;

    }
    .pet-card.popup-open{
      -webkit-animation: popup-open 1s ease forwards;
    }
    @keyframes popup-open {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    .pet-card.popup-close{
      -webkit-animation: popup-close 1s ease forwards;
    }
    @keyframes popup-close {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
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