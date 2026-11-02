import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '/api',
  timeout: 30000,
})

apiClient.interceptors.response.use(
  (res) => {
    const body = res.data as { code?: number; message?: string; data?: unknown }
    if (body && typeof body.code === 'number' && body.code !== 0) {
      return Promise.reject(new Error(body.message ?? '请求失败'))
    }
    return res
  },
  (err) => Promise.reject(err),
)
