export interface Task {
    id: number;

    title: string;

    description?: string;

    priority: "Low" | "Medium" | "High";

    status: "Pending" | "Completed";

    due_date?: string | null;

    created_at: string;

    updated_at: string;

    user_id: number;
}

export interface CreateTaskData {
    title: string;

    description: string;

    priority: "Low" | "Medium" | "High";

    status: "Pending" | "Completed";

    due_date?: string | null;

    roadmap_id?: string;

    goal?: string;
}