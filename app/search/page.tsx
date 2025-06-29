'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import activityService, { Activity, ApiError, GetActivitiesParams } from '../../services/activityService';
import geolocationService, { GeolocationError } from '../../services/geolocationService';
import SearchBar from '../../components/Search/SearchBar';
import FilterPanel from '../../components/Search/FilterPanel';
import ActivityCard from '../../components/ActivityCard';
import ActivityResultsMap from '../../components/Map/ActivityResultsMap';

// --- Icons ---
const FunnelIcon: React.FC<{ size?: string; color?: string }> = ({ size = "20px", color = "var(--color-text-primary, #333)" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} width={size} height={size}><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
);
const TargetIcon: React.FC<{ size?: string; color?: string }> = ({ size = "20px", color = "var(--color-text-primary, #333)" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} width={size} height={size}><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
);
const ListIcon: React.FC<{ size?: string; color?: string }> = ({ size = "20px", color = "var(--color-text-primary, #333)" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} width={size} height={size}><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"/></svg>
);
const MapViewIcon: React.FC<{ size?: string; color?: string }> = ({ size = "20px", color = "var(--color-text-primary, #333)" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} width={size} height={size}><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9A1 1 0 003 5.82V21s0 .05.02.07l.14.07L9 18.9l6 2.1 5.64-1.9A1 1 0 0021 18.18V3s0-.05-.02-.07zM15 17.1l-6-2.1V5.1l6 2.1v9.9z"/></svg>
);
const FilterCountBadge: React.FC<{ count: number }> = ({ count }) => (
  <span style={{
    position: 'absolute', top: '-5px', right: '-5px',
    background: 'var(--color-orange-primary, #FF6F61)', color: 'white',
    borderRadius: '50%', width: '16px', height: '16px',
    fontSize: '10px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 'bold', border: '1px solid white'
  }}>{count}</span>
);
// --- End Icons ---

