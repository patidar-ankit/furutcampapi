import mongoose from 'mongoose';

const { Schema } = mongoose;

const propertiesCampRulesSchema = new Schema({
  rule: {
    type: Array,
    required: true,
  },
  rulesType: {
    type: String,   /// 1-easy,2-Strict,3-Eco, 4 - custome
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


const PropertiesCampRules = mongoose.model('properties_camp_rules', propertiesCampRulesSchema);
export default PropertiesCampRules;
