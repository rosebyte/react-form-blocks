const babel = require("rollup-plugin-babel");
const NODE_ENV = "development";
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const replace = require("rollup-plugin-replace");

export default {
    input: "./src/index.js",
    output: [
        {
            file: './dist/react-form-blocks.cjs.js',
            format: "cjs"
        },
        {
            file: './dist/react-form-blocks.esm.js',
            format: "es"
        }
    ],
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
        }),
        babel({
            babelrc: false,
            presets: [["env", { "modules": false }], "react"],
            plugins: [
                "external-helpers",
                "transform-object-rest-spread",
                "babel-plugin-syntax-object-rest-spread",
                "babel-plugin-transform-class-properties"
            ],
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs({
            include: [
                'node_modules/**'
            ],
            exclude: [
                'node_modules/process-es6/**'
            ],
            namedExports: {
                'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
                'node_modules/react-dom/index.js': ['render']
            }
        })
    ],
    external:["react", "react-dom", "tiny-warning", "prop-types"]
};