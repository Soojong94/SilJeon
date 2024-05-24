import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  
  

const handlClick =()=>{
  axios.get("http://localhost:5000/api/hello")
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  })

}


  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={handlClick}> hello </button>
      </header>
    </div>
  );
}

export default App;
