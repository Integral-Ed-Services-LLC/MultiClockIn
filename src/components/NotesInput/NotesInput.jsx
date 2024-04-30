import './notes-input.css'
import { useEntry } from '../../utils/EntryProvider'

export default function NotesInput() {

    const { entry } = useEntry()

    return(
        <div className="notes-outer-div">
            <div className="notes-inner-div">
                <div className='notes-required-star'>*</div>
            </div>
            <textarea
                className="notes-field"
                placeholder="Enter notes here"
                // value={notes}
                // onChange={updateNotesData}
            ></textarea>
        </div>
    )
}