import React from 'react'

const UserList = ({ users }) => {
    return (
        <div>
            <h2>User List from Express API:</h2>
            {users.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.id}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading users...</p>
            )}
        </div>
    )
}

export default UserList