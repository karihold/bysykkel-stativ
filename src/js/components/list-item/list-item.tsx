import React from 'react';
import './list-item.scss';

type StationListItemProps = {
  stationName: string;
  numberOfDocks: number;
  numberOfBikes: number;
};

const StationListItem = ({ stationName, numberOfDocks, numberOfBikes }: StationListItemProps) => {
  return (
    <li className="station-li">
      <h2 className="station-name">{stationName}</h2>
      <div className="station-numbers-div">
        <section className="locks-section">
          <p className="locks-p">Låser:</p>
          <p className="number-locks">{numberOfDocks}</p>
        </section>
        <section className="bikes-section">
          <p className="bikes-p">Sykler:</p>
          <p className="number-bikes">{numberOfBikes}</p>
        </section>
      </div>
    </li>
  );
};

export default StationListItem;
