import React from 'react';
import styled from 'styled-components';

const FooterBar = styled.div`
  width: 100%;
  display: flex;
  background-color: #bbb;
  align-items: center;
  text-align: center;
  justify-content: center;
  position: relative;
  padding: 1rem 0;
`

export class Footer extends React.Component {
  render() {
    return (
      <FooterBar>
        Some standard footer text<br/>
        usually formal notices<br/>
        and other important things about company.
      </FooterBar>
    );
  }
}