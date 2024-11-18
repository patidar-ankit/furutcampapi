import mongoose from 'mongoose';

const { Schema } = mongoose;

const expImgSchema = new Schema({
  expImgName: {
    type: String,
    required: true,
  },
  experinceId: {
    type: String,   
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const ExperienceImg = mongoose.model('experience_img', expImgSchema);
export default ExperienceImg;
