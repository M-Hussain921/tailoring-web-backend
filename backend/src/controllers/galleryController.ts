import Gallery from "../models/gallery.js";
import type { Request, Response, NextFunction } from "express";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryIdInput,
  GalleryQueryInput,
} from "../validator/galleryValidator.js";

export const createGallery = async (
  req: Request<{}, {}, CreateGalleryInput>,
  res: Response,
  next: NextFunction,
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
      createdBy: req.user!.id,
    });

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (
  req: Request<{ id: string }, {}, UpdateGalleryInput>,
  res: Response,
  next: NextFunction,
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
    next(error);
  }
};

export const deleteGallery = async (
  req: Request<GalleryIdInput>,
  res: Response,
  next: NextFunction,
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
    next(error);
  }
};

export const getGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  } catch (error) {
    next(error);
  }
};

export const getGalleryByCategory = async (
  req: Request<{}, {}, {}, GalleryQueryInput>,
  res: Response,
  next: NextFunction,
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
  } catch (error) {
    next(error);
  }
};

export const getGalleryById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
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
  } catch (error) {
    next(error);
  }
};
