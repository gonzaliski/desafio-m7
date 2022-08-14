import * as express from "express"
import 'dotenv/config'
import { createUser,findMail, getAllUsers, updateUser,deleteUser} from "./controllers/users-controller"
import { getReports, createReport, deleteReport} from "./controllers/reports-controller"
import { getAllPets,lostPetsNear,createPet, updatePet,deletePet,userPets, reportFound } from "./controllers/pets-controllers"
import {getToken} from "./controllers/auth-controller"
import * as cors from "cors";
import { authorizeMiddleware, bodyCheckMiddleware } from "./db/middlewares"

const SECRET = process.env.SECRET
var app = express()
app.use(express.json({
    limit:"100mb"
  }));
  app.use(cors());
const port = process.env.PORT || 3004
//sign up
app.post("/auth", async(req,res)=>{
    if(!req.body){
        res.status(400).json({
            message:"There is missing data in the body"
        })
    }
    const user = await createUser(req.body)

    res.json(user)
})


app.get("/email",async(req,res)=>{
    const userFromMail = await findMail(req.query.email)
    res.json(userFromMail)
})
//sign in
app.post("/auth/token",bodyCheckMiddleware, async(req,res)=>{
    const token = await getToken(req.body)
    res.json(token)
})

app.get("/all-users",async(req,res)=>{
    const allUsers = await getAllUsers()
    res.json(allUsers)
})

app.put("/update-user",bodyCheckMiddleware,authorizeMiddleware,async(req,res)=>{
    const {userId} = req.query
    console.log(req.body);
    
    const update = await updateUser(req.body, userId)
    res.json(update)
})

app.delete("/user",async(req,res)=>{
    const {userId} = req.query
    const deletedReport = await deleteUser(userId)
    res.json(deletedReport)
})

app.get("/me",authorizeMiddleware, async(req,res)=>{
    res.json({token:"valido"})
})

app.post("/new-pet",authorizeMiddleware,async(req,res)=>{
    const {userId} = req.query
    const newPet = await createPet(req.body,userId)
    res.json(newPet)
})
app.get("/me/pets",authorizeMiddleware,async(req,res)=>{
    const {userId} = req.query
    const data = await userPets(userId)
    res.json(data)
})
app.put("/update-pet",authorizeMiddleware,async(req,res)=>{
    const {petId} = req.query
    const data = await updatePet(req.body,petId)
    res.json(data)
})
app.put("/pet-found",authorizeMiddleware,async(req,res)=>{
    const {petId} = req.query
    const data = await reportFound(petId)
    res.json(data)
})
app.delete("/pet",authorizeMiddleware,async(req,res)=>{
    const {petId} = req.query
    const data = await deletePet(petId)
    res.json(data)
})

app.post("/report",authorizeMiddleware,async(req,res)=>{
    const {userId} = req.query
    const newReport = await createReport(req.body,userId)
    res.json(newReport)
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

app.get("/pets-near-me", async(req, res) => {
    const {lat,lng} = req.query
    const hits = await lostPetsNear(lat,lng)
    res.json(hits);
  });
  

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });

