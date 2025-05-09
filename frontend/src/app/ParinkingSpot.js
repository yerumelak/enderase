import React from "react";
import "../style/parkingSpot.css";
import { useTranslation } from "react-i18next";

const ParkingSpot = ({ spotNumber, occupied, spotName }) => {
    const { t, i18n } = useTranslation();
    return (
        <div className="parking-spot">
            <div className="spot-number">{spotName}</div>
            {occupied ? (
                <div className="car">
                    <img alt="" className="car-img" src="car.png" />
                </div>
            ) : (
                <div className="empty">{t("Available")}</div>
            )}
        </div>
    );
};

export default ParkingSpot;

