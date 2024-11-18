import mongoose from 'mongoose';

const { Schema } = mongoose;

const PropertySchema = new Schema({
      userId: {
        type: String
      },
      propertyFullLocation:{
        type: String,
        default: null
      },  
      propertyLocated: {
        fullAddress: {
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
      propertyName: {
          type: String,
          required: false
      },
      seasonsId: {
          type: Array,
          required: false,
		  default : null
      },
      terrainId: {
          type: Array,
          required: false,
		  default : null
      },
      amenitiesData: {
          type: Array,
          required: false,
		  default : null
      },
      checkInCheckOutData: {
          checkInTime: {
              type: String,
              required: false
          },
          checkOutTime: {
              type: String,
              required: false
          },
          lateCheckIn: {
              type: Boolean,
              default: false
          },
          lateCheckOut: {
              type: Boolean,
              default: false
          }
      },
      campRulesId: {
          type: String,
		  default : null
      },
      cancellationPolicyId: {
          type: String,
		  default : null
      },
      aboutProperty: {
        type: String,
        default: null
      },
      uspOne: {
        type: String,
        default: null
      },
      uspTwo: {
        type: String,
        default: null
      },
      uspThree: {
        type: String,
        default: null
      },
      uspOne: {
        type: String,
        default: null
      },
      distanceFrom: {
        railwayStation: {
            type: String,
            default: null
        },
        distanceRailwayStation: {
            type: String,
            default: null
        },
        airport: {
            type: String,
            default: null
        },
        distanceAirport: {
            type: String,
            default: null
        },
        busTaxiStand: {
            type: String,
            default: null
        },
        distanceBusTaxiStand: {
            type: String,
            default: null
        }
      },
      propertyStatus: {
        type: Number, ///0-unpublished,1-Published,2-Active
        default: 0,
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


const Property = mongoose.model('property', PropertySchema);
export default Property;
