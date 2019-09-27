class Storage {
    constructor(name) {
        this.name = name;
        this.read();
    }

    // return data
    list() {
        return this.read();
    }

    // add an item
    add(item) {
        this.data.push({
            id: Math.random().toString(16).slice(2),
            date: new Date().toISOString(),
            data: item
        })

        return this.write();
    }

    // update item
    update(id, updates) {
        let item = this.data.find(itm => itm.id === id)

        // ignore invalid ids
        if (!item) { return; }

        item.data = {
            ...item.data,
            ...updates
        };

        return this.write();
    }

    // remove item by id
    remove(id) {
        this.data = this.data
        .filter(item => {
            return item.id !== id
        });

        return this.write();
    }

    // destroy all items
    destroy() {
        this.data = [];
        localStorage.clear();
    }

    // read and write to localStorage
    read() {
        this.data = JSON.parse(localStorage.getItem(this.name)) || [];
        return this.data;
    }

    write() {
        localStorage.setItem(this.name, JSON.stringify(this.data));
        return this.read();
    }

}

module.exports.default = Storage;