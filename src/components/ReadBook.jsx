import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'
import FileReaderInput from 'react-file-reader-input'
import logo from '../assets/logo.png';
import { ReactReader } from 'react-reader'

import {
  Container,
  ReaderContainer,
  Bar,
  LogoWrapper,
  Logo,
  GenericButton,
  CloseIcon,
  FontSizeButton,
  ButtonWrapper
} from './ReadBookStyle'

const storage = global.localStorage || null

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
`

class ReadBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullscreen: false,
      location:
        storage && storage.getItem('epub-location')
          ? storage.getItem('epub-location')
          : 2,
      localFile: null,
      localName: null,
      largeText: false
    }
    this.rendition = null
    this.url = new URL(window.location.href);
  }

  toggleFullscreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        setTimeout(() => {
          const evt = document.createEvent('UIEvents')
          evt.initUIEvent('resize', true, false, global, 0)
        }, 1000)
      }
    )
  }

  onLocationChanged = location => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem('epub-location', location)
      }
    )
  }

  onToggleFontSize = () => {
    const nextState = !this.state.largeText
    this.setState(
      {
        largeText: nextState
      },
      () => {
        this.rendition.themes.fontSize(nextState ? '100%' : '100%')
      }
    )
  }

  getRendition = rendition => {
    console.log('getRendition callback', rendition)
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state
    this.rendition = rendition
    rendition.themes.fontSize(largeText ? '140%' : '100%')
  }
  handleChangeFile = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0]
      if (file.type !== 'application/epub+zip') {
        return alert('Unsupported type')
      }
      this.setState({
        localFile: e.target.result,
        localName: file.name,
        location: null
      })
    }
  }
  render() {
    const { fullscreen, location, localFile, localName } = this.state
    return (
      <Container>
        <GlobalStyle />
        <Bar>
          <LogoWrapper href="/">
            <Logo
              src={logo}
              alt="logo"
            />
          </LogoWrapper>
          <ButtonWrapper>
            <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
              <GenericButton>read in full screen?</GenericButton>
            </FileReaderInput>
            <GenericButton onClick={this.toggleFullscreen}>
              Use full browser window
              <CloseIcon />
            </GenericButton>
          </ButtonWrapper>
        </Bar>
        <ReaderContainer fullscreen={fullscreen}>
          <ReactReader
            url={`https://cdn.sanity.io/files/nmn06h0c/production${this.url.pathname.slice(22)}`}
            title={'book'}
            location={location}
            locationChanged={this.onLocationChanged}
            getRendition={this.getRendition}
          />
          <FontSizeButton onClick={this.onToggleFontSize}>
            Toggle font-size
          </FontSizeButton>
        </ReaderContainer>
      </Container>
    )
  }
}

export default ReadBook
