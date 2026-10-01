import TaskCard from "./TaskCard";


function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  return (
    <section aria-labelledby="task-list-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-400">Overview</p>
          <h2 id="task-list-heading" className="mt-1 text-2xl font-semibold text-white">
            Your tasks
          </h2>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center">
          <p className="text-base font-medium text-slate-200">No tasks yet</p>
          <p className="mt-2 text-sm text-slate-500">Create your first task to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;