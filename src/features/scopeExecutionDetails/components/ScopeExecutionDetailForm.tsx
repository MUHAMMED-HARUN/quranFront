import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Autocomplete,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";

import { useScopeExecutionDetailStore } from "../store/scopeExecutionDetailStore";
import {
    useCreateScopeExecutionDetailMutation,
    useUpdateScopeExecutionDetailMutation,
    useScopeExecutionDetailsByExecutionIdQuery
} from "../hooks/useScopeExecutionDetails";
import { ScopeExecutionDetailSchema } from "../types/scopeExecutionDetail.types";

import { useSearchScopeExecutionsQuery } from "../../scopeExecutions/hooks";
import { useSearchGroupsByNameQuery } from "../../groups/hooks";
import { useSearchMattersByNameQuery } from "../../matters/hooks";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks";

export const ScopeExecutionDetailForm = ({ isOpen, onClose, selectedItem }: { isOpen: boolean, onClose: () => void, selectedItem?: any }) => {
    const isEditing = !!selectedItem;
    const createMutation = useCreateScopeExecutionDetailMutation();
    const updateMutation = useUpdateScopeExecutionDetailMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(ScopeExecutionDetailSchema),
        defaultValues: {
            Id: "",
            ScopeExecutionID: "",
            GroupID: "",
            MatterID: "",
            ScopeFrom: null,
            ScopeTo: null,
            ScopeUnitTypeID: "",
            Notes: "",
            PrevScopeExecutionDetailID: null
        },
    });

    const scopeExecutionIdWatch = useWatch({
        control,
        name: "ScopeExecutionID"
    });

    const [executionSearch, setExecutionSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [matterSearch, setMatterSearch] = useState("");

    const { data: executionRes, isFetching: isExecutionSearching } = useSearchScopeExecutionsQuery(executionSearch);
    const { data: groupRes, isFetching: isGroupSearching } = useSearchGroupsByNameQuery(groupSearch);
    const { data: mattersRes, isFetching: isMatterSearching } = useSearchMattersByNameQuery(matterSearch || "");
    const { data: scopeUnitTypesRes, isFetching: isScopeUnitsLoading } = useScopeUnitTypesQuery();

    const { data: previousDetailsRes, isFetching: isPreviousDetailsLoading } = useScopeExecutionDetailsByExecutionIdQuery(scopeExecutionIdWatch);

    const executionOptions = Array.isArray(executionRes) ? executionRes : ((executionRes as any)?.Value || []);
    const groupOptions = Array.isArray(groupRes) ? groupRes : ((groupRes as any)?.Value || []);
    const matterOptions = Array.isArray(mattersRes) ? mattersRes : ((mattersRes as any)?.Value || []);
    const scopeUnitOptions = Array.isArray(scopeUnitTypesRes) ? scopeUnitTypesRes : ((scopeUnitTypesRes as any)?.Value || []);
    const previousDetailsOptions = Array.isArray(previousDetailsRes) ? previousDetailsRes : ((previousDetailsRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                Id: selectedItem.Id || selectedItem.ID,
                ScopeExecutionID: selectedItem.ScopeExecutionID || "",
                GroupID: selectedItem.GroupID || "",
                MatterID: selectedItem.MatterID || "",
                ScopeFrom: selectedItem.ScopeFrom ?? null,
                ScopeTo: selectedItem.ScopeTo ?? null,
                ScopeUnitTypeID: selectedItem.ScopeUnitTypeID || "",
                Notes: selectedItem.Notes || "",
                PrevScopeExecutionDetailID: selectedItem.PrevScopeExecutionDetailID || null
            });
        } else if (!isEditing) {
            reset({
                Id: "",
                ScopeExecutionID: "",
                GroupID: "",
                MatterID: "",
                ScopeFrom: null,
                ScopeTo: null,
                ScopeUnitTypeID: "",
                Notes: "",
                PrevScopeExecutionDetailID: null
            });
            setExecutionSearch("");
            setGroupSearch("");
            setMatterSearch("");
        }
    }, [isEditing, selectedItem, reset]);

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = (data: any) => {
        const payload = { ...data };
        if (!payload.ScopeUnitTypeID) delete payload.ScopeUnitTypeID;
        if (!payload.Notes) delete payload.Notes;

        if (isEditing) {
            updateMutation.mutate({ id: data.Id, data: payload }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(payload, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل تفاصيل التنفيذ" : "إضافة تفاصيل تنفيذ جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        {/* Scope Execution Autocomplete */}
                        <Controller
                            name="ScopeExecutionID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={executionOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isExecutionSearching}
                                    onInputChange={(e, newInputValue) => setExecutionSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.ProgramID || newValue.ClassID || newValue.GroupID || newValue.SubjectID || newValue.StudentID || "") : "")}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {option.Name}
                                            </Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ابحث عن التنفيذ (الاسم)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isExecutionSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* Group Autocomplete */}
                        <Controller
                            name="GroupID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={groupOptions}
                                    getOptionLabel={(option: any) => option.GroupName || ""}
                                    isOptionEqualToValue={(option, value) => option.GroupID === value?.GroupID || option.GroupID === value}
                                    loading={isGroupSearching}
                                    onInputChange={(e, newInputValue) => setGroupSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? newValue.GroupID : "")}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.GroupID}>
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="body1" fontWeight="bold">
                                                    {option.GroupName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    رمز: {option.Code}
                                                </Typography>
                                            </Box>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ابحث عن المجموعة"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isGroupSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Controller
                            name="MatterID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={matterOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.MatterID) === (value?.Id || value?.ID || value?.MatterID || value)}
                                    loading={isMatterSearching}
                                    onInputChange={(e, newInputValue) => setMatterSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.MatterID || "") : "")}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.MatterID}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {option.Name}
                                            </Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ابحث عن المادة"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isMatterSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Controller
                            name="ScopeUnitTypeID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    select
                                    {...field}
                                    label="وحدة النطاق (اختياري)"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                    disabled={isScopeUnitsLoading}
                                >
                                    <MenuItem value="">بدون وحدة تفصيلية</MenuItem>
                                    {scopeUnitOptions.map((opt: any) => (
                                        <MenuItem key={opt.ID || opt.Id} value={opt.ID || opt.Id}>
                                            {opt.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        {/* Previous Scope Execution Detail Autocomplete */}
                        <Controller
                            name="PrevScopeExecutionDetailID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={previousDetailsOptions}
                                    getOptionLabel={(option: any) => `من ${option.ScopeFrom} إلى ${option.ScopeTo} (${option.MatterName || option.MatterID})`}
                                    isOptionEqualToValue={(option, value) => option.Id === (value?.Id || value)}
                                    loading={isPreviousDetailsLoading}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? newValue.Id : null)}
                                    value={previousDetailsOptions.find((opt: any) => opt.Id === field.value) || null}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id}>
                                            <Typography variant="body2">
                                                من {option.ScopeFrom} إلى {option.ScopeTo} - المادة: {option.MatterName || "غير محدد"}
                                            </Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="النطاق التفصيلي السابق (اختياري)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isPreviousDetailsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Box display="flex" gap={2}>
                            <Controller
                                name="ScopeFrom"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="من"
                                        type="number"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                                    />
                                )}
                            />

                            <Controller
                                name="ScopeTo"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="إلى"
                                        type="number"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                                    />
                                )}
                            />
                        </Box>

                        <Controller
                            name="Notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ملاحظات"
                                    multiline
                                    rows={2}
                                    fullWidth
                                />
                            )}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog >
    );
};
