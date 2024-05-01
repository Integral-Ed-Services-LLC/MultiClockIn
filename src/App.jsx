import './App.css'
import { useState } from 'react'
import { EntryProvider } from './utils/EntryProvider'
import NavBar from './components/NavBar/NavBar'
import Header from './components/Header/Header'
import TableEntries from './components/TableEntries/TableEntries'
import ConfirmModal from './components/ConfirmModal/ConfirmModal'

function App() {

  return (
    <>
      <EntryProvider >
        <ConfirmModal />
        <NavBar />
        <Header />
        <div className="inner-container">
          <TableEntries />
          {/* <SubmitButton /> */}
        </div>
      </EntryProvider>
    </>
  )
}

export default App
