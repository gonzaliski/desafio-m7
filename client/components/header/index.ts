import { Router } from "@vaadin/router"
import { state } from "../../state"

customElements.define("header-el", class HeaderElement extends HTMLElement{
    pawImageURL:string
    constructor(){
        super()
    }
    connectedCallback(){
        this.render()
    }
    addListeners() {
       const burger = this.querySelector(".burger-menu")
       const paw = this.querySelector(".paw-img")
       const navMenu = this.querySelector(".nav-menu")
       burger.addEventListener("click",()=>{
        burger.classList.toggle("active")
        navMenu.classList.toggle("active")
       })
       paw.addEventListener("click",()=>{
        Router.go("/home")
       })
       const navLink = this.querySelector(".nav-link")
       navLink.addEventListener("click",()=>{
        console.log(navLink.getAttribute("href"));
       })
    }
    render(){
        const cs = state.getState()
        this.pawImageURL = require("url:../../assets/paw.png");
     this.innerHTML=`
      <nav class="nav-bar">
      <img src=${this.pawImageURL} class="paw-img"></img>
      <ul class="nav-menu">
        <li class="nav-item">
            <a class="nav-link" href="/myData" >Mis datos</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/myReportedPets" >Mis mascotas reportadas</a>
        
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/reportPet" >Reportar mascota</a>
        
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/nearPets" >Mascotas cerca</a>
        
        </li>
        <div class="user-info__container">
        <p class="user-name__display">${cs.email || "Usuario"}</p>
        <a class="log-out">Cerrar sesión</a>
        </div>
      </ul>

      <burger-menu></burger-menu>
      </nav>
    `
    const style = document.createElement("style")
    style.innerHTML= `
        .nav-bar{
            background-color: var(--main-color);
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:20px 14px 20px 14px;
        }   
        .line{
            background-color:black;
            height:5px;
            width:52px;
        }
        li{
            list-style:none;
        }

        .nav-menu{
            display:flex;
            position:fixed;
            height:auto;
            left:-100%;
            top:70px;
            gap:0;
            flex-direction:column;
            background-color:#d95b5b;
            width:100%;
            gap:30px;
            align-items:center;
            justify-content:center;
            transition:0.3s;
            box-shadow:0px 20px 25px -10px rgba(0,0,0,0.5);
        }
        @media(min-width:768px){
            .nav-menu{
                flex-direction:row;
                position:static;
                width:auto;
                height:100%;
                background-color:transparent;
                gap:30px;
                box-shadow:none;
            }
            burger-menu{
                display:none;
            }
        }
        .nav-menu.active{
            padding-top: 5%;
            left:0;
        }
        .nav-link{
            text-decoration:none;
            font-family:'Poppins';
            text-decoration: none;
            color:inherit;
            font-weight:500;
            transition:0.7s ease;
        }
        .nav-link:hover{
            color:white;
        }

        .user-info__container{
            display:flex;
            flex-direction:column;
            align-items:center;
            margin-top:10px;
            padding-bottom:10px;
        }
        .user-name__display{
            font-family:'Poppins';
           
        }
        @media(min-width:768px){
            .user-name__display{
                display:none;
            }
        }
        .log-out{
            font-family:'Poppins';
            color:blue;
        }
        @media(min-width:768px){
            .log-out{
                display:none;
            }
        }

    `

        this.appendChild(style)
        this.addListeners()
    }
   
})

