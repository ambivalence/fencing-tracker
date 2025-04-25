import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [fencers, setFencers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [entries, setEntries] = useState([]);
  const [pools, setPools] = useState([]);
  const [bouts, setBouts] = useState([]);
  const [deBouts, setDeBouts] = useState([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      const storedFencers = localStorage.getItem('fencing_tracker_fencers');
      const storedTournaments = localStorage.getItem('fencing_tracker_tournaments');
      const storedEntries = localStorage.getItem('fencing_tracker_entries');
      const storedPools = localStorage.getItem('fencing_tracker_pools');
      const storedBouts = localStorage.getItem('fencing_tracker_bouts');
      const storedDeBouts = localStorage.getItem('fencing_tracker_de_bouts');

      if (storedFencers) setFencers(JSON.parse(storedFencers));
      if (storedTournaments) setTournaments(JSON.parse(storedTournaments));
      if (storedEntries) setEntries(JSON.parse(storedEntries));
      if (storedPools) setPools(JSON.parse(storedPools));
      if (storedBouts) setBouts(JSON.parse(storedBouts));
      if (storedDeBouts) setDeBouts(JSON.parse(storedDeBouts));
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fencing_tracker_fencers', JSON.stringify(fencers));
  }, [fencers]);

  useEffect(() => {
    localStorage.setItem('fencing_tracker_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('fencing_tracker_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('fencing_tracker_pools', JSON.stringify(pools));
  }, [pools]);

  useEffect(() => {
    localStorage.setItem('fencing_tracker_bouts', JSON.stringify(bouts));
  }, [bouts]);

  useEffect(() => {
    localStorage.setItem('fencing_tracker_de_bouts', JSON.stringify(deBouts));
  }, [deBouts]);

  // Fencer CRUD operations
  const addFencer = (fencer) => {
    const newFencer = {
      ...fencer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFencers([...fencers, newFencer]);
    return newFencer;
  };

  const updateFencer = (id, updatedData) => {
    const updatedFencers = fencers.map(fencer => 
      fencer.id === id ? { ...fencer, ...updatedData, updatedAt: new Date().toISOString() } : fencer
    );
    setFencers(updatedFencers);
  };

  const deleteFencer = (id) => {
    setFencers(fencers.filter(fencer => fencer.id !== id));
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
    setTournaments([...tournaments, newTournament]);
    return newTournament;
  };

  const updateTournament = (id, updatedData) => {
    const updatedTournaments = tournaments.map(tournament => 
      tournament.id === id ? { ...tournament, ...updatedData, updatedAt: new Date().toISOString() } : tournament
    );
    setTournaments(updatedTournaments);
  };

  const deleteTournament = (id) => {
    setTournaments(tournaments.filter(tournament => tournament.id !== id));
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
    setEntries([...entries, newEntry]);
    return newEntry;
  };

  const updateEntry = (id, updatedData) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedData, updatedAt: new Date().toISOString() } : entry
    );
    setEntries(updatedEntries);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
    // Also delete related pools and DE bouts
    const entryPools = pools.filter(pool => pool.entryId === id);
    entryPools.forEach(pool => {
      deletePool(pool.id);
    });
    setDeBouts(deBouts.filter(bout => bout.entryId !== id));
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
    setPools([...pools, newPool]);
    return newPool;
  };

  const updatePool = (id, updatedData) => {
    const updatedPools = pools.map(pool => 
      pool.id === id ? { ...pool, ...updatedData, updatedAt: new Date().toISOString() } : pool
    );
    setPools(updatedPools);
  };

  const deletePool = (id) => {
    setPools(pools.filter(pool => pool.id !== id));
    // Also delete related bouts
    setBouts(bouts.filter(bout => bout.poolId !== id));
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
    setBouts([...bouts, newBout]);
    return newBout;
  };

  const updateBout = (id, updatedData) => {
    const updatedBouts = bouts.map(bout => 
      bout.id === id ? { ...bout, ...updatedData, updatedAt: new Date().toISOString() } : bout
    );
    setBouts(updatedBouts);
  };

  const deleteBout = (id) => {
    setBouts(bouts.filter(bout => bout.id !== id));
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
    setDeBouts([...deBouts, newDEBout]);
    return newDEBout;
  };

  const updateDEBout = (id, updatedData) => {
    const updatedDEBouts = deBouts.map(deBout => 
      deBout.id === id ? { ...deBout, ...updatedData, updatedAt: new Date().toISOString() } : deBout
    );
    setDeBouts(updatedDEBouts);
  };

  const deleteDEBout = (id) => {
    setDeBouts(deBouts.filter(deBout => deBout.id !== id));
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
    
    const touchesScored = fencerBouts.reduce((sum, bout) => sum + bout.scoreFor, 0);
    const touchesReceived = fencerBouts.reduce((sum, bout) => sum + bout.scoreAgainst, 0);
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
      const entryPools = pools.filter(pool => pool.entryId === entry.id);
      const poolIds = entryPools.map(pool => pool.id);
      const entryBouts = bouts.filter(bout => poolIds.includes(bout.poolId));
      
      const totalBouts = entryBouts.length;
      const victories = entryBouts.filter(bout => bout.victory).length;
      const winPercentage = totalBouts > 0 ? (victories / totalBouts) * 100 : 0;
      
      const touchesScored = entryBouts.reduce((sum, bout) => sum + bout.scoreFor, 0);
      const touchesReceived = entryBouts.reduce((sum, bout) => sum + bout.scoreAgainst, 0);
      const indicator = touchesScored - touchesReceived;
      
      return {
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        date: tournament.startDate,
        winPercentage,
        indicator,
        finalPlacing: entry.finalPlacing,
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
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
    }}>
      {children}
    </DataContext.Provider>
  );
};