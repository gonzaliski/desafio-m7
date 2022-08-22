import { Pet, User, Auth} from "../db/models"
import { cloudinary } from "../lib/cloudinary";
import { getSHA256ofString, updatePassword} from "./auth-controller"


export async function createUser(data){
    const {email, password,fullName} = data
    try{
        const newUser =  await User.create({
                email,
                full_name:fullName,
        })
        let userId = newUser.get("id")
    const newAuthCreated = await Auth.create({
            email,
            password:getSHA256ofString(password),
            user_id:userId
        })
        return userId
    }catch(error){
        throw error
    }
}

export async function findMail(email){
    try{
     return await User.findOne({
        where:{
            email
        }
        })
    }catch(error){
    throw error
    }
}

export async function getAllUsers(){
    try{ return await User.findAll({})}catch(error){
        throw error
    }
}


export async function updateUser(data,userId){
    const dataToUpdate = {
        full_name:data.fullName,
        password:data.password
    }
    if(dataToUpdate.full_name){
        try{
            await User.update({full_name:dataToUpdate.full_name},{
                where:{
                    id:userId
                }
            })
        }catch(error){
            throw error
        }
    }
    if(dataToUpdate.password){
        try{
            await updatePassword(dataToUpdate.password,userId)
        }catch(error){
            throw error
        }
    }
    return dataToUpdate
}


