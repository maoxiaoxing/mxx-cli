### 项目启动(需node版本8.9.0以上)：

1. 安装npm包
```
npm install
```
2. 启动:本地开启服务
```
* npm run serve -dev 使用config的dev.js配置
* npm run serve -rel 使用config的rel.js配置
* npm run serve -online 使用config的online.js配置
```

3. 生成dist包
```
* npm run build -dev 使用config的dev.js配置
* npm run build -rel 使用config的rel.js配置
* npm run build -rel 使用config的online.js配置
```

4. 最后帮助指南：这可能是你开始的第一个项目，如果你不知道怎么写，可以参照这个来编写你的模板
   指南参考：https://segmentfault.com/a/1190000011520912（这个指南仍然不太规范，你最好在属性和方法前面加上private或public标识，以正确校验）
   你可能会遇到：https://blog.csdn.net/qq_33699981/article/details/79411846（问题解决参照）

5. 查看你的webpack的配置命令 npm run inspect

6. 修改启动服务的端口：在packege.json 中scripts命令中修改
    Usage: (serve-dev: vue-cli-service serve [options] [entry])
    Options:
      --open    open browser on server start
      --copy    copy url to clipboard on server start
      --mode    specify env mode (default: development)
      --host    specify host (default: 0.0.0.0)
      --port    specify port (default: 8080)
      --https   use https (default: false)