const db = require("../utils/database");
const sizeOf = require('image-size');

function createBanner(req, res) {
    const { userId, type } = req.user;
    if (type !== "admin") {
      return res
        .status(401)
        .json({ message: "Only admin can create banners", status: 401 });
    }
  
    const { banner_title, banner_status, banner_position} =
      req.body;
    const banner_img = req.file ? `uploads/${req.file.filename}` : null;
    const imageUrl = `http://localhost:5005/uploads/${req.file.filename}`;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Get image dimensions using image-size
    const dimensions = sizeOf(req.file.path);
    const banner_dimension = `${dimensions.width}x${dimensions.height}px`;

    // Check if the banner title already exists
    const checkBannerPositionQuery = `SELECT * FROM banner WHERE banner_position = '${banner_position}'`;
    db.query(checkBannerPositionQuery, (error, banners) => {
      if (error) {
        console.error("Error checking banner position:", error);
        return res.status(500).json({ message: "Failed to create banner" });
      }
  
      if (banners.length > 0) {
        return res.status(400).json({ message: "Banner position already exists" });
      }

      // If title is unique, proceed to create the banner
      const createBannerQuery = `
        INSERT INTO banner (banner_title, banner_img, banner_status, banner_position, banner_dimension)
        VALUES ('${banner_title}', '${imageUrl}', '${banner_status}', '${banner_position}', '${banner_dimension}')
      `;
      db.query(createBannerQuery, (error, result) => {
        if (error) {
          console.error("Error creating banner:", error);
          return res.status(500).json({ message: "Failed to create banner" });
        }
  
        return res.status(201).json({ message: "Banner created successfully" });
      });
    });
}

function getAllBanners(req, res) {
    const { type } = req.user;
  
    if (type !== "admin") {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }
    const getAllBannersQuery = `SELECT * FROM banner`;
    db.query(getAllBannersQuery, (error, banners) => {
      if (error) {
        throw error;
      }
      return res.status(200).json({ status: 200, data: banners });
    });
  }
  
  function getBannerById(req, res) {
    const bannerId = req.params.id;
  
    const { type } = req.user;
  
    if (type === "technician") {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }
  
    const getBannerQuery = `SELECT * FROM banner WHERE banner_id = ${bannerId}`;
    db.query(getBannerQuery, (error, banner) => {
      if (error) {
        throw error;
      }
  
      if (banner.length === 0) {
        return res
          .status(404)
          .json({ message: "Banner not found", status: 404 });
      }
  
      return res.status(200).json({ status: 200, data: banner[0] });
    });
  }

  function updateBanner(req, res) {
    const bannerId = req.params.id;
    const {
      title,
      position,
      status,
    } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    
    const { type } = req.user;
  
    if (type === "technician") {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }
    // Check if the banner position already exists and is not the same banner being updated
    const checkPositionTitleQuery = `SELECT * FROM banner WHERE banner_position = '${position}' AND banner_id != ${bannerId}`;
    db.query(checkPositionTitleQuery, (error, banners) => {
      if (error) {
        console.error("Error checking banner position:", error);
        return res.status(500).json({ message: "Failed to update banner" });
      }
  
      if (banners.length > 0) {
        return res.status(400).json({ message: "Banner position already exists" });
      }

      // If position is unique, proceed to update the banner
      let updateBannerQuery = `UPDATE banner SET banner_title = '${title}', banner_position = '${position}'`;
      updateBannerQuery = status
        ? `${updateBannerQuery}, banner_status = '${status}'`
        : updateBannerQuery;
      
      // Only update the image if a new image is uploaded
      if (req.file) {
        const imageUrl = `http://localhost:5005/uploads/${req.file.filename}`;
        updateBannerQuery += `, banner_img = '${imageUrl}'`;
        const dimensions = sizeOf(req.file.path);
        const banner_dimension = `${dimensions.width}x${dimensions.height}px`;
        updateBannerQuery += `, banner_dimension = '${banner_dimension}'`;
      }
    
        updateBannerQuery = `${updateBannerQuery} WHERE banner_id = ${bannerId}`;
        db.query(updateBannerQuery, (error, result) => {
          if (error) {
            throw error;
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Banner not found" });
          }
      
          return res
            .status(200)
            .json({ message: "Banner updated successfully", status: 200 });
        });
    });
  }

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
};