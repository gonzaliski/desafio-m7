import { Model, DataTypes } from 'sequelize';
import {sequelize} from './index'

export class Report extends Model {}

Report.init({
  // los atributos de nuestro modelo (las columnas)
  pet_name: DataTypes.STRING,
  image_URL:DataTypes.STRING,
  lat:DataTypes.FLOAT,
  lng:DataTypes.FLOAT,
   
}, {
  sequelize, // la conexión a la base
  modelName: 'report' // tenemos que decirle el nombre del modelo (en singular)
});
