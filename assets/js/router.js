/*!
  * RouterJS v1.2.0 (https://wwwinterart.com/)
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

    return {
        routes: [],
        history: [],
        urlParams: {},
        getFragment: function () {
            console.log('===getFragment===');
            var r;
            if(window.location.hash != "")
                r = window.location.hash.replace(/\/$/, '');
            else
                r = window.location.search.replace(/\/$/, '');
            console.log('>>r: ', r);
            return r;
        },
        add: function (route, handler) {
            console.log('===add===');
            console.log('route: : ', route);
            if (typeof route == 'function') {
                handler = route;
                route = '';
            }
            this.routes.push({
                handler: handler,
                route: route
            });
            return this;
        },
        apply: function (frg) {
            console.log('===apply===');
            console.log('frg: : ', frg);

            var fragment = frg || this.getFragment();
            console.log('fragment: : ', fragment);
            for (var i = 0; i < this.routes.length; i++) {
                //console.log('>>for-loop');
                //console.log('routes[i].route: ', this.routes[i].route);
                var matches = fragment.match(this.routes[i].route);
                console.log('matches: ', matches);
                if (matches) {
                    //matches.shift(); //remove the matched string
                    this.parseUrl(matches);    //parse url parameters
                    //console.log('matches shift: ', matches);
                    if (!self.history[fragment]) {
                        this.history.push(fragment);
                    }
                    //console.log('before this.routes[i]: ', this.routes[i].handler);
                    this.routes[i].handler.apply({}, [matches]); //pass parameter as array
                    //this.routes[i].handler.apply({matches});  //pass parameter as string
                    //console.log('after this.routes[i]: ', this.routes[i].handler);
                    return this;
                }
            }

            return this;
        },
        start: function () {
            console.log('===start===');
            
            var self = this;
            var current = self.getFragment();
            console.log('>>current: ', current);
            window.onhashchange = function () {
                console.log('>>onhashchange');
                if (current !== self.getFragment()) {
                    current = self.getFragment();
                    self.apply(current);
                    console.log('>>self.apply(current): ', current);
                }
            }
            return this;
        },
        navigate: function (path, title) {
            console.log('===navigate===');
            document.title = title || document.title;
            path = path ? path : '';
            path = path.replace(/##/g, '#') || '';
            
            //path = path.replace('?', '#') || '';
            console.log('path: ', path);
            window.location.hash = path ? '#' + path : '';
            return this;
        },
        clearHash: function () {
            console.log('===clearHash===');
            window.location.hash = '#';
            history.pushState(null, document.title, window.location.pathname + window.location.search);
        },
        back: function () {
            console.log('===back===');
            this.history.pop();
            var path = this.history.pop();
            path = path || '';
            window.location.hash = path;
            return this;
        },
        checkFragment: function (current) {
            console.log('===checkFragment===');
            console.log('current: ', current);
            return this.getFragment().indexOf(current) >= 0;
        },
        parseUrl: function (url_) {
            console.log('===parseUrl===');
            var url = url_ ? url_ : window.location.hash.slice(1);
            
            var tmp;
            //turn array into string with first hashtag (before slash) as "page"-key
            if (Array.isArray(url)) {
                if (url[0].includes('/')) {
                    tmp = url[0].split('/');
                    url = 'page='+tmp[0];

                    url+= '&'+tmp[1];
               } else {
                    //we have only a string without parameters, return it with the page name
                    return this.urlParams =  {'page': url[0]};
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
    }
});