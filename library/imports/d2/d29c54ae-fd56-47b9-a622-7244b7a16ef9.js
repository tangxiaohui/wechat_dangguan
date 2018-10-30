"use strict";
cc._RF.push(module, 'd29c5Su/VZHuaYickS3oW75', 'btn_bottom_center');
// scrips/ui/button/btn_bottom_center.js

"use strict";

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
        button: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;

        // self.button.node.on(cc.Node.EventType.TOUCH_START, function(event){

        // console.log("按钮按下")

        // });

        // self.button.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){

        // console.log("在按钮上滑动")

        // });
    },
    btnClick: function btnClick(event, customEventData) {
        console.log("event=", event.type, " data=", customEventData);
        cc.director.loadScene("AnswerScene");
    },
    start: function start() {
        cc.log("启动按钮");
    }
}

// update (dt) {},
);

cc._RF.pop();