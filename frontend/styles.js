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

    li {
      margin: 5px;
      padding: 10px 0 10px 0;
      border-top: 1px dotted ${Koji.config.colors.textColor};
    }

    .local {
      background-color: rgba(225, 225, 225, 0.5);
    }

    .notification {
      opacity: 0.5;
    }
`;

module.exports.default = styles;
