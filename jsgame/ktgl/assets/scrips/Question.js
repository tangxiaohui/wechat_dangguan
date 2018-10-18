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

    //初始化题库
    // ctor(){
    //     this.questions = {}; // 存储解析出来的JSON数据
    //     this.question_num =0;

    //     // var question_num;
    //     // var questions = {}; 
    //     // cc.loader.loadRes('tiku.json', function (err, object) {
    //     //     if (err) {
    //     //         console.log(err);
    //     //         return;
    //     //     }

    //     //     let engine = object.engine; // engine = box2D
    //     //     let ver = object.version;   // ver = 2.3.1
    //     //     let bodies = object.bodies; // bodies是个数组
    //     //     let joints = object.joints; // joints是个数组

    //     //     // 需在回调外面提前用self代替this
    //     //     // self.questions = object; // box2d是整个对象

    //     //     this.question_num = object.length;
    //     //     // 将循环2次，因为bodies是个拥有2个对象的数组
    //     //     for (let x=0; x < object.length; x++) {
    //     //         let root = object[x]; // root是个对象
    //     //          this.questions[x] = root.id; // 第1次循环root_name = root
    //     //          this.questions[x] = root.question; // type = static
    //     //          this.questions[x] = root.answer; // gravity = 0.2

    //     //     }
    //     // });
        
    // },
    init:function(){
        // var question_num;
        // var questions = {}; 
        // cc.loader.loadRes('tiku.json', function (err, object) {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        this.questions = {}; // 存储解析出来的JSON数据
        this.question_num =0;
        var self = this;
        //     let engine = object.engine; // engine = box2D
        //     let ver = object.version;   // ver = 2.3.1
        //     let bodies = object.bodies; // bodies是个数组
        //     let joints = object.joints; // joints是个数组

        //     // 需在回调外面提前用self代替this
        //     // self.questions = object; // box2d是整个对象

        //     question_num = object.length;
        //     // 将循环2次，因为bodies是个拥有2个对象的数组
        //     for (let x=0; x < object.length; x++) {
        //         let root = object[x]; // root是个对象
        //          questions[x] = root.id; // 第1次循环root_name = root
        //          questions[x] = root.question; // type = static
        //          questions[x] = root.answer; // gravity = 0.2

        //     }
        // });
        cc.loader.loadRes('tiku.json', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            // let engine = object.engine; // engine = box2D
            // let ver = object.version;   // ver = 2.3.1
            // let bodies = object.bodies; // bodies是个数组
            // let joints = object.joints; // joints是个数组

            // 需在回调外面提前用self代替this
            // self.questions = object; // box2d是整个对象

            self.question_num = object.length;
            // 将循环2次，因为bodies是个拥有2个对象的数组
            for (let x=0; x < object.length; x++) {
                let root = object[x]; // root是个对象
                self.questions[x] = [];
                 self.questions[x].id = root.id; // 第1次循环root_name = root
                 self.questions[x].question = root.question; // type = static
                 self.questions[x].answer = root.answer; // gravity = 0.2

            }
        });
        
    },
    //出题
    findQuestion:function(){
        // var info = []
        // info.question = "王天也姓王";
        // info.answer = "对";
        var index = Math.floor(Math.random()*(this.question_num));
        cc.log("随机到了第"+index+"道题");
        var info = [];
        info.question = this.questions[index].question;
        cc.log("题目"+info.question);
        info.answer = this.questions[index].answer;
        cc.log("答案"+info.answer);
        return info
    },
    // update (dt) {},
});
