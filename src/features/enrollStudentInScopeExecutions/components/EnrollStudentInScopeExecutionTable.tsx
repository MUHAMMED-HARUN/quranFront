import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    Box,
    CircularProgress,
    Chip
} from "@mui/material";
import { useEnrollStudentsByScopeExecutionIdQuery } from "../hooks/useEnrollStudentInScopeExecutions";
import { useEnrollStudentInScopeExecutionStore } from "../store/enrollStudentInScopeExecutionStore";
import { EnrollmentStatus } from "../types/enrollStudentInScopeExecution.types";

interface EnrollStudentInScopeExecutionTableProps {
    scopeExecutionId: string | null;
    onOpenView: (item: any) => void;
}

const statusTextMap: Record<number, string> = {
    [EnrollmentStatus.Pending]: "معلق",
    [EnrollmentStatus.InProgress]: "قيد التنفيذ",
    [EnrollmentStatus.Completed]: "مكتمل",
    [EnrollmentStatus.Failed]: "فاشل",
};

const statusColorMap: Record<number, "default" | "primary" | "secondary" | "success" | "warning" | "error"> = {
    [EnrollmentStatus.Pending]: "primary",
    [EnrollmentStatus.InProgress]: "warning",
    [EnrollmentStatus.Completed]: "success",
    [EnrollmentStatus.Failed]: "error",
};

export const EnrollStudentInScopeExecutionTable = ({ scopeExecutionId, onOpenView }: EnrollStudentInScopeExecutionTableProps) => {
    const { data: response, isLoading } = useEnrollStudentsByScopeExecutionIdQuery(scopeExecutionId);
    const enrollments = Array.isArray((response as any)?.Value) ? (response as any).Value : [];

    const { selectedIds, toggleSelection, filters } = useEnrollStudentInScopeExecutionStore();

    const filteredData = enrollments.filter((item: any) => {
        if (filters.search) {
            const matchesSearch = item.StudentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.NationalNumber?.includes(filters.search);
            if (!matchesSearch) return false;
        }
        return true;
    });

    if (!scopeExecutionId) {
        return (
            <Box p={4} textAlign="center">
                <Typography color="textSecondary">الرجاء اختيار نطاق دراسي لعرض الطلبة المسجلين</Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (filteredData.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Typography color="textSecondary">لا توجد سجلات لعرضها</Typography>
            </Box>
        );
    }

    const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredData.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            useEnrollStudentInScopeExecutionStore.getState().setSelectedIds([]);
        } else {
            useEnrollStudentInScopeExecutionStore.getState().setSelectedIds(filteredData.map((d: any) => d.Id));
        }
    };

    return (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell><Typography fontWeight="bold">الرقم الوطني</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">اسم الطالب</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">تاريخ التسجيل</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">الحالة</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map((row: any) => {
                        const isSelected = selectedIds.includes(row.Id);
                        return (
                            <TableRow
                                key={row.Id}
                                hover
                                selected={isSelected}
                                sx={{ cursor: "pointer", "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(row.Id);
                                }}>
                                    <Checkbox checked={isSelected} />
                                </TableCell>
                                <TableCell onClick={() => onOpenView(row)}>
                                    {row.NationalNumber}
                                </TableCell>
                                <TableCell onClick={() => onOpenView(row)}>
                                    {row.StudentName}
                                </TableCell>
                                <TableCell onClick={() => onOpenView(row)}>
                                    {String(row.EnrollmentDate).split("T")[0]}
                                </TableCell>
                                <TableCell onClick={() => onOpenView(row)}>
                                    <Chip
                                        label={statusTextMap[row.Status] || "غير معروف"}
                                        color={statusColorMap[row.Status] || "default"}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
