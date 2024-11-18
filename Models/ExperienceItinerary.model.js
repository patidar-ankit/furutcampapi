import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceItinerarySchema = new Schema({
  experienceId: {
    type: String,
    required: true,
  },
  meetGreetPlace: {
    type: String,
    default: null
  },
  day: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  },
  durationInHrs: {
    type: String,
    default: null
  },
  mode: {
    type: String,
    default: null
  },
  destination: {
    type: String,
    default: null
  },
  distance: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  place: {
    type: String,
    default: null
  },
  startTime: {
    type: String,
    default: null
  },
  greeting: {
    type: String,
    default: null
  },
  propertyName: {
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


const ExperienceItinerary = mongoose.model('experience_itinerary', experienceItinerarySchema);
export default ExperienceItinerary;
