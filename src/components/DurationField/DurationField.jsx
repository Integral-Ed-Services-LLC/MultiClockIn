import './duration-field.css'
import { useEntry } from '../../utils/EntryProvider'

export default function DurationField({ id }) {

    const { entry, updateDurations } = useEntry()

    const handleDurationChange = (e) => {
        updateDurations(id, e.target.value)
    }

    return(
        <div className="duration-field-outer-div">
        <input
            type="number"
            className='duration-field-input'
            placeholder="Duration (min)"
            min={0}
            style={{ fontSize: '14px' }}
            value={entry.durationArr[id]}
            onChange={handleDurationChange}
        />
    </div>
    )
}