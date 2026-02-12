import HttpClient from "@/client/HttpClient";
import { API_BASE_URL } from "@/constants/appConstants";
import { CustomerRequest, Customer, PageResponse } from "@/types/customer";

export async function getCustomers(
    page: number,
    size: number,
    name?: string,
    phone?: string,
    countryCode?: string,
    sortBy?: string,
    sortDir?: string
): Promise<PageResponse<Customer>> {
    const params: Record<string, string | number> = { page, size };
    if (name) params.name = name;
    if (phone) params.phone = phone;
    if (countryCode) params.countryCode = countryCode;
    if (sortBy) params.sortBy = sortBy;
    if (sortDir) params.sortDir = sortDir;
    const { data } = await HttpClient.get("/customers", { params });
    return data;
}

export async function getCustomerById(id: number): Promise<Customer> {
    const { data } = await HttpClient.get(`/customers/${id}`);
    return data;
}

export async function createCustomer(
    request: CustomerRequest
): Promise<Customer> {
    const { data } = await HttpClient.post("/customers", request);
    return data;
}

export async function updateCustomer(
    id: number,
    request: CustomerRequest
): Promise<Customer> {
    const { data } = await HttpClient.put(`/customers/${id}`, request);
    return data;
}

export async function deleteCustomer(id: number): Promise<void> {
    await HttpClient.delete(`/customers/${id}`);
}

export function getExportUrl(): string {
    return `${API_BASE_URL}/customers/export`;
}
