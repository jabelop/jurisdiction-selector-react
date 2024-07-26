import { useState } from "react";
import Loading from '../loading/Loading';
import CheckBox from "../checkbox/CheckBox";
import './Modal.css';
import Constants from "../shared/constants";

const Modal = (
    {
        data,
        fetchSubJurisdictions,
        dataSelected,
        setTopJurisdictions,
        updateShowingJurisdictions
    }) => {


    const [loadingLow, setLoadingLow] = useState(false);
    const [loadingLowest, setLoadingLowest] = useState(false);
    const [error, setError] = useState(false);
    const [idClicked, setIdClicked] = useState(undefined);

    const hideLoadingIconsAndError = () => {
        setLoadingLow(false);
        setLoadingLowest(false);
        setError(false);
    }

    const fetchSubJurisdictionsLevel = async ({ evt, selectedData, level }) => {
        if (!evt.target.checked && level) return updateShowingJurisdictions({ add: evt.target.checked, selectedData, level });
        setIdClicked(selectedData.id);
        try {

            let newJurisdictions = {};

            for (const jurisdiction of data) {

                if (jurisdiction.jurisdictions) {
                    newJurisdictions = jurisdiction.jurisdictions.find(jurisdiction => jurisdiction.id === selectedData.id);
                } else {
                    newJurisdictions = jurisdiction.id === selectedData.id ? jurisdiction : undefined;
                }
                if (newJurisdictions) break;
            }

            setLoadingLow(evt.target.checked && level === Constants.LEVEL_1);//(evt.target.checked && newJurisdictions && hasSubJuridictions && !hasSubSubJuridictions);
            setLoadingLowest(evt.target.checked && level === Constants.LEVEL_2);

            const jurisdictions = evt.target.checked ? await fetchSubJurisdictions(selectedData.id) : selectedData.jurisdictions;
            if (!jurisdictions.length) {
                selectedData.jurisdictions = undefined;
                setSelectedJurisdiction(evt, selectedData)
            };
            newJurisdictions && (newJurisdictions.jurisdictions = jurisdictions);
            hideLoadingIconsAndError();

            setTopJurisdictions(data);
            console.table(data);
        } catch (error) {
            setLoadingLow(false);
            setLoadingLowest(false);
            setError(true);
        }
    };

    const getSubdivisionsComponent = (selectedData) => {
        return (
            <ul key={'list' + selectedData.id} className="sub-menu">
                {error ? <li key={"error-division"}>Error fetching data</li> : undefined}
                {(selectedData && selectedData.length) ? selectedData.map((dataLower) => (
                    <>
                        <CheckBox
                            key={dataLower.id}
                            data={dataLower}
                            dataSelected={(evt, selectedData) => fetchSubJurisdictionsLevel({ evt, selectedData, level: Constants.LEVEL_1 })} />

                        {loadingLow && idClicked === dataLower.id ?
                            <li key={"loading-" + dataLower.id}>
                                <Loading loadingKey={"loadingKey-" + dataLower.id} key={"loading-" + dataLower.id} /> 
                            </li> :
                            undefined}

                        {(dataLower.jurisdictions && dataLower.jurisdictions.length) ? dataLower.jurisdictions.map((dataLowest) => (
                            <>
                                <CheckBox
                                    key={dataLowest.id}
                                    data={dataLowest}
                                    dataSelected={(evt, selectedData) => fetchSubJurisdictionsLevel({ evt, selectedData, level: Constants.LEVEL_2 })}
                                    classCheck="mgl-10" />

                                {loadingLowest && idClicked === dataLowest.id ?
                                    <li key={"li-" + dataLowest.id}>
                                        <Loading loadingKey={"loadingKey-" + dataLowest.id} key={"loading-" + dataLowest.id} /> 
                                    </li> :
                                    undefined}

                                {(dataLowest.jurisdictions && dataLowest.jurisdictions.length) ?
                                    dataLowest.jurisdictions.map((jurisdictionLow) => (
                                        <CheckBox
                                            key={jurisdictionLow.id}
                                            data={jurisdictionLow}
                                            dataSelected={setSelectedJurisdiction}
                                            classCheck="mgl-20" />
                                    )) : undefined}
                            </>
                        )) : undefined}
                    </>
                )) : undefined}
            </ul>);
    }

    const setSelectedJurisdiction = (evt, selectedData) => {
        dataSelected(selectedData, evt.target.checked);
    }

    return (
        <>
            {getSubdivisionsComponent((data.length && data) || data)}
        </>
    );
};

export default Modal;

