/* id string pk
  name string
  descrption string
  createdAt Date
  updatedAt Date
  videos objectId[] videos
  owner objectId users
  */

import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
