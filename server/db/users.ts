import { Model, DataTypes } from 'sequelize';
import {sequelize} from './index'

export class User extends Model {}

User.init({
  // los atributos de nuestro modelo (las columnas)
  full_name: DataTypes.STRING,
  email:DataTypes.STRING   
}, {
  sequelize, // la conexión a la base
  modelName: 'user' // tenemos que decirle el nombre del modelo (en singular)
});
