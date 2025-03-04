const multer = require('multer');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("extention image incorrect");
        if (isValid) { error = null; }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const nom = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");

        const extention = MIME_TYPE_MAP[file.mimetype];
        cb(null, nom + "-" + Date.now() + "." + extention)
    }
})
module.exports = multer({
    storage,
    limits: { fileSize: 12 * 1024 * 1024 }
})
    .single("image");