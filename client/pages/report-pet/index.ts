import { Router } from "@vaadin/router"
import { state } from "../../state";
import { dropzoneUpload } from "../../lib/dropzone";
import { mapboxSearch, initMapboxMap } from "../../lib/mapbox";
import * as mapboxgl from "mapbox-gl";
const defaultLocation = {
  lat:-58.381512,
  lng:-34.603719 
}

customElements.define(
  "report-pet-page",
  class ReportPet extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState()
      if(!cs.activeSession && !cs.newUser){
        Router.go("/checkEmail")
      }
      
      this.render();
    }
    addListeners() {
      const cs = state.getState()
      const reportButton = this.querySelector(".report-button");
      
      const mapboxInput = this.querySelector(".location-input");
      const mapEl = this.querySelector(".mapbox-map");
      const mapboxButton = this.querySelector(".mapbox-button");
      
      const petNameInput = this.querySelector(".pet-name__input");
      const locationInput = this.querySelector(".location-input");
      
      const dropzoneImage: any = this.querySelector(".report-dropzone__img");
      const dropzoneButton = this.querySelector(".dropzone-button");
      const cancelButton = this.querySelector(".cancel-button")
      const unpublishButton = this.querySelector(".unpublish-pet__link")
      
      if(cs.editMode){
        const foundButton = this.querySelector(".founded-button")
        const overridePetName = petNameInput.shadowRoot.querySelector("input")
        const overrideLocation = locationInput.shadowRoot.querySelector("input")
        overridePetName.value = cs.petToEdit.name
        overrideLocation.value = cs.petToEdit.locationName
        reportButton.shadowRoot.querySelector("button").textContent = "Guardar"
        foundButton.className+=" active"
        const foundButtonActive = this.querySelector(".founded-button.active")
        foundButtonActive.addEventListener("click",()=>{
          state.reportFound(cs.petToEdit.id)
          Router.go("/myReportedPets")
        })
        unpublishButton.addEventListener("click",()=>{
          state.deletePet(cs.petToEdit.id).then(()=>{
            alert("Reporte despublicado")
            Router.go("/myReportedPets")
          })

        })
      }
      var imageURL;

      const dropzoneInit = dropzoneUpload(dropzoneImage, dropzoneButton);
      dropzoneInit.then((dropzone) => {
        dropzone.on("thumbnail", (file) => {
          dropzoneImage.src = file.dataURL;
          imageURL = file.dataURL;

          if (file.width > 300) {
            dropzone.options.resizeWidth = 300;
          }
        });
        dropzone.processQueue();
        
      });
      

      let currentLat, currentLng
      if(cs.lat && cs.lng){
        currentLat = cs.lat
        currentLng = cs.lng
      }else{
        currentLat = defaultLocation.lat
        currentLng = defaultLocation.lng
      }
      if(cs.editMode){
        currentLat = cs.petToEdit.lat
        currentLng = cs.petToEdit.lng
      }
      var locationToSearch
      initMapboxMap(mapEl, currentLat, currentLng).then((map) => {
         
        console.log(map);
        const marker = new mapboxgl.Marker();
        marker.setLngLat([currentLng, currentLat]).addTo(map);
        state.currentMarkerPosition(currentLng, currentLat);
        mapboxButton.addEventListener("click", (e) => {
          locationToSearch = mapboxInput.shadowRoot.querySelector("input").value;
           
          mapboxSearch(locationToSearch, function (results) {
            
            const firstResult = results[0];
            const [lng, lat] = firstResult.geometry.coordinates;
            marker.setLngLat([lng, lat])
            map.setCenter([lng, lat]);
            map.setZoom(14);
            state.currentMarkerPosition(lat, lng);
          });
        });
      });

      reportButton.addEventListener("click",()=>{
        let petName = petNameInput.shadowRoot.querySelector("input").value
        let petData ={
          petName:petName,
          imageURL:imageURL,
          lat:cs.petToReportLat,
          lng:cs.petToReportLng,
          locationName:locationToSearch
        }
        
        if(!petName && !cs.editMode){
          alert("Falta el nombre de la mascota")
        }
        if(!imageURL && !cs.editMode){
          alert("Falta la foto de la mascota")
        }
        if(!locationToSearch && !cs.editMode){
          alert("Falta la ubicacion de la mascota")
        }
        if(cs.editMode){
          state.updatePet(petData).then(()=>{
            cs.editMode = false
            cs.petToEdit =""
            state.setState(cs)
            alert("Mascota Actualizada")
            Router.go("/myReportedPets")
          })
        }else if (petData.petName && petData.imageURL && 
          petData.lat && petData.lng && petData.locationName){

          state.reportPet(petData).then(()=>{
            alert("Mascota Reportada")
            Router.go("/myReportedPets")
          })
        }
      })
      cancelButton.addEventListener("click",()=>{
        cs.editMode = false
        cs.petToEdit =""
        Router.go("/home")
      })
      
    }
    render() {
      const cs = state.getState()
      var defaultImg = require("../../assets/default-image.jpg");
      if(cs.editMode){
        
        defaultImg = cs.petToEdit.imageURL

      }
      this.innerHTML = `
      <header-el ></header-el>
      <section class="content__container">

        <div class="content">

         <div class="title__container">
            <h2>${cs.editMode ? "Editar" : "Reportar"} mascota perdida</h2>
         </div>

        <div class="report-container">
          <div class="form-inputs">
            <label class="form-label">Nombre</label>
             <input-el class="pet-name__input" ></input-el>
          </div>

          <div class="image-drop__container">
            <img class="report-dropzone__img"src=${defaultImg}></img>
            <secondary-button class="dropzone-button">Agregar/modificar foto</secondary-button>
            </div>

            <div class="mapbox__container">
              <div class="mapbox-map" style="width:-webkit-fill-available; height:200px;"></div>
              <div class="input-container">
              <label class="form-label" style="display:block">Ubicacion</label>
               <div class="input-items__container">
                 <input-el class="location-input"  type="text"></input-el>
                 <secondary-button class="mapbox-button">Buscar</secondary-button>
                </div>
              </div>
            <p class="location-text">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
          </div>

          <primary-button class="report-button">Reportar como perdido</primary-button>
          <secondary-button class="founded-button">Reportar como encontrado</secondary-button>
          <border-button class="cancel-button">Cancelar</border-button>
          <a class="${cs.editMode? "unpublish-pet__link active": "unpublish-pet__link"}">Despublicar</a>

        </div>
      </div>
      </section>
    `;
   

      const style = document.createElement("style");
      style.innerHTML = `

      primary-button, secondary-button,
      border-button{
        width:100%;
      }
  
    .content__container{
      font-family: 'Poppins';
      height: 100%;
      width: 100vw;
      display: grid;
      justify-content: center;
      grid-auto-columns: auto;
      align-items: center;
      margin-top:20px;
      margin-bottom:40px;
    }
    .content{
      width:70vw;
    }
    @media(min-width:768px){
      .content{
        max-width:500px;
      }
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
    .form-inputs{
        width:100%;
        padding:0;
    } 
    .form-label{
      font-size:16px;
      font-weight:500;
  }
                                 
    .title__container{
      width:100%;
      display: inline-block;
      text-align:left;
      margin-bottom:30px;
  }
  .image-drop__container{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:20px;
  }
  .dropzone-button{
    width:100%;
  }
    .report-dropzone__img{
      width:100%;
    }
    .mapbox__container{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
    }
    .input-container{
      width: 100%;
      display: flex;
      gap: 5px;
      flex-direction:column;
    }

    .mapbox-button{
      width:80px;
    }

    .input-items__container{
      display: flex;
    align-items: center;
    gap: 20px;
    }
    .location-input{
      width:400px;
    }

    .location-text{
      font-weight:500;
      text-align:left;
    }
    
    .founded-button{
      display:none;
    }
    .founded-button.active{
      display:inline;
    }
    .unpublish-pet__link{
      display:none;
    }
    .unpublish-pet__link.active{
      display:inline;
      text-decoration: underline;
      cursor:pointer;
    }
    `;
      this.appendChild(style);
      this.addListeners();
    }
  }
);
