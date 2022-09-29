import React from 'react';
import logo from '../assets/logo.png';
import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #eee;
`

const NavigationMenu = styled.div`
  display: flex;
  flex-direction: row;
`

const Logo = styled.img`
  margin-top: 1rem;
  margin-left: 2rem;
`

export class TopBar extends React.Component {
  render() {
    return (
      <Bar>
        <NavigationMenu>
          <Logo src={logo} alt="Logo" />
        </NavigationMenu>
      </Bar>
    );
  }
}