import Service from "../models/services.js";
import type { Request, Response, NextFunction } from "express";
import type {
  CreateServiceInput,
  UpdateServiceInput,
  ServiceIdInput,
} from "../validator/servicesValidator.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const createService = async (
  req: Request<{}, {}, CreateServiceInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, slug, description, price, features } = req.body;

  if (!req.file) {
    res.status(400).json({
      message: "Image is required",
    });
    return;
  }

  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      "ansari-tailor/gallery",
    );

    const newService = new Service({
      name,
      slug,
      description,
      image: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
      price,
      features,
    });

    const savedService = await newService.save();
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: savedService,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request<{ id: string }, {}, UpdateServiceInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const updateData: Partial<UpdateServiceInput> & {
    image?: {
      imageUrl: string;
      publicId: string;
    };
  } = {
    ...req.body,
  };

  try {
    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({
        message: "Service not found",
      });
      return;
    }

    let oldPublicId: string | undefined;

    if (req.file) {
      oldPublicId = service?.image?.publicId;

      const result = await uploadToCloudinary(
        req.file.buffer,
        "ansari-tailor/gallery",
      );

      updateData.image = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedService) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request<ServiceIdInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findById(
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

    if (!deletedService) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      service: deletedService,
    });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const services = await Service.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const service = await Service.findOne({
      _id: id,
      isActive: true,
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};
