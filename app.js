const Storage = require('./storage.js').default;

class App {
    constructor(root, config) {
        this.root = root;
        this.config = config;

        this.storage = new Storage(config.settings.name)
        this.state = {
            data: this.storage.list()
        };

        this.addClickHandler();
        this.render();
    }

    addClickHandler() {
        document.addEventListener('click', (event) => {
            if (event.target.matches('#something')) {
                this.setState({ view: 'add' });
            }

        }, false);
    }

    createItem(event) {
        let form = event.target.form

        // reject invalid forms
        if (!form || !form.checkValidity()) { return }

        let data = Object.fromEntries(new FormData(form))
        this.setState({
            view: 'list',
            data: this.storage.add(data)
        })
    }

    setState(state) {
        // create updates
        let updates = {
            ...this.state,
            ...state
        }

        // reject non-changes
        if (JSON.stringify(updates) === JSON.stringify(this.state)) { return; }

        // update state and re-render
        this.state = updates;
        this.render();
    }

    render() {
        console.log(this)
        this.root.innerHTML = `
        `
    }
}

module.exports.default = App;