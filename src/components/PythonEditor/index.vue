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
        :ref="'myEditor' + index"
      ></AceEditor>
    </div>
    <div id="ide" v-if="!type">
      <div class="left">
        <div class="header-bar">
          <span
            class="text success"
            v-if="sectionsContentNum - 1 > index || isFinish"
          >
            <span
              ><i class="el-icon-success" style="font-size: 16px;"></i>
              已完成
            </span>
          </span>
          <span
            class="text error"
            v-if="sectionsContentNum - 1 > index ? false : !isFinish"
          >
            <span
              ><i class="el-icon-info" style="font-size: 16px;"></i>
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
            :ref="'myEditor' + index"
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
        <div class="result-tip success tips-fade-leave-active tips-fade-leave-to" :class="[(isFinish && timeSpace) ? 'active' : '']">
          <div class="content">
              <i class="el-icon-success" style="font-size: 16px;"></i>
             <span>运行通过</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig } from "./../../api/index";
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
      timeSpace: false,
      d: null
    };
  },
  async created () {
    this.contentCode = this.content;
    this.dataView = this.contentCode;
    const res = await getConfig({ url: 'http://donutcoding.com:4567/programming_config/program_config/-/raw/master/config.js' });
    this.d = eval(res)
  },
  computed: {},
  watch: {},
  mounted () {
    let editor = this.$refs['myEditor' + this.index].editor;
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
    if (this.type == 'block') {
      editor.setFontSize(20);
      editor.session.setUseWrapMode(true);
      editor.setReadOnly(true);
    } else {
      editor.setFontSize(17);
      editor.setReadOnly(false);
    }
  },

  methods: {
    editorInit: function () {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/python");
      require("brace/mode/less");
      require("brace/theme/" + this.theme);
      require("brace/snippets/javascript"); //snippet
    },
    editorInit2: function () {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/python");
      require("brace/mode/less");
      require("brace/theme/" + this.theme);
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
        this.timeSpace = true;
        setTimeout(() => {
          this.timeSpace = false;
        },3000)
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
      this.timeSpace = false;
      this.$emit('run', {
        opt_value: '',
        category: 'click_redo_button',
        block_num: this.index
      })
      document.getElementById("console" + this.index).innerHTML = '';
      this.contentCode = this.content;
    },
    pythonInput: function (prompt) {

      document.getElementById("console" + this.index).innerHTML += prompt;

      return new Promise((resolve, reject) => {

        let input = document.createElement('input')
        let br = document.createElement('br')
        let value = ''
        input.type = 'text'
        input.className = 'console-input'
        input.style.border = 'none'
        input.style.outline = 'none'
        input.style.fontSize = 'initial'
        input.style.width = 'auto'
        input.style.color = '#fff'
        input.style.background = '#000'
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
        setTimeout(() => {
          input.focus();
        },500)
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
      var d = this.d
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
.ace_content {
  font-family: none !important;
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
