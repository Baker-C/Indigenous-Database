import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { BarLoader } from 'react-spinners'
import { 
    useDeleteCatalogueMutation, 
    useCreateCatalogueMutation,
    useGetCataloguesQuery, 
    useUpdateCatalogueMutation 
} from './cataloguesApiSlice'
import Redirect from '../../components/Redirect'
import BookCard from '../books/BookCard'
import ShareLinks from '../../components/ShareLinks'
import '../../styles/cataloguedash.css'

const CatalogueDash = () => {
    const user = useSelector(selectCurrentUser)
    const [query, setQuery] = useState('') 
    const [focused, setFocused] = useState()
    const [focusModified, setFocusModified] = useState(false)

    // for updating catalogue
    const [newTitle, setNewTitle] = useState(' ')
    const [color, setColor] = useState('')

    // for showing options dropdown
    const [showCatalogueOptions, setShowCatalogueOptions] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [showEmailForm, setShowEmailForm] = useState(false)

    // for populating the email form
    const [formTitles, setFormTitles] = useState([])
    const [formLinks, setFormLinks] = useState([])

    const {
        data: cataloguesData,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: refetchCatalogues
    } = useGetCataloguesQuery({ q: query, userId: user._id }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const [createCatalogue] = useCreateCatalogueMutation()

    const [updateCatalogue] = useUpdateCatalogueMutation()

    const [deleteCatalogue, {
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteCatalogueMutation()

    // set focused catalogues after changes
    useEffect(() => {
        if (isSuccess && cataloguesData?.entities && !focused) {
            const catalogueList = Object.values(cataloguesData.entities)
            setFocused(catalogueList[0])
        }
    }, [isSuccess, cataloguesData])

    // send catalogue updates
    const handleUpdateCatalogue = async () => {        
        try {
            if (newTitle !== focused?.title) {
                const newFocused = { ...focused }
                newFocused.title = newTitle
                setFocused(newFocused)
                await updateCatalogue({ 
                    id: focused?._id, 
                    title: newTitle, 
                })
            } else if (color !== focused?.color) {
                const newFocused = { ...focused }
                newFocused.color = color
                setFocused(newFocused)
                await updateCatalogue({ 
                    id: focused?._id, 
                    color: color 
                })
            }
            if (isSuccess) refetchCatalogues()
        } catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        if (color) handleUpdateCatalogue()
    }, [color])

    // refetch data if 

    // delete focused catalogue
    const handleDeleteCatalogue = async () => {
        try {
            if (focused) {
                await deleteCatalogue({ id: focused._id })
                setFocused()
                await refetchCatalogues()
                setShowDeletePopup(false)
                setShowCatalogueOptions(false)
            }
        } catch (err) {
            console.error(err)
        }
    }

    // create and set new catalogue
    const handleCreateCatalogue = async () => {
        try {
            await createCatalogue({ ownerUsername: user?.username })
            await refetchCatalogues()
        } catch (err) {
            console.error(err)
        }
    }

    // populate and set populatedEmailForm
    const handlePopulateEmailForm = (item) => {
        if (item?.entries) {
            setFormTitles(item.entries?.map(entry => entry.title))
            setFormLinks(item.entries?.map(entry => entry.link))
        } else {
            setFormTitles([item.title])
            setFormLinks([item.link])
        }
        setShowEmailForm(true)
    }

    // for changing the ttitle
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleUpdateCatalogue()
            e.target.blur()
        }
    }


    // sets current info to focused info
    useEffect(() => {
        setNewTitle(focused?.title)
        setColor(focused?.color)
    }, [focused])

    let content

    if (!user) content = <Redirect />

    if (isLoading) content = <BarLoader color={'#FFF'} />
    
    if (!cataloguesData?.entities) {

        content = <p style={{color: 'black'}}>No Catalogues to Display</p>

    } else {

        const catalogueList = Object.values(cataloguesData.entities)

        content = (
            <div className='catalogues-dash'>
                <div className='side-container'>
                    <SideSection  
                    catalogueList={catalogueList} 
                    setFocusedCatalogue={setFocused} 
                    createNewCatalogue={handleCreateCatalogue}
                    />
                </div>

                <div className='catalogue-focus'>
                    <div className='focused-header'>
                        <div className='focused-header-info'>
                            <label>
                                <input
                                className='focused-input'
                                type='text'
                                placeholder={focused?.title}
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                />
                            </label>
                            <h2>{focused?.owner}</h2>
                        </div>

                        <div className='focused-header-options'>
                            <ColorPicker currentColor={color} setColor={setColor} />
                            <div 
                                className='catalogue-options' 
                                onClick={() => setShowCatalogueOptions(show => !show)}
                            >⋯</div>
                        </div>
                    </div>

                    <FocusedEntry entries={focused?.entries} />
                
                </div>

                {showCatalogueOptions && (
                    <div className='catalogue-dropdown'>
                        <div 
                            className='dropdown-option'
                            onClick={() => handlePopulateEmailForm(focused)}
                        >Share</div>
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
                            onClick={() => handleDeleteCatalogue()}
                        >Yes, I'm sure</button>
                        <button 
                            className='nevermind-button'
                            onClick={() => {
                                setShowDeletePopup(false)
                                setShowCatalogueOptions(false)
                            }}
                        >Nevermind</button>
                    </div>
                )}

                {isDeleteError && showDeletePopup && (
                    <div className='error-message'>
                        <p>Error: {deleteError}</p>
                        <button 
                            className='nevermind-button'
                            onClick={() => {
                                setShowDeletePopup(false)
                                setShowCatalogueOptions(false)
                            }}
                        >Okay</button>                    
                    </div>        
                )}

                {showEmailForm && ( 
                    <ShareLinks 
                    user={user.username} 
                    titles={formTitles}
                    links={formLinks} 
                    setShow={setShowEmailForm} 
                    />
                )}

            </div>
        )
    }

    return content
}

