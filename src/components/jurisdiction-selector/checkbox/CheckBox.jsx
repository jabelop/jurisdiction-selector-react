import { useState } from "react";
import Loading from '../loading/Loading';
import './CheckBox.css';

const CheckBox = ({ data, fetchSubJurisdictions, dataSelected }) => {

    const [jurisdictionsLow, setJurisdictionsLow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchSubJurisdictionsLow = async (evt) => {
        setLoading(true);
        try {
            const jurisdictions = evt.target.checked ? await fetchSubJurisdictions(data.id) : [];
            setLoading(false);
            setError(false);
            setJurisdictionsLow(jurisdictions);
        } catch (error) {
            setLoading(false);
            setError(true);
        }
    };

    const getSubdivisionsComponent = () => {
        return (jurisdictionsLow && jurisdictionsLow.length) || loading || error ?
            <ul key={'list' + data.id} className="sub-menu">
                {loading ? <Loading /> : undefined}
                {error ? <li key={"error-division"}>Error fetching data</li> : undefined}
                {jurisdictionsLow.map((jurisdiction) => (
                    <CheckBox key={jurisdiction.id} data={jurisdiction} dataSelected={dataSelected} />
                ))}
            </ul> :
            undefined;
    }

    const setSelectedJurisdiction = (evt) => {
        dataSelected(data, evt.target.checked);
    }

    return (
        <li key={'item' + data.id} className="menu-items">
            <input key={'input' + data.id} type="checkbox" name="input"
                onChange={fetchSubJurisdictions ? fetchSubJurisdictionsLow : setSelectedJurisdiction} />
            <label key={'label' + data.id} htmlFor="input">{data.name}</label>
            {getSubdivisionsComponent()}
        </li>
    );
};

export default CheckBox;

