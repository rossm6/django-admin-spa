import React from 'react';
import { jsx } from 'theme-ui'
import { ThemeProvider } from 'theme-ui'
import theme from './theme'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import BuildPage from './pages/BuildPage';

export default function App () {

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Home/>}/>
          <Route path="/admin/build-page" element={<BuildPage/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );

}
