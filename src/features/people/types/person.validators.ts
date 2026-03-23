import { z } from "zod";

export const AddPersonWithAddressSchema = z.object({
    FirstName: z.string().min(2, "الاسم الأول يعتد به"),
    FatherName: z.string().min(2, "اسم الأب يعتد به"),
    LastName: z.string().min(2, "اسم العائلة/الجد يعتد به"),
    MotherName: z.string().min(2, "اسم الأم يعتد به"),
    MotherLastName: z.string().min(2, "كنية الأم تعتد بها"),
    NationalNumber: z.string().min(10, "الرقم الوطني يجب أن يكون 10 أرقام على الأقل"),
    Gender: z.boolean(),
    BirthDate: z.string().min(1, "تاريخ الميلاد يعتد به"),
    CountryID: z.string().min(1, "الدولة مطلوبة"),
    CityID: z.string().min(1, "المدينة مطلوبة"),
    DistrictID: z.string().min(1, "المنطقة مطلوبة"),
    NeighborhoodID: z.string().min(1, "الحي/المحلة مطلوب"),
    Notes: z.string().optional(),
});

export const UpdatePersonSchema = z.object({
    PersonID: z.string().min(1, "معرف الشخص مطلوب"),
    FirstName: z.string().min(2, "الاسم الأول يعتد به"),
    FatherName: z.string().min(2, "اسم الأب يعتد به"),
    LastName: z.string().min(2, "اسم العائلة/الجد يعتد به"),
    MotherName: z.string().min(2, "اسم الأم يعتد به"),
    MotherLastName: z.string().min(2, "كنية الأم تعتد بها"),
    NationalNumber: z.string().min(10, "الرقم الوطني يجب أن يكون 10 أرقام على الأقل"),
    Gender: z.boolean(),
    BirthDate: z.string().min(1, "تاريخ الميلاد يعتد به"),
});
