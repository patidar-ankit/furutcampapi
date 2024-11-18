import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExpItineraryImachema = new Schema({
  itineraryId: {
    type: String,   
    default: null
  },
  imgName: {
    type: String,   
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const ExpItineraryImg = mongoose.model('exp_itinerary_img', ExpItineraryImachema);
export default ExpItineraryImg;
