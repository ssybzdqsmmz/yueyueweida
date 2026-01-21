<!--
 * @Date: 2023-03-01 14:36:08
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-23 12:47:06
 * @FilePath: \geoproject2.0\src\views\Login\login\Login.vue
-->
<template>
  <div>
    <div id="loginContainer">
      <div class="head">
        <div class="title">
          <div>
            <p>高精度地理地质信息集成共享子平台</p>
          </div>
        </div>
      </div>
      <div class="table">
        <div class="background">
          <div class="table_back_1" />
          <div class="table_back_2" />
          <div class="table_back_3" />
          <div class="table_back_4" />
          <div class="table_back_5" />
          <div class="table_back_6" />
        </div>
        <div class="table_title">
          <div class="title_style" />
          <div class="title_text">
            <span style="margin-right: 5px; font-size: 20px">用户登录</span>
            <span>USER LOGIN</span>
          </div>
          <div id="title_intro">
            <span>登录说明</span>
            <div id="login_intro">
              <p>需验证账号密码完成登录</p>
              <p>账号：axureux</p>
              <p>密码：12345678</p>
            </div>
          </div>
        </div>
        <form class="table_content" method="post" @submit="handleSubmit">
          <div id="username" class="input">
            <div class="icon">
              <span></span>
            </div>
            <div class="text_input">
              <input id="username_input" v-model="username" name="username" type="text" placeholder="请输入用户名称" />
            </div>
            <div id="clear_btn" class="icon" @click="username = ''">
              <span></span>
            </div>
          </div>
          <div id="password" class="input">
            <div class="icon">
              <span></span>
            </div>
            <div class="text_input">
              <input name="password" autocomplete="on" type="password" placeholder="请输入登录密码" />
            </div>
          </div>
          <div id="verifycode">
            <div id="verifycode_input" class="input">
              <div class="icon">
                <span></span>
              </div>
              <div class="text_input">
                <input name="verifycode" autocomplete="off" type="text" placeholder="请输入右侧校验码" />
              </div>
            </div>
            <el-skeleton style="width: 94px; height: 50px" :loading="Boolean(captchaLoading > 0)" animated>
              <template #template>
                <el-skeleton-item variant="image" style="width: 94px; height: 50px"></el-skeleton-item>
              </template>
              <template #default>
                <div v-if="captchaLoading == NetworkType.Failed" class="error_img" @click="getCaptcha">
                  <el-icon :size="25" style="vertical-align: middle">
                    <Refresh />
                  </el-icon>
                </div>

                <img v-if="captchaLoading == NetworkType.Success" id="verifycode_img" @click="getCaptcha" />
              </template>
            </el-skeleton>
          </div>
          <div id="password_setting">
            <div id="remembercode">
              <input type="checkbox" />
              <span>记住密码</span>
            </div>
            <div id="forgetcode">
              <span>忘记密码</span>
              <div id="forgetcode_intro">
                <p>请联系管理员重置密码</p>
                <p>电话：400-888-8888</p>
              </div>
            </div>
          </div>
          <div id="login_btn">
            <input type="submit" value="登录" />
            <div v-if="isLoading" class="mask">
              <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="footer">
        <ul>
          <li v-for="(item, index) in footer" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, nextTick, toRefs, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { passwordLogin, cookieVerify, getCode } from '@/api/dldz-requst';
import { ElMessage } from 'element-plus';
import { awaitWrap } from '@/utils/Network/AwaitUtils';
import { Refresh } from '@element-plus/icons-vue';
import { NetworkType } from '@/api/types';

