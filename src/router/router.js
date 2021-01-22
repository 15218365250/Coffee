const otherChhild = [
    {
        path:'/main',
        alias:'/',
        props: true,
        component:()=>import('../views/Main')
    },
    {
        path:'/overderForm',
        name:'OverderForm',
        props: true,
        component:()=>import('../views/OverderForm'),
    },
    {
        path:'/shopCat',
        name:'ShopCat',
        props: true,
        component:()=>import('../views/ShopCat'),   
    },
    {
        path:'/myself',
        name:'Myself',
        props: true,
        component:()=>import('../views/Myself')
    },
]

export const routes = [ 
    {
        path:'/',
        name:'Login',
        component:()=>import('../views/Login')
    },
    {
        path: '/home',
        name: 'Home',
        component: ()=>import('../views/Home'),
        children: otherChhild,
    },
    {
        path:'/delivery',
        name:'Delivery',
        component:()=>import('../views/Delivery'),
    },
    {
        path:'/address/:aid?',
        props: true,
        name:'Address',
        component:()=>import('../views/Address')
    }
   
]