import crypto from "crypto";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import User from "../models/user.js";
import AdminInvite from "../models/adminInvite.js";

export const inviteAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const existingAdmin = await User.findOne({
      role: "admin",
      isActive: true,
    });

    if (existingAdmin) {
      res.status(409).json({
        message: "An active admin already exists",
      });
      return;
    }

    const existingInvite = await AdminInvite.findOne({
      email,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvite) {
      res.status(409).json({
        message: "An active invitation already exists for this email",
      });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invitation = await AdminInvite.create({
      email,
      tokenHash,
      expiresAt,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Admin invitation created successfully",
      invitationId: invitation._id,
      expiresAt: invitation.expiresAt,

      invitationToken: rawToken,
    });
  } catch (error: unknown) {
    console.error("Error inviting admin:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const acceptAdminInvite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, username, password } = req.body;

    if (!token || !username || !password) {
      res.status(400).json({
        message: "Token, username and password are required",
      });
      return;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const invitation = await AdminInvite.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      res.status(400).json({
        message: "Invalid or expired invitation",
      });
      return;
    }

    const existingAdmin = await User.findOne({
      role: "admin",
      isActive: true,
    });

    if (existingAdmin) {
      res.status(409).json({
        message: "An active admin already exists",
      });
      return;
    }

    const existingUsername = await User.findOne({
      username: username.trim(),
    });

    if (existingUsername) {
      res.status(409).json({
        message: "Username is already taken",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      username: username.trim(),
      email: invitation.email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: unknown) {
    console.error("Error accepting admin invitation:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
