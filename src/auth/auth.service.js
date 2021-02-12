import { userModel } from '../users/user.model.js';
import { Conflict, NotFound, Forbidden } from '../helpers/error.constructors.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
    async signUp(userParams){

        const { username, email, password } = userParams;
        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            throw new Conflict(`Email in use ${email}`);
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const passwordHash = await bcryptjs.hash(password, saltRounds);
        const newUser = await userModel.create({
            username,
            email,
            passwordHash,
        });

        return newUser;
    }

    async signIn(credentials){
        const { email, password } = credentials;
        const user = await userModel.findOne({ email });

        if(!user){
            throw new NotFound(`User with email ${email} was not found`);
        }

        const isRightPassword = await bcryptjs.compare(password, user.passwordHash);

        if(!isRightPassword){
            throw new Forbidden(`Provided password is wrong`);
        }

        const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
        const token = jwt.sign({uid: user._id}, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return { user, token};

    }
    
}

export const authService = new AuthService();

export async function logOut(req, res, next){    
    try{
        await userModel.findByIdAndUpdate(
            req.userId,
            res.clearCookie('token', {path: "/"}),
             { new: true }
     
         );
         return res.status(204).json()
     }catch(error){
         return res.status(401).json({ message: 'Not authorized' });
     }
 }