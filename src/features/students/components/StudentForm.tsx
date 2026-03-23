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
import { useStudentStore } from "../store/studentStore";
import {
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useStudentQuery,
} from "../hooks";
import {
    SetPersonAsStudentSchema,
    UpdateStudentSchema,
} from "../types/student.validators";

// YouTube-Style Autocomplete Hook for Person
import { useSearchPersonsByNationalNumQuery } from "../../people/hooks";

export const StudentForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useStudentStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateStudentSchema : SetPersonAsStudentSchema;

    const { data: studentResponse, isLoading: isLoadingStudent } = useStudentQuery(editId);
    const createMutation = useCreateStudentMutation();
    const updateMutation = useUpdateStudentMutation();

    const { control, handleSubmit, reset, watch } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            StudentID: "",
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
        if (isEditing && studentResponse) {
            const s = (studentResponse as any)?.Value || studentResponse;
            if (s && s.StudentID) {
                reset({
                    StudentID: s.StudentID,
                    NewPersonID: s.PersonID || "",
                });
            }
        } else if (!isEditing) {
            reset({
                StudentID: "",
                PersonID: "",
            });
            setInputValue("");
            setAutocompleteOptions([]);
        }
    }, [isEditing, studentResponse, reset]);

    // Merge the selected value into options
    let selectedPersonData: any = null;
    if (isEditing && studentResponse) {
        const s = (studentResponse as any)?.Value || studentResponse;
        if (s && s.PersonID) {
            selectedPersonData = {
                PersonID: s.PersonID,
                NationalNumber: s.NationalNumber,
                FirstName: s.FirstName,
                FatherName: s.FatherName,
                LastName: s.LastName
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
            <DialogTitle>{isEditing ? "تعديل ارتباط الطالب" : "تعيين شخص كطالب"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingStudent && isEditing ? (
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
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingStudent && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
