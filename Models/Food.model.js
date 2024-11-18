import mongoose from 'mongoose';

const { Schema } = mongoose;

const FoodSchema = new Schema({
  foodName: {
    type: String,
    required: true,
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


const Foods = mongoose.model('food', FoodSchema);
export default Foods;
