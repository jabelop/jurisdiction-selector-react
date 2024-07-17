import logo from '../../logo.svg';
import './App.css';
import JurisdictionSelector from '../jurisdiction-selector/JurisdictionSelector';
import { fetchJurisdictions, fetchSubJurisdictions } from '../../api/fakeJurisdictionsApi';

function App() {

  const dataSelected = (data) => console.info(data);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Jurisdiction Selector
        </p>
      </header>
      <section>
        <JurisdictionSelector
          fetchJurisdictionsTop={fetchJurisdictions}
          fetchJurisdictionsLow={fetchSubJurisdictions}
          dataSelected={dataSelected}
        />
      </section>
      <div style={{ height: "100px" }}>

      </div>
    </div>
  );
}

export default App;
