import { Router } from 'express';
import { composeUsers } from './users.serialize.js';
import { usersService } from './users.service.js';
import { authorize } from '../helpers/authorize.js'
import { asyncWrapper } from '../helpers/async-wrapper.js';
const router = Router();

router.get(
    "/current",
    authorize,
    asyncWrapper(async (req, res) => {
        const user = await usersService.getUser(req.userId);
        res.send(composeUsers(user));
    })
)

export const userRouter = router;