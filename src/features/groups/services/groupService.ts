import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    Group,
    CreateGroupCommand,
    UpdateGroupCommand,
} from "../types/group.types";

export const groupService = {
    getAll: (): Promise<TResult<Group[]>> => {
        return api.get("/Groups") as unknown as Promise<TResult<Group[]>>;
    },

    getById: (id: string): Promise<TResult<Group>> => {
        return api.get(`/Groups/${id}`) as unknown as Promise<TResult<Group>>;
    },

    getByInstituteClassId: (instituteClassId: string): Promise<TResult<Group[]>> => {
        return api.get(`/Groups/institute-class/${instituteClassId}`) as unknown as Promise<TResult<Group[]>>;
    },

    searchByName: (name: string): Promise<TResult<Group[]>> => {
        return api.get(`/Groups/search/${name}`) as unknown as Promise<TResult<Group[]>>;
    },

    create: (data: CreateGroupCommand): Promise<TResult<string>> => {
        return api.post("/Groups", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateGroupCommand): Promise<TResult<boolean>> => {
        return api.put("/Groups", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Groups/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
