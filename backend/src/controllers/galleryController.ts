import Gallery from "../models/gallery.js";
import type { Request, Response } from "express";
import type { CreateGalleryInput } from "../validator/galleryValidator.js";
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
