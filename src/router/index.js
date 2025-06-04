import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";
import UserList  from "@/components/Detail/UserList.vue";
import MemberService from "@/components/Detail/MemberService.vue";
import Members from "@/components/Detail/Members.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/login",
      name:"login",
      component: Login
    },
    {
      path:'/',
      name:"home",
      component:Home,
      redirect:"/userlist",
      children:[
        {
          path:'members',
          name:"members",
          component:Members
        },
        {
          path:'userlist',
          name:"userlist",
          component:UserList
        },
        {
          path:"member-service",
          name:"member-service",
          component:MemberService,
        }
      ]

    }
  ],
})

export default router
