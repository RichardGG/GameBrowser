const updateGameInfo = (fields, games) => {
    // THIS MODIFIES GAMES???

    // Update game info for searching/sorting

    // Get list of fields used for sorting
    const numSorts = []
    _.forIn(this.fields, (field) => {
        if (field.sortable && ['Date', 'Number', 'Percent', 'SteamRating'].includes(field.type)) {
            numSorts.push(field.code)
        }
    })

    _.forIn(this.games, (game, key) => {
        // Fixes titles for searching
        game.searchTitle = game.title.toLowerCase()
        // Fixes for sorting
        for (const path of numSorts) {
            if (!_.isNumber(_.get(game, path))) {
                _.set(game, path, 'NA')
            }
        }
        _.set(game, 'random', Math.random())
    })
}

const getFieldValues = (fields, games) => {
    // THIS MODIFIES FIELDS???
    // Get the values for fields
    _.forEach(this.fields, (field) => {
        if (!field.fetch) {
            return
        }
        // get all the values eg: info.developers
        let values = {}
        _.forEach(this.games, (game) =>{
            let value = _.get(game, field.code)
            if (_.isEmpty(value)) {
                return
            }
            if (!_.isArray(value)) {
                value = [value]
            }
            _.forEach(value, (val) => {
                if (values[val]) {
                    values[val]++
                } else {
                    values[val] = 1
                }
            })
        })
        field.values = []
            _.forIn(values, (value, key) => {
            field.values.push({
                label: key + ' (' + value + ')',
                code: key,
            })
        })
        field.values = field.values.sort((a,b) => {
            const aC = parseInt(a.label.split('(')[1])
            const bC = parseInt(b.label.split('(')[1])
            return bC - aC
        })
    })
}

export default {
    getFieldValues,
    updateGameInfo,
}