import { useState } from "react";
import {
    X,
    FileText,
    AlignLeft,
    Flag,
    Calendar
} from "lucide-react";

import styles from "./TaskModal.module.css";

import { createTask } from "../../services/taskService";
import type { CreateTaskData } from "../../types/task";

interface Props {
    open: boolean;
    onClose: () => void;
    onTaskCreated: () => void;
}

const TaskModal = ({
    open,
    onClose,
    onTaskCreated,
}: Props) => {

    const [form, setForm] = useState<CreateTaskData>({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: "",
    });

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await createTask(form);

            onTaskCreated();

            onClose();

            setForm({
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                due_date: "",
            });

        } catch (err) {

            console.error(err);

            alert("Failed to create task");

        }

    };

    return (

        <div className={styles.overlay}>

            <div className={styles.modal}>

                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                >
                    <X size={18} />
                </button>

                <h2>Create New Task</h2>

                <p className={styles.subtitle}>
                    Organize your work efficiently.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className={styles.inputGroup}>

                        <FileText
                            size={18}
                            className={styles.icon}
                        />

                        <input
                            name="title"
                            placeholder="Task title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className={styles.inputGroup}>

                        <AlignLeft
                            size={18}
                            className={styles.icon}
                        />

                        <textarea
                            name="description"
                            placeholder="Task description..."
                            value={form.description}
                            onChange={handleChange}
                        />

                    </div>

                    <div className={styles.row}>

                        <div className={styles.inputGroup}>

                            <Flag
                                size={18}
                                className={styles.icon}
                            />

                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >

                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>

                            </select>

                        </div>

                        <div className={styles.inputGroup}>

                            <Calendar
                                size={18}
                                className={styles.icon}
                            />

                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date ?? ""}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className={styles.actions}>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">

                            Create Task

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default TaskModal;