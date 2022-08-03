import * as express from "express"
import 'dotenv/config'
import { authUser,findMail, getAllUsers, updateUser} from "./controllers/users-controller"
import { createReport, getReports, updateReport, sendPetInfo, lostPetsNear, deleteReport} from "./controllers/reports-controller"
import { getAllPets } from "./controllers/pets-controllers"
import {getToken} from "./controllers/auth-controller"
import { authorizeMiddleware, bodyCheckMiddleware } from "./db/middlewares"

const SECRET = process.env.SECRET
var app = express()
app.use(express.json({
    limit:"100mb"
  }));
const port = process.env.PORT || 3004

app.post("/auth", async(req,res)=>{
    if(!req.body){
        res.status(400).json({
            message:"There is missing data in the body"
        })
    }
    const user = await authUser(req.body)

    res.json(user)
})


app.get("/email", bodyCheckMiddleware,async(req,res)=>{
    const mailExists = await findMail(req.body)
    res.json(mailExists)
})

app.post("/auth/token",bodyCheckMiddleware, async(req,res)=>{
    const token = await getToken(req.body)
    if(token){
        res.status(400).json({error:"email o password incorrecto"})
    }else{
        res.json(token)
    }
})

app.get("/all-users",async(req,res)=>{
    const allUsers = await getAllUsers()
    res.json(allUsers)
})

app.put("/update-user",bodyCheckMiddleware,async(req,res)=>{
    const {userId} = req.query
    const update = await updateUser(userId, req.body)
    res.json(update)
})


app.get("/me",authorizeMiddleware, async(req,res)=>{
    res.json({token:"valido"})
})

app.post("/report",bodyCheckMiddleware,async(req,res)=>{
    const {userId} = req.query
    const newReport = await createReport(req.body,userId)
    res.json(newReport)
})
app.put("/report",bodyCheckMiddleware,async(req,res)=>{
    const {reportId} = req.query
    const updatedReport = await updateReport(reportId,req.body)
    res.json(updatedReport)
})

app.delete("/report",async(req,res)=>{
    const {reportId} = req.query
    const deletedReport = await deleteReport(reportId)
    res.json(deletedReport)
})

app.get("/all-reports",async(req,res)=>{
    const reports = await getReports()
    res.json(reports)
})
app.get("/all-pets",async(req,res)=>{
    const allPets = await getAllPets()
    res.json(allPets)
})

app.post("/report-pet-info", bodyCheckMiddleware,async(req,res)=>{
    const {petId} = req.query
    const sendedInfo = await sendPetInfo(petId, req.body) 
    res.json(sendedInfo)
})

app.get("/pet-near-user", async(req, res) => {
    const {lat,lng} = req.query
    const hits = await lostPetsNear(lat,lng)
    res.json(hits);
    
  });
  

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });

