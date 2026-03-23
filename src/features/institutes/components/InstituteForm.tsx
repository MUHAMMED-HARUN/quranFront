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
import { useInstituteStore } from "../store/instituteStore";
import {
    useCreateInstituteMutation,
    useUpdateInstituteMutation,
    useInstituteQuery,
} from "../hooks";
import {
    AddInstituteWithAddressSchema,
    UpdateInstituteSchema,
} from "../types/institute.validators";

// Hooks for Cascading Address
import { useCountriesQuery } from "../../countries/hooks";
import { useCitiesQuery } from "../../cities/hooks";
import { useDistrictsQuery } from "../../districts/hooks";
import { useNeighborhoodsQuery } from "../../neighborhoods/hooks";

export const InstituteForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useInstituteStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateInstituteSchema : AddInstituteWithAddressSchema;

    const { data: instituteResponse, isLoading: isLoadingInstitute } = useInstituteQuery(editId);
    const createMutation = useCreateInstituteMutation();
    const updateMutation = useUpdateInstituteMutation();

    const { control, handleSubmit, reset, watch, setValue } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            InstituteID: "",
            Name: "",
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

    const countries = Array.isArray(countriesRes) ? countriesRes : ((countriesRes as any)?.Value || []);
    const cities = Array.isArray(citiesRes) ? citiesRes : ((citiesRes as any)?.Value || []);
    const districts = Array.isArray(districtsRes) ? districtsRes : ((districtsRes as any)?.Value || []);
    const neighborhoods = Array.isArray(neighborhoodsRes) ? neighborhoodsRes : ((neighborhoodsRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && instituteResponse) {
            const inst = (instituteResponse as any)?.Value || instituteResponse;
            if (inst && inst.InstituteID) {
                reset({
                    InstituteID: inst.InstituteID,
                    Name: inst.Name,
                });
            }
        } else if (!isEditing) {
            reset({
                InstituteID: "",
                Name: "",
                CountryID: "",
                CityID: "",
                DistrictID: "",
                NeighborhoodID: "",
                Notes: "",
            });
        }
    }, [isEditing, instituteResponse, reset]);

    // Reset Child Dropdowns dynamically when parent changes
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
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل بيانات الجهة" : "إضافة جهة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingInstitute && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Controller name="Name" control={control} render={({ field, fieldState }) => (
                                <TextField {...field} label="اسم الجهة" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )} />

                            {!isEditing && (
                                <>
                                    <Typography variant="h6" color="primary" mt={1}>بيانات العنوان</Typography>

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
                                        <TextField {...field} label="تفاصيل إضافية للعنوان" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                                    )} />
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingInstitute && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
