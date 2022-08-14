import { cloudinary } from "../lib/cloudinary"
import { Report, Pet, User} from "../db/models"
import { index } from "../lib/algolia"


 async function saveLocationOnAlgolia(data,petId){
   try{ 
    const algoliaRes = await index.saveObject({
        objectID:petId,
        name:data.name,
        imageURL:data.image_URL,
        _geoloc:{
            lat:data.lat,
            lng:data.lng
        }
    }).then(()=>{})
    }catch(e){
      console.log(e);
      
    }
}

function dataToIndex(data, id?) {
    const res: any = {};
    if (data.petName) {
      res.name = data.petName;
    }
    if(data.imageURL){
      res.imageURL = data.imageURL
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
    
    if(data.imageURL){
        const imageRes = await cloudinaryProcess(data.imageURL)

         data.imageURL =  imageRes.secure_url    
        }
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
          userId
        }

    const createdPet = await Pet.create({
       ...petData
    })
    let algoliaRes =  await saveLocationOnAlgolia(petData,createdPet.get("id"))

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
    if(data.image_URL){
        res.image_URL = data.imageURL
    }

    return res;
  }

export async function updatePet(data,id){
  if(data.image_URL){
    const imageRes = await cloudinaryProcess(data.image_URL)
    data.image_URL = imageRes.secure_url 
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
           id:h.objectID,
           name:h.name,
           imageURL:h.imageURL,
           _geoloc:{
             lat:h._geoloc.lat,
             lng:h._geoloc.lng
           }
         }
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