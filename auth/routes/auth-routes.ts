import Router from "express-promise-router";
import { UserManager } from "../classes/user-manager";
const router = Router();

const userManager = new UserManager();

// router.post('/login', userManager.registerUser);
router.post('/register', userManager.registerUser);

export default router;