import { Conflict, NotFound, Forbidden } from '../helpers/error.constructors.js';
import { userModel } from '../users/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAvatar } from '../helpers/avatar-generator.js';
import {default as fsWithCallbacks} from 'fs';
import { v4 as uuid4} from 'uuid';
const fs = fsWithCallbacks.promises;

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
        const { email, username, password, subscription } = req.body;
        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            return res.status(409).json({ message: "Email in use" });
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const passwordHash = await bcryptjs.hash(password, saltRounds);
        const verificationToken = uuid4();
       

        await fs.unlink(src);
        const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`;
        await emailMsg(email, verificationLink);
        const newUser = await userModel.create({
            email,
            username,
            password: passwordHash,
            avatarURL: await createAvatar(next),
            verificationToken,
        });
        return res.status(201).json({
            user:{
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
            }
        }).send({user: {email, subscription}});
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

 export async function verifyUser(req, res, next) {
     try{
         const {verificationToken} = req.params;
         const user = await userModel.findOne({verificationToken});

         if(!user){
             return res.status(404).json({message: 'User not found'});
         }
         await userModel.findOneAndUpdate(
             {_id: user._id},
             {verificationToken: ""},
             )
        return res.status(200).send();
     }catch(error){
         next(error)
     }
 }