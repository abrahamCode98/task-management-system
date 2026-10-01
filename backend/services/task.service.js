import Task from "../models/task.model.js";
import AppError from "../utils/appError.utils.js";
import escapeRegex from "../utils/escapeRegex.utils.js";
import client from "../config/redis.js";
import generateTaskCacheKey from "../utils/cacheKey.utils.js";
import invalidateTaskCache from "../utils/invalidateTaskCache.utils.js";



export const getAllTasks = async (page, limit, priority, status, search, userId) => {
  const filter = {
    owner: userId
  };

  if (priority) {
    filter.priority = priority;
  }
  if (status) {
    filter.status = status;
  }
  if (search) {
    const escapedSearch = escapeRegex(search);

    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  };

  const cacheKey = generateTaskCacheKey(userId, page, limit, priority, status, search);
  const cachedTasks = await client.get(cacheKey);

  if (cachedTasks) {
    return JSON.parse(cachedTasks);
  }

  const totalTasks = await Task.countDocuments(filter);

  const totalPages = Math.ceil(totalTasks / limit);

  if (page > totalPages && totalPages > 0) {
    throw new AppError(`Page ${page} does not exist`, 404);
  };

  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  // .explain("executionStats")

  const result = {
    tasks,
    totalTasks,
    totalPages,
  };

  await client.set(cacheKey, JSON.stringify(result), { EX: 60 });

  return result;
};


export const createTask = async (taskData, userId) => {
  const newTask = await Task.create({
    ...taskData,
    owner: userId,
  });

  await invalidateTaskCache(userId);

  return newTask;
};


export const getTaskById = async (id, userId) => {
  const task = await Task.findOne({_id: id, owner: userId });

  if(!task) {
    throw new AppError('Task not found', 404);
  };


  return task;
};


export const updateTask = async (id, taskData, userId) => {
  const task = await Task.findOneAndUpdate({_id: id, owner: userId}, taskData, {
    returnDocument: "after",
    runValidators: true,
  });

   if (!task) {
    throw new AppError("Task not found", 404);
   }

  await invalidateTaskCache(userId);

  return task;
};


export const deleteTask = async (id, userId) => {
  const task = await Task.findOneAndDelete({_id: id, owner: userId});

   if (!task) {
     throw new AppError("Task not found", 404);
   };

  await invalidateTaskCache(userId);
  
  return task;
};
