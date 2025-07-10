import React, { useEffect, useState } from 'react';

function App() {
    const [numbers, setNumbers] = useState([]);
    const [status, setStatus] = useState('');

    const fetchNumbers = () => {
        fetch(`/api/numbers`)
            .then(res => res.json())
            .then(data => {
                setNumbers(data.numbers);
                setStatus('');
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setStatus('Error loading numbers');
            });
    };

    const saveNumbers = () => {
        fetch(`/api/numbers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numbers })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus('Numbers saved successfully!');
                } else {
                    setStatus('Error saving numbers.');
                }
            })
            .catch(err => {
                console.error('Save error:', err);
                setStatus('Server error while saving.');
            });
    };

    useEffect(() => {
        fetchNumbers();
    }, []);

    return (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h1>Random Numbers</h1>
            <p style={{ fontSize: '2rem' }}>
                {numbers.length > 0 ? numbers.join(', ') : 'Loading...'}
            </p>
            <div style={{ marginTop: '20px' }}>
                <button onClick={fetchNumbers} style={{ marginRight: '10px', padding: '10px 20px' }}>
                    Get New Numbers
                </button>
                <button onClick={saveNumbers} style={{ padding: '10px 20px' }}>
                    Save Numbers
                </button>
            </div>
            {status && <p style={{ marginTop: '20px', color: 'green' }}>{status}</p>}
        </div>
    );
}

export default App;
