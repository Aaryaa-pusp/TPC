const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const os = require('os');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("---- DEBUG: Entering uploadOnCloudinary ----");
        console.log("DEBUG: Local file path received ->", localFilePath);

        if (!localFilePath) {
            console.log("DEBUG: localFilePath is null or undefined, aborting upload");
            return null;
        }

        console.log("DEBUG: Initiating cloudinary.uploader.upload...");
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "tpc-student-ids"
        });

        console.log("DEBUG: Cloudinary upload SUCCESS ->", response.url);

        console.log("DEBUG: Unlinking local file:", localFilePath);
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("---- DEBUG: Cloudinary upload FAILED ----");
        console.error(error);
        if (fs.existsSync(localFilePath)) {
            console.log("DEBUG: Unlinking local file after failure:", localFilePath);
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload, uploadOnCloudinary };
