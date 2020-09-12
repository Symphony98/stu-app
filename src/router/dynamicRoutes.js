const dynamicRoutes = [
    {
        path: "/",
        name: "home",
        redirect: "/Welcome",
        component: () => import(/* webpackChunkName:"home" */ "../pages/Home"),
        children: []
    },
    {
        path: "*",
        name: "page404",
        component: () => import(/* webpuckChunkName:"page404" */ "../pages/page404")
    }
]

export default dynamicRoutes