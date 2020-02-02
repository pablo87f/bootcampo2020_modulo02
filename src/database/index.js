import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/user.model';
import File from '../app/models/file.model';
import Appointment from '../app/models/appointment.model';

const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
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
}

export default new Database();
