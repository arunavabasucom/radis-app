import React, { useState, useEffect, useRef } from "react";
import { IconButton, Typography, Sheet } from "@mui/joy";
import { Popper } from "@mui/base/Popper";
import InfoIcon from "@mui/icons-material/Info";
import { useColorScheme } from "@mui/joy/styles";

interface InfoProps {
    helpText: string;
    size?: "sm" | "md" | "lg";
}

export const Info: React.FC<InfoProps> = ({ helpText, size = "sm" }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const { mode } = useColorScheme();
    const popperRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const handleClose = () => setOpen(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popperRef.current &&
                !popperRef.current.contains(event.target as Node) &&
                anchorEl &&
                !anchorEl.contains(event.target as Node)
            ) {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, anchorEl]);

    const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

    return (
        <>
            <IconButton
                size={size}
                onClick={handleClick}
                sx={{ ml: -0.5, p: 0 }}
            >
                <InfoIcon sx={{ color: mode === "dark" ? "white" : "", fontSize: iconSize }} />
            </IconButton>

            <Popper open={open} anchorEl={anchorEl} placement="bottom">
                <Sheet
                    ref={popperRef}
                    variant="outlined"
                    sx={{
                        p: 2,
                        bgcolor: "background.surface",
                        borderRadius: "md",
                        boxShadow: "lg",
                        maxWidth: 300,
                        zIndex: 1300,
                    }}
                >
                    <Typography>
                        <span dangerouslySetInnerHTML={{ __html: helpText }} />
                    </Typography>
                </Sheet>
            </Popper>
        </>
    );
}; 