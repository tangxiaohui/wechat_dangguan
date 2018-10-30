(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scrips/scene/AnswerScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e301fCPMlpIrZvf010wkFXY', 'AnswerScene', __filename);
// scrips/scene/AnswerScene.js

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
var Player = require('Player');
var Question = require('Question');
var GameState = cc.Enum({
    PIPEI: 1,
    ANSWER: 2,
    JUDGE: 3,
    REVIVE: 4,
    END: 5
});
var side_player_max_num = 15;

cc.Class({
    extends: cc.Component,

    properties: {
        // player:Player,
        btn_right: cc.Node,
        btn_wrong: cc.Node,
        lbl_question_info: cc.Label,
        lbl_question_title: cc.Label,
        panel_root: cc.Node,
        //结算界面相关
        panel_revive: cc.Node,
        btn_exit: cc.Node,
        btn_revive: cc.Node,
        lbl_time: cc.Label
    },

    onLoad: function onLoad() {
        //获取控件
        // this.lbl_question_info = cc.find("Canvas/panel_root/img/img_datiban/lbl_question_info");
        // this.lbl_question_title = cc.find("Canvas/panel_root/img/img_datiban/lbl_question_title");
        // this.btn_right = cc.find("Canvas/panel_root/btn/btn_right");
        // this.btn_wrong = cc.find("Canvas/panel_root/btn/btn_wrong");
        this.panel_root = cc.find("Canvas/panel_root");
        //匹配中 准备进人
        this.gameState = GameState.PIPEI;
        // this.isBeginPipei = false;
        //初始化答题 题库相关
        this.judgement = null;

        _G.QuestionClass = new Question();
        _G.QuestionClass.init();

        this.initUI();
        //其实 应该两个类 一个是player 一个是一群玩家的类 简单点写了
        this.MySide = Player.Side.left;
        //主角是否在移动中
        this.myPlayerMoving = false;
        this.initPlayer();
        this.dead_times = 0;
        //匹配倒计时 10秒 TODO
        this.Pipei_time = 4; ///改为0跳过匹配阶段 
        //答题时间
        this.Answer_time = 5;
        //我自己的位置
        this.MyIndex = 0;
        //自己是否在移动
        this.isMoving = false;

        //结算界面相关
        this.reviveTime = 5;
    },

    initUI: function initUI() {
        this.lbl_question_info.string = "匹配中";
        this.lbl_question_title.string = "10";
        this.btn_right.active = false;
        this.btn_wrong.active = false;
        this.btn_right.on(cc.Node.EventType.TOUCH_START, this.rightClickEvent, this);
        this.btn_wrong.on(cc.Node.EventType.TOUCH_START, this.wrongClickEvent, this);
        //复活界面相关
        if (_G.Enable_Ads_Sdk == true) {
            this.btn_exit.on(cc.Node.EventType.TOUCH_START, this.exitviveEvent, this);
            this.btn_revive.on(cc.Node.EventType.TOUCH_START, this.reviveEvent, this);
            this.lbl_time.string = "10";
            this.panel_revive.setLocalZOrder(1000);
        }
    },
    //初始化玩家终点位置
    initPlayer: function initPlayer() {
        _G.AnswerScene = this;
        //初始化 玩家所有的位置
        this.player_pos_left = new Array();
        this.player_pos_right = new Array();
        for (var i = 0; i < side_player_max_num + 6; i++) {
            this.player_pos_left[i] = cc.v2(100 + i % 3 * 100, 400 + Math.floor(i / 3) * 100); //位置上下会挤一些
        }
        for (var i = 0; i < side_player_max_num + 6; i++) {
            this.player_pos_right[i] = cc.v2(450 + i % 3 * 100, 400 + Math.floor(i / 3) * 100);
        }
        //左边和右边的人数 初始化都是0
        this.left_player_num = 0;
        this.right_player_num = 0;
        //提前定好 这局会有多少人参加
        this.match_player_num = 50; //45+Math.random(10);
        //初始化真正参与游戏的人们
        this.player_pos_left_node = new Array();
        this.player_pos_right_node = new Array();

        // var PlayerClass = new Player()
        // this.nodes = PlayerClass.init(this.match_player_num)

        for (var i = 0; i < this.match_player_num; i++) {
            // var node = this.nodes[i]
            var PlayerClass = new Player();
            //TODO 未来优化体验 应该是在场上已经有一波人 之后再飞新的人物进场
            PlayerClass.init(i);
            if (i == 0) {
                this.MySide = PlayerClass.side;
                if (this.MySide == Player.Side.left) this.judgement = "对";else {
                    this.judgement = "错";
                }
            }
            if (this.left_player_num >= side_player_max_num || this.right_player_num >= side_player_max_num) {
                this.match_player_num = i;
                break;
            }
            if (PlayerClass.side == Player.Side.left) {
                this.player_pos_left_node[this.left_player_num] = PlayerClass;
                this.panel_root.addChild(PlayerClass.player);
                PlayerClass.player.setLocalZOrder(1000 - this.left_player_num);
                PlayerClass.index = this.left_player_num;
                PlayerClass.targetindex = this.left_player_num;
                // PlayerClass.player.setPosition(this.player_pos_left[PlayerClass.player.index]) //目标位置
                this.left_player_num++;
            } else if (PlayerClass.side == Player.Side.right) {
                this.player_pos_right_node[this.right_player_num] = PlayerClass;
                this.panel_root.addChild(PlayerClass.player);
                PlayerClass.player.setLocalZOrder(1000 - this.right_player_num);
                PlayerClass.index = this.right_player_num;
                PlayerClass.targetindex = this.right_player_num;
                // PlayerClass.player.setPosition(this.player_pos_right[PlayerClass.player.index]) //目标位置
                this.right_player_num++;
            }
            //初始化这些node的位置
            var random = Math.random() > 0.5 && Player.Side.left || Player.Side.right;
            if (random == Player.Side.left) {
                PlayerClass.player.setPosition(cc.v2(-200, 1400));
            } else {
                PlayerClass.player.setPosition(cc.v2(820, 1400));
            }
        }
        _G.QuestionClass.all_match_player = this.player_pos_left_node.length + this.player_pos_right_node.length;
        // this.isBeginPipei = true;
        this.BeginGameStatePIPEI();
    },
    //匹配阶段开始播放人物移动动画
    BeginGameStatePIPEI: function BeginGameStatePIPEI() {
        this.move_time = 0.3;
        //移动人物 分阶段的跑路
        var left_needToRunPlayer = 0;
        var right_needToRunPlayer = 0;
        this.callback = function () {
            if (this.Pipei_time == 0) {
                this.unschedule(this.callback);
                // this.isBeginPipei = false;
                this.gameState = GameState.BEGIN;
                //开始答题阶段
                this.BeginGameStateBEGIN();
            }
            this.lbl_question_title.string = this.Pipei_time;
            if (this.Pipei_time == 3) //最后一秒 所有人都跑路
                {
                    //剩余的人 这里在跑路一波
                    var last_left_player_num = this.left_player_num - left_needToRunPlayer;
                    for (var i = 0; i < last_left_player_num; i++) {
                        var moveAction = cc.moveTo(this.move_time, this.player_pos_left[left_needToRunPlayer + i]);
                        var delaytime = cc.delayTime(Math.random());
                        this.player_pos_left_node[left_needToRunPlayer + i].player.runAction(cc.sequence(delaytime, moveAction));
                    }
                    var last_right_player_num = this.right_player_num - right_needToRunPlayer;
                    for (var i = 0; i < last_right_player_num; i++) {
                        var moveAction = cc.moveTo(this.move_time, this.player_pos_right[right_needToRunPlayer + i]);
                        var delaytime = cc.delayTime(Math.random());
                        this.player_pos_right_node[right_needToRunPlayer + i].player.runAction(cc.sequence(delaytime, moveAction));
                    }
                    // this.isBeginPipei = false
                } else if (this.Pipei_time < 3 && this.Pipei_time > 0) {} else {
                //当前这一秒左边多少人跑路
                var secendToRunPlayer = (this.Pipei_time - 3) / ((this.Pipei_time - 3) * (this.Pipei_time - 2) / 2) * this.left_player_num;
                for (var i = 0; i < Math.floor(secendToRunPlayer); i++) {
                    var moveAction = cc.moveTo(this.move_time, this.player_pos_left[left_needToRunPlayer + i]);
                    var delaytime = cc.delayTime(Math.random());
                    this.player_pos_left_node[left_needToRunPlayer + i].player.runAction(cc.sequence(delaytime, moveAction));
                }
                left_needToRunPlayer = left_needToRunPlayer + Math.floor(secendToRunPlayer);
                //当前这一秒右边多少人跑路
                var secendToRunPlayer = (this.Pipei_time - 3) / 28 * this.right_player_num;
                for (var i = 0; i < Math.floor(secendToRunPlayer); i++) {
                    var moveAction = cc.moveTo(this.move_time, this.player_pos_right[right_needToRunPlayer + i]);
                    var delaytime = cc.delayTime(Math.random());
                    this.player_pos_right_node[right_needToRunPlayer + i].player.runAction(cc.sequence(delaytime, moveAction));
                }
                right_needToRunPlayer = right_needToRunPlayer + Math.floor(secendToRunPlayer);
            }
            this.Pipei_time--;
        };

        this.schedule(this.callback, 1);
    },
    //开始答题阶段
    BeginGameStateBEGIN: function BeginGameStateBEGIN() {
        this.btn_wrong.active = true;
        this.btn_right.active = true;
        //
        var Answer_time = this.Answer_time;
        //随机出一个题目
        var questioninfo = _G.QuestionClass.findQuestion();
        this.lbl_question_title.string = Answer_time;

        this.lbl_question_info.string = questioninfo.question;
        this.Answer_info = questioninfo.answer;
        this.QuestionCallback = function () {
            if (Answer_time <= this.Answer_time - 1) {
                if (this.myPlayerMoving == false && Answer_time > 1) {
                    this.runOtherPerson();
                }
                if (Answer_time <= 0) {
                    this.unschedule(this.QuestionCallback);
                    this.gameState = GameState.JUDGE;
                    //进入判题阶段
                    this.BeginGameStateJUDGE();
                }
                this.lbl_question_title.string = Answer_time;
                //移动其他答题的人们
                // if ( Math.floor(Answer_time %2) == 1 )
                // {

                // }
            }
            Answer_time--;
        };
        this.schedule(this.QuestionCallback, 1);
    },
    //开始复活
    BeginGameStateREVIVE: function BeginGameStateREVIVE() {
        this.reviveCallBack = function () {
            this.lbl_time.string = this.reviveTime;
            if (this.reviveTime == 0) {
                this.panel_revive.active = false;
                this.BeginGameStateEnd();
                this.unschedule(this.reviveCallBack);
            }
            this.reviveTime--;
        };
        this.schedule(this.reviveCallBack, 1);
    },
    exitviveEvent: function exitviveEvent() {
        this.unschedule(this.reviveCallBack);
        this.panel_revive.active = false;
        this.BeginGameStateEnd();
    },
    reviveEvent: function reviveEvent() {
        //接入广告 玩家点击关闭以后执行回调 如果看完广告了则复活
        //如果复活 则继续游戏 执行 BeginGameStateBEGIN() 和 this.unschedule(this.reviveCallBack)
        //如果广告没看完 则倒计时继续 不理 这里 需不需要倒计时暂停 另议
        //重新创建自己的对象？还是只是先隐藏
        this.panel_revive.active = false;
        this.BeginGameStateBEGIN();
    },
    //游戏结束 弹出结算界面
    BeginGameStateEnd: function BeginGameStateEnd() {
        //TODO 这里如果最后所有人都打错了。。。存在一个显示的bug
        if (this.player_pos_left_node.length + this.player_pos_right_node.length == 0) {
            _G.QuestionClass.paiming = 3;
        } else {
            _G.QuestionClass.paiming = this.player_pos_left_node.length + this.player_pos_right_node.length;
        }
        //这里存在一个bug，可以之后优化 答错了用户还可以复活，这里统计答题正确与否 取决于题库和排名进行计算
        cc.director.loadScene("SettleScene");
    },
    //开始判断题目
    BeginGameStateJUDGE: function BeginGameStateJUDGE() {
        this.btn_wrong.active = false;
        this.btn_right.active = false;

        //动画播放完成后的回调
        this.judgeCallback = function () {
            //TODO 这里播放判断题目正确与否的动画,动画播放完成执行回调，走下面的
            this.unschedule(this.judgeCallback);

            if (this.MySide == Player.Side.left) {
                this.MyIndex = this.findMyIndex(Player.Side.left);
                this.tempPlayer = this.player_pos_left_node[this.MyIndex];
            } else if (this.MySide == Player.Side.right) {
                this.MyIndex = this.findMyIndex(Player.Side.right);
                this.tempPlayer = this.player_pos_right_node[this.MyIndex];
            }
            //删除掉所有答错题目的人
            if (this.Answer_info == "对") //清除掉右边所有人 并且动画在右边播放
                {
                    for (var i = 0; i < this.player_pos_right_node.length; i++) {
                        this.player_pos_right_node[i].player.removeFromParent();
                    }
                    this.player_pos_right_node = new Array();
                    this.right_player_num = 0;
                } else if (this.Answer_info == "错") {
                for (var i = 0; i < this.player_pos_left_node.length; i++) {
                    this.player_pos_left_node[i].player.removeFromParent();
                }
                this.player_pos_left_node = new Array();
                this.left_player_num = 0;
            }
            if (this.judgement == this.Answer_info) {
                //正确
                if (this.player_pos_left_node.length + this.player_pos_right_node.length == 1) {
                    cc.log("吃鸡了！！！");
                    //TODO 弹出吃鸡的结算界面
                    this.BeginGameStateEnd();
                } else {
                    cc.log("答对了，还有多少人，继续答题吧");
                    //开始下一道提
                    this.BeginGameStateBEGIN();
                }
            } else {
                this.dead_times++;
                if (_G.Enable_Ads_Sdk == true && this.dead_times >= 3 || _G.Enable_Ads_Sdk == false) {
                    cc.log("错误次数太多了，结束！");
                    //TODO 弹出结算界面
                    this.BeginGameStateEnd();
                } else {
                    cc.log("答错了，复活吧");
                    //弹出是否复活的界面 --玩家复活看广告，成功看完回调，继续beigin答题，未看完则还是继续复活，复活倒计时结束，也结束答题，弹出界面界面
                    this.panel_revive.active = true;
                    this.BeginGameStateREVIVE();
                }
            }
        };
        this.schedule(this.judgeCallback, 1, 1);
    },
    //
    findMyIndex: function findMyIndex(side) {
        if (side == Player.Side.right) {
            for (var i = 0; i < this.player_pos_right_node.length; i++) {
                if (this.player_pos_right_node[i].playerFlag == 0) {
                    return i;
                }
            }
        } else {
            for (var i = 0; i < this.player_pos_left_node.length; i++) {
                if (this.player_pos_left_node[i].playerFlag == 0) {
                    return i;
                }
            }
        }
    },
    //正确的点击
    rightClickEvent: function rightClickEvent() {
        //自己的主角往左移动
        this.judgement = "对";

        if (this.MySide == Player.Side.right) {
            this.myPlayerMoving = true;
            //找当前坐标
            var index = this.findMyIndex(Player.Side.right);
            // if(this.player_pos_right_node[index].isMoving == false)
            // {
            this.player_pos_right_node[index].side = Player.Side.left;
            // cc.log("右边 谁移动  " + index);
            //将这个人挪到右边
            var other_index; //= Math.floor((Math.random()-0.01)*3)
            //挪的一边
            if (this.player_pos_left_node.length == 0) {
                other_index = 0;
                this.player_pos_right_node[index].targetindex = other_index;
                this.player_pos_right_node[index].targetside = Player.Side.left;
                // cc.log("右边 移动到  " + other_index);
                var temp = this.player_pos_right_node[index];
                this.player_pos_right_node.splice(index, 1); //二参数为1 删除元素
                // this.player_pos_left_node.splice(index,0,this.player_pos_right_node[other_index]);//二参数为0 添加元素
                //this.player_pos_right_node.splice(other_index,1)
                this.player_pos_left_node.splice(other_index, 0, temp); //二参数为0 添加元素
                //移动自己节点
                this.runNode(other_index, Player.Side.left);
                //把最后面一个元素 填充到这边
                if (this.player_pos_right_node.length != 0) {
                    this.player_pos_right_node[this.player_pos_right_node.length - 1].targetindex = index;
                    var temp = this.player_pos_right_node[this.player_pos_right_node.length - 1];
                    this.player_pos_right_node.splice(this.player_pos_right_node.length - 1, 1);
                    this.player_pos_right_node.splice(index, 0, temp);

                    this.runNode(index, Player.Side.right);
                }
            } else {
                if (this.player_pos_right_node.length <= 3) {
                    other_index = Math.floor((Math.random() - 0.01) * this.right_player_num);
                } else {
                    other_index = Math.floor((Math.random() - 0.01) * 3);
                }
                this.player_pos_right_node[index].targetindex = other_index;
                // cc.log("右边 移动到  " + other_index);
                var temp = this.player_pos_right_node[index];
                this.player_pos_right_node.splice(index, 1); //二参数为1 删除元素
                this.player_pos_right_node.splice(index, 0, this.player_pos_left_node[other_index]); //二参数为0 添加元素
                this.player_pos_left_node.splice(other_index, 1);
                this.player_pos_left_node.splice(other_index, 0, temp); //二参数为0 添加元素

                this.runNode(other_index, Player.Side.left);
                this.runNode(index, Player.Side.right);
            }

            this.left_player_num = this.player_pos_left_node.length;
            this.right_player_num = this.player_pos_right_node.length;

            this.MySide = Player.Side.left;
            this.MyIndex = other_index;
            this.myPlayerMoving = false;
            // }
        }
    },
    //错误的点击
    wrongClickEvent: function wrongClickEvent() {
        //自己的主要向右移动
        this.judgement = "错";
        if (this.MySide == Player.Side.left) {

            this.myPlayerMoving = true;
            //找当前坐标
            var index = this.findMyIndex(Player.Side.left);
            // if(this.player_pos_right_node[index].isMoving == false)
            // {
            this.player_pos_left_node[index].side = Player.Side.right;
            // cc.log("右边 谁移动  " + index);
            //将这个人挪到右边
            var other_index; //= Math.floor((Math.random()-0.01)*3)
            //挪的一边
            if (this.player_pos_right_node.length == 0) {
                other_index = 0;
                this.player_pos_left_node[index].targetindex = other_index;
                this.player_pos_left_node[index].targetside = Player.Side.right;
                // cc.log("右边 移动到  " + other_index);
                var temp = this.player_pos_left_node[index];
                this.player_pos_left_node.splice(index, 1); //二参数为1 删除元素
                // this.player_pos_left_node.splice(index,0,this.player_pos_right_node[other_index]);//二参数为0 添加元素
                //this.player_pos_right_node.splice(other_index,1)
                this.player_pos_right_node.splice(other_index, 0, temp); //二参数为0 添加元素
                //移动自己节点
                this.runNode(other_index, Player.Side.right);
                //把最后面一个元素 填充到这边
                if (this.player_pos_left_node.length != 0) {
                    this.player_pos_left_node[this.player_pos_left_node.length - 1].targetindex = index;
                    var temp = this.player_pos_left_node[this.player_pos_left_node.length - 1];
                    this.player_pos_left_node.splice(this.player_pos_left_node.length - 1, 1);
                    this.player_pos_left_node.splice(index, 0, temp);

                    this.runNode(index, Player.Side.left);
                }
            } else {
                if (this.player_pos_right_node.length <= 3) {
                    other_index = Math.floor((Math.random() - 0.01) * this.right_player_num);
                } else {
                    other_index = Math.floor((Math.random() - 0.01) * 3);
                }
                this.player_pos_left_node[index].targetindex = other_index;
                // cc.log("右边 移动到  " + other_index);
                var temp = this.player_pos_left_node[index];
                this.player_pos_left_node.splice(index, 1); //二参数为1 删除元素
                this.player_pos_left_node.splice(index, 0, this.player_pos_right_node[other_index]); //二参数为0 添加元素
                this.player_pos_right_node.splice(other_index, 1);
                this.player_pos_right_node.splice(other_index, 0, temp); //二参数为0 添加元素

                this.runNode(index, Player.Side.left);
                this.runNode(other_index, Player.Side.right);
            }
            this.left_player_num = this.player_pos_left_node.length;
            this.right_player_num = this.player_pos_right_node.length;

            this.MySide = Player.Side.right;
            this.MyIndex = other_index;

            this.myPlayerMoving = false;
            // }
        }
    },
    //别人跑路
    //TODO--BUG 如果某节点正在移动 又被随机到移动 那么位置可能会发生偏差 之后改
    runOtherPerson: function runOtherPerson() {
        //后期针对题目难度 要划分占边的人数
        //随机出来 这一秒 有多少人在移动
        cc.log("左边多少人" + this.left_player_num);
        cc.log("右边多少人" + this.right_player_num);
        var runPersionNum_left;
        if (this.player_pos_left_node.length <= 3) {
            runPersionNum_left = 0;
        } else {
            runPersionNum_left = Math.floor(Math.random() * 5); //这里可能会均分人数
            if (runPersionNum_left > this.left_player_num) {
                runPersionNum_left = this.left_player_num;
            } else if (runPersionNum_left + this.right_player_num > 30) {
                runPersionNum_left = runPersionNum_left - (runPersionNum_left + this.right_player_num - 30);
            }
        }
        cc.log("runPersionNum_left" + runPersionNum_left);
        for (var _i = 0; _i < runPersionNum_left; _i++) {
            //var index = Math.floor(3+(Math.random()-0.001)*(this.player_pos_left_node.length-3))
            var index = Math.floor((Math.random() - 0.001) * this.player_pos_left_node.length);
            //当人数少于3个的时候 
            if (index >= this.player_pos_left_node.length) {
                continue;
            }
            if (this.player_pos_left_node[index].playerFlag == 0) {
                continue;
            }
            // else if(this.player_pos_left_node[index].isMoving == false)
            // {
            this.player_pos_left_node[index].targetside = Player.Side.right;
            cc.log("左边 谁移动  " + index);
            //将这个人挪到右边
            // var other_index = Math.floor(3+(Math.random()-0.001)*(this.player_pos_right_node.length-3))
            var other_index = Math.floor((Math.random() - 0.001) * this.player_pos_right_node.length);
            this.player_pos_left_node[index].targetindex = other_index;
            cc.log("左边 移动到  " + other_index);

            this.player_pos_right_node.splice(other_index, 0, this.player_pos_left_node[index]); //二参数为0 添加元素
            this.player_pos_left_node.splice(index, 1); //二参数为1 删除元素
            //右边的node index往后挪
            for (var j = other_index + 1; j < this.player_pos_right_node.length; j++) {
                this.player_pos_right_node[j].targetindex = j;
            }
            for (var k = index; k < this.player_pos_left_node.length; k++) {
                this.player_pos_left_node[k].targetindex = k;
            }
            //修改数据
            this.left_player_num--;
            this.right_player_num++;
            // }
        }

        var runPersionNum_right;
        if (this.player_pos_right_node.length <= 3) {
            runPersionNum_right = 0;
        } else {
            runPersionNum_right = Math.floor(Math.random() * 5);
            if (runPersionNum_right > this.right_player_num) {
                runPersionNum_right = this.right_player_num;
            } else if (runPersionNum_right + this.left_player_num > 30) {
                runPersionNum_right = runPersionNum_right - (runPersionNum_right + this.left_player_num - 30);
            }
        }
        cc.log("runPersionNum_right" + runPersionNum_right);
        for (var _i2 = 0; _i2 < runPersionNum_right; _i2++) {
            var index = Math.floor(3 + (Math.random() - 0.001) * (this.player_pos_right_node.length - 3));
            if (index >= this.player_pos_right_node.length) {
                continue;
            }
            if (this.player_pos_right_node[index].playerFlag == 0) {
                continue;
            }
            // if(this.player_pos_right_node[index].isMoving == false)
            // {
            this.player_pos_right_node[index].targetside = Player.Side.left;

            cc.log("右边 谁移动  " + index);
            //将这个人挪到右边
            var other_index = Math.floor(3 + (Math.random() - 0.001) * (this.player_pos_left_node.length - 3));
            this.player_pos_right_node[index].targetindex = other_index;

            cc.log("右边 移动到  " + other_index);

            this.player_pos_left_node.splice(other_index, 0, this.player_pos_right_node[index]); //二参数为0 添加元素
            this.player_pos_right_node.splice(index, 1); //二参数为1 删除元素
            //右边的node index往后挪
            for (var j = other_index + 1; j < this.player_pos_left_node.length; j++) {
                this.player_pos_left_node[j].targetindex = j;
            }
            for (var k = index; k < this.player_pos_right_node.length; k++) {
                this.player_pos_right_node[k].targetindex = k;
            }
            //修改数据
            this.right_player_num--;
            this.left_player_num++;
            // }
        }
        for (var i = 0; i < this.player_pos_left_node.length; i++) {
            if (this.player_pos_left_node[i].targetindex != this.player_pos_left_node[i].index || this.player_pos_left_node[i].targetside != this.player_pos_left_node[i].side) //&& this.player_pos_left_node[i].isMoving==false)
                {
                    cc.log("side " + this.player_pos_left_node[i].side + " targetside " + this.player_pos_left_node[i].targetside + " i " + i + "from " + this.player_pos_left_node[i].index + " to " + this.player_pos_left_node[i].targetindex);
                    this.runNode(i, this.player_pos_left_node[i].targetside);
                }
        }
        for (var i = 0; i < this.player_pos_right_node.length; i++) {
            if (this.player_pos_right_node[i].targetindex != this.player_pos_right_node[i].index || this.player_pos_right_node[i].targetside != this.player_pos_right_node[i].side) //&& this.player_pos_right_node[i].isMoving==false)
                {
                    cc.log("side " + this.player_pos_right_node[i].side + " targetside " + this.player_pos_right_node[i].targetside + "i   " + i + "from " + this.player_pos_right_node[i].index + " to " + this.player_pos_right_node[i].targetindex);
                    this.runNode(i, this.player_pos_right_node[i].targetside);
                }
        }
    },
    //哪个节点移动
    runNode: function runNode(other_index, side) {
        this.moveTime = 0.3;
        var self = this;
        //挪自己的位置
        if (side == Player.Side.right) {
            // this.player_pos_right_node[other_index].isMoving = true;
            var delaytime = cc.delayTime(Math.random() * 0.69);
            var moveTo = cc.moveTo(this.moveTime, this.player_pos_right[other_index]);
            var callback = cc.callFunc(function () {
                // self.player_pos_right_node[other_index].isMoving = false;
                // this.player_pos_right_node[other_index].player.stopAllActions()
            });
            var action = cc.sequence(delaytime, moveTo, callback);
            cc.log(other_index + " right现在的位置 " + this.player_pos_right_node[other_index].player.x + " " + this.player_pos_right_node[other_index].player.y);
            cc.log(other_index + " right要去的位置 " + this.player_pos_right[other_index].x + " " + this.player_pos_right[other_index].y);
            // cc.log("other_index"+other_index);
            this.player_pos_right_node[other_index].player.runAction(action);
            //TODO 放到回调里
            this.player_pos_right_node[other_index].index = this.player_pos_right_node[other_index].targetindex;
            this.player_pos_right_node[other_index].side = this.player_pos_right_node[other_index].targetside;
            this.player_pos_right_node[other_index].player.setLocalZOrder(1000 - other_index);
        } else {
            // this.player_pos_left_node[other_index].isMoving = true;
            var delaytime = cc.delayTime(Math.random() * 0.69);
            // var delaytime = cc.delayTime(0.2)
            var moveTo = cc.moveTo(this.moveTime, this.player_pos_left[other_index]);
            var callback = cc.callFunc(function () {
                // self.player_pos_left_node[other_index].isMoving = false;
                // this.player_pos_left_node[other_index].player.stopAllActions()
            });
            var action = cc.sequence(delaytime, moveTo, callback);
            // cc.log("other_index"+other_index);
            cc.log(other_index + " left现在的位置 " + this.player_pos_left_node[other_index].player.x + " " + this.player_pos_left_node[other_index].player.y);
            cc.log(other_index + " left要去的位置 " + this.player_pos_left[other_index].x + " " + this.player_pos_left[other_index].y);

            this.player_pos_left_node[other_index].player.runAction(action);
            //TODO 放到回调里
            this.player_pos_left_node[other_index].index = this.player_pos_left_node[other_index].targetindex;
            this.player_pos_left_node[other_index].side = this.player_pos_left_node[other_index].targetside;
            this.player_pos_left_node[other_index].player.setLocalZOrder(1000 - other_index);
        }
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
        //# sourceMappingURL=AnswerScene.js.map
        