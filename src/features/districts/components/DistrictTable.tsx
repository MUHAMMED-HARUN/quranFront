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
import { useDistrictsQuery } from "../hooks";
import { useDistrictStore } from "../store/districtStore";

export const DistrictTable: React.FC = () => {
    const {
        openCard,
        selectedIds,
        toggleSelection,
        selectAll,
        clearSelection,
        filters,
    } = useDistrictStore();

    const {
        data: districtsResponse,
        isLoading,
        isError,
        error,
    } = useDistrictsQuery(filters.CityID);

    if (isLoading) return <CircularProgress />;
    if (isError)
        return (
            <Alert severity="error">
                {(error as any)?.ErrorMessage || "فشل تحميل البيانات"}
            </Alert>
        );

    const districts = districtsResponse?.Value || districtsResponse || [];
    const districtArray = Array.isArray(districts) ? districts : [];

    const allSelected =
        districtArray.length > 0 && selectedIds.length === districtArray.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < districtArray.length;

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(districtArray.map((d: any) => d.DistrictID));
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
                        <TableCell align="right">اسم القضاء/المنطقة</TableCell>
                        <TableCell align="right">المدينة</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {districtArray.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    ) : (
                        districtArray.map((district: any) => {
                            const isSelected = selectedIds.includes(district.DistrictID);
                            return (
                                <TableRow
                                    key={district.DistrictID}
                                    hover
                                    onClick={() => openCard(district.DistrictID)}
                                    selected={isSelected}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelection(district.DistrictID);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{district.DistrictName}</TableCell>
                                    <TableCell align="right">{district.CityName}</TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
