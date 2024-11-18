import createError from 'http-errors';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import StayType from '../Models/StayType.model.js';
import Stay from '../Models/Stay.model.js';
import Foods from '../Models/Food.model.js';
import Facilities from '../Models/Facilities.model.js';
import StayInventory from '../Models/StayInventory.model.js';
import moment from 'moment';
import PropertyImg from '../Models/PropertyImg.model.js';
import Property from '../Models/Property.model.js';

const StayTypeController = {
  addStayType: async(req, res, next)=>{
    try {
      if(req.file){
        const path = req.file.filename;
        req.body.stayImg = `uploads/${path}`
    }
      const stayType  = new StayType(req.body)
      await stayType.save()
      sendSuccessResponse(res, stayType, 'Stay Type added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateStayType: async(req, res, next)=>{
    try {
      if(req.file){
        const path = req.file.filename;
        req.body.stayImg = `uploads/${path}`
    }
      const stayType  = await StayType.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, stayType, 'Stay Type updated successfully');
    } catch (error) {
      next(error)
    }
  },

  stayTypeList: async(req, res, next)=>{
    try {
      const stayType = await StayType.find()
      sendSuccessResponse(res, stayType, 'Stay Type fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addStayDetail: async(req, res, next)=>{
    try {
      const addStay = new Stay(req.body)
      const stayDetail = await addStay.save()
      sendSuccessResponse(res, stayDetail, 'Stay Detail added succefully')
    } catch (error) {
      next(error)
    }
  },

  stayDeailList: async(req, res, next)=>{
    try {
      const stayDetail = await Stay.find()
      for(let i of stayDetail){
        let stayType = await StayType.findById(i.stayTypeId)
        i._doc.stayTypeName = stayType?.stayType
        if(i.propertyId){

          const propertyDetail = await Property.findById(i.propertyId)
          i._doc.propertyName = propertyDetail?.propertyName
        }
      }
      sendSuccessResponse(res, stayDetail, 'Stay Detail fetched successfully')
    } catch (error) {
      next(error)
    }
  },

  updateStayDeailById: async(req, res, next)=>{
    try {
      const stayDetail = await Stay.findByIdAndUpdate(req.params.id, req.body, {new: true})
      sendSuccessResponse(res, stayDetail, 'Stay Detail updated successfully')
    } catch (error) {
      next(error)
    }
  },

  updateStayById: async(req, res, next)=>{
    try {
        const update = await Stay.findByIdAndUpdate(req.body.id, req.body)
        sendSuccessResponse(res, update, 'Stay Detail updated successfully')
    } catch (error) {
      next(error)
    }
  },
  deletStayDetailById: async(req, res, next)=>{
    try {
      const stayDetailDelete =await Stay.findByIdAndDelete(req.body.id)
      sendSuccessResponse(res, stayDetailDelete, 'Stay Detail deleted successfully')
      
    } catch (error) {
      next(error)
    }
  },

  stayDetailById: async(req, res, next)=>{
    try {
      const stayDetail = await Stay.findById(req.body.id)
      if(stayDetail?._id){
        let stayType = await StayType.findById(stayDetail.stayTypeId)
        stayDetail._doc.stayTypeImg = stayType?.stayImg || null
        let food = await Foods.find({ _id: { $in: stayDetail.includedFood } })
        stayDetail._doc.includedFoodData = food
        let includedFacilitiesFreeData = await Facilities.find({ _id: { $in: stayDetail.includedFacilitiesFree } },{"facilitiesName":1,"_id":1})
        stayDetail._doc.includedFacilitiesFreeData = includedFacilitiesFreeData
        let includedFacilitiesPaidData = await Facilities.find({ _id: { $in: stayDetail.includedFacilitiesPaid } },{"facilitiesName":1,"_id":1})
        stayDetail._doc.includedFacilitiesPaidData = includedFacilitiesPaidData
        const stayInventory = await StayInventory.find({stayId: stayDetail._id})
        const bookedDates = []
        if(stayInventory.length>0){
          for(let item of stayInventory){
            let availableCapacity = item.capacity - item.booked 
            if(Number(availableCapacity)===0){
              // let obj = {
              //   bookingDate: moment(item.date).format('YYYY-MM-DD'),
              //   availableCapacity: availableCapacity,
              // }
              let bookedDate = moment(item.date).format('YYYY-MM-DD')
              bookedDates.push(bookedDate)
            }

          }
        }
        stayDetail._doc.bookedDates = bookedDates
        const stayImages = await PropertyImg.find({stayId: stayDetail._id})
        if(stayImages.length>0){

          stayDetail._doc.stayImages = stayImages
        }
      }
      sendSuccessResponse(res, stayDetail, 'Stay Detail fetched successfully')
    } catch (error) {
      console.log('eer', error)
      next(error)
    }
  },

  addFood: async(req, res, next)=>{
    try {
      const food = new Foods(req.body)
      await food.save()
      sendSuccessResponse(res, food, 'Food added successfully')
    } catch (error) {
      next(error)
    }
  },
  updateFood: async(req, res, next)=>{
    try {
        const updateFood = await Foods.findByIdAndUpdate(req.body.id, req.body)
        sendSuccessResponse(res, updateFood, 'Food updated successfully')
    } catch (error) {
      next(error)
    }
  },
  deleteFoodById: async(req, res, next)=>{
    try {
      const  deleteFood = await Foods.findByIdAndDelete(req.params.id)
      sendSuccessResponse(res, deleteFood, 'Food deleted successfully')
    } catch (error) {
      next(error)
    }
  },
  foodList: async(req, res, next)=>{
    try {
      const food = await Foods.find()
      sendSuccessResponse(res, food, 'Food fetched successfully')
    } catch (error) {
      next(error)
    }
  },

  addFacilities: async(req, res, next)=>{
    try {
      const facilities = new Facilities(req.body)
      await facilities.save()
      sendSuccessResponse(res, facilities, 'Facilities added successfully')
    } catch (error) {
      next(error)
    }
  },

  facilitiesList: async(req, res, next)=>{
    try {
      const facilities = await Facilities.find()
      sendSuccessResponse(res, facilities, 'Facilities fetched successfully')
    } catch (error) {
      next(error)
    }
  }


}


export default StayTypeController;


