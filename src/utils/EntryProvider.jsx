import React, { createContext, useState, useContext, useEffect } from 'react'
import { getTeammateRecord } from '../helpers/airtableGetters';

const EntryContext = createContext();
export function useEntry() {
    return useContext(EntryContext)
}

export const EntryProvider = ({ children }) => {
    const params = new URLSearchParams(window.location.search);
    const initialUserRecordId = params.get('userRecordID') 
    // || "recMhLRHRvxzjIHpn";
    const [entry, setEntry] = useState({
        userName: "",
        userRecordId: initialUserRecordId,
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

    useEffect(() => {
        const getTeammateInfo = async () => {
            if (entry.userRecordId) {
                try {
                    const record = await getTeammateRecord(entry.userRecordId);
                    console.log(record.fields)
                    let photoRecord = record.fields.Photo[0]?.url;
                    let userNameRecord = record.fields["Full Name"];
                    let dayAmountRecord = record.fields["Today (Sum)"]
                    let weekAmountRecord = record.fields["This Week (Sum)"]
                    let payPeriodAmountRecord = record.fields["This Pay Period (Sum)"]
                    setEntry(prevEntry => ({
                        ...prevEntry,
                        userName: userNameRecord,
                        photoUrl: photoRecord,
                        dayAmount: dayAmountRecord,
                        weekAmount: weekAmountRecord,
                        payPeriodAmount: payPeriodAmountRecord
                    }))
                } catch (error) {
                    console.error("Failed to fetch teammate record:", error);
                }
            }
        }
        getTeammateInfo();
    }, [entry.userRecordId])

    return (
        <EntryContext.Provider value={{ entry, setEntry }}>
            {children}
        </EntryContext.Provider>
    )
}