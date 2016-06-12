# SkyscannerJS

Promise based wrapper for the Skyscanner travel APIs.

[![npm version](https://badge.fury.io/js/skyscannerjs.svg)](https://badge.fury.io/js/skyscannerjs)
[![npm downloads](https://img.shields.io/npm/dm/skyscannerjs.svg)](https://img.shields.io/npm/dm/skyscannerjs)
[![CI status](https://travis-ci.org/Garee/skyscannerjs.svg?branch=master)](https://travis-ci.org/Garee/skyscannerjs)

## Install

```sh
$ npm install skyscannerjs
```

## Examples

### Create an API object.

```javascript
// ES6
import skyscanner from "skyscanner";
const apiKey = "s3r3t4PIk3y";
const api = skyscanner.API(apiKey);

// ES5
var skyscanner = require("skyscanner");
var apiKey = "s3r3t4PIk3y";
var api = skyscanner.API(apiKey);
```
