/* CLOSURE COMPILER LOCAL FALLBACK */

window.goog || (function(modules){

    window.goog = {

        provide: function(a){

            modules[a] = true;
        },
        require: function(a){

            modules[a] || (DEBUG && CORE.console.warn('WARNING: Dependency is missing: ' + a));
        },
        scope: function(fn){

            fn.call(window);
        },
        exportSymbol: function(a, b){},
        exportProperty: function(a, b){}
    };

})({});