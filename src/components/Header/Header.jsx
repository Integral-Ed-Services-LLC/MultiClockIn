import './header.css'
import { useEntry } from '../../utils/EntryProvider'

export default function Header() {
    const { entry } = useEntry();
    return(
        <div className="header-outer-div">
            <div className="header-text">{entry.userName}</div>
        </div>
    )
}