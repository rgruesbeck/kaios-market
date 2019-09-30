class Storage {
    constructor({ local, server, messageBus }) {
        this.data = [];
        this.local = local;
        this.server = server;
        this.messageBus = messageBus;

        this.read();
    }

    // return data
    list() {
        return this.read();
    }

    // add an item
    add(item) {
        return this.write([
            {
                _id: `local-${Math.random().toString(16).slice(2)}`,
                date: new Date().toISOString(),
                data: item
            },
            ...this.data
        ]);
    }

    // update item
    update(id, cb) {
        return this.write([
            ...this.data
            .map(item => {
                if (item._id === id) {
                    return {
                        ...item,
                        ...{
                            data: cb(item.data)
                        }
                    }
                } else {
                    return item
                }
            })
        ]);
    }

    // remove item by id
    remove(id) {
        return this.write([
            ...this.data
            .filter(item => {
                return item.id !== id
            })
        ]);
    }

    // destroy local data
    destroy() {
        this.write([]);
    }

    // read and write to localStorage
    read() {
        return this.data || [];
    }

    write(data) {
        // update local data
        localStorage.setItem(this.local, JSON.stringify([
            ...new Map(data.map(item => [item._id, item])).values()
        ]));

        this.data = JSON.parse(localStorage.getItem(this.local));

        // broadcast update
        this.broadcast({
            action: 'localUpdate'
        });

        return this.read();
    }

    // sync with server
    sync(opts) {
        // skip if not online
        let online = window.navigator.onLine;
        if (!online) { return this.list(); }

        this.syncUp();
        this.syncDown(opts);

        return this.list();
    }

    // syncUp
    syncUp() {
        // upload posts: unless no posts to upload
        this.data
        .filter(item => item._id.includes('local'))
        .forEach(item => {
            fetch(`${this.server}/sync`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            })
            .then((response) => response.json())
            .then((jsonResponse) => {
                if (jsonResponse.success) {
                    this.remove(item._id);

                    // broadcast success
                    this.broadcast({
                        action: 'syncUp',
                        success: true
                    })
                } else {

                    // broadcast upload error
                    this.broadcast({
                        action: 'syncUp',
                        success: false,
                        error: 'upload error'
                    })
                }
            })
            .catch(err => {
                // broadcast upload error
                this.broadcast({
                    action: 'syncUp',
                    success: false,
                    error: err
                })
            });
        })
    }

    // syncDown
    syncDown(params = {}) {
        let url = [...Object.entries(params)]
        .filter(entry => entry.length === 2)
        .reduce((URL, param) => {
            URL.searchParams.append(param[0], param[1])

            return URL;
        }, new URL(`${this.server}/sync`))

        fetch(url)
        .then((response) => response.json())
        .then(res => {

            // update local data
            this.write([
                ...this.data,
                ...res.posts
            ]);

            // broadcast success
            this.broadcast({
                action: 'syncDown',
                success: true
            })
        })
        .catch(err => {
            // broadcast error
            this.broadcast({
                action: 'syncDown',
                success: false,
                error: err
            })
        });
    }

    // broadcast app message
    broadcast(message) {
        this.messageBus.dispatchEvent(new CustomEvent('app-message', {
            detail: {
                ...message,
                ...{
                    from: 'storage'
                }
            }
        }))
    }
}

module.exports.default = Storage;