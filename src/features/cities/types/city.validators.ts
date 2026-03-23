import { z } from "zod";

export const CreateCitySchema = z.object({
    CountryID: z.string().min(1, "يجب تحديد الدولة التي تتبع لها المدينة"),
    CityName: z.string().min(1, "اسم المدينة مطلوب"),
    CityCode: z.string().nullable().optional(),
});

export const UpdateCitySchema = z.object({
    CityID: z.string().min(1),
    CountryID: z.string().min(1, "يجب تحديد الدولة التي تتبع لها المدينة"),
    CityName: z.string().min(1, "اسم المدينة مطلوب"),
    CityCode: z.string().nullable().optional(),
});
