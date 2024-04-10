import './App.css';
import Login from './components/Login';
import NavBar from './components/NavBar';
import SiteDisplay from './components/SiteDisplay';
import CummulativeDisplay from './components/CummulativeDisplay';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={ <> <Login/> </>} />
        <Route path='/sitedisplay' element={<> <NavBar/> <SiteDisplay/> </>} />
        {/* <Route path='/cummulativeDisplay' element={<> <NavBar/> <CummulativeDisplay/> </>} /> */}
        <Route path='/cummulativeDisplay/:dev_phone_no' element={<> <NavBar/> <CummulativeDisplay/> </>} />

      </Routes>
    </Router>
    </>
  );
}

export default App;
