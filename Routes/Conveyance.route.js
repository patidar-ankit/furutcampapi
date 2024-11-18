import express from 'express';
import ConveyanceController from '../Controllers/Conveyance.Controller.js';
import uploadFileMiddleware from '../Middleware/upload.js';
import fileUploader from '../Middleware/fileUploader.js';
const router = express.Router();

router.post('/add_conv_type',uploadFileMiddleware, ConveyanceController.addConveyanceType)
router.get('/conv_type_list', ConveyanceController.conveyanceTypeList)
router.post('/add-conv-package', uploadFileMiddleware, ConveyanceController.addConPackage)
router.get('/conv-package-list', ConveyanceController.convPackageList)
router.post('/add-conv', ConveyanceController.addConveyance)
router.post('/update-conv/:id', ConveyanceController.updateConveynanceById)
router.post('/add-package', ConveyanceController.addPackage)
router.post('/upload-conv-img', fileUploader.array('files', 5), ConveyanceController.uploadConvImg)
router.post('/conv-list-by-host', ConveyanceController.conveyanceListByHost)
router.get('/published-conv-list', ConveyanceController.publishedConveyanceList)
router.get('/active-conv-list', ConveyanceController.activeConveyanceList)
router.post('/approve-conv', ConveyanceController.approveConveyance)






export default router