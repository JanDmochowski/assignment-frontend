import React from 'react';
import logo from '../assets/logo.png'

export class TopBar extends React.Component {
  render() {
    return (
      <div className='top-bar'>
        <div className='navigation-menu'>
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>
    );
  }
}