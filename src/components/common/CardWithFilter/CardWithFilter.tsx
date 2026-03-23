import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
} from "@mui/material";

export interface SearchCriterion {
    id: string;
    label: string;
}

export interface CardWithFilterProps<T> {
    label: string;
    value: T | null;
    onSelect: (entity: T) => void;
    onClear: () => void;
    searchFn: (term: string, criteria: string) => Promise<T | null>;
    searchCriteria: SearchCriterion[];
    renderEntityCard: (entity: T) => React.ReactNode;
    displayValue: (entity: T) => string;
}

export const CardWithFilter = <T,>({
    label,
    value,
    onSelect,
    onClear,
    searchFn,
    searchCriteria,
    renderEntityCard,
    displayValue,
}: CardWithFilterProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCriteria, setSelectedCriteria] = useState(
        searchCriteria[0]?.id || ""
    );
    const [isLoading, setIsLoading] = useState(false);
    const [searchedEntity, setSearchedEntity] = useState<T | null | undefined>(
        undefined
    );

    const handleOpen = () => {
        setIsOpen(true);
        setSearchTerm("");
        setSearchedEntity(undefined);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSearch = async () => {
        if (!searchTerm.trim() || !selectedCriteria) return;
        setIsLoading(true);
        try {
            const result = await searchFn(searchTerm, selectedCriteria);
            setSearchedEntity(result);
        } catch (e) {
            setSearchedEntity(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (searchedEntity) {
            onSelect(searchedEntity);
            handleClose();
        }
    };

    return (
        <Box>
            <Typography variant="subtitle2" color="textSecondary" mb={1}>
                {label}
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                gap={2}
                p={2}
                border="1px solid #ccc"
                borderRadius={1}
            >
                {value ? (
                    <Typography variant="body1" flexGrow={1}>
                        {displayValue(value)}
                    </Typography>
                ) : (
                    <Typography variant="body1" color="textSecondary" flexGrow={1}>
                        لم يتم الاختيار
                    </Typography>
                )}

                {value && (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={onClear}
                    >
                        إلغاء الاختيار
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleOpen}
                >
                    {value ? "تغيير / تبديل" : "اختيار"}
                </Button>
            </Box>

            {/* Internal Search Dialog */}
            <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>البحث عن {label}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" gap={2} mb={3}>
                        <TextField
                            select
                            label="نوع البحث"
                            value={selectedCriteria}
                            onChange={(e) => setSelectedCriteria(e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            {searchCriteria.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="كلمة البحث"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            disabled={isLoading || !searchTerm.trim()}
                            sx={{ minWidth: 100 }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "بحث"
                            )}
                        </Button>
                    </Box>

                    <Box
                        p={2}
                        border="1px dashed #ccc"
                        borderRadius={1}
                        bgcolor={searchedEntity === null ? "#f5f5f5" : "transparent"}
                        minHeight={100}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {searchedEntity === undefined ? (
                            <Typography color="textSecondary">
                                يرجى إدخال شروط البحث
                            </Typography>
                        ) : searchedEntity === null ? (
                            <Typography color="textSecondary" sx={{ opacity: 0.5 }}>
                                ???? (لم يتم العثور على بيانات)
                            </Typography>
                        ) : (
                            <Box width="100%">{renderEntityCard(searchedEntity)}</Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color="primary"
                        variant="contained"
                        disabled={!searchedEntity}
                    >
                        تأكيد الاختيار
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
