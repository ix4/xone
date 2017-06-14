goog.provide('APP.CONTROLLER');
goog.require('CORE');
goog.require('APP');

(function(CONTROLLER, ROUTE){

    if(CONFIG.SERVER_HOST){

        /**
         * @param {Array<*>|string} route
         * @param {Function|Object<string, *>=} params
         * @param {Function=} callback
         * @param {Function=} error
         * @param {Function=} update_cache
         * @const
         */

        CONTROLLER.request = function request(route, params, callback, error, update_cache){

            if(route.constructor === Array){

                return CONTROLLER.requestBatch(
                    /** @type {Array<*>} */
                    (route),
                    /** @type {Function|null} */
                    (params)
                );
            }

            if(CORE.isType(params, 'function')){

                update_cache = error;
                error = callback;
                callback = /** @type {Function|null} */ (params);
                params = null;
            }

            route = /** @type {string} */ (route);

            if(!CORE.isType(ROUTE[route])){

                ROUTE[route] = {};

                if(DEBUG) CORE.console.warn('WARNING: No route specified for "' + route + '"!');
            }

            params || (params = APP.PAYLOAD[route] ? APP.PAYLOAD[route]() : ROUTE[route].params || null);

            (function(route, route_obj, callback, update_cache){

                var route_action = route_obj.action;

                // if(!update_cache && route_action && APP.LAYOUT.lastAction === route_action){
                //
                //     var nodes = CORE.getByTag('main', CORE.getById('content-' + route_action).parentNode.parentNode);
                //
                //     for(var i = 0; i < nodes.length; i++){
                //
                //         CORE.scrollToTop(nodes[i]);
                //     }
                // }

                APP.LAYOUT.lastAction = route_action || APP.LAYOUT.lastAction || '';

                if(!update_cache && route_action){

                    APP.LAYOUT.handleCache(route_action, function(update_cache){

                        //CORE.async(function() {

                        CONTROLLER.request(route, params, callback, error, update_cache);

                        //}, APP.LAYOUT.lastAction === route_action ? 400 : 0);
                    });

                    return;
                }

                route_obj.header || (route_obj.header = {});
                route_obj.header["Accept"] || (route_obj.header["Accept"] = "application/json");
                route_obj.header["Content-Type"] || (route_obj.header["Content-Type"] = "application/json");

                /* Append default headers from APP.VARS.HEADER */

                var default_headers = APP.VARS.HEADER;

                for(var key in default_headers){

                    if(default_headers.hasOwnProperty(key)){

                        route_obj.header[key] = default_headers[key];
                    }
                }

                /* Replace dynamic params in query string */

                var pos;

                if((pos = route.indexOf('/:')) !== -1){

                    var custom_field = route.substring(pos + 2, route.indexOf('/', pos + 2));
                    route = route.replace('/:' + custom_field, '/' + params[custom_field]);
                }

                /* Determine request type and replace markers */

                var request_type = 'GET';

                if(route.indexOf('GET:') !== -1){

                    route = route.substring(4);
                }
                else if(route.indexOf('POST:') !== -1){

                    request_type = 'POST';
                    route = route.substring(5);
                }
                else if(route.indexOf('DELETE:') !== -1){

                    request_type = 'DELETE';
                    route = route.substring(7);
                }
                else if(route.indexOf('PATCH:') !== -1){

                    request_type = 'PATCH';
                    route = route.substring(6);
                }

                var fn_success = function fn_success(data){
                    // perform data field index
                    if(route_obj.field) data = data[route_obj.field] || [];
                    // perform filter
                    if(route_obj.filter) data = data.filter(route_obj.filter);
                    // perform arrayfilter
                    if(route_obj.arrayfilter) data = route_obj.arrayfilter(data, params);
                    // perform sort
                    if(route_obj.sort) data = data.sort(route_obj.sort);
                    // limit result
                    if(route_obj.limit && (data.length > route_obj.limit)) data.splice(0, data.length - route_obj.limit);
                    // limit result
                    if(route_obj.last && (data.length > route_obj.last)) data.splice(0, route_obj.last);
                    // map array values
                    if(route_obj.map) data.map(route_obj.map);
                    // arraymap array values
                    if(route_obj.arraymap) route_obj.arraymap(data, params);
                    // update cache
                    if(update_cache) update_cache();

                    (callback || (

                            callback = (

                                route_obj.do ? (

                                    route_obj.do.charAt ?

                                        APP.HANDLER[route_obj.do]
                                    :
                                        route_obj.do
                                )
                                :(
                                    route_obj.to ?

                                        CONTROLLER[route_obj.to]
                                    :
                                        null
                                )
                            )
                        )
                    );

                    // perform callback and pass data
                    if(callback) callback(data, params);
                };

                /* Perform request */

                CORE.ajax(/** @type {_ajax_struct}*/ ({

                    url: CONFIG.SERVER_HOST + (route_obj.url || route),
                    params: params,
                    type: route_obj.type || request_type,
                    header: route_obj.header,
                    cache: route_obj.cache,
                    clear: route_obj.clear,
                    success: fn_success,
                    error: function fn_error(status, data){
                        if(route_obj.default) fn_success(route_obj.default());
                        if(error) error(status, data);
                        else if(route_obj.error) route_obj.error(status, data);
                    }
                }));

                /* Analytics */

                // if(APP.PLUGIN.Analytics){
                //
                //     APP.PLUGIN.Analytics.event(
                //         /* Category: */
                //         'Request',
                //         /* Event: */
                //         (route_obj.type || request_type).toUpperCase() + ': ' + (route_obj.url || route),
                //         /* Label: */
                //         'Hits',
                //         /* Integer Value: */
                //         1
                //     );
                // }

            })(route, /** @type {_route_struct} */ (ROUTE[route]), callback, update_cache);
        };

        /**
         * @param {Array<*>} requests
         * @param {Function=} callback
         * @const
         */

        CONTROLLER.requestBatch = function(requests, callback){

            for(var i = 0; i < requests.length; i++){

                (function(request, callback){

                    if(CORE.isType(request, 'string')){

                        request = [request, null, CONTROLLER[ROUTE[/** @type {string} */ (request)].to]];
                    }

                    CONTROLLER.request(request[0], request[1], function(data){

                        if(request[2]) request[2](data);
                        if(callback) callback();
                    });

                })(requests[i], i === requests.length - 1 ? callback : null)
            }
        };

        /**
         * @param {Array<*>} _requests
         * @param {Function=} _callback
         * @param {number=} i
         * @const
         */

        CONTROLLER.requestSync = function(_requests, _callback, i){

            var requests = _requests;
            var callback = _callback;

            var request = requests[i || (i = 0)];

            if(CORE.isType(request, 'string')){

                request = [request, null, CONTROLLER[ROUTE[/** @type {string} */ (request)].to]];
            }

            CONTROLLER.request(request[0], request[1], function(data){

                if(request[2]) request[2](data);

                if(++i < requests.length){

                    CONTROLLER.requestSync(requests, callback, i);
                }
                else if(callback) callback();
            });
        };
    }

    /**
     * Build a HTML template through linear pattern
     * @param {string} _view
     * @param {Array<_model_class>=} data
     * @returns {string}
     *
     * TODO:
     * https://jsperf.com/clonenode-vs-createelement-performance/32
     */

    function buildTemplate(_view, data){

        if(DEBUG){

            var debug_time = CORE.time.now();
        }

        data || (data = [{}]);

        if(data.constructor !== Array) data = [data];

        /** @type {Array<_template_struct>} */
        var template = APP.VIEW[_view];
        var html = '';
        var item;

        for(var x = 0; x < data.length; x++){

            if(item = data[x]){

                var map_to_view = item.mapToView;
                // var map_to_view_cache = item.mapToViewCache || (item.mapToViewCache = {});
                //     map_to_view_cache['id'] || (map_to_view_cache['id'] = new Array(_view.length));
                // var map_to_view_cache = item.mapToViewCache || (item.mapToViewCache = new Array(_view.length));
                var map_to_view_cache = item['mapToViewCache'] || (item['mapToViewCache'] = {});

                /* Temporary holders to split object notations into its components */

                var split;
                var model;
                var field;
                var extra;

                for(var a = 0; a < template.length; a++){

                    //map_to_view_cache = map_to_view_cache[a] || (map_to_view_cache[a] = {});

                    /** @type {_template_struct} */
                    var view = template[a];

                    var template_data = view.data;
                    var template_map = view.map;
                    var tmp;
                    var pos;

                    /* Perform skip condition */

                    if(item === null || (view.if && view.if(item) === false)){

                        // TODO: fix else conditions in templates
                        if(view.else) template_data = [view.else];
                        else continue;
                    }

                    /* Perform loop */

                    var loop_data;
                    var loop_start = 0;
                    var loop_end = 0;
                    var loop_count = 1;

                    var view_loop = view.loop;

                    if(view_loop){

                        // TODO: move loop control to compiler
                        if(view_loop.indexOf(',') !== -1){

                            var loop_start_end = view_loop.split(',');

                            if(loop_start_end.length === 3){

                                loop_start = parseInt(loop_start_end[1], 10);
                                loop_end = parseInt(loop_start_end[2], 10);
                            }
                            else{

                                loop_end = parseInt(loop_start_end[1], 10);
                            }

                            view_loop = loop_start_end[0];
                        }

                        /* Check if the loop identifier is in object notation */

                        // TODO: move subfields to compiler
                        if(view_loop.indexOf('.') !== -1){

                            /* If the loop identifier is in object notation split this into its components */

                            split = view_loop.split('.');
                            model = split[0];
                            field = split[1];
                            extra = split[2] || false;

                            /* Determine the array which has to be looped */

                            loop_data = (

                                item[model] ?

                                    item[model][field] ?

                                        item[model][field][extra] ?

                                            item[model][field][extra]
                                        :
                                            item[model][field]
                                    :
                                        item[model]
                                :
                                    item
                            );
                        }
                        else{

                            /* If the loop identifier is not in object notation use it as the array key */

                            loop_data = item[view_loop];
                        }

                        /* Determine count of the loop */

                        loop_count = loop_data ? (loop_end && (loop_end <= loop_data.length) ? loop_end : loop_data.length) : 0;
                    }

                    /* Loop count is at least 1 */

                    var item_loop = item;

                    for(var z = (loop_start || 0); z < loop_count; z++){

                        var template_html = '';

                        if(view_loop){

                            item_loop = loop_data[z];
                        }

                        if(item_loop){

                            //var map_to_view_cache;

                            if(item_loop.mapToView){

                                map_to_view = item_loop.mapToView;
                                // map_to_view_cache = item_loop.mapToViewCache || (item_loop.mapToViewCache = {});
                                // map_to_view_cache['id'] || (map_to_view_cache['id'] = new Array(_view.length));
                                //map_to_view_cache = item_loop.mapToViewCache || (item_loop.mapToViewCache = new Array(_view.length));
                                map_to_view_cache = item_loop['mapToViewCache'] || (item_loop['mapToViewCache'] = {});
                            }

                            else if(CORE.isType(item_loop.mapToView)) map_to_view_cache = item_loop['mapToViewCache'] || (item_loop['mapToViewCache'] = {});

                            /* Delegate additional index attribute to the view mapper */

                            item_loop['index'] || (item_loop['index'] = view_loop ? z : x);

                            /* Loop through the template map (step = 2) */

                            //template_html = '';

                            if(template_map.length) template_html += template_data[0];

                            for(var i = 1; i < template_map.length; i += 2){

                                var mapped_value = template_data[i];
                                var key = template_map[i];

                                // Mapper Cache:
                                if(CORE.isType(map_to_view_cache[key])){

                                    template_html += map_to_view_cache[key];

                                    if(i + 1 < template_data.length) template_html += template_data[i + 1];
                                    if(DEBUG) APP.STATS.count_mapper_cache++;
                                    continue;
                                }

                                /* ACCESS ON OBJECT PROPERTIES (TEMPLATE) */

                                if(key.indexOf('.') !== -1){

                                    split = key.split('.');
                                    model = split[0];
                                    field = split[1];
                                    extra = split[2] || false;

                                    /* ACCESS ON ARRAY INDEX (TEMPLATE) */

                                    if((pos = model.indexOf('[')) !== -1){

                                        var index = parseInt(model.substring(pos + 1, model.indexOf(']')), 10);

                                        model = model.substring(0, pos);

                                        if(tmp = item_loop[model][index]){

                                            if(map_to_view && map_to_view[model] && map_to_view[model][field]){

                                                if(extra && map_to_view[model][field][extra]){

                                                    //template_data[i] = map_to_view[model][field][extra](tmp[field][extra], tmp);
                                                    mapped_value = map_to_view[model][field][extra](tmp[field][extra], tmp);
                                                    map_to_view_cache[key] = mapped_value;
                                                }
                                                else{

                                                    //template_data[i] = map_to_view[model][field](tmp[field], tmp);
                                                    mapped_value = map_to_view[model][field](tmp[field], tmp);
                                                    map_to_view_cache[key] = mapped_value;
                                                }
                                            }

                                            //else template_data[i] = tmp[field];
                                            else mapped_value = tmp[field];
                                        }
                                    }
                                    else{

                                        if(tmp = item_loop[model]){

                                            if(map_to_view && map_to_view[model] && map_to_view[model][field]){

                                                // TODO: pass a field or pass the model which can be handled in the mapper (e.g. loop)

                                                if(extra){

                                                    var val = (


                                                        CORE.isType(tmp[field]) ? (

                                                            CORE.isType(tmp[field][extra]) ?

                                                                tmp[field][extra]
                                                            :
                                                                tmp[field]

                                                        ) : tmp || item_loop
                                                    );

                                                    if(map_to_view[model][field][extra]){

                                                        //template_data[i] = map_to_view[model][field][extra](val, tmp || item_loop);
                                                        mapped_value = map_to_view[model][field][extra](val, tmp || item_loop);
                                                        map_to_view_cache[key] = mapped_value;
                                                    }
                                                    else{

                                                        //template_data[i] = val;
                                                        mapped_value = val;
                                                    }
                                                }
                                                else{

                                                    //template_data[i] = map_to_view[model][field](tmp[field], tmp || item_loop);
                                                    mapped_value = map_to_view[model][field](tmp[field], tmp || item_loop);
                                                    map_to_view_cache[key] = mapped_value;
                                                }
                                            }
                                            else if(tmp[field] && tmp[field][extra]){

                                                //template_data[i] = tmp[field][extra];
                                                mapped_value = tmp[field][extra];
                                            }
                                            else{

                                                // template_data[i] = (
                                                //
                                                //     CORE.isType(tmp[field]) ?
                                                //
                                                //         tmp[field]
                                                //     :
                                                //         tmp || item_loop
                                                // );

                                                mapped_value = (

                                                    CORE.isType(tmp[field]) ?

                                                        tmp[field]
                                                    :
                                                        tmp || item_loop
                                                );
                                            }
                                        }
                                    }
                                }
                                else{

                                    if(map_to_view && map_to_view[key]){

                                        //template_data[i] = map_to_view[key](item_loop[key], item_loop);
                                        mapped_value = map_to_view[key](item_loop[key], item_loop);
                                        map_to_view_cache[key] = mapped_value;
                                    }
                                    else if(key === 'item'){

                                        mapped_value = item_loop;
                                    }
                                    //else template_data[i] = item_loop[key];
                                    else{

                                        mapped_value = item_loop[key];
                                    }
                                }

                                template_html += mapped_value;

                                if(i + 1 < template_data.length) template_html += template_data[i + 1];

                                if(DEBUG) APP.STATS.count_mapper++;
                            }
                        }

                        if(!view_loop || item_loop){

                            // TODO: concat as string
                            //html += template_data.join(''); //template_html;
                            html += template_html; //template_html;
                        }

                        //APP.STATS.count_mapper++;
                    }
                }
            }
        }

        if(DEBUG){

            APP.STATS.time_render += CORE.time.now() - debug_time;
        }

        return html;
    }

    /**
     * @param view
     * @param data
     */

    CONTROLLER.build = function build(view, data){

        return buildTemplate(view, data);
    };

    /**
     * @param {_view_model|string} _target
     * @param {Array<_pattern_struct>=} _data
     * @const
     */

    CONTROLLER.render = function render(_target, _data){

        var target = _target;
        var data = _data;
        var dest;

        APP.LAYOUT.remove_preloader(target);

        if(data){

            dest = CORE.getById(/** @type {string} */ (target));

            CORE.removeNodes(dest);
            CORE.buildPattern(data, dest);

            if(DEBUG) APP.STATS.count_render++;
        }
        else if(target.data){

            // if(target.data.constructor !== Array) target.data = [target.data];

            dest = (

                typeof target.target === 'string' ?

                    CORE.getById(target.target)
                :
                    target.target
            );

            if(!dest){

                if(DEBUG) CORE.console.warn("Element not found: " + target.target);

                return;
            }

            var is_array_data = target.data.constructor === Array;

            var template = (

                (is_array_data && target.data.length) || (!is_array_data && target.data) ?

                    buildTemplate(target.view, target.data)
                :
                    target.default ? (

                        target.default.view ?

                            buildTemplate(target.default.view, target.default.data)
                        :
                            buildTemplate(/** @type {string} */ (target.default))
                    ):
                        ''
            );

            if(DEBUG){

                if(dest['_html'] === template){

                    APP.STATS.count_render_cache++;
                    CORE.console.log("HTML Content Cached: " + dest.id);
                }
                else{

                    APP.STATS.count_render++;
                    CORE.console.log("HTML Content Updated: " + dest.id);
                }
            }

            CORE.setHTML(dest, template, function render_callback(){

                if(target.callback){

                    if(CORE.isType(target.callback, 'string')){

                        APP.HANDLER[target.callback].call(dest, target.data);
                    }
                    else{

                        target.callback.call(dest, target.data);
                    }
                }
            });
        }
    };

    /**
     * @param {string=} lang
     */

    CONTROLLER.changeLanguage = function(lang){

        var nodes = CORE.getByClass('i18n');

        for(var i = 0; i < nodes.length; i++){

            var node = nodes[i];

            CORE.setTextContent(node, (APP.LANG[lang || 'en'] || APP.LANG['en'])[

                node.classList ?

                    node.classList[1]
                :
                    node.className.split(' ')[1]
            ]);
        }
    };

})(
    /** @type {_controller_struct} */
   (APP.CONTROLLER),
    APP.ROUTE
);