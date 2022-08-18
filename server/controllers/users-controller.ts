import { Pet, User, Auth} from "../db/models"
import { cloudinary } from "../lib/cloudinary";
import { getSHA256ofString, updatePassword} from "./auth-controller"


export async function createUser(data){
    const {email, password,fullName} = data
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
}

export async function findMail(email){
    return User.findOne({
        where:{
            email
        }
    })
}

export function getAllUsers(){
    return User.findAll({})
}


export async function updateUser(data,userId){
    const dataToUpdate = {
        full_name:data.fullName,
        password:data.password
    }
    console.log("eee");
    if(dataToUpdate.full_name){
        await User.update({full_name:dataToUpdate.full_name},{
            where:{
                id:userId
            }
        })
        }
    if(dataToUpdate.password){
        console.log("aaa");
        
        await updatePassword(dataToUpdate.password,userId)
    }
    return dataToUpdate
}

export async function deleteUser(id){
    return User.destroy({
        where:{
            id
        }
    })
}


