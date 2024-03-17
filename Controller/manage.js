const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const UPLOAD_FOLDER = "./public/image";
const fs = require("fs");
const path = require("path");
const Resource = require("../Schema/resourceSchema");
const CreateCraft = require("../Schema/createCraftSchema");
const Shopping = require("../Schema/shoppingSchema");

//! -----------multer for image upload------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(fileExt, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") +
                "-" +
                Date.now();
            console.log("🚀 ~ fileName:", fileName);
            cb(null, fileName + fileExt);
      
    },
});

var upload = multer({
    storage: storage,
});

// !-----------post createCraft route-------------
router.post('/createCraft', upload.array("image", 3), async (req, res) => {
  try {
    const { name, basePrice, selectedItems } = req.body;

    // Check if there are any files uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const imageArray = req.files.map(file => file.filename);

    const createCraft = await CreateCraft.create({
      name,
      basePrice,
      selectedItems,
      image: imageArray,
    });

    console.log(createCraft);

    res.status(200).json({ message: 'Successfully created', createCraft });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//!-----------post resource route-------------

  router.post('/resource', upload.single("image"), async (req, res) => {
    try {
      const { name, basePrice, quantity } = req.body;
    // console.log(name, price, quantity, image);
      const resource = await new Resource({
        name,
        basePrice,
        quantity,
        image: req.file.filename,
      }).save()

      const shopping = await new Shopping({
        name,
        basePrice,
        quantity,
        image: req.file.filename,
      }).save()
       console.log(shopping);
      res.status(200).json({ message: 'successfully created', resource });
    } catch (error) {
      console.log(error?.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 

  router.post('/resources', async (req, res) => {
    try {
      const { name, basePrice, quantity, image } = req.body;
    console.log(name, basePrice, quantity, image);
      const resource = await new Resource({
        name,
        basePrice,
        quantity,
        image
      }).save()

      // console.log(resource);
      const shopping = await new Shopping({
        name,
        basePrice,
        quantity,
        image
      }).save()
      //  console.log(shopping);
      res.status(200).json({ message: 'successfully created', resource,  shopping });
    } catch (error) {
      console.log(error?.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //--------------------get all resource--------------------------

  router.get("/allResource", async (req, res) => {
    try {
        const resource = await Resource.find();
        res.status(200).json({ data: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


 //--------------------get all craft--------------------


 router.get("/allCraft", async (req, res) => {
  try {
      const createCraft = await CreateCraft.find();
      res.status(200).json({ data: createCraft });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});

 //--------------------get all  Shopping--------------------

router.get("/allShopping", async (req, res) => {
  try {
      const resource = await Shopping.find();
      res.status(200).json({ data: resource });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});


//! ----------update resource------------

router.patch('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, basePrice, quantity } = req.body;
    console.log(name, basePrice, quantity);
    
    const resourceId = req.params.id;

    // Check if the resource exists
    const existingResource = await Resource.findById(resourceId);

    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update the resource with the new data
    existingResource.name = name;
    existingResource.basePrice = basePrice;
    existingResource.quantity = quantity;
    
    if (req.file) {
      existingResource.image = req.file.filename;
    }

    const updatedResource = await existingResource.save();
    console.log(updatedResource);
    res.status(200).json({ message: 'Resource updated successfully', resource: updatedResource });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH route to update a shopping item---------------------

router.patch('/updates/:id', async (req, res) => {
  try {
      const resourceId = req.params.id;
      const { name, basePrice, sellingPrice, profit, profitValue, image } = req.body;

      // Check if the shopping item exists
      let existingItem = await Shopping.findById(resourceId);

      if (!existingItem) {
          // If the item doesn't exist, create a new one
          existingItem = new Shopping({
              _id: resourceId,
              name,
              basePrice,
              sellingPrice,
              profit,
              profitValue,
              image
          });

          // Save the new item
          await existingItem.save();
          res.status(201).json({ message: 'New shopping item created', resource: existingItem });
      } else {
          // If the item exists, update it
          existingItem.name = name;
          existingItem.basePrice = basePrice;
          existingItem.sellingPrice = sellingPrice;
          existingItem.profit = profit;
          existingItem.profitValue = profitValue;
          existingItem.image = image;

          // Save the updated item
          await existingItem.save();
          res.status(200).json({ message: 'Shopping item updated successfully', resource: existingItem });
      }
  } catch (error) {
      console.error('Error updating shopping item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//--------------delete--------------
router.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const resource = await Resource.findById(userId);
        if (!resource) {
            return res.status(404).json({ message: "user not found" });
        }
        await Resource.findByIdAndDelete(userId);
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    res.json({ message: 'Server running well' });
})

module.exports = router;