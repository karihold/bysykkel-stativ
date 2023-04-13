import React, { ReactElement, useEffect, useState, useReducer, useMemo } from 'react';
import { CompleteStationData, getCompleteStationData } from '@services/station-services';
import { filterReducer } from '@state/filter-reducer';
import { numberIteratorHook } from '@state/number-iterator-hook';

import ListItem from '@components/list-item/list-item';

import './frontpage.scss';

type SortingType =
  | 'name-ascending'
  | 'name-descending'
  | 'bikes-ascending'
  | 'bikes-descending'
  | 'docks-ascending'
  | 'docks-descending';

type SortingOption = {
  value: SortingType;
  label: string;
};

const sortingOptions: SortingOption[] = [
  { label: 'Stasjon - A til Å', value: 'name-ascending' },
  { label: 'Stasjon - Å til A', value: 'name-descending' },
  { label: 'Sykler - Flest', value: 'bikes-descending' },
  { label: 'Sykler - Færrest', value: 'bikes-ascending' },
  { label: 'Låser - Flest', value: 'docks-descending' },
  { label: 'Låser - Færrest', value: 'docks-ascending' },
];

const Frontpage = (): ReactElement => {
  const [stations, setStations] = useState<CompleteStationData[]>([]);
  const [isFetchingStations, setIsFetchingStations] = useState<boolean>(true);
  const [stationError, setStationError] = useState<boolean>(false);
  const [numberOfStationsToShow, iterateBikesToShow] = numberIteratorHook(25);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sorting, setSorting] = useState<SortingType>('name-ascending');
  const [filters, toggleFilter] = useReducer(filterReducer, {
    hasAvailableBikes: false,
    hasAvailableDocks: false,
  });

  useEffect(() => {
    getCompleteStationData()
      .then((completeStationData) => {
        if (stationError) setStationError(false);

        setStations(completeStationData);
        setIsFetchingStations(false);
      })
      .catch((error) => setStationError(true));
  }, []);

  function filterByStationName(station: CompleteStationData) {
    return station.name.toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase());
  }

  function filterByAvailability(station: CompleteStationData) {
    if (filters.hasAvailableBikes && station.num_bikes_available === 0) {
      return false;
    }

    if (filters.hasAvailableDocks && station.num_docks_available === 0) {
      return false;
    }

    return true;
  }

  function sortStationBySortingType(a: CompleteStationData, b: CompleteStationData) {
    // Sort by station name
    if (sorting === 'name-ascending') {
      return a.name > b.name ? 1 : -1;
    }
    if (sorting === 'name-descending') {
      return a.name < b.name ? 1 : -1;
    }

    // Sort by bikes available
    if (sorting === 'bikes-ascending') {
      return a.num_bikes_available > b.num_bikes_available ? 1 : -1;
    }
    if (sorting === 'bikes-descending') {
      return a.num_bikes_available < b.num_bikes_available ? 1 : -1;
    }

    // Sort by dockings available
    if (sorting === 'docks-ascending') {
      return a.num_docks_available > b.num_docks_available ? 1 : -1;
    }
    if (sorting === 'docks-descending') {
      return a.num_docks_available < b.num_docks_available ? 1 : -1;
    }

    //Default sort alphabetically
    return a.name > b.name ? 1 : -1;
  }

  const stationsToRender = useMemo(() => {
    return stations
      .filter(filterByStationName)
      .filter(filterByAvailability)
      .sort(sortStationBySortingType)
      .slice(0, numberOfStationsToShow);
  }, [stations, numberOfStationsToShow, searchValue, sorting, filters]);

  return (
    <>
      <div className="main-div">
        <section className="top-section">
          <h1>Stasjoner</h1>
          <div className="search-container">
            <input
              className="station-search-input"
              type="text"
              placeholder="Søk etter stasjonsnavn"
              name="search"
              onChange={(event) => setSearchValue(event.currentTarget.value)}
            />
          </div>
          <section className="filter-section">
            <label className="dropdown-label">
              Sorter etter:
              <select className="dropdown-select" onChange={(event) => setSorting(event.target.value as SortingType)}>
                {sortingOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="filter-fieldset">
              <legend className="filter-legend">Filtrer etter ledige:</legend>
              <label className="filter-label">
                <input type="checkbox" checked={filters.hasAvailableDocks} onChange={() => toggleFilter('docks')} />
                Låser
              </label>
              <label className="filter-label">
                <input type="checkbox" checked={filters.hasAvailableBikes} onChange={() => toggleFilter('bikes')} />
                Sykler
              </label>
            </fieldset>
          </section>
        </section>
        {isFetchingStations && !stationError && (
          <p className="status-message">
            <em>Laster inn stasjoner...</em>
          </p>
        )}
        {stationError && (
          <p className="error-message">
            Feil ved henting av stasjoner{' '}
            <button className="try-again-button" onClick={() => window.location.reload()}>
              prøv igjen
            </button>
          </p>
        )}
        {!isFetchingStations && stationsToRender.length > 0 && (
          <ul className="station-list-section">
            {stationsToRender.map((station) => (
              <ListItem
                key={station.station_id}
                stationName={station.name}
                numberOfBikes={station.num_bikes_available}
                numberOfDocks={station.num_docks_available}
              />
            ))}
          </ul>
        )}
        {!isFetchingStations && stationsToRender.length <= 0 && (
          <p className="status-message">Fant ingen stasjoner som utfyller dine kriterier</p>
        )}
        {!isFetchingStations &&
          stations.length > numberOfStationsToShow &&
          stationsToRender.length >= numberOfStationsToShow && (
            <button className="load-more-button" onClick={iterateBikesToShow}>
              Last inn flere stasjoner
            </button>
          )}
      </div>
    </>
  );
};

export default Frontpage;
