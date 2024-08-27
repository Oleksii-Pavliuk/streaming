import {readFileSync} from "fs"
import * as jwt from "jsonwebtoken"
import { createLogger } from "../utils/logger";

interface JwtPayload {
  userId: string
}

class TokenManager {

  private mainKey: string
  private refreshKey: string
  private log: (level: string, message: string, data: any) => void;

  constructor() {
    let logger = createLogger('TokenManager');
    this.log = logger.log;

    try{
      this.mainKey = readFileSync(".config/main/private.key").toString();
      this.refreshKey = readFileSync(".config/refresh/private.key").toString();
    }catch(err){
      throw new Error(`Eror reading private key\n ${err}`);
    }
  }

  public signMainToken(payload: JwtPayload) {
    return jwt.sign(payload,this.mainKey,{expiresIn: "1h" });
  }

  public signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload,this.mainKey,{expiresIn: "14d" });
  }


  public verifyMainToken(token: string){
    return this.verifyToken(token,this.mainKey);
  }

  public verifyRefreshToken(token: string){
    return this.verifyToken(token,this.refreshKey);
  }


  private verifyToken(token: string, key: string) : JwtPayload | false {
    try{
      const decoded = jwt.verify(token, key) as JwtPayload;
      return decoded;
    }catch(err){
      this.handleTokenError(err,token);
      return false;
    }
  }


  private handleTokenError(err: any, token: string) {
    if (err.name === 'TokenExpiredError') {
      this.log('error', "verifyToken", { token, error: 'Token is expired' });
    } else {
      this.log('error', "verifyToken", { token, error: 'Token is invalid' });
    }
  }

}

export const tokenManager = new TokenManager();