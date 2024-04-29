import './date-input.css'
import { useEntry } from '../../utils/EntryProvider'

export default function DateInput({ id }) {
    const { entry, updateStartDate } = useEntry()

    const handleDateChange = (event) => {
        updateStartDate(id, event.target.value);
    };

    return(
        <div className="date-input-outer-div">
        <input
            type="date"
            className='date-field'
            value={entry.startDateArr[id] || ''}
            onChange={handleDateChange}
            style={{
                border:'none', 
                backgroundColor: 'inherit',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '16.94px',
                width: '104.14px'
            }}
        />
    </div>
    )
}