import Service from "../models/services.js";
import User from "../models/user.js";
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
    const existingUser = await User.findById(req.admin?.id);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

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
    const existingUser = await User.findById(req.admin?.id);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

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
    const existingUser = await User.findById(req.admin?.id);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const deletedService = await Service.findById(id);

    if (!deletedService) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    deletedService.isActive = false;
    deletedService.deactivatedAt = new Date();
    await deletedService.save();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      service: deletedService,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};
