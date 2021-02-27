import { Router } from 'express';
import { composeUsers, updateAvatar } from './users.serialize.js';
import { usersService } from './users.service.js';
import { authorize } from '../helpers/authorize.js'
import { asyncWrapper } from '../helpers/async-wrapper.js';
import { validate } from '../helpers/validate.js';
import { avatarUpdate } from '../helpers/fileStore.js'
import Joi from 'joi';

const router = Router();

router.get(
    "/current",
    authorize,
    asyncWrapper(async (req, res) => {
        const user = await usersService.getUser(req.userId);
        res.send(composeUsers(user));
    })
)

const updateAvatarSchema = Joi.object({
    avatar: Joi.string().required(),
})

router.patch("/avatars", 
    authorize, 
    validate(updateAvatarSchema),
    avatarUpdate().single("avatar"),
    updateAvatar
    
)

export const userRouter = router;