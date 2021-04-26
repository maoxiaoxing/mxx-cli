export interface Error {
  errorStatus: number | string
  errorMessage: string
}

export interface Options {
  method?: string
  url: string
  header?: any
  queryParams?: object
  data?: any
}

interface ResponceData {
  result?: boolean
  status?: number | string
  statusCode: number | string
}
export interface Responce {
  data: ResponceData
}
