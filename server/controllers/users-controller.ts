import { Pet, User, Auth} from "../db/models"
import { cloudinary } from "../lib/cloudinary";
import { getSHA256ofString, updatePassword} from "./auth-controller"


export async function createUser(data){
    const {email, password,full_name} = data
    const newUser =  await User.create({
            email,
            full_name,
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

export async function updateOrCreateUser(data,userId?){
    console.log(data);
    
    const userExist = await findMail(data.email)
    if(userExist){
        updateUser(userId, data)
    }else{
        createUser(data)
    }
}

export async function updateUser(userId,data){
    const dataToUpdate = {
        full_name:data.fullName,
        password:data.password
    }
    if(dataToUpdate.full_name){
        await User.update({full_name:dataToUpdate.full_name},{
            where:{
                id:userId
            }
        })
        }
    if(dataToUpdate.password){
        await updatePassword(dataToUpdate.password,userId)
    }
    return dataToUpdate
}


// export async function updateUsers(userId, data){
//     if(data.imageURL){

//         const imageRes = await cloudinary.uploader.upload(data.imageURL,
//             {
//                 resource_type:"image",
//                 discard_original_filename:true,
//                 witdh:1000,
//             })
//   const dataToUpdate = {
//     name: data.name,
//     bio:data.bio,
//     imageURL:data.imageURL
// }
// await User.update(dataToUpdate,{
//     where:{
//         id:userId
//     }
// })
// return dataToUpdate
// }else{
//     console.error("no hay imagen")
// }
// }