export default {
  components: {
    Refresh,
  },
  setup() {
    const state = reactive({
      captchaLoading: NetworkType.Loading,
      footer: [
        '咨询服务：平台网络服务QQ群：123456789 咨询邮箱：123456789@qq.com',
        '技术支持：VGE Group',
        'Copyright © 2023 VGE Group. All rights reserved.',
      ],
      username: '',
      isLoading: false,
      uuid: undefined, // 验证码的uuid -> redis中的key
    });
    const router = useRouter();

    /**
     * 获取验证码
     * @return {string} base64编码的图片
     */
    async function getCaptcha() {
      state.captchaLoading = NetworkType.Loading;
      const [err, data] = await awaitWrap(getCode());

      if (err != null) {
        state.captchaLoading = NetworkType.Failed;
        // ElMessage.error('获取二维码失败');
      } else {
        state.captchaLoading = NetworkType.Success;

        // wait for dom node updating
        nextTick(() => {
          let imgNode = document.getElementById('verifycode_img');
          state.uuid = data.uuid;
          // base64字符串
          imgNode.src = data.img;
        });
      }
      return null;
    }
    // initialize the captcha
    getCaptcha();
    /**
     * @description: 处理表格提交函数
     * @param {*} e
     * @return {void}
     */
    function handleSubmit(e) {
      e.preventDefault();
      let loginForm = document.getElementsByClassName('table_content')[0];
      state.isLoading = true;
      const promise = passwordLogin(loginForm.formdata, state.uuid);
      let loginBtn = document.getElementById('login_btn');
      loginBtn.disabled = true;
      promise
        .then((data) => {
          let message = '';
          let type = '';
          let callback = undefined;
          switch (data) {
            case 'UserDoesNotExistOrPasswordError': {
              message = '用户不存在或密码输入错误';
              type = 'warning';
              break;
            }
            case 'SessionInvalid': {
              message = 'Session失效，重新登录';
              type = 'warning';
              break;
            }
            case 'CookieInValid': {
              message = '登陆Cookie已经被服务器主动清除';
              type = 'warning';
              break;
            }
            case 'CookieValid': {
              message = '创建Cookie，用户登录成功';
              type = 'success';
              break;
            }
            case 'CaptchaExpired': {
              message = '验证码过期，请刷新验证码';
              type = 'error';
              break;
            }
            case 'CaptchaError': {
              message = '请输入正确的验证码';
              type = 'error';
              break;
            }
          }
          // 处理不同类型下的回调函数
          switch (type) {
            case 'error':
            case 'warning': {
              callback = () => {
                state.isLoading = false;
                loginBtn.disabled = false;
                // refresh captcha
                getCaptcha();
              };
              break;
            }
            case 'success': {
              callback = () => {
                router.push('/entrance');
                state.isLoading = false;
                loginBtn.disabled = false;
              };
              break;
            }
          }
          ElMessage({
            message: message,
            type: type,
            duration: 2000,
            onClose: callback,
          });
        })
        .catch((err) => {
          ElMessage.error('提交失败' + err);
          state.isLoading = false;
          loginBtn.disabled = false;
        });
    }
    onMounted(() => {
      // cookie验证
      // const promise = cookieVerify();
      // promise
      //   .then((data) => {
      //     if (data == 'CookieValid' || data == 'SessionCreated') {
      //       router.push('/entrance');
      //     }
      //   })
      //   .catch((err) => {
      //     ElMessage.error('网络错误');
      //   });
      router.push('/home/3DScene');
    });
    watch(
      () => state.username,
      (newVal) => {
        let clear_btn = document.getElementById('clear_btn');
        if (newVal == '') {
          clear_btn.style.display = 'none';
        } else {
          clear_btn.style.display = 'flex';
        }
      }
    );
    return {
      ...toRefs(state),
      handleSubmit,
      getCaptcha,
      NetworkType,
    };
  },
};
</script>

