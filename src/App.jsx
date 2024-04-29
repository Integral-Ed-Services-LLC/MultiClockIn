import './App.css'
import { useState } from 'react'
import { EntryProvider } from './utils/EntryProvider'
import NavBar from './components/NavBar/NavBar'

function App() {

  return (
    <>
      <EntryProvider >
        <NavBar />
      </EntryProvider>
    </>
  )
}

export default App
