import httpService from './httpService'

export let test = () => {
  httpService.get({
    url: 'http://10.201.81.230:8005/api/HomePage/GetHotQuestions'
  }).then((res: any) => {
    window.console.log(res)
  })
}
