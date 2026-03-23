import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Country, CreateCountryCommand, UpdateCountryCommand } from "../types";

export const countryService = {
  getAll: async (): Promise<TResult<Country[]>> => {
    try {
      const response = (await api.get("/Countries")) as unknown as TResult<
        Country[]
      >;

      console.log("Response Data:", response);

      return response;
    } catch (error) {
      console.error("Network Error:", error);
      // يمكنك إعادة كائن خطأ مخصص
      return {
        IsSuccess: false,
        Value: [],
        ErrorMessage: "فشل الاتصال بالخادم",
        Error: [error instanceof Error ? error.message : "خطأ غير معروف"],
      };
    }
  },
  getById: (id: string): Promise<TResult<Country>> => {
    return api.get(`/Countries/${id}`) as unknown as Promise<TResult<Country>>;
  },
  getByName: (name: string): Promise<TResult<Country>> => {
    return api.get(`/Countries/name/${name}`) as unknown as Promise<
      TResult<Country>
    >;
  },

  searchByName: (prefix: string): Promise<TResult<Country[]>> => {
    return api.get(`/Countries/search/${prefix}`) as unknown as Promise<TResult<Country[]>>;
  },

  create: (data: CreateCountryCommand): Promise<TResult<string>> => {
    return api.post("/Countries", data) as unknown as Promise<TResult<string>>;
  },

  update: (data: UpdateCountryCommand): Promise<TResult<boolean>> => {
    return api.put("/Countries", data) as unknown as Promise<TResult<boolean>>;
  },

  delete: (id: string): Promise<TResult<boolean>> => {
    return api.delete(`/Countries/${id}`) as unknown as Promise<
      TResult<boolean>
    >;
  },

  checkExistsById: (id: string): Promise<TResult<boolean>> => {
    return api.get(`/Countries/exists/id/${id}`) as unknown as Promise<
      TResult<boolean>
    >;
  },

  checkExistsByName: (name: string): Promise<TResult<boolean>> => {
    return api.get(`/Countries/exists/name/${name}`) as unknown as Promise<
      TResult<boolean>
    >;
  },

  checkExistsByCode: (code: string): Promise<TResult<boolean>> => {
    return api.get(`/Countries/exists/code/${code}`) as unknown as Promise<
      TResult<boolean>
    >;
  },
};
