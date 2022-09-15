import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { TopBar } from './components/TopBar'
import { Footer } from './components/Footer'
import { MainPage } from './components/MainPage'

class Page extends React.Component {
  render() {
    return (
      <div className="page">
        <TopBar />
        <MainPage />
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
