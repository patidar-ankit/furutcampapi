import createError from 'http-errors';
import User from '../Models/User.model.js';
import UserToken from '../Models/UserToken.model.js';
import { authSchema, emailSchema, hostLoginByMobileSchema, idSchema, loginSchema, otpVerificationSchema, registerHostSchema, updatePasswordSchema } from '../helpers/validation_schema.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../helpers/jwt_helper.js';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import { generateOTP } from '../helpers/generate_otp.js';
import bcrypt from 'bcrypt';
import Languages from '../Models/Language.model.js';
import GuestUser from '../Models/GuesUser.model.js';
import moment from 'moment';
import { decryptData } from '../helpers/common_helpers.js';
import { sendOTP } from '../helpers/otp_send_helper.js';
const AuthController = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      const doesExist = await User.findOne({ mobileNo: result.mobileNo });
      if (doesExist) {
        throw createError.Conflict(`${result.mobileNo} is already registered`);
      }

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      const doesExistUserToken = await UserToken.findOne({ userId: savedUser.id });
      if (doesExistUserToken) await doesExistUserToken.remove();

      await new UserToken({ userId: savedUser.id, token: refreshToken }).save();

      res.json({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const reqBody = await decryptData(req.body.data);
      const result = await loginSchema.validateAsync(reqBody);
      const user = await User.findOne({ email: result.email });

      if (!user) {
        throw createError.NotFound('User not registered');
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) {
        throw createError.Unauthorized('Username/password not valid');
      }
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      
      const doesExistUserToken = await UserToken.findOne({ userId: user._id });
      if (doesExistUserToken) await doesExistUserToken.remove();
      
      await new UserToken({ userId: user._id, token: refreshToken }).save();
      
      const userDetail = await User.findOne({ email: result.email }, { "password": 0 });
      res.json({ accessToken, user:userDetail });
    } catch (error) {
      if (error.isJoi === true) {
        return next(createError.BadRequest('Invalid Username/Password'));
      }
      console.log('error', error)
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);

      res.json({ accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }

      const userId = await verifyRefreshToken(refreshToken);
      const userToken = await UserToken.findOne({ token: req.body.refreshToken });

      if (!userToken) {
        return res.sendStatus(204);
      }

      await userToken.remove();
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  hostLoginByMobile: async (req, res, next) => {
    try {
      const { error, value } = hostLoginByMobileSchema.validate(req.body);

      if (error) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      const user = await User.findOne({ mobileNo: value.mobileNo });
      let otp = generateOTP()
      if (!user) {
        // throw createError.NotFound('User not registered');
        // return sendErrorResponse(res, {otp: otp}, 'User not registered', 404);
        sendSuccessResponse(res, { otp: otp }, 'OTP successfully sent to your registered mobile number.');
      } else {
        user.otp = otp
        let result = {
          _id: user.id,
          otp: otp
        }
        await User.findByIdAndUpdate(user.id, { otp: otp, otpVerification: false })
        await sendOTP(value.mobileNo, otp)
        sendSuccessResponse(res, result, 'OTP successfully sent to your registered mobile number.');
      }
    } catch (error) {
      next(error)
    }
  },

  registerHost: async (req, res, next) => {
    try {
      const { error, value } = registerHostSchema.validate(req.body);

      if (error) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      const doesExist = await User.findOne({ mobileNo: value.mobileNo });
      if (doesExist) {
        throw createError.Conflict(`${value.mobileNo} is already registered`);
      }

      const doesEmailExist = await User.findOne({ email: value.email });
      if (doesEmailExist) {
        throw createError.Conflict(`${value.email} is already registered`);
      }
      value.otp = generateOTP()
      value.userType = 2
      value.password = '123456'
      const user = new User(value);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      const doesExistUserToken = await UserToken.findOne({ userId: savedUser.id });
      if (doesExistUserToken) await doesExistUserToken.remove();

      await new UserToken({ userId: savedUser.id, token: refreshToken }).save();
      const result = {
        user: savedUser,
        auth: {
          accessToken,
          refreshToken
        }
      }
      sendSuccessResponse(res, result, 'Host Register successfully');
    } catch (error) {
      next(error)
    }
  },

  verifyOTP: async (req, res, next) => {
    try {
      const reqBody = await otpVerificationSchema.validateAsync(req.body)

      const user = await User.findById(reqBody.id)
      if (!user) {
        // throw createError.NotFound('User not registered');
        return sendErrorResponse(res, '', 'Invalid User/OTP.', 404);
      }
      if (user.otp === reqBody.otp) {
        await User.findByIdAndUpdate(user.id, { otpVerification: true })
        let userData = await User.findById(reqBody.id)
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        const doesExistUserToken = await UserToken.findOne({ userId: userData.id });
        if (doesExistUserToken) await doesExistUserToken.remove();

        await new UserToken({ userId: userData.id, token: refreshToken }).save();
        const result = {
          user,
          auth: {
            accessToken,
            refreshToken
          }
        }
        sendSuccessResponse(res, result, 'Otp verify successfully');
      } else {
        return sendErrorResponse(res, '', 'Invalid User/OTP.', 404);
      }
    } catch (error) {
      if (error.isJoi === true) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      next(error)
    }
  },

  resentOTP: async (req, res, next) => {
    try {
      const reqBody = await hostLoginByMobileSchema.validateAsync(req.body)
      const user = await User.findOne({ mobileNo: reqBody.mobileNo });
      let otp = generateOTP()
      let result;
      if (!user) {
        // throw createError.NotFound('User not registered');
        result = {
          otp: otp,
          mobileNo: reqBody.mobileNo
        }
        // return sendErrorResponse(res, result, 'Invalid mobile number', 404);
      }else{
        result = {
            _id: user.id,
            otp: otp
          }
          await User.findByIdAndUpdate(user.id, { otp: otp, otpVerification: false })
      }
      // if(user){
      //  result = {
      //   _id: user.id,
      //   otp: otp
      // }}
      sendSuccessResponse(res, result, 'OTP successfully sent to your registered mobile number.');
      await sendOTP(reqBody.mobileNo, otp)
    } catch (error) {
      if (error.isJoi === true) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      next(error)
    }
  },

  hostLoginByEmail: async (req, res, next) => {
    try {
      const reqBody = await emailSchema.validateAsync(req.body)
      const user = await User.findOne({ email: reqBody.email });
      if (!user) {
        // throw createError.NotFound('User not registered');
        return sendErrorResponse(res, '', 'User not registered', 404);
      }
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      const doesExistUserToken = await UserToken.findOne({ userId: user.id });
      if (doesExistUserToken) await doesExistUserToken.remove();

      await new UserToken({ userId: user.id, token: refreshToken }).save();
      const result = {
        user,
        auth: {
          accessToken,
          refreshToken
        }
      }
      sendSuccessResponse(res, result, 'Data retrieved successfully');
    } catch (error) {
      if (error.isJoi === true) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      next(error)
    }
  },

  hostList: async (req, res, next) => {
    try {
      const hostList = await User.find({ userType: 2 })
      sendSuccessResponse(res, hostList, 'Data retrieved successfully');
    } catch (error) {
      next(error)
    }
  },

  updatePassword: async (req, res, next) => {
    try {
      const reqBody = await updatePasswordSchema.validateAsync(req.body)
      const user = await User.findOne({ email: reqBody.email })
      if (!user) {
        return sendErrorResponse(res, '', 'Invalid credentials. Please try again.', 404);
      }

      const isMatch = await user.isValidPassword(reqBody.old_password);
      if (!isMatch) {
        return sendErrorResponse(res, '', 'Please enter valid old password.', 404);
      }
      // const salt = await bcrypt.genSalt(10)
      // const hashedPassword = await bcrypt.hash(reqBody.new_password, salt)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(reqBody.new_password, salt);
      let password = hashedPassword;
      // const hashedPassword = await hashPassword(user.password);
      let userUpdate = await User.findByIdAndUpdate(user._id, { password })
      sendSuccessResponse(res, userUpdate, 'Password updated successfully');
    } catch (error) {
      next(error)
    }
  },

  sendOTP: async (req, res, next) => {
    try {
      const reqBody = await hostLoginByMobileSchema.validateAsync(req.body)
      let otp = generateOTP()

      const result = {
        otp: otp,
        mobileNo: reqBody.mobileNo
      }
      await sendOTP(reqBody.mobileNo, otp)
      sendSuccessResponse(res, result, 'OTP successfully sent to your registered mobile number.');
    } catch (error) {
      if (error.isJoi === true) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      next(error)
    }
  },

  userLoginByMobile: async (req, res, next) => {
    try {
      const { error, value } = hostLoginByMobileSchema.validate(req.body);

      if (error) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      const user = await User.findOne({ mobileNo: value.mobileNo, userType: 3 });
      let otp = generateOTP()
      if (!user) {
        // throw createError.NotFound('User not registered');
        // return sendErrorResponse(res, {otp: otp}, 'User not registered', 404);
        sendSuccessResponse(res, { otp: otp }, 'OTP successfully sent to your registered mobile number.');
      } else {
        user.otp = otp
        let result = {
          _id: user.id,
          otp: otp
        }
        await User.findByIdAndUpdate(user.id, { otp: otp, otpVerification: false })
        await sendOTP(value.mobileNo, otp)
        sendSuccessResponse(res, result, 'OTP successfully sent to your registered mobile number.');
      }
    } catch (error) {
      next(error)
    }
  },

  userLoginByEmail: async (req, res, next) => {
    try {
      const reqBody = await emailSchema.validateAsync(req.body)
      const user = await User.findOne({ email: reqBody.email, userType: 3 });
      if (!user) {
        // throw createError.NotFound('User not registered');
        return sendErrorResponse(res, '', 'User not registered', 404);
      }
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      const doesExistUserToken = await UserToken.findOne({ userId: user.id });
      if (doesExistUserToken) await doesExistUserToken.remove();

      await new UserToken({ userId: user.id, token: refreshToken }).save();
      const result = {
        user,
        auth: {
          accessToken,
          refreshToken
        }
      }
      sendSuccessResponse(res, result, 'Data retrieved successfully');
    } catch (error) {
      if (error.isJoi === true) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      next(error)
    }
  },
  registerUser: async (req, res, next) => {
    try {
      const { error, value } = registerHostSchema.validate(req.body);

      if (error) {
        return sendErrorResponse(res, error, 'Validation Error', 400);
      }
      const doesExist = await User.findOne({ mobileNo: value.mobileNo, userType: 3 });
      if (doesExist) {
        throw createError.Conflict(`${value.mobileNo} is already registered`);
      }

      const doesEmailExist = await User.findOne({ email: value.email });
      if (doesEmailExist) {
        throw createError.Conflict(`${value.email} is already registered`);
      }
      value.otp = generateOTP()
      value.userType = 3
      value.password = '123456'
      const user = new User(value);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      const doesExistUserToken = await UserToken.findOne({ userId: savedUser.id });
      if (doesExistUserToken) await doesExistUserToken.remove();

      await new UserToken({ userId: savedUser.id, token: refreshToken }).save();
      const result = {
        user: savedUser,
        auth: {
          accessToken,
          refreshToken
        }
      }
      sendSuccessResponse(res, result, 'Host Register successfully');
    } catch (error) {
      next(error)
    }
  },

  updateProfileDetail: async(req, res, next)=>{
    try {
     
        const reqBody = req.body
        // const data = {
        //   memberSince: reqBody?.memberSince || null,
        //   userDesc: reqBody?.userDesc || null,
        //   languages: reqBody?.languages || null,
        //   replyRate: reqBody?.replyRate || null
        // }
         await User.findByIdAndUpdate(reqBody.id, reqBody)
        const user = await User.findById(reqBody.id)
        sendSuccessResponse(res, user, 'profile data updated successfully');

    } catch (error) {
      next(error)
    }
  },

  updateProfilePhoto: async(req, res, next)=>{
    try {
      if (req.file) {
        const path = req.file.filename;
        req.body.profilePhoto = `uploads/${path}`
      }
      const reqBody = req.body
       await User.findByIdAndUpdate(reqBody.id, {profilePhoto: reqBody.profilePhoto})
      const user = await User.findById(reqBody.id)
      sendSuccessResponse(res, user, 'profile photo updated successfully');

    } catch (error) {
      next(error)
    }
  },

  propfileDetailById: async(req, res, next)=>{
    try {
      const user = await User.findById(req.body.id)
      //   if(user?.languages){
      //   const langData = await Languages.find({ _id: { $in: user.languages }}, { "language": 1, "_id": 1 })
      //   user._doc.langData = langData
      // }
      user._doc.memberSince =`member since ${moment(user.createdAt).format('YYYY')}` ;
      let language = []
      if(user?.languages){
        const langData = await Languages.find({ _id: { $in: user.languages }}, { "language": 1 })
        if(langData.length>0){
          for(let  i of langData){
            language.push(i.language)
          }
        }
        user._doc.languages = language
      }
      // if(!user) return res.status(404).send({message: 'User not found'})
        sendSuccessResponse(res, user, 'User profile details fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  addGuestUser: async(req, res, next)=>{
    try {
      const reqBody = req.body
      const guestUesr = new GuestUser(reqBody)
      await guestUesr.save()
      sendSuccessResponse(res, guestUesr, 'Guest user created successfully');
    } catch (error) {
      next(error)
    }
  },

  guestUserListByTripBooking: async(req, res, next)=>{
    try {
      const reqBody = req.body
      const guestUserList = await GuestUser.find({tripBookingId:reqBody.tripBookingId})
      sendSuccessResponse(res, guestUserList, 'Guest user list fetched successfully');
    } catch (error) {
        next(error)
    }
  },

  deleteGuestById: async(req, res, next)=>{
    try {
        const reqBody = await idSchema.validateAsync(req.body)
        const guestUser = await GuestUser.findByIdAndRemove(reqBody.id)
        sendSuccessResponse(res, guestUser, 'Guest user deleted successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  }
}

export default AuthController;
