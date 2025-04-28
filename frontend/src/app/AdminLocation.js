import React, { useEffect, useState } from 'react';
import '../style/LocationList.css';
import api from './auth/api';
import LocationForm from './LocationForm'; // Import the form component

const AdminLocationPanel = () => {
    const [locations, setLocations] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/api/locations/');
                setLocations(res.data);
            } catch (err) {
                console.error('Error fetching locations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);


    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredLocations = locations.filter((loc) =>
        loc.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleEdit = (location) => {
        setSelectedLocation(location);
        setModalVisible(true);
    };

    const handleAddNew = () => {
        setSelectedLocation(null); // Clear selected location for a new entry
        setModalVisible(true);
    };

    return (
        <div className="location-list-container">
            <div className="header">
                <h2>Parking Locations</h2>
                <button className="btn-add-new" onClick={handleAddNew}>
                    + Add New
                </button>
            </div>

            <input
                type="text"
                placeholder="Filter by name..."
                value={filter}
                onChange={handleFilterChange}
                className="filter-input"
            />

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="location-cards">
                    {filteredLocations.map((location) => (
                        <div key={location.id} className="location-card">
                            <h3>{location.name}</h3>
                            <p>{location.address}</p>
                            <p>Latitude: {location.latitude}</p>
                            <p>Longitude: {location.longitude}</p>
                            <div className="button-container">
                                <button
                                    className="btn-edit"
                                    onClick={() => handleEdit(location)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <LocationForm initialData={selectedLocation} onClose={() => setModalVisible(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLocationPanel;

