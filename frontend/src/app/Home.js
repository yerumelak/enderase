import { useEffect, useState } from "react";
import api from "./auth/api";
import ParkingSpot from "./ParinkingSpot";
import "../style/home.css"
import LocationForm from "./LocationForm";
import { useTranslation } from "react-i18next";

export default function ParkingLot() {
    const [spots, setSpots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const { t, i18n } = useTranslation();

    var half = Math.ceil(spots.length / 2);
    var topSpots = spots.slice(0, half);
    var bottomSpots = spots.slice(half);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        fetchSpots();
        half = Math.ceil(spots.length / 2);
        topSpots = spots.slice(0, half);
        bottomSpots = spots.slice(half);
        console.log(topSpots);
        console.log(bottomSpots);
    }, [showModal, modalVisible, showDeleteModal]);
    useEffect(() => {
        const start = new Date(startTime);
        const stop = new Date(endTime);

        if (!isNaN(start) && !isNaN(stop)) {
            var diff = stop - start;
            diff = Math.floor(diff / 60000) / 60;
            var currentPrice = parseFloat(selectedSpot.pricing.price_per_hour);
            console.log(diff, currentPrice, diff * currentPrice);
            setPrice(currentPrice);
            console.log(price);
        } else {
            console.log("either startTime or endTime not filled");
        }
    }, [endTime, startTime]);

    const fetchSpots = () => {
        api.get('/api/parking_spots')
            .then((response) => {
                setSpots(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const openModal = (spot) => {
        console.log("open");
        setSelectedSpot(spot);
        setShowModal(true);
        setPrice(0);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSpot(null);
        setStartTime('');
        setEndTime('');
    };
    const submitBooking = () => {
        if (!startTime || !endTime) {
            alert('Please fill in both start and end times.');
            return;
        }
        console.log(selectedSpot);
        api.post('/api/booking/', {
            spot: `/api/parking_spots/${selectedSpot.id}/`,
            start_time: startTime,
            end_time: endTime,
        })
            .then((response) => {
                alert('Spot booked successfully!');
                closeModal();
                fetchSpots();
                console.log(response.data);
                setPrice(0);
            })
            .catch((error) => {
                console.error(error.response.data);
                alert('Failed to book spot.');
            });
    };

    const submitDelete = () => {
        api.delete(`/api/parking_spots/${selectedSpot.id}/`).then(() => {
            alert('Spot Deleted successfully!');
            console.log('Deleted!');
            setShowDeleteModal(false);
        }).catch(err => {
            console.error('Delete error', err);
        });
    }

    const handleAddNew = () => {
        setSelectedLocation(null); // Clear selected location for a new entry
        setModalVisible(true);
    };

    const handleEdit = (spot) => {
        setSelectedLocation(spot);
        setModalVisible(true);
    };

    const handleDelete = (spot) => {
        setSelectedSpot(spot);
        setShowDeleteModal(true);
    };

    return (
        <div className="parking-lot" >
            <div className="lot-title">
                <h1>{t("Parking Lot")}</h1>
                {user?.is_staff &&
                    <button className="btn-add-new" onClick={handleAddNew}>
                        + {t("Add New")}
                    </button>
                }
            </div>
            <div className="lot">
                <div className="top">
                    {topSpots.map((spot, index) => (
                        <div key={index} className="parking-spot">
                            {user?.is_staff &&
                                <>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(spot)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(spot)}
                                    >
                                        Delete
                                    </button>
                                </>
                            }
                            <div className="parking-spot" onClick={() => { if (spot.is_available) openModal(spot); }}>
                                <ParkingSpot spotNumber={index + 1} occupied={!spot.is_available} spotName={spot.spot_number} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bottom">
                    {bottomSpots.map((spot, index) => (
                        <div key={index} className="parking-spot">
                            {user?.is_staff &&
                                <>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(spot)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(spot)}
                                    >
                                        Delete
                                    </button>
                                </>
                            }
                            <div className="parking-spot" onClick={() => { if (spot.is_available) openModal(spot); }}>
                                <ParkingSpot spotNumber={index + 1} occupied={!spot.is_available} spotName={spot.spot_number} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div style={modalStyles.overlay}>
                    <form style={modalStyles.modal}>
                        <h2>{t("Book Spot")} {selectedSpot.spot_number}</h2><br /><br />
                        <div>
                            <label>{t("Start Time")}:</label><br />
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            /><br /><br />
                        </div>
                        <div>
                            <label>{t("End Time")}:</label><br />
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => { setEndTime(e.target.value); }}
                            /><br /><br />
                        </div>
                        <div>
                            <label>{t("Price")}: {price} {t("ETB")}</label>
                        </div>
                        <button type="button" className="btn" onClick={submitBooking}>{t("Book")}</button>
                        <button className="btn" onClick={closeModal} >{t("Cancel")}</button>
                    </form>
                </div>
            )}

            {showDeleteModal && (
                <div style={modalStyles.overlay}>
                    <form style={modalStyles.modal}>
                        <h2>Delete Spot {selectedSpot.spot_number}</h2><br /><br />
                        <button type="button" className="btn-delete" onClick={submitDelete}>Delete</button>
                        <button className="btn-edit" onClick={() => setShowDeleteModal(false)} >Cancel</button>
                    </form>
                </div>
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <LocationForm initialData={selectedLocation} onClose={() => setModalVisible(false)} />
                    </div>
                </div>
            )}
        </div >
    );
}
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        background: '#fff',
        padding: '30px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center'
    }
};
