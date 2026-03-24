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
import { useStudentEnrollmentsQuery } from "../hooks";
import { useStudentEnrollmentStore } from "../store/studentEnrollmentStore";
import { useSearchParams } from "react-router-dom";

export const StudentEnrollmentTable = () => {
    const { data: response, isLoading, isError, error } = useStudentEnrollmentsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useStudentEnrollmentStore();
    const [searchParams] = useSearchParams();
    const urlGroupId = searchParams.get("groupId");

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    let records = (response as any)?.Value || response || [];

    // Apply GroupID filter if passed in the URL (when navigated from GroupCard)
    if (urlGroupId) {
        records = records.filter((r: any) => r.GroupID === urlGroupId);
    }

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(records.map((r: any) => r.StudentEnrollmentID));
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
                        <TableCell>اسم الطالب الثلاثي</TableCell>
                        <TableCell>رقم الهوية</TableCell>
                        <TableCell>اسم المجموعة</TableCell>
                        <TableCell>تاريخ التسجيل</TableCell>
                        <TableCell>هل هو مفعل</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((r: any) => (
                        <TableRow
                            key={r.StudentEnrollmentID}
                            hover
                            onClick={(e) => handleRowClick(r.StudentEnrollmentID, e)}
                            selected={selectedIds.includes(r.StudentEnrollmentID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(r.StudentEnrollmentID)}
                                    onChange={() => toggleSelection(r.StudentEnrollmentID)}
                                />
                            </TableCell>
                            {/* Map to DTO values along with fallbacks */}
                            <TableCell>{r.StudentName}</TableCell>
                            <TableCell>{r.NationalNumber || r.Student?.NationalNumber || r.StudentID}</TableCell>
                            <TableCell>{r.GroupName || r.Group?.GroupName || r.GroupID}</TableCell>
                            <TableCell>{new Date(r.Date).toLocaleDateString()}</TableCell>
                            <TableCell>{r.IsActive ? "نعم" : "لا"}</TableCell>
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
