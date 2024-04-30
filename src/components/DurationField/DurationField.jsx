import './duration-field.css'
import { useEntry } from '../../utils/EntryProvider'

export default function DurationField() {

    const { entry } = useEntry()

    return(
        <div className="duration-field-outer-div">
        <input
            type="number"
            className='duration-field-input'
            placeholder="Duration (min)"
            style={{ fontSize: '14px' }}
            // value={}
            // onChange={}
        />
    </div>
    )
}