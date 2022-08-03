import { Model, DataTypes } from 'sequelize';
import {sequelize} from './index'

export class Auth extends Model {}

Auth.init({
  // los atributos de nuestro modelo (las columnas)
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
   
}, {
  sequelize, // la conexión a la base
  modelName: 'Auth' // tenemos que decirle el nombre del modelo (en singular)
});
