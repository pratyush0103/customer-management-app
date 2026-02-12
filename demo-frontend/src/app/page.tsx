"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "@mui/material/styles";
import { getCustomers, getCustomerById, deleteCustomer, getExportUrl } from "@/services/api";
import { Customer } from "@/types/customer";
import { ALL_COUNTRIES } from "@/constants/countries";
import CustomerModal from "@/components/CustomerModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useColorMode } from "@/components/ThemeProvider";

const headerCellSx = {
  fontWeight: 700,
  backgroundColor: "#e3f2fd",
  whiteSpace: "nowrap" as const,
};

type SortField = "id" | "createdAt" | "updatedAt";
type SortDir = "asc" | "desc";

export default function HomePage() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDark = theme.palette.mode === "dark";

  const darkHeaderSx = isDark
    ? { ...headerCellSx, backgroundColor: "#1e3a5f", color: "#fff" }
    : headerCellSx;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterCountries, setFilterCountries] = useState<{ code: string; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setError(null);
      const countryCode = filterCountries.length === 1 ? filterCountries[0].code : undefined;
      const data = await getCustomers(
        page,
        rowsPerPage,
        searchName || undefined,
        searchPhone || undefined,
        countryCode,
        sortBy,
        sortDir
      );
      let results = data.content;
      if (filterCountries.length > 1) {
        const codes = new Set(filterCountries.map((c) => c.code));
        results = results.filter((c) => codes.has(c.countryCode));
      }
      setCustomers(results);
      setTotal(filterCountries.length > 1 ? results.length : data.page.totalElements);
    } catch {
      setError("Failed to load customers.");
    }
  }, [page, rowsPerPage, searchName, searchPhone, filterCountries, sortBy, sortDir]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSaved = () => {
    setModalOpen(false);
    setEditCustomer(null);
    setPage(0);
    fetchCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget.id);
      setDeleteTarget(null);
      fetchCustomers();
    } catch {
      setError("Failed to delete customer.");
      setDeleteTarget(null);
    }
  };

  const handleSearchById = async () => {
    const id = parseInt(searchId, 10);
    if (isNaN(id) || id <= 0) {
      setError("Please enter a valid customer ID.");
      return;
    }
    try {
      setError(null);
      const customer = await getCustomerById(id);
      setCustomers([customer]);
      setTotal(1);
    } catch {
      setError(`Customer with ID ${id} not found.`);
      setCustomers([]);
      setTotal(0);
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchName("");
    setSearchPhone("");
    setFilterCountries([]);
    setPage(0);
  };

  const formatDateTime = (dt: string) => {
    return new Date(dt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const hasActiveSearch = searchId || searchName || searchPhone || filterCountries.length > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Customers
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={toggleColorMode} color="inherit">
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            href={getExportUrl()}
            disabled={customers.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditCustomer(null);
              setModalOpen(true);
            }}
          >
            Add Customer
          </Button>
        </Stack>
      </Stack>

      {/* Search & Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap alignItems="center">
        <TextField
          label="Search by ID"
          size="small"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchById();
          }}
          sx={{ width: 120 }}
        />
        <TextField
          label="Search by name"
          size="small"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setSearchPhone("");
            setSearchId("");
            setPage(0);
          }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Search by phone"
          size="small"
          value={searchPhone}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            setSearchPhone(val);
            setSearchName("");
            setSearchId("");
            setPage(0);
          }}
          sx={{ minWidth: 160 }}
          placeholder="Max 10 digits"
        />
        <Autocomplete
          multiple
          options={ALL_COUNTRIES}
          getOptionLabel={(opt) => opt.label}
          value={filterCountries}
          onChange={(_, val) => {
            setFilterCountries(val);
            setSearchName("");
            setSearchPhone("");
            setSearchId("");
            setPage(0);
          }}
          renderTags={(value, getTagProps) =>
            value.map((opt, index) => (
              <Chip label={opt.code} size="small" {...getTagProps({ index })} key={opt.label} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Filter by country" size="small" />
          )}
          sx={{ minWidth: 250 }}
          isOptionEqualToValue={(opt, val) => opt.code === val.code && opt.label === val.label}
          disableCloseOnSelect
        />
        {hasActiveSearch && (
          <Button size="small" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={darkHeaderSx}>
                <TableSortLabel
                  active={sortBy === "id"}
                  direction={sortBy === "id" ? sortDir : "desc"}
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={darkHeaderSx}>First Name</TableCell>
              <TableCell sx={darkHeaderSx}>Last Name</TableCell>
              <TableCell sx={darkHeaderSx}>DOB</TableCell>
              <TableCell sx={darkHeaderSx}>Country</TableCell>
              <TableCell sx={darkHeaderSx}>Phone</TableCell>
              <TableCell sx={darkHeaderSx}>
                <TableSortLabel
                  active={sortBy === "createdAt"}
                  direction={sortBy === "createdAt" ? sortDir : "desc"}
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell sx={darkHeaderSx}>
                <TableSortLabel
                  active={sortBy === "updatedAt"}
                  direction={sortBy === "updatedAt" ? sortDir : "desc"}
                  onClick={() => handleSort("updatedAt")}
                >
                  Updated
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ ...darkHeaderSx, textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.firstName}</TableCell>
                  <TableCell>{c.lastName}</TableCell>
                  <TableCell>{c.dateOfBirth}</TableCell>
                  <TableCell>{c.countryName}</TableCell>
                  <TableCell>
                    {c.countryCode} {c.phoneNumber}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                    {formatDateTime(c.createdAt)}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                    {formatDateTime(c.updatedAt)}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(c)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(c)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <CustomerModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCustomer(null);
        }}
        onSaved={handleSaved}
        customer={editCustomer}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        customerName={deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}
