import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home/Home'
import CatalogueDash from './features/catalogues/CatalogueDash'
import Signup from './components/Signup'
import Login from './components/Login'
import BookList from './features/books/BookList'
import BookCollection from './features/books/BookCollection'
import BookEntry from './components/BookEntry'
import PersistLogin from './features/auth/PersistLogin'
import GroupDash from './features/groups/GroupDash'
import Contact from './components/Contact'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from './features/auth/authSlice'

function App() {

    const user = useSelector(selectCurrentUser)

    return (
        <Routes>

            <Route path="/" element={<Layout />}>

                <Route index element={<Home />} />
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="search" element={<BookCollection title='Book Search' />} />
                <Route path="contact" element={<Contact />} />

                <Route path=":username" element={<PersistLogin />}>

                    <Route index element={<Home />} />
                    <Route path="search" element={<BookCollection title='Book Search' />} />
                    <Route path="catalogue-dash" element={<CatalogueDash />} />
                    <Route path="group-dash" element={<GroupDash />} />
                    <Route path="contact" element={<Contact />} />

                    <Route path="books">
                        <Route index element={<BookList />} />
                        <Route path="new-entry" element={<BookEntry />} />
                    </Route>

                </Route>
            </Route>
        </Routes>
    )
}

export default App