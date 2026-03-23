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
import { useTeachersQuery } from "../hooks";
import { useTeacherStore } from "../store/teacherStore";

export const TeacherTable = () => {
    const { data: response, isLoading, isError, error } = useTeachersQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useTeacherStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const teachers = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(teachers.map((t: any) => t.TeacherID));
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
                                indeterminate={selectedIds.length > 0 && selectedIds.length < teachers.length}
                                checked={teachers.length > 0 && selectedIds.length === teachers.length}
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
                    {teachers.map((teacher: any) => (
                        <TableRow
                            key={teacher.TeacherID}
                            hover
                            onClick={(e) => handleRowClick(teacher.TeacherID, e)}
                            selected={selectedIds.includes(teacher.TeacherID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(teacher.TeacherID)}
                                    onChange={() => toggleSelection(teacher.TeacherID)}
                                />
                            </TableCell>
                            <TableCell>{teacher.NationalNumber}</TableCell>
                            <TableCell>{teacher.FirstName}</TableCell>
                            <TableCell>{teacher.FatherName}</TableCell>
                            <TableCell>{teacher.LastName}</TableCell>
                        </TableRow>
                    ))}
                    {teachers.length === 0 && (
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
