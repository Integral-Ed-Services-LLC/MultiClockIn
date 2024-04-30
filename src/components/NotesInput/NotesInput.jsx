import './notes-input.css'
import { useEntry } from '../../utils/EntryProvider'

export default function NotesInput({ id }) {

    const { entry, updateNotesInput } = useEntry()

    const handleNotesChange = (e) => {
        updateNotesInput(id, e.target.value)
    }

    return(
        <div className="notes-outer-div">
            <div className="notes-inner-div">
                <div className='notes-required-star'>*</div>
            </div>
            <textarea
                className="notes-field"
                placeholder="Enter notes here"
                value={entry.notesArr[id]}
                onChange={handleNotesChange}
            ></textarea>
        </div>
    )
}