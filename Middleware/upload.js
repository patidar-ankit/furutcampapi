import util from "util";
import multer from "multer";

// Get the directory name of the current module
const maxSize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('in here');
    cb(null, `${__basedir}/public/uploads/`);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    console.log('name', name);
    cb(null, `${Date.now()}-${name}`);
  },
});

// const uploadFile = multer({
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
