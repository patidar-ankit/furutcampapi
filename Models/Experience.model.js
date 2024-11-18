import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExperienceSchema = new Schema({
   userId: {
      type: String
   },
   propertyId: {
      type: String,
      default: null
   },
   experienceTypeId: {
      type: String,
      required: false,
      default: null
   },
   experienceType: {
      type: String,
      required: false,
      default: null
   },
   adventureTypeId: {
      type: String,
      required: false,
      default: null
   },

   durationTypeId: {
      type: String,
      default: null
   },
   experienceName: {
      type: String,
      default: null
   },
   // alwaysStatus: {
   //   type: Number,
   //   default: 0   
   // },

   startDate: {
      type: Date,
      default: null,
   },
     startTime: {
        type: String, 
        default: null,
     }, 
   endDate: {
      type: Date,
      default: null,
   },
     endTime: {
        type: String, 
        default: null,
     },

   //   repeatStatus: {
   //      type: Number, 
   //      default: 0,
   //   },
   priceRegular: {
      type: String,
      default: null,
   },
   priceWeekend: {
      type: String,
      default: null,
   },
   perPerson: {
      type: Number,
      default: 0,   // 0 - false, 1 - true 
   },
   openPrivateGroup: {
      type: Number,
      default: 0,   // 0 - open, 1 - Private 
   },
   minPerson: {
      type: String,
      default: null,
   },
   maxPerson: {
      type: String,
      default: null,
   },
   includes: {
      type: Array,
      default: null,
   },
   carry: {
      type: Array,
      default: null,
   },
   cancellationId: {
      type: String,
      default: null
   },
   isExperience: {
      type: Boolean,
      default: true
   },
   activityDay: {
      type: Number,
      default: 0
   },
   durationTime: {
      type: String,
      default: null
   },
   //   eventSchedule:{
   //    type: Array,
   //    default : []
   // },
   // occurrence:{
   //    type: Number,
   //    default: null
   //  },
   capacity: {
      type: Number,
      default: null
   },
   summery: {
      type: Array,
      default : []
   },
   busStation: {
      type: String,
      default: null
   },
   airport: {
      type: String,
      default: null
   },
   railwayStation: {
      type: String,
      default: null
   },
   location: {
      address: {
          type: String,
          required: false
      },
      city: {
          type: String,
          required: false
      },
      state: {
          type: String,
          required: false
      },
      lat: {
          type: String,
          required: false
      },
      long: {
          type: String,
          required: false
      },
    },
   experience_status: {
      type: Number,   ///0-unpublished,1-Published,2-Active
      default: 0,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

///isExper

const Experience = mongoose.model('experience', ExperienceSchema);
export default Experience;
