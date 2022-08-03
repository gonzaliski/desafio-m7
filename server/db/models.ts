import { User } from "./users";
import { Auth } from "./auth";
import { Pet } from "./pets";
import { Report } from "./reports";

// ejemplo de módulo que importa a todos los modelos
// y los vincula
User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pet);
Pet.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);


export { User, Auth, Pet, Report };
