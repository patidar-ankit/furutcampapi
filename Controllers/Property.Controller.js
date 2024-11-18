import createError from 'http-errors';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import Property from '../Models/Property.model.js';
import Amenities from '../Models/Amenities.model.js';
import Season from '../Models/Seasons.model.js';
import Terrain from '../Models/Terrain.model.js';
import Stay from '../Models/Stay.model.js';
import moment from 'moment';
import User from '../Models/User.model.js';
import Foods from '../Models/Food.model.js';
import Facilities from '../Models/Facilities.model.js';
import PropCancellationPolicy from '../Models/ProCancellationPolicy.model.js';
import PropertiesCancellationPolicy from '../Models/PropertiesCancellationPolicy.model.js';
import PropertiesCampRules from '../Models/PropertiesCampRules.model.js';
import PropertyImg from '../Models/PropertyImg.model.js';
import AddonsType from '../Models/AddonType.model.js';
import Addons from '../Models/Addons.model.js';
import mongoose from 'mongoose';
import Experience from '../Models/Experience.model.js';
import ExperienceType from '../Models/ExperienceType.model.js';
import AdventureType from '../Models/AdventureType.model.js';
import DurationType from '../Models/DurationType.model.js';
import ExpIncludes from '../Models/ExpIncludes.model.js';
import ExpCarry from '../Models/ExpCarry.model.js';
import ExperienceImg from '../Models/ExperienceImg.model.js';
import Conveyance from '../Models/Conveyance.model.js';
import Package from '../Models/Package.model.js';
import Event from '../Models/Event.model.js';
import StayType from '../Models/StayType.model.js';
import NearBy from '../Models/NearBy.model.js';
import Languages from '../Models/Language.model.js';
import CampRules from '../Models/CampRules.model.js';
import ClaimProperty from '../Models/ClaimProperty.model.js';
import PackingList from '../Models/PackingList.model.js';
const { ObjectId } = mongoose.Types;
// import initMongoDB from '../helpers/init_mongodb.js';
// const { ObjectId } = initMongoDB.Types;
const PropertyController = {

  propertyList: async (req, res, next) => {
    try {
      const hostList = await Property.find({ propertyStatus: { $in: [1, 2] } }).sort({ _id: "desc" });
      let srNo = 1
      for (let i of hostList) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        i._doc.hostName = host?.name || null
        const stayDetail = await Stay.find({ propertyId: i._id })
        i._doc.stayDetail = stayDetail
        const prices = []
        for (let stay of stayDetail) {
          prices.push({ price: stay.priceRegular, day: 'Regular' })
          prices.push({ price: stay.priceWeekend, day: 'Weekend' })
        }
        const highestPrice = Math.max(...prices.map(item => item.price));
        const lowestPrice = Math.min(...prices.map(item => item.price));

        i._doc.highestPrice = highestPrice
        i._doc.lowestPrice = lowestPrice
        const images = await PropertyImg.find({ propertyId: i._id })
        i._doc.propertyImage = images.length > 0 ? images[0].propImgName : null;
        // if (images.length > 0) {
        //   i._doc.propertyImage = images[0].propImgName
        // }
      }
      sendSuccessResponse(res, hostList, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  propertyListByTerrian: async (req, res, next) => {
    try {
      let porppertyByTerrian

      if (req.body.terrianId === 'all') {

        porppertyByTerrian = await Property.find({ propertyStatus: { $in: [1, 2] } }).sort({ _id: "desc" });
      } else {
        const terrain = await Terrain.findById(req.body.terrianId);
        const terrainIds = []
        // if (terrain.length > 0) {
        //   for (let item of terrain) {
        //     let terrainId = item._id.toString();
        //     terrainIds.push(terrainId)

        //   }
        // }
        if (terrain?._id) {
          let terrainId = terrain._id.toString();
          terrainIds.push(terrainId)
        }
        porppertyByTerrian = await Property.find({ propertyStatus: { $in: [1, 2] }, terrainId: { $in: terrainIds } }).sort({ _id: "desc" });;
      }
      let srNo = 1
      for (let i of porppertyByTerrian) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        i._doc.hostName = host?.name || null
        const stayDetail = await Stay.find({ propertyId: i._id })
        i._doc.stayDetail = stayDetail
        const prices = []
        for (let stay of stayDetail) {
          prices.push({ price: stay.priceRegular, day: 'Regular' })
          prices.push({ price: stay.priceWeekend, day: 'Weekend' })
        }
        const highestPrice = Math.max(...prices.map(item => item.price));
        const lowestPrice = Math.min(...prices.map(item => item.price));

        i._doc.highestPrice = highestPrice
        i._doc.lowestPrice = lowestPrice
        const images = await PropertyImg.find({ propertyId: i._id })
        i._doc.propertyImage = images.length > 0 ? images[0].propImgName : null; // Return the image or null if no image is found
        // if (images.length > 0) {
        //   i._doc.propertyImage = images[0].propImgName
        // }
      }
      sendSuccessResponse(res, porppertyByTerrian, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },
  approvedPropertyList: async (req, res, next) => {
    try {
      const hostList = await Property.find({})
      let srNo = 1
      for (let i of hostList) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        i._doc.hostName = host?.name || null
        const experience = await Experience.find({propertyId: i._id})
        i._doc.experienceCount = experience?.length 
        const stayDetail = await Stay.find({ propertyId: i._id })
        i._doc.stayCount = stayDetail.length
        const events = await Event.find({propertyId: i._id})
        i._doc.eventCount = events.length

        const addOn = await Addons.find({propertyId: i._id})
        i._doc.addOnsCount = addOn.length
      }
      sendSuccessResponse(res, hostList, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  unApprovedPropertyList: async (req, res, next) => {
    try {
      const hostList = await Property.find({ propertyStatus: 1 })
      let srNo = 1
      for (let i of hostList) {
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        i._doc.hostName = host?.name || null
      }
      sendSuccessResponse(res, hostList, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  propertyListByHostId: async (req, res, next) => {
    try {
      const property = await Property.find({ userId: req.body.hostId })
      for (let i of property) {
        let seasonData = await Season.find({ _id: { $in: i.seasonsId } }, { "seasonName": 1, "_id": 1 })
        i._doc.season = seasonData


        let terrain = await Terrain.find({ _id: { $in: i.terrainId } }, { "terrainName": 1, "_id": 1 })
        i._doc.terrain = terrain
        let amenitiesIds = []
        if (i.amenitiesData.length > 0) {
          for (let item of i.amenitiesData) {
            amenitiesIds.push(item.id)
          }
          let amenities = await Amenities.find({ _id: { $in: amenitiesIds } }, { "amenitiesName": 1, "_id": 1 })
          i._doc.amenities = amenities
        }
        let stayTypeDetail = await Stay.find({ propertyId: i._id })
        i._doc.stayTypeDetail = stayTypeDetail
        for (let item of stayTypeDetail) {
          let food = await Foods.find({ _id: { $in: item.includedFood } }, { "foodName": 1, "_id": 1 })
          item._doc.includedFoodData = food
          let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: item.includedFacilitiesFree } }, { "facilitiesName": 1, "_id": 1 })
          item._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
          let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: item.includedFacilitiesPaid } }, { "facilitiesName": 1, "_id": 1 })
          item._doc.includedFacilitiesPaidData = includedFacilitiesPaidData
        }
        let propertyImgs = await PropertyImg.find({ propertyId: i._id })
        if (propertyImgs.length > 0) {
          for (let i of propertyImgs) {
            if (i.stayId) {
              const stayDetail = await Stay.findById(i.stayId)
              i._doc.stayType = stayDetail.stayType
            }
          }
          i._doc.propertyImgs = propertyImgs
        }

        let addons = await Addons.find({ propertyId: i._id })
        if (addons.length > 0) {
          i._doc.addons = addons
        }
      }
      sendSuccessResponse(res, property, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  propertyListById: async (req, res, next) => {
    try {
      // const hostList = await Property.find({_id: req.body.hostId})
      const property = await Property.findById(req.body.id)
      if (property) {
        let seasonData = await Season.find({ _id: { $in: property.seasonsId } }, { "seasonName": 1, "_id": 1 })
        property._doc.seasonData = seasonData
        let terrain = await Terrain.find({ _id: { $in: property.terrainId } }, { "terrainName": 1, "_id": 1 })
        property._doc.terrainData = terrain
        let amenitiesIds = []

        let campRules = await PropertiesCampRules.findById(property.campRulesId)
        property._doc.campRules = campRules

        let cancellationPolicy = await PropertiesCancellationPolicy.findById(property.cancellationPolicyId)
        property._doc.cancellationPolicy = cancellationPolicy
        if (property.amenitiesData.length > 0) {
          for (let item of property.amenitiesData) {
            amenitiesIds.push(item.id)
          }
          let amenities = await Amenities.find({ _id: { $in: amenitiesIds } }, { "amenitiesName": 1, "_id": 1 })
          property._doc.amenities = amenities
        }
        let stayTypeDetail = await Stay.find({ propertyId: property._id })
        property._doc.stayTypeDetail = stayTypeDetail
        for (let item of stayTypeDetail) {
          let food = await Foods.find({ _id: { $in: item.includedFood } }, { "foodName": 1, "_id": 1 })
          item._doc.includedFoodData = food
          let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: item.includedFacilitiesFree } }, { "facilitiesName": 1, "_id": 1 })
          item._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
          let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: item.includedFacilitiesPaid } }, { "facilitiesName": 1, "_id": 1 })
          item._doc.includedFacilitiesPaidData = includedFacilitiesPaidData

          let propertyImgs = await PropertyImg.find({ stayId: item._id })
          if (propertyImgs.length > 0) {
            item._doc.stayImages = propertyImgs
          }
        }

        let propertyImgs = await PropertyImg.find({ propertyId: property._id, stayId: null })
        if (propertyImgs.length > 0) {
          property._doc.propertyImgs = propertyImgs
        }

        const experience = await Experience.find({ propertyId: property._id })
        if (experience.length > 0) {
          for (let i of experience) {

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
            if (expImg.length > 0) {
              i._doc.image = expImg[0].expImgName
            }

          }
        }
        property._doc.experienceDetail = experience

        const currentDate = new Date();
        const events = await Event.find({ propertyId: property._id })
        if (events.length > 0) {
          for (let i of events) {

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
            if (expImg.length > 0) {
              i._doc.image = expImg[0].expImgName
            }
          }
        }
        property._doc.eventDetail = events
        //   let seasonData = await Season.find({ _id: { $in: property.seasonsId } },{"seasonName":1,"_id":1})
        //   property._doc.season = seasonData


        //   let terrain = await Terrain.find({ _id: { $in: property.terrainId } },{"terrainName":1,"_id":1})
        //   property._doc.terrain = terrain
        //   let amenitiesIds = []
        //   if(property.amenitiesData.length>0){
        //     for(let item of property.amenitiesData){
        //       amenitiesIds.push(item.id)
        //     }
        //     let amenities = await Amenities.find({ _id: { $in: amenitiesIds } },{"amenitiesName":1,"amenitiesImg":1, "_id":1})
        //     property._doc.amenities = amenities
        //   }
        //   let stayTypeDetail = await Stay.find({propertyId: property._id})
        //   property._doc.stayTypeDetail = stayTypeDetail
        //   for(let item of stayTypeDetail){
        //     let food = await Foods.find({ _id: { $in: item.includedFood } },{"foodName":1,"_id":1})
        //     item._doc.includedFoodData = food
        //     let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: item.includedFacilitiesFree } },{"facilitiesName":1,"_id":1})
        //     item._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
        //     let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: item.includedFacilitiesPaid } },{"facilitiesName":1,"_id":1})
        //     item._doc.includedFacilitiesPaidData = includedFacilitiesPaidData
        //   }
        //   let propertyImgs = await PropertyImg.find({propertyId: property._id})
        //   if(propertyImgs.length>0){
        //     for(let i  of propertyImgs){
        //       if(i.stayId){
        //          const stayDetail = await Stay.findById(i.stayId)
        //          i._doc.stayType = stayDetail.stayType
        //       }
        //     }
        //     property._doc.propertyImgs = propertyImgs
        //   }

        //   let addons = await Addons.find({propertyId: property._id})
        //   if(addons.length>0){
        //     property._doc.addons = addons
        //   } else{
        //     property._doc.addons = []
        //   }

        //   const experience = await Experience.find({propertyId: property._id})
        //   if(experience.length>0){
        //   for(let i of experience){

        //     i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        //     let host =  await User.findById(i.userId)
        //     const expType = await ExperienceType.findById(i.experienceTypeId)
        //     i._doc.experienceTypeName = expType?.experienceName || null
        //     i._doc.experienceTypeDescription = expType?.experienceDescription || null
        //     let advType = await AdventureType.findById(i.adventureTypeId)
        //     i._doc.adventureName = advType?.adventureName || null
        //     let duration = await DurationType.findById(i.durationTypeId)
        //     i._doc.durationName = duration?.durationName || null
        //     i._doc.hostName = host?.name || null
        //     let includeData = await ExpIncludes.find({ _id: { $in: i.includes } },{"includesName":1,"_id":1})
        //     i._doc.includesData = includeData
        //     let carryData = await ExpCarry.find({ _id: { $in: i.carry } },{"carryName":1,"_id":1})
        //     i._doc.carryData = carryData
        //     let expImg = await ExperienceImg.find({experinceId: i._id})
        //     i._doc.expImg = expImg
        //   }
        //   property._doc.experience = experience
        //   const conveyance = await Conveyance.find({propertyId: property._id})
        //   if(conveyance.length>0){
        //     for(let item of conveyance){
        //       let conveyancePackage = await Package.find({conveyanceId: item._id})
        //       item._doc.conveyancePackage = conveyancePackage
        //     }
        //     property._doc.conveyance = conveyance
        //   }
        // }
      }

      sendSuccessResponse(res, property, 'Data retrieved successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  addProperty: async (req, res, next) => {
    try {
      const property = new Property(req.body)
      property.save()
      sendSuccessResponse(res, property, 'Property added successfully');
    } catch (error) {
      next(error)
    }
  },

  checkExistPropertyAddress: async (req, res, next) => {
    try {
      const reqBody = req.body
      const isExistAddress = await Property.findOne({ 'propertyLocated.fullAddress': reqBody.fullAddress })
      if (isExistAddress) {
        // sendErrorResponse(res,'Address already exist', 'Address already exist', 400)
        throw createError.NotFound('Address already exist');
      } else {
        sendSuccessResponse(res, 'Address is not exist', 'Address is not exist', 200)
      }
    } catch (error) {
      next(error)
    }
  },
  updatePropertyById: async (req, res, next) => {
    try {
      await Property.findByIdAndUpdate(req.params.id, req.body)
      const propertyData = await Property.findById(req.params.id)
      if (propertyData.propertyStatus === 1) {
        await Stay.updateMany({ propertyId: propertyData._id }, { status: 1 })
        // await Experience.updateMany({propertyId: propertyData._id},{experience_status: 1})
        // await Event.updateMany({propertyId: propertyData._id}, {experience_status: 1})
      }
      sendSuccessResponse(res, propertyData, 'Property updated successfully');
    } catch (error) {
      next(error)
    }
  },
  addAmenities: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.amenitiesImg = `uploads/${path}`
      }
      const amenities = new Amenities(req.body)
      amenities.save()
      sendSuccessResponse(res, amenities, 'Amenities added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateAmenities: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.amenitiesImg = `uploads/${path}`
      }
      const amenities = await Amenities.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, amenities, 'Amenities update successfully');
    } catch (error) {
      next(error)
    }
  },

  amenitiesList: async (req, res, next) => {
    try {
      const amenities = await Amenities.find()
      sendSuccessResponse(res, amenities, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  addSeason: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.seasonImg = `uploads/${path}`
      }
      const season = new Season(req.body)
      season.save()
      sendSuccessResponse(res, season, 'Season added successfully');
    } catch (error) {
      next(error)
    }
  },


  updateSeason: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.seasonImg = `uploads/${path}`
      }
      const season = await Season.findByIdAndUpdate(req.body.id, req.body, { new: true })
      sendSuccessResponse(res, season, 'Season added successfully');
    } catch (error) {
      next(error)
    }
  },

  seasonList: async (req, res, next) => {
    try {
      const season = await Season.find()
      sendSuccessResponse(res, season, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },
  addTerrain: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.terrainImg = `uploads/${path}`
      }
      const terrain = new Terrain(req.body)
      terrain.save()
      sendSuccessResponse(res, terrain, 'Terrain added successfully');
    } catch (error) {
      next
    }
  },

  updateTerrain: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.terrainImg = `uploads/${path}`
      }
      const terrain = await Terrain.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, terrain, 'Terrain updated successfully');
    } catch (error) {
      next
    }
  },

  addPropertyFormList: async (req, res, next) => {
    try {
      const season = await Season.find()
      const terrain = await Terrain.find()
      const amenities = await Amenities.find()

      const result = {
        season: season,
        terrain: terrain,
        amenities: amenities
      }
      sendSuccessResponse(res, result, 'Property form list fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addPropCancellationPolicyMaster: async (req, res, next) => {
    try {
      const policy = new PropCancellationPolicy(req.body)
      await policy.save()
      sendSuccessResponse(res, policy, 'Cancellation policy added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateCancellationPolicy: async (req, res, next) => {
    try {
      const updatePolicy = await PropCancellationPolicy.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, updatePolicy, 'Cancellation policy updated successfully');
    } catch (error) {
      next(error)
    }
  },

  propCancellationPlocyMasterList: async (req, res, next) => {
    try {
      const propCancellationPlicy = await PropCancellationPolicy.find()
      sendSuccessResponse(res, propCancellationPlicy, 'Cancellation policy list fetched successfully');
    } catch (error) {
      next(error)
    }
  },
  addPropertyCampRules: async (req, res, next) => {
    try {
      const campRules = new PropertiesCampRules(req.body)
      await campRules.save()
      sendSuccessResponse(res, campRules, 'Camp rules added successfully');
    } catch (error) {
      next(error)
    }
  },

  propertyCampRulesList: async (req, res, next) => {
    try {
      const campRules = await PropertiesCampRules.findById(req.body.id)
      sendSuccessResponse(res, campRules, 'Camp rules list fetched successfully');
    } catch (error) {
      next(error)
    }
  },


  addPropertyCancellationPolicy: async (req, res, next) => {
    try {
      const policy = new PropertiesCancellationPolicy(req.body)
      await policy.save()
      sendSuccessResponse(res, policy, 'Cancellation policy added successfully');
    } catch (error) {
      next(error)
    }
  },


  uploadPropertyImg: async (req, res, next) => {
    try {
      let savedata = []
      if (req.files.length > 0) {
        let filesData = req.files
        for (let item of filesData) {
          const path = item.filename;
          req.body.propImgName = `uploads/${path}`
          const propertyImg = new PropertyImg(req.body)
          const save = await propertyImg.save()

          savedata.push(save)
        }
      }
      sendSuccessResponse(res, savedata, 'Property images uploaded successfully');
    } catch (error) {
      next(error)
    }
  },

  approveProperty: async (req, res, next) => {
    try {
      const property = await Property.findByIdAndUpdate(req.body.id, { propertyStatus: 2 })
      sendSuccessResponse(res, property, 'Property approved successfully');
    } catch (error) {
      next(error)
    }
  },

  addAddonType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.addonImg = `uploads/${path}`
      }
      const addon = new AddonsType(req.body)
      await addon.save()
      sendSuccessResponse(res, addon, 'Addon type added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateAddOnType: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.addonImg = `uploads/${path}`
      }
      const updateAddOnType = await AddonsType.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, updateAddOnType, 'Addon type updated successfully');
    } catch (error) {
      next(error)
    }
  },

  addonTypeList: async (req, res, next) => {
    try {
      const addonType = await AddonsType.find()
      sendSuccessResponse(res, addonType, 'Addon type list');
    } catch (error) {
      next(error)
    }
  },

  addAddon: async (req, res, next) => {
    try {
      const addon = new Addons(req.body)
      await addon.save()
      sendSuccessResponse(res, addon, 'Addon added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateAddonById: async (req, res, next) => {
    try {
      const addonTypes = await AddonsType.findById(req.body.addonTypeId)
      req.body.addonTypeName = addonTypes.addonName || null
      const update = await Addons.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, update, 'Addon updated')
    } catch (error) {
      next(error)
    }
  },

  addOnList: async (req, res, next) => {
    try {
      const result = await Addons.find({}).sort({ _id: "desc" });
      for (let i of result) {
        const property = await Property.findById(i.propertyId)
        console.log('property', property?.propertyName)
        i._doc.propertyName = property?.propertyName || null
        if(property){
          const host = await User.findById(property.userId)
          i._doc.hostName = host?.name || null
        }
      }
      sendSuccessResponse(res, result, 'Addons List')
    } catch (error) {
      next(error)
    }
  },


  terrainList: async (req, res, next) => {
    try {
      const terrain = await Terrain.find()
      sendSuccessResponse(res, terrain, 'Terrain list');
    } catch (error) {
      next(error)
    }
  },

  searchProperty: async (req, res, next) => {
    try {
      const reqBody = req.body    //// 1 = property, 2 = terrian, 3 = location
      let allSearchProperty
      const experienceList = []
      const eventList = []
      if (reqBody.property) {
        // const property = await Property.find({ 'propertyName': { $regex: reqBody.property, $options: 'i' } });
        const property = await Property.find({ 'propertyFullLocation': { $regex: reqBody.property, $options: 'i' } });

        let srNo = 1
        for (let i of property) {
          i._doc.srNo = srNo;
          srNo++;
          i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
          let host = await User.findById(i.userId)
          i._doc.hostName = host?.name || null
          const stayDetail = await Stay.find({ propertyId: i._id })
          i._doc.stayDetail = stayDetail
          const prices = []
          for (let stay of stayDetail) {
            prices.push({ price: stay.priceRegular, day: 'Regular' })
            prices.push({ price: stay.priceWeekend, day: 'Weekend' })
          }
          const highestPrice = Math.max(...prices.map(item => item.price));
          const lowestPrice = Math.min(...prices.map(item => item.price));

          i._doc.highestPrice = highestPrice
          i._doc.lowestPrice = lowestPrice
          const images = await PropertyImg.find({ propertyId: i._id, stayId: null })
          if (images.length > 0) {
            i._doc.propertyImage = images[0].propImgName
          }
        }
        allSearchProperty = property
      }
      if (reqBody.terrin) {
        const terrain = await Terrain.find({ 'terrainName': { $regex: reqBody.terrin, $options: 'i' } });
        const terrainIds = []
        if (terrain.length > 0) {
          for (let item of terrain) {
            let terrainId = item._id.toString();
            terrainIds.push(terrainId)

          }
        }
        let porppertyByTerrian = await Property.find({ terrainId: { $in: terrainIds } });
        allSearchProperty = porppertyByTerrian
      }
      if (reqBody.location) {
        console.log('in Location')
      }
      // const property = await Property.find({"propertyName": '/.*wow.*/'})
      // console.log('property', property)
      // const terrain = await Terrain.find({'terrainName': {'$regex': 'Plateu'}})

      // console.log('porppertyByTerrian', porppertyByTerrian)
      if (allSearchProperty?.length > 0) {
        for (let i of allSearchProperty) {
          let seasonData = await Season.find({ _id: { $in: i.seasonsId } }, { "seasonName": 1, "_id": 1 })
          i._doc.season = seasonData


          let terrain = await Terrain.find({ _id: { $in: i.terrainId } }, { "terrainName": 1, "_id": 1 })
          i._doc.terrain = terrain
          let amenitiesIds = []
          if (i.amenitiesData.length > 0) {
            for (let item of i.amenitiesData) {
              amenitiesIds.push(item.id)
            }
            let amenities = await Amenities.find({ _id: { $in: amenitiesIds } }, { "amenitiesName": 1, "amenitiesImg": 1, "_id": 1 })
            i._doc.amenities = amenities
          }
          let stayTypeDetail = await Stay.find({ propertyId: i._id })
          i._doc.stayTypeDetail = stayTypeDetail
          for (let item of stayTypeDetail) {
            let food = await Foods.find({ _id: { $in: item.includedFood } }, { "foodName": 1, "_id": 1 })
            item._doc.includedFoodData = food
            let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: item.includedFacilitiesFree } }, { "facilitiesName": 1, "_id": 1 })
            item._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
            let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: item.includedFacilitiesPaid } }, { "facilitiesName": 1, "_id": 1 })
            item._doc.includedFacilitiesPaidData = includedFacilitiesPaidData
          }
          let propertyImgs = await PropertyImg.find({ propertyId: i._id })
          if (propertyImgs.length > 0) {
            for (let i of propertyImgs) {
              if (i.stayId) {
                const stayDetail = await Stay.findById(i.stayId)
                i._doc.stayType = stayDetail.stayType
              }
            }
            i._doc.propertyImgs = propertyImgs
          }

          let addons = await Addons.find({ propertyId: i._id })
          if (addons.length > 0) {
            i._doc.addons = addons
          } else {
            i._doc.addons = []
          }

          const experience = await Experience.find({ propertyId: i._id })

          if (experience.length > 0) {
            for (let i of experience) {

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

              experienceList.push(i)
            }
          } else {
            i._doc.experience = []
          }
          i._doc.experience = experience


          const events = await Event.find({ propertyId: i._id })
          if (events.length > 0) {
            for (let i of events) {

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
              eventList.push(i)
            }
          }
          i._doc.events = events
          const conveyance = await Conveyance.find({ propertyId: i._id })
          if (conveyance.length > 0) {
            for (let item of conveyance) {
              let conveyancePackage = await Package.find({ conveyanceId: item._id })
              item._doc.conveyancePackage = conveyancePackage
            }
            i._doc.conveyance = conveyance
          }

        }
      }
      let ddd = []
      const result = {
        allSearchProperty,
        experienceList,
        eventList

      }
      sendSuccessResponse(res, allSearchProperty?.length > 0 ? result : ddd, 'Property list');
    } catch (error) {
      next(error)
    }
  },

  propertyDetailById: async (req, res, next) => {
    try {
      // const hostList = await Property.find({_id: req.body.hostId})
      const property = await Property.findById(req.body.id)
      if (property) {

        let seasonData = await Season.find({ _id: { $in: property.seasonsId } })
        property._doc.season = seasonData

        let campRules = await PropertiesCampRules.findById(property.campRulesId)
        property._doc.campRules = campRules

        let cancellationPolicy = await PropertiesCancellationPolicy.findById(property.cancellationPolicyId)
        property._doc.cancellationPolicy = cancellationPolicy
        let terrain = await Terrain.find({ _id: { $in: property.terrainId } }, { "terrainName": 1, "_id": 1 })
        property._doc.terrain = terrain
        let amenitiesIds = []
        if (property.amenitiesData.length > 0) {
          for (let item of property.amenitiesData) {
            amenitiesIds.push(item.id)
          }
          let amenities = await Amenities.find({ _id: { $in: amenitiesIds } }, { "amenitiesName": 1, "amenitiesImg": 1, "_id": 1 })
          property._doc.amenities = amenities
        }
        let stayTypeDetail = await Stay.find({ propertyId: property._id })
        property._doc.stayTypeDetail = stayTypeDetail
        const stayImages = []
        const allImages = []
        for (let item of stayTypeDetail) {
          let stayTypeData = await StayType.findById(item.stayTypeId)
          item._doc.stayTypeData = stayTypeData
          let food = await Foods.find({ _id: { $in: item.includedFood } }, { "foodName": 1, "_id": 1 })
          item._doc.includedFoodData = food
          let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: item.includedFacilitiesFree } }, { "facilitiesName": 1, "_id": 1 })
          item._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
          let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: item.includedFacilitiesPaid } }, { "facilitiesName": 1, "_id": 1 })
          item._doc.includedFacilitiesPaidData = includedFacilitiesPaidData
          let stayImgs = await PropertyImg.find({ stayId: item._id })
          if (stayImgs.length > 0) {
            for (let i of stayImgs) {
              if (i.stayId) {
                const stayDetail = await Stay.findById(i.stayId)
                i._doc.stayType = stayDetail.stayType
              }
              item._doc.stayImg = i.propImgName
              allImages.push(i)
            }
            item._doc.stayImages = stayImgs
            stayImages.push(stayImgs)
          }
        }
        property._doc.stayImages = stayImages

        let propertyImgs = await PropertyImg.find({ propertyId: property._id, stayId: null })
        if (propertyImgs.length > 0) {
          for (let i of propertyImgs) {
            if (i.stayId) {
              const stayDetail = await Stay.findById(i.stayId)
              i._doc.stayType = stayDetail.stayType
            }
            allImages.push(i)
          }
          property._doc.propertyImgs = propertyImgs
        }
        property._doc.allImages = allImages



        let addons = await Addons.find({ propertyId: property._id })
        if (addons.length > 0) {
          property._doc.addons = addons
        } else {
          property._doc.addons = []
        }

        const experience = await Experience.find({ propertyId: property._id, experience_status: 1 })
        if (experience.length > 0) {
          for (let i of experience) {

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
            if (expImg.length > 0) {
              i._doc.image = expImg[0].expImgName
            }

          }
        }
        property._doc.experience = experience

        const currentDate = new Date();
        const events = await Event.find({ propertyId: property._id, startDate: { $gte: currentDate }, experience_status: 1 })
        if (events.length > 0) {
          for (let i of events) {

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
            if (expImg.length > 0) {
              i._doc.image = expImg[0].expImgName
            }
          }
        }
        property._doc.events = events
        const conveyance = await Conveyance.find({ propertyId: property._id })
        if (conveyance.length > 0) {
          for (let item of conveyance) {
            let conveyancePackage = await Package.find({ conveyanceId: item._id })
            item._doc.conveyancePackage = conveyancePackage
          }
          property._doc.conveyance = conveyance
        }

        const hostDetail = await User.findById(property.userId, { "_id": 1, "name": 1, "mobileNo": 1, "email": 1, "memberSince": 1, "userDesc": 1, "languages": 1, "replyRate": 1, "profilePhoto": 1 })
        property._doc.hostDetail = hostDetail
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

      sendSuccessResponse(res, property, 'Data retrieved successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  propertyListName: async (req, res, next) => {
    try {
      const propertyNames = await Property.find({ status: 1 }, { "_id": 1, "propertyName": 1 })
      sendSuccessResponse(res, propertyNames, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  propertyImageDeleteById: async (req, res, next) => {
    try {
      const reqBody = req.body
      const propertyImg = await PropertyImg.findByIdAndDelete(reqBody.id)
      sendSuccessResponse(res, propertyImg, 'Image Deleted Successfully');
    } catch (error) {
      next(error)
    }
  },

  addNearBy: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.media = `uploads/${path}`
      }
      const reqBody = req.body
      const nearBy = new NearBy(reqBody)
      await nearBy.save()
      sendSuccessResponse(res, nearBy, 'NearBy Added Successfully');
    } catch (error) {
      console.log('err', error)
      next(error)
    }
  },

  updateNearBy: async (req, res, next) => {
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.media = `uploads/${path}`
      }
      const reqBody = req.body
      const nearBy = await NearBy.findByIdAndUpdate(reqBody.id, reqBody, { new: true })
      sendSuccessResponse(res, nearBy, 'NearBy Updated Successfully');
    } catch (error) {
      next(error)
    }
  },

  nearByList: async (req, res, next) => {
    try {
      const nearBy = await NearBy.find({})
      sendSuccessResponse(res, nearBy, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  searchPropertyByNearBy: async (req, res, next) => {
    try {
      const reqBody = req.body
      const property = await Property.find({ 'propertyFullLocation': { $regex: reqBody.district, $options: 'i' } });

      let srNo = 1
      for (let i of property) {
        // console.log('i._doc._id', i._id)
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.date).format('DD-MM-YYYY');
        let host = await User.findById(i.userId)
        i._doc.hostName = host?.name || null
        const stayDetail = await Stay.find({ propertyId: i._id })
        i._doc.stayDetail = stayDetail
        const prices = []
        for (let stay of stayDetail) {
          prices.push({ price: stay.priceRegular, day: 'Regular' })
          prices.push({ price: stay.priceWeekend, day: 'Weekend' })
        }
        const highestPrice = Math.max(...prices.map(item => item.price));
        const lowestPrice = Math.min(...prices.map(item => item.price));

        i._doc.highestPrice = highestPrice
        i._doc.lowestPrice = lowestPrice
        const images = await PropertyImg.find({ propertyId: i._id, stayId: null })
        if (images.length > 0) {
          i._doc.propertyImage = images[0].propImgName
        }
      }
      sendSuccessResponse(res, { linkProperty: property.length, property: property }, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },
  addLanguages: async (req, res, next) => {
    try {
      const reqBody = req.body
      const doesExist = await Languages.findOne({ language: reqBody.language })
      if (doesExist) {
        throw createError.Conflict(`${reqBody.language} is already registered`);
      }
      const lang = new Languages(reqBody)
      await lang.save()
      sendSuccessResponse(res, lang, 'Data saved successfully')

    } catch (error) {
      next(error)
    }
  },
  updateLanguage: async (req, res, next) => {
    try {
      const lang = await Languages.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, lang, 'Data updated successfully')
    } catch (error) {
      next(error)
    }
  },

  languagesList: async (req, res, next) => {
    try {
      const lang = await Languages.find({})
      sendSuccessResponse(res, lang, 'Data retrieved successfully')
    } catch (error) {
      next(error)
    }
  },

  uniqueStaysList: async (req, res, next) => {
    try {
      let stayTypeDetail;
      if (req.body.stayTypeId === 'all') {
        stayTypeDetail = await Stay.find({}).sort({ createdAt: -1 }).limit(24)
      } else {
        stayTypeDetail = await Stay.find({ stayTypeId: req.body.stayTypeId }).sort({ createdAt: -1 }).limit(24)
      }

      const allImages = []
      for (let item of stayTypeDetail) {
        let stayTypeData = await StayType.findById(item.stayTypeId)
        item._doc.stayTypeData = stayTypeData
        let food = await Foods.find({ _id: { $in: item.includedFood } }, { "foodName": 1, "_id": 1 })
        item._doc.includedFoodData = food
        let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: item.includedFacilitiesFree } }, { "facilitiesName": 1, "_id": 1 })
        item._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
        let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: item.includedFacilitiesPaid } }, { "facilitiesName": 1, "_id": 1 })
        item._doc.includedFacilitiesPaidData = includedFacilitiesPaidData
        let stayImgs = await PropertyImg.find({ stayId: item._id })
        if (stayImgs.length > 0) {
          for (let i of stayImgs) {
            if (i.stayId) {
              const stayDetail = await Stay.findById(i.stayId)
              i._doc.stayType = stayDetail.stayType
            }
            item._doc.stayImg = i.propImgName
            allImages.push(i)
          }
          item._doc.stayImages = stayImgs
        }
        const propertyDetail = await Property.findById(item?.propertyId)
        item._doc.propertyLocated = propertyDetail?.propertyLocated
        item._doc.propertyName = propertyDetail?.propertyName
      }
      sendSuccessResponse(res, stayTypeDetail, 'Data retrieved successfully')
    } catch (error) {
      next(error)
    }
  },

  claimProperty: async (req, res, next) => {
    try {
      const reqBody = req.body
      const saveClaim = new ClaimProperty(reqBody)
      await saveClaim.save()
      sendSuccessResponse(res, saveClaim, 'Data saved successfully')
    } catch (error) {
      next(error)
    }
  },

  propertyWithStayList: async (req, res, next) => {
    try {
      const property = await Property.find({ propertyStatus: 1 }, { "propertyName": 1, "_id": 1 }).sort('createdAt')
      for (let i of property) {
        const stay = await Stay.find({ propertyId: i._id.toString() }, { "stayType": 1, "_id": 1 })
        i._doc.stays = stay
      }
      sendSuccessResponse(res, property, 'Data retrieved successfully')
    } catch (error) {
      next(error)
    }
  },

  getPropertyExpEventByHost: async (req, res, next) => {
    try {
      const reqBody = req.body
      const property = await Property.find({ userId: reqBody.hostId })
      const experience = await Experience.find({ userId: reqBody.hostId })
      const event = await Event.find({ userId: reqBody.hostId })
      sendSuccessResponse(res, { property, experience, event }, 'Data retrieved successfully')
    } catch (error) {
      next(error)
    }
  },

  addPackingList: async (req, res, next) => {
    try {
      const packingList = new PackingList(req.body)
      await packingList.save()
      sendSuccessResponse(res, packingList, 'Packing List Added Successfullly')
    } catch (error) {
      next(error)
    }
  },

  packingList: async (req, res, next) => {
    try {
      const result = await PackingList.find()
      sendSuccessResponse(res, result, 'Packing List Retrieved Successfully')
    } catch (error) {
      next(error)
    }
  },

  updatePackingList: async (req, res, next) => {
    try {
      const packingList = await PackingList.findByIdAndUpdate(req.body.id, req.body, { new: true })
      sendSuccessResponse(res, packingList, 'Packing List Updated Successfully')
    } catch (error) {
      next(error)
    }
  }

}



export default PropertyController;
