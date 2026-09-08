import Service from "../models/services.js";
import User from "../models/user.js";
import type { Request, Response } from "express";
import type { CreateServiceInput } from "../validator/servicesValidator.js";

export const createService = async (
  req: Request<{},{}, CreateServiceInput>,
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
