(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scrips/Player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b9dabsv42pKrYq6BTy+4mMJ', 'Player', __filename);
// scrips/Player.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Side = cc.Enum({
    left: 1,
    right: 2
});

cc.Class({
    extends: cc.Component,

    properties: {
        _side: null,
        side: {
            get: function get() {
                return this._side;
            },
            set: function set(value) {
                this._side = value;
            },
            type: Side
        },
        player: cc.Node,
        index: null,
        targetindex: null
    },
    statics: {
        Side: Side
    },
    ctor: function ctor() {
        this.side = null;
        this.index = 0;
        // this.match_players_node = [];
    },

    init: function init(index) {
        //maxPlayerNum){
        this.side = Math.random() > 0.5 && Side.left || Side.right;
        this.targetside = this.side;
        this.isMoving = false;
        // this.index = index;
        this.targetindex = index;
        this.playerFlag = -1;
        //自己的标志 以后可以给其他人也加上标识
        if (index == 0) {
            this.playerFlag = index;
        }
        // for (var i = 1; i < maxPlayerNum; i++) {
        // var node = new cc.Node();
        // var sprite = node.addComponent(cc.Sprite);
        // sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/ic_morenhead0.png'));
        // }
        // var node = new cc.Node();
        // var sprite = node.addComponent(cc.Sprite);
        // if(index == 0)
        // {
        //     // sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/answerscene/ren_1.png'));
        // }
        // else{
        //     // sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/answerscene/ren_2.png'));
        // }
        // var node = new cc.Sprite('resources/ic_morenhead0.png');

        this.player = this.createPlayerAnimation('resources/answerscene/ren_', 2);
    },

    //创建人物帧动画
    createPlayerAnimation: function createPlayerAnimation(animationName, animationTimes) {
        /* 动态添加动画代码示例 */
        var nodeTest = new cc.Node();
        nodeTest.name = 'NodeTest';

        var sprite = nodeTest.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw(animationName + '1.png'));

        nodeTest.parent = this.player;

        var animation = nodeTest.addComponent(cc.Animation);

        /* 添加SpriteFrame到frames数组 */
        // var frames = [];
        // for (var i = 0; i < animationTimes; i++) {
        //     frames[i] = new cc.SpriteFrame(cc.url.raw(animationName + (i+1) + '.png'));
        // };
        // var clip = cc.AnimationClip.createWithSpriteFrames(frames, animationTimes);
        // clip.name = 'anim_kowtow';
        // clip.wrapMode = cc.WrapMode.Loop;

        // /* 添加关键帧事件 */
        // clip.events.push({
        //     frame: 1,                   // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
        //     func: 'frameEvent',         // 回调函数名称
        //     params: [1, 'hello']        // 回调参数
        // });

        cc.loader.loadRes("animation/kowtow", function (err, clip) {
            animation.addClip(clip, "kowtow");
            var animStatus = animation.play('kowtow');
            // animStatus.wrapMode = cc.WrapMode.Loop;
            animStatus.repeatCount = Infinity;
        });

        return nodeTest;
    },

    frameEvent: function frameEvent(a, b) {
        cc.log("磕头磕头磕头磕头磕头磕头磕头磕头磕头");
        cc.log(b);
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
        //# sourceMappingURL=Player.js.map
        