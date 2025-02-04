/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/home_map.js":
/*!****************************!*\
  !*** ./src/js/home_map.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n(function(){\n    const lat = 20.67444163271174;\n    const lng =  -103.38739216304566;\n    const homeMap = L.map('homeMap').setView([lat, lng ], 10);\n\n    let markers = new L.FeatureGroup().addTo( homeMap )\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(homeMap);\n\n    let properties = [];\n    \n    const filters = {\n        category: '',\n        price: ''\n    }\n    const categorySelect = document.querySelector('#categories')\n    const priceSelect = document.querySelector('#prices')\n\n    categorySelect.addEventListener('change', e => {\n        filters.category = +e.target.value\n        filterProperties()\n    })\n    priceSelect.addEventListener('change', e => {\n        filters.price = +e.target.value\n        filterProperties()\n    })\n\n\n    const getProperties = async () =>{\n        try {\n            const url = 'api/properties'\n            const response =  await fetch( url )            \n            properties = await response.json()\n\n            showProperties( properties )\n        } catch (error) {\n            \n        }\n    }\n\n    getProperties()\n\n    const showProperties = properties => {\n        \n        markers.clearLayers()\n\n        properties.forEach(property => {\n            const marker = new L.marker([property?.lat, property?.lng],{\n                autoPan: true\n            })\n            .addTo(homeMap)\n            .bindPopup(`\n                <p class=\"text-indigo-600 font-bold\">${property.category?.name || 'No Category'}</p>\n                <h1 class=\"text-xl font-extrabold uppercase my-2\">${property?.title || 'No Title'}</h1>\n                <img src=\"/uploads/${property?.img || 'default.jpg'}\" alt=\"Imagen de la propiedad ${property.title}\">\n                <p class=\"text-gray-600 font-bold\">${property.price?.name || 'No Price'}</p>\n                <a href=\"/property/${property.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">Ver Propiedad</a>\n            `);\n            markers.addLayer(marker);\n            \n        }\n    )\n        \n    }\n\n    const filterProperties = () => {\n        const result = properties.filter( filterCategory).filter( filterPrice )\n        showProperties( result )\n    }\n\n    const filterCategory = property => {\n        return filters.category ? property.categoryId === filters.category : property\n    }\n    const filterPrice = property => {\n        return filters.price ? property.priceId === filters.price : property\n    }\n\n})()\n\n//# sourceURL=webpack://bienes_raices/./src/js/home_map.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/home_map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;