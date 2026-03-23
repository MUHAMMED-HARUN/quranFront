import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    TeachingAssignment,
    CreateTeachingAssignmentCommand,
    UpdateTeachingAssignmentCommand,
} from "../types/teachingAssignment.types";

export const teachingAssignmentService = {
    getAll: (): Promise<TResult<TeachingAssignment[]>> => {
        return api.get("/TeachingAssignments") as unknown as Promise<TResult<TeachingAssignment[]>>;
    },

    getById: (id: string): Promise<TResult<TeachingAssignment>> => {
        return api.get(`/TeachingAssignments/${id}`) as unknown as Promise<TResult<TeachingAssignment>>;
    },

    create: (data: CreateTeachingAssignmentCommand): Promise<TResult<string>> => {
        return api.post("/TeachingAssignments", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateTeachingAssignmentCommand): Promise<TResult<boolean>> => {
        return api.put("/TeachingAssignments", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/TeachingAssignments/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
