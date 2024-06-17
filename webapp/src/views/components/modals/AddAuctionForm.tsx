import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Card, CardContent, CardActions } from '@mui/material';

function AddAuctionForm({ open, handleClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        handleClose(); // Cierra el modal después de enviar
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
            }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography id="modal-modal-title" variant="h6" component="h2" color="primary">
                            Suscríbete a nuestro boletín
                        </Typography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </CardContent>
                    <CardActions>
                        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                            Enviar
                        </Button>
                        <Button color="error" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Modal>
    );
}

export default AddAuctionForm;