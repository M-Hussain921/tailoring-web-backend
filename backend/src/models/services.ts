import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    image: {
      imageUrl: {
        type: String,
        required: true,
        trim: true,
      },
      publicId: {
        type: String,
        required: true,
        trim: true,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => {
          return (
            value.length >= 1 &&
            value.every((feature) => feature.trim().length > 0)
          );
        },
        message: "{PATH} must have at least one feature",
      },
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deactivatedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Service = mongoose.model("Service", ServiceSchema);
export default Service;
