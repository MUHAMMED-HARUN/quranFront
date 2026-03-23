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
import { useSubjectStore } from "../store/subjectStore";
import {
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useSubjectQuery,
} from "../hooks";
import {
    CreateSubjectSchema,
    UpdateSubjectSchema,
} from "../types/subject.validators";

export const SubjectForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useSubjectStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateSubjectSchema : CreateSubjectSchema;

    const { data: subjectResponse, isLoading: isLoadingSubject } = useSubjectQuery(editId);
    const createMutation = useCreateSubjectMutation();
    const updateMutation = useUpdateSubjectMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            SubjectID: "",
            SubjectName: "",
            Notes: "",
        },
    });

    useEffect(() => {
        if (isEditing && subjectResponse) {
            const s = (subjectResponse as any)?.Value || subjectResponse;
            if (s && s.SubjectID) {
                reset({
                    SubjectID: s.SubjectID,
                    SubjectName: s.SubjectName,
                    Notes: s.Notes || "",
                });
            }
        } else if (!isEditing) {
            reset({
                SubjectID: "",
                SubjectName: "",
                Notes: "",
            });
        }
    }, [isEditing, subjectResponse, reset]);

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
            <DialogTitle>{isEditing ? "تعديل المادة" : "إضافة مادة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingSubject && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Controller
                                name="SubjectName"
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
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingSubject && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
