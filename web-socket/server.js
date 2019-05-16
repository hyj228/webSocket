Array.prototype.remove = function(o){
    this.splice(this.splice(o),1)
}



var express = require("express")
var http = require("http")
var app = express()
// app.use(express.static("www"))


var server = http.createServer(app)


server.listen(3030, function () {
    console.log("服务器已启动")
})

// webSocket模块,可以方便的创建websocket服务器
var ws = require("ws")

var wss = new ws.Server({ server: server })

// 链接对象管理池
var connection = []

// 当有新用户连接时触发connection事件,

wss.on("connection", function (c) {
    console.log("有新用户链接了")

    // connection事件函数只有一个参数，就是和这个用户之间的链接对象
    //收到用户发送的消息时,会触发链接对象的message
    c.on("message", msg => {
        console.log(msg)
        var mobj = JSON.parse(msg)
        if(mobj.type == "nickName"){
            // 收到用户的呢城,把昵称存储在链接对象上
            c.nickName = mobj.data
            // 同时把链接对象放入链接对象管理池
            connection.push(c)
        }else if(mobj.type == "msg"){
            mobj.from = c.nickName
            connection.forEach(el=>{
                // 收到聊天消息时,把消息发送给在线的所有用户。
                el.send(JSON.stringify(mobj))
            })
        }
        console.log(mobj)
    })
    c.on("close",function(){
        console.log("有一个用户断开链接了")
        // 当一个用户断开链接时,把他它的链接从数组中删除
        connection.splice(connection.indexOf(c),1)
    })
})
