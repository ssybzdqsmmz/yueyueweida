/*
 * @Date: 2023-03-21 20:56:25
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-31 10:03:26
 * @FilePath: \Geology-V3\.eslintrc.cjs
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: [
      0,
      {
        FunctionDeclaration: { body: 1, parameters: 2 },
        SwitchCase: 1,
        outerIIFEBody: 0,
      },
    ],
    // "function-paren-newline": "off",
    'space-before-function-paren': 0, // 函数定义时括号前面要不要有空格
    'eol-last': 0, // 文件以单一的换行符结束
    'no-extra-semi': 0, // 可以多余的冒号
    semi: 0, // 语句可以不需要分号结尾
    eqeqeq: 0, // 必须使用全等
    'one-var': 0, // 连续声明
    'no-undef': 0, // 可以 有未定义的变量
    'vue/multi-word-component-names': 'off',
    // 警告
    'no-extra-boolean-cast': 1, // 不必要的bool转换
    'no-extra-parens': 0, // 非必要的括号
    'no-empty': 1, // 块语句中的内容不能为空
    // 'no-use-before-define': [1, 'nofunc'], // 未定义可以使用
    'no-use-before-define': [0],
    complexity: [1, 18], // 循环复杂度
    'no-unused-vars': 'off', // 不能有声明后未被使用的变量或参数
    '@typescript-eslint/no-unused-vars': ['off'],
    // 错误
    // 'comma-dangle': [2, 'never'], // 对象字面量项尾不能有逗号
    'no-constant-condition': 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    'no-dupe-args': 2, // 函数参数不能重复
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-duplicate-case': 2, // switch中的case标签不能重复
    'no-empty-character-class': 2, // 正则表达式中的[]内容不能为空
    'no-invalid-regexp': 2, // 禁止无效的正则表达式
    'no-func-assign': 2, // 禁止重复的函数声明
    'valid-typeof': 2, // 必须使用合法的typeof的值
    'no-unreachable': 2, // 不能有无法执行的代码
    'no-unexpected-multiline': 2, // 避免多行表达式
    'no-sparse-arrays': 2, // 禁止稀疏数组， [1,,2]
    'no-shadow-restricted-names': 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-native-reassign': 2, // 不能重写native对象
    // 代码风格
    'no-else-return': 1, // 如果if语句里面有return,后面不能跟else语句
    'no-multi-spaces': 1, // 不能用多余的空格
    'key-spacing': [
      1,
      {
        // 对象字面量中冒号的前后空格
        beforeColon: false,
        afterColon: true,
      },
    ],
    'block-scoped-var': 2, // 块语句中使用var
    'consistent-return': 0, // return 后面是否允许省略
    'accessor-pairs': 2, // 在对象中使用getter/setter
    'dot-location': [2, 'property'], // 对象访问符的位置，换行的时候在行首还是行尾
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-labels': 2, // 禁止标签声明
    'no-extend-native': 0, // 启用扩展native对象 - warning
    'no-floating-decimal': 2, // 禁止省略浮点数中的0 .5 3.
    'no-loop-func': 2, // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    'no-new-func': 2, // 禁止使用new Function
    'no-self-compare': 2, // 不能比较自身
    'no-sequences': 2, // 禁止使用逗号运算符
    'no-throw-literal': 2, // 禁止抛出字面量错误 throw "error";
    'no-return-assign': [2, 'always'], // return 语句中不能有赋值表达式
    'no-redeclare': [
      2,
      {
        // 禁止重复声明变量
        builtinGlobals: true,
      },
    ],
    '@typescript-eslint/triple-slash-reference': 0,
    'no-unused-expressions': [
      2,
      {
        // 禁止无用的表达式
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'no-useless-call': 2, // 禁止不必要的call和apply
    'no-useless-concat': 2,
    'no-void': 2, // 禁用void操作符
    'no-with': 2, // 禁用with
    'space-infix-ops': 2, // 中缀操作符周围要不要有空格
    'valid-jsdoc': [
      // Canonicalize function annotations
      2,
      {
        requireParamDescription: false,
        requireReturnDescription: false,
        requireReturn: false,
        requireReturnType: false,
        requireParamType: false,
      },
    ],
    'no-warning-comments': [
      0,
      {
        // 不能有警告备注
        terms: ['todo', 'fixme', 'any other term'],
        location: 'anywhere',
      },
    ],
    curly: 1, // 必须使用 if(){} 中的{}
    // common js
    'no-duplicate-imports': 1,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-array-constructor': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-loss-of-precision': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'prefer-const': 'off',

    'prettier/prettier': 'off',
  },
};
