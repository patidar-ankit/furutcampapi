import mongoose from 'mongoose';

const { Schema } = mongoose;

const convImachema = new Schema({
  convImgName: {
    type: String,
    required: true,
  },
  conveyanceId: {
    type: String,   
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const ConveyanceImg = mongoose.model('conveyance_img', convImachema);
export default ConveyanceImg;
