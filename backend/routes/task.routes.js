import { Router } from "express";
import {
  validateCreateTask,
  validateUpdateTask,
  validatePagination,
} from "../middleware/validation.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  getAllTasksController,
  createNewTask,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";

const router = Router();

router.use(protect);

router.get("/", validatePagination, getAllTasksController);
router.post("/", validateCreateTask, createNewTask);
router.get("/:id", getTaskByIdController);
router.patch("/:id", validateUpdateTask, updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
