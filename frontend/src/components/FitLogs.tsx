import React from "react";
import {
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
    Box,
    Sheet,
    Divider,
} from "@mui/joy";

type FitLogsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    fitVals: number[][];
    paramNames?: string[];
};

const FitLogsModal: React.FC<FitLogsModalProps> = ({ isOpen, onClose, fitVals, paramNames }) => {
    const numParams = fitVals[0]?.length || 0;
    const headers = paramNames?.length === numParams
        ? paramNames
        : Array.from({ length: numParams }, (_, i) => `Param ${i + 1}`);

    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalDialog
                size="lg"
                variant="outlined"
                sx={{
                    maxWidth: "800px",
                    width: "90vw",
                    maxHeight: "80vh",
                    overflow: "auto"
                }}
            >
                <ModalClose />
                <Typography level="h4" component="h2" sx={{ mb: 2 }}>
                    Fit Logs
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Sheet
                    variant="soft"
                    sx={{
                        p: 2,
                        borderRadius: "sm",
                        fontFamily: "monospace",
                        fontSize: "sm",
                        maxHeight: "60vh",
                        overflow: "auto"
                    }}
                >
                    {/* Header Row */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: `80px repeat(${numParams}, 1fr)`,
                            gap: 1,
                            mb: 1,
                            fontWeight: "bold",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            pb: 1
                        }}
                    >
                        <Typography sx={{ fontWeight: "bold" }}>Iteration</Typography>
                        {headers.map((header, index) => (
                            <Typography key={index} sx={{ fontWeight: "bold" }}>
                                {header}
                            </Typography>
                        ))}
                    </Box>

                    {/* Data Rows */}
                    {fitVals.map((vals, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: `80px repeat(${numParams}, 1fr)`,
                                gap: 1,
                                py: 0.5,
                                "&:hover": {
                                    backgroundColor: "background.level1"
                                }
                            }}
                        >
                            <Typography sx={{ fontWeight: "bold", color: "primary.600" }}>
                                {i}
                            </Typography>
                            {vals.map((val, j) => (
                                <Typography key={j}>
                                    {val.toFixed(6)}
                                </Typography>
                            ))}
                        </Box>
                    ))}
                </Sheet>
            </ModalDialog>
        </Modal>
    );
};

export default FitLogsModal;
