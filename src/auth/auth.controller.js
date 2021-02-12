import { Router } from 'express';
import { asyncWrapper } from '../helpers/async-wrapper.js';
import { authService, logOut } from './auth.service.js';
import { composeUsers } from '../users/users.serialize.js';
import { authorize } from '../helpers/authorize.js'
import { validate } from '../helpers/validate.js';
import Joi from 'joi';

const router = Router();

const signUpSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

router.post(
    '/register',
    validate(signUpSchema),
    asyncWrapper(async (req, res) => {
        const newUser = await authService.signUp(req.body);
        res.status(201).send(composeUsers(newUser));
    })
);

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

router.post(
    '/login',
    validate(signInSchema),
    asyncWrapper(async (req, res) => {
        const {user , token} = await authService.signIn(req.body);

        res.cookie('token', token, { httpOnly: true, signed: true});
        return res.status(201).send({
            // token,
            user: composeUsers(user),
        });
    })
);

router.post( '/logout', authorize, logOut );

export const authRouter = router;
