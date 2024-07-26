import './CheckBox.css';

const CheckBox = ({ data, dataSelected, classCheck }) => {
    const checkboxClicked = (evt) => dataSelected( evt, data);   
    return (
        <li key={'item' + data.id} className={classCheck + ' menu-items'}>
            <input key={'input' + data.id} type="checkbox" name="input"
                onChange={checkboxClicked} />
            <label key={'label' + data.id} htmlFor="input">{data.name}</label>
        </li>
    );
};

export default CheckBox;

