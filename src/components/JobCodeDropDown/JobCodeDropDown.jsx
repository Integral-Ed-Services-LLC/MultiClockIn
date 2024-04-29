import './job-code-drop-down.css'
import { useEntry } from '../../utils/EntryProvider'

export default function JobCodeDropDown() {
    const { entry } = useEntry()

    return (
        <div className="jobcodes-outer-div">
            <div className="jobcodes-inner-div">
                <div className="required-star">*</div>
            </div>
            <select name="jobcode3" className='jobcodes-dropdown'>
                <option value="" disabled>Select a Job Code (see TASK if unsure)</option>
                {entry.jobCodeArr.map((job, index) => (
                    <option key={index}>
                        {job}
                    </option>
                )
                )}
            </select>
        </div>
    )
}