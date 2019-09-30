const Storage = require('./storage.js').default;

class App {
    constructor(root, config) {
        this.root = root;
        this.config = config;

        this.storage = new Storage({
            local: config.settings.name,
            server: config.serviceMap.backend,
            messageBus: root
        })

        this.state = {
            view: 'main',
            notification: 'syncing...',
            item: '',
            fields: this.buildFields(config.fields),
            data: this.storage.sync()
        };

        this.addMessageHandler();
        this.addClickHandler();
        this.render();
    }

    buildFields(fields) {
        return [fields]
        .map(str => {
            // convert string lists to arrays
            return Object.keys(str)
            .reduce((list, key) => {
                list[key] = list[key].split(',')
                .map(item => item.trim())

                return list;
            }, str)
        })
        .map(data => {
            // create field items
            return data.fieldNames
            .map((name, idx) => {
                return {
                    name: name,
                    label: data.fieldLabels[idx],
                    type: data.fieldTypes[idx],
                    display: {
                        list: data.fieldListDisplay[idx] === 'true',
                        show: data.fieldShowDisplay[idx] === 'true'
                    }
                }
            })
        })
        .map(data => {
            // create field map
            return new Map([
                ...data
                .map(field => {
                    return [
                        field.name,
                        field
                    ];
                })
            ]);
        })
        .reduce(r => r)
    }

    addMessageHandler() {
        this.root.addEventListener('app-message', (event) => {
            let message = event.detail;

            if (message.from === 'storage') {
                this.setState({
                    data: this.storage.list()
                })
            }

            if (message.from === 'storage' && message.action === 'syncDown') {
                this.setState({
                    notification: ''
                })
            }

        }, false)
    }

    addClickHandler() {
        this.root.addEventListener('click', (event) => {
            let { action } = event.target.dataset;
            if (!action) { return; }

            this.handleAction(action, {
                ...event.target.dataset,
                ...{ form: event.target.form }
            })
        }, false);
    }

    handleAction(action, details) {
        // set view
        if (action === 'setView') {
            let { view, id } = details;
            this.setState({
                view: view,
                item: id
            });
        }

        // post item
        if (action === 'postItem') {
            let { form } = details;
            if (!form || !form.checkValidity()) { return; }

            let data = Object.fromEntries(new FormData(form))
            this.postItem(data)
        }

        // load more
        if (action === 'loadMore') {
            this.storage.sync({
                exclude: this.state.data
                .map(item => item._id)
            })
        }
    }

    postItem(data) {
        this.setState({
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
        <div class="container">
            <div class="notification">${this.state.notification || ''}</div>
            ${(view => {
                // main view
                if (view === 'main') {
                    return `
                        <h1>${this.config.settings.name}</h1>
                        <button data-action="setView" data-view="post">${this.config.settings.postButtonText}</button>
                        <button data-action="loadMore">load more</button>
                        <div>
                            <ul>
                            ${this.state.data.map(item => {
                                return `
                                    <li class="${item._id.includes('local') ? `local` : ``}" data-action="setView" data-view="detail" data-id="${item._id}">
                                        ${Object.entries(item.data)
                                            .map(entry => ({
                                                name: entry[0],
                                                value: entry[1],
                                                display: this.state.fields.get(entry[0]).display
                                            }))
                                            .filter(field => field.display.list)
                                            .map(field => {
                                            return `
                                                <div data-action="setView" data-view="detail" data-id="${item._id}">${field.value}</div>
                                            `
                                        }).join('')}
                                    </li>
                                `
                            }).join('')}
                            </ul>
                        </div>
                    `
                }

                // post view
                if (view === 'post') {
                    return `
                        <button data-action="setView" data-view="main">back</button>
                        <div>
                            <form>
                                ${[...this.state.fields.values()].map(field => {
                                    return `
                                        <div>
                                            <label for="${field.name}">${field.label}</label>
                                            <input type="${field.type}" name="${field.name}" id="${field.name}" required>
                                        </div>
                                    `
                                }).join('')}
                                <div>
                                    <input data-action="postItem" type="button" value="${this.config.settings.postButtonText}"/>
                                </div>
                            </form>
                        </div>
                    `
                }

                // detail view
                if (view === 'detail') {
                    let item = this.state.data.find(item => item._id === this.state.item)
                    return `
                        <button data-action="setView" data-view="main">back-vcc</button>
                        <div id="${item._id}">
                            <div id="date">${new Date(item.date).toLocaleString(this.config.settings.locale)}</div>
                            ${Object.entries(item.data)
                                .map(entry => ({
                                    name: entry[0],
                                    value: entry[1],
                                    display: this.state.fields.get(entry[0]).display
                                }))
                                .filter(field => field.display.show)
                                .map(field => {
                                return `
                                    <div id="${field.name}">${field.value}</div>
                                `
                            }).join('')}
                        </div>
                    `
                }
            })(this.state.view)}
        </div>
        `
    }
}

module.exports.default = App;