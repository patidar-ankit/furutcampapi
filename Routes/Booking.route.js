import express from 'express';
import BookingController from '../Controllers/Booking.Controller.js';
import upload from '../Middleware/uploader.js';
const router = express.Router();

// POST /auth/register
// router.get('/host-list', UserController.hostList);
router.post('/add-booking', BookingController.addBooking);
router.post('/trip-booking-list-by-hostid', BookingController.tripBookingByHostId);
router.post('/trip-booking-approve-reject', BookingController.tripApprovedAndReject);
router.post('/checkin-checkout-trip', BookingController.tripCheckInCheckOut);
router.post('/trip-booking-list-by-id', BookingController.tripBookingById);
router.post('/create-order', BookingController.createOrder);
router.post('/create-transaction', BookingController.createTransaction)
router.post('/add-booking-in-cart', BookingController.addBookingInCart);
router.post('/get-temporary-trip-by-userid', BookingController.getTemporaryTripBookingByUserId);
router.post('/get-temporary-trip-list-by-userid', BookingController.getAllTemporaryBookingByUserId)
router.post('/add-experience-booking', BookingController.addExperienceBooking)
router.post('/check-exp-avalablity', BookingController.checkExperienceAvalability)
const docuementUpload = upload.fields([{ name: 'documentFrontPhoto', maxCount: 1 }, { name: 'documentBackPhoto', maxCount: 1 }, ])
router.post('/document-verification', docuementUpload, BookingController.docuemntVerification)
router.post('/check-stay-avalablity', BookingController.checkStayAvalablity)
router.post('/booking-list-by-host', BookingController.getAllBookingByHostId)
router.post('/update-booking-status', BookingController.approveRejectBooking)
router.post('/check-event-availablity', BookingController.checkEventAvalability)
router.post('/add-event-booking', BookingController.addEventBooking)
router.post('/get-temporary-trip-by-userid-hostid', BookingController.getTemporaryTripByUserAndPropertyId)
router.post('/temporary-booking-by-id', BookingController.getTemporaryTripBookingById)
router.get('/trip-booking-list', BookingController.getAllTripBookings)
router.get('/booking-list-for-admin', BookingController.bookingListByForAdmin)
router.post('/delete-temporary-trip-booking-by-id', BookingController.deleteTemporaryTripBookingById)
router.post('/add-experience-booking-in-temporary', BookingController.addExperienceBookingInTemporary)
router.post('/get-experience-temporary-booking-by-user-host', BookingController.getTemporaryExperienceBookingByUserAndHostId)
router.post('/get-temporary-experience-booking-by-id', BookingController.getTemporaryExperienceBookingById)
router.post('/delete-experience-temporary-booking', BookingController.deleteExperienceBookingById)
router.post('/add-event-bookin-in-temporary', BookingController.addEventBookingInTemporary)
router.post('/get-event-temporary-booking-by-user-host', BookingController.getTemporaryEventBookingByUserAndHostId)
router.post('/get-temporary-event-booking-by-id', BookingController.getTemporaryEventBookingById)
router.post('/delete-event-temporary-booking', BookingController.deleteEventBookingById)
router.post('/get-temporary-experience-booking-list-by-user', BookingController.getAllTemporaryExperienceBookingByUserId)
router.post('/get-trip-booking-list-by-user', BookingController.getAllTripBookingsByUserID)
router.post('/event-temporary-booking-list-by-user', BookingController.getAllTemporaryEventBookingByUserId)
router.post('/upcoming-trip-booking-by-user', BookingController.upcomingTripBookingByUserID)
router.post('/past-trip-by-user', BookingController.pastTripByUserID)
router.get('/auto-rejected-trip-booking', BookingController.autoRejectedTripBooking)
router.post('/add-rating', BookingController.rating)
router.post('/refund-payment', BookingController.refundPayment)
router.post('/extend-stay', BookingController.extendStay)
router.post('/verifiy-document-list-by-trip', BookingController.verifyDocumentListByTripId)
router.post('/collect-booking-amount', BookingController.collectBookingAmount)








export default router;

