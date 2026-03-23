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
    Alert,
    Checkbox,
} from "@mui/material";
import { useTeachingAssignmentsQuery } from "../hooks";
import { useTeachingAssignmentStore } from "../store/teachingAssignmentStore";

export const TeachingAssignmentTable = () => {
    const { data: response, isLoading, isError, error } = useTeachingAssignmentsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useTeachingAssignmentStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const records = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(records.map((r: any) => r.TeachingAssignmentID));
        } else {
            selectAll([]);
        }
    };

    const handleRowClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSelection(id);
        openCard();
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={
                                    selectedIds.length > 0 && selectedIds.length < records.length
                                }
                                checked={
                                    records.length > 0 && selectedIds.length === records.length
                                }
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>رقم المعلم (هوية)</TableCell>
                        <TableCell>اسم المجموعة</TableCell>
                        <TableCell>المادة</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((r: any) => (
                        <TableRow
                            key={r.TeachingAssignmentID}
                            hover
                            onClick={(e) => handleRowClick(r.TeachingAssignmentID, e)}
                            selected={selectedIds.includes(r.TeachingAssignmentID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(r.TeachingAssignmentID)}
                                    onChange={() => toggleSelection(r.TeachingAssignmentID)}
                                />
                            </TableCell>
                            {/* Fallback to IDs if navigation props not included in DTO */}
                            <TableCell>{r.Teacher?.NationalNumber || r.TeacherID}</TableCell>
                            <TableCell>{r.Group?.GroupName || r.GroupID}</TableCell>
                            <TableCell>{r.Subject?.SubjectName || r.SubjectID}</TableCell>
                        </TableRow>
                    ))}
                    {records.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
