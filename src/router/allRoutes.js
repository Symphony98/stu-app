const allRoutes = [
    {
        path: "Welcome",
        name: "Welcome",
        component: () => import(/* webpuckChunkName:"Welcome" */ "../pages/Home/Welcome"),
        meta: {
            name: "管理首页",
            icon: "#icon-icon_huabanfuben"
        }
    },
    {
        path: "StudentManager",
        name: "StudentManager",
        redirect: "/StudentManager/studentProduct",
        component: () => import(/* webpuckChunkName:"StudentManager" */ "../pages/Home/StudentManager"),
        meta: {
            name: "学员管理",
            icon: "#icon-yonghuguanli"
        },
        children: [
            {
                path: "studentProduct",
                name: "studentProduct",
                component: () => import(/* webpuckChunkName:"studentProduct" */ "../pages/Home/StudentManager/StudentProduct"),
                meta: {
                    name: "学员项目管理",
                    icon: "#icon-xiangmuguanli"
                }
            },
            {
                path: "studentProfile",
                name: "studentProfile",
                component: () => import(/* webpuckChunkName:"studentProfile" */ "../pages/Home/StudentManager/StudentProfile"),
                meta: {
                    name: "学员资料",
                    icon: "#icon-gerenziliao"
                }
            },
            {
                path: "studentDormitory",
                name: "studentDormitory",
                component: () => import(/* webpuckChunkName:"studentDormitory" */ "../pages/Home/StudentManager/StudentDormitory"),
                meta: {
                    name: "学员宿舍",
                    icon: "#icon-sushe1"
                }
            },
        ]
    },
    {
        path: "Attendance",
        name: "Attendance",
        component: () => import(/* webpuckChunkName:"Attendance" */ "../pages/Home/Attendance"),
        meta: {
            name: "考勤管理",
            icon: "#icon-kaoqinguanli1"
        }
    },
    {
        path: 'Users',
        name: 'Users',
        component: () => import(/* webpuckChunkName:"Users" */ "../pages/Home/Users"),
        meta: {
            name: '用户管理',
            icon: '#icon-yonghuguanli1'
        }
    },
    {
        path: 'Statistics',
        name: 'Statistics',
        component: () => import(/* webpuckChunkName:"Statistics" */ "../pages/Home/Statistics"),
        meta: {
            name: '数据统计',
            icon: '#icon-shujutongji'
        }
    },
    {
        path: "Mine",
        name: "Mine",
        component: () => import(/* webpuckChunkName:"Mine" */ "../pages/Home/Mine"),
        meta: {
            name: "我的中心",
            icon: "#icon-gerenzhongxin"
        }
    },
]

export default allRoutes