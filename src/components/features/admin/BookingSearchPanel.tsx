'use client';

import { useState, useMemo } from 'react';
import { Stack } from '@mantine/core';
import { useSearchBookings } from '@/lib/api/hooks';
import SearchFilters, { type SearchFilters as SearchFiltersType } from './SearchFilters';
import SearchResults from './SearchResults';
import type { BookingGrouped } from '@/schemas/booking/bookingGrouped';

const defaultFilters: SearchFiltersType = {
    q: '',
    status: [],
    client_name: '',
    contact: '',
    location: '',
    date_from: '',
    date_to: '',
    people_count: null,
    budget_min: null,
    budget_max: null,
    language: '',
    sort_by: 'created_at',
    sort_order: 'desc',
};

export default function BookingSearchPanel() {
    const [filters, setFilters] = useState<SearchFiltersType>(defaultFilters);

    // Convert filters to search params
    const searchParams = useMemo(() => {
        const params: Record<string, string | number | null> = {};

        if (filters.q.trim()) { params.q = filters.q.trim(); }
        if (filters.status.length > 0) { params.status = filters.status.join(','); }
        if (filters.client_name.trim()) { params.client_name = filters.client_name.trim(); }
        if (filters.contact.trim()) { params.contact = filters.contact.trim(); }
        if (filters.location.trim()) { params.location = filters.location.trim(); }
        if (filters.date_from) { params.date_from = filters.date_from; }
        if (filters.date_to) { params.date_to = filters.date_to; }
        if (filters.people_count) { params.people_count = filters.people_count; }
        if (filters.budget_min) { params.budget_min = filters.budget_min; }
        if (filters.budget_max) { params.budget_max = filters.budget_max; }
        if (filters.language.trim()) { params.language = filters.language.trim(); }
        if (filters.sort_by) { params.sort_by = filters.sort_by; }
        if (filters.sort_order) { params.sort_order = filters.sort_order; }

        return params;
    }, [filters]);

    const { data, isLoading, error } = useSearchBookings(searchParams);

    const clearFilters = () => {
        setFilters(defaultFilters);
    };


    return (
        <Stack gap="lg">
            <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
            />

            <SearchResults
                data={data as BookingGrouped | null}
                isLoading={isLoading}
                error={error as Error | null}
            />
        </Stack>
    );
}
