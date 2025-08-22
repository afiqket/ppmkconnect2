import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockProposals } from '../data/mockData';
import { Proposal } from '../types';

interface ProposalContextType {
  proposals: Proposal[];
  addProposal: (proposal: Proposal) => void;
  updateProposal: (proposalId: string, updates: Partial<Proposal>) => void;
  deleteProposal: (proposalId: string) => void;
  refreshProposals: () => void;
  getVisibleProposals: () => Proposal[];
  canCreateProposal: () => boolean;
  canEditProposal: (proposal: Proposal) => boolean;
  canDeleteProposal: (proposal: Proposal) => boolean;
  canViewProposal: (proposal: Proposal) => boolean;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Initialize proposals from localStorage or mockData
  useEffect(() => {
    const storedProposals = localStorage.getItem('ppmk_proposals');
    if (storedProposals) {
      try {
        const parsed = JSON.parse(storedProposals);
        setProposals(parsed);
      } catch (error) {
        console.error('Error parsing stored proposals:', error);
        setProposals(mockProposals);
        localStorage.setItem('ppmk_proposals', JSON.stringify(mockProposals));
      }
    } else {
      setProposals(mockProposals);
      localStorage.setItem('ppmk_proposals', JSON.stringify(mockProposals));
    }
  }, []);

  // Auto-refresh proposals periodically for real-time sync
  useEffect(() => {
    const interval = setInterval(() => {
      refreshProposals();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for localStorage changes (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ppmk_proposals' && e.newValue) {
        try {
          const newProposals = JSON.parse(e.newValue);
          setProposals(newProposals);
        } catch (error) {
          console.error('Error parsing proposals from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Custom event listener for same-tab updates
  useEffect(() => {
    const handleProposalUpdate = (e: CustomEvent) => {
      setProposals(e.detail);
    };

    window.addEventListener('proposalsUpdated', handleProposalUpdate as EventListener);
    return () => window.removeEventListener('proposalsUpdated', handleProposalUpdate as EventListener);
  }, []);

  const syncProposals = (updatedProposals: Proposal[]) => {
    setProposals(updatedProposals);
    localStorage.setItem('ppmk_proposals', JSON.stringify(updatedProposals));
    
    // Dispatch custom event for same-tab synchronization
    window.dispatchEvent(new CustomEvent('proposalsUpdated', { 
      detail: updatedProposals 
    }));
  };

  const canCreateProposal = (): boolean => {
    if (!user) return false;
    
    // Allow Club HiCom to create proposals
    return user.role === 'club_hicom';
  };

  const canEditProposal = (proposal: Proposal): boolean => {
    if (!user) return false;
    
    // Senders can always edit their own proposals
    if (proposal.submittedBy === user.id) return true;
    
    // PPMK HiCom can edit all proposals
    if (user.role === 'ppmk_hicom') return true;
    
    return false;
  };

  const canDeleteProposal = (proposal: Proposal): boolean => {
    if (!user) return false;
    
    // Senders can always delete their own proposals
    if (proposal.submittedBy === user.id) return true;
    
    // PPMK HiCom can delete all proposals
    if (user.role === 'ppmk_hicom') return true;
    
    return false;
  };

  const canViewProposal = (proposal: Proposal): boolean => {
    if (!user) return false;

    // Senders can always see their own proposals
    if (proposal.submittedBy === user.id) return true;

    // PPMK HiCom can see all proposals (they are the target audience)
    if (user.role === 'ppmk_hicom') return true;

    // PPMK Biro can see all proposals for administrative purposes
    if (user.role === 'ppmk_biro') return true;

    return false;
  };

  const getVisibleProposals = (): Proposal[] => {
    return proposals.filter(proposal => canViewProposal(proposal));
  };

  const addProposal = (proposal: Proposal) => {
    const updatedProposals = [proposal, ...proposals];
    syncProposals(updatedProposals);
    
    console.log('Proposal added and synced:', proposal);
  };

  const updateProposal = (proposalId: string, updates: Partial<Proposal>) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal || !canEditProposal(proposal)) {
      console.error('Cannot edit this proposal');
      return;
    }

    const updatedProposals = proposals.map(proposal =>
      proposal.id === proposalId ? { ...proposal, ...updates } : proposal
    );
    
    syncProposals(updatedProposals);
    
    console.log('Proposal updated and synced:', proposalId, updates);
  };

  const deleteProposal = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal || !canDeleteProposal(proposal)) {
      console.error('Cannot delete this proposal');
      return;
    }

    const updatedProposals = proposals.filter(p => p.id !== proposalId);
    syncProposals(updatedProposals);
    
    console.log('Proposal deleted:', proposalId);
  };

  const refreshProposals = () => {
    const storedProposals = localStorage.getItem('ppmk_proposals');
    if (storedProposals) {
      try {
        const parsed = JSON.parse(storedProposals);
        setProposals(parsed);
      } catch (error) {
        console.error('Error refreshing proposals:', error);
      }
    }
  };

  return (
    <ProposalContext.Provider value={{ 
      proposals: getVisibleProposals(),
      addProposal,
      updateProposal,
      deleteProposal,
      refreshProposals,
      getVisibleProposals,
      canCreateProposal,
      canEditProposal,
      canDeleteProposal,
      canViewProposal
    }}>
      {children}
    </ProposalContext.Provider>
  );
};

export const useProposals = () => {
  const context = useContext(ProposalContext);
  if (context === undefined) {
    throw new Error('useProposals must be used within a ProposalProvider');
  }
  return context;
};
