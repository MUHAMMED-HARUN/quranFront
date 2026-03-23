import React, { useEffect, useState } from "react";
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
    CircularProgress,
    MenuItem,
    Autocomplete,
    Typography,
} from "@mui/material";

import { useMatterStore } from "../store/matterStore";
import {
    useCreateMatterMutation,
    useUpdateMatterMutation,
    useMatterQuery,
} from "../hooks";
import {
    CreateMatterSchema,
    UpdateMatterSchema,
} from "../types/matter.validators";

import { useSubjectsQuery } from "../../subjects/hooks/useSubjectsQuery";

export const MatterForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useMatterStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateMatterSchema : CreateMatterSchema;

    const { data: matterResponse, isLoading: isLoadingMatter } = useMatterQuery(editId);
    const createMutation = useCreateMatterMutation();
    const updateMutation = useUpdateMatterMutation();

    const { data: subjectsRes, isLoading: isSubjectsLoading } = useSubjectsQuery();
    const subjectOptions = Array.isArray(subjectsRes) ? subjectsRes : ((subjectsRes as any)?.Value || []);

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            ID: "",
            Name: "",
            ActorName: "",
            Description: "",
            Level: "",
            MatterType: 0,
            SubjectID: "",
        },
    });

    useEffect(() => {
        if (isEditing && matterResponse) {
            const m = (matterResponse as any)?.Value || matterResponse;
            if (m && (m.ID || m.Id)) {
                reset({
                    ID: m.ID || m.Id,
                    Name: m.Name,
                    ActorName: m.ActorName || "",
                    Description: m.Description || "",
                    Level: m.Level || "",
                    MatterType: m.MatterType || 0,
                    SubjectID: m.SubjectID || "",
                });
            }
        } else if (!isEditing) {
            reset({
                ID: "",
                Name: "",
                ActorName: "",
                Description: "",
                Level: "",
                MatterType: 0,
                SubjectID: "",
            });
        }
    }, [isEditing, matterResponse, reset]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        // Prepare payload removing empty strings for optional fields
        const payload = { ...data };
        if (!payload.ActorName) delete payload.ActorName;
        if (!payload.Description) delete payload.Description;
        if (!payload.Level) delete payload.Level;

        if (isEditing) {
            updateMutation.mutate({ id: data.ID, data: payload }, {
                onSuccess: () => handleClose(),
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => handleClose(),
            });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل المادة" : "إضافة مادة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingMatter && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Controller
                                name="SubjectID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        options={subjectOptions}
                                        getOptionLabel={(option: any) => option.SubjectName || option.Name || ""}
                                        isOptionEqualToValue={(option, value) => (option.SubjectID || option.ID || option.Id) === (value?.SubjectID || value?.ID || value?.Id || value)}
                                        loading={isSubjectsLoading}
                                        onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.SubjectID || newValue.ID || newValue.Id || "") : "")}
                                        value={subjectOptions.find((opt: any) => (opt.SubjectID || opt.ID || opt.Id) === field.value) || null}
                                        renderOption={(props, option: any) => (
                                            <li {...props} key={option.SubjectID || option.ID || option.Id}>
                                                <Typography variant="body1">
                                                    {option.SubjectName || option.Name}
                                                </Typography>
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="المقرر"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                name="Name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="اسم المادة"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Box display="flex" gap={2}>
                                <Controller
                                    name="ActorName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="اسم المسؤول"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="Level"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="المستوى"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Box>

                            <Controller
                                name="MatterType"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        select
                                        {...field}
                                        label="نوع المادة"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    >
                                        <MenuItem value={0}>نظري</MenuItem>
                                        <MenuItem value={1}>عملي</MenuItem>
                                    </TextField>
                                )}
                            />

                            <Controller
                                name="Description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="الوصف"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        multiline
                                        rows={3}
                                    />
                                )}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingMatter && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
