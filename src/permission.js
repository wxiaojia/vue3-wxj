import router from './router/router.js'
import { useUserStore } from '@/store/user.js'
import { usePermissionStore } from '@/store/permission.js'


//路由拦截
router.beforeEach(async(to,from,next)=>{
    // import { getStorage } from 'utils/common/useStorage.js'
    const store = useUserStore()
    const permissionStore = usePermissionStore()

    //1、是否是登录页
    if(to.path=='/login'){
        next();
    }else {
        //正常登录
        let roles = store && store.roles
        if (roles && roles.length === 0) {
            roles = JSON.parse(sessionStorage.getItem('UERRINFO'))?.roles
        }
        console.log(roles)
        if(roles){
            var filterRoutes = await permissionStore.GENERATEROUTES(roles);
            //动态添加
            router.addRoute(filterRoutes);
            next()
        }else {
            next({path:'/login'});
        }
    }
})

