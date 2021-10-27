import { stringify } from 'query-string';
import { HttpError, fetchUtils } from 'react-admin';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var isMergeableObject = function isMergeableObject(value) {
  return isNonNullObject(value) && !isSpecial(value);
};

function isNonNullObject(value) {
  return !!value && typeof value === 'object';
}

function isSpecial(value) {
  var stringValue = Object.prototype.toString.call(value);
  return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
}

var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
  return value.$$typeof === REACT_ELEMENT_TYPE;
}

function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
  return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
}

function defaultArrayMerge(target, source, options) {
  return target.concat(source).map(function (element) {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
}

function mergeObject(target, source, options) {
  var destination = {};

  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }

  Object.keys(source).forEach(function (key) {
    if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination;
}

function deepmerge(target, source, options) {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  var sourceIsArray = Array.isArray(source);
  var targetIsArray = Array.isArray(target);
  var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}

deepmerge.all = function deepmergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error('first argument should be an array');
  }

  return array.reduce(function (prev, next) {
    return deepmerge(prev, next, options);
  }, {});
};

var deepmerge_1 = deepmerge;

var SafrsHttpError = /*#__PURE__*/function (_HttpError) {
  _inheritsLoose(SafrsHttpError, _HttpError);

  function SafrsHttpError(message, status, body) {
    var _this2;

    _this2 = _HttpError.call(this, message, status, body) || this;
    _this2.name = 'SafrsHttpError';
    return _this2;
  }

  return SafrsHttpError;
}(HttpError);
var safrsErrorHandler = function safrsErrorHandler(httpError) {
  var errors = httpError.body;

  if ((errors === null || errors === void 0 ? void 0 : errors.errors.length) > 0) {
    return new SafrsHttpError(errors.errors[0].title, httpError.status, errors.errors[0].code);
  } else {
    console.log('Unsopported Http Error Body', httpError.body);
    return httpError;
  }
};

var defaultSettings = {
  total: 'total',
  headers: {
    Accept: 'application/vnd.api+json; charset=utf-8',
    'Content-Type': 'application/vnd.api+json; charset=utf-8'
  },
  updateMethod: 'PATCH',
  arrayFormat: 'brackets',
  includeRelations: [],
  errorHandler: safrsErrorHandler,
  endpointToTypeStripLastLetters: ['Model', 's']
};

var ResourceLookup = /*#__PURE__*/function () {
  function ResourceLookup(response) {
    this.lookup = new Map();
    this.includes = [];
    if (typeof response !== 'object') return;
    var resources;

    if (Object.prototype.hasOwnProperty.call(response, 'included')) {
      resources = [].concat(response.data, response.included);
    } else {
      resources = response.data;
    }

    for (var _iterator = _createForOfIteratorHelperLoose(resources), _step; !(_step = _iterator()).done;) {
      var entry = _step.value;
      var key = this.getKey(entry);
      this.lookup.set(key, entry);
    }
  }

  var _proto = ResourceLookup.prototype;

  _proto.getKey = function getKey(resource) {
    return resource.type + ":" + resource.id;
  };

  _proto.get = function get(resource) {
    if (this.has(resource)) {
      return this.lookup.get(this.getKey(resource));
    } else {
      return resource;
    }
  };

  _proto.has = function has(resource) {
    return this.lookup.has(this.getKey(resource));
  };

  _proto.unwrapData = function unwrapData(response, includes) {
    var _this = this;

    var ret = Object.assign({
      id: response.id
    }, response.attributes);

    if (includes.length === 0) {
      return ret;
    }

    if (Object.prototype.hasOwnProperty.call(response, 'relationships')) {
      for (var _i = 0, _Object$keys = Object.keys(response.relationships); _i < _Object$keys.length; _i++) {
        var relationName = _Object$keys[_i];

        if (!includes.includes(relationName)) {
          continue;
        }

        if (includes && relationName in includes) {
          continue;
        }

        var relation = response.relationships[relationName].data;

        if (Array.isArray(relation)) {
          ret[relationName] = relation.map(function (resource) {
            var includedRelation = _this.get(resource);

            var relationshipData = Object.assign({
              id: includedRelation.id
            }, includedRelation.attributes);
            return relationshipData;
          });
        } else if (relation == null) {
          continue;
        } else {
          var includedResource = this.get(relation);
          var relationshipData = Object.assign({
            id: includedResource.id
          }, includedResource.attributes);
          ret[lowerFirstLetter(relation.type)] = relationshipData;
        }
      }
    }

    return ret;
  };

  return ResourceLookup;
}();

function lowerFirstLetter(s) {
  return s[0].toLowerCase() + s.slice(1);
}

var jsonapiClient = function jsonapiClient(apiUrl, userSettings, httpClient, countHeader) {
  if (userSettings === void 0) {
    userSettings = {};
  }

  if (httpClient === void 0) {
    httpClient = fetchUtils.fetchJson;
  }

  if (countHeader === void 0) {
    countHeader = 'Content-Range';
  }

  var settings = deepmerge_1(defaultSettings, userSettings);
  var conf = {
    "resources": {}
  };

  try {
    conf = JSON.parse(localStorage.getItem('raconf') || "");
  } catch (e) {
    console.warn("Failed to parse config");
  }

  return {
    getList: function getList(resource, params) {
      var _params$filter;

      var _params$pagination = params.pagination,
          page = _params$pagination.page,
          perPage = _params$pagination.perPage;
      console.log(page, perPage);
      var query = {
        'page[number]': page,
        'page[size]': perPage,
        'page[offset]': (page - 1) * perPage,
        'page[limit]': perPage,
        sort: ' '
      };

      if ((_params$filter = params.filter) !== null && _params$filter !== void 0 && _params$filter.q) {
        var search_cols = conf.resources[resource].search_cols || [];
        query['filter'] = JSON.stringify(search_cols.map(function (col_name) {
          return {
            "name": col_name,
            "op": "like",
            "val": params.filter.q + "%"
          };
        }));
      } else {
        Object.keys(params.filter || {}).forEach(function (key) {
          query["filter[" + key + "]"] = params.filter[key];
        });
      }

      if (params.sort && params.sort.field) {
        var prefix = params.sort.order === 'ASC' ? '' : '-';
        query.sort = "" + prefix + params.sort.field;
      }

      var includes = [];
      var includeRelations = settings.includeRelations;

      for (var _iterator = _createForOfIteratorHelperLoose(includeRelations), _step; !(_step = _iterator()).done;) {
        var ir = _step.value;

        if (resource === ir.resource) {
          query['include'] = ir.includes.join(',');

          for (var _iterator2 = _createForOfIteratorHelperLoose(ir.includes), _step2; !(_step2 = _iterator2()).done;) {
            var include = _step2.value;
            includes.push(include);
          }

          break;
        }
      }

      var url = apiUrl + "/" + resource + "?" + stringify(query);
      return httpClient(url).then(function (_ref) {
        var json = _ref.json;
        var total = 0;

        if (json.meta && settings.total) {
          total = json.meta[settings.total];
        }

        total = total || json.data.length;
        var lookup = new ResourceLookup(json);
        var jsonData = json.data.map(function (resource) {
          return lookup.unwrapData(resource, includes);
        });
        return {
          data: jsonData,
          total: total
        };
      }).catch(function (err) {
        console.log('catch Error', err.body);
        var errorHandler = settings.errorHandler;
        return Promise.reject(errorHandler(err));
      });
    },
    getOne: function getOne(resource, params) {
      var url = apiUrl + "/" + resource + "/" + params.id + "?include=%2Ball&page[limit]=50";
      return httpClient(url).then(function (_ref2) {
        var json = _ref2.json;
        var _json$data = json.data,
            id = _json$data.id,
            attributes = _json$data.attributes,
            relationships = _json$data.relationships;
        Object.assign(attributes, relationships);
        return {
          data: _extends({
            id: id
          }, attributes)
        };
      });
    },
    getMany: function getMany(resource, params) {
      resource = capitalize(resource);
      var query = 'filter[id]=' + JSON.stringify(params.ids);
      var url = apiUrl + "/" + resource + "?" + query;
      return httpClient(url).then(function (_ref3) {
        var json = _ref3.json;
        var total = 0;

        if (json.meta && settings.total) {
          total = json.meta[settings.total];
        }

        total = total || json.data.length;
        var jsonData = json.data.map(function (value) {
          return Object.assign({
            id: value.id
          }, value.attributes);
        });
        return {
          data: jsonData,
          total: total
        };
      });
    },
    getManyReference: function getManyReference(resource, params) {
      var _params$pagination2 = params.pagination,
          page = _params$pagination2.page,
          perPage = _params$pagination2.perPage;
      var _params$sort = params.sort,
          field = _params$sort.field,
          order = _params$sort.order;
      var query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter_: JSON.stringify(_extends({}, params.filter))
      };
      query["filter[" + params.target + "]"] = params.id;
      var url = apiUrl + "/" + resource + "?" + stringify(query);
      var options = {};
      return httpClient(url, options).then(function (_ref4) {
        var headers = _ref4.headers,
            json = _ref4.json;

        if (!headers.has(countHeader)) {
          console.debug("The " + countHeader + " header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare " + countHeader + " in the Access-Control-Expose-Headers header?");
        }

        return {
          data: json.data,
          total: 100
        };
      });
    },
    update: function update(resource, params) {
      var type = conf["resources"][resource].type;
      var arr = settings.endpointToTypeStripLastLetters;

      for (var i in arr) {
        if (resource.endsWith(arr[i])) {
          type = resource.slice(0, arr[i].length * -1);
          break;
        }
      }

      var data = {
        data: {
          id: params.id,
          type: type,
          attributes: params.data
        }
      };
      return httpClient(apiUrl + "/" + resource + "/" + params.id, {
        method: settings.updateMethod,
        body: JSON.stringify(data)
      }).then(function (_ref5) {
        var json = _ref5.json;
        var _json$data2 = json.data,
            id = _json$data2.id,
            attributes = _json$data2.attributes;
        return {
          data: _extends({
            id: id
          }, attributes)
        };
      }).catch(function (err) {
        console.log('catch Error', err.body);
        var errorHandler = settings.errorHandler;
        return Promise.reject(errorHandler(err));
      });
    },
    updateMany: function updateMany(resource, params) {
      return Promise.all(params.ids.map(function (id) {
        return httpClient(apiUrl + "/" + resource + "/" + id, {
          method: 'PUT',
          body: JSON.stringify(params.data)
        });
      })).then(function (responses) {
        return {
          data: responses.map(function (_ref6) {
            var json = _ref6.json;
            return json.id;
          })
        };
      });
    },
    create: function create(resource, params) {
      var type = resource;
      var arr = settings.endpointToTypeStripLastLetters;

      for (var i in arr) {
        if (resource.endsWith(arr[i])) {
          type = resource.slice(0, arr[i].length * -1);
          break;
        }
      }

      var data = {
        data: {
          type: type,
          attributes: params.data
        }
      };
      return httpClient(apiUrl + "/" + resource, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(function (_ref7) {
        var json = _ref7.json;
        var _json$data3 = json.data,
            id = _json$data3.id,
            attributes = _json$data3.attributes;
        return {
          data: _extends({
            id: id
          }, attributes)
        };
      }).catch(function (err) {
        console.log('catch Error', err.body);
        var errorHandler = settings.errorHandler;
        return Promise.reject(errorHandler(err));
      });
    },
    delete: function _delete(resource, params) {
      return httpClient(apiUrl + "/" + resource + "/" + params.id, {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      }).then(function (_ref8) {
        var json = _ref8.json;
        return {
          data: json
        };
      });
    },
    deleteMany: function deleteMany(resource, params) {
      return Promise.all(params.ids.map(function (id) {
        return httpClient(apiUrl + "/" + resource + "/" + id, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })).then(function (responses) {
        return {
          data: responses.map(function (_ref9) {
            var json = _ref9.json;
            return json.id;
          })
        };
      });
    },
    getResources: function getResources() {
      if (conf) {
        return Promise.resolve({
          data: conf
        });
      }
      return httpClient(apiUrl + "/schema", {
        method: 'GET'
      }).then(function (_ref10) {
        var json = _ref10.json;
        localStorage.setItem('raconf', JSON.stringify(json));
        return {
          data: json
        };
      }).catch(function () {
        return {
          data: {}
        };
      });
    }
  };
};

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export { jsonapiClient };
//# sourceMappingURL=index.modern.js.map
