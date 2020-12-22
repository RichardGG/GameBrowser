<template>
    <div class="nav-elements">
        <div class="nav-background" v-if="backgroundActive" @click="closeNav"></div>
        <div class="nav">
            <img src="/static/logo.svg" class="logo">
            <div class="nav-area" @click="closeNav"></div>
            <v-select 
                :reduce="option => option.code" 
                v-model="sort" 
                v-on:change="filtersUpdated" 
                :options="sortable" 
                class="sort"
                :clearable="false"
                :searchable="false"
            ></v-select>
            <span class="icon-button" @click="shuffleGames" v-if="sort === 'random'" >
                <unicon name="arrow-random" fill="white" />
            </span>
            <span class="icon-button" @click="toggleSortDirection" v-else-if="sortDirection" >
                <unicon name="sort-amount-up" fill="white" />
            </span>
            <span class="icon-button" @click="toggleSortDirection" v-else >
                <unicon name="sort-amount-down" fill="white" />
            </span>
            <div class="filters-area">
                <div class="filters-dropdown" v-if="filtersDropdownActive">
                    <div class="dropdown-item">
                        <button @click="newFilter">+ New</button>
                        <div class="dropdown-right">
                            <div class="or-and-toggle">
                                <div class="or-and-button">
                                    OR
                                </div>
                                <div class="or-and-button active">
                                    AND
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="saved-filters">
                        <div class="dropdown-item" v-for="(filter, name) in savedFilters" :key="name" @click="switchFilter(name)">
                            <div class="checkbox" @click="toggleFilter(name)" :data-rerender="rerenderHack">
                                <unicon v-if="filterIsActive(name) === 'true'" name="check" fill="white" />
                                <unicon v-if="filterIsActive(name) === 'false'" name="times" fill="white" />
                            </div>
                            <div class="dropdown-label">
                                <span v-if="filterIsActive(name) === 'false'">
                                    NOT
                                </span>
                                {{ filter.name }}
                            </div>
                            <div class="dropdown-right">
                                <div>
                                    <unicon name="pen" fill="white" @click="editFilter(filter, name)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
                <span @click="toggleFiltersDropdown" class="nav-button">Filters 🔽</span>
            </div>
             <VueSlider 
                v-model="scale" 
                width="200px" 
                tooltipPlacement="bottom" 
                tooltip="hover"
            ></VueSlider>
            <div class="tag-controls">
                <input v-model="tagName" type="text">
                <button @click="setTag">Set Tag</button>
            </div>
            <img src="/static/text.svg" class="text">
        </div>
        <div class="filters" v-if="filtersModalActive">
            <div class="filters-background" @click="closeFiltersModal"></div>
            <div class="filters-content">
                <input v-model="savedFilters[editingFilter].name" placeholder="Untitled Filter">
                <button @click="deleteFilter">Delete</button>
                <FiltersModel v-model="filtersModel" :fields="fields" v-on:filters-changed="filtersUpdated" :operations="operations"></FiltersModel>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import vSelect from 'vue-select'
