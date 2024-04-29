import './navbar.css'
import timeLogo from '../../assets/icons/time-integral-ed-logo.png'
import { useEffect, useState } from 'react'
import { useEntry } from '../../utils/EntryProvider';

export default function NavBar() {
    const { entry } = useEntry();

    return (
        <div className='navbar-outer-div'>
        <div className='logo-div'>
            <button className='time-integral-ed-logo'
            onClick={()=> window.open("https://time.softr.app/")}
            >
                <img className='timeLogo' src={timeLogo} />
            </button>

        </div>
        <div className='button-div'>

            <button className='my-time-entries-btn' 
            onClick={()=> window.open("https://time.softr.app/")}
            >
                My Time Entries
            </button>
            <button className='clock-in-btn'
            onClick={()=> window.location.reload()}
            >
                Clock In
            </button>
            <div className='profile-photo'>
                { <img src={entry.photoUrl} className="profile-photo-img" alt="profile Pic" /> }
                
            </div>
        </div>
    </div>
    )
}