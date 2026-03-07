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

const uploadOnCloudinary = async (localFilePath, folder = "tpc-student-ids") => {
    try {
        console.log("---- DEBUG: Entering uploadOnCloudinary ----");
        console.log("DEBUG: Local file path received ->", localFilePath);

        if (!localFilePath) {
            console.log("DEBUG: localFilePath is null or undefined, aborting upload");
            return null;
        }

        console.log("DEBUG: Initiating cloudinary.uploader.upload...");
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image", // 'image' allows inline PDF viewing via Cloudinary
            folder
        });

        const ext = path.extname(localFilePath).toLowerCase();
        let finalUrl = response.url.replace('/raw/upload/', '/image/upload/');

        if (ext === '.pdf' && !finalUrl.toLowerCase().endsWith('.pdf')) {
            finalUrl += '.pdf';
        }

        // Also ensure secure_url applies the same logic, although the frontend uses response.url
        response.url = finalUrl;
        if (response.secure_url) {
            let finalSecureUrl = response.secure_url.replace('/raw/upload/', '/image/upload/');
            if (ext === '.pdf' && !finalSecureUrl.toLowerCase().endsWith('.pdf')) {
                finalSecureUrl += '.pdf';
            }
            response.secure_url = finalSecureUrl;
        }

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
