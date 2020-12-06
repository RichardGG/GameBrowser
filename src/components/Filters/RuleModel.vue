<template>
    <div>
        <div v-if="isMultiple()" class="card">
            <div v-for="(rule, index) in getRuleValues()" :key="index">
                <div class="card-label">{{ type }}</div>
                <RuleModel v-model="rule.rule" v-on:delete-me="deleteChild(index)" v-on:change="childChanged" :fields="fields" :operations="operations"></RuleModel>
            </div>
            <button @click="addAnother()">+ {{ type }}</button>
        </div>
        <div v-else class="rule">
            <v-select 
                :reduce="option => option.code" 
                class="field" 
                v-model="field" 
                :options="Object.values(fields)"
                :clearable="false"
            ></v-select>

            <v-select 
                :reduce="option => option.code" 
                class="operation" 
                v-model="operation" 
                :options="Object.values(operations[fields[field].type])"
                :clearable="false"
            ></v-select>

            <span v-if="operationType == 'String'">
                <input v-model="search">
            </span>
            <span v-else-if="operationType == 'Date'">
                <Date v-model="search"></Date>
            </span>
            <span v-else-if="operationType == 'Slider'">
                <input v-model="search">
            </span>
            <span v-else-if="operationType == 'Array'">
                <v-select :reduce="option => option.code" v-model="search" :options="fields[field].values"></v-select>
            </span>
            <span v-else-if="operationType == 'Number'">
                <input type="number" v-model="search">
            </span>
            
            <button @click="changeTo('or')">or</button>
            <button @click="changeTo('and')">and</button>
            <button v-if="!isRoot" @click="deleteMe">x</button>
        </div>
    </div>
</template>
<script>
import RuleModel from './RuleModel.vue'
import Date from '../Fields/Date.vue'
import vSelect from 'vue-select'
export default {
    name: 'RuleModel',
    components: {
        Date,
        RuleModel,
        vSelect
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        isRoot: {
            type: Boolean
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
    data() {
        return {
            field: !this.isMultiple() ? this.getRuleValues()[1] : '',
            operation: this.getType(),
            search: !this.isMultiple() ? this.getRuleValues()[0] : '',
        }
    },
    mounted() {
    },
    computed: {
        type() {
            return this.getType()
        },
        operationOptions() {
            if (this.isMultiple(this.type)) {
                return ''
            }
            const operations = this.operations
            const fields = this.fields
            const fieldValue = this.field
            const field = fields[fieldValue]
            const fieldType = field.type
            return operations[fieldType]
        },
        operationType() {
            const operationOptions = this.operationOptions
            const operationValue = this.getType()
            const operation = operationOptions[operationValue]
            const operationType = operation.type
            return operationType
        }
    },
    methods: {

        // Maybe these should be computed?
        isMultiple() {
            return ['and', 'or'].includes(this.type)
        },
        getRuleValues() {
            return this.value[this.getType()]
        },
        getType() {
            for (const key in this.value) {
                return key
            }
        },

        // Change from child
        deleteChild(index) {
            // Remove child
            this.getRuleValues().splice(index, 1)
            if (this.getRuleValues().length === 1) {
                // Only one child, change to single rule
                this.changeToSingleRule(index)
                return
            }
            // Have to create a new object to get vue to recognise input change, maybe should use JSON.stringify?
            const newFilter = {}
            newFilter[this.type] = this.getRuleValues()
            this.$emit('input', newFilter)
        },
        changeToSingleRule() {
            this.$emit('input', this.getRuleValues()[0].rule)
        },
        childChanged() {
            // Have to create a new object to get vue to recognise input change, maybe should use JSON.stringify?
            const newFilter = {}
            newFilter[this.type] = this.getRuleValues()
            this.$emit('input', newFilter)
        },

        // Change self
        changeTo(type) {
            const newFilter = {}
            const newRule = JSON.parse(JSON.stringify(this.value))
            newFilter[type] = [{rule: this.value}, {rule: newRule}] // TODO better new rule?
            this.$emit('input', newFilter)
        },
        deleteMe() {
            this.$emit('delete-me')
        },
        addAnother() {
            let lastRule = this.getRuleValues().slice(-1).pop().rule
            let tests = 1
            while(['and', 'or'].includes(Object.keys(lastRule).pop())) {
                lastRule = lastRule[Object.keys(lastRule).pop()].slice(-1).pop().rule
                tests++
            }
            const newRule = JSON.parse(JSON.stringify(lastRule))
            this.getRuleValues().push({rule: lastRule}) // TODO better new rule?
            // Have to create a new object to get vue to recognise input change, maybe should use JSON.stringify?
            const newFilter = {}
            newFilter[this.type] = this.getRuleValues()
            this.$emit('input', newFilter)
        },

        // Emit basic change
        updateValue(type) {
            const newFilter = {}
            newFilter[type] = [this.search, this.field]
            this.$emit('input', newFilter)
        }
    },
    watch: {
        field() {
            const operations = this.operations[this.fields[this.field].type]
            let type = this.getType()
            if (!operations[this.operation]) {
                this.operation = Object.keys(operations)[0]
                type = this.operation
            }
            this.search = this.fields[this.field].placeholder
            this.updateValue(type)
        },
        operation() {
            this.updateValue(this.operation)
        },
        search() {
        
            if (this.field === 'searchTitle') {
                this.search = this.search.toLowerCase()
            }
            this.updateValue(this.getType())
        },
        value() {
            this.$root.$emit('rule-change')

            // set field values on value change
            if (this.isMultiple()) {
                // TODO how to update array

            } else {
                this.field = this.getRuleValues()[1]
                this.operation = this.getType()
                this.search = this.getRuleValues()[0]
            }
        }
    }
}
</script>