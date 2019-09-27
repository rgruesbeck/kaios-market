const Koji = require('@withkoji/vcc').default;

const styles = `
    * {
        font-family: ${Koji.config.settings.fontFamily};
    }

    body {
        background-color: ${Koji.config.colors.bodyBackground};
        color: ${Koji.config.colors.textColor};
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 5px;
    }

    .button {
      border: 1px solid grey;
      border-radius: 2px;
      text-align: center;
      padding: 5px;
      cursor: pointer;
    }

    .list {
      padding: 10px 0 10px 0;
      border-top: 1px dotted ${Koji.config.colors.textColor};
    }
`;

module.exports.default = styles;
