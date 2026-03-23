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
    CircularProgress,
    MenuItem,
} from "@mui/material";
import { useGroupStore } from "../store/groupStore";
import {
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useGroupQuery,
} from "../hooks";
import {
    AddGroupSchema,
    UpdateGroupSchema,
} from "../types/group.validators";

// Dropdown sources
import { useInstitutesQuery } from "../../institutes/hooks";
import { useInstituteClassesByInstituteIdQuery, useInstituteClassesQuery } from "../../instituteClasses/hooks";

export const GroupForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useGroupStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateGroupSchema : AddGroupSchema;

    const { data: groupResponse, isLoading: isLoadingGroup } = useGroupQuery(editId);
    const createMutation = useCreateGroupMutation();
    const updateMutation = useUpdateGroupMutation();

    const { control, handleSubmit, reset, watch, setValue } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            GroupID: "",
            InstituteClassID: "",
            GroupName: "",
            Code: "",
            // Transient field used purely for UI cascades
            InstituteID: "",
        },
    });

    const watchInstituteID = watch("InstituteID");

    const { data: instResponse, isLoading: isInstLoading } = useInstitutesQuery();
    const { data: filteredIcResponse, isLoading: isIcLoading } = useInstituteClassesByInstituteIdQuery(watchInstituteID);

    // Need to resolve the InstituteID automatically if editing
    const { data: allIcResponse } = useInstituteClassesQuery();

    const institutes = Array.isArray(instResponse) ? instResponse : ((instResponse as any)?.Value || []);
    const instituteClasses = Array.isArray(filteredIcResponse) ? filteredIcResponse : ((filteredIcResponse as any)?.Value || []);
    const allInstituteClasses = Array.isArray(allIcResponse) ? allIcResponse : ((allIcResponse as any)?.Value || []);

    useEffect(() => {
        if (isEditing && groupResponse) {
            const g = (groupResponse as any)?.Value || groupResponse;
            if (g && g.GroupID) {

                // Find which Institute this class belongs to so we can prepopulate the first dropdown safely
                const matchedClass = allInstituteClasses.find((ic: any) => ic.InstituteClassID === g.InstituteClassID);
                const resolvedInstituteID = matchedClass ? matchedClass.InstituteID : "";

                reset({
                    GroupID: g.GroupID,
                    InstituteClassID: g.InstituteClassID,
                    GroupName: g.GroupName,
                    Code: g.Code,
                    InstituteID: resolvedInstituteID,
                });
            }
        } else if (!isEditing) {
            reset({
                GroupID: "",
                InstituteClassID: "",
                GroupName: "",
                Code: "",
                InstituteID: "",
            });
        }
    }, [isEditing, groupResponse, reset, allInstituteClasses]);

    // Reset Child Dropdown dynamically when parent changes
    useEffect(() => {
        // Only reset if it's not the initial mounting of edit data
        if (watchInstituteID) {
            // Small safeguard: if editing, we only want to reset IF the user explicitly clicks a NEW institute
            // We'll rely on the user to change it. Currently we just clear it whenever InstituteID changes and it is a user action.
            // But we must prevent clearing it if it was just populated by the DB reset.
            // Easiest approach: don't auto-reset it on edit, let the user deal with it, or be careful.
            if (!isEditing) {
                setValue("InstituteClassID", "", { shouldValidate: true });
            }
        }
    }, [watchInstituteID, isEditing, setValue]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        // Clean up temporary UI fields before submission
        const submitData = {
            GroupID: data.GroupID,
            InstituteClassID: data.InstituteClassID,
            GroupName: data.GroupName,
            Code: data.Code,
        };

        if (isEditing) {
            updateMutation.mutate(submitData, { onSuccess: handleClose });
        } else {
            createMutation.mutate(submitData, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل المجموعة" : "إضافة مجموعة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingGroup && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>

                            <Controller
                                name="InstituteID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="اختر الجهة/المعهد"
                                        error={false}
                                        fullWidth
                                        disabled={isInstLoading}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            // We forcefully clear InstituteClassID when the user changes Institute
                                            setValue("InstituteClassID", "", { shouldValidate: true });
                                        }}
                                    >
                                        <MenuItem value="">اختر...</MenuItem>
                                        {institutes.map((inst: any) => (
                                            <MenuItem key={inst.InstituteID} value={inst.InstituteID}>
                                                {inst.Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            <Controller
                                name="InstituteClassID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="اختر الحلقة الدراسية"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        disabled={!watchInstituteID || isIcLoading}
                                    >
                                        <MenuItem value="">اختر...</MenuItem>
                                        {instituteClasses.map((ic: any) => (
                                            <MenuItem key={ic.InstituteClassID} value={ic.InstituteClassID}>
                                                {ic.Class?.Name || ic.InstituteClassID}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            <Controller
                                name="GroupName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="اسم المجموعة"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="Code"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="رمز المجموعة"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSaving || (isLoadingGroup && isEditing)}
                    >
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
