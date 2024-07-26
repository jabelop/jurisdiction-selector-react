import { useState } from 'react';
import Modal from './modal/Modal';
import Loading from './loading/Loading';
import './JurisdictionSelector.css';
import Constants from './shared/constants';

const JurisdictionSelector = ({ fetchJurisdictionsTop, fetchJurisdictionsLow, dataSelected }) => {

    const [showOptions, setShowOption] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
    const [error, setError] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const arrow = showOptions ? '▲' : '▼';

    let [jurisdictionsTop, setJurisdictionsTop] = useState([]);
    let [jurisdictionsToShow, setJurisdictionsToShow] = useState([]);

    const fetchData = async () => {
        if (jurisdictionsTop.length) {

            return loading ? setLoading(false) : undefined;
        };
        try {
            const jurisdictions = await fetchJurisdictionsTop();
            setLoading(false);
            setError(false);
            setJurisdictionsTop(jurisdictions);
            setJurisdictionsToShow(jurisdictions);
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

    const setTopJurisdictions = (jurisdictions) => {
        setJurisdictionsTop(jurisdictions);
        setJurisdictionsToShow(jurisdictions);
        setRefresh(true);
        setRefresh(false);
    }

    const updateShowingJurisdictions = ({ selectedData, level }) => {
        if (!selectedData.jurisdictions.length) delete selectedData.jurisdictions;
        const toShow = [...jurisdictionsToShow];
        let unsElectedJurisdiction = undefined;

        if (level === Constants.LEVEL_2) {
            toShow.forEach(jurisdiction => {
                if (unsElectedJurisdiction) return;
                unsElectedJurisdiction = jurisdiction.jurisdictions && jurisdiction.jurisdictions.find((jurisdiction => jurisdiction.id === selectedData.id));
            });

        } else {
            unsElectedJurisdiction = toShow.find((jurisdiction => jurisdiction.id === selectedData.id));

        }
        setSelectedSubDivision(unsElectedJurisdiction, false);

        delete unsElectedJurisdiction.jurisdictions;
        setJurisdictionsToShow(toShow);

    }

    const setSelectedSubDivision = (jurisdiction, selected) => {
        let jurisdictionsToModify = [];
        if (jurisdiction.jurisdictions && jurisdiction.jurisdictions.some(jurisdiction => jurisdiction.jurisdictions && jurisdiction.jurisdictions.length)) {
            jurisdictionsToModify = [
                ...jurisdiction.
                    jurisdictions
                    .map(jurisdiction =>
                        jurisdiction.jurisdictions ? [...jurisdiction.jurisdictions] : [])
            ].flat();

        } else if (jurisdiction.jurisdictions) {
            jurisdictionsToModify = [...jurisdiction.jurisdictions];
        } else {
            jurisdictionsToModify = [jurisdiction];
        }
        const updatedSelectedJurisdictions = selected ?
            [...selectedJurisdictions, ...jurisdictionsToModify] :
            selectedJurisdictions.filter(selectedJurisdiction => !jurisdictionsToModify.map(jurisdiction => jurisdiction.id).includes(selectedJurisdiction.id));
        setSelectedJurisdictions(updatedSelectedJurisdictions);
        dataSelected(updatedSelectedJurisdictions);
    };

    const getModalComponent = () => {
        if (showOptions) {
            return <ul key="urisdictions-list" className="menu">
                {loading ? <Loading loadingKey="loadingKey-top" key="loading-top"/> : undefined}
                {error ? <li key={"error-division"}>Error fetching data</li> : undefined}
                <Modal
                    key="jurisdictionsModal"
                    data={jurisdictionsToShow}
                    fetchSubJurisdictions={fetchJurisdictionsLow}
                    dataSelected={setSelectedSubDivision}
                    setTopJurisdictions={setTopJurisdictions}
                    updateShowingJurisdictions={updateShowingJurisdictions}
                />
            </ul>
        }
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