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
} from "@mui/material";
import { useScopeUnitTypeStore } from "../store/scopeUnitTypeStore";
import {
    useCreateScopeUnitTypeMutation,
    useUpdateScopeUnitTypeMutation,
} from "../hooks";
import { useScopeUnitTypesQuery } from "../hooks";
import {
    AddScopeUnitTypeSchema,
    UpdateScopeUnitTypeSchema,
} from "../types/scopeUnitType.validators";

export const ScopeUnitTypeForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useScopeUnitTypeStore();
    const { data: allResponse } = useScopeUnitTypesQuery();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateScopeUnitTypeSchema : AddScopeUnitTypeSchema;

    const createMutation = useCreateScopeUnitTypeMutation();
    const updateMutation = useUpdateScopeUnitTypeMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            ID: "",
            Name: "",
            LevelNumber: 0,
            Notes: "",
        },
    });

    useEffect(() => {
        if (isEditing && allResponse && editId) {
            const arr = (allResponse as any)?.Value || allResponse || [];
            const entity = arr.find((x: any) => x.ID === editId);
            if (entity) {
                reset({
                    ID: entity.ID,
                    Name: entity.Name,
                    LevelNumber: entity.LevelNumber,
                    Notes: entity.Notes || "",
                });
            }
        } else if (!isEditing) {
            reset({
                ID: "",
                Name: "",
                LevelNumber: 0,
                Notes: "",
            });
        }
    }, [isEditing, allResponse, editId, reset]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        if (isEditing) {
            updateMutation.mutate(data, { onSuccess: handleClose });
        } else {
            createMutation.mutate(data, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل النوع" : "إضافة نوع جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        <Controller
                            name="Name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="اسم الوحدة"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="LevelNumber"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="المستوى"
                                    type="number"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="Notes"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="ملاحظات"
                                    multiline
                                    rows={3}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSaving}
                    >
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
