[![Build Status](https://travis-ci.org/rosebyte/react-form-blocks.svg?branch=master)](https://travis-ci.org/rosebyte/react-form-blocks)

# react-form-blocks

library for creation react form components

## API

### Form
Form replaces html form element. Whole form should be inside this form component or some
component built upon it.
Form acts as a context provider, so without it rest components won't work...

Form can have several props:
* onChange: when form has some changes, it fires this function with one parameter (form facade)
* values: set of initial values. For example, form containing two fields named 'first' and
 'second' can be populated with object {first: "value1", second: 2} sent as values prop.

### Field
Field serves as a platform for making input components.

Props:
* render: standard render prop
* children: if function, it is used to render input field
* component: component to play as an input field
* onChange: when field has some changes, it fires this function with one parameter (field facade)
* onBlur: actions to happend when blur event occurs
* name (required): name of the field, it should be valid JS identifier
* value: initial value
* noValue: field doesn't send value to rendered component (for cases it has its own state)
* valueName: field sends its value to lower components as 'value', if it's not handy,
it can be renamed to value of this prop
* extractValue: function to extract value from change event of lower component
* edit: edit inputed value, function receives to parameters - current value and next value -
and returns value to be used as a new value
* sync: edit value by values of other fields, it receives one parameter - fields -
containing facades of all form's fields and returns new value for the field
* watch: field name or array of field names to watch (i.e. to fire sync function after
their change)
* type: field type, e.g. 'text', 'checkbox' etc.
* hide: hides lower components when true
* disabled: disable field when true

### Button

### Message

### View
Displays value based on fields values

* name (required): name of the view, it should be valid JS identifier
* hide: hides lower components when true
* render: standard render prop
* children: if function, it is used to render view
* component: component to play as an view
* onChange: when view has some changes, it fires this function with one parameter (view facade)
* sync: edit value by values of fields, it receives one parameter - fields -
containing facades of all form's fields and returns new value for the view
* watch: field name or array of field names to watch (i.e. to fire sync function after their change)
* display: indicates when to display view element, based on DISPLAY enum
