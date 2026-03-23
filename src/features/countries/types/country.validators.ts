import { z } from 'zod';

export const CountrySchema = z.object({
    CountryID: z.string().min(1),
    CountryName: z.string().min(1, "اسم الدولة مطلوب"),
    CountryCode: z.string().min(1, "رمز الدولة مطلوب")
});

export const CreateCountrySchema = z.object({
    CountryName: z.string().min(1, "اسم الدولة مطلوب"),
    CountryCode: z.string().min(1, "رمز الدولة مطلوب")
});

export const UpdateCountrySchema = z.object({
    CountryID: z.string().min(1),
    CountryName: z.string().min(1, "اسم الدولة مطلوب"),
    CountryCode: z.string().min(1, "رمز الدولة مطلوب")
});
