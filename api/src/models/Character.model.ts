import mongoose, { Schema, Document } from "mongoose";

interface ICharacterData extends Document {
  name: string;
  width: number;
  height: number;
  created_at: Date;
  updated_at: Date;
  frame_sets: {
    [set: string]: {
      frame_count: number;
      frames: {
        [direction: string]: {
          upper: any[];
          lower: any[];
        };
      };
    };
  };
}

const schema: Schema<ICharacterData> = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide a character name."]
    },
    width: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 2
    },
    frame_sets: {
      type: Map,
      of: new Schema(
        {
          frame_count: { type: Number, required: true },
          frames: {
            type: Map,
            of: new Schema(
              {
                upper: { type: [Schema.Types.Mixed], required: true },
                lower: { type: [Schema.Types.Mixed], required: true }
              },
              { _id: false }
            )
          }
        },
        { _id: false }
      )
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.pre("save", async function (next: any) {
  try {
    next();
  } catch (error: any) {
    next(error);
  }
});

const Character: mongoose.Model<ICharacterData> = mongoose.model<ICharacterData>("Character", schema);
export default Character;
