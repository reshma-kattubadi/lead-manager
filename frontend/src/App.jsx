import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import StatCards from './components/StatCards';
import SearchFilterBar from './components/SearchFilterBar';
import LeadTable from './components/LeadTable';
import LeadModal from './components/LeadModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import EmptyState from './components/EmptyState';
import { leadApi, formatErrorMessage } from './services/api';

function App() {
  // Main State
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
  });

  // Filter, Search, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // UI & Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Toast Feedback State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Debounce search query input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, sourceFilter]);

  // Fetch Dashboard Statistics from API
  const loadStats = useCallback(async () => {
    try {
      const response = await leadApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.warn('Could not fetch lead stats:', error.message);
    }
  }, []);

  // Fetch Leads with Current Filters & Pagination from API
  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadApi.getLeads({
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
        sort: sortBy,
        page,
        limit,
      });

      if (response.success) {
        setLeads(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalRecords(response.total !== undefined ? response.total : (response.data || []).length);
      }
    } catch (error) {
      const msg = formatErrorMessage(error);
      showToast(`Error fetching leads: ${msg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, sourceFilter, sortBy, page, limit]);

  // Load leads whenever query, filters, sort or page changes
  useEffect(() => {
    loadLeads();
    loadStats();
  }, [loadLeads, loadStats]);

  // Handlers for Modals
  const handleOpenAddModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleOpenDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLeadToDelete(null);
  };

  // Form Submission: Create or Update Lead
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingLead) {
        const leadId = editingLead._id || editingLead.id;
        await leadApi.updateLead(leadId, formData);
        showToast('Lead details updated successfully!', 'success');
      } else {
        await leadApi.createLead(formData);
        showToast('New lead created successfully!', 'success');
      }
      handleCloseModal();
      loadLeads();
      loadStats();
    } catch (error) {
      const msg = formatErrorMessage(error);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status Update directly from Table dropdown
  const handleQuickStatusUpdate = async (lead, newStatus) => {
    const leadId = lead._id || lead.id;
    if (lead.status === newStatus) return;

    // Optimistic local update
    setLeads((prevLeads) =>
      prevLeads.map((item) =>
        (item._id || item.id) === leadId ? { ...item, status: newStatus } : item
      )
    );

    try {
      await leadApi.updateLead(leadId, { status: newStatus });
      showToast(`Status updated to ${newStatus}`, 'success');
      loadStats();
    } catch (error) {
      const msg = formatErrorMessage(error);
      showToast(`Failed to update status: ${msg}`, 'error');
      loadLeads();
    }
  };

  // Lead Deletion after Confirmation
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await leadApi.deleteLead(id);
      showToast('Lead deleted successfully from MongoDB', 'success');
      handleCloseDeleteModal();
      loadLeads();
      loadStats();
    } catch (error) {
      const msg = formatErrorMessage(error);
      showToast(`Failed to delete lead: ${msg}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setStatusFilter('All');
    setSourceFilter('All');
    setSortBy('-createdAt');
    setPage(1);
  };

  // Export current leads as CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created At'];
    const rows = leads.map((lead) => [
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.company || '').replace(/"/g, '""')}"`,
      `"${(lead.source || '').replace(/"/g, '""')}"`,
      `"${(lead.status || '').replace(/"/g, '""')}"`,
      `"${lead.createdAt ? new Date(lead.createdAt).toISOString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${leads.length} leads to CSV`, 'info');
  };

  const hasFilterActive =
    searchQuery.trim() !== '' || statusFilter !== 'All' || sourceFilter !== 'All';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar totalLeads={stats.total} />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dashboard Content Area */}
        <main className="flex-1 lg:pl-8 min-w-0">
          {/* Header */}
          <DashboardHeader
            onAddLead={handleOpenAddModal}
            onRefresh={() => {
              loadLeads();
              loadStats();
              showToast('Refreshed pipeline data from MongoDB', 'info');
            }}
            onExportCSV={handleExportCSV}
            totalLeads={totalRecords}
            isLoading={isLoading}
            openMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Metric Statistic Cards */}
          <StatCards
            stats={stats}
            activeStatus={statusFilter}
            onStatusSelect={(status) => setStatusFilter(status)}
          />

          {/* Search & Filter Toolbar */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sourceFilter={sourceFilter}
            onSourceChange={setSourceFilter}
            onResetFilters={handleResetFilters}
            totalResults={totalRecords}
          />

          {/* Leads Table or Empty State */}
          {leads.length > 0 ? (
            <LeadTable
              leads={leads}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onStatusUpdate={handleQuickStatusUpdate}
              isLoading={isLoading}
              sortBy={sortBy}
              onSortChange={(newSort) => setSortBy(newSort)}
              page={page}
              totalPages={totalPages}
              totalRecords={totalRecords}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          ) : (
            <EmptyState
              isFiltered={hasFilterActive}
              onReset={handleResetFilters}
              onAddLead={handleOpenAddModal}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        lead={editingLead}
        isSubmitting={isSubmitting}
      />

      {/* Delete Lead Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        lead={leadToDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Alert Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default App;
