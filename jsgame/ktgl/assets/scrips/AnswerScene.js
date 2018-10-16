// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Player = require('Player')
var GameState = cc.Enum({
    PIPEI: 1,
    READY: 2,
    ANSWER: 3,
    JUDGE: 4,
    REVIVE: 5,
    END: 6
}); 
var side_player_max_num = 30;

cc.Class({
    extends: cc.Component,

    properties: {
        // player:Player,
        btn_right:cc.Node,
        btn_wrong:cc.Node,
        lbl_question_info:cc.Label,
        lbl_question_title:cc.Label,
        lbl_score:cc.Label,

        Panel_middle:cc.Node,
    },

    onLoad(){
        this.lbl_question_info.string = "匹配中";
        this.lbl_question_title.string = "10";
        //匹配中 准备进人
        this.gameState = GameState.PIPEI;
        this.Pipei_time = 10;
        this.initPlayer()

    },
    //初始化玩家终点位置
    initPlayer:function(){
        _G.AnswerScene = this
        //初始化 玩家所有的位置
        this.player_pos_left = new Array();
        this.player_pos_right = new Array();
        for (var i = 0; i <side_player_max_num; i++) {
            this.player_pos_left[i] = cc.p(100+i%3*100,400+Math.floor(i/3)*60) //位置上下会挤一些
        }
        for (var i = 0; i < side_player_max_num; i++) {
            this.player_pos_right[i] = cc.p(450+i%3*100,400+Math.floor(i/3)*60)
        }
        //左边和右边的人数 初始化都是0
        this.left_player_num = 0;
        this.right_player_num = 0;
        //提前定好 这局会有多少人参加
        this.match_player_num = 45+Math.random(10);
        this.dead_times = 0;
        //初始化真正参与游戏的人们
        this.player_pos_left_node = new Array()
        this.player_pos_right_node = new Array()

        // var PlayerClass = new Player()
        // this.nodes = PlayerClass.init(this.match_player_num)

        for (var i = 0;i<this.match_player_num;i++)
        {
            // var node = this.nodes[i]
            var PlayerClass = new Player()
            var node = PlayerClass.init(i)
            if(this.left_player_num>=side_player_max_num || this.right_player_num>=side_player_max_num)
            {
                this.match_player_num = i;
                break;
            }
            if(PlayerClass.side == Player.Side.left)
            {
                this.player_pos_left_node[this.left_player_num] = node;
                this.Panel_middle.addChild(node);
                // node.x = this.player_pos_left[this.left_player_num].x
                // node.y = this.player_pos_left[this.left_player_num].y
                node.setPosition(this.player_pos_left[this.left_player_num])
                this.left_player_num++;
            }
            else if(PlayerClass.side == Player.Side.right){
                this.player_pos_right_node[this.right_player_num] = node;
                this.Panel_middle.addChild(node);
                // node.x = this.player_pos_right[this.right_player_num].x
                // node.y = this.player_pos_right[this.right_player_num].y
                node.setPosition(this.player_pos_right[this.right_player_num])
                this.right_player_num++;
            }
        }
    },
    update(dt)
    {
        if(this.gameState == GameState.END)
            return
        switch(this.gameState)
        {
            case GameState.PIPEI:

            case GameState.READY:
            case GameState.BEGIN:
            case GameState.REVIVE:
                this.dead_times++;
                break
            case GameState.JUDGE:
                if(this.match_player_num==1 || this.dead_times>=3)
                    this.gameState = GameState.END
                    //弹出结算界面
                break
            case GameState.END:
                return
        }
    },
});
