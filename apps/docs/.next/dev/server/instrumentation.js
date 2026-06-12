"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "instrumentation";
exports.ids = ["instrumentation"];
exports.modules = {

/***/ "(instrument)/./src/instrumentation.js":
/*!********************************!*\
  !*** ./src/instrumentation.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   register: () => (/* binding */ register)\n/* harmony export */ });\nasync function register() {\n    if (true) {\n        await Promise.all(/*! import() */[__webpack_require__.e(\"vendor-chunks/next@16.2.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_react-dom@19.2.6_react@19.2.6__react@19.2.6\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@swc+helpers@0.5.15\"), __webpack_require__.e(\"vendor-chunks/@sentry+core@10.53.1\"), __webpack_require__.e(\"vendor-chunks/@sentry+node@10.53.1\"), __webpack_require__.e(\"vendor-chunks/@sentry+node-core@10.53.1_@opentelemetry+api@1.9.1_@opentelemetry+core@2.7.1_@opentelemetry+a_lm72djkvwedsbtedkvluqpdew4\"), __webpack_require__.e(\"vendor-chunks/@sentry+nextjs@10.53.1_@opentelemetry+core@2.7.1_@opentelemetry+api@1.9.1__@opentelemetry+sdk_dizy4kakr3p47kr6tgqn74uw3e\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+core@2.7.1_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+sdk-trace-base@2.7.1_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation@0.214.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation@0.212.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation@0.207.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+semantic-conventions@1.41.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+api-logs@0.207.0\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-pg@0.66.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-graphql@0.62.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+api-logs@0.214.0\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+api-logs@0.212.0\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-koa@0.62.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-hapi@0.60.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-amqplib@0.61.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/minimatch@10.2.5\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-mysql@0.60.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-mongodb@0.67.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-knex@0.58.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-kafkajs@0.23.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-connect@0.57.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-tedious@0.33.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-mysql2@0.60.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-mongoose@0.60.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-fs@0.33.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/debug@4.4.3\"), __webpack_require__.e(\"vendor-chunks/@sentry+opentelemetry@10.53.1_@opentelemetry+api@1.9.1_@opentelemetry+core@2.7.1_@opentelemet_xjvlof3cho76hyvj6h2vyd3m6y\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+resources@2.7.1_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-lru-memoizer@0.58.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-generic-pool@0.57.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+instrumentation-dataloader@0.31.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@fastify+otel@0.18.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/import-in-the-middle@3.0.1\"), __webpack_require__.e(\"vendor-chunks/import-in-the-middle@2.0.6\"), __webpack_require__.e(\"vendor-chunks/brace-expansion@5.0.6\"), __webpack_require__.e(\"vendor-chunks/balanced-match@4.0.4\"), __webpack_require__.e(\"vendor-chunks/require-in-the-middle@8.0.1\"), __webpack_require__.e(\"vendor-chunks/supports-color@7.2.0\"), __webpack_require__.e(\"vendor-chunks/stacktrace-parser@0.1.11\"), __webpack_require__.e(\"vendor-chunks/ms@2.1.3\"), __webpack_require__.e(\"vendor-chunks/module-details-from-path@1.0.4\"), __webpack_require__.e(\"vendor-chunks/has-flag@4.0.0\"), __webpack_require__.e(\"vendor-chunks/@prisma+instrumentation@7.6.0_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"vendor-chunks/@opentelemetry+sql-common@0.41.2_@opentelemetry+api@1.9.1\"), __webpack_require__.e(\"_instrument_node_modules_pnpm_opentelemetry_instrumentation_0_207_0__opentelemetry_api_1_9_1_-8a3068\")]).then(__webpack_require__.bind(__webpack_require__, /*! ../sentry.server.config.js */ \"(instrument)/./sentry.server.config.js\"));\n    }\n    if (false) {}\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGluc3RydW1lbnQpLy4vc3JjL2luc3RydW1lbnRhdGlvbi5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU8sZUFBZUE7SUFDckIsSUFBSUMsSUFBb0MsRUFBRTtRQUMxQyxNQUFNLGcxSkFBb0M7SUFDMUM7SUFFQSxJQUFJQSxLQUFrQyxFQUFFLEVBRXZDO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9oYXJzaGdveWFsL0RvY3VtZW50cy9HaXRIdWIvaHlwZXJpdXgtY29tcG9uZW50cy9hcHBzL2RvY3Mvc3JjL2luc3RydW1lbnRhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG4gaWYgKHByb2Nlc3MuZW52Lk5FWFRfUlVOVElNRSA9PT1cIm5vZGVqc1wiKSB7XG4gYXdhaXQgaW1wb3J0KFwiLi4vc2VudHJ5LnNlcnZlci5jb25maWcuanNcIik7XG4gfVxuXG4gaWYgKHByb2Nlc3MuZW52Lk5FWFRfUlVOVElNRSA9PT1cImVkZ2VcIikge1xuIGF3YWl0IGltcG9ydChcIi4uL3NlbnRyeS5lZGdlLmNvbmZpZy5qc1wiKTtcbiB9XG59XG4iXSwibmFtZXMiOlsicmVnaXN0ZXIiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9SVU5USU1FIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(instrument)/./src/instrumentation.js\n");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "diagnostics_channel":
/*!**************************************!*\
  !*** external "diagnostics_channel" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("diagnostics_channel");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("module");

/***/ }),

/***/ "node:async_hooks":
/*!***********************************!*\
  !*** external "node:async_hooks" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),

/***/ "node:child_process":
/*!*************************************!*\
  !*** external "node:child_process" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("node:child_process");

/***/ }),

/***/ "node:diagnostics_channel":
/*!*******************************************!*\
  !*** external "node:diagnostics_channel" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("node:diagnostics_channel");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:events");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("node:https");

/***/ }),

/***/ "node:inspector":
/*!*********************************!*\
  !*** external "node:inspector" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("node:inspector");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("node:net");

/***/ }),

/***/ "node:os":
/*!**************************!*\
  !*** external "node:os" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:os");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ "node:readline":
/*!********************************!*\
  !*** external "node:readline" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("node:readline");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ "node:tls":
/*!***************************!*\
  !*** external "node:tls" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("node:tls");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "node:worker_threads":
/*!**************************************!*\
  !*** external "node:worker_threads" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("node:worker_threads");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "perf_hooks":
/*!*****************************!*\
  !*** external "perf_hooks" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("perf_hooks");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(instrument)/./src/instrumentation.js"));
module.exports = __webpack_exports__;

})();