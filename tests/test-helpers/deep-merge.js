import {isObject} from "../../src/helpers/utils";

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
export default function deepmerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (let key in source) {
            if(source.hasOwnProperty(key)){
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    deepmerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
    }

    return deepmerge(target, ...sources);
}