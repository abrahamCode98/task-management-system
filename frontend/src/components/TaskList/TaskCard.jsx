import { useState } from "react";

function TaskCard({ task, onUpdateTask, onDeleteTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState("");
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        dueDate: String(task.dueDate).slice(0, 10),
        priority: task.priority,
        status: task.status,
    });
    const taskId = task._id || task.id;

    function handleChange(event) {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setEditError("");
        try {
            await onUpdateTask(taskId, formData);
            setIsEditing(false);
        } catch (error) {
            setEditError(error.message);
        }
    }

    function handleDelete() {
        if (window.confirm(`Delete "${task.title}"?`)) {
            onDeleteTask(taskId);
        }
    }

    return (
        <article className="flex min-h-52 flex-col rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 transition-colors hover:border-slate-700">
            {isEditing ? (
                <form className="space-y-3" onSubmit={handleSubmit}>
                    {editError && <p className="text-sm text-rose-300" role="alert">{editError}</p>}
                    <label className="sr-only" htmlFor={`title-${taskId}`}>Task title</label>
                    <input
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                        id={`title-${taskId}`}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <label className="sr-only" htmlFor={`description-${taskId}`}>Task description</label>
                    <textarea
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                        id={`description-${taskId}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        minLength={10}
                        rows={3}
                    />
                    <label className="sr-only" htmlFor={`dueDate-${taskId}`}>Due date</label>
                    <input
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                        id={`dueDate-${taskId}`}
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <label className="sr-only" htmlFor={`priority-${taskId}`}>Priority</label>
                        <select
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                            id={`priority-${taskId}`}
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <label className="sr-only" htmlFor={`status-${taskId}`}>Status</label>
                        <select
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                            id={`status-${taskId}`}
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="in progress">In progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button className="flex-1 rounded-lg bg-teal-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-300" type="submit">Save</button>
                        <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800" onClick={() => setIsEditing(false)} type="button">Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold leading-7 text-white">{task.title}</h3>
                        <span className="shrink-0 rounded-full bg-teal-400/10 px-2.5 py-1 text-xs font-semibold capitalize text-teal-300">
                            {task.priority}
                        </span>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{task.description}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500">
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span className="rounded-full border border-slate-700 px-2.5 py-1 capitalize text-slate-300">{task.status}</span>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800" onClick={() => setIsEditing(true)} type="button">Edit</button>
                        <button className="rounded-lg border border-rose-900 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-950" onClick={handleDelete} type="button">Delete</button>
                    </div>
                </>
            )}
        </article>
    );
}

export default TaskCard;