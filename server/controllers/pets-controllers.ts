import { Pet} from "../db/models"

export async function createPet(data,userId){
    const createPet = await Pet.create({
        name:data.pet_name,
        lat:data.lat,
        lng:data.lng,
        found:false,
        image_URL:data.image_URL,
        userId
    })
    return createPet
}

export async function updatePet(data,id){
    return Pet.update(data,{
        where:{
            id
        }
    })
}

export async function getAllPets(){
    return  Pet.findAll({})
}