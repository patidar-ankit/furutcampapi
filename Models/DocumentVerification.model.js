import mongoose from 'mongoose';

const { Schema } = mongoose;

const documentVerificationSchema = new Schema({
  tripBookingId: {
    type: String,
    default: null
  },
  documentType: {
    type: String,
    required: true,
  },
  documentFrontPhoto: {
    type: String,
    default: null
  },
  documentBackPhoto: {
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


const DocumentVerification = mongoose.model('document_verification', documentVerificationSchema);
export default DocumentVerification;
