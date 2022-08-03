import { Model, DataTypes } from 'sequelize';
import {sequelize} from './index'

export class Pet extends Model {}

Pet.init({
  // los atributos de nuestro modelo (las columnas)
  name: DataTypes.STRING,
  lat:DataTypes.FLOAT,
  lng:DataTypes.FLOAT,
  found:DataTypes.BOOLEAN,
  image_URL:DataTypes.STRING
   
}, {
  sequelize, // la conexión a la base
  modelName: 'pet' // tenemos que decirle el nombre del modelo (en singular)
});
