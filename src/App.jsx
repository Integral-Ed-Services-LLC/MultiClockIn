import './App.css'
import { useState } from 'react'
import { EntryProvider } from './utils/EntryProvider'
import NavBar from './components/NavBar/NavBar'
import Header from './components/Header/Header'
import TableEntries from './components/TableEntries/TableEntries'

function App() {

  return (
    <>
      <EntryProvider >
        <NavBar />
        <Header />
        <TableEntries />
      </EntryProvider>
    </>
  )
}

export default App
