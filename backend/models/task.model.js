import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, required: true, enum: ["low", "medium", "high"] },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in progress", "completed"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true },
);
// taskSchema.index({priority: 1});
// taskSchema.index({status: 1});
// taskSchema.index({createdAt: -1});
taskSchema.index({ priority: 1, status: 1, createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
