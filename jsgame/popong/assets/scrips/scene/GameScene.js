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

        panel_root:{
            default: null,
            type: cc.Sprite
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        //动态加载方格
        var self = this;
        cc.loader.loadRes("GameScene/gz_1", cc.SpriteFrame, function(err, sf){
            var scene = cc.director.getScene();
            var node = new cc.Node("Sprite");
            var sp = node.addComponent(cc.Sprite);
            sp.SpriteFrame = sf;
            scene.addChild(node);
            // node.parent = scene;
            node.setPosition(100, 100);
        });
    },

    // update (dt) {},
});
