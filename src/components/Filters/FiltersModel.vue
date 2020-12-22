<template>
    <div>
        <RuleModel v-model="filters" :isRoot="true" :fields="fields" :operations="operations"></RuleModel>
    </div>
</template>
<script>
import RuleModel from './RuleModel.vue'
export default {
    name: 'FiltersModel',
    components: {
        RuleModel
    },
    mounted() {
        this.$root.$on('rule-change', () => {
            this.$emit('filters-changed')
            console.log(Date.now(), 'rule changed')
        })
    },
    data() {
        return {
            filters: this.value
        }
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        fields: {
            type: Object,
            required: true
        },
        operations: {
            type: Object,
            required: true
        },
    },
    watch: {
        filters() {
            console.log('yes the whole filters changed')
            this.$emit('input', this.filters)
        },
        value() {
            this.filters = this.value
        }
    }
}
</script>
<style lang="scss">
.filters {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    .filters-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
    }
    .filters-content {
        position: relative;
        background: #111;
        border-radius: 5px;
        padding: 20px;
        min-width: 80%;
        > input {
            color: white;
            background: none;
            border: none;
            border-bottom: 1px solid white;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .rule {
            display: flex;
            align-items: center;
            margin: 5px;
            button {
                opacity: 0.5;
            }
            > span {
                margin-right: 15px;
                > input {
                    height: 30px;
                    background: none;
                    border: none;
                    border-bottom: 1px solid white;
                    width: 300px;
                    color: white;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 16px;
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
                margin-right: 15px;
            }
            .vs__search::placeholder,
            .vs__dropdown-toggle,
            .vs__dropdown-menu {
                width: 300px;
            }
        }
        .card {
            padding: 10px 20px;
            color: black;
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 0 10px rgba(0,0,0,1);
            border-radius: 4px;
            > div:first-child > .card-label {
                display: none;
            }
            .card-label {
                margin: 10px;
                opacity: 0.6;
                color: white;
                text-transform: uppercase;
            }
            button {
                border: 1px solid rgba(255,255,255,0.1);
                background: none;
                color: white;
                opacity: 0.5;
                cursor: pointer;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>