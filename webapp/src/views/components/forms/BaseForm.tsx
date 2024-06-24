import { ErrorTwoTone } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, Grow, GrowProps, Typography } from '@mui/material';
import React from 'react';
import Button from '../buttons/Button';

interface Action {
    onClick: () => void;
    label: string;
    buttonType?: 'primary' | 'secondary' | 'ghost' | 'back' | 'confirm' | 'cancel';
}

interface BaseFormProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    content: JSX.Element;
    loading: boolean;
    error: string;
    warning?: string;
    successMessage?: string;
    actions: Action[];
    showIcon?: 'warning' | 'error' | 'success' | 'none';
}

const Transition = React.forwardRef(function Transition(
    props: GrowProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Grow {...props} ref={ref} />;
});

const BaseForm = ({ open, onClose, title, content, loading, error, warning = '', successMessage, actions, showIcon = 'none' }: BaseFormProps) => {


    const chooseIcon = () => {
        switch (showIcon) {
            case 'warning':
                return <WarningIcon style={{ fontSize: 50, color: 'orange' }} />;
            case 'error':
                return <ErrorTwoTone style={{ fontSize: 50, color: 'red' }} />;
            case 'success':
                return <CheckCircleIcon style={{ fontSize: 50, color: 'green' }} />;
            default:
                return null;
        }
    }

    return (
        <Dialog open={open} onClose={onClose}
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                style: {
                    borderRadius: 15,
                    padding: '20px',
                    textAlign: 'center'
                }
            }}>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Grow in={true}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <ErrorTwoTone style={{ fontSize: 50, color: 'red' }} />
                            <Typography color="error">{error}</Typography>
                        </Box>
                    </Grow>
                ) : warning ? (
                    <Grow in={true}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <WarningIcon style={{ fontSize: 50, color: 'orange' }} />
                            <Typography>{warning}</Typography>
                        </Box>
                    </Grow>
                ) : successMessage ? (
                    <Grow in={true}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <CheckCircleIcon style={{ fontSize: 50, color: 'green' }} />
                            <Typography color="success">{successMessage}</Typography>
                        </Box>
                    </Grow>
                ) : (
                    <>
                        {showIcon && chooseIcon()}
                        {title && <Typography variant="h5">{title}</Typography>}
                        {content}
                    </>
                )}
            </DialogContent>
            {!loading && !error && !warning && !successMessage && (
                <DialogActions style={{ justifyContent: 'center' }}>
                    {actions.map((action, index) => (
                        <Button key={index} onClick={action.onClick} {...action} />
                    ))}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default BaseForm;
