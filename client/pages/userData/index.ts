customElements.define("user-data", class UserData extends HTMLElement{
    constructor() {
      super();
    }
    connectedCallback(){
      this.render()
    }
  
    render(){
      
      this.innerHTML=`
        <header-el></header-el>
        <div class="content__container">
        <div class="title__container">
        <h2>Mis Datos</h2>
        </div>
         <form id="data__form" class="form__container">
                <ul class="form-inputs">
                        <label class="form-label">Nombre</label>
                    <li>
                        <input class="form-input" name="name" type="text"></input>
                        </li>

                        <li>
                        <label class="form-label">Contraseña</label>
                        <li>
                            <input class="form-input" name="password" type="text"></input>
                        </li>
                        <label class="form-label">Repetir contraseña</label>
                        <li>
                         <input class="form-input" name="repeat-password" type="text"></input>
                        </li>
                        </li>
               </ul>
          </form>
        </div>
            `
            const style = document.createElement("style")
      style.innerHTML = `
        .content__container{
            font-family: 'Poppins';
        height:100%;
        width:70vw;
        display: flex;
        justify-content: center;
        flex-direction:column;
        align-items: center;
        margin: 30% auto;
        }
        .form__container{
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            align-items:center;
        }
        .form-inputs{
            width:100%;
            padding:0;
        }
        li{
            list-style:none;
        }

        .form-label{
            font-size:16px;
            font-weight:500;
        }
        .form-input{
            width:100%;
            border: 2px solid #000000;
            border-radius: 4px;
        }
        .title__container{
            width:100%;
            display: inline-block;
            text-align:left;
        }
      `
      this.appendChild(style)
       
    }
  })