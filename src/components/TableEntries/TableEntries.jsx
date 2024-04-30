import './table-entries.css'
import { useEntry } from '../../utils/EntryProvider'
import DateInput from '../DateInput/DateInput'
import JobCodeDropDown from '../JobCodeDropDown/JobCodeDropDown'
import DurationField from '../DurationField/DurationField'
import NotesInput from '../NotesInput/NotesInput'
import SubmitButton from '../SubmitButton/SubmitButton'

export default function TableEntries() {
    const { entry } = useEntry()
    //constructs array with length property and creates an instant map function
    const rowsArray = Array.from({length: entry.entryRows}, (val, index) => index)

    return (
        <div className="table-outer-div">
            <table className='table'>
                <thead>
                    <tr className="table-header-row">
                        <th>Date</th>
                        <th>Job Code</th>
                        <th>Duration</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {rowsArray.map((rowId) =>(
                        <tr className="entry-row" key={rowId}>
                            <td><DateInput id={rowId} /></td>
                            <td><JobCodeDropDown id={rowId} /></td>
                            <td><DurationField id={rowId} /></td>
                            <td><NotesInput id={rowId} /></td>
                        </tr>
                    ))}
                    <tr><SubmitButton /></tr>
                </tbody>
            </table>
        </div>
    )
}