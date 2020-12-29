const sort = (filteredGames, sortType, sort, sortDirection) => {
    // sortType = this.fields[this.sort].type
    let sortedGames = filteredGames
    if (['Date', 'Percent', 'SteamRating', 'Number'].includes(sortType)) {
        sortedGames = filteredGames.sort((a,b) => {
            const aVal = _.get(a, sort)
            const bVal = _.get(b, sort)
            // Number sorting
            if (aVal === bVal) {
                return 0
            }
            if (aVal === 'NA') {
                return 1
            }
            if (bVal === 'NA') {
                return -1
            }
            if (sortDirection) {
                return bVal - aVal
            }
            return aVal - bVal
        })
    } else {
        sortedGames = filteredGames.sort((a,b) => {
            let aVal = _.get(a, sort)
            let bVal = _.get(b, sort)
            // String sorting
            aVal = typeof aVal === 'string' ? aVal.toLowerCase() : aVal 
            bVal = typeof bVal === 'string' ? bVal.toLowerCase() : bVal
            if (aVal > bVal) {
                return sortDirection ? -1 : 1;
            }
            if (aVal < bVal) {
                return sortDirection ? 1 : -1;
            }
            return 0
        })
    }
    return sortedGames
}
export default {
    sort
}