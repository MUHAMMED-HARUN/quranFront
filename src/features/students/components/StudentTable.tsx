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
import { useStudentsQuery } from "../hooks";
import { useStudentStore } from "../store/studentStore";

export const StudentTable = () => {
    const { data: response, isLoading, isError, error } = useStudentsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useStudentStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const students = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(students.map((s: any) => s.StudentID));
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
                                indeterminate={selectedIds.length > 0 && selectedIds.length < students.length}
                                checked={students.length > 0 && selectedIds.length === students.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>رقم الهوية</TableCell>
                        <TableCell>الاسم الأول</TableCell>
                        <TableCell>اسم الأب</TableCell>
                        <TableCell>الاسم الأخير</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {students.map((student: any) => (
                        <TableRow
                            key={student.StudentID}
                            hover
                            onClick={(e) => handleRowClick(student.StudentID, e)}
                            selected={selectedIds.includes(student.StudentID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(student.StudentID)}
                                    onChange={() => toggleSelection(student.StudentID)}
                                />
                            </TableCell>
                            <TableCell>{student.NationalNumber}</TableCell>
                            <TableCell>{student.FirstName}</TableCell>
                            <TableCell>{student.FatherName}</TableCell>
                            <TableCell>{student.LastName}</TableCell>
                        </TableRow>
                    ))}
                    {students.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
