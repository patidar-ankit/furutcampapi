import mongoose from 'mongoose';

const { Schema } = mongoose;

const StaySchema = new Schema({
  propertyId: {
    type: String,
    default: null
  },
  stayTypeId: {
    type: String,
    default: null    //// 1  = Campground, 2 = Dome tent, 3 = A frame tent, 4 = Tree house, 5 = Others 
  },
  stayType: {
    type: String,
    default: null
  }, 
  stayName: {
    type: String,
    default: null
  }, 
  description: {
    type: String,
    default: null
  }, 
  countAvailable: {
    type: Number,
    default: 0
  },
  countCapacity: {
    type: Number,
    default: 0
  },
  priceRegular: {
      type: Number,
      default: 0
    },
  priceWeekend:{
      type: Number,
      default: 0
    },
  perPerson: {
    type: Boolean,
    default: false
  },
  includedFood: {
    type: Array,
    default: null
  },
  includedFacilitiesFree: {
    type: Array,
    default: null
  },
  includedFacilitiesPaid: {
    type: Array,
    default: null,
  },
  status: {
    type: Number,
    default: 0,      /// 0 unpublish , 1 - publish
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Stay = mongoose.model('stay', StaySchema);
export default Stay;
