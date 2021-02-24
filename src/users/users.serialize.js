import path from 'path';
import fs from 'fs';
import {getPaths} from '../helpers/utils.js';
import { userModel } from './user.model.js';

const {__dirname} = getPaths(import.meta.url);

export function composeUsers(users){
    if(users instanceof Array){
        return users.map(composeUser);
    }

    return composeUser(users);
}

function composeUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarURL: user.avatarURL,
    }
}

export async function  updateAvatar(req, res, next) {
    try{
        const {
            file: {filename},
            user: {_id, avatarURL},
        } = req;
        const oldAvatar = path.parse(avatarURL).base;

        await fs.unlink(path.join(__dirname, `../../public/images/${oldAvatar}`));

        const newAvatar = `http://localhost:${process.env.PORT}/images/${filename}`;
        const updateUser = await userModel.findByIdAndUpdate(
            _id,
            {$set: {avatarURL: newAvatar}},
            {new: true}
        );

        return res.status(200).json({avatarURL: updateUser.avatarURL});
    }catch(error){
        next(error)
    }
}