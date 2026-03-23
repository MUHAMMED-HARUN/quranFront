import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem,
    CircularProgress,
    Typography,
} from "@mui/material";
import { usePersonStore } from "../store/personStore";
import {
    useCreatePersonMutation,
    useUpdatePersonMutation,
    usePersonQuery,
} from "../hooks";
import {
    AddPersonWithAddressSchema,
    UpdatePersonSchema,
} from "../types/person.validators";

// Hooks for Cascading Address
import { useCountriesQuery } from "../../countries/hooks";
import { useCitiesQuery } from "../../cities/hooks";
import { useDistrictsQuery } from "../../districts/hooks";
import { useNeighborhoodsQuery } from "../../neighborhoods/hooks";

export const PersonForm = () => {
    const { isFormOpen, closeForm, selectedIds } = usePersonStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdatePersonSchema : AddPersonWithAddressSchema;

    const { data: personResponse, isLoading: isLoadingPerson } = usePersonQuery(editId);
    const createMutation = useCreatePersonMutation();
    const updateMutation = useUpdatePersonMutation();

    const { control, handleSubmit, reset, watch, setValue, formState } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            PersonID: "",
            FirstName: "",
            FatherName: "",
            LastName: "",
            MotherName: "",
            MotherLastName: "",
            NationalNumber: "",
            Gender: true,
            BirthDate: "",
            CountryID: "",
            CityID: "",
            DistrictID: "",
            NeighborhoodID: "",
            Notes: "",
        },
    });

    // Watch for Cascading Effects
    const watchCountryID = watch("CountryID");
    const watchCityID = watch("CityID");
    const watchDistrictID = watch("DistrictID");

    // Cascading Queries
    const { data: countriesRes, isLoading: isCountriesLoading } = useCountriesQuery();
    const { data: citiesRes, isLoading: isCitiesLoading } = useCitiesQuery(watchCountryID);
    const { data: districtsRes, isLoading: isDistrictsLoading } = useDistrictsQuery(watchCityID);
    const { data: neighborhoodsRes, isLoading: isNeighborhoodsLoading } = useNeighborhoodsQuery(watchDistrictID);

    const countries = (countriesRes as any)?.Value || [];
    const cities = (citiesRes as any)?.Value || [];
    const districts = (districtsRes as any)?.Value || [];
    const neighborhoods = (neighborhoodsRes as any)?.Value || [];

    useEffect(() => {
        if (isEditing && personResponse) {
            const p = (personResponse as any)?.Value || personResponse;
            if (p && p.PersonID) {
                reset({
                    PersonID: p.PersonID,
                    FirstName: p.FirstName,
                    FatherName: p.FatherName,
                    LastName: p.LastName,
                    MotherName: p.MotherName,
                    MotherLastName: p.MotherLastName,
                    NationalNumber: p.NationalNumber,
                    Gender: p.Gender,
                    BirthDate: p.BirthDate ? p.BirthDate.split("T")[0] : "",
                    // Note: Backend might not return address in PersonDTO usually (we only update basic details in Update)
                });
            }
        } else if (!isEditing) {
            reset({
                PersonID: "",
                FirstName: "",
                FatherName: "",
                LastName: "",
                MotherName: "",
                MotherLastName: "",
                NationalNumber: "",
                Gender: true,
                BirthDate: "",
                CountryID: "",
                CityID: "",
                DistrictID: "",
                NeighborhoodID: "",
                Notes: "",
            });
        }
    }, [isEditing, personResponse, reset]);

    // Reset Child Dropdowns dynamically when parent changes via user interaction
    useEffect(() => {
        if (!isEditing && watchCountryID) {
            setValue("CityID", "", { shouldValidate: true });
            setValue("DistrictID", "", { shouldValidate: true });
            setValue("NeighborhoodID", "", { shouldValidate: true });
        }
    }, [watchCountryID, isEditing, setValue]);

    useEffect(() => {
        if (!isEditing && watchCityID) {
            setValue("DistrictID", "", { shouldValidate: true });
            setValue("NeighborhoodID", "", { shouldValidate: true });
        }
    }, [watchCityID, isEditing, setValue]);

    useEffect(() => {
        if (!isEditing && watchDistrictID) {
            setValue("NeighborhoodID", "", { shouldValidate: true });
        }
    }, [watchDistrictID, isEditing, setValue]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        if (isEditing) {
            updateMutation.mutate(data, {
                onSuccess: () => handleClose(),
            });
        } else {
            createMutation.mutate(data, {
                onSuccess: () => handleClose(),
            });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditing ? "تعديل بيانات الشخص" : "إضافة شخص جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingPerson && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
                            <Controller name="FirstName" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="الاسم الأول" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />
                            <Controller name="FatherName" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="اسم الأب" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />
                            <Controller name="LastName" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="العائلة/الجد" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />
                            <Controller name="MotherName" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="اسم الأم" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />
                            <Controller name="MotherLastName" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="كنية الأم" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />
                            <Controller name="NationalNumber" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="الرقم الوطني" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />
                            <Controller name="Gender" control={control} render={({ field }) => (
                                <TextField {...field} select label="الجنس" fullWidth>
                                    <MenuItem value={true as any}>ذكر</MenuItem>
                                    <MenuItem value={false as any}>أنثى</MenuItem>
                                </TextField>
                            )} />
                            <Controller name="BirthDate" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="تاريخ الميلاد" type="date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />

                            {!isEditing && (
                                <>
                                    <Box gridColumn="span 2" mt={2}>
                                        <Typography variant="h6" color="primary">بيانات العنوان</Typography>
                                    </Box>

                                    <Controller name="CountryID" control={control} render={({ field, fieldState }) => (
                                        <TextField {...field} select label="الدولة" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth disabled={isCountriesLoading}>
                                            <MenuItem value="">اختر...</MenuItem>
                                            {countries.map((c: any) => (<MenuItem key={c.CountryID} value={c.CountryID}>{c.CountryName}</MenuItem>))}
                                        </TextField>
                                    )} />

                                    <Controller name="CityID" control={control} render={({ field, fieldState }) => (
                                        <TextField {...field} select label="المدينة" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth disabled={!watchCountryID || isCitiesLoading}>
                                            <MenuItem value="">اختر...</MenuItem>
                                            {cities.map((c: any) => (<MenuItem key={c.CityID} value={c.CityID}>{c.CityName}</MenuItem>))}
                                        </TextField>
                                    )} />

                                    <Controller name="DistrictID" control={control} render={({ field, fieldState }) => (
                                        <TextField {...field} select label="المنطقة/القضاء" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth disabled={!watchCityID || isDistrictsLoading}>
                                            <MenuItem value="">اختر...</MenuItem>
                                            {districts.map((d: any) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                                        </TextField>
                                    )} />

                                    <Controller name="NeighborhoodID" control={control} render={({ field, fieldState }) => (
                                        <TextField {...field} select label="الحي/المحلة" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth disabled={!watchDistrictID || isNeighborhoodsLoading}>
                                            <MenuItem value="">اختر...</MenuItem>
                                            {neighborhoods.map((n: any) => (<MenuItem key={n.NeighborhoodID} value={n.NeighborhoodID}>{n.NeighborhoodName}</MenuItem>))}
                                        </TextField>
                                    )} />

                                    <Controller name="Notes" control={control} render={({ field, fieldState }) => (
                                        <TextField {...field} label="تفاصيل إضافية للعنوان" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth sx={{ gridColumn: "span 2" }} />
                                    )} />
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingPerson && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
