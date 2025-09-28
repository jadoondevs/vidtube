/* id string pk
  videoFile string
  thumbnail string
  owner objectId users
  title string
  descrption string
  duration number
  views number
  isPublished boolean
  createdAt Date
  updatedAt Date
  }
  */

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";
// import pkg from "mongoose-aggregate-paginate-v2";
// const { mongooseAggregatePaginate } = pkg;

const videoSchema = new Schema(
  {
    videoFile: {
      url: String, //URL
      public_id: String, //Cloudinary public ID
      
    },

    thumbnail: {
      url: String,
      public_id: String, //Cloudinary public ID
      
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);


export const Video = mongoose.model("Video", videoSchema);
