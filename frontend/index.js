const Koji = require('@withkoji/vcc').default;
const WebFont = require('webfontloader');
const styles = require('./styles.js').default;
const App = require('./app.js').default;

// Load a Google Web Font
const loadWebFont = () => {
    WebFont.load({
        google: {
            families: [Koji.config.settings.fontFamily],
        },
    });
};

// Add a dynamic title meta tag
const addTitle = () => {
    const title = document.createElement('title');
    title.innerText = Koji.config.settings.name;
    document.head.appendChild(title);
};

// Add a dynamic style sheet
const addStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = styles;
    const ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);
};

// Mount the app into the root div
const mount = () => {
    const rootElem = document.getElementById('root');
    const app = new App(rootElem, Koji.config);
};

loadWebFont();
addTitle();
addStyles();
mount();