import mongoose from 'mongoose';

const { Schema } = mongoose;

const TerrainSchema = new Schema({
  terrainName: {
    type: String,
    required: true,
  },
  terrainImg: {
    type: String,
    default: null
  },
  code: {
    type: String,
    default: null
  },
  default: {
    type: Boolean,
    default: false
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


const Terrain = mongoose.model('terrain', TerrainSchema);
export default Terrain;
