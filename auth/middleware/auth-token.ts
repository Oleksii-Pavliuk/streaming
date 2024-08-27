import { Request, Response, NextFunction } from "express";
import { tokenManager } from "../classes/token-manager"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  try{
    let data = tokenManager.verifyMainToken(token);
    req.body.tokenData = data;
    next();
  }catch(err){
    return res.sendStatus(403);
  }
}