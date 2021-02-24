import { Conflict, NotFound, Forbidden } from '../helpers/error.constructors.js';
import { userModel } from '../users/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAvatar } from '../helpers/avatar-generator.js';

class AuthService {
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

export async function signUp(req, res, next){    
    try{
        const { email, username, password } = req.body;
        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            return res.status(409).json({ message: "Email in use" });
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const passwordHash = await bcryptjs.hash(password, Number(saltRounds));

        const newUser = await userModel.create({
            email,
            username,
            password: passwordHash,
            avatarURL: await createAvatar(next),
        });

        return res.status(201).json({
            user:{
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
            }
        });
     }catch(error){
         next(error)
     }
 }
 export async function signIn(req, res, next) {
     try{
        const { email, password } = req.body;
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
        
                res.cookie('token', token, { httpOnly: true, signed: true});
        return res.status(201).send({
            // token,
            user: composeUsers(user),
        });
     }catch(error){
         return res.status(401).json({ message: "Not authorized" });
     }
 }
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