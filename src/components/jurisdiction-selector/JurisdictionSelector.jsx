import { useState } from 'react';
import CheckBox from './checkbox/CheckBox';
import Loading from './loading/Loading';
import './JurisdictionSelector.css';

const JurisdictionSelector = ({ fetchJurisdictionsTop, fetchJurisdictionsLow, dataSelected }) => {

    const [showOptions, setShowOption] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
    const [error, setError] = useState(false);
    const arrow = showOptions ? '▲' : '▼';

    let [jurisdictionsTop, setJurisdictionsTop] = useState([]);

    const fetchData = async () => {
        if (jurisdictionsTop.length) {

            return loading ? setLoading(false) : undefined;
        };
        try {
            const jurisdictions = await fetchJurisdictionsTop();
            setLoading(false);
            setError(false);
            setJurisdictionsTop(jurisdictions);
        } catch (error) {
            setLoading(false);
            setError(true);
        }
    };

    // Fetch data on open dropdown instead on the useEffect hook to avoid unnecessary requests.
    const openDropDown = () => {
        setShowOption((prev) => !prev);
        setLoading(true);
        fetchData();
    };

    const getModalComponent = () => {
        if (showOptions) {
            return <ul className="menu">
                {loading ? <Loading /> : undefined}
                {error ? <li key={"error-division"}>Error fetching data</li> : undefined}
                {jurisdictionsTop.map((jurisdiction, index) => (
                    <CheckBox
                        key={jurisdiction.id}
                        data={jurisdiction}
                        fetchSubJurisdictions={fetchJurisdictionsLow}
                        dataSelected={setSelectedSubDivision}
                    />
                ))}
            </ul>
        }
    };

    const setSelectedSubDivision = (jurisdiction, selected) => {

        const updatedSelectedJurisdictions = selected ?
            [...selectedJurisdictions, jurisdiction] :
            selectedJurisdictions.filter(selectedJurisdiction => selectedJurisdiction.id !== jurisdiction.id);

        setSelectedJurisdictions(updatedSelectedJurisdictions);
        dataSelected(updatedSelectedJurisdictions);
    };

    return (
        <>
            <button
                aria-expanded={showOptions ? "true" : "false"}
                onClick={openDropDown}>
                Choose Jurisdiction {arrow}
            </button>
            {getModalComponent()}
        </>
    );
};

export default JurisdictionSelector;