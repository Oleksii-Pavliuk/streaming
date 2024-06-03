import {Schema , model} from 'mongoose';


// User model
const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    doc: "ID of user"
  },
  username :{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

export const User = model('users', userSchema);
