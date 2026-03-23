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
import { useSubjectsQuery } from "../hooks";
import { useSubjectStore } from "../store/subjectStore";

export const SubjectTable = () => {
    const { data: response, isLoading, isError, error } = useSubjectsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useSubjectStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const subjects = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(subjects.map((s: any) => s.SubjectID));
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
                                indeterminate={selectedIds.length > 0 && selectedIds.length < subjects.length}
                                checked={subjects.length > 0 && selectedIds.length === subjects.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>اسم المادة</TableCell>
                        <TableCell>ملاحظات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subjects.map((subject: any) => (
                        <TableRow
                            key={subject.SubjectID}
                            hover
                            onClick={(e) => handleRowClick(subject.SubjectID, e)}
                            selected={selectedIds.includes(subject.SubjectID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(subject.SubjectID)}
                                    onChange={() => toggleSelection(subject.SubjectID)}
                                />
                            </TableCell>
                            <TableCell>{subject.SubjectName}</TableCell>
                            <TableCell>{subject.Notes}</TableCell>
                        </TableRow>
                    ))}
                    {subjects.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                لا يوجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
