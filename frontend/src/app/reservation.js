import lot from '../images/lot.jpg';
import rate from '../images/rate.png';
import '../style/App.css';

export default function Reservation() {
    const cards = [
        {
            id: '',
        },
        {
            id: '',
        },
        {
            id: '',
        },
        {
            id: '',
        },
        {
            id: '',
        },
    ];

    return (
        <div className="app">
            <div className='main'>
                <p className='title'>Near By Parking Spots</p>
                <hr />
                <div className='list'>
                    <div className='cards'>
                        {cards.map(() => (
                            <div className='card'>
                                <img src={lot} className="lotImage" />
                                <div className='cardRating'>
                                    <p className='name'>Name of the Parking Lot</p>
                                    <p className='location'>location parking lot</p>
                                    <div className='ratting'>
                                        <img src={rate} className='rateIcon' />
                                        <p className='rate'>4.2 / 5</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

