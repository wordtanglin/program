function transErrorMsg({ errorMessage, line }) {
  d = [
    [/NameError: name '(\w+)' is not defined/g, "没有定义过 $1"],
    [/TokenError: EOF in multi-line statement/g, "语法错误😢"],
    [/ParseError: bad input/g, "语法错误😢"],
    [/ParseError: bad token/g, "语法错误😢"],
    [/SyntaxError: bad input/g, "语法错误😢"],
    [/SyntaxError: bad token/g, "语法错误😢"],
    [
      /TypeError: unsupported operand type\(s\) for Add: '(\w+)' and '(\w+)'/g,
      "加法不能用来加 '$1' 和 '$2'"
    ],
    [
      /TypeError: cannot concatenate '(\w+)' and '(\w+)' objects/g,
      "加法不能用来加 '$1' 和 '$2'"
    ],
    [
      /AttributeError: '(\w+)' object has no attribute '(\w+)'/g,
      "'$1' 没有 '$2' 命令"
    ],
    [
      /TypeError: 'list' object is not callable/g,
      "要使用列表的元素, 要使用[] 而不是()"
    ],
    [
      /TypeError: 'str' object is not callable/g,
      "小括号()一定要紧跟在命令后面"
    ],
    [
      /TypeError: 'int' object is not callable/g,
      "小括号()一定要紧跟在命令后面"
    ],
    [
      /TypeError: '(\w+)' object is not callable/g,
      "小括号()一定要紧跟在命令后面, 但是前面是'$1'"
    ],
    [
      /TypeError: '(\w+)' does not support indexing/g,
      "中括号[]一定要紧跟在列表,字符串,字典后面, 但是前面是'$1'"
    ],
    [/ZeroDivisionError: integer division or modulo by zero/g, "除数不能为0"],
    [/ImportError: No module named (\w+)/g, "找不到叫 $1 的库, 不能导入"],
    [
      /TypeError: (\w+)\(\) takes exactly (\d+) positional argument\(s\) \((\d+) given\)/g,
      "$1() 里要写 $2 个参数, 但你写了 $3 个"
    ],
    [
      /TypeError: (\w+)\(\) takes between (\d+) and (\d+) positional argument\(s\) \((\d+) given\)/g,
      "$1() 里可以写 $2 到 $3 个参数, 但你写了 $4 个"
    ],
    [
      /NotImplementedError: (\w+) is not yet implemented/g,
      "不要调皮哦, 网页上还没有实现 $1"
    ],
    [
      /ExternalError: todo; haven't implemented (.+)/g,
      "不要调皮哦, 网页上还没有实现 $1"
    ],
    [/string/g, "string(字符串)"],
    [/number/g, "number(数字)"],
    [/'list'/g, "'list'(列表)"],
    [/'int'/g, "'int'(整数)"],
    [/'str'/g, "'str'(字符串)"],
    [/'dict'/g, "'dict'(字典)"],
    [/'float'/g, "'float'(小数)"],
    [/on line (\d+)/g, ", 在第 $1 行"]
  ];
  for (var i in d) {
    errorMessage = errorMessage.replace(d[i][0], d[i][1]);
  }

  return "\n" + errorMessage;
}

function getBucket(userId) {
  return "B";
}

function pullPythonCode({ cid, userId }) {
  var d = {
    "1_4": ["name", "str", "字符串的两边要加引号", "小核桃"],
    "1_5": ["hat", "str", "字符串的两边要加引号", "小白兔"],
    "1_6": ["hat", "str", "字符串的两边要加引号", "气球"],
    "1_7": ["hat", "str", "字符串的两边要加引号", "大象"],
    "1_9": ["hat", "str", "字符串的两边要加引号", "小白兔气球"]
  };

  if (!(cid in d)) return "";

  var pcode =
    "\nif '" +
    d[cid][0] +
    "' not in globals():\n\
	    print('" +
    d[cid][0] +
    "变量没有定义哦')\nelif type(" +
    d[cid][0] +
    ") != " +
    d[cid][1] +
    ":\n\
	    print('" +
    d[cid][2] +
    "')\nelif " +
    d[cid][0] +
    "!='" +
    d[cid][3] +
    "':\n\
	    print('" +
    d[cid][0] +
    "变量的值应该是" +
    d[cid][3] +
    "')\nelse:\n\
	    print('过关')\n";

  return pcode;
}

