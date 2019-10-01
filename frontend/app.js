import Storage from './storage.js';

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

            // if view is main, attempt sync
            if (view === 'main') {
                this.loadMore();
            }
        }

        // post item
        if (action === 'postItem') {
            let { form } = details;
            if (!form || !form.checkValidity()) { return; }

            // not available on KaiOS but made it through browserslist
            // let newData = Object.fromEntries(new FormData(form))
            
            let newData = [new FormData(form)]
            .map(formData => [...formData.entries()])
            .map(entries => {
                return entries
                .reduce((data, entry) => {
                    data[entry[0]] = entry[1];
                    return data;
                }, {})
            }).reduce(r => r);

            this.postItem(newData)
        }

        // load more
        if (action === 'loadMore') {
            this.loadMore();
        }
    }

    postItem(data) {
        // store new post locally
        // navigate back to main view
        this.setState({
            view: 'main',
            data: this.storage.add(data)
        });

        // sync up
        this.storage.syncUp();
    }

    loadMore() {
        this.setState({
            notification: 'syncing...'
        });

        // sync down
        this.storage.syncDown({
            length: parseInt(this.config.settings.loadMoreAmount),
            exclude: this.state.data
            .map(item => item._id)
        });
    }


    setState(state) {

        // update state and re-render
        this.state = {
            ...this.state,
            ...state
        };

        this.render();
    }

    render() {
        this.root.innerHTML = `
        <div class="container">
            <div class="mui-appbar">
                <h1 data-action="setView" data-view="main">${this.config.settings.name}</h1>
            </div>
            <div class="mui--text-subhead notification">${this.state.notification}</div>

            ${(view => {
                // main view
                if (view === 'main') {
                    return `
                        <button data-action="setView" data-view="post" class="mui-btn--small mui-btn mui-btn--fab mui-btn--primary activate-btn add-button">+</button>
                        <div class="list-wrapper">
                            <ul>
                            ${this.state.data
                                .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
                                .map(item => {
                                return `
                                    <li class="list-item ${item._id.includes('local') ? `local` : ``}" data-action="setView" data-view="detail" data-id="${item._id}">
                                        ${[...this.state.fields.values()]
                                            .filter(field => field.display.list)
                                            .map((field, idx) => {
                                                return `
                                                    <div data-action="setView" data-view="detail" data-id="${item._id}" class="mui--text-${idx === 0 ? `headline header` : `subhead`}">${item.data[field.name]}</div>
                                                `;
                                            }).join('')}
                                    </li>
                                `;
                            }).join('')}
                            </ul>
                        <button data-action="loadMore" class="mui-btn mui-btn--raised load-button">${this.config.settings.loadMoreButton}</button>
                        </div>
                    `
                }

                // post view
                // todo: image upload
                // <input type="file" accept="image/*" capture></input>
                // <button data-action="setView" data-view="main" class="mui-btn mui-btn--primary">${this.config.settings.navigateMainButton}</button>
                if (view === 'post') {
                    return `
                        <div class="mui-container">
                            <form class="mui-form">
                                ${[...this.state.fields.values()].map(field => {
                                    return `
                                        <div class="mui-textfield">
                                            <label for="${field.name}">${field.label}</label>
                                            <input type="${field.type}" name="${field.name}" id="${field.name}" required>
                                        </div>
                                    `
                                }).join('')}
                                <div>
                                    <input data-action="postItem" type="button" value="${this.config.settings.submitPostButton}" class="mui-btn mui-btn full-width-btn submit-btn button"/>
                                </div>
                            </form>
                        </div>
                    `
                }

                // detail view
                // <button data-action="setView" data-view="main" class="mui-btn mui-btn--primary">${this.config.settings.navigateMainButton}</button>
                if (view === 'detail') {
                    let item = this.state.data.find(item => item._id === this.state.item)
                    return `
                        <div id="${item._id}" class="mui-container">
                            <div id="date" class="date">${new Date(item.date).toLocaleString(this.config.settings.locale)}</div>
                            ${[...this.state.fields.values()]
                                .filter(field => field.display.show)
                                .map((field, idx) => {
                                    return idx === 0 ? `
                                        <div id="${field.name}" class="mui--text-headline header">
                                            <div>${item.data[field.name]}</div>
                                        </div>
                                    ` :
                                    `
                                        <div id="${field.name}" class="mui--text-subhead">
                                            <div class="subhead">${field.name}</div>
                                            <div>${item.data[field.name]}</div>
                                        </div>
                                    `;
                                }).join('')}
                        </div>
                    `
                }
            })(this.state.view)}

        </div>
        `
    }
}

export default App;