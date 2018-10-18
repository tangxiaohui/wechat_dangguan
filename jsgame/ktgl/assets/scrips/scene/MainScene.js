// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        console.log("开始游戏哦！");
        let self = this;
        console.log("click __onClickLogin ");
        // var xhr = new XMLHttpRequest();
        //  xhr.onreadystatechange = function () {
        //      if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        //          var response = xhr.responseText;
        //          console.log(response);
        //      }
         // };
         // xhr.open("GET", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8888888888888888&redirect_uri=http://mascot.duapp.com/oauth2.php&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect", true);
         // xhr.send();
    },

    // update (dt) {},
});
