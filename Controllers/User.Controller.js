import createError from 'http-errors';
import User from '../Models/User.model.js';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import Property from '../Models/Property.model.js';
import moment from 'moment';
const UserController = {

  hostList: async(req, res, next)=>{
    try {
      const hostList = await User.find({userType: 2})
      let srNo = 1;
      for(let item of hostList) {
        item._doc.srNo = srNo;
        srNo++;
        item._doc.createdAt = moment(item.date).format('DD-MM-YYYY');
        // console.log('item', item)
        let property = await Property.find({hostId: item._id})
        // console.log('property', property)
      }
      sendSuccessResponse(res, hostList, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  }
}


export default UserController;
