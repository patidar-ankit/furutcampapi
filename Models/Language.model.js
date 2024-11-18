import mongoose from 'mongoose';

const { Schema } = mongoose;

const languageSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    default: null,
  },
  code: {
    type: String,
    default: null,
  },
  default: {
    type: Boolean,
    default: false,
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


const Languages = mongoose.model('language', languageSchema);
export default Languages;
