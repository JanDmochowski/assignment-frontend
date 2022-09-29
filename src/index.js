import React from 'react';
import ReactDOM from 'react-dom';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { MainPage } from './components/MainPage';
import styled, { createGlobalStyle } from 'styled-components';

const PageView = styled.div`
    height: 100%;
    margin: 0;
    font-size: 16px;
    color: #666;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
`

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    font-size: 16px;
    color: #666;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    height: 100%;
    width: 100vw;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  div {
    padding: 0;
  }

  button {
    border-radius: 12px;
    background-color: #eee;
    font-size: 14px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin-bottom: 1rem;
    border: 1px solid black;
  }
`

class Page extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <PageView>
          <TopBar />
          <MainPage />
          <Footer />
        </PageView>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
