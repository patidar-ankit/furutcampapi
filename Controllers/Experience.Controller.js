import createError from 'http-errors';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import ExperienceType from '../Models/ExperienceType.model.js';
import AdventureType from '../Models/AdventureType.model.js';
import DurationType from '../Models/DurationType.model.js';
import ExpCancellationPolicy from '../Models/expCancellationPolicy.model.js';
import ExperienceCancellationPolicy from '../Models/ExperienceCancellationPolicy.model.js';
import ExpIncludes from '../Models/ExpIncludes.model.js';
import ExpCarry from '../Models/ExpCarry.model.js';
import Experience from '../Models/Experience.model.js';
import ExperienceImg from '../Models/ExperienceImg.model.js';
import moment from 'moment';
import User from '../Models/User.model.js';
import Event from '../Models/Event.model.js';
import ExperienceItinerary from '../Models/ExperienceItinerary.model.js';
import ExpItineraryImg from '../Models/ExpItineraryImages.js';
import { filterByDay } from '../helpers/common_helpers.js';
import EventItinerary from '../Models/EventItinerary.model.js';
import ExperienceInventory from '../Models/ExperienceInventory.model.js';
import TransportationMode from '../Models/TransportationMode.model.js';
import Languages from '../Models/Language.model.js';
import PropCancellationPolicy from '../Models/ProCancellationPolicy.model.js';
import StayType from '../Models/StayType.model.js';
import EventInventory from '../Models/EventInventory.model.js';