<style lang="scss" scoped>
#loginContainer {
  width: 1920px;
  height: 100vh;
  font-size: 14px;
  text-align: center;
  background-color: rgb(204 204 204 / 100%);

  &::after {
    display: block;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/首页-资源/u134_state0.jpg');
    content: '';
  }

  &::before {
    position: absolute;
    top: 50px;
    left: calc(50vw - 266.5px);
    width: 533px;
    height: 61px;
    background-image: url('@/assets/images/首页-登录/u430.svg');
    background-size: cover;
    content: '';
  }

  .head {
    position: absolute;
    height: 132px;
    width: 100vw;
    background-image: url('@/assets/images/首页-登录/u431.png');
    background-size: 100% 100%;

    .title {
      display: flex;
      position: absolute;
      top: 14px;
      left: calc(50vw - 342px);
      width: 684px;
      height: 89px;
      line-height: 47px;
      color: rgb(255 255 255 / 100%);
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
      font-size: 42px;
      font-weight: 700;
      font-style: normal;

      div {
        align-self: center;
        width: 100%;
      }
    }
  }

  .table {
    position: absolute;
    left: calc(50vw - 234px);
    top: 260px;
    width: 469px;
    height: 508px;

    .background {
      .table_back_1 {
        position: absolute;
        left: 7px;
        top: 6px;
        width: 462px;
        height: 502px;
        background-image: url('@/assets/images/首页-登录/u378.svg');
      }

      .table_back_2 {
        position: absolute;
        left: 7px;
        top: 38px;
        width: 6px;
        height: 21px;
        background-image: url('@/assets/images/首页-登录/u379.svg');
      }

      .table_back_3 {
        position: absolute;
        top: 59px;
        left: 7px;
        width: 6px;
        height: 21px;
        background-image: url('@/assets/images/首页-登录/u379.svg');
        opacity: 0.702;
      }

      .table_back_4 {
        position: absolute;
        top: 80px;
        left: 7px;
        width: 6px;
        height: 21px;
        background-image: url('@/assets/images/首页-登录/u379.svg');
        opacity: 0.4;
      }

      .table_back_5 {
        position: absolute;
        left: 7px;
        top: 6px;
        width: 462px;
        height: 1px;
        background-image: url('@/assets/images/首页-登录/u382.svg');
      }

      .table_back_6 {
        position: absolute;
        left: 7px;
        top: 507px;
        width: 462px;
        height: 1px;
        background-image: url('@/assets/images/首页-登录/u382.svg');
      }
    }

    .table_title {
      display: flex;
      position: absolute;
      top: 51px;
      left: 48px;
      width: 390px;
      height: 20px;
      color: #03b4f5;
      font-family: '微软雅黑';
      font-weight: 400;
      text-align: left;
      font-style: normal;

      .title_style {
        display: inline-block;
        width: 5px;
        height: 100%;
        margin-right: 10px;
        background-color: #03b4f5;
      }

      .title_text {
        display: inline-block;
        align-self: center;
        font-size: 14px;
      }

      #title_intro {
        display: inline-block;
        margin-left: 150px;
        color: rgb(255 255 255 / 64.7%);

        &:hover #login_intro {
          display: block;
        }
      }

      #login_intro {
        display: none;
        position: absolute;
        top: 25px;
        left: 210px;
        width: 182px;
        height: 90px;
        padding-top: 20px;
        padding-left: 10px;
        color: rgb(255 255 255 / 64.7%);
        background-image: url('@/assets/images/首页-登录/背景_u421.svg');
      }
    }

    .table_content {
      display: grid;
      position: absolute;
      top: 110px;
      left: 60px;
      grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
      grid-row-gap: 15px;

      .input {
        display: flex;
        height: 50px;

        .text_input {
          flex-grow: 1;

          input {
            float: left;
            width: 70%;
            height: 100%;
            padding: 3px 2px;
            border-color: transparent;
            outline: none;
            color: #ffffff;
            font-family: '微软雅黑';
            font-size: 16px;
            font-weight: 400;
            text-align: left;
            background-color: transparent;
            font-style: normal;

            // 设置自动填充时，背景色消失
            background-clip: text;

            &::placeholder {
              color: rgb(255 255 255 / 29.8%);
              background-color: transparent;
            }

            &:focus {
              background-color: transparent;
            }

            // 设置自动填充背景透明
            &:-internal-autofill-previewed,
            &:-internal-autofill-selected {
              background-color: transparent;
              transition: background-color 10000s ease-out 0.5s;
              -webkit-text-fill-color: white;
            }

            &:-internal-autofill::first-line {
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }

      .icon {
        display: flex;
        width: 50px;
        height: 50px;
        color: #03b4f5;
        font-family: 'Font Awesome 5 Pro Solid', 'Font Awesome 5 Pro Regular', 'Font Awesome 5 Pro';
        font-size: 18px;
        font-weight: 900;
        text-align: center;
        font-style: normal;

        span {
          align-self: center;
          width: 100%;
        }
      }

      #username {
        width: 374px;
        box-sizing: content-box;
        margin: 3px;
        background-size: 100% 100%;
        background-image: url('@/assets/images/首页-登录/边框_u386.svg');

        &:hover {
          background-image: url('@/assets/images/首页-登录/边框_u386_selected.svg');
        }

        &:has(.text_input input:focus) {
          margin: 0;
          padding: 3px;
          background-size: 100% 100%;
          background-image: url('@/assets/images/首页-登录/边框_u386_disabled.svg');
        }

        #clear_btn {
          display: none;
        }
      }

      #password {
        width: 374px;
        box-sizing: content-box;
        margin: 3px;
        background-size: 100% 100%;
        background-image: url('@/assets/images/首页-登录/边框_u386.svg');

        &:hover {
          background-image: url('@/assets/images/首页-登录/边框_u386_selected.svg');
        }

        &:has(.text_input input:focus) {
          margin: 0;
          padding: 3px;
          background-size: 100% 100%;
          background-image: url('@/assets/images/首页-登录/边框_u386_disabled.svg');
        }
      }

      #verifycode {
        display: grid;
        grid-template-columns: 2.7fr 1fr;
        column-gap: 10px;

        #verifycode_input {
          box-sizing: content-box;
          margin: 3px;
          background-size: 100% 100%;
          background-image: url('@/assets/images/首页-登录/边框_u396.svg');

          &:hover {
            background-image: url('@/assets/images/首页-登录/边框_u396_selected.svg');
          }

          &:has(.text_input input:focus) {
            margin: 0;
            padding: 3px;
            background-size: 100% 100%;
            background-image: url('@/assets/images/首页-登录/边框_u396_disabled.svg');
          }
        }

        :deep(.el-skeleton) {
          --el-skeleton-color: #052033;
          --el-skeleton-to-color: #053049;

          transform: translateY(3px);
        }

        :deep(.el-skeleton__image svg) {
          display: block;
          height: 55%;
        }

        #verifycode_img {
          position: relative;
          margin: 3px;
          background-size: 100% 100%;
          background-image: url('@/assets/images/首页-登录/校验码显示_u401.svg');
          cursor: pointer;
          pointer-events: auto;
        }

        .error_img {
          display: flex;
          width: 94px;
          height: 50px;
          justify-content: center;
          align-items: center;
          background-color: #0f4764;
          transform: translateY(3px);
        }
      }

      #password_setting {
        span {
          font-size: 14px;
          color: rgb(255 255 255 / 64.7%);
        }

        #remembercode {
          float: left;
          margin-left: 10px;

          span {
            margin-left: 10px;
          }
        }

        #forgetcode {
          float: right;
          margin-right: 10px;

          &:has(span:hover) {
            #forgetcode_intro {
              display: block;
            }
          }

          #forgetcode_intro {
            display: none;
            position: absolute;
            top: 145px;
            left: 210px;
            width: 171px;
            height: 65px;
            padding-top: 7px;
            color: rgb(255 255 255 / 64.7%);
            background-image: url('@/assets/images/首页-登录/气泡提示_u408.svg');
          }
        }
      }
    }

    #login_btn {
      position: relative;
      border-radius: 4px;

      input[type='submit'] {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 10px;
        color: #ffffff;
        font-family: '微软雅黑';
        font-size: 18px;
        font-weight: 400;
        background-color: rgb(3 180 245 / 100%);
        font-style: normal;
      }

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 380px;
        height: 56px;
        background-color: rgb(0 0 0 / 30%);
      }

      .loading {
        --speed-of-animation: 0.9s;
        --gap: 6px;
        --first-color: #4c86f9;
        --second-color: #49a84c;
        --third-color: #f6bb02;
        --fourth-color: #f6bb02;
        --fifth-color: #2196f3;

        display: flex;
        position: absolute;
        top: calc(calc(56px - 30px) / 2);
        left: 0;
        width: 380px;
        height: 30px;
        justify-content: center;
        align-items: center;
        gap: 6px;
      }

      .loading span {
        width: 4px;
        height: 30px;
        background: var(--first-color);
        animation: scale var(--speed-of-animation) ease-in-out infinite;
      }

      .loading span:nth-child(2) {
        background: var(--second-color);
        animation-delay: -0.8s;
      }

      .loading span:nth-child(3) {
        background: var(--third-color);
        animation-delay: -0.7s;
      }

      .loading span:nth-child(4) {
        background: var(--fourth-color);
        animation-delay: -0.6s;
      }

      .loading span:nth-child(5) {
        background: var(--fifth-color);
        animation-delay: -0.5s;
      }

      @keyframes scale {
        0%,
        40%,
        100% {
          transform: scaleY(0.05);
        }

        20% {
          transform: scaleY(1);
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    height: 165px;
    width: 100vw;

    ul {
      position: absolute;
      top: 30px;
      right: 50px;
      list-style: none;
      font-size: 21px;
      color: #f2f2f2;

      li {
        height: 35px;
        line-height: 35px;
        text-align: left;
      }
    }

    &::before {
      display: block;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/首页-登录/u424.svg');
      opacity: 0.3;
      content: '';
    }
  }
}
</style>
