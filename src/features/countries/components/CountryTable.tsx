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
import { useCountriesQuery } from "../hooks";
import { useCountryStore } from "../store/countryStore";

export const CountryTable: React.FC = () => {
  const { openCard, selectedIds, toggleSelection, selectAll, clearSelection } = useCountryStore();
  const {
    data: countriesResponse,
    isLoading,
    isError,
    error,
  } = useCountriesQuery();

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <Alert severity="error">
        {(error as any)?.ErrorMessage || "فشل تحميل البيانات"}
      </Alert>
    );

  const countries = countriesResponse || [];
  const allSelected = countries.length > 0 && selectedIds.length === countries.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < countries.length;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll(countries.map((c) => c.CountryID));
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
            <TableCell align="right">اسم الدولة</TableCell>
            <TableCell align="right">رمز الدولة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                لا توجد بيانات
              </TableCell>
            </TableRow>
          ) : (
            countries.map((country) => {
              const isSelected = selectedIds.includes(country.CountryID);
              return (
                <TableRow
                  key={country.CountryID}
                  hover
                  onClick={() => openCard(country.CountryID)}
                  selected={isSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(country.CountryID);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{country.CountryName}</TableCell>
                  <TableCell align="right">{country.CountryCode}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
