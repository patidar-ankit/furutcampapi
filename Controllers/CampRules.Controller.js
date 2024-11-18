import createError from 'http-errors';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import CampRules from '../Models/CampRules.model.js';

const CampRuleController = {
  addCampRulesMaster: async(req, res, next)=>{
    try {
      const campRules = new CampRules(req.body)
      const save = await campRules.save()
      sendSuccessResponse(res, save, 'Camp rules added successfully');
    } catch (error) {
      next(error)
    }
  },

  updateRulesById: async(req, res, next)=>{
    try {
      const updateRules = await CampRules.findByIdAndUpdate(req.body.id, req.body)
      sendSuccessResponse(res, updateRules, 'Rules updated successfully')
    } catch (error) {
      next(error)
    }
  },

  campRulesList: async(req, res, next)=>{
    try {
      const campRuleList = await CampRules.find()
      sendSuccessResponse(res, campRuleList, 'Camp rules list fetched successfully');
    } catch (error) {
      next(error)
    }
  }
}


export default CampRuleController;