const FocusedEntry = ({entries}) => {
    return (
        <div className='focused-entry-container'>
            <div className='thin-line' />

            <div className="focused-column-info">
                <div className="focused-entry-info">
                    <h2>Cover</h2>
                    <div className="focused-info">
                        <h2>Title & Author</h2>
                    </div>
                </div>

                <div className="focused-column-footer">
                    <h2>Link</h2>
                    <h2>Remove</h2>
                </div>
            </div>

            {entries?.map((entry, index) => (
                <BookCard key={index} entry={entry} />
            ))}
            
        </div>
    )    
}

const SideSection = ({ catalogueList, setFocusedCatalogue, createNewCatalogue }) => {
    // sort by most recent date added
    //const sortedList = catalogueList.sort((a, b) => b?.date - a?.date)

    return (
        <div className='catalogue-side-bar'>
            <div className='catalogue-side-header'>

                <label className='catalogue-search'>
                    <input 
                    type='text'
                    placeholder='Find a Catalogue'
                    />
                </label>

                <label onClick={() => createNewCatalogue()} className='side-entry'>
                    <h3>+ New Catalogue</h3>
                </label>
    
            </div>
            <div className='thin-line' />
            {catalogueList?.map((catalogue, index) => (
                <label key={index} className='side-entry' onClick={() => setFocusedCatalogue(catalogue)}>
                    <div className='side-color-dot' style={{background: catalogue?.color}}></div>
                    <h3>{catalogue.title}</h3>
                </label>
            ))}

        </div>
    )
}

const ColorPicker = ({ currentColor, setColor }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const colors = ['LightSteelBlue', 'DodgerBlue', 'SteelBlue', 'LightSalmon', 'LightPink', 'Violet', 'SeaGreen', 'MediumSpringGreen']
    const handlePickedColor = (color) => {
        setColor(color)
        setShowDropdown(false)
        console.log(color)
    }

    return (
        <div className='color-picker'>
            <div
                className='current-color-dot'
                style={{ backgroundColor: currentColor }}
                onClick={() => setShowDropdown(show => !show)}
            ></div>
            {showDropdown && (
                <div className='color-dropdown'>
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className='dropdown-color-dot'
                            style={{ backgroundColor: color }}
                            onClick={() => handlePickedColor(color)}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CatalogueDash