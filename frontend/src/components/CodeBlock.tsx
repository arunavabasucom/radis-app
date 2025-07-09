import { IconButton } from "@mui/joy";
import { useState } from "react";
import { Check, ContentCopy } from "@mui/icons-material/";

export const CodeBlock = ({ codeText, blockId }: { codeText: string; blockId: string }) => {
    const [copiedBlocks, setCopiedBlocks] = useState<{ [key: string]: boolean }>({});
    const isCopied = copiedBlocks[blockId] || false;
    const handleCopy = async (codeText: string, blockId: string) => {
        try {
            await navigator.clipboard.writeText(codeText);
            setCopiedBlocks(prev => ({ ...prev, [blockId]: true }));
            setTimeout(() => {
                setCopiedBlocks(prev => ({ ...prev, [blockId]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <pre style={{
            position: 'relative',
            background: '#1a1a1a',
            color: 'white',
            fontFamily: 'monospace',
            padding: '0.5rem',
            borderRadius: '4px',
            margin: '0.5rem 0'
        }}>
            {codeText}
            <IconButton
                variant="plain"
                size="sm"
                onClick={() => handleCopy(codeText, blockId)}
                sx={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.75rem',
                    color: 'white',
                    minHeight: '24px',
                    minWidth: '24px',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.06)'
                    }
                }}
            >
                {isCopied ? <Check sx={{ fontSize: 16 }} /> : <ContentCopy sx={{ fontSize: 16 }} />}
            </IconButton>
        </pre>
    );
};