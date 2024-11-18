import mongoose from 'mongoose';

const { Schema } = mongoose;

const campRulesSchema = new Schema({
  rule: {
    type: String,
    required: true,
  },
  rulesType: {
    type: Number,   //1-easy,2-Strict,3-Eco

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


const CampRules = mongoose.model('camp_rules', campRulesSchema);
export default CampRules;
