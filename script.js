(function () {

    function sortArrayByObjectProperty(obj, property) {
        return obj.sort(function (a, b) {
            if (a[property].toLowerCase() < b[property].toLowerCase()) {
                return -1;
            }
            if (a[property].toLowerCase() > b[property].toLowerCase()) {
                return 1;
            }

            return 0;
        });
    }

    function sortObjectByKeys(rows) {
        return Object.keys(rows).sort().reduce(function (obj, key) {
            obj[key] = rows[key];
            return obj;
        }, {});
    }

    function summarize(rows, property) {
        var arr = {};

        rows.forEach(function (e) {
            var key = e[property]
            if (!key || key === '?') {
                key = 'Uncategorized';
            }

            if (!arr.hasOwnProperty(key)) {
                arr[key] = 0;
            }

            arr[key]++;
        })

        return sortObjectByKeys(arr);
    }

    var app = new Vue({
        el: '#app',
        data: {
            error: '',
            keyword: '',
            items: [],
            categories: {},
            results: [],
        },
        methods: {
            search: function (keyword) {
                if (!keyword) {
                    this.results = [];
                    return;
                }
                this.error = ''
                var items = this.items.filter(function (item) {
                    return ("" + item.client_id).toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || ("" + item.name).toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                })

                this.results = items.map(function (item) {
                    var keys = ['client_id', 'name']
                    for (keyIndex in keys) {
                        var key = keys[keyIndex]
                        var value = "" + item[key]

                        var index = value.toLowerCase().indexOf(keyword.toLowerCase())
                        if (index !== -1) {
                            item[key] = value.substring(0, index)
                            item[key] += "<strong>" + value.substring(index, index + keyword.length) + "</strong>"
                            item[key] += value.substring(index + keyword.length)
                        }
                    }

                    return item
                })

                if (!this.results || !this.results.length) {
                    this.error = `item "<strong>${keyword}</strong>" not found.`
                }
            },
            showCategory: function (category) {
                this.keyword = '';
                this.error = '';
                this.results = this.items.filter(function (e) {
                    return e.type === category;
                })

                if (!this.results) {
                    this.error = `item ${keyword} not found.`
                }
            }
        },
        beforeCreate: function () {
            this.error = '';
            fetch('./data.json').then(function (response) {
                return response.json()
            }).then(function (response) {
                this.items = Object.freeze(sortArrayByObjectProperty(response, 'name'))
                this.categories = Object.freeze(summarize(response, 'type'))
            }.bind(this)).catch(function (e) {
                this.error = e.toString()
            })
        }
    })

})()