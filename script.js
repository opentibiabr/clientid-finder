(function () {

    var app = new Vue({
        el: '#app',
        data: {
            error: '',
            keyword: '',
            items: [],
            results: [],
        },
        methods: {
            search: function (keyword) {
                this.error = ''
                this.results = this.items.filter(function (item) {
                    return ("" + item.client_id).toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || ("" + item.name).toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                }).map(function (item) {
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
                this.items = Object.freeze(response)
            }.bind(this)).catch(function (e) {
                this.error = e.toString()
            })
        }
      })

})()