import multer from 'multer';
import uniqid from 'uniqid';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, `${__basedir}/public/uploads/`);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}${uniqid()}${path.extname(file.originalname)}`;
        console.log('fileName', fileName);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

export default upload;