function notice({
  code,
  result,
  extResult,
  hasError,
  errorMessage,
  cid,
  userId,
  line
}) {
  let errTrans = "";
  if (hasError) {
    errTrans =
      transErrorMsg({
        errorMessage: errorMessage,
        line: line
      }) + "\n";
  }
  var b = getBucket(userId);
  let note = "";
  let passed = 0;
  if (b == "A") note = noticeA(code, result, cid, extResult);
  if (b == "B") {
    note = noticeB(code, result, cid);
    if (note === "" && !hasError) {
      passed = 1;
    }
  }
  if (passed) {
    return {
      passed: 1,
      message: "恭喜过关~"
    };
  }
  if (note !== "") note = "提示: " + note;
  if (hasError) {
    return {
      passed: 0,
      message: errTrans + note
    };
  }

  return {
    passed: 0,
    message: note
  };
}

function noticeA(code, result, cid, extResult) {
  var reg = /[\r\n\0\t\v\f,，.。?？!！:：]/g;
  reg = / /g;
  code = code.replace(reg, "");

  let sourceArray = code.split("\n");
  var resArray = Array();
  for (var i = 0; i < sourceArray.length; i++) {
    if (sourceArray[i] != "") resArray.push(sourceArray[i]);
  }
  code = resArray.join("\n");

  var message = "结果正确，点击下一步继续学习吧~";

  if (cid == "1_1") {
    if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("'") > -1) return "打印数字不需要加单引号哦~";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";
    else if (code.indexOf("+") == -1)
      return "输出两个整数加法运算，需要使用加号哦~";
    else if (code.indexOf("19+14") == -1 && code.indexOf("14+19") == -1)
      return "要计算19+14的和哦~";
    else if (result != "33\n")
      return "结果错误，正确结果为：\n33，再试一下吧！";
    else return "结果正确，点击下一步继续学习吧~";
  } else if (cid == "1_2") {
    var array = code.split("\n");
    array.splice(0, 1);
    code = array.join("\n");

    if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.split("'").length - 1 != 2)
      return "要输出的内容是字符串，需要将文字包含在一组单引号内";
    else if (result != "小核桃\n你好\n")
      return "结果错误，正确结果为：\n小核桃\n你好\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_3") {
    if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.split("'").length - 1 != 4)
      return "要输出的内容是字符串，需要将文字包含在一组单引号内";
    else if (result != "hi\n我是全宇宙最厉害的小核桃\n")
      return "结果错误，正确结果为：\nhi\n我是全宇宙最厉害的小核桃\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_4") {
    var array = code.split("\n");
    array.splice(0, 1);
    code = array.join("\n");

    if (extResult.indexOf("过关") == -1) return extResult;
    else if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";

    if (code.split("'").length - 1 < 4)
      return "要输出的内容是字符串，需要将文字包含在一组单引号内";
    else if (result != "你好\n小核桃\n")
      return "结果错误，正确结果为：\n你好\n小核桃\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_5") {
    var array = code.split("\n");
    array.splice(0, 1);
    code = array.join("\n");
    if (extResult.indexOf("过关") == -1) return extResult;
    else if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";

    if (result != "你好\n小核桃\n")
      return "结果错误，正确结果为：\n请看帽子里是~\n小白兔\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_6") {
    var array = code.split("\n");
    array.splice(0, 1);
    code = array.join("\n");
    if (extResult.indexOf("过关") == -1) return extResult;
    else if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";

    if (result != "你好\n小核桃\n")
      return "结果错误，正确结果为：\n请看帽子里是~\n气球\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_7") {
    if (extResult.indexOf("过关") == -1) return extResult;
    else if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";

    if (result != "你好\n小核桃\n")
      return "结果错误，正确结果为：\n冰箱\n大象\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_8") {
    if (extResult.indexOf("过关") == -1) return extResult;
    else if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";

    if (result != "你好\n小核桃\n")
      return "结果错误，正确结果为：\n小白兔，气球\n";
    else return "结果正确，可以进行下一步";
  } else if (cid == "1_9") {
    var array = code.split("\n");
    array.splice(0, 1);
    code = array.join("\n");

    if (extResult.indexOf("过关") == -1) return extResult;
    else if (code.indexOf("print(") == -1)
      return "输出需要用print()命令, 命令后面一定要写小括号()";
    else if (code.indexOf("print()") > -1)
      return "记得在print()命令的括号里写要打印的内容~";

    if (result != "你好\n小核桃\n")
      return "结果错误，正确结果为：\n小白兔气球\n";
    else return "结果正确，可以进行下一步";
  }
}

