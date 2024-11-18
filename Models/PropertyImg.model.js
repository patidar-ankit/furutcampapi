import mongoose from 'mongoose';

const { Schema } = mongoose;

const propertyImgSchema = new Schema({
  propImgName: {
    type: String,
    required: true,
  },
  stayId: {
    type: String,   /// 1-easy,2-Strict,3-Eco, 4 - custome
    default: null
  },
  propertyId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const PropertyImg = mongoose.model('property_img', propertyImgSchema);
export default PropertyImg;
