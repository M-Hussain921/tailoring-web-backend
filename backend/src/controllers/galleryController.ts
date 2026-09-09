import Gallery from "../models/gallery.js";
import type { Request, Response } from "express";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryIdInput,
  GalleryQueryInput
} from "../validator/galleryValidator.js";
import { MongoServerError } from "mongodb";

export const createGallery = async (
  req: Request<{}, {}, CreateGalleryInput>,
  res: Response,
): Promise<void> => {
  const {
    title,
    slug,
    description,
    image,
    category,
    tags,
    altText,
    displayOrder,
    isFeatured,
    isActive,
  } = req.body;

  try {
    const gallery = await Gallery.create({
      title,
      slug,
      description,
      image,
      category,
      tags,
      altText,
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isActive !== undefined && { isActive }),
      createdBy: req.admin!.id,
    });

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      gallery,
    });
  } catch (error: unknown) {
    console.error("Error creating gallery:", error);

    if (error instanceof MongoServerError && error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Gallery with this title or slug already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateGallery = async (
  req: Request<{ id: string }, {}, UpdateGalleryInput>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedGallery) {
      res.status(404).json({ message: "Gallery not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      service: updatedGallery,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating gallery", error });

    if (error instanceof MongoServerError && error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Gallery with this title or slug already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteGallery = async (
  req: Request<GalleryIdInput>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          deactivatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!deletedGallery) {
      res.status(404).json({ message: "Gallery not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
      service: deletedGallery,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery", error });
  }
};

export const getGallery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const gallerys = await Gallery.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: gallerys.length,
      gallerys,
    });
  } catch (error: unknown) {
    console.error("Error fetching gallerys:", error);

    res
      .status(500)
      .json({ success: false, message: "Error fetching gallerys" });
  }
};

export const getGalleryByCategory = async (
  req: Request<{}, {}, {}, GalleryQueryInput>,
  res: Response,
): Promise<void> => {
  try {
    const { category } = req.query;

   const filter = {
      isActive: true,
      ...(category && { category }),
    };

    const gallery = await Gallery.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: gallery.length,
      gallery,
    });
  } catch (error: unknown) {
    console.error("Error fetching gallery:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching gallery",
    });
  }
};

export const getGalleryById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const gallery = await Gallery.findOne({
      _id: id,
      isActive: true,
    });

    if (!gallery) {
      res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      gallery,
    });
  } catch (error: unknown) {
    console.error("Error fetching gallery:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching gallery",
    });
  }
};
