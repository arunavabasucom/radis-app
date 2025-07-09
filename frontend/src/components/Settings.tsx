import React, { useState, useEffect, useRef } from "react";
import { IconButton, Typography, Sheet, FormControl, FormLabel, Switch } from "@mui/joy";
import { Popper } from "@mui/base/Popper";
import SettingsIcon from "@mui/icons-material/Settings";
import { useColorScheme } from "@mui/joy/styles";
import { CodeBlock } from "./CodeBlock";
import useFromStore from "../store/form";

export const Settings = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const { mode } = useColorScheme();
    const popperRef = useRef<HTMLDivElement | null>(null);
    const { localBackend, setLocalBackend } = useFromStore();


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

    return (
        <>
            <IconButton onClick={handleClick}>
                <SettingsIcon sx={{ color: mode === "dark" ? "white" : "", fontSize: 30 }} />
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
                        maxWidth: 650,
                        zIndex: 1300,
                    }}
                >
                    <Typography level="h4" sx={{ mb: 2 }}>Local Backend Settings</Typography>

                    <Typography level="title-md" sx={{ mb: 1 }}>Want to run Backend Locally to get better performance and gpu acceleration?</Typography>
                    <Typography level="body-md" sx={{ mt: 2, mb: 4 }}>

                        <Typography level="title-md" sx={{ mb: 1 }}>Setup Instructions:</Typography>
                        <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
                            <li>Clone The repository
                                <CodeBlock
                                    codeText="git clone https://github.com/arunavabasucom/radis-app"
                                    blockId="clone"
                                />
                            </li>
                            <li>Install Docker if not already installed</li>
                            <li>Build the docker image
                                <CodeBlock
                                    codeText="cd backend && docker build -t radis-app-backend ."
                                    blockId="build"
                                />
                            </li>
                            <li>Run the docker container
                                <CodeBlock
                                    codeText="docker run -d -p 8080:8080 radis-app-backend"
                                    blockId="run"
                                />
                            </li>
                            <li>Enable "Run Backend Locally" option below and enjoy!</li>
                        </ol>
                    </Typography>

                    <FormControl
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            bgcolor: mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                            borderRadius: '12px',
                            border: mode === 'dark' ? '1px solid rgba(33, 150, 243, 0.2)' : '1px solid rgba(33, 150, 243, 0.1)',
                        }}
                    >
                        <div>
                            <FormLabel sx={{ fontWeight: 600, fontSize: '16px', mb: 0.5 }}>
                                🚀 Run Backend Locally
                            </FormLabel>
                        </div>
                        <Switch
                            checked={localBackend}
                            onChange={(event) => setLocalBackend(event.target.checked)}
                            size="lg"
                            sx={{
                                '--Switch-trackWidth': '48px',
                                '--Switch-trackHeight': '24px',
                            }}
                        />
                    </FormControl>

                </Sheet>
            </Popper >
        </>
    );
};