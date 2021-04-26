import {httpService} from '@ld/techpub-fe-share'
import {Message} from 'element-ui'
interface ErrorInfo {
  errorCode: number
  errorMessage: string
}

let exportsModule: any = ''

const httpOptions: any = {
  httpErrorCallback(error: ErrorInfo) {
    Message({type: 'error', message: error.errorMessage})
  },
  needLoginCallback() {
    window.console.log('login')
  }
}

if (process.env.NODE_ENV === 'development') {
  // 如果是开发环境，则用handleResponse空函数来覆盖默认处理，不对返回做任何处理
  exportsModule = httpService({
    ...httpOptions,
    handleResponse(
      options: any,
      response: any,
      resolve: any,
      reject: any
    ) {
      return resolve(response)
    }
  })
} else {
  // 如果是线上环境，使用默认的返回处理包装
  exportsModule = httpService(httpOptions)
}

export default exportsModule
