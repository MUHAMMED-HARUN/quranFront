import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Typography, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TestSessionDto, SessionStatus, TesterType } from '../types/testSession.types';

interface TestSessionTableProps {
    sessions: TestSessionDto[];
    isLoading: boolean;
    onEdit: (session: TestSessionDto) => void;
    onDelete: (id: string) => void;
}

export const TestSessionTable: React.FC<TestSessionTableProps> = ({ sessions, isLoading, onEdit, onDelete }) => {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!sessions?.length) {
        return (
            <Typography align="center" color="textSecondary" p={4}>
                لا يوجد جلسات اختبار مسجلة
            </Typography>
        );
    }

    const getStatusText = (status: SessionStatus) => {
        switch (status) {
            case SessionStatus.Scheduled: return 'مُجدولة';
            case SessionStatus.InProgress: return 'قائمة الآن';
            case SessionStatus.Completed: return 'مكتملة';
            case SessionStatus.Cancelled: return 'ملغاة';
            default: return 'غير معروف';
        }
    };

    const getTesterTypeText = (type: TesterType) => type === TesterType.Teacher ? 'معلم' : 'لجنة';

    return (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>معرّف الترشيح</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>نوع المُختبر</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>رقم المُختبر</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>تاريخ الاختبار</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الحالة</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>الإجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map((row) => (
                        <TableRow key={row.Id} hover>
                            <TableCell>{row.TestNominationID}</TableCell>
                            <TableCell>{getTesterTypeText(row.TesterType)}</TableCell>
                            <TableCell>{row.TesterID}</TableCell>
                            <TableCell>{new Date(row.ActualExamDate).toLocaleString()}</TableCell>
                            <TableCell>{getStatusText(row.SessionStatus)}</TableCell>
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
