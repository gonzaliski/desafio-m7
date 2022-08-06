customElements.define(
  "burger-menu",
  class BurgerMenu extends HTMLElement {

    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }


    render() {
      this.innerHTML = `
        <div class="burger-menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
      </div>
        `;
      const style = document.createElement("style");
      style.innerHTML = `
            
        .burger-menu{
            cursor:pointer;
        }
        @media(min-width:768){
          .burger-menu{
            display:none;
          }
        }

        .bar{
            display:block;
            background-color:black;
            height:5px;
            width:40px;
            margin:5px auto;
            -webkit-transition: all 0.3s ease-in-out;
            transition: all 0.3s ease-in-out;
        }
        .burger-menu.active .bar:nth-child(2){
          opacity:0;
        }
        .burger-menu.active .bar:nth-child(1){
          transform: translateY(10px) rotate(45deg);
        }
        .burger-menu.active .bar:nth-child(3){
          transform: translateY(-10px) rotate(-45deg);
        }

        `;
      this.appendChild(style);
    }
  }
);

