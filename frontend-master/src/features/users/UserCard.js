import React, { useState, useEffect } from 'react'
import '../../styles/usercard.css'

const UserCard = ({ user }) => {

    return (
        <div className="user-card">
            <div className="user-header">
                <div className="user-image-container">
                    <div className="user-image" style={{backgroundColor: `${user.icon}`}}/>
                </div>
                <div className="user-info">
                    <h2 className="user-username">{user?.username}</h2>
                </div>
            </div>
        </div>
    )
}


export default UserCard