const ExperienceController = {
  addExperienceType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.experienceImg = `uploads/${path}`
      }
      const experinceType = new ExperienceType(req.body)
      const result = await experinceType.save()
      sendSuccessResponse(res, result, 'Experience Type added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateExperienceType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.experienceImg = `uploads/${path}`
      }
      const experinceType = await ExperienceType.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, experinceType, 'Experience Type updated successfully');
    } catch (error) {
      next(error)
    }
  },
  getExperienceTypes: async (req, res, next) => {
    try {
      const experienceType = await ExperienceType.find()
      sendSuccessResponse(res, experienceType, 'Experience Type fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addAdventureType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.adventureImg = `uploads/${path}`
      }
      const adventureType = new AdventureType(req.body)
      const result = await adventureType.save()
      sendSuccessResponse(res, result, 'Adventure Type added successfully');
    } catch (error) {
      next(error)
    }
  },
  updateAdventureType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.adventureImg = `uploads/${path}`
      }
      const adventureType = await AdventureType.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, adventureType, 'Adventure Type updated successfully');
    } catch (error) {
      next(error)
    }
  },

  adventureList: async (req, res, next) => {
    try {
      const adventureType = await AdventureType.find()
      sendSuccessResponse(res, adventureType, 'Adventure Type fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  adventureListByExpTypeId: async (req, res, next) => {
    try {
      const addAdventureType = await AdventureType.find({ experienceTypeId: req.body.experienceTypeId })
      sendSuccessResponse(res, addAdventureType, 'Adventure Type fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addDurationType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.durationImg = `uploads/${path}`
      }
      const durationtype = new DurationType(req.body)
      const result = await durationtype.save()
      sendSuccessResponse(res, result, 'Duration Type added successfully');
    } catch (error) {
      next(error)
    }
  },

  durationTypeList: async (req, res, next) => {
    try {
      const durationTypeList = await DurationType.find()
      sendSuccessResponse(res, durationTypeList, 'Duration Type fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addCancellationPolicy: async (req, res, next) => {
    try {
      const policy = new ExpCancellationPolicy(req.body)
      const result = await policy.save()
      sendSuccessResponse(res, result, 'Cancellation Policy added successfully');
    } catch (error) {
      next(error)
    }
  },

  expCancellationPolicyList: async (req, res, next) => {
    try {
      // const policy = await ExpCancellationPolicy.find()
      const policy = await PropCancellationPolicy.find()
      sendSuccessResponse(res, policy, 'Cancellation Policy fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addExperienceCancellationPolicy: async (req, res, next) => {
    try {
      const policy = new ExperienceCancellationPolicy(req.body)
      const result = await policy.save()
      sendSuccessResponse(res, result, 'Cancellation Policy added successfully');
    } catch (error) {
      next(error)
    }
  },

  experienceCancellationPolicyById: async (req, res, next) => {
    try {
      const policy = await ExperienceCancellationPolicy.findById(req.body.id)
      sendSuccessResponse(res, policy, 'Cancellation Policy fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addIncludes: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.img = `uploads/${path}`
      }
      const expInclude = new ExpIncludes(req.body)
      const result = await expInclude.save()
      sendSuccessResponse(res, result, 'Includes added successfully');
    } catch (error) {
      next
    }
  },

  updateIncludes: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.img = `uploads/${path}`
      }

      const result = await ExpIncludes.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, result, 'Includes added successfully');
    } catch (error) {
      next
    }
  },

  expIncludeList: async (req, res, next) => {
    try {
      const includeList = await ExpIncludes.find()
      sendSuccessResponse(res, includeList, 'Includes fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addExpCarry: async (req, res, next) => {
    try {
      const carry = new ExpCarry(req.body)
      const result = await carry.save()
      sendSuccessResponse(res, result, 'Carry added successfully');
    } catch (error) {
      next(error)
    }
  },

  expCarryList: async (req, res, next) => {
    try {
      const carry = await ExpCarry.find()
      sendSuccessResponse(res, carry, 'Carry fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addExperience: async (req, res, next) => {
    try {
      const reqBody = req.body
      let result
      if (reqBody.isExperience === true) {
        const experience = new Experience(req.body)
        result = await experience.save()
      } else {
        const experience = new Event(req.body)
        result = await experience.save()
      }
      sendSuccessResponse(res, result, 'Experience added successfully');
    } catch (error) {
      next(error)
    }
  },

  uploadExperienceImg: async (req, res, next) => {
    try {
      let savedata = []
      if (req.files.length > 0) {
        let filesData = req.files
        for (let item of filesData) {
          const path = item.filename;
          req.body.expImgName = `uploads/${path}`
          const expImg = new ExperienceImg(req.body)
          const save = await expImg.save()
          savedata.push(save)
        }
      }
      sendSuccessResponse(res, savedata, 'Experience images uploaded successfully');
    } catch (error) {
      next(error)
    }
  },
  experienceList: async (req, res, next) => {
    try {
      const experience = await Experience.find({experience_status: 1}).sort({ createdAt: -1 })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  experienceListForHomePage: async (req, res, next) => {
    try {
      const experience = await Experience.find({experience_status: 1}).sort({ createdAt: -1 }).limit(24)
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      next(error)
    }
  },
  experienceListByHost: async (req, res, next) => {
    try {
      const experience = await Experience.find({ userId: req.body.userId })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
        const expItinerary = await ExperienceItinerary.find({ experienceId: i._id })
    
        if (expItinerary.length > 0) {
          const filteredData = filterByDay(expItinerary);
          i._doc.expItinerary = filteredData
          for(let item of expItinerary){
            const itineraryImg = await ExpItineraryImg.find({ itineraryId: item._id })
            item._doc.itineraryImg = itineraryImg
          }
        }
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  updateExperienceById: async (req, res, next) => {
    try {
      const reqBody = req.body
      let experience;
      if (reqBody.isExperience === true) {
        await Experience.findByIdAndUpdate(req.params.id, req.body)
        experience = await Experience.findById(req.params.id)

      } else {
        await Event.findByIdAndUpdate(req.params.id, req.body)
        experience = await Event.findById(req.params.id)
      }
      sendSuccessResponse(res, experience, 'Experience updated successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  updateExperienceAndEventById: async (req, res, next) => {
    try {
      const reqBody = req.body
      let experience;
      if (reqBody.isExperience === true) {
        await Experience.findByIdAndUpdate(req.body.id, req.body)
        experience = await Experience.findById(req.body.id)

      } else {
        await Event.findByIdAndUpdate(req.body.id, req.body)
        experience = await Event.findById(req.body.id)
      }
      console.log('req.Body', reqBody)
      sendSuccessResponse(res, experience, 'Experience updated successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  approvedExperienceList: async (req, res, next) => {
    try {
      const experience = await Experience.find({ experience_status: 2 })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  unApprovedExperienceList: async (req, res, next) => {
    try {
      const experience = await Experience.find({ experience_status: 1 })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  approveExperience: async (req, res, next) => {
    try {
      const property = await Experience.findByIdAndUpdate(req.body.id, { experience_status: 2 })
      sendSuccessResponse(res, property, 'Experience approved successfully');
    } catch (error) {
      next(error)
    }
  },

  experienceById: async (req, res, next) => {
    try {
      const experience = await Experience.findById(req.body.id)
      let srNo = 1
      if (experience?._id) {
        experience._doc.srNo = srNo;
        srNo++;
        experience._doc.createdAt = moment(experience.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(experience.userId)
        const expType = await ExperienceType.findById(experience.experienceTypeId)
        experience._doc.experienceTypeName = expType?.experienceName || null
        experience._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(experience.adventureTypeId)
        experience._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(experience.durationTypeId)
        experience._doc.durationName = duration?.durationName || null
        experience._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: experience.includes } })
        experience._doc.includesData = includeData
        let notIncludeData = await ExpIncludes.find({ _id: { $nin: experience.includes } })
        experience._doc.notIncludeData = notIncludeData
        let carryData = await ExpCarry.find({ _id: { $in: experience.carry } }, { "carryName": 1, "_id": 1 })
        experience._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: experience._id })
        experience._doc.expImg = expImg
        let cancellationPolicy = await ExperienceCancellationPolicy.findById(experience.cancellationId)
        experience._doc.cancellationPolicy = cancellationPolicy
        const expItinerary = await ExperienceItinerary.find({ experienceId: experience._id })
        let greetingsData = []
        let activityDayData = []
        let transportGreetingData = []
        let foodData = []
        let sleepData = []

        const customOrder = ["Morning", "Afternoon", "Evening"];
        if (expItinerary.length > 0) {
          for (let i of expItinerary) {
            greetingsData.push({ greeting: i.greeting, day: i.day })
            if(i.type === 'Activity'){
              activityDayData.push({ greeting: i.greeting, day: i.day })
            }

            if(i.type === 'Food'){
              foodData.push({ greeting: i.greeting, day: i.day })
            }
            if(i.type === 'Transport'){
              transportGreetingData.push({ greeting: i.greeting, day: i.day })
              const tranportMode = await TransportationMode.findOne({name: i.mode})
              i._doc.transportImg = tranportMode?.img || null
            }
            const itineraryImg = await ExpItineraryImg.find({ itineraryId: i._id })
            i._doc.itineraryImg = itineraryImg

            if(i.type === 'Sleep'){
              const stayTypes = await StayType.findOne({stayType: i.place})
              i._doc.sleepImg = stayTypes.stayImg || null
              sleepData.push({ greeting: i.greeting, day: i.day })
            }
          }
          const filteredData = filterByDay(expItinerary);
          experience._doc.expItinerary = filteredData
          const deduplicatedData = greetingsData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.greetingsData = deduplicatedData.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });

          const duplicatedDFood = foodData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.foodData = duplicatedDFood.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });

          const duplicatedDataActivity = activityDayData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.activityDayData = duplicatedDataActivity.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });

          const duplicatedtransportGreetingData = transportGreetingData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.transportGreetingData = duplicatedtransportGreetingData.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });
          experience._doc.sleepData = sleepData
        }

        const expInventory = await ExperienceInventory.find({ experienceId: experience._id })
        const bookedDates = []
        if (expInventory.length > 0) {
          for (let item of expInventory) {
            let availableCapacity = item.capacity - item.booked
            if (Number(availableCapacity) === 0) {

              let bookedDate = moment(item.bookingDate).format('YYYY-MM-DD')
              bookedDates.push(bookedDate)
            }

          }
        }
        experience._doc.bookedDates = bookedDates

        const hostDetail = await User.findById(experience.userId, { "_id": 1, "name": 1, "mobileNo": 1, "email": 1, "memberSince": 1, "userDesc": 1, "languages": 1, "replyRate": 1, "profilePhoto": 1 })
        experience._doc.hostDetail = hostDetail
        let language = []
        if (hostDetail?.languages) {
          const langData = await Languages.find({ _id: { $in: hostDetail.languages } }, { "language": 1 })
          if (langData.length > 0) {
            for (let i of langData) {
              language.push(i.language)
            }
          }
          hostDetail._doc.language = language
        }
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  eventListByHost: async (req, res, next) => {
    try {
      const experience = await Event.find({ userId: req.body.userId })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
        // const expItinerary = await EventItinerary.find({experienceId: i._id}) 
        // console.log('expItinerary', expItinerary)
        // if(expItinerary.length>0){
        //   const filteredData = filterByDay(expItinerary);
        //   experience._doc.expItinerary = filteredData
        // }
        const expItinerary = await EventItinerary.find({ experienceId: i._id })
       
        if (expItinerary.length > 0) {
          const filteredData = filterByDay(expItinerary);
          i._doc.expItinerary = filteredData
          for(let item of expItinerary){
            const itineraryImg = await ExpItineraryImg.find({ itineraryId: item._id })
            item._doc.itineraryImg = itineraryImg
          }
        }
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      console.log('event-list-by-host', error)
      next(error)
    }
  },

  eventList: async (req, res, next) => {
    try {
      const currentDate = new Date();
      const experience = await Event.find({ experience_status: 1, startDate: { $gte: currentDate } }).sort({ startDate: 1 })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
        const expItinerary = await EventItinerary.find({ experienceId: experience._id })
        if (expItinerary.length > 0) {
          const filteredData = filterByDay(expItinerary);
          i._doc.expItinerary = filteredData
        }
      }
      sendSuccessResponse(res, experience, 'Event fetched successfully');
    } catch (error) {
      next(error)
    }
  },


  eventListForAdmin: async (req, res, next) => {
    try {
      const currentDate = new Date();
      const experience = await Event.find().sort({ createdAt: 1 })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        // i._doc.startDate = moment(i.startDate).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
        const expItinerary = await EventItinerary.find({ experienceId: experience._id })
        if (expItinerary.length > 0) {
          const filteredData = filterByDay(expItinerary);
          i._doc.expItinerary = filteredData
        }
      }
      sendSuccessResponse(res, experience, 'Event fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  expListForAdmin: async (req, res, next) => {
    try {
      const currentDate = new Date();
      const experience = await Experience.find().sort({ createdAt: 1 })
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        // i._doc.startDate = moment(i.startDate).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
        const expItinerary = await ExperienceItinerary.find({ experienceId: experience._id })
        if (expItinerary.length > 0) {
          const filteredData = filterByDay(expItinerary);
          i._doc.expItinerary = filteredData
        }
      }
      sendSuccessResponse(res, experience, 'Event fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  eventListForHomePage: async (req, res, next) => {
    try {
      const currentDate = new Date();
      const experience = await Event.find({ experience_status: 1, startDate: { $gte: currentDate } }).sort({ startDate: -1 }).limit(9)
      // const experience = await Event.find({experience_status: 1}).sort({ createdAt: -1,  }).limit(9)
     
      let srNo = 1
      for (let i of experience) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        const expType = await ExperienceType.findById(i.experienceTypeId)
        i._doc.experienceTypeName = expType?.experienceName || null
        i._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(i.adventureTypeId)
        i._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(i.durationTypeId)
        i._doc.durationName = duration?.durationName || null
        i._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: i.includes } }, { "includesName": 1, "_id": 1 })
        i._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: i.carry } }, { "carryName": 1, "_id": 1 })
        i._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: i._id })
        i._doc.expImg = expImg
        const expItinerary = await EventItinerary.find({ experienceId: experience._id })
        if (expItinerary.length > 0) {
          const filteredData = filterByDay(expItinerary);
          i._doc.expItinerary = filteredData
        }
      }
      sendSuccessResponse(res, experience, 'Event fetched successfully');
    } catch (error) {
      next(error)
    }
  },
  eventById: async (req, res, next) => {
    try {
      const experience = await Event.findById(req.body.id)
      let srNo = 1
      if (experience?._id) {
        experience._doc.srNo = srNo;
        srNo++;
        experience._doc.createdAt = moment(experience.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(experience.userId)
        const expType = await ExperienceType.findById(experience.experienceTypeId)
        experience._doc.experienceTypeName = expType?.experienceName || null
        experience._doc.experienceTypeDescription = expType?.experienceDescription || null
        let advType = await AdventureType.findById(experience.adventureTypeId)
        experience._doc.adventureName = advType?.adventureName || null
        let duration = await DurationType.findById(experience.durationTypeId)
        experience._doc.durationName = duration?.durationName || null
        experience._doc.hostName = host?.name || null
        let includeData = await ExpIncludes.find({ _id: { $in: experience.includes } })
        experience._doc.includesData = includeData
        let carryData = await ExpCarry.find({ _id: { $in: experience.carry } }, { "carryName": 1, "_id": 1 })
        experience._doc.carryData = carryData
        let expImg = await ExperienceImg.find({ experinceId: experience._id })
        experience._doc.expImg = expImg
        let cancellationPolicy = await ExperienceCancellationPolicy.findById(experience.cancellationId)
        experience._doc.cancellationPolicy = cancellationPolicy
        const expItinerary = await EventItinerary.find({ experienceId: experience._id })
        let greetingsData = []
        let activityDayData = []
        let transportGreetingData = []
        let foodData = []
        let sleepData = []

        const customOrder = ["Morning", "Afternoon", "Evening"];
        if (expItinerary.length > 0) {
          for (let i of expItinerary) {
            greetingsData.push({ greeting: i.greeting, day: i.day })
            if(i.type === 'Activity'){
              activityDayData.push({ greeting: i.greeting, day: i.day })
            }

            if(i.type === 'Food'){
              foodData.push({ greeting: i.greeting, day: i.day })
            }
            if(i.type === 'Transport'){
              transportGreetingData.push({ greeting: i.greeting, day: i.day })
              const tranportMode = await TransportationMode.findOne({name: i.mode})
              i._doc.transportImg = tranportMode?.img || null
            }
            const itineraryImg = await ExpItineraryImg.find({ itineraryId: i._id })
            i._doc.itineraryImg = itineraryImg

            if(i.type === 'Sleep'){
              const stayTypes = await StayType.findOne({stayType: i.place})
              i._doc.sleepImg = stayTypes.stayImg || null
              sleepData.push({ greeting: i.greeting, day: i.day })
            }
          }
          const filteredData = filterByDay(expItinerary);
          experience._doc.expItinerary = filteredData
          const deduplicatedData = greetingsData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.greetingsData = deduplicatedData.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });

          const duplicatedDataActivity = activityDayData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.activityDayData = duplicatedDataActivity.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });

          const duplicatedtransportGreetingData = transportGreetingData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.transportGreetingData = duplicatedtransportGreetingData.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });
          const duplicatedDFood = foodData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.greeting === value.greeting && t.day === value.day
            ))
          );
          experience._doc.foodData = duplicatedDFood.sort((a, b) => {
            return customOrder.indexOf(a.greeting) - customOrder.indexOf(b.greeting);
          });
          experience._doc.sleepData = sleepData
        }

        const expInventory = await EventInventory.find({ experienceId: experience._id })
        const bookedDates = []
        if (expInventory.length > 0) {
          for (let item of expInventory) {
            let availableCapacity = item.capacity - item.booked
            if (Number(availableCapacity) === 0) {

              let bookedDate = moment(item.bookingDate).format('YYYY-MM-DD')
              bookedDates.push(bookedDate)
            }

          }
        }
        experience._doc.bookedDates = bookedDates

        const hostDetail = await User.findById(experience.userId, { "_id": 1, "name": 1, "mobileNo": 1, "email": 1, "memberSince": 1, "userDesc": 1, "languages": 1, "replyRate": 1, "profilePhoto": 1 })
        experience._doc.hostDetail = hostDetail
        let language = []
        if (hostDetail?.languages) {
          const langData = await Languages.find({ _id: { $in: hostDetail.languages } }, { "language": 1 })
          if (langData.length > 0) {
            for (let i of langData) {
              language.push(i.language)
            }
          }
          hostDetail._doc.language = language
        }
      }
      sendSuccessResponse(res, experience, 'Experience fetched successfully');
    } catch (error) {
      console.log('eventDetailByIdError', error)
      next(error)
    }
  },

  addExperienceItinerary: async (req, res, next) => {
    try {
      const reqBody = req.body
      const createExpItinearay = new ExperienceItinerary(reqBody)
      const expItinerary = await createExpItinearay.save()
      sendSuccessResponse(res, expItinerary, 'Experience Itinerary added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateExperienceItinerary: async(req, res, next)=>{
    try {
      const reqBody = req.body
      const update = await ExperienceItinerary.findByIdAndUpdate(reqBody.id, reqBody)
      sendSuccessResponse(res, update, 'Experience Itinerary updated successfully');
    } catch (error) {
      next(error)
    }
      
  },

  deleteExperienceItineraryById: async(req, res, next)=>{
    try {
        const delteExpItinerary = await ExperienceItinerary.findByIdAndDelete(req.body.id)
        sendSuccessResponse(res, delteExpItinerary, 'Experience Itinerary deleted successfully');
    } catch (error) {
      next(error)
    }
  },




  addEventItinerary: async (req, res, next) => {
    try {
      const reqBody = req.body
      const createExpItinearay = new EventItinerary(reqBody)
      const expItinerary = await createExpItinearay.save()
      sendSuccessResponse(res, expItinerary, 'Event Itinerary added successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  updateEventItinerary: async(req, res, next)=>{
    try {
      const updateEventItinerary = await EventItinerary.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, updateEventItinerary, 'Event Itinerary updated successfully');
    
    } catch (error) {
      next(error)
    }
  },

  deleteEventItineraryById: async(req, res, next)=>{
    try {
      const deleteEventItinerary = await EventItinerary.findByIdAndDelete(req.body.id)
      sendSuccessResponse(res, deleteEventItinerary, 'Event Itinerary deleted successfully');
    } catch (error) {
      next(error)
    }
  },

  uploadExpItineraryImg: async (req, res, next) => {
    try {
      let savedata = []
      if (req.files.length > 0) {
        let filesData = req.files
        for (let item of filesData) {
          const path = item.filename;
          req.body.imgName = `uploads/${path}`
          const expImg = new ExpItineraryImg(req.body)
          const save = await expImg.save()
          savedata.push(save)
        }
      }
      // const upload = new ExpItineraryImg(req.body)
      // const result = await upload.save()
      sendSuccessResponse(res, savedata, 'Itinerary Images Uploaded  successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  uploadEventItineraryImg: async (req, res, next) => {
    try {
      let savedata = []
      if (req.files.length > 0) {
        let filesData = req.files
        for (let item of filesData) {
          const path = item.filename;
          req.body.imgName = `uploads/${path}`
          const expImg = new ExpItineraryImg(req.body)
          const save = await expImg.save()
          savedata.push(save)
        }
      }
      // const upload = new ExpItineraryImg(req.body)
      // const result = await upload.save()
      sendSuccessResponse(res, savedata, 'Itinerary Images Uploaded  successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  deleteEventAndExpIteneraryImgById: async(req, res, next)=>{
    try {
      const deleteImg = await ExpItineraryImg.findByIdAndDelete(req.body.id)
      sendSuccessResponse(res, deleteImg, 'Itinerary Img Deleted successfully');
    } catch (error) {
      next(error)
    }
  },

  deleteExperienceAndEventImgById: async (req, res, next) => {
    try {
      const reqBody = req.body
      const expImg = await ExperienceImg.findByIdAndDelete(reqBody.id)
      sendSuccessResponse(res, expImg, 'Image Deleted successfully');
    } catch (error) {
      next(error)
    }
  },

  createTransportMode: async (req, res, next) => {
    try {
      const doesExist = await TransportationMode.findOne({ name: req.body.name })
      if (doesExist) {
        throw createError.Conflict(`${req.body.name} is already registered`);
      }
      if (req.file) {
        const path = req.file.filename;
        req.body.img = `uploads/${path}`
      }
      const transportMode = new TransportationMode(req.body)
      const result = await transportMode.save()
      sendSuccessResponse(res, result, 'Transport Mode Added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateTransportationMode: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.img = `uploads/${path}`
      }
      const result = await TransportationMode.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, result, 'Transportation mode updated successfully');
    } catch (error) {
      next
    }
  },

  tranportModeList: async (req, res, next) => {
    try {
      const tranportMode = await TransportationMode.find({})
      sendSuccessResponse(res, tranportMode, 'Transport Mode List');
    } catch (error) {
      next(error)
    }
  }

}


export default ExperienceController;


