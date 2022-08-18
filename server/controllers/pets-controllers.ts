import { cloudinary } from "../lib/cloudinary"
import { Report, Pet, User} from "../db/models"
import { index } from "../lib/algolia"


 async function saveLocationOnAlgolia(data){
   try{ 
    const algoliaRes = await index.saveObject({
        objectID:data.petId,
        _geoloc:{
            lat:data.lat,
            lng:data.lng
        }
    }).then(()=>{})
    }catch(e){
      console.log(e);
      
    }
}

async function deletePetOnAlgolia(petId){
  index.deleteObject(petId).then(()=>{
    console.log("deleted on algolia");
    
  })
}

function dataToIndex(data, id?) {
    const res: any = {};
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

async function cloudinaryProcess(image){
   return await cloudinary.uploader.upload(image,
        {
            resource_type:"image",
            discard_original_filename:true,
            witdh:1000,
        })
}

export async function createPet(data,userId){
    var petImageURL
    
    if(data.imageURL){
        const imageRes = await cloudinaryProcess(data.imageURL)

         petImageURL =  imageRes.secure_url    
        }
        const petData ={
          name:data.petName,
          lat:data.lat,
          lng:data.lng,
          found:false,
          image_URL:petImageURL,
          zone:data.locationName,
          userId
        }

    const createdPet = await Pet.create({
       ...petData
    })
    let algoliaRes =  await saveLocationOnAlgolia(
      {
      lat:petData.lat,
      lng:petData.lng,
      petId:createdPet.get("id")
    })

    return createdPet
}
function procesData(data) {
    const res: any = {};
    if (data.petName) {
      res.name = data.petName;
    }

    if (data.lat && data.lng) {
      res.lat = data.lat
      res.lng = data.lng
    }
    if(data.imageURL){
        res.image_URL = data.imageURL
    }

    return res;
  }

export async function updatePet(data,id){
  if(data.imageURL){
    const imageRes = await cloudinaryProcess(data.imageURL)
    data.imageURL = imageRes.secure_url 
  }
  if(data.lat && data.lng){
    await updateLocationOnAlgolia(data,id)
  }
    const dataToUpdate = procesData(data)
    console.log(dataToUpdate);
    
    const updatePet = await Pet.update(dataToUpdate,{
        where:{
            id
        }
    })
    return updatePet
}

export async function getAllPets(){
    return  Pet.findAll({})
}

export async function getAllPetsWithIds(ids:Array<Number | String>){
  return Pet.findAll({
    where:{id:ids}
  })
}


export async function lostPetsNear(lat,lng) {
    const {hits} = await index.search("",{
         aroundLatLng:`${lat}, ${lng}`,
         aroundRadius:100000
       })
     const processedHits = processHits(hits)
     console.log("LOS HITSSS", processedHits);
     
     const nearPetsRes = await getAllPetsWithIds(processedHits)
     return nearPetsRes
 }
 function processHits(hits){
     const res = hits.map((h)=>{
         return h.objectID
       })
     
       return res
     }
export async function reportFound(id){
  const petWasFound = await Pet.update({found:true},{
    where:{
        id
    }
})
  return petWasFound  
}
     export async function deletePet(id){
      await deletePetOnAlgolia(id)
      return Pet.destroy({
          where:{
              id
          }
      })
  }
  
  export async function userPets(req){
    return await Pet.findAll({
      where:{
          userId:req
      },
      include:[User]
  })
  }