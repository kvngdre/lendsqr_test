const debug = require('debug')('app:userCtrl');
const User = require('../models/user.models');
const logger = require('../utils/logger')('userCtrl.js');

class UserController {
    async createUser(userDTO) {
        try {
            const newUser = await User.query().insert(
                this.#mapToDataModel(userDTO)
            );
            return {
                success: true,
                message: 'User created',
                data: newUser,
            };
        } catch (exception) {
            debug(exception);
            logger.error({
                method: 'create_user',
                message: exception.message,
                meta: exception.stack,
            });
            return exception;
        }
    }

    #mapToDataModel(data) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        };
    }
}

module.exports = new UserController();
