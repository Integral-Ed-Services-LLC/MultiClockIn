import './confirm-modal.css'
import { useEntry } from '../../utils/EntryProvider'

export default function ConfirmModal() {
    const { entry, displayConfirmModal } = useEntry()

    const rowsArray = Array.from({ length: entry.entryRows }, (val, index) => index)
    const jobArray = entry.jobCodeArr.map(val => val.jobCode)

    if (!entry.showConfirmModal) return null;

    return (
        <div className="modal-outer-div">
            <div className="modal-inner-div">
                <div className="modal-card">
                    <div className="modal-content">
                        {rowsArray.map((i) => (
                            <div className='modal-row' key={i}>Entry number {i + 1} &#8611;

                                <div className='entry-info'>
                                    <div>Date: {entry.startDateArr[i]}</div>
                                    <div>Job Code: {jobArray[i]}</div>
                                    <div>Duration: {entry.durationArr[i]}</div>
                                </div>
                                <div className="notes-div">
                                    <div>Notes: {entry.notesArr[i]}</div>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}