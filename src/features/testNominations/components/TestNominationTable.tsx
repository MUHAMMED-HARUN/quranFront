import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Typography, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TestNominationDto, NominationStatus } from '../types/testNomination.types';

interface TestNominationTableProps {
    nominations: TestNominationDto[];
    isLoading: boolean;
    onEdit: (nomination: TestNominationDto) => void;
    onDelete: (id: string) => void;
}

export const TestNominationTable: React.FC<TestNominationTableProps> = ({ nominations, isLoading, onEdit, onDelete }) => {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!nominations?.length) {
        return (
            <Typography align="center" color="textSecondary" p={4}>
                لا يوجد ترشيحات مسجلة
            </Typography>
        );
    }

    const getStatusText = (status: NominationStatus) => {
        switch (status) {
            case NominationStatus.Pending: return 'قيد الانتظار';
            case NominationStatus.Approved: return 'مُعتمد';
            case NominationStatus.Rejected: return 'مرفوض';
            case NominationStatus.Completed: return 'مكتمل';
            default: return 'غير معروف';
        }
    };

    return (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>رقم الطالب</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>تاريخ الاقتراح</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الحالة</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>الإجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {nominations.map((row) => (
                        <TableRow key={row.Id} hover>
                            <TableCell>{row.StudentEnrollmentID}</TableCell>
                            <TableCell>{row.SuggestedDate ? new Date(row.SuggestedDate).toLocaleDateString() : 'غير محدد'}</TableCell>
                            <TableCell>{getStatusText(row.NominationStatus)}</TableCell>
                            <TableCell align="center">
                                <IconButton onClick={() => onEdit(row)} color="primary" size="small">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(row.Id)} color="error" size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
