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
import { useInstituteClassStore } from "../store/instituteClassStore";
import {
    useCreateInstituteClassMutation,
    useUpdateInstituteClassMutation,
    useInstituteClassQuery,
} from "../hooks";
import {
    CreateInstituteClassSchema,
    UpdateInstituteClassSchema,
} from "../types/instituteClass.validators";

// External Hooks
import { useSearchInstitutesQuery, useInstituteQuery } from "../../institutes/hooks";
import { useSearchClassesQuery, useClassQuery } from "../../classes/hooks";

export const InstituteClassForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useInstituteClassStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateInstituteClassSchema : CreateInstituteClassSchema;

    const { data: recordResponse, isLoading: isLoadingRecord } = useInstituteClassQuery(editId);
    const createMutation = useCreateInstituteClassMutation();
    const updateMutation = useUpdateInstituteClassMutation();

    const { control, handleSubmit, reset, watch } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            InstituteClassID: "",
            InstituteID: "",
            ClassID: "",
        },
    });

    const selectedInstituteID = watch("InstituteID");
    const selectedClassID = watch("ClassID");

    const { data: instituteRes, isLoading: isInstituteLoading } = useInstituteQuery(selectedInstituteID);
    const { data: classRes, isLoading: isClassLoading } = useClassQuery(selectedClassID);

    // Institute Autocomplete State
    const [instInput, setInstInput] = useState("");
    const [debouncedInstInput, setDebouncedInstInput] = useState("");
    const [instOptions, setInstOptions] = useState<any[]>([]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedInstInput(instInput), 500);
        return () => clearTimeout(handler);
    }, [instInput]);

    const { data: instSearchRes, isLoading: isSearchingInst } = useSearchInstitutesQuery(debouncedInstInput);

    useEffect(() => {
        if (instSearchRes) {
            setInstOptions((instSearchRes as any)?.Value || []);
        }
    }, [instSearchRes]);

    // Class Autocomplete State
    const [clsInput, setClsInput] = useState("");
    const [debouncedClsInput, setDebouncedClsInput] = useState("");
    const [clsOptions, setClsOptions] = useState<any[]>([]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedClsInput(clsInput), 500);
        return () => clearTimeout(handler);
    }, [clsInput]);

    const { data: clsSearchRes, isLoading: isSearchingCls } = useSearchClassesQuery(debouncedClsInput);

    useEffect(() => {
        if (clsSearchRes) {
            setClsOptions((clsSearchRes as any)?.Value || []);
        }
    }, [clsSearchRes]);

    useEffect(() => {
        if (isEditing && recordResponse) {
            const r = (recordResponse as any)?.Value || recordResponse;
            if (r && r.InstituteClassID) {
                reset({
                    InstituteClassID: r.InstituteClassID,
                    InstituteID: r.InstituteID,
                    ClassID: r.Class?.ClassID || "",
                });
            }
        } else if (!isEditing) {
            reset({
                InstituteClassID: "",
                InstituteID: "",
                ClassID: "",
            });
            setInstInput("");
            setClsInput("");
            setInstOptions([]);
            setClsOptions([]);
        }
    }, [isEditing, recordResponse, reset]);

    // Merge selected options gracefully
    const selectedInstData = (instituteRes as any)?.Value || instituteRes;
    const renderInstOptions = [...instOptions];
    if (selectedInstData && !renderInstOptions.some(o => o.InstituteID === selectedInstData.InstituteID)) {
        renderInstOptions.push(selectedInstData);
    }

    const selectedClsData = (classRes as any)?.Value || classRes;
    const renderClsOptions = [...clsOptions];
    if (selectedClsData && !renderClsOptions.some(o => o.ClassID === selectedClsData.ClassID)) {
        renderClsOptions.push(selectedClsData);
    }

    const handleClose = () => {
        closeForm();
        reset();
        setInstInput("");
        setClsInput("");
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
            <DialogTitle>{isEditing ? "تعديل ارتباط جهة-حلقة" : "ارتباط حلقة بجهة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingRecord && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Controller
                                name="InstituteID"
                                control={control}
                                render={({ field, fieldState }) => {
                                    const selectedOption = renderInstOptions.find(o => o.InstituteID === field.value) || null;
                                    return (
                                        <Autocomplete
                                            {...field}
                                            options={renderInstOptions}
                                            getOptionLabel={(option) => option.Name || ""}
                                            value={selectedOption}
                                            onChange={(_, newValue) => field.onChange(newValue ? newValue.InstituteID : "")}
                                            onInputChange={(_, newInputValue) => setInstInput(newInputValue)}
                                            isOptionEqualToValue={(option, value) => option.InstituteID === value.InstituteID}
                                            loading={isSearchingInst || isInstituteLoading}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="الجهة/المعهد"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {isSearchingInst ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.InstituteID}>
                                                    <Box display="flex" flexDirection="column">
                                                        <span style={{ fontWeight: "bold" }}>{option.Name}</span>
                                                    </Box>
                                                </li>
                                            )}
                                        />
                                    );
                                }}
                            />

                            <Controller
                                name="ClassID"
                                control={control}
                                render={({ field, fieldState }) => {
                                    const selectedOption = renderClsOptions.find(o => o.ClassID === field.value) || null;
                                    return (
                                        <Autocomplete
                                            {...field}
                                            options={renderClsOptions}
                                            getOptionLabel={(option) => option.Name || ""}
                                            value={selectedOption}
                                            onChange={(_, newValue) => field.onChange(newValue ? newValue.ClassID : "")}
                                            onInputChange={(_, newInputValue) => setClsInput(newInputValue)}
                                            isOptionEqualToValue={(option, value) => option.ClassID === value.ClassID}
                                            loading={isSearchingCls || isClassLoading}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="الحلقة"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {isSearchingCls ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.ClassID}>
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
                    <Button type="submit" variant="contained" disabled={isSaving || (isLoadingRecord && isEditing)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
