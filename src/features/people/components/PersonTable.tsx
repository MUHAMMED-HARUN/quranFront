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
import { usePersonsQuery } from "../hooks";
import { usePersonStore } from "../store/personStore";

export const PersonTable = () => {
    const { data: response, isLoading, isError, error } = usePersonsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard, setFilters } =
        usePersonStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const persons = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(persons.map((p: any) => p.PersonID));
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
                                    selectedIds.length > 0 && selectedIds.length < persons.length
                                }
                                checked={
                                    persons.length > 0 && selectedIds.length === persons.length
                                }
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>الاسم الكامل</TableCell>
                        <TableCell>الرقم الوطني</TableCell>
                        <TableCell>الجنس</TableCell>
                        <TableCell>تاريخ الميلاد</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {persons.map((person: any) => (
                        <TableRow
                            key={person.PersonID}
                            hover
                            onClick={(e) => handleRowClick(person.PersonID, e)}
                            selected={selectedIds.includes(person.PersonID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(person.PersonID)}
                                    onChange={() => toggleSelection(person.PersonID)}
                                />
                            </TableCell>
                            <TableCell>{`${person.FirstName} ${person.LastName}`}</TableCell>
                            <TableCell>{person.NationalNumber}</TableCell>
                            <TableCell>{person.Gender ? "ذكر" : "أنثى"}</TableCell>
                            <TableCell>{person.BirthDate}</TableCell>
                        </TableRow>
                    ))}
                    {persons.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                لا يوجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
