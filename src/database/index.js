import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment]; // all models mapped here

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection)); // map all models and set the connection
    models.map(
      model => model.associate && model.associate(this.connection.models) // map all relationships
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://192.168.99.100:27017/mongobarber',
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
