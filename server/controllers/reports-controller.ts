import { Report, Pet, User } from "../db/models";
import { transporter } from "../lib/nodemailer";

export async function getReports() {
  return Report.findAll({});
}

export async function createReport(petId, data) {
  try {
    const pet = await Pet.findByPk(petId);
    let userIdFromPet = pet.get("userId") as any;
    let userFromPet = await User.findByPk(userIdFromPet);
    await Report.create({
      pet_name: pet.get("name"),
      phone_number: data.phoneNumber,
      information: data.lastSeenLocation,
      petId,
    });
    try {
      await transporter.sendMail({
        from: `Pet finder App <${process.env.GMAIL_USER}>`, // sender address
        to: userFromPet.get("email"), // list of receivers
        subject: `Se ha reportado informacion de ${data.petName}!`, // Subject line
        text: ` 
        De: ${data.reporterName}
        Telefono: ${data.phoneNumber}
        Lugar: ${data.lastSeenLocation}`, // plain text body
      });
    } catch (e) {
      throw e;
    }
  } catch (e) {
    throw e;
  }
}
