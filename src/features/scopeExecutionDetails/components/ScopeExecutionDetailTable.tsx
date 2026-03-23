import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Checkbox,
    Box,
    Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { useScopeExecutionDetailsQuery, useDeleteScopeExecutionDetailMutation } from "../hooks/useScopeExecutionDetails";
import { useScopeExecutionDetailStore } from "../store/scopeExecutionDetailStore";

export const ScopeExecutionDetailTable = ({ onOpenForm, onOpenView }: { onOpenForm: (item: any) => void; onOpenView: (item: any) => void }) => {
    const { data: response, isLoading } = useScopeExecutionDetailsQuery();
    const deleteMutation = useDeleteScopeExecutionDetailMutation();
    const { selectedIds, setSelectedIds } = useScopeExecutionDetailStore();

    if (isLoading) return <Typography>جاري التحميل...</Typography>;

    const details = Array.isArray(response) ? response : ((response as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(details.map((s: any) => s.Id || s.ID));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("هل أنت متأكد من حذف تفاصيل التنفيذ؟")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < details.length}
                                checked={details.length > 0 && selectedIds.length === details.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>التنفيذ</TableCell>
                        <TableCell>المجموعة</TableCell>
                        <TableCell>من - إلى</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {details.map((detail: any) => {
                        const id = detail.Id || detail.ID;
                        const isSelected = selectedIds.includes(id);
                        return (
                            <TableRow key={id} selected={isSelected}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleSelect(id)}
                                    />
                                </TableCell>
                                <TableCell>{detail.ScopeExecutionName || detail.ScopeExecutionID}</TableCell>
                                <TableCell>{detail.GroupName || detail.GroupID}</TableCell>
                                <TableCell>
                                    {detail.ScopeFrom != null && detail.ScopeTo != null
                                        ? detail.ScopeFrom + " - " + detail.ScopeTo
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        <IconButton color="info" onClick={() => onOpenView(detail)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => onOpenForm(detail)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {details.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                لا توجد تفاصيل
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
