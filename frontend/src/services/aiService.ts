import { API } from "./api";

export const generateRoadmap = async (prompt: string) => {
    const token = localStorage.getItem("token");

    const response = await API.post(
        "/ai/plan",
        { prompt },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const regenerateRoadmap = async () => {
    const token = localStorage.getItem("token");

    const response = await API.post(
        "/ai/regenerate-roadmap",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getActivityStatus = async () => {
    const token = localStorage.getItem("token");

    const response = await API.get(
        "/auth/activity-status",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const updateActivity = async () => {
    const token = localStorage.getItem("token");

    await API.post(
        "/auth/update-activity",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};