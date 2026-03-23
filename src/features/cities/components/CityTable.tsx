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
import { useCitiesQuery } from "../hooks";
import { useCityStore } from "../store/cityStore";

export const CityTable: React.FC = () => {
  const {
    openCard,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    filters,
  } = useCityStore();

  // The query automatically hooks into the currently filtered CountryID from the store
  const {
    data: citiesResponse,
    isLoading,
    isError,
    error,
  } = useCitiesQuery(filters.CountryID);

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <Alert severity="error">
        {(error as any)?.ErrorMessage || "فشل تحميل البيانات"}
      </Alert>
    );

  const cities = citiesResponse?.Value || citiesResponse || []; // Handle TResult structure if nested
  const cityArray = Array.isArray(cities) ? cities : [];

  const allSelected =
    cityArray.length > 0 && selectedIds.length === cityArray.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < cityArray.length;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll(cityArray.map((c: any) => c.CityID));
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
            <TableCell align="right">اسم المدينة</TableCell>
            <TableCell align="right">رمز المدينة</TableCell>
            <TableCell align="right">الدولة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cityArray.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                لا توجد بيانات
              </TableCell>
            </TableRow>
          ) : (
            cityArray.map((city: any) => {
              const isSelected = selectedIds.includes(city.CityID);
              return (
                <TableRow
                  key={city.CityID}
                  hover
                  onClick={() => openCard(city.CityID)}
                  selected={isSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(city.CityID);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{city.CityName}</TableCell>
                  <TableCell align="right">{city.CityCode}</TableCell>
                  <TableCell align="right" title={city.CountryName}></TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
