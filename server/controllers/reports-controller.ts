import { Report, Pet, User} from "../db/models"
import { createPet,updatePet } from "./pets-controllers"
import {sgMail} from "../lib/sendgrid"
import { index } from "../lib/algolia"
export async function createReport(data,userId) {
    const newPet = await createPet(data,userId) //TODO mover al front en el mismo contexto que crear el reporte
     let algoliaRes =  saveLocationOnAlgolia(data)
    const report = await Report.create({...data,
    petId:newPet.get("id")})
    return report
}

 function saveLocationOnAlgolia(data){
   return index.saveObject({
        objectID:data.petId,
        name:data.pet_name,
        _geoloc:{
            lat:data.lat,
            lng:data.lng
        }
    }).then(()=>{})
}

function dataToIndex(data, id?) {
    const res: any = {};
    if (data.pet_name) {
      res.name = data.pet_name;
    }

    if (data.lat && data.lng) {
      res._geoloc = { lat: data.lat, lng: data.lng };
    }
    if (id) {
      res.objectID = id;
    }
    return res;
  }

export async function updateLocationOnAlgolia(data,petId){
    const indexItem = dataToIndex(data, petId);
    try{
        const algoliaRes = await index.partialUpdateObject(indexItem);
      }catch(e){
        console.log(e);
      }
}

function processData(data){
    const res: any = {}
    if(data.pet_name){
        res.pet_name = data.pet_name
    }
    if(data.image_URL){
        res.image_URL = data.image_URL
    }
    if(data.lat){
        res.lat = data.lat
    }
    if(data.lng){
        res.lng = data.lng
    }
    return res
}

export async function updateReport(reportId,data){
    const dataToUpdate = processData(data)
    try{
        await updatePet(dataToUpdate,reportId)
        const reportRes = await Report.update(dataToUpdate,{
            where:{
                id:reportId
            }
        })
        return reportRes
    }catch(e){
        console.error(e)
        return e
    }
}

export async function getReports(){
    return Report.findAll({})
}

export async function sendPetInfo(petId, data){
        const pet = await Pet.findByPk(petId)
        let userIdFromPet = pet.get("userId") as any
        let userFromPet = await User.findByPk(userIdFromPet)
        console.log(userFromPet);
        const msg = {
        to: `${userFromPet.get("email")}`,
        from: 'petfinder.apx@gmail.com', // Use the email address or domain you verified above
        subject: 'Se ha reportado informacion de una mascota!',
        text: 'and easy to do anywhere, even with Node.js',
        };
        console.log(msg);
        
        sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}

export async function deleteReport(id){
    return Report.destroy({
        where:{
            id
        }
    })
}

export async function lostPetsNear(lat,lng) {
   const {hits} = await index.search("",{
        aroundLatLng:`${lat}, ${lng}`,
        aroundRadius:10000
      })
    const processedHits = processHits(hits)
    console.log(processedHits);
    return processedHits
}
function processHits(hits){
    const res = hits.map((h)=>{
        return {
          nombre:h.nombre,
          _geoloc:{
            lat:h._geoloc.lat,
            lng:h._geoloc.lng
          }
        }
      })
    
      return res
    }