customElements.define("input-el", class InputElement extends HTMLElement{
    shadow: ShadowRoot
    constructor(){
        super()
    }
    connectedCallback(){
        this.shadow = this.attachShadow({ mode: "open" });
        this.render()
    }
    render(){
        this.shadow.innerHTML=`
        <input class="border-input"></input>
        `
        const style = document.createElement("style");
        style.innerHTML=`
        .border-input{
            box-sizing:border-box;
            width:100%;
            border: 2px solid #000000;
            border-radius: 4px;
            height:30px;
        }   
        `
        this.shadow.appendChild(style)
    }

})