import { userModel } from './user.model.js';

class UserService{

    async getUser(userId){
        return userModel.findById(userId);
    }

}

export const usersService = new UserService();