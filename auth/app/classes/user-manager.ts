import { User } from "../models/user-model";
import { uuid }  from 'uuidv4';
import { createLogger } from '../utils/logger';
export class UserManager {

  private log: (level: string, message: string, data: any) => void;

  constructor() {
    let logger = createLogger('UserManager');
    this.log = logger.log;
  }

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


  public async registerUser(userInfo: any) {

    this.log('info', 'registerUser', {userInfo});
    let success = false;
    let state = this.states.failedToRegister;
    const id = uuid();

    try {
      userInfo.id = id;
    }catch(e) {
      this.log('error', 'registerUser', {userInfo, error: e});
    }

    if((await this.checkUser(userInfo.email)).success == true){
      state = this.states.emailExists;
    }

    try{
      const user = new User(userInfo);
      await user.save()
      success = true;
    }catch(e) {
      this.log('error', 'registerUser', {userInfo, error: e});
    }

    this.log('info', 'registerResult', {userInfo,state});
    return {success, status : {state}, message: {state}, id};
  }

  public async checkUser(email: string) {
    this.log('info', 'checkUser', {email});
    let success = false;
    let state = this.states.userNotFound;
    try {
      const user = await User.findOne({email: email}).exec();
      if(user){
        success = true;
        state = this.states.userFound;
      }
    }catch(e) {
      this.log('error', 'checkUser', {email, error: e});
    }
    this.log('info', 'checkUser', {email,state});
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
        // Change to use timestamp to make it more secure
        user.updateOne({recoveryLink: uuid() + uuid()}).exec();
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

    return true;
  }

  public async updateUserInfo(userInfo: string) {

    return true;
  }

  public async changePassword(email: string, oldPassword: string, newPassword: string) {

    return true;
  }


}