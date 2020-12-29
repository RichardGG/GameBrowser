import jsonLogic from 'json-logic-js'
import _ from 'lodash'

const init = () => {
    jsonLogic.add_operation("!in", (a,b) => {
        return jsonLogic.apply(
            {"!": [{"in": [a, b]}]},
        )
    })
    jsonLogic.add_operation("empty", (a,b) => {
        return !b
    })
},
const filter = (games, filter) => {
    const cleanedFilters = JSON.parse(JSON.stringify(filter))
    const filteredGames = _.filter(this.games, (game) => {
        if (!this.useFilters) {
            return true
        }
        // replace tokens in filters
        const filtersJson = JSON.stringify(cleanedFilters)
        const replacedFilters = JSON.parse(filtersJson)
        replaceTokens(game, replacedFilters)

        const result = jsonLogic.apply(replacedFilters)
        return result
    })
    return filteredGames
}
const replaceTokens = (game, filter) => {
    for (const key in filters) {
        if (['or', 'and', '!'].includes(key)) {
            for (const rule of filters[key]) {
                this.replaceTokens(game, rule)
            }
        } else {
            filters[key][1] = _.get(game, filters[key][1])
        }
    }
}

export default {
    init,
    filter
}