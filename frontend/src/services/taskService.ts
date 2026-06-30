import axios from "axios";
import type { Task, CreateTaskData } from "../types/task";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// Get all tasks
export const getTasks = async () => {
    const token = localStorage.getItem("token");

    const response = await API.get("/tasks/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("TASKS:", response.data);

    return response.data;
};

// Create task
export const createTask = async (
    data: CreateTaskData
): Promise<Task> => {

    const response = await API.post(
        "/tasks",
        data,
        getAuthHeader()
    );

    return response.data;
};

// Update task
export const updateTask = async (
    id: number,
    data: any
) => {

    const token = localStorage.getItem("token");

    const response = await API.put(
        `/tasks/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Delete task
export const deleteTask = async (
    id: number
): Promise<void> => {

    await API.delete(
        `/tasks/${id}`,
        getAuthHeader()
    );
};

export const touchTasks = async () => {
    return API.post(
        "/tasks/touch",
        {},
        getAuthHeader()
    );
};