(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scrips/scene/SettleScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6da2ezZXU9Aa7xKqdkRjnvC', 'SettleScene', __filename);
// scrips/scene/SettleScene.js

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
var Question = require("Question");
cc.Class({
    extends: cc.Component,

    properties: {
        btn_continue: cc.Node,
        btn_exit: cc.Node,
        lbl_paiming_info: cc.Label,
        lbl_dati_info: cc.Label
    },

    start: function start() {
        this.lbl_paiming_info.string = _G.QuestionClass.paiming + "/" + _G.QuestionClass.all_match_player;
        if (_G.QuestionClass.paiming == 1) {
            this.lbl_dati_info.string = _G.QuestionClass.myQustion.length + "道";
        } else {
            this.lbl_dati_info.string = _G.QuestionClass.myQustion.length - 1 + "道";
        }
        this.btn_continue.on(cc.Node.EventType.TOUCH_START, this.continueClickEvent, this);
        this.btn_exit.on(cc.Node.EventType.TOUCH_START, this.exitClickEvent, this);
    },

    //点击继续按钮
    continueClickEvent: function continueClickEvent() {
        cc.director.loadScene("AnswerScene");
    },
    exitClickEvent: function exitClickEvent() {
        cc.director.loadScene("MainScene");
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=SettleScene.js.map
        