import mongoose from 'mongoose';
import User from './User.model.js';

const { Schema } = mongoose;

const messageSchema = new Schema({
  // sender: { 
  //   type: String ,
  //    default: null
  // },
  // receiver: {
  //    type: String ,
  //    default: null
  //   },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: User },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: User },
  message: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Message  = mongoose.model('Message', messageSchema );
export default Message;
