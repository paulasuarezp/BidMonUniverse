import { ErrorTwoTone } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, Grow, Typography } from '@mui/material';
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
    successMessage: string;
    actions: Action[];
}

const BaseForm = ({ open, onClose, title, content, loading, error, warning = '', successMessage, actions }: BaseFormProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
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
                        {title && <Typography variant="h6">{title}</Typography>}
                        {content}
                    </>
                )}
            </DialogContent>
            {!loading && !error && !warning && !successMessage && (
                <DialogActions>
                    {actions.map((action, index) => (
                        <Button key={index} onClick={action.onClick} {...action} />
                    ))}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default BaseForm;
