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
       const navMenu = this.querySelector(".nav-menu")
       burger.addEventListener("click",()=>{
        burger.classList.toggle("active")
        navMenu.classList.toggle("active")
       })
    }
    render(){
        this.pawImageURL = require("url:../../assets/paw.png");
     this.innerHTML=`
      <nav class="nav-bar">
      <img src=${this.pawImageURL}></img>
      <ul class="nav-menu">
        <li class="nav-item">
            <a href="#" class="nav-link">Mis datos</a>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link">Mis mascotas reportadas</a>
        
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link">Reportar mascota</a>
        
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
    `

        this.appendChild(style)
        this.addListeners()
    }
   
})

