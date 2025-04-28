import React from "react";
import "../style/parkingSpot.css";

const ParkingSpot = ({ spotNumber, occupied, spotName }) => {
    return (
        <div className="parking-spot">
            <div className="spot-number">{spotName}</div>
            {occupied ? (
                <div className="car">
                    <img alt="" className="car-img" src="car.png" />
                </div>
            ) : (
                <div className="empty">Available</div>
            )}
        </div>
    );
};

export default ParkingSpot;

