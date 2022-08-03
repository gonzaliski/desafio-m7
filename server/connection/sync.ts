import { sequelize } from "../db/index";
import "../db/models"

sequelize.sync({ alter: true }).then((res) => console.log(res));