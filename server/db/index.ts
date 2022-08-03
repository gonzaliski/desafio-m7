import { Sequelize} from "sequelize"
export const sequelize = new Sequelize({
    dialect: "postgres",
    username: "dpdojpwzgwopmc",
    password: "c714e61a9f8e3d9f5ffd4ee2b176642b08a631d79060ea16f92f1fb9b3c61871",
    database: "d3q7ilpsc7n0rc",
    port: 5432,
    host: "ec2-44-198-82-71.compute-1.amazonaws.com",
    ssl: true,
    // esto es necesario para que corra correctamente
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });