<template lang="html">
  <div id="container" class="hide-code-menu">
    <div v-if="type == 'block'">
      <AceEditor
        v-model="contentCode"
        lang="python"
        @init="editorInit2"
        :theme="theme"
        width="60%"
        height="140"
        :fontSize="13"
        class="ace-block-item"
        :ref="'myEditor'+index"
      ></AceEditor>
    </div>
    <div id="ide" v-if="!type">
      <div class="left">
        <div class="header-bar">
          <span class="text success" v-if="(sectionsContentNum - 1 > index) || isFinish">
            <span><i class="el-icon-success" style="font-size: 16px;"></i>
                已完成
            </span>
          </span> 
          <span class="text error" v-if="(sectionsContentNum - 1 > index) ? false : !isFinish">
            <span><i class="el-icon-info" style="font-size: 16px;"></i>
                练习中
            </span>
          </span>
        </div>
        <div class="editor">
          <AceEditor
            class="ace-editor-item"
            v-model="contentCode"
            @init="editorInit"
            @input="changeData"
            lang="python"
            :theme="theme"
            width="100%"
            height="240"
            :fontSize="13"
            :ref="'myEditor'+index"
          ></AceEditor>
        </div>
        <div class="bottom-menu">
          <div class="bottom-menu-item" @click="resetCode()">
            <div class="button redo">重做</div>
          </div>
          <div class="bottom-menu-item" @click="run()">
            <div class="button clickable run button-pointer">运行</div>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- <div id="turtle"></div> -->
        <div class="console-title">终端</div>
        <pre class="console" :id="'console' + index"></pre>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import AceEditor from "vue2-ace-editor";
import SK from './../../../public/scripts/skulpt.min.js'
import './../../../public/scripts/skulpt-stdlib.js'

export default {
  props: {
    content: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 0
    },
    sectionsContentNum: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: ""
    },
    theme: {
      type: String,
      default: "tomorrow_night"
    },
  },
  components: {
    AceEditor
  },
  data () {
    return {
      config: {
        width: 1000,
        height: 1000,
        value: "",
        autoCompletion: true,
        fullScreen: true,
      },
      contentCode: "",
      dataView: "",
      consoleHtml: "",
      isFinish: false,
      
    };
  },
  created () {
    this.contentCode = this.content;
    this.dataView = this.contentCode;

  },
  computed: {},
  watch: {},
  mounted () {
    let editor = this.$refs['myEditor'+this.index].editor;
    editor.setHighlightActiveLine(false);
    editor.setHighlightSelectedWord(false);
    editor.setOption("wrap", "free");
    editor.setShowPrintMargin(80);
    editor.getSession().setFoldStyle('manual');
    // editor.session.setUseWrapMode(true);
    editor.session.setTabSize(4);
    editor.setOptions({
        autoCompletion: true,
        enableBasicAutocompletion: true,
　　　　 enableLiveAutocompletion: true
    });
    if(this.type == 'block'){
      editor.setFontSize(20);
      editor.session.setUseWrapMode(true);
      editor.setReadOnly(true);
    }else{
      editor.setFontSize(17);
      editor.setReadOnly(false);
    }
    // if (this.sectionsContentNum - 1 > this.index) {
    //   if(document.getElementById("console" + this.index)){
    //     this.run();
    //   }
    // }
    // const source = {};

    // const loadScript = url => {
    //     const scr = document.createElement("script");
    //     scr.type = "application/javascript";
    //     scr.src = url;
    //     scr.onerror = function() {
    //         scr.remove();
    //         if (!(url in source)) source[url] = 0;
    //         const num = source[url];
    //         if (num < 5) {
    //             console.log("加载url: ", url, "出错, 0.8秒后重试");
    //             setTimeout(() => {
    //                 source[url] += 1;
    //                 loadScript(url);
    //             }, 800);
    //         }
    //     };
    //     document.body.appendChild(scr);
    // };
    // loadScript('https://github.com/wordtanglin/program/blob/master/vue.config.js')
  },

  methods: {
    editorInit: function () {
      console.log(this.theme)
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/python");
      require("brace/mode/less");
      require("brace/theme/"+this.theme);
      require("brace/snippets/javascript"); //snippet
    },
    editorInit2: function () {
      console.log(this.theme)
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/python");
      require("brace/mode/less");
      require("brace/theme/"+this.theme);
      require("brace/snippets/javascript"); //snippet
    },
    changeData: function (value) {
      this.dataView = value;
    },
    run: function () {
      this.$emit('run', {
        opt_value: '',
        category: 'click_run_button',
        index: this.index,
      })
      document.getElementById("console" + this.index).innerHTML = '';
      let code = this.dataView;
      Sk.pre = "output";
      Sk.configure({ 
        output: this.outf,
        read: this.builtinRead,
         __future__: Sk.python3,
         inputfun: this.pythonInput,
         inputfunTakesPrompt: true
       });
      Sk.python3 = true;
      { (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'console' + this.index }
      var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, code, true);
      });
      myPromise.then(mod => {
        this.isFinish = true;
        this.$emit('run', {
          opt_value: 1,
          category: 'end_program',
          block_num: this.index,
          code: code,
          terminal_text: document.getElementById("console" + this.index).innerHTML,
          notice: '恭喜通关',
          index: this.index,
          right: 1
        })
      }).catch(err => {
        document.getElementById("console" + this.index).innerHTML += `<span style="color: red;">${err.toString()}</span><br>`
        document.getElementById("console" + this.index).innerHTML += `<span style="color: red;">${this.transErrorMsg({ errorName: err.tp$name, errorMessage: err.toString() })}</span><br>`
        this.$emit('run', {
          opt_value: 0,
          category: 'end_program',
          block_num: this.index,
          code: code,
          terminal_text: document.getElementById("console" + this.index).innerHTML,
          notice: this.transErrorMsg({ errorName: err.tp$name, errorMessage: err.toString() }),
        })
      });
    },
    resetCode: function () {//重做
    this.isFinish = false;
      this.$emit('run', {
        opt_value: '',
        category: 'click_redo_button',
        block_num: this.index
      })
      document.getElementById("console" + this.index).innerHTML = '';
      this.contentCode = this.content;
    },
    pythonInput: function(prompt) {
        return new Promise((resolve, reject) => {

            let input = document.createElement('input')
            let br = document.createElement('br')
            let value = prompt || ''
            input.type = 'text'
            input.className = 'console-input'
            input.style.border = 'none'
            input.style.outline = 'none'
            input.style.fontSize = 'initial'
            input.style.width = 'auto'
            input.style.minWidth = '100%'
            input.style.color = '#fff'
            input.style.background = '#000'
            input.style.display = 'block'
            input.setAttribute('value', value)
            document.getElementById("console" + this.index).onclick = e => input.focus()
            input.onkeydown = e => {
                input.style.width = input.value.length * 9 + 'px'
                if (e.keyCode === 13) {
                    input.onkeydown = null
                    document.getElementById("console" + this.index).onclick = null
                    input.disabled = true
                    input.className = 'console-input console-input-disable'
                    value = input.value
                    input.setAttribute('value', value)
                    input.setAttribute('disabled', true)
                    resolve(value)
                }
            }
            document.getElementById("console" + this.index).appendChild(input)
            document.getElementById("console" + this.index).appendChild(br)
            if(value){
              this.isFinish = true;
              this.$emit('run', {
                opt_value: 1,
                category: 'end_program',
                block_num: this.index,
                code: code,
                terminal_text: document.getElementById("console" + this.index).innerHTML,
                notice: '恭喜通关',
                index: this.index,
                right: 1
              })
            }
        })
    },
    outf: function (text) {
      var mypre = document.getElementById("console" + this.index);
      mypre.innerHTML = mypre.innerHTML + text;
    },
    builtinRead: function (x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) throw "File not found: '" + x + "'";
      return Sk.builtinFiles["files"][x];
    },
    transErrorMsg: function ({
      errorMessage,
      line
    }) {
      var d = [
        [/NameError: name '(\w+)' is not defined/g, "没有定义过 $1"],
        [/TokenError: EOF in multi-line statement/g, "语法错误😢"],
        [/ParseError: bad input/g, "语法错误😢"],
        [/ParseError: bad token/g, "语法错误😢"],
        [/SyntaxError: bad input/g, "语法错误😢"],
        [/SyntaxError: bad token/g, "语法错误😢"],
        [/TypeError: unsupported operand type\(s\) for Add: '(\w+)' and '(\w+)'/g, "加法不能用来加 '$1' 和 '$2'"],
        [/TypeError: cannot concatenate '(\w+)' and '(\w+)' objects/g, "加法不能用来加 '$1' 和 '$2'"],
        [/AttributeError: '(\w+)' object has no attribute '(\w+)'/g, "'$1' 没有 '$2' 命令"],
        [/TypeError: 'list' object is not callable/g, "要使用列表的元素, 要使用\[\] 而不是\(\)"],
        [/TypeError: 'str' object is not callable/g, "小括号\(\)一定要紧跟在命令后面"],
        [/TypeError: 'int' object is not callable/g, "小括号\(\)一定要紧跟在命令后面"],
        [/TypeError: '(\w+)' object is not callable/g, "小括号\(\)一定要紧跟在命令后面, 但是前面是'$1'"],
        [/TypeError: '(\w+)' does not support indexing/g, "中括号\[\]一定要紧跟在列表,字符串,字典后面, 但是前面是'$1'"],
        [/ZeroDivisionError: integer division or modulo by zero/g, "除数不能为0"],
        [/ImportError: No module named (\w+)/g, "找不到叫 $1 的库, 不能导入"],
        [/TypeError: (\w+)\(\) takes exactly (\d+) positional argument\(s\) \((\d+) given\)/g, "$1\(\) 里要写 $2 个参数, 但你写了 $3 个"],
        [/TypeError: (\w+)\(\) takes between (\d+) and (\d+) positional argument\(s\) \((\d+) given\)/g, "$1\(\) 里可以写 $2 到 $3 个参数, 但你写了 $4 个"],
        [/NotImplementedError: (\w+) is not yet implemented/g, "不要调皮哦, 网页上还没有实现 $1"],
        [/ExternalError: todo; haven't implemented (.+)/g, "不要调皮哦, 网页上还没有实现 $1"],
        [/string/g, "string(字符串)"],
        [/number/g, "number(数字)"],
        [/'list'/g, "'list'\(列表\)"],
        [/'int'/g, "'int'\(整数\)"],
        [/'str'/g, "'str'\(字符串\)"],
        [/'dict'/g, "'dict'\(字典\)"],
        [/'float'/g, "'float'\(小数\)"],
        [/on line (\d+)/g, ", 在第 $1 行"]
      ]
      for (var i in d) {
        errorMessage = errorMessage.replace(d[i][0], d[i][1])
      }
      return "\n" + errorMessage
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/editor.scss";

html,
body {
  width: 100%;
  height: 100%;
}
#container {
  width: 100%;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding-top: 0;
  padding-left: 0;
  padding: 0 20px;
  border-left: 2px solid #4b453e;
  margin-top: 15px;
  margin-bottom: 20px;
}
.ace_editor {
  font-size: 16px;
}
.ace_content{
  font-family: none!important;
}
.console .console-input {
      border: none;
      outline: none;
      font-size: 18px;
      width: auto;
      min-width: 200px;
      color: #fff;
      background: #000;
    }
    
    .console .console-input:disabled {
      color: #fff;
    }
    
    .console .console-input:focus {
      border: none;
      box-shadow: 0px 0px 0px #000;
    }
</style>
