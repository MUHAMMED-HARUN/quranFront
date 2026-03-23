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
import { useAssessmentScopesQuery, useDeleteAssessmentScopeMutation } from "../hooks";
import { useAssessmentScopeStore } from "../store/assessmentScopeStore";

export const AssessmentScopeTable = ({ onOpenForm, onOpenView }: { onOpenForm: (item: any) => void; onOpenView: (item: any) => void }) => {
    const { data: scopesResponse, isLoading } = useAssessmentScopesQuery();
    const deleteMutation = useDeleteAssessmentScopeMutation();
    const { selectedIds, setSelectedIds } = useAssessmentScopeStore();

    if (isLoading) return <Typography>جاري التحميل...</Typography>;

    const scopes = Array.isArray(scopesResponse) ? scopesResponse : ((scopesResponse as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(scopes.map((s: any) => s.ID || s.Id));
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
        if (window.confirm("هل أنت متأكد من حذف هذا النطاق؟")) {
            deleteMutation.mutate(id);
        }
    };

    const getScopeTypeName = (type: number) => {
        switch (type) {
            case 0: return "تلقائي";
            case 1: return "مخصص";
            default: return "غير معروف";
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < scopes.length}
                                checked={scopes.length > 0 && selectedIds.length === scopes.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>الاسم</TableCell>
                        <TableCell>نوع النطاق</TableCell>
                        <TableCell>تاريخ البداية</TableCell>
                        <TableCell>تاريخ النهاية</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scopes.map((scope: any) => {
                        const id = scope.ID || scope.Id;
                        const isSelected = selectedIds.includes(id);
                        return (
                            <TableRow key={id} selected={isSelected}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleSelect(id)}
                                    />
                                </TableCell>
                                <TableCell>{scope.Name}</TableCell>
                                <TableCell>{getScopeTypeName(scope.ScopeType)}</TableCell>
                                <TableCell>{scope.StartDate ? new Date(scope.StartDate).toLocaleDateString("ar-EG") : "-"}</TableCell>
                                <TableCell>{scope.EndDate ? new Date(scope.EndDate).toLocaleDateString("ar-EG") : "-"}</TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        <IconButton color="info" onClick={() => onOpenView(scope)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => onOpenForm(scope)}>
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
                    {scopes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                لا توجد نطاقات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
