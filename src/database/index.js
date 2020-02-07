import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database.config';
import User from '../app/models/user.model';
import File from '../app/models/file.model';
import Appointment from '../app/models/appointment.model';

const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

export default new Database();
