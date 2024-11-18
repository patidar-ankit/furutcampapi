import express from 'express';
const router = express.Router();
import AuthController from '../Controllers/Auth.Controller.js';
import uploadFileMiddleware from '../Middleware/upload.js';

// POST /auth/register
router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.delete('/logout', AuthController.logout);

router.post('/host-login-by-mobile', AuthController.hostLoginByMobile)
router.post('/register-host', AuthController.registerHost)

router.post('/otp-verify', AuthController.verifyOTP)

router.post('/resent-opt', AuthController.resentOTP)
router.post('/host-login-by-email', AuthController.hostLoginByEmail)
router.post('/update-password', AuthController.updatePassword)

router.post('/send-otp', AuthController.sendOTP)

///user login route

router.post('/user-login-by-mobile', AuthController.userLoginByMobile)
router.post('/user-register', AuthController.registerUser)
router.post('/user-login-by-email', AuthController.userLoginByEmail)

router.post('/update-profile-detail', AuthController.updateProfileDetail)

router.post('/update-profile-photo',uploadFileMiddleware, AuthController.updateProfilePhoto)
router.post('/profile-detail-by-id', AuthController.propfileDetailById)
router.post('/add-guest-user', AuthController.addGuestUser)
router.post('/guest-user-by-tripbooking', AuthController.guestUserListByTripBooking)
router.post('/delete-guest-by-id', AuthController.deleteGuestById)

export default router;
