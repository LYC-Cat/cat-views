import axios from  'axios'
import { ElMessage } from 'element-plus'

const service=axios.create({
    baseURL:'http://localhost:8080',
    timeout:5000,
    headers:{
        'Content-Type':'application/json'
    }
})
//request
service.interceptors.request.use(
    config=>{
        return config
    }
)
//response
service.interceptors.response.use(
    response=>{
        return response.data
    },
    error=>{
        ElMessage.error((error.response?.data?.msg ||'请求失败'))
        return Promise.reject(error)
    }
)
export default  service
