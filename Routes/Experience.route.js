import express from 'express';
import ExperienceController from '../Controllers/Experience.Controller.js';
import uploadFileMiddleware from '../Middleware/upload.js';
import fileUploader from '../Middleware/fileUploader.js';
const router = express.Router();

// POST /auth/register
router.post('/add-experience-type', uploadFileMiddleware, ExperienceController.addExperienceType)
router.post('/update-experience-type', uploadFileMiddleware, ExperienceController.updateExperienceType)
router.get('/experience-type-list', ExperienceController.getExperienceTypes)
router.post('/add-adventure-type', uploadFileMiddleware, ExperienceController.addAdventureType)
router.post('/update-adventure-type', uploadFileMiddleware, ExperienceController.updateAdventureType)
router.get('/adventure-type-list', ExperienceController.adventureList)
router.post('/adventure-type-list-by-expid', ExperienceController.adventureListByExpTypeId)
router.post('/add-duration-type', uploadFileMiddleware, ExperienceController.addDurationType)
router.get('/duration-type-list', ExperienceController.durationTypeList)
router.post('/add-cancellation-policy-master', ExperienceController.addCancellationPolicy)
router.get('/exp-cancellation-policy-master-list', ExperienceController.expCancellationPolicyList)
router.post('/add-cancellation-policy', ExperienceController.addExperienceCancellationPolicy)
router.post('/cancellation-policy-list-by-id', ExperienceController.experienceCancellationPolicyById)

router.post('/add-exp-includes', uploadFileMiddleware, ExperienceController.addIncludes)
router.post('/update-exp-includes', uploadFileMiddleware, ExperienceController.updateIncludes)
router.get('/exp-include-list', ExperienceController.expIncludeList)

router.post('/add-exp-carry', ExperienceController.addExpCarry)
router.get('/exp-carry-list', ExperienceController.expCarryList)

router.post('/add', ExperienceController.addExperience)
router.post('/upload-exp-img', fileUploader.array('files', 10), ExperienceController.uploadExperienceImg)

router.get('/list', ExperienceController.experienceList)
router.get('/list-for-home-page', ExperienceController.experienceListForHomePage)
router.post('/list-by-host', ExperienceController.experienceListByHost)
router.post('/event-list-by-host', ExperienceController.eventListByHost)
router.post('/update-exp/:id', ExperienceController.updateExperienceById)
router.post('/update-exp-and-event-by-id', ExperienceController.updateExperienceAndEventById)
router.get('/exp-approved-list', ExperienceController.approvedExperienceList)
router.get('/unapproved-exp-list', ExperienceController.unApprovedExperienceList)
router.post('/approve-exp', ExperienceController.approveExperience)
router.post('/exp-by-id', ExperienceController.experienceById)
router.get('/event-list', ExperienceController.eventList)
router.get('/event-list-for-home-page', ExperienceController.eventListForHomePage)
router.get('/event-list-for-admin', ExperienceController.eventListForAdmin)
router.get('/exp-list-for-admin', ExperienceController.expListForAdmin)
router.post('/event-by-id', ExperienceController.eventById)
router.post('/add-experience-itinerary', ExperienceController.addExperienceItinerary)
router.post('/upload-exp-itinerary-img', fileUploader.array('files', 10), ExperienceController.uploadExpItineraryImg)
router.post('/add-event-itinerary', ExperienceController.addEventItinerary)
router.post('/upload-event-itinerary-img', fileUploader.array('files', 10), ExperienceController.uploadEventItineraryImg)
router.post('/delete-exp-event-img-by-id', ExperienceController.deleteExperienceAndEventImgById)
router.post('/create-transport-mode', uploadFileMiddleware, ExperienceController.createTransportMode)
router.post('/update-transport-mode', uploadFileMiddleware, ExperienceController.updateTransportationMode)
router.get('/transport-mode-list', ExperienceController.tranportModeList)

router.post('/update-experience-itinerary', ExperienceController.updateExperienceItinerary)
router.post('/update-event-itinerary', ExperienceController.updateEventItinerary)
router.post('/delete-exp-itinerary-by-id', ExperienceController.deleteExperienceItineraryById)
router.post('/delete-event-itinerary-by-id', ExperienceController.deleteEventItineraryById)
router.post('/delete-exp-event-itinerary-img-by-id', ExperienceController.deleteEventAndExpIteneraryImgById)



export default router;
