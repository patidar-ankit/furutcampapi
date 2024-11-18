import Joi from 'joi';

const authSchema = Joi.object({
  name: Joi.string().lowercase().required(),
  mobileNo: Joi.string().required(),
  userType: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
  // name: Joi.string().lowercase().required(),
  // mobileNo: Joi.string().required(),
  // userType: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

const hostLoginByMobileSchema = Joi.object({
  mobileNo: Joi.string().required()
});

const registerHostSchema = Joi.object({
  name: Joi.string().lowercase().required(),
  mobileNo: Joi.string().required(),
  email: Joi.string().email().lowercase().required()
});

const otpVerificationSchema = Joi.object({
  id: Joi.required(),
  otp: Joi.required()
})

const emailSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
});

const updatePasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  old_password: Joi.string().min(2).required(),
  new_password: Joi.string().min(2).required(),
});

const idSchema = Joi.object({
  id: Joi.string().required()
})
export { 
  authSchema, 
  loginSchema, 
  hostLoginByMobileSchema, 
  registerHostSchema,
  otpVerificationSchema,
  emailSchema,
  updatePasswordSchema,
  idSchema 
};
