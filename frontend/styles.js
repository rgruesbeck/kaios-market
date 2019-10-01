const Koji = require('@withkoji/vcc').default;

const styles = `

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }

  html, body {
    overflow-x: hidden;
  }

  * {
      font-family: ${Koji.config.settings.fontFamily};
      box-sizing: border-box !important;
  }

  body {
      background-color: ${Koji.config.colors.bodyBackground};
      color: ${Koji.config.colors.textColor};
  }

  #root {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .header {
    margin-top: 0.25em;
    margin-bottom: 0.5em;
    text-transform: capitalize;
    color: ${Koji.config.colors.primaryColor};
  }

  .subhead {
    text-transform: capitalize;
    color: ${Koji.config.colors.primaryColor};
    opacity: 0.90;
  }

  .mui-appbar {
    background: ${Koji.config.colors.primaryColor};
    color: ${Koji.config.colors.headerText};
    display: flex;
    align-items: center;
  }

  .mui-appbar img {
    max-height: 32px;
    margin: 8px 4px;
  }

  .mui-appbar button {
    background: ${Koji.config.colors.primaryColor};
    margin: 0;
    padding: 0;
    outline: 0;
  }

  .full-width-btn {
    width: 100%;
  }

  .margin-top-8 {
    margin-top: 8px;
  }

  .mui-appbar h1 {
    display: inline-block;
    font-size: ${Koji.config.settings.headerTextSize};
    line-height: ${Koji.config.settings.headerTextSize};
    cursor: pointer;
  }

  .add-button {
    font-size: 2.5em;
    padding: 0;
    background: ${Koji.config.colors.secondaryColor};
  }

  .add-button:hover {
    background: ${Koji.config.colors.secondaryColor};
  }

  .load-button {
    background: ${Koji.config.colors.secondaryColor};
  }

  .load-button:hover {
    background: ${Koji.config.colors.secondaryColor};
  }

  .mui-appbar {
      height: 64px;
      padding: 0 16px;
  }

  .mui-container {
    margin-top: 24px;
    height: calc(100vh - 88px);
    overflow: auto;
  }

  form {
    padding: 8px;
  }

  .date {
    color: ${Koji.config.colors.primaryColor};
    text-align: right;
    margin-bottom: 4px;
  }

  .list-wrapper {
    padding: 4px;
    height: calc(100vh - 78px);
    overflow: auto;
  }

  .list-wrapper .date {
    text-align: right;
    margin-bottom: 4px;
    margin-right: 4px;
  }

  .list-item {
    border: 1px solid rgba(0,0,0,0.23);
    border-radius: 4px;
    padding: 5px 10px 20px 10px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.23);
    cursor: pointer;
  }

  .list-item .time {
    font-size: 12px;
    text-align: right;
  }

  .activate-btn {
    position: absolute;
    top: 40px;
    right: 16px;
    background: ${Koji.config.colors.addButtonBackground};
    color: ${Koji.config.colors.addButtonText};
  }

  .submit-btn {
    background: ${Koji.config.colors.secondaryColor};
    color: ${Koji.config.colors.textColor};
  }

  .submit-btn:hover {
    background: ${Koji.config.colors.secondaryColor};
    color: ${Koji.config.colors.textColor};
  }

  .notification {
    text-transform: uppercase;
    font-size: 1em;
    background-color: ${Koji.config.colors.secondaryColor};
    padding: 1px 10px 1px 10px;
    transition: height 2s;
  }

`;

export default styles;