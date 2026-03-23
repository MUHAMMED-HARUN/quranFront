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
import { useClassesQuery } from "../hooks";
import { useClassStore } from "../store/classStore";

export const ClassTable = () => {
    const { data: response, isLoading, isError, error } = useClassesQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useClassStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const classes = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(classes.map((c: any) => c.ClassID));
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
                                indeterminate={selectedIds.length > 0 && selectedIds.length < classes.length}
                                checked={classes.length > 0 && selectedIds.length === classes.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>اسم الحلقة</TableCell>
                        <TableCell>المستوى</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {classes.map((cls: any) => (
                        <TableRow
                            key={cls.ClassID}
                            hover
                            onClick={(e) => handleRowClick(cls.ClassID, e)}
                            selected={selectedIds.includes(cls.ClassID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(cls.ClassID)}
                                    onChange={() => toggleSelection(cls.ClassID)}
                                />
                            </TableCell>
                            <TableCell>{cls.Name}</TableCell>
                            <TableCell>{cls.Level}</TableCell>
                        </TableRow>
                    ))}
                    {classes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
