import React from 'react'
import { Outlet } from "react-router-dom"
import Header from './Header'
import Footer from './NewFooter'
import '../index.css'

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <Footer />
      </main>
    </>
  )
}

export default Layout