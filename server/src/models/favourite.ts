import { model, ObjectId, Schema, SchemaType } from "mongoose";

interface FavouriteDocument {
  owner: ObjectId;
  items: ObjectId[];
}

const favouriteSchema = new Schema<FavouriteDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
  },
  { timestamps: true }
);
export const Favourite = model<FavouriteDocument>("Favourite", favouriteSchema);
