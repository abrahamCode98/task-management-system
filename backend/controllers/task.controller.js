import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service.js";


export const getAllTasksController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit, priority, status, search } = req.pagination;

    const { tasks, totalTasks, totalPages } = await getAllTasks(page, limit, priority, status, search, userId);

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      tasks: tasks,
      pagination: {
        currentPage: page,
        limit,
        totalTasks,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createNewTask = async (req, res, next) => {
  try {
    const taskData = req.body;
    const userId = req.user.id;

    const newTask = await createTask(taskData, userId);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskByIdController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;


    const task = await getTaskById(id, userId);

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const taskData = req.body;
    const userId = req.user.id;

    const task = await updateTask(id, taskData, userId);

    res
      .status(200)
      .json({ success: true, message: "Task Updated successfully", task });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const deletedTask = await deleteTask(id, userId);

    
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};
