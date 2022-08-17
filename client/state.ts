import {map} from "lodash"

const API_BASE_URL = "http://localhost:3004"


export const state = {
    data:{
      userPets:[]
    },
    listeners:[],
    subscribe(callback: (any) => any) {
        // recibe callbacks para ser avisados posteriormente
        this.listeners.push(callback);
     },
     getState() {
        return this.data;
      },
      init(){
        const retrievedData = JSON.parse(localStorage.getItem("data"))
        if(!retrievedData){
          return
        }
        else{
          this.setState(retrievedData)

        }
      },
      setState(newState) {
        // modifica this.data (el state) e invoca los callbacks
        console.log(newState);
        localStorage.setItem("data",JSON.stringify(newState))
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
      async signUp(data){
        console.log({...data});
        const cs = this.getState()
        const createdUser = await fetch(API_BASE_URL + "/auth",{
          method:"post",
          headers:{ "Content-Type": "application/json" },
          body:JSON.stringify({
            ...data
          })
        })
        const newUser = await createdUser.json()
        this.signIn(data.password).then((token)=>{
         cs.fullName = data.fullName
         cs.token = token
         this.setState(cs)
       })
        return newUser       
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
        var res
        if(userExist){
         res = await this.updateUser(userData)
        }else{
          res = await this.signUp(userData)
        }
        return res
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
        

      },
      async reportPet(data){
        const cs = this.getState()
        const createPet = await fetch(API_BASE_URL + "/new-pet" + "?userId=" + cs.userId,{
          method:"post",
          headers:{
            "Content-Type": "application/json",
            Authorization: `bearer ${cs.token}`,
          },
          body:JSON.stringify(data)
        })
        const newPet = await createPet.json()
        console.log(newPet);
        return newPet
      },
      async updatePet(data){
        const cs = this.getState()
        const updatePet = await fetch(API_BASE_URL + "/update-pet" + "?petId=" + cs.petToEdit.id,{
          method:"put",
          headers:{
            "Content-Type": "application/json",
            Authorization: `bearer ${cs.token}`,
          },
          body:JSON.stringify(data)
        })
        const updatePetRes = await updatePet.json()
        console.log(updatePetRes);
        return updatePetRes
      },
      currentMarkerPosition(lat, lng){
        const cs = this.getState()
        cs.petToReportLat = lat
        cs.petToReportLng = lng
        this.setState(cs)
      },

      async getMyPets(){
        const cs = this.getState()
        const myPets = await fetch(API_BASE_URL + "/me/pets" + "?userId=" + cs.userId,
        {
          method:"get",
          headers:{
          "Content-Type": "application/json",
          Authorization: `bearer ${cs.token}`,
        }})
        let petsToJson = await myPets.json()
        
        let petsToList = this.processPets(petsToJson)
        return petsToList
      },
      async reportFound(petId){
        const cs = this.getState()
        const reportPetFound = await fetch(API_BASE_URL + "/pet-found" + "?petId=" + petId,{
          method:"put",
          headers:{
            "Content-Type": "application/json",
            Authorization: `bearer ${cs.token}`,
          } })
        const updatePetRes = await reportPetFound.json()
        return updatePetRes
      },
      
      async deletePet(petId){
        const cs = this.getState()
        let index = cs.userPets.indexOf(cs.userPets.find((pet)=>{return pet.id == petId}))
        cs.userPets.splice(index,1)
        this.setState(cs)
        const deletePet = await fetch(API_BASE_URL + "/pet" + "?petId=" + petId,{
          method:"delete",
          headers:{
            "Content-Type": "application/json",
            Authorization: `bearer ${cs.token}`,
          } })
        const deletePetRes = await deletePet.json()
        return deletePetRes
      },
      async nearPets(){
        const cs = this.getState()
        const getNearPets = await fetch(API_BASE_URL + "/pets-near-me" + "?lat="+ cs.lat + "&lng=" + cs.lng,{
          method:"get",
          headers:{
          "Content-Type": "application/json"
                }})
        const petsToJson = await getNearPets.json()
        const petsToList = this.processPets(petsToJson)
        return petsToList
      },
      async reportInfo(info,id){
        const reportPetInfo = await fetch(API_BASE_URL + "/report" + "?petId=" + id,{
          method:"post",
          headers:{
          "Content-Type": "application/json"
            },
          body:JSON.stringify(info)})
        return reportPetInfo
      },

      processPets(dataToProcess){
        let petsToList = map(dataToProcess)
        let petsProcessed = petsToList.map(pet=>{return {
          id: pet.id,
          name: pet.name,
          imageURL:pet.image_URL,
          found:pet.found,
          lat:pet.lat,
          lng:pet.lng,
          locationName:pet.zone
        }})
        return petsProcessed
      },
      
      logOut(){
        this.setState({})
      }
}