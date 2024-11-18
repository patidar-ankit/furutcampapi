import express from 'express';
import PropertyController from '../Controllers/Property.Controller.js';
import CampRuleController from '../Controllers/CampRules.Controller.js';
import StayTypeController from '../Controllers/StayType.Controller.js';
import uploadFileMiddleware from '../Middleware/upload.js';
import fileUploader from '../Middleware/fileUploader.js';
const router = express.Router();

// POST /auth/register
router.get('/list', PropertyController.propertyList);
router.post('/property-list-by-terrian', PropertyController.propertyListByTerrian)
router.get('/approved-list', PropertyController.approvedPropertyList);
router.get('/unapproved-list', PropertyController.unApprovedPropertyList);
router.post('/list-by-host-id', PropertyController.propertyListByHostId)
router.post('/property-by-id', PropertyController.propertyListById)
router.post('/property-detail-by-id', PropertyController.propertyDetailById)
router.post('/add', PropertyController.addProperty)
router.post('/update/:id', PropertyController.updatePropertyById)

router.post('/add-amenities',uploadFileMiddleware, PropertyController.addAmenities)
router.post('/update-amenites', uploadFileMiddleware, PropertyController.updateAmenities)
router.get('/aminites-list', PropertyController.amenitiesList)

router.post('/add-seasons',uploadFileMiddleware, PropertyController.addSeason)
router.post('/update-seasons',uploadFileMiddleware, PropertyController.updateSeason)
router.get('/seasons-list', PropertyController.seasonList)


router.post('/add-terrain',uploadFileMiddleware, PropertyController.addTerrain)
router.post('/update-terrain',uploadFileMiddleware, PropertyController.updateTerrain)
router.get('/property-form-list', PropertyController.addPropertyFormList)
router.post('/add-stay-types',uploadFileMiddleware, StayTypeController.addStayType)
router.post('/update-stay-types',uploadFileMiddleware, StayTypeController.updateStayType)
router.get('/stay-type-list', StayTypeController.stayTypeList)

router.post('/add-stay-detail',uploadFileMiddleware, StayTypeController.addStayDetail)
router.get('/stay-detail-list', StayTypeController.stayDeailList)
router.post('/update-stay-detail-by-id/:id',uploadFileMiddleware, StayTypeController.updateStayDeailById)
router.post('/stay-detail-delete-by-id', StayTypeController.deletStayDetailById)
router.post('/stay-detail-by-id', StayTypeController.stayDetailById)
router.post('/update-stay-by-id', StayTypeController.updateStayById)


router.post('/add-food', StayTypeController.addFood)
router.get('/food-list', StayTypeController.foodList)
router.post('/delete-food-by-id', StayTypeController.deleteFoodById)
router.post('/update-food-by-id', StayTypeController.updateFood)


router.post('/add-facilities', StayTypeController.addFacilities)
router.get('/facilities-list', StayTypeController.facilitiesList)

///master 
router.post('/add-camp-rules-master', CampRuleController.addCampRulesMaster)
router.post('/add-prop-cancellation-policy-master', PropertyController.addPropCancellationPolicyMaster)
router.post('/update-rules-by-id', CampRuleController.updateRulesById)
router.post('/update-prop-cancellation-policy-by-id', PropertyController.updateCancellationPolicy)

router.post('/add-property-camp-rules', PropertyController.addPropertyCampRules)
router.post('/add-property-cancellation-policy', PropertyController.addPropertyCancellationPolicy)

router.post('/upload-property-img',fileUploader.array('files', 10), PropertyController.uploadPropertyImg)

router.get('/camp-rules-list', CampRuleController.campRulesList)
router.post('/property-camp-rules-by-id', PropertyController.propertyCampRulesList)

router.get('/prop-cancellation-policy-list-master', PropertyController.propCancellationPlocyMasterList)

router.post('/approve', PropertyController.approveProperty)

router.post('/add-addons-type',uploadFileMiddleware, PropertyController.addAddonType)
router.post('/update-addons-type',uploadFileMiddleware, PropertyController.updateAddOnType)
router.get('/addons-type-list', PropertyController.addonTypeList)
router.post('/add-addons', PropertyController.addAddon)
router.get('/add-on-list', PropertyController.addOnList)
router.post('/update-addons-by-id', PropertyController.updateAddonById)

router.get('/terrian-list', PropertyController.terrainList)
router.post('/search-property', PropertyController.searchProperty)
router.post('/check-property-address', PropertyController.checkExistPropertyAddress)
router.get('/property-name-list', PropertyController.propertyListName)
router.post('/delete-property-img-by-id', PropertyController.propertyImageDeleteById)
router.post('/add-near-by',uploadFileMiddleware, PropertyController.addNearBy)
router.get('/nearby-list', PropertyController.nearByList)
router.post('/update-near-by',uploadFileMiddleware, PropertyController.updateNearBy)
router.post('/search-property-by-near-by', PropertyController.searchPropertyByNearBy)
router.post('/add-languages', PropertyController.addLanguages)
router.post('/update-language', PropertyController.updateLanguage)
router.get('/languages-list', PropertyController.languagesList)
router.post('/unique-stay-list', PropertyController.uniqueStaysList)
router.post('/claim-property', PropertyController.claimProperty)
router.get('/property-list-with-stays', PropertyController.propertyWithStayList)
router.post('/get-property-exp-event-by-host', PropertyController.getPropertyExpEventByHost)

router.post('/add-packing-list', PropertyController.addPackingList)
router.post('/update-packing-list-by-id', PropertyController.updatePackingList)
router.get('/packing-list', PropertyController.packingList)







export default router;
