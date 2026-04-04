import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useStudentScopeExecutionsDetailsRegistersWithDetailsQuery, useDeleteStudentScopeExecutionsDetailsRegisterMutation } from "../hooks/useStudentScopeExecutionsDetailsRegisters";

export const StudentScopeExecutionsDetailsRegisterTable = () => {
    const { data: response, isLoading } = useStudentScopeExecutionsDetailsRegistersWithDetailsQuery();
    const deleteMutation = useDeleteStudentScopeExecutionsDetailsRegisterMutation();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" m={4}>
                <CircularProgress />
            </Box>
        );
    }

    // Access the records either correctly from the API structure or fallback to empty array
    const data = Array.isArray(response) ? response : (response?.Value || []);

    const handleDelete = (id: string) => {
        if (window.confirm("هل أنت متأكد من الحذف؟")) {
            deleteMutation.mutate(id);
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 1: return "ناجح";
            case 2: return "قيد الإنجاز";
            case 3: return "منسحب";
            default: return "غير معروف";
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ bgcolor: "primary.main" }}>
                    <TableRow>
                        <TableCell sx={{ color: "white" }}>اسم الطالب</TableCell>
                        <TableCell sx={{ color: "white" }}>المجموعة</TableCell>
                        <TableCell sx={{ color: "white" }}>اسم التنفيذ</TableCell>
                        <TableCell sx={{ color: "white" }}>نوع النطاق</TableCell>
                        <TableCell sx={{ color: "white" }}>النطاق (من - إلى)</TableCell>
                        <TableCell sx={{ color: "white" }}>الحالة</TableCell>
                        <TableCell sx={{ color: "white" }}>تاريخ البدء</TableCell>
                        <TableCell sx={{ color: "white" }}>تاريخ الانتهاء</TableCell>
                        <TableCell sx={{ color: "white" }}>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} align="center">
                                <Typography variant="h6" color="textSecondary" py={3}>
                                    لا يوجد سجلات حالياً.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((record: any) => {
                            const id = record.Id || record.ID || record.StudentScopeExecutionsDetailsRegisterID;
                            return (
                                <TableRow key={id}>
                                    <TableCell>{record.StudentName || "-"}</TableCell>
                                    <TableCell>{record.GroupName || "-"}</TableCell>
                                    <TableCell>{record.ScopeExecutionName || "-"}</TableCell>
                                    <TableCell>{record.ScopeUnitTypeName || "-"}</TableCell>
                                    <TableCell>
                                        {record.ScopeFrom && record.ScopeTo 
                                            ? `${record.ScopeFrom} - ${record.ScopeTo}` 
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{getStatusText(record.Status)}</TableCell>
                                    <TableCell>{record.StartDate ? new Date(record.StartDate).toLocaleDateString() : "-"}</TableCell>
                                    <TableCell>{record.CompletionDate ? new Date(record.CompletionDate).toLocaleDateString() : "-"}</TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <IconButton color="error" onClick={() => handleDelete(id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
