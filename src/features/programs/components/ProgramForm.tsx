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
} from "@mui/material";
import { useProgramStore } from "../store/programStore";
import {
    useCreateProgramMutation,
    useUpdateProgramMutation,
    useProgramQuery,
} from "../hooks";
import {
    CreateProgramSchema,
    UpdateProgramSchema,
} from "../types/program.validators";

export const ProgramForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useProgramStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateProgramSchema : CreateProgramSchema;

    const { data: programResponse, isLoading: isLoadingProgram } = useProgramQuery(editId);
    const createMutation = useCreateProgramMutation();
    const updateMutation = useUpdateProgramMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            ProgramID: "",
            Name: "",
            Notes: "",
        },
    });

    useEffect(() => {
        if (isEditing && programResponse) {
            const p = (programResponse as any)?.Value || programResponse;
            if (p && p.ProgramID) {
                reset({
                    ProgramID: p.ProgramID,
                    Name: p.Name,
                    Notes: p.Notes || "",
                });
            }
        } else if (!isEditing) {
            reset({
                ProgramID: "",
                Name: "",
                Notes: "",
            });
        }
    }, [isEditing, programResponse, reset]);

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
            <DialogTitle>{isEditing ? "تعديل البرنامج" : "إضافة برنامج جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingProgram && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Controller
                                name="Name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="اسم البرنامج"
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
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingProgram && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
