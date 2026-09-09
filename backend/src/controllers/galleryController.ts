import Gallery from "../models/gallery.js";
import type { Request, Response } from "express";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryIdInput
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

export const deleteService = async (
  req: Request<GalleryIdInput>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedGallery = await Gallery.findById(id);

    if (!deletedGallery) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    deletedGallery.isActive = false;
    deletedGallery.deactivatedAt = new Date();
    await deletedGallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
      service: deletedGallery,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery", error });
  }
};

