import './job-code-drop-down.css'
import { useEntry } from '../../utils/EntryProvider'

export default function JobCodeDropDown({ id }) {
    const { entry, updateJobCodes } = useEntry()
    const allJobCodes = Object.keys(entry.jobCodeRecordIdArr)

    const handleJobCodeChange = (e) => {
        updateJobCodes(id, e.target.value)
    }

    return (
        <div className="jobcodes-outer-div">
            <div className="jobcodes-inner-div">
                <div className="required-star">*</div>
            </div>
            <select name="jobcode3" className='jobcodes-dropdown'
            value={entry.jobCodeArr[id]?.jobCode || ''}
            onChange={handleJobCodeChange}
            >
                <option value="" disabled>Select a Job Code (see TASK if unsure)</option>
                {allJobCodes.map((job, index) => (
                    <option key={index} value={job}>
                        {job}
                    </option>
                )
                )}
            </select>
        </div>
    )
}