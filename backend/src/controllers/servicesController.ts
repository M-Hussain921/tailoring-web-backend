import Service from "../models/services.js";
import type { Request, Response } from "express";
import type {
  CreateServiceInput,
  UpdateServiceInput,
  ServiceIdInput,
} from "../validator/servicesValidator.js";

export const createService = async (
  req: Request<{}, {}, CreateServiceInput>,
  res: Response,
): Promise<void> => {
  const { name, slug, description, image, price, features } = req.body;
  try {
    const newService = new Service({
      name,
      slug,
      description,
      image,
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
    res.status(500).json({ message: "Error creating service", error });
  }
};

export const updateService = async (
  req: Request<{ id: string }, {}, UpdateServiceInput>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedService) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
};

export const deleteService = async (
  req: Request<ServiceIdInput>,
  res: Response,
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
    res.status(500).json({ message: "Error deleting service", error });
  }
};

export const getServices = async (
  req: Request,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error fetching services:", error);

    res
      .status(500)
      .json({ success: false, message: "Error fetching services" });
  }
};

export const getServiceById = async (
  req: Request<{ id: string }>,
  res: Response,
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
    
  } catch (error: unknown) {
    console.error("Error fetching service:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching service",
    });
  }
};
