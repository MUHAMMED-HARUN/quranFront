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
} from "@mui/material";
import { useClassStore } from "../store/classStore";
import {
    useCreateClassMutation,
    useUpdateClassMutation,
    useClassQuery,
} from "../hooks";
import {
    CreateClassSchema,
    UpdateClassSchema,
} from "../types/class.validators";

// YouTube-Style Autocomplete Hook
import { useSearchProgramsQuery, useProgramQuery } from "../../programs/hooks";

export const ClassForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useClassStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateClassSchema : CreateClassSchema;

    const { data: classResponse, isLoading: isLoadingClass } = useClassQuery(editId);
    const createMutation = useCreateClassMutation();
    const updateMutation = useUpdateClassMutation();

    const { control, handleSubmit, reset, watch, setValue } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            ClassID: "",
            Name: "",
            Level: 1,
            ProgramID: "",
        },
    });

    const selectedProgramID = watch("ProgramID");

    // Query for the specifically selected program if editing or initializing
    const { data: selectedProgramResponse, isLoading: isSelectedProgramLoading } = useProgramQuery(selectedProgramID);

    // Autocomplete Search State & Debounce
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue]);

    const { data: searchResults, isLoading: isSearching } = useSearchProgramsQuery(debouncedInputValue);

    useEffect(() => {
        if (searchResults) {
            const results = (searchResults as any)?.Value || [];
            setAutocompleteOptions(results);
        }
    }, [searchResults]);

    useEffect(() => {
        if (isEditing && classResponse) {
            const c = (classResponse as any)?.Value || classResponse;
            if (c && c.ClassID) {
                reset({
                    ClassID: c.ClassID,
                    Name: c.Name,
                    Level: c.Level || 1,
                    ProgramID: c.ProgramID || "",
                });
            }
        } else if (!isEditing) {
            reset({
                ClassID: "",
                Name: "",
                Level: 1,
                ProgramID: "",
            });
            setInputValue("");
            setAutocompleteOptions([]);
        }
    }, [isEditing, classResponse, reset]);

    // Merge the selected value into options so it displays correctly
    const selectedProgramData = (selectedProgramResponse as any)?.Value || selectedProgramResponse;

    const optionsToRender = [...autocompleteOptions];
    if (selectedProgramData && !optionsToRender.some(o => o.ProgramID === selectedProgramData.ProgramID)) {
        optionsToRender.push(selectedProgramData);
    }

    const handleClose = () => {
        closeForm();
        reset();
        setInputValue("");
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
            <DialogTitle>{isEditing ? "تعديل الحلقة" : "إضافة حلقة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingClass && isEditing ? (
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
                                        label="اسم الحلقة"
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
                                        type="number"
                                        label="المستوى"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        inputProps={{ min: 1 }}
                                    />
                                )}
                            />

                            <Controller
                                name="ProgramID"
                                control={control}
                                render={({ field, fieldState }) => {
                                    const selectedOption = optionsToRender.find(o => o.ProgramID === field.value) || null;

                                    return (
                                        <Autocomplete
                                            {...field}
                                            options={optionsToRender}
                                            getOptionLabel={(option) => option.Name || ""}
                                            value={selectedOption}
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue ? newValue.ProgramID : "");
                                            }}
                                            onInputChange={(_, newInputValue) => {
                                                setInputValue(newInputValue);
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                if (!value) return false;
                                                return option.ProgramID === value.ProgramID;
                                            }}
                                            loading={isSearching || isSelectedProgramLoading}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="البرنامج الأكاديمي"
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
                                                <li {...props} key={option.ProgramID}>
                                                    <Box display="flex" flexDirection="column">
                                                        <span style={{ fontWeight: "bold" }}>{option.Name}</span>
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
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingClass && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
