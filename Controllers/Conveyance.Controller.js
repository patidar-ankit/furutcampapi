import createError from 'http-errors';
import User from '../Models/User.model.js';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import moment from 'moment';
import Conveyance from '../Models/Conveyance.model.js';
import ConveyanceType from '../Models/ConveyanceType.model.js';
import ConveyancePackage from '../Models/ConveyancePackage.model.js';
import Package from '../Models/Package.model.js';
import ConveyanceImg from '../Models/ConveyanceImg.model.js';
const ConveyanceController = {

  addConveyanceType: async(req, res, next)=>{
    try {
      if(req.file){
        const path = req.file.filename;
        req.body.conveyanceTypeImg = `uploads/${path}`
    }
      const conveyance = new ConveyanceType(req.body)
      await conveyance.save()
      sendSuccessResponse(res, conveyance, 'Conveyance type added successfully')
    } catch (error) {
      next(error)
    }
  },

  conveyanceTypeList: async(req, res, next)=>{
    try {
      const convType = await ConveyanceType.find()
      sendSuccessResponse(res, convType, 'Conveyance type list fetched successfully')
    } catch (error) {
      next(error)
    }
  },

  addConPackage: async(req, res, next)=>{
    try {
      if(req.file){
        const path = req.file.filename;
        req.body.packageImg = `uploads/${path}`
    }
      const addConvPackage = new ConveyancePackage(req.body)
      await addConvPackage.save()
      sendSuccessResponse(res, addConvPackage, 'Conveyance package added successfully')
    } catch (error) {
      next(error)
    }
  },

  convPackageList: async(req, res, next)=>{
    try {
      const convPackageList = await ConveyancePackage.find()
      sendSuccessResponse(res, convPackageList, 'Conveyance package list fetched successfully')
    } catch (error) {
      next(error)
    }
  },

  addConveyance: async(req, res, next)=>{
    try {
      const addConv = new Conveyance(req.body)
      await addConv.save()
      sendSuccessResponse(res, addConv, 'Conveyance added successfully')
    } catch (error) {
      next(error)
    }
  },

  updateConveynanceById: async(req, res, next)=>{
    try {
      console.log('req.param', req.params.id)
      await Conveyance.findByIdAndUpdate(req.params.id, req.body)
      const conv = await Conveyance.findById(req.params.id)
      sendSuccessResponse(res, conv, 'Conveyance updated successfully');
    } catch (error) {
      next(error)
    }
  },

  addPackage: async(req, res, next)=>{
    try {
      const addPackage = new Package(req.body)
      await addPackage.save()
      sendSuccessResponse(res, addPackage, 'Package added successfully')
    } catch (error) {
      next(error)
    }
  },

  uploadConvImg: async(req, res, next)=>{
    try {
     let savedata = []
      if(req.files.length>0){
        let filesData = req.files
        for(let item of filesData){
          const path = item.filename;
          req.body.convImgName = `uploads/${path}`
          const convImg = new ConveyanceImg(req.body)
          const save = await convImg.save()
          savedata.push(save)
        }
      }
      sendSuccessResponse(res, savedata, 'Conveyance images uploaded successfully');
    } catch (error) {
      next(error)
    }
  },

  conveyanceListByHost: async(req, res, next)=>{
    try {
      const conv = await Conveyance.find({userId: req.body.userId})
      if(conv.length>0){
        for(let item of conv){
          console.log('item', item)
          const convImg = await ConveyanceImg.find({conveyanceId: item._id})
          item._doc.convImg = convImg
          const convPackage = await Package.find({conveyanceId: item._id})
          item._doc.convPackage = convPackage
        }
      }
      sendSuccessResponse(res, conv, 'Conveyance list by host');
    } catch (error) {
      next(error)
    }
  },

  publishedConveyanceList: async(req, res, next)=>{
    try {
      const convList = await Conveyance.find({conveyanceStatus: 1})
      let srNo = 1
      if(convList.length>0){
        for(let item of convList){
          item._doc.srNo = srNo;
          srNo++;
          item._doc.createdAt = moment(item.createdAt).format('DD-MM-YYYY');
          let host =  await User.findById(item.userId)
          item._doc.hostName = host?.name || null
          const convImg = await ConveyanceImg.find({conveyanceId: item._id})
          item._doc.convImg = convImg
          const convPackage = await Package.find({conveyanceId: item._id})
          item._doc.convPackage = convPackage
        }
      }
      sendSuccessResponse(res, convList, 'Published conveyance list')
    } catch (error) {
      next(error)
    }
  },
  activeConveyanceList: async(req, res, next)=>{
    try {
      let srNo = 1
      const convList = await Conveyance.find({conveyanceStatus: 2})
      if(convList.length>0){
        for(let item of convList){
          item._doc.srNo = srNo;
          srNo++;
          item._doc.createdAt = moment(item.createdAt).format('DD-MM-YYYY');
          let host =  await User.findById(item.userId)
          item._doc.hostName = host?.name || null
          const convImg = await ConveyanceImg.find({conveyanceId: item._id})
          item._doc.convImg = convImg
          const convPackage = await Package.find({conveyanceId: item._id})
          item._doc.convPackage = convPackage
        }
      }
      sendSuccessResponse(res, convList, 'Active conveyance list')
    } catch (error) {
      next(error)
    }
  },

  approveConveyance: async(req, res, next)=>{
    try {
      const conveyance = await Conveyance.findByIdAndUpdate(req.body.id, {conveyanceStatus: 2})
      sendSuccessResponse(res, conveyance, 'Conveyance approved successfully');
    } catch (error) {
      next(error)
    }
  }

}


export default ConveyanceController;
