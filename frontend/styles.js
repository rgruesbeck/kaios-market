const Koji = require('@withkoji/vcc').default;

const styles = `
    * {
        font-family: ${Koji.config.settings.fontFamily};
    }

    body {
        background-color: ${Koji.config.colors.bodyBackground};
        color: ${Koji.config.colors.textColor};
    }

    ul {
      padding: 0;
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

    .item-list {
      list-style: none;
      margin: 5px;
      padding: 10px 0 10px 0;
      border-top: 1px dotted ${Koji.config.colors.textColor};
      cursor: pointer;
    }

    .item-show {
      margin-top: 5px;
      border: 1px dotted ${Koji.config.colors.textColor};
    }

    .local {
      background-color: rgba(225, 225, 225, 0.5);
    }

    .notification {
      opacity: 0.5;
    }

    .form {
      margin-top: 5px;
      border: 1px dotted ${Koji.config.colors.textColor};
    }
`;

module.exports.default = styles;
