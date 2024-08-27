import express from 'express';
const router = express.Router();



import {refreshToken} from "./refresh-token";
router.post('/refresh-token', refreshToken);


export default router;