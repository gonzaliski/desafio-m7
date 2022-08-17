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
       const logOutEl = this.querySelector(".log-out")
       const nearPets = this.querySelector(".nav-link.near-pets")
       const userButton = this.querySelector(".nav-link.user")
       const userMenu = this.querySelector(".user-info__container.menu")
       burger.addEventListener("click",()=>{
        burger.classList.toggle("active")
        navMenu.classList.toggle("active")
       })
       paw.addEventListener("click",()=>{
        Router.go("/home")
       })
       nearPets.addEventListener("click",()=>{
    
        if(!(location.pathname == "/home")){
            Router.go("/home")
        }
       })
       userButton.addEventListener("click",()=>{
        console.log("a");
        
        userMenu.classList.toggle("active")
       })
        logOutEl.addEventListener("click",()=>{
            state.logOut()
            location.reload()
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
            <a class="nav-link near-pets" >Mascotas cerca</a>
        
        </li>
        <li class="nav-item">
            <a class="nav-link user" ><i class="fa-solid fa-user"></i></a>
        
        </li>
        <div class="user-info__container menu">
        <p class="user-name__display">${cs.email || "Usuario"}</p>
        <a id="log-out" class="log-out">Cerrar sesión</a>
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

        .nav-menu {
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
            .user-info__container.menu{
                display: flex;
                position: fixed;
                height: 15%;
                right: -100%;
                top: 70px;
                gap: 0;
                flex-direction: column;
                background-color: #d95b5b;
                width: 30%;
                gap: 30px;
                transition: 0.3s;
                justify-content: center;
                box-shadow: 0px 20px 25px -10px rgb(0 0 0 / 50%);
                z-index: 9;
                align-items: center;
            }
            burger-menu{
                display:none;
            }
        }
        .nav-menu.active{
            position: absolute;
            top: 70px;
            padding-top: 5%;
            left:0;
            z-index: 9;
        }
        .nav-link{
            text-decoration:none;
            font-family:'Poppins';
            text-decoration: none;
            color:inherit;
            font-weight:500;
            transition:0.7s ease;
            cursor:pointer;
        }
        .nav-link:hover{
            color:white;
        }

        .nav-link.user{
            display:none;
        }
        @media(min-width:768px){
            .nav-link.user{
                display:inline;
            }

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
      
        .log-out{
            font-family:'Poppins';
            color:blue;
            text-decoration:underline blue;
            cursor:pointer;
        }
      
      
        .user-info__container.menu.active{
            position: absolute;
            top: 64px;
            right:0;
            z-index: 9;
        }
        @media(max-width:768px){
            .user-info__container.menu.active {
                
            }
        }
       
        

    `

        this.appendChild(style)
        this.addListeners()
    }
   
})

