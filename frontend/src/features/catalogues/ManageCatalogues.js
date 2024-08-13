import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BarLoader } from 'react-spinners'
import { useUpdateCatalogueMutation, useGetCataloguesQuery, useCreateCatalogueMutation } from './cataloguesApiSlice'
import { selectCurrentUser } from '../auth/authSlice'
import Redirect from '../../components/Redirect'
import '../../styles/managecatalogues.css'


const ManageCatalogues = ({ entryId, setShow }) => {
    const [checkedIds, setCheckedIds] = useState([])
    const [title, setTitle] = useState('')
    const [addNew, setAddNew] = useState(false)
    const user = useSelector(selectCurrentUser)

    const {
        data: catalogues,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: refetchCatalogues
    } = useGetCataloguesQuery({ userId: user?._id }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const [createCatalogue, {
        isSuccess: isCreateSuccess,
        isError: isCreateError,
        error: createError
    }] = useCreateCatalogueMutation()

    const [updateCatalogue, {
        isSuccess: isUpdateSuccess
    }] = useUpdateCatalogueMutation()

    useEffect(() => {
        refetchCatalogues()
    }, [isUpdateSuccess])

    const handleSave = async (checked) => {
        // add to catalogues which are selected and delete from those which arent
        setShow(false)
        for (let cat of user?.catalogues) {
            const id = cat._id
            if (checked?.includes(id)) {
                await updateCatalogue({ id: id, addEntries: [entryId]  })
            } else {
                await updateCatalogue({ id: id, delEntries: [entryId] })
            }
        }
    }

    // to init checkedBoxes
    useEffect(() => {
        if (catalogues && entryId) {
            const initialCatalogues = Object.values(catalogues?.entities)?.filter(cat => {
                return cat.entries.map(entry => entry?._id)?.includes(entryId)
            })
            const initialIds = initialCatalogues?.map(cat => cat._id)
            setCheckedIds(initialIds)
        }
    }, [isSuccess])
    
    const handleChecked = (e) => {
        const { name, checked } = e.target
        if (checked) {
            setCheckedIds([...checkedIds, name])
        } else {
            setCheckedIds(checkedIds.filter(catId => catId !== name))
        }
    }

    const handleAddNew = async (e) => {
        if (title !== '') {
            await createCatalogue({ title: title, ownerUsername: user.username })
            if (isCreateSuccess) await refetchCatalogues()
        }
    }

    let content

    if (!user) {

        content = (
            <div className='catalogues-popup'>
                <label onClick={() => setShow(false)} className='exit-button'>✖</label>
                <Redirect username={undefined} style={{color: 'black'}} />
            </div>
        )

    } else if (isLoading) {

        content = (
            <BarLoader 
            color={'#000'} 
            style={{margin: '0 100%'}} 
            />
        )

    } else {

        content = (
            <form className='catalogues-popup'>
                <div className='catalogue-header-container'>
                    <h1>
                        Add to Catalogue
                    </h1>
                    <label onClick={() => setShow(false)} className='exit-button'>✖</label>
                </div>

                <label className='catalogue-search'>
                    <input 
                    type='text'
                    placeholder='Search for a Catalogue'
                    />
                </label>
               
                {!addNew && (
                    <label onClick={() => setAddNew(true)} className='catalogue-add'>
                        + New Catalogue
                    </label>
                )}
                {addNew && (
                    <div className='new-catalogue-container'>
                        <input 
                        className='new-catalogue-input'
                        placeholder="Enter a Catalogue Name" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                        <button className="submit-add" onClick={() => handleAddNew()}>
                            Create Catalogue
                        </button>
                        {isCreateError && <p>{createError.data.message}</p>}
                    </div>
                )}

                <div className='catalogues-container'>
                    {user.catalogues?.map((cat, index) => (
                        <label className='checkbox-container' key={index}>
                            {cat.title}
                            <input
                            type="checkbox"
                            name={cat._id}
                            checked={checkedIds.includes(cat._id)}
                            onChange={handleChecked}
                            />
                            <span className='checkbox'></span>
                        </label>
                    ))}
                </div>


                <div>
                    <button
                    type="button"
                    className="submit-add"
                    onClick={() => handleSave(checkedIds)}
                    >
                        Save
                    </button>
                </div>
            </form>
        )
    }

    return content
}

export default ManageCatalogues