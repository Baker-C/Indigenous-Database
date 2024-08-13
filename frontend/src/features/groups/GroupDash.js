import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { 
    useDeleteGroupMutation, 
    useGetGroupsQuery, 
    useUpdateGroupMutation 
} from './groupsApiSlice'
import Redirect from '../../components/Redirect'
import UserCard from '../users/UserCard'
import JoinGroup from './JoinGroup'
import ShareLinks from '../../components/ShareLinks'
import '../../styles/groupdash.css'

const GroupDash = () => {
    const user = useSelector(selectCurrentUser)
    const [focused, setFocused] = useState()
    const [groupList, setGroupList] = useState()

    // for showing options dropdown
    const [showGroupOptions, setShowGroupOptions] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [showEmailForm, setShowEmailForm] = useState(false)
    const [showGroupForm, setShowGroupForm] = useState(false)

    const {
        data: groups,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: refetchGroups
    } = useGetGroupsQuery({ userId: user._id }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const [updateGroup] = useUpdateGroupMutation()

    const [deleteGroup, {
        isSuccess: isSuccessDelete,
        isLoading: isLoadingDelete,
        isError: isErrorDelete,
        error: errorDelete
    }] = useDeleteGroupMutation()

    // set groupList
    useEffect(() => {
        if (isSuccess) {
            const groupEntities = Object.values(groups.entities)
            setGroupList(groupEntities)
        }
    }, [isSuccess, groups])

    // set focused group
    useEffect(() => {
        if (groupList?.length > 0) setFocused(groupList[0])
    }, [groupList])


    // delete focused group
    const handleDeleteGroup = async () => {
        try {
            if (focused) {
                await deleteGroup({ id: focused?._id })
                setShowGroupOptions(false)
                setShowDeletePopup(false)
                await refetchGroups()
            }
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => {
        refetchGroups()
    }, [showGroupForm])

    let content
    if (!user) {
        content = <Redirect />
    } else if (isLoading) {
        content = <p>Loading . . .</p>
    } else if (!groupList?.length) {
        content = (
            <div>
                <p style={{color: 'black'}}>No Groups to Display</p>
                <JoinGroup setShow={setShowGroupForm} refetch={refetchGroups} />
            </div>
            
        )
    } else {

        content = (
            <div className='groups-dash'>
                <div className='side-bar'>
                    <SideSection title='My Groups' groupList={groupList} setFocusedGroup={setFocused} />
                </div>

                <div className='group-focus'>
                    <div className='focused-header'>
                        <div className='focused-header-info'>
                            <h1>{focused?.title}</h1>
                        </div>

                        <div className='focused-header-options'>
                            <div 
                                className='group-options' 
                                onClick={() => setShowGroupOptions(show => !show)}
                            >⋯</div>
                        </div>
                    </div>

                    <div className='focused-user-container'>
                        <div className="focused-column-info">
                            <div className="focused-user-info">
                                <h2>Username</h2>
                                <div className="focused-info">
                                </div>
                            </div>

                            <div className="focused-column-footer">
                            </div>
                        </div>

                        {focused?.members?.map((user, index) => <UserCard key={index} user={user} /> )}
                    </div>
                </div>
                
                {showGroupOptions && (
                    <div className='group-dropdown'>
                        <div 
                            className='dropdown-option'
                            onClick={() => setShowGroupForm(true)}
                        >Join Group</div>
                        <div 
                            className='dropdown-option'
                            style={{color: 'red'}}
                            onClick={() => setShowDeletePopup(true)}
                        >Delete</div>
                    </div>
                )}

                {showDeletePopup && (
                    <div className='delete-popup'>
                        Delete '{focused?.title}'
                        <button 
                            className='delete-button'
                            onClick={() => handleDeleteGroup()}
                        >Yes, I'm sure</button>
                        <button 
                            className='nevermind-button'
                            onClick={() => {
                                setShowDeletePopup(false)
                                setShowGroupOptions(false)
                            }}
                        >Nevermind</button>
                    </div>
                )}
                {showGroupForm && (
                    <JoinGroup setShow={setShowGroupForm} refetch={refetchGroups} />
                )}
                {isErrorDelete && showDeletePopup && (
                    <div className='error-message'>
                        <p>Error: {errorDelete.message}</p>
                        <button 
                            className='nevermind-button'
                            onClick={() => {
                                setShowDeletePopup(false)
                                setShowGroupOptions(false)
                            }}
                        >Okay</button>                    
                    </div>        
                )}

                {showEmailForm && <ShareLinks user={user.username} setShow={setShowEmailForm} />}

            </div>
        )
    }

    return content
}

const SideSection = ({ title, groupList, setFocusedGroup }) => {
    // sort by most recent date added
    //const sortedList = groupList.sort((a, b) => b?.date - a?.date)

    return (
        <div className='side-section'>
            <div className='side-header'>
                <h3>{title}</h3>
            </div>
            {groupList?.map((group, index) => (
                <label key={index} className='side-user' onClick={() => setFocusedGroup(group)}>
                    <h3>{group.title}</h3>
                </label>
            ))}
        </div>
    )
}

export default GroupDash