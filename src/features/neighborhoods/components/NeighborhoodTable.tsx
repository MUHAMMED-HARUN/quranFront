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
import { useNeighborhoodsQuery } from "../hooks";
import { useNeighborhoodStore } from "../store/neighborhoodStore";

export const NeighborhoodTable: React.FC = () => {
    const {
        openCard,
        selectedIds,
        toggleSelection,
        selectAll,
        clearSelection,
        filters,
    } = useNeighborhoodStore();

    const {
        data: neighborhoodsResponse,
        isLoading,
        isError,
        error,
    } = useNeighborhoodsQuery(filters.DistrictID);

    if (isLoading) return <CircularProgress />;
    if (isError)
        return (
            <Alert severity="error">
                {(error as any)?.ErrorMessage || "فشل تحميل البيانات"}
            </Alert>
        );

    const neighborhoods = neighborhoodsResponse?.Value || neighborhoodsResponse || [];
    const neighborhoodArray = Array.isArray(neighborhoods) ? neighborhoods : [];

    const allSelected =
        neighborhoodArray.length > 0 && selectedIds.length === neighborhoodArray.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < neighborhoodArray.length;

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(neighborhoodArray.map((n: any) => n.NeighborhoodID));
        } else {
            clearSelection();
        }
    };

    return (
        <TableContainer component={Paper} elevation={2} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={someSelected}
                                checked={allSelected}
                                onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        <TableCell align="right">اسم الحي</TableCell>
                        <TableCell align="right">المنطقة/القضاء</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {neighborhoodArray.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    ) : (
                        neighborhoodArray.map((neighborhood: any) => {
                            const isSelected = selectedIds.includes(neighborhood.NeighborhoodID);
                            return (
                                <TableRow
                                    key={neighborhood.NeighborhoodID}
                                    hover
                                    onClick={() => openCard(neighborhood.NeighborhoodID)}
                                    selected={isSelected}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelection(neighborhood.NeighborhoodID);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{neighborhood.NeighborhoodName}</TableCell>
                                    <TableCell align="right">{neighborhood.DistrictName}</TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
