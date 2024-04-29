import React, { createContext, useState, useContext, useEffect } from 'react'

const EntryContext = createContext();
export function useEntry(){
    return useContext(EntryContext)
}

export const EntryProvider = ({ children }) => {
    const params = new URLSearchParams(window.location.search);

    const [entry, setEntry] = useState({
        userName: "",
        userRecordId: params.get('userRecordID'),
        photoUrl: "",
        startDateArr: [],
        startTimeArr: [],
        endDateArr: [],
        endTimeArr: [],
        durationArr: [],
        jobCodeArr: [],
        jobCodeRecordIdArr: [],
        taskIdArr: [],
        notesArr: [],
        dayAmount: "0:00",
        weekAmount: "0:00",
        payPeriodAmount: "0:00",
        showConfirmModal: false,
        showErrorModal: false,
        handleModalClose: false,
        submittedRecordIdArr: []
    })

    return(
        <EntryContext.Provider value={{ entry }}>
            {children}
        </EntryContext.Provider>
    )
}