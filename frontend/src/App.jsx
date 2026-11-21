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

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

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
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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

  // Fetch Leads with Current Filters from API
  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadApi.getLeads({
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
      });

      if (response.success) {
        setLeads(response.data || []);
      }
    } catch (error) {
      const msg = formatErrorMessage(error);
      showToast(`Error fetching leads: ${msg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, sourceFilter]);

  // Load leads whenever debounced search or filters change
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
        // Update existing lead
        const leadId = editingLead._id || editingLead.id;
        await leadApi.updateLead(leadId, formData);
        showToast('Lead details updated successfully!', 'success');
      } else {
        // Create new lead
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
      // Rollback on failure
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
            totalResults={leads.length}
          />

          {/* Leads Table or Empty State */}
          {leads.length > 0 ? (
            <LeadTable
              leads={leads}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onStatusUpdate={handleQuickStatusUpdate}
              isLoading={isLoading}
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
