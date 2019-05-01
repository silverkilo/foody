const store = Symbol('store')
const isValid = Symbol('isValid')
const keyErr = Symbol('keyErr')
const valErr = Symbol('valErr')
const expErr = Symbol('expErr')
const keyName = Symbol('keyName')
class Cache {
    constructor() {
        this.preferences = new CacheObject('preferences')
        this.matches = new CacheObject('matches')
        this.categories = new CacheObject('categories')
    }
}
class CacheObject {
    constructor(storeName) {
        this[store] = {}
        this[isValid] = key => ['number', 'string'].includes(typeof key)
        this[keyErr] = new Error('Key must be a string or number')
        this[valErr] = new Error('Value must be a string (try to JSON.stringify objects...)')
        this[expErr] = new Error('Expiration time must be a number')
        this[keyName] = storeName
    }
    /**
            *
            * @param {string | number} key
            */
    get(key) {
        if (this[keyName] === 'categories') key = 'all'
        if (!this[isValid](key)) throw this[keyErr]
        if (!this[store][key]) return null
        return new Promise((resolve) => {
            resolve((JSON.parse(this[store][key])))
        })
    }
    /**
     *
     * @param {string | number} key
     */
    set(key, value, expires = Infinity) {
        if (this[keyName] === 'categories') key = 'all'
        if (!this[isValid](key)) throw this[keyErr]
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        this[store][key] = value
        if (typeof expires !== 'number') throw this[expErr]
        if (expires !== Infinity) {
            setTimeout(() => {
                this[store][key] = undefined
            }, expires)
        }
        return new Promise((resolve) => {
            resolve(true)
        })
    }
    /**
     *
     * @param {string|number} key
     */
    clear(key) {
        if (!this[isValid](key)) throw this[keyErr];
        if (this[store][key]) return false;
        delete this[store][key];
        return new Promise((resolve) => {
            resolve(true)
        })
    }
}

const cache = new Cache()
const categories = [
    'All',
    'African',
    'American',
    'Japanese',
    'Chinese',
    'Malaysian',
    'Vietnamese',
    'Australian',
    'Brazilian',
    'Burmese',
    'Cajun',
    'Dessert',
    'French',
    'Bakery',
    'German',
    'Greek',
    'Persian',
    'Peruvian',
    'Vegan',
    'Vegetarian'
]

cache.categories.set('all', categories)


module.exports = cache
