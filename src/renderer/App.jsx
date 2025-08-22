import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'

function App() {
    const [message, setMessage] = useState('')
    const [data, setData] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)

            // Express API থেকে ডেটা ফেচ করুন
            const messageResponse = await fetch('http://localhost:3001/api/message')
            const messageData = await messageResponse.json()
            setMessage(messageData.message)

            const usersResponse = await fetch('http://localhost:3001/api/users')
            const usersData = await usersResponse.json()
            setUsers(usersData)

            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setMessage('Failed to connect to server')
            setLoading(false)
        }
    }

    const handleSendData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            })
            const result = await response.json()
            alert(`Server received: ${JSON.stringify(result)}`)
        } catch (error) {
            alert('Failed to send data to server :', error)
        }
    }


    const handleElectronAPI = async () => {
        if (window.electronAPI) {
            try {
                const result = await window.electronAPI.getMessage()
                alert(`Message from Electron: ${result.message}\nPlatform: ${window.electronAPI.platform}`)
            } catch (error) {
                alert('Error calling Electron API', error)
            }
        } else {
            alert('Electron API is not available in browser')
        }
    }

    if (loading) {
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h1>Luanara BMS</h1>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <Link to={'/dashboard'}><h1 className='text-2xl font-bold underline'>Luanara BMS - Electron + Vite + React + Express</h1>
            </Link>
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <h2>Express API Response:</h2>
                <p>{message || 'No message received'}</p>
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                <h2>Send Data to Express:</h2>
                <input
                    type="text"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Enter data to send"
                    style={{ marginRight: '10px', padding: '8px', width: '250px', border: '1px solid #ccc', borderRadius: '3px' }}
                />
                <button
                    onClick={handleSendData}
                    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                    Send Data
                </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fffacd', borderRadius: '5px' }}>
                <h2>Electron IPC Test:</h2>
                <button
                    onClick={handleElectronAPI}
                    style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '10px' }}
                >
                    Call Electron API
                </button>
                {window.electronAPI && (
                    <span style={{ color: 'green', marginLeft: '10px' }}>✓ Electron API is available</span>
                )}
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <h2>User List from Express API:</h2>
                {users.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e0e0e0' }}>
                                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ backgroundColor: '#fff' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.id}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found</p>
                )}
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', fontSize: '12px' }}>
                <p>Running in: {window.electronAPI ? 'Electron' : 'Browser'}</p>
                <p>Mode: {process.env.NODE_ENV || 'development'}</p>
            </div>
        </div>
    )
}

export default App