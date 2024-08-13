import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useUpdateGroupMutation, useCreateGroupMutation } from './groupsApiSlice'
import { selectCurrentUser } from '../auth/authSlice'
import Redirect from '../../components/Redirect'
import '../../styles/joingroup.css'


const JoinGroup = ({ setShow, refetch }) => {
    const user = useSelector(selectCurrentUser)
    const [title, setTitle] = useState('')

    // to toggle the form
    const [makeGroup, setMakeGroup] = useState(false)

    const [updateGroup, {
        isLoading,
        isError,
        error
    }] = useUpdateGroupMutation()
    
    const [createGroup] = useCreateGroupMutation()

    const handleSave = async () => {
        // add to groups
        setShow(false)
        if (!makeGroup) {
            await updateGroup({ title: title, addMembers: [user._id]  })
        } else {
            if (title !== '') await createGroup({ title: title, userId: user._id})
        }
        await refetch()
    }

    let content
    if (!user) {
        content = (
            <div className='groups-popup'>
                <label onClick={() => setShow(false)} className='exit-button'>✖</label>
                <Redirect username={undefined} style={{color: 'black'}} />
            </div>
        )
    } else if (isLoading) {
        <div className='groups-popup'>
            <p>Loading . . .</p>
        </div>
    } else if (!makeGroup) {
        content = (
            <form className='groups-popup' onSubmit={e => e.preventDefault()}>
                <label onClick={() => setShow(false)} className='exit-button'>✖</label>
                <label htmlFor="title">
                    Search for a group
                </label>
                <input 
                    type="text" 
                    id="title"
                    placeholder="Enter a group name" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                    <button
                        type="button"
                        className="submit-add"
                        onClick={() => handleSave()}
                    >
                        Join Group
                    </button>
                </div>
                <button 
                    onClick={() => setMakeGroup(true)}
                    className='change-option-button'
                >Or create a new group</button>
                {isError ? <p style={{color: 'black'}}>{error?.data?.message}</p> : <></>}
            </form>
        )
    } else {
        content = (
            <form className='groups-popup' onSubmit={e => e.preventDefault()}>
                <label onClick={() => setShow(false)} className='exit-button'>✖</label>
                <label htmlFor="title">
                    Create a new group
                </label>
                <input 
                    type="text" 
                    id="title"
                    placeholder="Enter a group name" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                    <button
                        type="button"
                        className="submit-add"
                        onClick={() => handleSave()}
                    >
                        Create Group
                    </button>
                </div>
                <button 
                    onClick={() => setMakeGroup(false)}
                    className='change-option-button'
                >Or join an existing group</button>
                {isError ? <p style={{color: 'black'}}>{error?.data?.message}</p> : <></>}
            </form>
        )
    }

    return content
}

export default JoinGroup