function noticeB(code, result, cid) {
  let finals = {
    "1_16": ""
  };

  let noticeDict = {
    "1_1": [
      "",
      "",
      {
        "需要用print()命令": /print[ ]*\(.*\)/g,
        "括号里用+加号计算加法": /\+/g
      },
      {
        不需要用引号: /'/g,
        "print()命令不需要等号": /=/g,
        代码左边不要写空格哦: /^ /g
      },
      "33\n"
    ],
    "1_2": [
      "print('hi')\n",
      "",
      {
        "需要再用一次print()命令": /print[ ]*\(.*\)/g,
        字符串两边应该加引号: /\('.*'\)/g
      },
      {
        "print()命令不需要等号": /=/g,
        代码左边不要写空格哦: /^ /g
      },
      "hi\n小核桃\n"
    ],
    "1_3": ["", "", {}, {}, "hi\n我是全宇宙最厉害的小核桃\n"],
    "1_4": [
      "print('你好')\n",
      "",
      {
        需要用等号定义一个变量: /=/g,
        字符串两边应该加引号: /=.*'.*'/g,
        "需要用print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=/g,
        给变量赋值不需要写括号: /=\('/g,
        打印变量不需要加引号: /\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "你好\n小核桃\n"
    ],
    "1_5": [
      "print('请看帽子里是~')\n",
      "",
      {
        需要用等号定义一个变量: /=/g,
        字符串两边应该加引号: /=.*'.*'/g,
        "需要再用一次print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=/g,
        给变量赋值不需要写括号: /=\('/g,
        打印变量不需要加引号: /\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "请看帽子里是~\n小白兔\n"
    ],
    "1_6": [
      "print('请看帽子里是~')\n",
      "",
      {
        需要用等号定义一个变量: /=/g,
        字符串两边应该加引号: /=.*'.*'/g,
        "需要再用一次print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=/g,
        给变量赋值不需要写括号: /=\('/g,
        打印变量不需要加引号: /\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "请看帽子里是~\n气球\n"
    ],
    "1_7": [
      "print('请看帽子里是~')\nhat = '小白兔'\n",
      "",
      {
        需要用等号再给变量赋一次值: /=/g,
        字符串两边应该加引号: /'.*'/g,
        "需要再用一次print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=/g,
        给变量赋值不需要写括号: /=\('/g,
        打印变量不需要加引号: /\('.*'\)/g,
        "print()只需要用一个哟~": /(print[\s\S]*){2}/g
      },
      "请看帽子里是~\n气球\n"
    ],
    "1_8": ["", "", {}, {}, "冰箱\n大象\n"],
    "1_9": [
      "hat = '小白兔'\n",
      "",
      {
        需要再定义一个变量: /=/g,
        "需要用print()命令": /print[ ]*\(.*\)/g,
        "需要用两次print()命令": /(print[ ]*\(.*\)[\s\S]*){2}/g
      },
      {
        "print()命令不需要等号": /print.*=.*/g,
        "等号右边应该是一个变量, 不能是字符串": /='.*'/g,
        打印变量不需要加引号: /\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "小白兔\n小白兔\n"
    ],
    "1_10": [
      "hat = '红球'\nhat2 = '蓝球'\nhat2 = hat\nhat = hat2\n",
      "",
      {},
      {},
      "红球\n"
    ],

    "1_11": [
      "",
      "",
      {
        需要再定义一个变量: /=/g,
        需要用加号连接字符串: /=.*\+/g,
        字符串两边应该加引号: /=.*'.*'.*\+.*'.*'/g,
        "需要用print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=.*/g,
        打印变量不需要加引号: /print\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "小白兔气球\n"
    ],
    "1_12": [
      "hat = '小熊'\n",
      "",
      {
        给再定义一个变量: /=/g,
        需要用加号连接字符串: /=.*\+/g,
        字符串两边应该加引号: /=.*\+.*'.*'/g,
        "需要用print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=.*/g,
        计算加法时变量两边不需要引号: /=.*'.*'.*\+.*'.*'/g,
        打印变量不需要加引号: /print\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "小熊猫\n"
    ],
    "1_13": ["", "", {}, {}, "小熊猫\n"],
    "1_14": [
      "hat = '小熊'\n",
      "",
      {
        需要再给变量赋一次值: /=/g,
        需要用加号连接字符串: /=.*\+/g,
        字符串两边应该加引号: /=.*\+.*'.*'/g,
        "需要用print()命令": /print[ ]*\(.*\)/g
      },
      {
        "print()命令不需要等号": /print.*=.*/g,
        计算加法时变量两边不需要引号: /=.*'.*'.*\+.*'.*'/g,
        打印变量不需要加引号: /print[ ]*\('.*'\)/g,
        代码左边不要写空格哦: /^ /g
      },
      "小熊猫\n"
    ],
    "1_15": [
      "",
      "",
      {
        "不要删掉hat = '石头'这行代码哟": /hat[ ]*=[ ]*'石头'/g,
        "不要删掉hat = hat + '剪刀'这行代码哟": /hat[ ]*=[ ]*hat[ ]*\+[ ]*'剪刀'/g,
        "不要删掉hat = hat + '布'这行代码哟": /hat[ ]*=[ ]*hat[ ]*\+[ ]*'布'/g,
        "不要删掉print(hat)这行代码哟": /print[ ]*\([ ]*hat[ ]*\)/g
      },
      {},
      "石头剪刀布\n"
    ]
  };

  if (cid in finals) return finals[cid];

  if (!(cid in noticeDict)) return "";

  code = code.replace(/'''[\s\S]*'''/g, "");
  code = code.replace(/"/g, "'");
  code = code.replace(/ $/g, "");
  code = code.replace(/\r/g, "");
  result = result.replace(/，/g, ",");
  result = result.replace(/[ !~?？：！:]/g, "");

  d = noticeDict[cid];

  let sourceArray = code.split("\n");
  var resArray = Array();
  for (var i = 0; i < sourceArray.length; i++) {
    if (sourceArray[i] != "") resArray.push(sourceArray[i]);
  }

  code = resArray.join("\n");
  code = code + "\n";
  if (!code.startsWith(d[0])) {
    let A = d[0].split("\n");
    if (A.length >= 5)
      return (
        "不要修改前" +
        (A.length - 1) +
        "行的预设代码哦\n" +
        A[0] +
        "\n...\n" +
        A[A.length - 2]
      );
    else return "不要修改前" + (A.length - 1) + "行的预设代码哦\n" + d[0];
  }

  code = code.replace(d[0], "");
  //TODO: 去掉后置代码

  for (var s in d[2]) {
    let reg = d[2][s];
    if (!reg.test(code)) {
      return s;
    }
  }

  for (var s in d[3]) {
    let reg = d[3][s];
    if (reg.test(code)) {
      return s;
    }
  }
  let v_res = d[4].replace(/[ !~?？：！:]/g, "");
  if (result != v_res) {
    return "结果错误，正确结果为：\n" + v_res;
  }

  return "";
}
