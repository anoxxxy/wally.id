/*!
  * RouterJS v1.3.0 (https://wwwinterart.com/)
  * Copyright 2018-2019 Silvio Delgado (https://github.com/silviodelgado)
  * Licensed under MIT (https://opensource.org/licenses/MIT)
  * https://github.com/silviodelgado/routerjs
  * Modified by Anoxy anoxydoxy@gmail.com
  * added parseUrl for easy access to the parameters
  * http://site.com#products/param1=val1&param2&val2.....
  */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Router = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    let internal = {
        routes: [],
        history: [],
        urlParams: {},
        run_before: null,
        run_after: null
    };

    const run_before = () => {
        if (typeof internal.run_before == 'function' && internal.run_before) {
            internal.run_before.call(this);
        }
    };

    const run_after = () => {
        if (typeof internal.run_after == 'function' && internal.run_after) {
            internal.run_after.call(this);
        }
    };

    const router = {
        getFragment: () => {
            console.log('===getFragment===');
            var r;
            if(window.location.hash != "")
                r = window.location.hash.replace(/\/$/, '');
            else
                r = window.location.search.replace(/\/$/, '');
            console.log('>>r: ', r);
            return r;

        },
        add: (route, handler) => {
            console.log('===add===');
            console.log('route: : ', route);
            if (typeof route == 'function') {
                handler = route;
                route = '';
            }
            internal.routes.push({
                handler: handler,
                route: route
            });
            return router;
        },
        beforeAll: (handler) => {
            console.log('**beforeAll**');
            internal.run_before = handler;
            return router;
        },
        afterAll: (handler) => {
            console.log('**afterAll**');
            internal.run_after = handler;
            return router;
        },
        apply: (frg) => {
            console.log('===apply===');
            console.log('frg: : ', frg);

            let fragment = frg || router.getFragment();
            console.log('fragment: : ', fragment);
            for (let i = 0; i < internal.routes.length; i++) {
                let matches = fragment.match(internal.routes[i].route);
                console.log('matches: ', matches);
                if (matches) {
                    //matches.shift(); //remove the matched string
                    router.parseUrl(matches);    //parse url parameters
                    if (!internal.history[fragment])
                        internal.history.push(fragment);
                    run_before();
                    //internal.routes[i].handler.apply({}, matches);
                    console.log('internal.routes[i].handler: ', internal.routes[i].handler);
                    
                    internal.routes[i].handler.apply({}, [matches]);  //pass parameter as array, //this.routes[i].handler.apply({}, [matches]); 
                    run_after();
                    return router;
                }
            }

            return router;
        },
        start: () => {
            console.log('===start===');
            let current = router.getFragment();
            console.log('>>current: ', current);
            window.onhashchange = function () {
                if (current !== router.getFragment()) {
                    current = router.getFragment();
                    router.apply(current);
                    console.log('>>self.apply(current): ', current);
                }
            }
            return router;
        },
        navigate: (path, title) => {
            /*document.title = title || document.title;
            path = path.replace(/##/g, '#') || '';
            window.location.hash = path ? '#' + path : '';
            return router;
            */
            console.log('===navigate===');
            document.title = title || document.title;
            path = path ? path : '';
            path = path.replace(/##/g, '#') || '';
            
            //path = path.replace('?', '#') || '';
            console.log('path: ', path);
            window.location.hash = path ? '#' + path : '';
            return this;
        },
        clearHash: () => {
            console.log('===clearHash===');
            window.location.hash = '#';
            history.pushState(null, document.title, window.location.pathname + window.location.search);
        },
        back: () => {
            console.log('===back===');
            internal.history.pop();
            let path = internal.history.pop();
            path = path || '';
            window.location.hash = path;
            return router;
        },
        checkFragment: (current) => {
            console.log('===checkFragment===');
            console.log('current: ', current);
            return router.getFragment().indexOf(current) >= 0;
        },
        parseUrl: function (url_) {
            console.log('===parseUrl===');
            var url = url_ ? url_ : window.location.hash.slice(1);
            
            var tmp;
            //turn array into string with first hashtag (before slash) as "page"-key
            if (Array.isArray(url)) {
                if (url[0].includes('/') || url[0].includes('?')) {
                    
                    if (url[0].includes('/')) {
                        tmp = url[0].split('/');
                        url = 'page='+tmp[0];

                        url+= '&'+tmp[1];
                    }

                    if (url[0].includes('?')) {
                        tmp = url[0].split('?');
                        url = 'page='+tmp[0];

                        url+= '&'+tmp[1];
                    }

                } else {
                    //we have only a string without parameters, return it with the page name
                    return router.urlParams =  {'page': url[0]};
                }


            }

            url = url.trim();

            //remove leading & trailing slash, avoid regex for speed
            var uc = (url.length - 1), i = 0, qs;
            while (url.charCodeAt(i) === 47 && ++i);
            while (url.charCodeAt(uc) === 47 && --uc);
            url = url.slice(i, uc + 1)

            qs = url;

            //split params & values and create object with parameters
            if (url.includes('&'))
                qs = url.substring(url.indexOf('#') + 1).split('&');

            console.log('qs: ', qs);
            //search params
            for(var i = 0, result = {}; i < qs.length; i++){
                qs[i] = qs[i].split('=');

                if (qs[i][0] != '' && qs[i][0] !== undefined)
                    result[qs[i][0]] = (typeof(qs[i][1]) === 'undefined' ? undefined : decodeURIComponent(qs[i][1]) );
            }
            return this.urlParams = result;
        }
    };

    return router;
});