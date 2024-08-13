import { useGetUsersQuery } from './usersApiSlice'
import User from './User'

const UserList = () => {
    
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery(undefined, {
        pollingInterval: 6000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) <p>Error: { error?.data?.message }</p>

    if (isSuccess) {
        console.log(data)
        const { ids } = data
        console.log(ids)

        const tableContent = ids?.length
        ? Object.values(ids).map(id => <User key={id} userId={id} />)
        : null
    
        content = (
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>User ID</th>
                        <th>Catalogue List</th>
                    </tr>
                </thead>
                <tbody>{ tableContent }</tbody>
            </table>
        )
    }

    return content
}
export default UserList

