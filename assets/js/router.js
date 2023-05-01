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
            //console.log('===getFragment===');
            var r;
            if(window.location.hash != "")
                r = window.location.hash.replace(/\/$/, '');
            else
                r = window.location.search.replace(/\/$/, '');
            //console.log('>>r: ', r);
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
            //console.log('**beforeAll**');
            internal.run_before = handler;
            return router;
        },
        afterAll: (handler) => {
            //console.log('**afterAll**');
            internal.run_after = handler;
            return router;
        },
        apply: (frg) => {
            console.log('===apply===');
            //console.log('frg: : ', frg);

            let fragment = frg || router.getFragment();
            //console.log('fragment: ', fragment);
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
                    //console.log('internal.routes[i].handler: ', internal.routes[i].handler);
                    
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
            console.log(' ');
            //var url = url_ ? url_ : window.location.hash.slice(1);
            var url = window.location.hash.slice(1);

            url +=  (window.location.search != '' ? window.location.search : '').trim();
            

            console.log('url1 window.location.hash.slice(1): ', window.location.hash.slice(1));
            console.log('url1: ', url);


            //handle path and params
            var qs = '', tmpPath = '', qsPath ='', pathString = '', paramString = '', page = url, paramsList = {}, pathList = {};
            if (url.includes('?')) {
                qsPath = url.split('?');
                tmpPath = qsPath[0];
                qs = qsPath[1];
                paramString = qs;

            }
            //console.log('page1 is:' + page);

            //**Parse Path
            tmpPath = (tmpPath.substr(-1) === '/') ? tmpPath.slice(0, -1) : tmpPath;

            //console.log('tmpPath: '+ tmpPath);


            if (tmpPath != '') {
                //console.log('tmpPath not empty: ', tmpPath);
                
                if (tmpPath.includes('#'))
                    tmpPath = tmpPath.split('#')[1];

                //console.log('tmpPathSplit[1]: '+ tmpPath);

                  //remove trailing slash
                pathString = tmpPath;
                pathList = pathString.split('/');
                //console.log('tmpPath2: ', tmpPath);

                var tmp = tmpPath.split('/');
                //console.log('tmp: ', tmp);
                page = (tmp[0] !== undefined ? tmp[0] : 'home');
            } else {
                //no page is set so far, get it through the url string
                pathString = url;
                pathList = url.split('/');
                page = pathList[0];
            }

            var urlParsed = {};
            //console.log('page2 is:' + page);

            //**Parse Parameters

            if (qs != '') {
              //console.log('qs not empty')
              
              //var qs = url.substring(url.indexOf('?') + 1).split('&');
              var qs = qs.split('&');
              for(var i = 0; i < qs.length; i++){
                qs[i] = qs[i].split('=');
                paramsList[qs[i][0]] = decodeURIComponent(qs[i][1]);
                urlParsed[qs[i][0]] = decodeURIComponent(qs[i][1]);
              }
            }
            //console.log('paramsList: ', paramsList);

            

            

            //console.log('page3 is:' + page);

            urlParsed["_urlString_"] = url;
            urlParsed["_pathString_"] = pathString;
            urlParsed["_path_"] = pathList;
            urlParsed["_paramString_"] = paramString;
            urlParsed["_params_"] = paramsList;
            urlParsed["page"] = page;
            //prepare return variable
            /*
            var urlParsed = {
              "_urlString_": url,  
              "_pathString_": pathString,
              "_paramString_": paramString,
              "_params_": paramsList,
              "_path_": pathList,
              "page": page
            }
            */
            //console.log('urlParsed: ', urlParsed);


            return this.urlParams = urlParsed;
        }
    };

    return router;
});