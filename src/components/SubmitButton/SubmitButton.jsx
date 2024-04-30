import './submit-button.css'
import { useEntry } from '../../utils/EntryProvider';
import { createMultiEntries } from '../../helpers/airtablePost'

export default function SubmitButton() {
    const { entry } = useEntry()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handlesubmit");
        createMultiEntries(entry, entry.startDateArr, entry.jobCodeArr, entry.durationArr, entry.notesArr)
            .then(recordIds => {
                console.log("Entries submitted successfully", recordIds);
                // show Modal confirmation
            })
            .catch(err => {
                console.error("Error submitting time entry:", err);
                // show error modal
            });
    };

    return(
        <div className="button-outer-div">
        <button
            type="button"
            onClick={handleSubmit} 
            className='submit-button'
        >
            SUBMIT ENTRIES
        </button>

    </div>
    )
}