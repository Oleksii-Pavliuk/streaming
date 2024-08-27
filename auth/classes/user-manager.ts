import { User } from "../models/user-model";
import { createLogger } from '../utils/logger';
import crypto from 'crypto';
import config from "../config/config"

const ENC_KEY = config.get("encKey");
const SEC_KEY = config.get("secKey");
class UserManager {

  secretKey = SEC_KEY;

  prefix = "s3c";
  encAlgorithm = "aes-256-cbc";
  encKey = ENC_KEY;

  regex = new RegExp(`^${this.prefix}_(?<iv>[a-fA-F0-9]+):(?<key>[a-fA-F0-9]+)_(?<checksum>[a-fA-F0-9]+)$`);

  states = {
    userRegistered: { message: "User registered", status: 200 },
    userFound: { message: "User found", status: 200 },
    userDeleted: { message: "User deleted", status: 200 },
    recoveryLinkSent: { message: "Recovery link sent", status: 200 },
    recoveryLinkValid: { message: "Recovery link valid", status: 200 },
    passwordChanged: { message: "Password changed", status: 200 },
    userUpdated: { message: "User updated", status: 200 },

    emailExists: { message: "Email already exists", status: 409 },
    invalidPassword: { message: "Invalid password", status: 409 },
    invalidRecoveryLink: { message: "Invalid recovery link", status: 409 },
    userNotFound: { message: "User not found", status: 409 },
    failedToRegister: { message: "Failed to register user", status: 400 },
    failedToDelete: { message: "Failed to delete user", status: 400 },
    failedToUpdate: { message: "Failed to update user", status: 400 },
    failedToChangePassword: { message: "Failed to change password", status: 409 },
    failedToGenerateRecoveryLink: { message: "Failed to generate recovery link", status: 409 }
  }

  constructor() {
    let logger = createLogger('UserManager');
    this.log = logger.log;
  }

  private log: (level: string, message: string, data: any) => void;


  public async registerUser(userInfo: typeof User.prototype) {

    this.log('info', 'registerUser', {userInfo});
    let success = false;
    let state = this.states.failedToRegister;
    const id = this.generateId();
    try {
      userInfo.id = id;
    }catch(e) {
      this.log('error', 'registerUser', {userInfo, error: e});
    }

    if((await this.checkUser(userInfo.email)).success == true){
      state = this.states.emailExists;
    }

    if (userInfo.password) {
      userInfo.passwordHash = this.hashPassword(userInfo.password);
      delete userInfo.password;
    }else{
      state = this.states.invalidPassword;
    }
    try{
      const user = new User(userInfo);
      await user.save()
      success = true;
    }catch(e) {
      this.log('error', 'registerUser', {userInfo, error: e});
    }

    this.log('info', 'registerUser', {userInfo,state});
    return {success, status : {state}, message: {state}, id};
  }

  public async checkUser(key: string, value: string | number) {
    this.log('info', 'checkUser', {[key]:value});
    let success = false;
    let state = this.states.userNotFound;
    try {
      const user = await User.findOne({[key]:value}).exec();
      if(user){
        success = true;
        state = this.states.userFound;
      }
    }catch(e) {
      this.log('error', 'checkUser', {[key]:value, error: e});
    }
    this.log('info', 'checkUser', {[key]:value,state});
    return {success, status : {state}, message: {state}};
  }

  public async deleteUser(id: string) {
    this.log('info', 'deleteUser', {id});
    let success = false;
    let state = this.states.failedToDelete
    try {
      const user = await User.findOne({id: id}).exec();
      if(!user){
        success = false;
        state = this.states.userNotFound;
      }else{
        if(user.id){
          await User.deleteOne({id: id}).exec();
          success = true;
          state = this.states.userDeleted;
        }
      }
    }catch(e) {
      this.log('error', 'deleteUser', {id, state});
    }
    this.log('info', 'deleteUser', {id, state});
    return {success, status : {state}, message: {state}};
  }

  public async generateRecoveryLink(id: string) {
    this.log('info', 'generateRecoveryLink', {id});
    let success = false;
    let state = this.states.failedToGenerateRecoveryLink
    try {
      const user = await User.findOne({id: id}).exec();
      if(!user){
        success = false;
        state = this.states.userNotFound;
      }else{
        const recoveryCode = this.createKey(id);
        user.updateOne({recoveryCode}).exec();
        success = true;
        state = this.states.recoveryLinkSent
      }
    }catch(e) {
      this.log('error', 'generateRecoveryLink', {id, state});
    }
    this.log('info', 'generateRecoveryLink', {id, state});
    return {success, status : {state}, message: {state}};
  }

