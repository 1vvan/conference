import './App.css';
import {Route, BrowserRouter, Routes } from "react-router-dom";
import Main from './components/Main/main.jsx';
import Members from './components/Members/members.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/members" element={<Members />} />
          <Route path='*' element={
            <div className='no-page'>
              <span>Страница не найдена !</span>
          </div>}/>
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
