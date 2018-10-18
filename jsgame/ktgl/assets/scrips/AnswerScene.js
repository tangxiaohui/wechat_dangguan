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
var Question = require('Question')
var GameState = cc.Enum({
    PIPEI: 1,
    ANSWER: 2,
    JUDGE: 3,
    REVIVE: 4,
    END: 5
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
        
        //匹配中 准备进人
        this.gameState = GameState.PIPEI;
        // this.isBeginPipei = false;
        //初始化答题 题库相关
        this.QuestionClass = new Question();
        this.QuestionClass.init();

        this.initUI();
        //其实 应该两个类 一个是player 一个是一群玩家的类 简单点写了
        this.initPlayer();

        this.judgement = null;
        this.dead_times = 0;
        //匹配倒计时 10秒 TODO
        this.Pipei_time = 4; ///改为0跳过匹配阶段 
        //答题时间
        this.Answer_time = 5; 
        //我自己的位置
        this.MyIndex =1;

    },
    initUI:function(){
        this.lbl_question_info.string = "匹配中";
        this.lbl_question_title.string = "10";
        this.btn_right.active = false;
        this.btn_wrong.active = false;
        this.btn_right.on(cc.Node.EventType.TOUCH_START,this.rightClickEvent,this);
        this.btn_wrong.on(cc.Node.EventType.TOUCH_START,this.wrongClickEvent,this)
    },
    //初始化玩家终点位置
    initPlayer:function(){
        _G.AnswerScene = this
        //初始化 玩家所有的位置
        this.player_pos_left = new Array();
        this.player_pos_right = new Array();
        for (var i = 0; i <side_player_max_num; i++) {
            this.player_pos_left[i] = cc.v2(100+i%3*100,400+Math.floor(i/3)*60) //位置上下会挤一些
        }
        for (var i = 0; i < side_player_max_num; i++) {
            this.player_pos_right[i] = cc.v2(450+i%3*100,400+Math.floor(i/3)*60)
        }
        //左边和右边的人数 初始化都是0
        this.left_player_num = 0;
        this.right_player_num = 0;
        //提前定好 这局会有多少人参加
        this.match_player_num = 45+Math.random(10);
        //初始化真正参与游戏的人们
        this.player_pos_left_node = new Array()
        this.player_pos_right_node = new Array()

        // var PlayerClass = new Player()
        // this.nodes = PlayerClass.init(this.match_player_num)

        for (var i = 0;i<this.match_player_num;i++)
        {
            // var node = this.nodes[i]
            var PlayerClass = new Player()
            PlayerClass.init(i)
            if(this.left_player_num>=side_player_max_num || this.right_player_num>=side_player_max_num)
            {
                this.match_player_num = i;
                break;
            }
            if(PlayerClass.side == Player.Side.left)
            {
                this.player_pos_left_node[this.left_player_num] = PlayerClass.player;
                this.Panel_middle.addChild(PlayerClass.player);
                // PlayerClass.player.setPosition(this.player_pos_left[PlayerClass.player.index]) //目标位置
                this.left_player_num++;
            }
            else if(PlayerClass.side == Player.Side.right){
                this.player_pos_right_node[this.right_player_num] = PlayerClass.player;
                this.Panel_middle.addChild(PlayerClass.player);
                // PlayerClass.player.setPosition(this.player_pos_right[PlayerClass.player.index]) //目标位置
                this.right_player_num++;
            }
            //初始化这些node的位置
            var random = Math.random() >0.5 && Player.Side.left || Player.Side.right;
            if (random == Player.Side.left){
                PlayerClass.player.setPosition(cc.v2(-200,1400));
            }
            else{
                PlayerClass.player.setPosition(cc.v2(820,1400));
            }
        }
        //随机出来 我自己是哪个index
        this.MyIndex = Math.floor(Math.random()*this.match_player_num)
        // this.isBeginPipei = true;
        this.BeginGameStatePIPEI();
    },
    //匹配阶段开始播放人物移动动画
    BeginGameStatePIPEI:function()
    {
        this.move_time = 0.3;
        //移动人物 分阶段的跑路
        var left_needToRunPlayer = 0;
        var right_needToRunPlayer = 0;
        this.callback = function() {
            if(this.Pipei_time == 0 )
            {
                this.unschedule(this.callback);
                // this.isBeginPipei = false;
                this.gameState = GameState.BEGIN;
                //开始答题阶段
                this.BeginGameStateBEGIN();
            }
            this.lbl_question_title.string = (this.Pipei_time);
            if(this.Pipei_time == 3)//最后一秒 所有人都跑路
            {
                //剩余的人 这里在跑路一波
                var last_left_player_num = this.left_player_num - left_needToRunPlayer;
                for (var i = 0; i <last_left_player_num; i++) {
                    var moveAction = cc.moveTo(this.move_time,this.player_pos_left[left_needToRunPlayer+i]);
                    var delaytime = cc.delayTime(Math.random());
                    this.player_pos_left_node[left_needToRunPlayer+i].runAction(cc.sequence(delaytime,moveAction )) ;
                }
                var last_right_player_num = this.right_player_num - right_needToRunPlayer;
                for (var i = 0; i <last_right_player_num; i++) {
                    var moveAction = cc.moveTo(this.move_time,this.player_pos_right[right_needToRunPlayer+i]);
                    var delaytime = cc.delayTime(Math.random());
                    this.player_pos_right_node[right_needToRunPlayer+i].runAction(cc.sequence(delaytime,moveAction )) ;
                }
                // this.isBeginPipei = false
            }
            else{
                //当前这一秒左边多少人跑路
                var secendToRunPlayer = (this.Pipei_time -3 )/((this.Pipei_time-2)*this.Pipei_time/2) * this.left_player_num;
                for (var i = 0; i <Math.floor(secendToRunPlayer); i++) {
                    var moveAction = cc.moveTo(this.move_time,this.player_pos_left[left_needToRunPlayer+i]);
                    var delaytime = cc.delayTime(Math.random());
                    this.player_pos_left_node[left_needToRunPlayer+i].runAction(cc.sequence(delaytime,moveAction )) ;
                }
                left_needToRunPlayer = left_needToRunPlayer+Math.floor(secendToRunPlayer);
                //当前这一秒右边多少人跑路
                var secendToRunPlayer =  (this.Pipei_time -3 )/((this.Pipei_time-2)*this.Pipei_time/2) * this.right_player_num;
                for (var i = 0; i <Math.floor(secendToRunPlayer); i++) {
                    var moveAction = cc.moveTo(this.move_time,this.player_pos_right[right_needToRunPlayer+i]);
                    var delaytime = cc.delayTime(Math.random());
                    this.player_pos_right_node[right_needToRunPlayer+i].runAction(cc.sequence(delaytime,moveAction )) ;
                }
                right_needToRunPlayer = right_needToRunPlayer+Math.floor(secendToRunPlayer);
            }
            this.Pipei_time--;
         };

        this.schedule(this.callback,1);
    },
    //开始答题阶段
    BeginGameStateBEGIN:function()
    {   
        this.btn_wrong.active = true;
        this.btn_right.active = true;
        //
        var Answer_time = this.Answer_time;
        //随机出一个题目
        var questioninfo = this.QuestionClass.findQuestion();
        this.lbl_question_title.string = Answer_time;

        this.lbl_question_info.string = questioninfo.question;
        this.Answer_info = questioninfo.answer;
        this.QuestionCallback = function(){
            if (Answer_time ==0)
            {
                this.unschedule(this.QuestionCallback)
                this.gameState = GameState.JUDGE;
                //进入判题阶段
                this.BeginGameStateJUDGE();
            }
            this.lbl_question_title.string = Answer_time;
            Answer_time--;
        }
        this.schedule(this.QuestionCallback,1);
    },
    BeginGameStateJUDGE:function(){
        this.btn_wrong.active = false;
        this.btn_right.active = false;
        this.judgeCallback = function(){
            //TODO 这里播放判断题目正确与否的动画,动画播放完成执行回调，走下面的
            this.unschedule(this.judgeCallback);
            if(this.judgement == this.Answer_info)
            {
                //正确
                if(this.match_player_num == 1)
                {
                    cc.log("吃鸡了！！！")
                    //TODO 弹出吃鸡的结算界面
                    this.gameState = GameState.END
                }
                else
                {
                    cc.log("答对了，还有多少人，继续答题吧")
                    //开始下一道提
                    this.BeginGameStateBEGIN();
                }
            }
            else
            {
                this.dead_times++
                if(this.dead_times>=3)
                {
                    cc.log("错误次数太多了，结束！")
                    this.gameState = GameState.END;
                    //TODO 弹出结算界面

                }
                else
                {
                    cc.log("打错了，复活吧")
                    //弹出是否复活的界面 --玩家复活看广告，成功看完回调，继续beigin答题，未看完则还是继续复活，复活倒计时结束，也结束答题，弹出界面界面
                }
            }
        }
        this.schedule(this.judgeCallback,1,1);
    },
    //正确的点击
    rightClickEvent:function(){
        //自己的主角往左移动
        player
        this.judgement = "对";

    },
    //错误的点击
    wrongClickEvent:function(){
        //自己的主要向右移动
        this.judgement = "错";
    },
    // update(dt)
    // {
    //     if(this.gameState == GameState.END)
    //         return
    //     switch(this.gameState)
    //     {
    //     }
    // },
});
