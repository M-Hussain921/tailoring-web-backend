import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
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
      trim: true,
      maxlength: 300,
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

    category: {
      type: String,
      required: true,
      enum: ["shirt", "pant", "kurta", "suit", "sherwani", "blazer", "other"],
      lowercase: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => {
          return value.every((tag) => tag.trim().length > 0);
        },
        message: "{PATH} cannot contain empty tags",
      },
    },

    altText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deactivatedAt: {
      type: Date,
      default: null,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Gallery = mongoose.model("Gallery", GallerySchema);

export default Gallery;