import FiltersModel from '../Filters/FiltersModel.vue'
import VueSlider from 'vue-slider-component'
export default {
    name: 'Nav',
    components: {
        vSelect,
        FiltersModel,
        VueSlider
    },
    props: {
        fields: {
            type: Object
        },
        operations: {
            type: Object
        }
    },
    data() {
        return {
            sortable: [],
            sort: 'user.lastPlayed',
            sortDirection: true,

            filtersDropdownActive: false,
            filtersModalActive: false,
            backgroundActive: false,
            savedFilters: {},
            filtersActive: {},

            rerenderHack: Date.now(),

            editingFilter: '',
            filtersModel: { // TODO rename currentFilter?
                "in" : [
                    '',
                    'searchTitle'
                ]
            },

            filterName: '',
            scale: 0,

            tagName: '',
        }
    },
    mounted() {
        // Load saved filters
        const savedFiltersJSON = localStorage.getItem('savedFilters')
        this.savedFilters = savedFiltersJSON ? JSON.parse(savedFiltersJSON) : {}
        console.log(this.savedFilters);
        
        // Get the sortable fields
        this.sortable = _.filter(this.fields, {'sortable': true})

        _.each(this.savedFilters, (filter, name) => {
            this.filtersActive[name] = {
                active: ''
            }
        })
    },
    methods: {
        filterIsActive(name) {
            return _.get(this.filtersActive, `${name}.active`, '')
        },
        filtersUpdated() {
            this.saveFilter()
            this.savedFilters[this.editingFilter].filter = JSON.stringify(this.filtersModel)
            this.updateFilters()
        },
        shuffleGames() {
            this.$emit('shuffleGames')
        },
        toggleSortDirection() {

        },
        saveFilter() {
            localStorage.setItem('savedFilters', JSON.stringify(this.savedFilters));
        },
        switchFilter(name) {
            this.filtersModel = JSON.parse(this.savedFilters[name].filter)
            this.filtersUpdated()
        },
        deleteFilter(name) {
            delete this.savedFilters[this.editingFilter]
            this.closeFiltersModal()
        },
        updateFilters() {
            let filters = [true];
            _.each(this.filtersActive, (filter, name) => {
                if (filter.active === 'true') {
                    console.log('name', name)
                    console.log('filter',this.savedFilters[name] )
                    console.log('actfil', this.savedFilters[name].filter)
                    const clonedFilter = JSON.parse(this.savedFilters[name].filter)
                    const cleanedFilter = this.cleanFilters(clonedFilter) 
                    filters.push(cleanedFilter)
                } else if (filter.active === 'false') {
                    const clonedFilter = JSON.parse(this.savedFilters[name].filter)
                    const cleanedFilter = this.cleanFilters(clonedFilter) 
                    filters.push({'!': [cleanedFilter]})
                }
            });

            let combinedFilters = {
                'and': filters
            }
            this.$emit('filtersUpdated', combinedFilters)
        },
        cleanFilters(filters) {
            // Remove the "rule" property needed for vue
            for (const key in filters) {
                if (['or', 'and'].includes(key)) {
                    for (const index in filters[key]) {
                        filters[key][index] = filters[key][index].rule
                        this.cleanFilters(filters[key][index])
                    }
                }
            }
            return filters
        },
        newFilter() {
            this.editingFilter = uuidv4()
            this.filtersModel = {
                "in" : [
                    '',
                    'searchTitle'
                ]
            }
            this.savedFilters[this.editingFilter] = {
                name: 'Untitled Filter',
                filter: JSON.stringify(this.filtersModel)
            }
             _.set(this.filtersActive, `${this.editingFilter}.active`, 'true')
            this.showFiltersModal()
        },
        editFilter(filter, name) {
            this.editingFilter = name
            this.filterModel = filter
            this.showFiltersModal()
        },

        showFiltersModal() {
            this.closeNav()
            this.filtersModalActive = true
        },
        closeFiltersModal() {
            this.filtersModalActive = false
        },
        closeNav() {
            this.backgroundActive = false
            this.closeItems()
        },
        closeItems() {
            this.filtersDropdownActive = false
        },

        toggleFilter(name) {
            const active = _.get(this.filtersActive, `${name}.active`, '')
            if (active === 'true') {
                _.set(this.filtersActive, `${name}.active`, 'false')
            }
            else if (active === 'false') {
                _.set(this.filtersActive, `${name}.active`, '')
            }
            else {
                _.set(this.filtersActive, `${name}.active`, 'true')
            }
            this.rerenderHack = Date.now()

            this.updateFilters()
        },

        toggleFiltersDropdown() {
            if (this.filtersDropdownActive) {
                this.closeNav()
            } else {
                this.closeItems()
                this.backgroundActive = true
                this.filtersDropdownActive = true
            }
        },
        toggleFilters() {
            this.useFilters = !this.useFilters
        },
        toggleSortDirection() {
            this.sortDirection = !this.sortDirection
            this.$emit('sortDirectionUpdated', this.sortDirection)
        },
        setTag() {
            this.$emit('setTag', this.tagName)
        }
    },
    watch: {
        sort() {
            this.$emit('sortUpdated', this.sort)
        },
        scale() {
            this.$emit('scaleUpdated', (this.scale / 30) + 0.1)
        },
        filtersModel() {
            // this.$emit('filtersUpdated', this.filtersModel)
        }
    }
}
</script>
<style lang="scss">
@import 'vue-slider-component/theme/antd.css';
.nav-background {
    position: absolute;
    background: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
}
.or-and-toggle {
    display: flex;
    .or-and-button {
        opacity: 0.5;
        padding: 0 5px;
        &.active {
            opacity: 1;
        }
    }
}
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: none;
    color: white;
    z-index: 11;
    background: #333;
    padding: 10px;
    .text, .logo {
        width: 90px;
        margin: 0 20px;
        &.logo {
            margin-top: -10px;
            margin-bottom: -30px;
        }
        &.text {
            margin-left: auto;
            margin-right: auto;
            width: 220px;
            margin-bottom: -10px;
        }
    }
    .nav-button {
        cursor: pointer;
    }
    .nav-area {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .icon-button {
        display: block;
        position: relative;
        cursor: pointer;
        opacity: 0.7;
        &:hover {
            opacity: 1;
        }
        svg {
            pointer-events: none;
        }
    }
    .vs__selected {
        color: white;
    }
    .vs__actions {
        svg {
            fill: white !important;
        }
    }
    .vs__dropdown-toggle {
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid white;
    }
    .vs__search::placeholder,
    .vs__dropdown-toggle,
    .vs__dropdown-menu {
        width: 300px;
    }
    .filters-area {
        position: relative;
        margin-left: 20px;
        margin-right: 20px;
        .filters-dropdown {
            position: absolute;
            background: #222;
            padding: 20px;
            z-index: 99;
            top: calc(100% + 15px);
            left: -10px;
            width: 300px;
            max-height: 500px;
            .checkbox {
                border: 2px solid #aaa;
                width: 24px;
                height: 24px;
                line-height: 0px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 5px;
                margin-right: 10px;
            }
            .dropdown-item {
                width: 100%;
                display: flex;
                align-items: center;
                cursor: pointer;
                .dropdown-right {
                    margin-left: auto;
                }
            }
        }
    }
    .tag-controls {
        position: relative;
        margin-left: 10px;
        padding: 0 10px;
        background: green;
        &:hover {
            background: red;
        }
    }
}
</style>