  public async checkRecoveryLink(id: string, link: string) {
    this.log('info', 'checkRecoveryLink', {id, link},);
    let success = false;
    let state = this.states.invalidRecoveryLink;
    try {
      const user = await User.findOne({id: id}).exec();
      if(user){
        const recoveryCode = user.recoveryCode;
        if (recoveryCode && recoveryCode.length){
          const decryptedId = this.decryptKey(link);
          if (decryptedId == user.email){
            success = true;
            state = this.states.recoveryLinkValid;
          }
        }
      }else{
        success = false;
        state = this.states.userNotFound;
      }
    }catch(e) {
      this.log('error', 'checkRecoveryLink', {id, error: e});
    }
    this.log('info', 'checkRecoveryLink', {id,state});
    return {success, status : {state}, message: {state}};
  }

  public async updateUserInfo(id: string,userInfo: typeof User.prototype) {
    this.log('info', 'updateUserInfo', {id,userInfo});
    let success = false;
    let state = this.states.failedToUpdate;
    let user = await User.findOne({id: id}).exec();
    if(!user){
      return {success, status : {state}, message: {state}, id};
    }
    let keys = Object.keys(userInfo);
    keys.forEach(key => {
      if (user) {
        user[key] = userInfo[key];
      }
    });

    try{
      User.updateOne({id: id}, user).exec();
      success = true;
      state = this.states.userUpdated;
    }catch(e) {
      this.log('error', 'updateUserInfo', {userInfo, error: e});
    }

    this.log('info', 'updateUserInfo', {userInfo,state});
    return {success, status : {state}, message: {state}, id};
  }

  public async changePassword(id: string, oldPassword: string, newPassword: string) {
    this.log('info', 'changePassword', {id});
    let success = false;
    let state = this.states.failedToChangePassword;
    let user = await User.findOne({id: id}).exec();
    if(!user){
      state = this.states.userNotFound;
      return {success, status : {state}, message: {state}, id};
    }
    if(!this.checkPasswords(oldPassword, user.passwordHash)){
      state = this.states.invalidPassword;
      return {success, status : {state}, message: {state}, id};
    }
    user.passwordHash = this.hashPassword(newPassword);
    try{
      User.updateOne({id: id}, user).exec();
      success = true;
      state = this.states.passwordChanged;
    }catch(e) {
      this.log('error', 'changePassword', {id, error: e});
    }

    this.log('info', 'changePassword', {id,state});
    return {success, status : {state}, message: {state}, id};
  }

  private generateId() {
    const bytes = crypto.randomBytes(16);
    return bytes.toString('hex');
  }

  private hashPassword(password: string) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return hash;
  }
  private checkPasswords(password: string, hash: string) {
    return this.hashPassword(password) == hash;
  }


  private createKey(userId: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.encAlgorithm, Buffer.from(this.encKey), iv);
    let encrypted = cipher.update(userId);
    let buffer  = Buffer.concat([encrypted, cipher.final()]).toString('hex');
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
    const key = `${this.prefix}${new Date().valueOf()}_${iv.toString('hex')}:${buffer}_${checksum}`
    return key;
  }

  private decryptKey(code: string) {
    try{
      if (!this.regex.test(code)) throw 1;
      const [prefix,encrypted,checksum] = code.split('_');

      const loose_it = prefix.slice(0, 4);
      if (loose_it != this.prefix) throw 1;

      const timestamp = parseFloat(prefix.slice(3));
      const timeDifference = new Date().valueOf() - timestamp;
      if (timeDifference > 5 * 60 * 1000) throw 1;

      let [iv,encryptedId] = encrypted.split(':');
      if(checksum != crypto.createHash('sha256').update(encryptedId).digest('hex')) throw 1;

      const decipher = crypto.createDecipheriv(this.encAlgorithm, Buffer.from(this.encKey), Buffer.from(iv, 'hex'));
      let decrypted = decipher.update(Buffer.from(encryptedId, 'hex'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    }catch(err){
      if (err == 1)  throw "Wrong or expired code"
      else throw "Invalid code"
    }
  }

}

export const userManager = new UserManager();