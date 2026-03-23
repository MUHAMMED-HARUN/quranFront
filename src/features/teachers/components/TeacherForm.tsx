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
    Autocomplete,
    Typography,
} from "@mui/material";
import { useTeacherStore } from "../store/teacherStore";
import {
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useTeacherQuery,
} from "../hooks";
import {
    SetPersonAsTeacherSchema,
    UpdateTeacherSchema,
} from "../types/teacher.validators";

// YouTube-Style Autocomplete Hook for Person
import { useSearchPersonsByNationalNumQuery } from "../../people/hooks";

export const TeacherForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useTeacherStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateTeacherSchema : SetPersonAsTeacherSchema;

    const { data: teacherResponse, isLoading: isLoadingTeacher } = useTeacherQuery(editId);
    const createMutation = useCreateTeacherMutation();
    const updateMutation = useUpdateTeacherMutation();

    const { control, handleSubmit, reset, watch } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            TeacherID: "",
            PersonID: "", // for Create
            NewPersonID: "", // for Update
        },
    });

    // Autocomplete Search State
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue]);

    const { data: searchResults, isLoading: isSearching } = useSearchPersonsByNationalNumQuery(debouncedInputValue);

    useEffect(() => {
        if (searchResults) {
            setAutocompleteOptions((searchResults as any)?.Value || []);
        }
    }, [searchResults]);

    useEffect(() => {
        if (isEditing && teacherResponse) {
            const t = (teacherResponse as any)?.Value || teacherResponse;
            if (t && t.TeacherID) {
                reset({
                    TeacherID: t.TeacherID,
                    NewPersonID: t.PersonID || "",
                });
            }
        } else if (!isEditing) {
            reset({
                TeacherID: "",
                PersonID: "",
                NewPersonID: "",
            });
            setInputValue("");
            setAutocompleteOptions([]);
        }
    }, [isEditing, teacherResponse, reset]);

    // Merge the selected value into options
    let selectedPersonData: any = null;
    if (isEditing && teacherResponse) {
        const t = (teacherResponse as any)?.Value || teacherResponse;
        if (t && t.PersonID) {
            selectedPersonData = {
                PersonID: t.PersonID,
                NationalNumber: t.NationalNumber,
                FirstName: t.FirstName,
                FatherName: t.FatherName,
                LastName: t.LastName
            };
        }
    }

    const optionsToRender = [...autocompleteOptions];
    if (selectedPersonData && !optionsToRender.some(o => o.PersonID === selectedPersonData.PersonID)) {
        optionsToRender.push(selectedPersonData);
    }

    const handleClose = () => {
        closeForm();
        reset();
        setInputValue("");
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
            <DialogTitle>{isEditing ? "تعديل ارتباط المعلم" : "تعيين شخص كمعلم"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingTeacher && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Controller
                                name={isEditing ? "NewPersonID" : "PersonID"}
                                control={control}
                                render={({ field, fieldState }) => {
                                    const selectedOption = optionsToRender.find(o => o.PersonID === field.value) || null;
                                    return (
                                        <Autocomplete
                                            {...field}
                                            options={optionsToRender}
                                            getOptionLabel={(option) => {
                                                if (!option) return "";
                                                return `${option.NationalNumber} - ${option.FirstName} ${option.LastName}`;
                                            }}
                                            value={selectedOption}
                                            onChange={(_, newValue) => field.onChange(newValue ? newValue.PersonID : "")}
                                            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                                            isOptionEqualToValue={(option, value) => option.PersonID === value.PersonID}
                                            loading={isSearching}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="ابحث برقم الهوية"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.PersonID}>
                                                    <Box display="flex" flexDirection="column">
                                                        <span style={{ fontWeight: "bold" }}>{option.NationalNumber}</span>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {option.FirstName} {option.FatherName} {option.LastName}
                                                        </Typography>
                                                    </Box>
                                                </li>
                                            )}
                                        />
                                    );
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingTeacher && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
