import multer from 'multer';
import path from 'path';
import { getPaths } from '../helpers/utils.js';

const { __dirname } = getPaths(import.meta.url);

export function avatarUpdate() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../../public/images'))
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, Date.now() + ext, true);
        },
    });
    return multer({ storage });
}