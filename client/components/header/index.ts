import { Router } from "@vaadin/router"

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
        a{
            text-decoration:none;
        }
        .nav-menu{
            display:flex;
            position:fixed;
            height:30vh;
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
            }
            burger-menu{
                display:none;
            }
        }
        .nav-menu.active{
            left:0;
        }
        .nav-link{
            font-family:'Poppins';
            text-decoration: none;
            color:inherit;
            font-weight:500;
            transition:0.7s ease;
        }
        .nav-link:hover{
            color:white;
        }
    `

        this.appendChild(style)
        this.addListeners()
    }
   
})

