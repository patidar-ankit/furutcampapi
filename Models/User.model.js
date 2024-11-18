import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    // required: true, 
    default: '1', ///// 1 = Admin, 2 = Host, 3 = User
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    // required: false,
    default: '',
  },
  memberSince: {
    type: String,
    default: null,
  },
  userDesc: {
    type: String,
    default: null,
  },
  otpVerification: {
    type: Boolean,
    // required: true,
    default: false,
  },
  profilePhoto: {
    type: String,
    default: null
  },
  languages : {
    type: Array,
    default: null
  },
  replyRate: {
    type: String,
    default: null
  },
  photoUrl:{
    type: String,
    default: null
  },
  governmentID:{
    type: String,
    default: null
  },
  alternativePhoneNumber:{
    type: String,
    default: null
  },
  streetAddress:{
    type: String,
    default: null
  },

  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('user', UserSchema);
export default User;
