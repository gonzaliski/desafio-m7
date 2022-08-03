import { Pet, User, Auth} from "../db/models"
import { cloudinary } from "../lib/cloudinary";
import { getSHA256ofString, updatePassword} from "./auth-controller"


export async function authUser(data){
    const {email, password,full_name} = data
    const [ user, created] =  await User.findOrCreate({
        where:{email},
        defaults:{
            email,
            full_name,
        }
    })
    const [ auth, authCreated] = await Auth.findOrCreate({
        where:{user_id:user.get("id")},
        defaults:{
            email,
            password:getSHA256ofString(password),
            user_id:user.get("id")
        }})
        return user
}

export async function findMail(data){
    return User.findOne({
        where:{
            email:data.email
        }
    })
}

export function getAllUsers(){
    return User.findAll({})
}

export async function updateUser(userId,data){
    const dataToUpdate = {
        full_name:data.full_name,
        password:data.password
    }
    await User.update(dataToUpdate.full_name,{
        where:{
            id:userId
        }
    })
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