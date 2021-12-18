const { Store } = require('../models/stores');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const File_Type_Map = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    // configure storage folder
    destination: function (req, file, cb) {
        const isValid = File_Type_Map[file.mimetype]
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
        //   cb is callback returned with file destination if
        // error occur in storing
    },
    // configure name of file
    filename: function (req, file, cb) {

        const extension = File_Type_Map[file.mimetype]
        const fileName = file.originalname.split(' ').join('-');
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadOp = multer({ storage: storage })

// api to get list of stores
router.get(`/`, async (req, res) => {

    const storeList = await Store.find();

    if (!storeList) {
        res.status(500).json({ success: false })
    }
    res.send(storeList);
})

// api to give images of particular store
router.get(`/:sid/image`, async (req, res) => {

    const store = await Store.findById(req.params.sid);
    if (!store) return res.status(400).send('Invalid Store');
    else
        return res.status(200).send(store.images);
})

// api to add image files to backend
router.put(`/:sid`, uploadOp.single('image'), async (req, res) => {

    const store = await Store.findById(req.params.sid);

    if (!store) return res.status(400).send('Invalid Store');


    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const fileName = file.filename

    // creating basepath to point to location of image stored on backend
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;


    const updatedStore = await Store.findByIdAndUpdate(req.params.sid,
        {
            $push: { images: {uri:`${basePath}${fileName}`,timestamp:Date.now()} }

        },
        {
            new: true
            // to return updated values
        }
    )

    if (!updatedStore) {
        return res.status(404).send('Image cannot be added');
    }

    res.status(200).send(updatedStore);

})

module.exports = router;