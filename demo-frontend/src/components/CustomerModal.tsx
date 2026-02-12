"use client";

import { useEffect, useState } from "react";
import {
    Autocomplete,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    Stack,
} from "@mui/material";
import { createCustomer, updateCustomer } from "@/services/api";
import { ApiError, Customer } from "@/types/customer";
import { ALL_COUNTRIES } from "@/constants/countries";
import axios from "axios";

interface Props {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    customer?: Customer | null;
}

export default function CustomerModal({ open, onClose, onSaved, customer }: Props) {
    const isEdit = !!customer;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [countryCode, setCountryCode] = useState<{ code: string; label: string } | undefined>(
        ALL_COUNTRIES.find((c) => c.code === "+91")
    );
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customer) {
            setFirstName(customer.firstName);
            setLastName(customer.lastName);
            setDateOfBirth(customer.dateOfBirth);
            setCountryCode(
                ALL_COUNTRIES.find((c) => c.code === customer.countryCode) || {
                    code: customer.countryCode,
                    label: customer.countryCode,
                }
            );
            setPhoneNumber(customer.phoneNumber);
        } else {
            resetForm();
        }
    }, [customer, open]);

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setDateOfBirth("");
        setCountryCode(ALL_COUNTRIES.find((c) => c.code === "+91"));
        setPhoneNumber("");
        setError(null);
        setFieldErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const todayStr = new Date().toISOString().split("T")[0];

    const handleSubmit = async () => {
        setError(null);
        setFieldErrors({});

        const errors: Record<string, string> = {};
        if (firstName.length > 50) errors.firstName = "Max 50 characters";
        if (lastName.length > 50) errors.lastName = "Max 50 characters";
        if (!/^[0-9]{10}$/.test(phoneNumber)) errors.phoneNumber = "Phone number must be exactly 10 digits";
        if (!countryCode) errors.countryCode = "Country code is required";
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        // Extract country name from label "Name (+Code)"
        const countryName = countryCode!.label.replace(/\s\(\+\d+\)$/, "");

        const payload = {
            firstName,
            lastName,
            dateOfBirth,
            countryCode: countryCode!.code,
            countryName,
            phoneNumber,
        };

        try {
            if (isEdit) {
                await updateCustomer(customer!.id, payload);
            } else {
                await createCustomer(payload);
            }
            resetForm();
            onSaved();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data as ApiError;
                if (data.errors) {
                    setFieldErrors(data.errors);
                } else {
                    setError(data.message || "Failed to save customer");
                }
            } else {
                setError("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value.slice(0, 50))}
                        error={!!fieldErrors.firstName}
                        helperText={fieldErrors.firstName || `${firstName.length}/50`}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value.slice(0, 50))}
                        error={!!fieldErrors.lastName}
                        helperText={fieldErrors.lastName || `${lastName.length}/50`}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        error={!!fieldErrors.dateOfBirth}
                        helperText={fieldErrors.dateOfBirth}
                        required
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { max: todayStr },
                        }}
                    />
                    <Stack direction="row" spacing={1}>
                        <Autocomplete
                            options={ALL_COUNTRIES}
                            getOptionLabel={(opt) => opt.label}
                            value={countryCode}
                            onChange={(_, val) => setCountryCode(val ?? undefined)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Code"
                                    error={!!fieldErrors.countryCode}
                                    helperText={fieldErrors.countryCode}
                                />
                            )}
                            sx={{ width: 220 }}
                            disableClearable
                            isOptionEqualToValue={(opt, val) => opt.code === val.code}
                            disabled={isEdit}
                        />
                        <TextField
                            label="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setPhoneNumber(val);
                            }}
                            error={!!fieldErrors.phoneNumber}
                            helperText={fieldErrors.phoneNumber || `${phoneNumber.length}/10`}
                            required
                            fullWidth
                            placeholder="10 digit number"
                            disabled={isEdit}
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
