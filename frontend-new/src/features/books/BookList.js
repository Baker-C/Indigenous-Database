import React, { useState, useEffect } from 'react'
import { useGetBooksQuery, useDeleteBookMutation } from './booksApiSlice'

const BookList = () => {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0)
    const [deleteId, setDeleteId] = useState('')

    const {
        data: books,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBooksQuery({ p: page, q: query }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const [deleteBook, {
        isLoading: isLoadingDel,
        isSuccess: isSuccessDel,
        isError: isErrorDel,
        error: errorDel
    }] = useDeleteBookMutation()


    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    // deletes book
    useEffect(() => {
        console.log(deleteId)
        if (deleteId) onDeleteBook()
    }, [deleteId])

    // submits delete
    const onDeleteBook = async () => {
        console.log(deleteId)
        await deleteBook({ id: deleteId })
        window.location.reload()
    }

    if (isSuccess) {
        const { entities } = books
        const tableContent = Object.keys(entities)?.length
            ? Object.values(entities).map(({ title, author, id }) => <BookEntry key={id} id={id} title={title} author={author} removeEntry={setDeleteId} />)
            : null

        content = (
            <table>
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

const BookEntry = ({ id, title, author, removeEntry }) => {
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{title}</td>
            <td>{author}</td>
            <td>
                <button onClick={() => removeEntry(id)}>
                    Delete Entry
                </button>
            </td>
        </tr>
    )
}

export default BookList