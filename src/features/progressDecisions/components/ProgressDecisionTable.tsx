import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ProgressDecisionDto, DecisionType, DecisionAuthority } from '../types/progressDecision.types';

interface ProgressDecisionTableProps {
    decisions: ProgressDecisionDto[];
    isLoading: boolean;
    onEdit: (decision: ProgressDecisionDto) => void;
    onDelete: (id: string) => void;
}

export const ProgressDecisionTable: React.FC<ProgressDecisionTableProps> = ({ decisions, isLoading, onEdit, onDelete }) => {
    if (isLoading) return <CircularProgress />;

    const getDecisionTypeName = (type: DecisionType) => {
        switch (type) {
            case DecisionType.Pass: return '✅ مجتاز';
            case DecisionType.ConditionalPass: return '☑️ مجتاز مشروط';
            case DecisionType.Fail: return '❌ راسب';
            default: return 'غير معروف';
        }
    };

    const getDecisionAuthorityName = (type: DecisionAuthority) => {
        switch (type) {
            case DecisionAuthority.System: return 'النظام التلقائي';
            case DecisionAuthority.Principal: return 'المدير المباشر';
            case DecisionAuthority.Teacher: return 'المعلم';
            case DecisionAuthority.Committee: return 'لجنة الاختبار';
            default: return 'غير معروف';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>الطالب (معرف التسجيل)</TableCell>
                        <TableCell>نوع القرار</TableCell>
                        <TableCell>جهة القرار</TableCell>
                        <TableCell>تاريخ القرار</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {decisions.map((decision) => (
                        <TableRow key={decision.Id}>
                            <TableCell>{decision.StudentEnrollmentID.substring(0, 8)}...</TableCell>
                            <TableCell>{getDecisionTypeName(decision.DecisionType)}</TableCell>
                            <TableCell>{getDecisionAuthorityName(decision.DecisionAuthority)}</TableCell>
                            <TableCell>{decision.DecisionDate}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => onEdit(decision)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(decision.Id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {decisions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">لا توجد قرارات تقييم مسجلة</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
