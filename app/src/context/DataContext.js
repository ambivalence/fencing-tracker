import React, { createContext, useState, useEffect } from 'react';

// Helper functions for local storage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved data to ${key}`, data);
    return true;
  } catch (error) {
    console.error(`Error saving to ${key}:`, error);
    return false;
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const data = JSON.parse(item);
      console.log(`Loaded data from ${key}:`, data);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error loading from ${key}:`, error);
    return null;
  }
};

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Initialize state with data from localStorage or empty arrays
  const [fencers, setFencers] = useState(() => loadFromLocalStorage('fencing_tracker_fencers') || []);
  const [tournaments, setTournaments] = useState(() => loadFromLocalStorage('fencing_tracker_tournaments') || []);
  const [entries, setEntries] = useState(() => loadFromLocalStorage('fencing_tracker_entries') || []);
  const [pools, setPools] = useState(() => loadFromLocalStorage('fencing_tracker_pools') || []);
  const [bouts, setBouts] = useState(() => loadFromLocalStorage('fencing_tracker_bouts') || []);
  const [deBouts, setDeBouts] = useState(() => loadFromLocalStorage('fencing_tracker_de_bouts') || []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('fencing_tracker_fencers', fencers);
  }, [fencers]);

  useEffect(() => {
    saveToLocalStorage('fencing_tracker_tournaments', tournaments);
  }, [tournaments]);

  useEffect(() => {
    saveToLocalStorage('fencing_tracker_entries', entries);
  }, [entries]);

  useEffect(() => {
    saveToLocalStorage('fencing_tracker_pools', pools);
  }, [pools]);

  useEffect(() => {
    saveToLocalStorage('fencing_tracker_bouts', bouts);
  }, [bouts]);

  useEffect(() => {
    saveToLocalStorage('fencing_tracker_de_bouts', deBouts);
  }, [deBouts]);

  // Fencer CRUD operations
  const addFencer = (fencer) => {
    const newFencer = {
      ...fencer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedFencers = [...fencers, newFencer];
    setFencers(updatedFencers);
    saveToLocalStorage('fencing_tracker_fencers', updatedFencers);
    return newFencer;
  };

  const updateFencer = (id, updatedData) => {
    const updatedFencers = fencers.map(fencer => 
      fencer.id === id ? { ...fencer, ...updatedData, updatedAt: new Date().toISOString() } : fencer
    );
    setFencers(updatedFencers);
    saveToLocalStorage('fencing_tracker_fencers', updatedFencers);
  };

  const deleteFencer = (id) => {
    const updatedFencers = fencers.filter(fencer => fencer.id !== id);
    setFencers(updatedFencers);
    saveToLocalStorage('fencing_tracker_fencers', updatedFencers);
    
    // Also delete related entries
    const fencerEntries = entries.filter(entry => entry.fencerId === id);
    fencerEntries.forEach(entry => {
      deleteEntry(entry.id);
    });
  };

  const getFencer = (id) => {
    return fencers.find(fencer => fencer.id === id);
  };

  // Tournament CRUD operations
  const addTournament = (tournament) => {
    const newTournament = {
      ...tournament,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedTournaments = [...tournaments, newTournament];
    setTournaments(updatedTournaments);
    saveToLocalStorage('fencing_tracker_tournaments', updatedTournaments);
    return newTournament;
  };

  const updateTournament = (id, updatedData) => {
    const updatedTournaments = tournaments.map(tournament => 
      tournament.id === id ? { ...tournament, ...updatedData, updatedAt: new Date().toISOString() } : tournament
    );
    setTournaments(updatedTournaments);
    saveToLocalStorage('fencing_tracker_tournaments', updatedTournaments);
  };

  const deleteTournament = (id) => {
    const updatedTournaments = tournaments.filter(tournament => tournament.id !== id);
    setTournaments(updatedTournaments);
    saveToLocalStorage('fencing_tracker_tournaments', updatedTournaments);
    
    // Also delete related entries
    const tournamentEntries = entries.filter(entry => entry.tournamentId === id);
    tournamentEntries.forEach(entry => {
      deleteEntry(entry.id);
    });
  };

  const getTournament = (id) => {
    return tournaments.find(tournament => tournament.id === id);
  };

  // Entry CRUD operations
  const addEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    saveToLocalStorage('fencing_tracker_entries', updatedEntries);
    return newEntry;
  };

  const updateEntry = (id, updatedData) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedData, updatedAt: new Date().toISOString() } : entry
    );
    setEntries(updatedEntries);
    saveToLocalStorage('fencing_tracker_entries', updatedEntries);
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    saveToLocalStorage('fencing_tracker_entries', updatedEntries);
    
    // Also delete related pools and DE bouts
    const entryPools = pools.filter(pool => pool.entryId === id);
    entryPools.forEach(pool => {
      deletePool(pool.id);
    });
    
    const updatedDEBouts = deBouts.filter(bout => bout.entryId !== id);
    setDeBouts(updatedDEBouts);
    saveToLocalStorage('fencing_tracker_de_bouts', updatedDEBouts);
  };

  const getEntry = (id) => {
    return entries.find(entry => entry.id === id);
  };

  // Pool CRUD operations
  const addPool = (pool) => {
    const newPool = {
      ...pool,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedPools = [...pools, newPool];
    setPools(updatedPools);
    saveToLocalStorage('fencing_tracker_pools', updatedPools);
    return newPool;
  };

  const updatePool = (id, updatedData) => {
    const updatedPools = pools.map(pool => 
      pool.id === id ? { ...pool, ...updatedData, updatedAt: new Date().toISOString() } : pool
    );
    setPools(updatedPools);
    saveToLocalStorage('fencing_tracker_pools', updatedPools);
  };

  const deletePool = (id) => {
    const updatedPools = pools.filter(pool => pool.id !== id);
    setPools(updatedPools);
    saveToLocalStorage('fencing_tracker_pools', updatedPools);
    
    // Also delete related bouts
    const updatedBouts = bouts.filter(bout => bout.poolId !== id);
    setBouts(updatedBouts);
    saveToLocalStorage('fencing_tracker_bouts', updatedBouts);
  };

  const getPool = (id) => {
    return pools.find(pool => pool.id === id);
  };

  // Bout CRUD operations
  const addBout = (bout) => {
    const newBout = {
      ...bout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedBouts = [...bouts, newBout];
    setBouts(updatedBouts);
    saveToLocalStorage('fencing_tracker_bouts', updatedBouts);
    return newBout;
  };

  const updateBout = (id, updatedData) => {
    const updatedBouts = bouts.map(bout => 
      bout.id === id ? { ...bout, ...updatedData, updatedAt: new Date().toISOString() } : bout
    );
    setBouts(updatedBouts);
    saveToLocalStorage('fencing_tracker_bouts', updatedBouts);
  };

  const deleteBout = (id) => {
    const updatedBouts = bouts.filter(bout => bout.id !== id);
    setBouts(updatedBouts);
    saveToLocalStorage('fencing_tracker_bouts', updatedBouts);
  };

  const getBout = (id) => {
    return bouts.find(bout => bout.id === id);
  };

  // DE Bout CRUD operations
  const addDEBout = (deBout) => {
    const newDEBout = {
      ...deBout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedDEBouts = [...deBouts, newDEBout];
    setDeBouts(updatedDEBouts);
    saveToLocalStorage('fencing_tracker_de_bouts', updatedDEBouts);
    return newDEBout;
  };

  const updateDEBout = (id, updatedData) => {
    const updatedDEBouts = deBouts.map(deBout => 
      deBout.id === id ? { ...deBout, ...updatedData, updatedAt: new Date().toISOString() } : deBout
    );
    setDeBouts(updatedDEBouts);
    saveToLocalStorage('fencing_tracker_de_bouts', updatedDEBouts);
  };

  const deleteDEBout = (id) => {
    const updatedDEBouts = deBouts.filter(deBout => deBout.id !== id);
    setDeBouts(updatedDEBouts);
    saveToLocalStorage('fencing_tracker_de_bouts', updatedDEBouts);
  };

  const getDEBout = (id) => {
    return deBouts.find(deBout => deBout.id === id);
  };

  // Analytics functions
  const getFencerStats = (fencerId) => {
    const fencerEntries = entries.filter(entry => entry.fencerId === fencerId);
    const entryIds = fencerEntries.map(entry => entry.id);
    
    const fencerPools = pools.filter(pool => entryIds.includes(pool.entryId));
    const poolIds = fencerPools.map(pool => pool.id);
    
    const fencerBouts = bouts.filter(bout => poolIds.includes(bout.poolId));
    const fencerDEBouts = deBouts.filter(bout => entryIds.includes(bout.entryId));
    
    const totalBouts = fencerBouts.length;
    const victories = fencerBouts.filter(bout => bout.victory).length;
    const winPercentage = totalBouts > 0 ? (victories / totalBouts) * 100 : 0;
    
    const touchesScored = fencerBouts.reduce((sum, bout) => sum + (bout.scoreFor || 0), 0);
    const touchesReceived = fencerBouts.reduce((sum, bout) => sum + (bout.scoreAgainst || 0), 0);
    const indicator = touchesScored - touchesReceived;
    
    const totalDEBouts = fencerDEBouts.length;
    const deVictories = fencerDEBouts.filter(bout => bout.victory).length;
    const deWinPercentage = totalDEBouts > 0 ? (deVictories / totalDEBouts) * 100 : 0;
    
    return {
      totalTournaments: fencerEntries.length,
      totalPoolBouts: totalBouts,
      poolVictories: victories,
      poolWinPercentage: winPercentage,
      touchesScored,
      touchesReceived,
      indicator,
      totalDEBouts,
      deVictories,
      deWinPercentage,
    };
  };

  const getPerformanceTrend = (fencerId) => {
    const fencerEntries = entries.filter(entry => entry.fencerId === fencerId);
    
    return fencerEntries.map(entry => {
      const tournament = getTournament(entry.tournamentId);
      if (!tournament) return null;
      
      const entryPools = pools.filter(pool => pool.entryId === entry.id);
      const poolIds = entryPools.map(pool => pool.id);
      const entryBouts = bouts.filter(bout => poolIds.includes(bout.poolId));
      
      const totalBouts = entryBouts.length;
      const victories = entryBouts.filter(bout => bout.victory).length;
      const winPercentage = totalBouts > 0 ? (victories / totalBouts) * 100 : 0;
      
      const touchesScored = entryBouts.reduce((sum, bout) => sum + (bout.scoreFor || 0), 0);
      const touchesReceived = entryBouts.reduce((sum, bout) => sum + (bout.scoreAgainst || 0), 0);
      const indicator = touchesScored - touchesReceived;
      
      return {
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        date: tournament.startDate,
        winPercentage,
        indicator,
        finalPlacing: entry.finalPlacing,
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    try {
      const data = {
        fencers: loadFromLocalStorage('fencing_tracker_fencers'),
        tournaments: loadFromLocalStorage('fencing_tracker_tournaments'),
        entries: loadFromLocalStorage('fencing_tracker_entries'),
        pools: loadFromLocalStorage('fencing_tracker_pools'),
        bouts: loadFromLocalStorage('fencing_tracker_bouts'),
        deBouts: loadFromLocalStorage('fencing_tracker_de_bouts'),
      };
      console.log('Current localStorage data:', data);
      return data;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return { error: error.message };
    }
  };

  return (
    <DataContext.Provider value={{
      // Data
      fencers,
      tournaments,
      entries,
      pools,
      bouts,
      deBouts,
      
      // Fencer operations
      addFencer,
      updateFencer,
      deleteFencer,
      getFencer,
      
      // Tournament operations
      addTournament,
      updateTournament,
      deleteTournament,
      getTournament,
      
      // Entry operations
      addEntry,
      updateEntry,
      deleteEntry,
      getEntry,
      
      // Pool operations
      addPool,
      updatePool,
      deletePool,
      getPool,
      
      // Bout operations
      addBout,
      updateBout,
      deleteBout,
      getBout,
      
      // DE Bout operations
      addDEBout,
      updateDEBout,
      deleteDEBout,
      getDEBout,
      
      // Analytics
      getFencerStats,
      getPerformanceTrend,
      
      // Debug
      debugLocalStorage,
    }}>
      {children}
    </DataContext.Provider>
  );
};