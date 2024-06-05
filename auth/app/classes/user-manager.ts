import { User } from "../models/user-model";
import { uuid }  from 'uuidv4';
export class UserManager {
  constructor() {}

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

    let success = false;
    let state = this.states.failedToRegister;
    const id = uuid();

    try {
      userInfo.id = id;
    }catch(e) {
      console.log(e);
    }

    if((await this.checkUser(userInfo.email)).success == true){
      state = this.states.emailExists;
    }

    try{
      const user = new User(userInfo);
      await user.save()
      success = true;
    }catch(e) {
      console.log(e);
    }

    return {success, status : {state}, message: {state}, id};
  }

  public async checkUser(email: string) {
    let success = false;
    let state = this.states.userNotFound;
    try {
      const user = await User.findOne({email: email}).exec();
      if(user){
        success = true;
        state = this.states.userFound;
      }
    }catch(e) {
      console.log(e);
    }
    return {success, status : {state}, message: {state}};
  }
  public async deleteUser(email: string) {

    return true;
  }
  public async generateRecoveryLink(email: string) {

    return 'recoveryLink';
  }
  public async checkRecoveryLink(email: string, link: string) {

    return true;
  }
  public async updateUserInfo(userInfo: string) {

    return true;
  }
  public async changePassword(email: string, oldPassword: string, newPassword: string) {

    return true;
  }



}