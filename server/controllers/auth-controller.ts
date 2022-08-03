import {Auth} from "../db/models"
import * as crypto from "crypto"
import * as jwt from "jsonwebtoken"
const SECRET = process.env.SECRET
export function getSHA256ofString(text){
    return crypto.createHash('sha256').update(text).digest('hex')
}
export async function getToken(data){
    const {email, password} = data
    const hashedPassword = getSHA256ofString(password)
    const auth =  await Auth.findOne({
        where:{
            email,
            password:hashedPassword
        }
    })
    const token = jwt.sign({id:auth.get("user_id")},SECRET)
   return token
}

export async function updatePassword(newPass,userId){
    return await Auth.update({password:newPass},{
        where:{
            user_id:userId
        }
    })
}

