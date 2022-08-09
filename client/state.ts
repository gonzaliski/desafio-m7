const API_BASE_URL = "http://localhost:3004"


export const state = {
    data:{
    },
    listeners:[],
    subscribe(callback: (any) => any) {
        // recibe callbacks para ser avisados posteriormente
        this.listeners.push(callback);
     },
     getState() {
        return this.data;
      },

      setState(newState) {
        // modifica this.data (el state) e invoca los callbacks
        console.log(newState);
        
        this.data = newState;
          for (const cb of this.listeners) {
            cb();
          }
          
      },
      async getUser(email:string){
         const emailExist = await fetch(API_BASE_URL + "/email" +  "?email=" + email,{
           method: "get",
           headers: { "Content-Type": "application/json" },
          });
          return await emailExist.json()
      },
     async processEmail(email:string){
          const cs = this.getState()
          cs.email=email;
          const userRes = await this.getUser(email)
          console.log(userRes);
          
          if(userRes){
            cs.userId = userRes.id;
            cs.fullName = userRes.full_name;
          }
          this.setState(cs)        
        return userRes
      },

      async signIn(password:string){
        const cs = this.getState()
        const passwordVerif = await fetch(API_BASE_URL + "/auth/token",{
          method:"post",
          headers:{ "Content-Type": "application/json" },
          body:JSON.stringify({
            email: cs.email,
            password
          })
        })
        const verifRes = await passwordVerif.json()
        return verifRes        
      },

      async updateOrCreateUser(userData){
        const cs = this.getState()
        const userExist = await this.getUser(cs.email)
        if(userExist){
          this.updateUser(userData)
        }else{
          this.signUp(userData)
        }
      },
      
      async updateUser(userData){
        const cs = this.getState()
        
        const updateUser = await fetch(API_BASE_URL + "/update-user" + "?userId=" + cs.userId,{
          method:"put",
          headers:{
            "Content-Type": "application/json",
            Authorization: `bearer ${cs.token}`,
          },
          body:JSON.stringify(userData)
        })
        const newData = await updateUser.json()
        console.log(newData);
        

      }
}