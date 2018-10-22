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
    left:1,
    right:2
});

cc.Class({
    extends: cc.Component,

    properties: {
        _side : null,
        side : {
            get:function(){
                return this._side;
            },
            set:function(value){
                this._side = value;
            },
            type:Side
        },
        player : cc.Node,
        index : null,
        targetindex :null,
    },
    statics:
    {
        Side
    },
    ctor(){
        this.side = null;
        this.index = 0;
        // this.match_players_node = [];
    },
    init:function(index){//maxPlayerNum){
        this.side = Math.random() >0.5 && Side.left || Side.right;
        this.targetside = this.side
        this.isMoving = false
        // this.index = index;
        // this.targetindex = index;
        // for (var i = 1; i < maxPlayerNum; i++) {
            // var node = new cc.Node();
            // var sprite = node.addComponent(cc.Sprite);
            // sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/ic_morenhead0.png'));
        // }
        var node = new cc.Node();
        var sprite = node.addComponent(cc.Sprite);
        if(index == 0)
        {
            sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/ic_morenhead1.png'));
        }
        else{
            sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/ic_morenhead0.png'));
        }
        // var node = new cc.Sprite('resources/ic_morenhead0.png');

        this.player = node;

        // this.player = this.createPlayerAnimation(1,1);

    },

    // //创建人物帧动画
    // createPlayerAnimation:function(animationName, animationTimes){
    //     var animation = this.node.getComponent(cc.Animation);
    //     // frames 这是一个 SpriteFrame 的数组.
    //     var clip = cc.AnimationClip.createWithSpriteFrames("prefabs/player1.anim", 40);
    //     clip.name = "player1";
    //     clip.wrapMode = cc.WrapMode.Loop;

    //     // 添加帧事件
    //     clip.events.push({
    //         frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
    //         func: "frameEvent",     // 回调函数名称
    //         params: [1, "hello"]    // 回调参数
    //     });

    //     animation.addClip(clip);
    //     animation.play('player1');
    //     return animation;
    // },

    // frameEvent:function(a,b){
    //     cc.log(a);
    //     cc.log(b);
    // }

});
