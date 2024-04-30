import './App.css'
import { useState } from 'react'
import { EntryProvider } from './utils/EntryProvider'
import NavBar from './components/NavBar/NavBar'
import Header from './components/Header/Header'
import TableEntries from './components/TableEntries/TableEntries'
import SubmitButton from './components/SubmitButton/SubmitButton'

function App() {

  return (
    <>
      <EntryProvider >
          <NavBar />
          <Header />
        <div className="outer-container">
          <TableEntries />
          {/* <SubmitButton /> */}
        </div>
      </EntryProvider>
    </>
  )
}

export default App
