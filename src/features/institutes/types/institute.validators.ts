import { z } from "zod";

export const AddInstituteWithAddressSchema = z.object({
    Name: z.string().min(2, "اسم الجهة مطلوب"),
    CountryID: z.string().min(1, "الدولة مطلوبة"),
    CityID: z.string().min(1, "المدينة مطلوبة"),
    DistrictID: z.string().min(1, "المنطقة مطلوبة"),
    NeighborhoodID: z.string().min(1, "الحي/المحلة مطلوب"),
    Notes: z.string().optional(),
});

export const UpdateInstituteSchema = z.object({
    InstituteID: z.string().min(1, "معرف الجهة مطلوب"),
    Name: z.string().min(2, "اسم الجهة مطلوب"),
});
