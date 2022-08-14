import { Report, Pet, User} from "../db/models"
import { createPet,updatePet } from "./pets-controllers"
import {sgMail} from "../lib/sendgrid"
import { index } from "../lib/algolia"


export async function getReports(){
    return Report.findAll({})
}

export async function createReport(petId, data){
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

