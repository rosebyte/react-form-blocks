export function isFunction (obj) {
    return typeof obj === 'function';
}

export function preventDefault (event) {
    if(event && event.preventDefault){
        event.preventDefault();
    }
}

export function forEachProperty(obj, func) {
    for (let i in obj) {
        if(obj.hasOwnProperty(i)){
            func(obj[i], i);
        }
    }
}

export function any(obj, predicate) {
    forEachProperty(obj, prop => {if(predicate(prop)){return true;}});
    return false;
}

export function isObject (obj) {
    return obj !== null && typeof obj === 'object';
}

export function isString (obj) {
    return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
}

export function getEventValue(event, fieldType){
    return isCheckable(fieldType) ? event.target.checked : event.target.value;
}

export function isCheckable(obj){
    return obj === 'radio' || obj === 'checkbox'
}