# Hannibal

## Objectives

Validate a JSON object and provide clear error reporting where the object is not valid.

Provide a means to extend the validator functionality using plain JavaScript functions.

Provide a limited set of handy shortcut functions for common validations such as regex and enums.

Be fast and lightweight.

## Features

```js
var schema = {
    type: "object",
    schema: {
        name: {
            type: "string", // value must be a string if present
            required: true, // If the key is missing will raise error
            validators: {
                min: 2, // Minimum value string length
                max: 50 // Maximum value string length
            }
        },
        age: {
            type: ["number", "null"], // value must be an number or null
            pre: "toInt", // before validation perform a built in function
            validators: {
                min: 0, // min value
                max: 120 // max value
            }
        },
        phone: {
            type: "string",
            validators: {
                regex: /\+\d{2,3}\s\d{10,12}$/ // Check regex match
            }
        },
        contact: {
            aliasOf: "phone" // rename 'contact' to 'phone' and validate
        },
        gender: {
            type: "string",
            validators: {
                enum: ["male", "female"] // value must be one of male/female
            }
        },
        petName: {
            type: "string",
            validators: {
                // Run a completely custom validator which throws errors
                custom: function (value) {
                    if (value.slice(value.length -2, value.length) !== "fy") {
                        throw new Error ("should end in fy, like 'fluffy'")
                    }
                }
            }
        },
        address: {
            type: ["object", "null"], // allow an object or null
            schema: {
                house: {
                    type: "string",
                    required: true // If the address object is present then it must have a 'house' key
                    validators: {
                    }
                },
                street: {
                    type: ["string", "null"]
                },
                city: {
                    type: "string",
                    required: true,
                },
                country: {
                    type: "string",
                    pre: "toUppercase"
                    required: true,
                    validators: {
                        enum: ["GB", "US", "AU"]
                    }
                }
            }
        },
        dateOfBirth: {
            type: "date", // value must be a date object
            required: true,
            pre: [
                // custom function to convert unix timestamp to date
                function (obj, key, value) {
                    if (typeof value === "number") {
                        obj[key] = new Date(value*1000);
                    }
                },
                "toDate" // cast date string into date
            ]
        }
        
    }
};
```

## Usage

```js
var hannibal = require("hannibal");

// Create a test function
var testSchema = hannibal(schema);

var inputData1 = {
    name: "Hannibal Smith",
    age: 53,
    phone: "+01 2233445566",
    gender: "male",
    petName: "goofy",
    address: {
        street: "Underground",
        city: "Los Angeles",
        country: "US"
    },
    dateOfBirth: "Fri Oct 16 1955 12:15:35 GMT+0100 (BST)"
};

var plan1 = testSchema(inputData);

// Boolean if the object is valid
plan1.isValid // true

// Show all errors from validation
plan1.errors // []

// Output valid data
plan1.data // {name: "Hannibal Smith", ...}


var inputData2 = {
    name: "B A Baracus",
    age: 38,
    phone: "+01 6665554443",
    gender: "male",
    petName: "fudge",
    address: {
        city: "Los Angeles",
        country: "US"
    }
};

var plan2 = testSchema(inputData2)

// Boolean if the object is valid
plan2.isValid // false

// Show all errors from validation
plan2.errors // [{petName: "should end in fy, like 'fluffy'"}, {address: {street: "is required"}}, {dateOfBirth: "is required"}]

// Output valid data
plan2.data // {name: "B A Baracus", age: 38, ...}
```

## Schema building

### Types

Types represent the sudo primitive types allowed. These are provided as either a string or array of strings.

Available types:

 * string
 * date
 * boolean
 * time
 * number
 * array
 * object
 * null

### Pre

Pre functions are run before validation and can be used to convert a value. These are provided as a single or array of strings or functions.

Packaged pre filters include:

 * toString - convert numbers into strings
 * toInteger - convert strings into integers
 * toFloat  - convert strings into floats
 * toDate  - convert strings into dates
 * toArray  - wrap non arrays into an array
 * JSONtoObject - parse json into an object

See `lib/pre` for the full list.

Custom pre functions can be added inline via functions or registered into Hannibal. The functions take the value;

### Required

When set to `true` the required statement will error if the given key is not provided in the input object. Note this does not check the value, purely the presence of the key.

### Aliases

Aliases will convert a set of key names to the given key. Aliases can be provided a string or array of strings.

### Validators

Validators check the value against a set of criteria. Available validators are:

String:

 * regex - perform a regex match
 * min - check the minimum length
 * max - check the maximum length
 * enum - check the value is contained in a given array

Number:

 * min - minimum value
 * max - maximum value
 * enum - check the value is contained in a given array
 * minPrecision - minimum number of decimal places
 * maxPrecision - maximum number of decimal places

Date/Time:

 * min - minimum value
 * max - maximum value
 * enum - check the value is contained in a given array

Array:

 * min - check the minimum length
 * max - check the maximum length

Object:

 * min - minimum number of keys
 * max - maximum number of keys

Custom validators can be given via the `custom` key or registered with `hannibal`. Custom validators are provided with the value to validate.

Custom validators should throw an instace of `Error` with a message.

## Test