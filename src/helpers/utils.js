import warning from "tiny-warning";

export function isFunction (obj) {
    return typeof obj === 'function';
}

export function anyFieldContainsError(fields) {
    let errorWasFound = false;
    for (let field in fields){
        if(fields.hasOwnProperty(field) && fields[field].error){
            errorWasFound = true;
        }
    }
    return errorWasFound;
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

export function checkActiveElement(doc){
    if (process.env.NODE_ENV !== 'production' && typeof document !== 'undefined') {
        const activeElement = getActiveElement(doc);

        if (activeElement !== null && activeElement instanceof HTMLButtonElement) {
            process.env.NODE_ENV !== "production"
                ? warning(
                !!(activeElement.attributes && activeElement.attributes.getNamedItem('type')),
                'You submitted a Formik form using a button with an unspecified `type` attribute.  Most browsers default button elements to `type="submit"`. If this is not a submit button, please add `type="button"`.'
                )
                : void 0;
        }
    }
}

export function getActiveElement(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : undefined);

    if (typeof doc === 'undefined') {
        return null;
    }

    try {
        return doc.activeElement || doc.body;
    } catch (e) {
        return doc.body;
    }
}