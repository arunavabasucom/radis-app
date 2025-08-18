import React, { useRef } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { Controller, useFormContext } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useColorScheme } from '@mui/joy/styles';
import useFitFormStore from "../../store/fitForm";

interface UploadProps {
    label?: string;
    accept?: string;
    maxSize?: number; // in MB
    required?: boolean;
}

export const Upload: React.FC<UploadProps> = ({
    label = "Upload File",
    accept = "*/*",
    maxSize = 10, // 10MB default
    required = false,
}) => {
    const { control } = useFormContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mode } = useColorScheme();
    const { setSpectrumFile } = useFitFormStore();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | null) => void) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const file = files[0];
            if (maxSize && file.size > maxSize * 1024 * 1024) {
                // File too large - could add error handling here
                return;
            }
            setSpectrumFile(file);
            onChange(file);
        }
    };

    const handleDeleteFile = (onChange: (value: File | null) => void) => {
        console.log("Deleting file");
        onChange(null);
        // Reset the file input element so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const isDark = mode === 'dark';

    return (
        <Controller
            name="spectrum_file"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                    <FormLabel htmlFor={`spectrum_file-file-input`}>
                        {label}
                        {required && <span style={{ color: "red" }}> *</span>}
                    </FormLabel>

                    <Box
                        sx={{
                            border: "2px",
                            borderColor: isDark ? "neutral.600" : "neutral.300",
                            borderRadius: "sm",
                            p: 3,
                            textAlign: "center",
                            backgroundColor: isDark ? "background.level1" : "background.surface",
                            transition: "all 0.2s ease-in-out",
                            cursor: "pointer",
                            "&:hover": {
                                borderColor: isDark ? "primary.400" : "primary.500",
                                backgroundColor: isDark ? "primary.900" : "primary.50",
                            },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            id={`spectrum_file-file-input`}
                            type="file"
                            accept={accept}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileSelect(e, field.onChange)}
                        />

                        {!field.value ? (
                            <>
                                <CloudUploadIcon
                                    sx={{
                                        fontSize: 48,
                                        color: isDark ? "neutral.500" : "neutral.400",
                                        mb: 1
                                    }}
                                />
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        color: isDark ? "neutral.400" : "neutral.500"
                                    }}
                                >
                                    Accepted format: {accept === "*/*" ? "All files" : accept}
                                    {maxSize && ` • Max size: ${maxSize}MB`}
                                </Typography>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 1,
                                    backgroundColor: isDark ? "background.level2" : "background.level1",
                                    borderRadius: "sm",
                                    border: `1px solid ${isDark ? "neutral.700" : "neutral.200"}`,
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        level="body-sm"
                                        fontWeight="md"
                                        sx={{
                                            color: isDark ? "text.primary" : "text.primary",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {(field.value as File).name}
                                    </Typography>
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            color: isDark ? "neutral.400" : "neutral.500"
                                        }}
                                    >
                                        {formatFileSize((field.value as File).size)}
                                    </Typography>
                                </Box>
                                <Button
                                    size="sm"
                                    variant="plain"
                                    color="danger"
                                    sx={{
                                        color: isDark ? "danger.400" : "danger.500",
                                        "&:hover": {
                                            backgroundColor: isDark ? "danger.900" : "danger.100",
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFile(field.onChange);
                                    }}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {fieldState.error && (
                        <FormHelperText sx={{ color: "red" }}>
                            {fieldState.error.message}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
}; 