(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{166:function(t,s,a){t.exports=a.p+"assets/img/spinner.b2a230e3.png"},169:function(t,s,a){"use strict";a.r(s);var n=[function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"content"},[n("h1",{attrs:{id:"loading-state"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#loading-state","aria-hidden":"true"}},[t._v("#")]),t._v(" Loading State")]),t._v(" "),n("p",[t._v("Sometimes, you may want know if a service or flow is running. If so, you may display a loading spinner on your web page:")]),t._v(" "),n("p",[n("img",{attrs:{src:a(166),alt:""}})]),t._v(" "),n("p",[t._v("In reobservable, there is a built-in sub-state called "),n("code",[t._v("loading")]),t._v(" in the root state:")]),t._v(" "),n("div",{staticClass:"language-ts extra-class"},[n("pre",{pre:!0,attrs:{class:"language-ts"}},[n("code",[n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  loading"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    services"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      fetchUser"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    flows"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{attrs:{class:"token string"}},[t._v("'user/fetch'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("As you can see, there are two type of loading state in reobservable.")]),t._v(" "),n("h2",{attrs:{id:"service-loading"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#service-loading","aria-hidden":"true"}},[t._v("#")]),t._v(" Service Loading")]),t._v(" "),n("p",[t._v("Service loading indicates if a service is running. You call a service inside a flow like:")]),t._v(" "),n("div",{staticClass:"language-ts extra-class"},[n("pre",{pre:!0,attrs:{class:"language-ts"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" model "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  name"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'user'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{attrs:{class:"token comment"}},[t._v("// ....")]),t._v("\n  flows"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token function"}},[t._v("fetch")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("flow$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" action$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" payload$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" dependencies"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" api "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" dependencies"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("services\n      \n      "),n("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" flow$"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("pipe")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n        "),n("span",{attrs:{class:"token function"}},[t._v("switchMap")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("action "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("success$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" error$"),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("api")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n            "),n("span",{attrs:{class:"token comment"}},[t._v("// service name")]),t._v("\n            "),n("span",{attrs:{class:"token string"}},[t._v("'fetchUser'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            service"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("fetchUser")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("params"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n          "),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n          "),n("span",{attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("Because we named the service "),n("code",[t._v("fetchUser")]),t._v(", then we can access it by:")]),t._v(" "),n("div",{staticClass:"language-ts extra-class"},[n("pre",{pre:!0,attrs:{class:"language-ts"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{attrs:{class:"token function-variable function"}},[t._v("mapStateToProps")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("state"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" IState"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" isUserFetching "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" state"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("loading"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("services"),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),n("span",{attrs:{class:"token string"}},[t._v("'fetchUser'")]),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("h2",{attrs:{id:"flow-loading"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#flow-loading","aria-hidden":"true"}},[t._v("#")]),t._v(" Flow Loading")]),t._v(" "),n("p",[t._v("Flow loading indicates if a flow is running. But in order to tell reobservable if a flow should be considered complete, you should use "),n("code",[t._v("end")]),t._v(" or "),n("code",[t._v("endTo")]),t._v(" operator to emit an end action:")]),t._v(" "),n("div",{staticClass:"language-ts extra-class"},[n("pre",{pre:!0,attrs:{class:"language-ts"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" end "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'@reobservable/core'")]),t._v("\n\n"),n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" model "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  name"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'user'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{attrs:{class:"token comment"}},[t._v("// ....")]),t._v("\n  flows"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token function"}},[t._v("changeName")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("flow$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" action$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" payload$"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" dependencies"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" flow$"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("pipe")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n        "),n("span",{attrs:{class:"token function"}},[t._v("end")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("action "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),n("span",{attrs:{class:"token keyword"}},[t._v("type")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'user/changeName'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n          payload"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            name"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" action"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("payload"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name\n          "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("Then, you can access it by:")]),t._v(" "),n("div",{staticClass:"language-ts extra-class"},[n("pre",{pre:!0,attrs:{class:"language-ts"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{attrs:{class:"token function-variable function"}},[t._v("mapStateToProps")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("state"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" IState"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" isNameChanging "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" state"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("loading"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("flows"),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),n("span",{attrs:{class:"token string"}},[t._v("'user/changeName'")]),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])])}],o=a(0),e=Object(o.a)({},function(){this.$createElement;this._self._c;return this._m(0)},n,!1,null,null,null);e.options.__file="loading-state.md";s.default=e.exports}}]);