type ViewMode = 'list' | 'map';
type SortOrder = 'asc' | 'desc';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lecture du query param initial
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Appliqués
  const [appliedFilters, setAppliedFilters] = useState<GetActivitiesParams>({});
  const defaultSort = { sortBy: 'date', sortOrder: 'desc' as SortOrder };
  const [sortCriteria, setSortCriteria] = useState(defaultSort);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Résultats et états
  const [searchResults, setSearchResults] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchError, setLocationFetchError] = useState<string|null>(null);
  const [prominentFilterErrors, setProminentFilterErrors] = useState<Record<string,string>>({});

  // Met à jour l’URL sans recharger
  const updateUrl = (params: Record<string,string>) => {
    const qp = new URLSearchParams(params).toString();
    router.replace(`/search?${qp}`);
  };

  // Fonction de recherche effective
  const performSearchActual = async (term: string, filters: GetActivitiesParams, sort: typeof sortCriteria) => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([,v])=>v!==undefined && v!=='')
    );
    if (!term && Object.keys(activeFilters).length===0) {
      setSearchResults([]); setHasSearched(false); setError(null);
      updateUrl({});
      return;
    }

    setIsLoading(true); setError(null); setHasSearched(true);
    // Construit URL
    const params: Record<string,string> = {...activeFilters as any, ...(term?{q:term}:{}), ...sort, view:viewMode};
    updateUrl(params);

    try {
      // @ts-ignore
      const results = await activityService.getActivities(params);
      setSearchResults(results);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message||'Erreur lors de la recherche.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Débounce
  const debouncedPerformSearch = useCallback(
    debounce((q,f,s) => performSearchActual(q,f,s), 500),
    []
  );

  // Effet initial
  useEffect(() => {
    // Récupère les filtres depuis l’URL
    const initFilters: GetActivitiesParams = {};
    searchParams.forEach((value, key) => {
      if (!['q','sortBy','sortOrder','view'].includes(key)) {
        (initFilters as any)[key] = value;
      }
    });
    setAppliedFilters(initFilters);
    setSortCriteria({
      sortBy: (searchParams.get('sortBy') as SortOrder) || defaultSort.sortBy,
      sortOrder: (searchParams.get('sortOrder') as SortOrder) || defaultSort.sortOrder,
    });
    setViewMode((searchParams.get('view') as ViewMode) || 'list');
    if (initialQuery || Object.keys(initFilters).length>0) {
      performSearchActual(initialQuery, initFilters, defaultSort);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleSearch = (q: string) => {
    setSearchTerm(q);
    debouncedPerformSearch(q, appliedFilters, sortCriteria);
  };
  const handleProminentFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name,value } = e.target;
    let err = '';
    const num = Number(value);
    if (value!=='' && isNaN(num)) err='Doit être un nombre';
    else if ((name==='age'||name==='max_price') && num<0) err='Doit être ≥0';
    else if (name==='radius' && num<=0) err='Doit être >0';
    setProminentFilterErrors(prev=>({...prev,[name]:err}));
    const newFilters = {...appliedFilters};
    if (!err && value!=='') (newFilters as any)[name] = value;
    else delete (newFilters as any)[name];
    setAppliedFilters(newFilters);
    if (!err) debouncedPerformSearch(searchTerm, newFilters, sortCriteria);
  };
  const handleApplyFiltersFromPanel = (panelFilters: GetActivitiesParams) => {
    const nf = {...appliedFilters, type: panelFilters.type||undefined};
    setAppliedFilters(nf);
    setIsFilterPanelOpen(false);
    performSearchActual(searchTerm, nf, sortCriteria);
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nc = {...sortCriteria, [e.target.name]: e.target.value};
    setSortCriteria(nc);
    performSearchActual(searchTerm, appliedFilters, nc);
  };
  const handleSearchNearby = async() => {
    setIsFetchingLocation(true); setLocationFetchError(null);
    try {
      const pos = await geolocationService.getCurrentPosition();
      const nf = {...appliedFilters,
        latitude: pos.latitude.toFixed(6),
        longitude: pos.longitude.toFixed(6),
        radius: String(appliedFilters.radius||10),
      };
      setAppliedFilters(nf);
      setIsFilterPanelOpen(false);
      performSearchActual(searchTerm, nf, sortCriteria);
    } catch(err) {
      const ge = err as GeolocationError;
      setLocationFetchError(ge.message);
    } finally {
      setIsFetchingLocation(false);
    }
  };
  const handleViewModeChange = (vm: ViewMode) => {
    setViewMode(vm);
    performSearchActual(searchTerm, appliedFilters, sortCriteria);
  };

  const activeFilterCount = Object.values(appliedFilters).filter(v=>v!==undefined&&v!=='').length;

  return (
    <div className="search-page-container global-padding" style={{ paddingTop: 'var(--global-padding)' }}>
      <header style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily:'var(--font-primary)', color:'var(--color-blue-primary)', marginBottom:12 }}>
          Rechercher une activité
        </h2>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:10 }}>
          <div style={{ flexGrow:1, minWidth:200, maxWidth:350 }}>
            <SearchBar initialSearchTerm={searchTerm} onSearch={handleSearch} isLoading={isLoading} />
          </div>
          <button onClick={handleSearchNearby} disabled={isFetchingLocation||isLoading} className="action-button" title="Autour de moi">
            <TargetIcon/> <span style={{marginLeft:5}}>Autour de moi</span>
          </button>
          <button onClick={()=>setIsFilterPanelOpen(true)} className="action-button" style={{ position:'relative' }} aria-label="Filtres avancés">
            <FunnelIcon/> <span style={{marginLeft:5}}>Filtres avancés</span>
            {activeFilterCount>0 && <FilterCountBadge count={activeFilterCount}/>}
          </button>
        </div>

        {/* Prominent filters */}
        <div className="prominent-filters" style={{
          display:'flex',gap:10,alignItems:'flex-start',flexWrap:'wrap',marginBottom:10,
          padding:10,backgroundColor:'var(--color-background-page-alt,#f9f9f9)',
          borderRadius:'var(--button-border-radius,8px)'
        }}>
          {['age','max_price','radius'].map(name=>(
            <div key={name} className="form-group-inline">
              <label htmlFor={name} className="inline-label">
                {name==='age'?'Âge':name==='max_price'?'Tarif max (€)':'Rayon (km)'}:
              </label>
              <input
                type="number" id={name} name={name}
                value={(appliedFilters as any)[name]||''}
                onChange={handleProminentFilterChange}
                placeholder={
                  name==='age'?'ex:10':name==='max_price'?'ex:20':'ex:5'
                }
                min="0"
                className="inline-input small-input"
                disabled={isLoading || (name==='radius' && !(appliedFilters.latitude && appliedFilters.longitude))}
                title={name==='radius' && !(appliedFilters.latitude && appliedFilters.longitude)
                  ?"Nécessite géoloc ou filtre lat/lon" : undefined}
              />
              {prominentFilterErrors[name] && 
                <p className="error-text-inline">{prominentFilterErrors[name]}</p>
              }
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:20, justifyContent:'flex-end' }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <label htmlFor="sortBy" className="sort-label">Trier par:</label>
            <select name="sortBy" value={sortCriteria.sortBy} onChange={handleSortChange} disabled={isLoading} className="sort-select">
              <option value="date">Date</option>
              <option value="price">Prix</option>
              <option value="distance" disabled={!(appliedFilters.latitude && appliedFilters.longitude)}>Distance</option>
              <option value="popularity">Popularité</option>
            </select>
            <select name="sortOrder" value={sortCriteria.sortOrder} onChange={handleSortChange} disabled={isLoading} className="sort-select">
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
          </div>
          <div className="view-mode-toggle">
            <button onClick={()=>handleViewModeChange('list')} disabled={viewMode==='list'} className={viewMode==='list'?'active':''} title="Liste">
              <ListIcon color={viewMode==='list'?'var(--color-orange-primary)':'var(--color-text-primary)'}/> Liste
            </button>
            <button onClick={()=>handleViewModeChange('map')} disabled={viewMode==='map'} className={viewMode==='map'?'active':''} title="Carte">
              <MapViewIcon color={viewMode==='map'?'var(--color-orange-primary)':'var(--color-text-primary)'}/> Carte
            </button>
          </div>
        </div>

        {locationFetchError && <p style={{ color:'red', textAlign:'center' }}>{locationFetchError}</p>}
      </header>

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={()=>setIsFilterPanelOpen(false)}
        currentFilters={appliedFilters}
        onApplyFilters={handleApplyFiltersFromPanel}
      />

      <section className="search-results-section">
        {isLoading && <p>Recherche en cours…</p>}
        {error && <p style={{ color:'red', textAlign:'center' }}>{error}</p>}

        {!isLoading && !error && hasSearched && searchResults.length===0 && (
          <p style={{ textAlign:'center' }}>
            Aucune activité trouvée pour « {searchTerm} ».
          </p>
        )}

        {!isLoading && !error && searchResults.length>0 && (
          viewMode==='list' ? (
            <div className="grid-container">
              {searchResults.map(act=>(
                <div key={act.id} className="grid-col grid-col-12 grid-col-md-6 grid-col-lg-4 activity-card-item">
                  <ActivityCard activity={act}/>
                </div>
              ))}
            </div>
          ) : (
            <ActivityResultsMap
              activities={searchResults}
              center={
                appliedFilters.latitude && appliedFilters.longitude
                  ? [Number(appliedFilters.latitude), Number(appliedFilters.longitude)]
                  : undefined
              }
            />
          )
        )}
      </section>

      <style jsx>{`
        .search-page-container { max-width:1200px; margin:0 auto; }
        .activity-card-item { animation:fadeIn 0.5s ease-in-out forwards; opacity:0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        /* … (ajoute ici tes styles globaux de tri, view toggle, etc.) … */
      `}</style>
    </div>
  );
}

// Helper debounce
function debounce<F extends (...args:any[])=>any>(fn:F, wait=300) {
  let t:ReturnType<typeof setTimeout>;
  return (...args:Parameters<F>)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  };
}

interface Props {
  activities: any[];
  center?: [number, number];
}

export function ActivityResultsMap({ activities, center }: Props) {
  return (
    <div style={{
      minHeight: 300,
      background: '#e0e7ef',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span style={{ color: '#333' }}>
        [Carte des activités ici] ({activities.length} résultat(s))
        {center && (
          <span> — Centre : {center[0]}, {center[1]}</span>
        )}
      </span>
    </div>
  );
}
