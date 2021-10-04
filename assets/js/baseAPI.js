//注意：每次调用$.get()或$.post()或￥$.ajax()的时候
// 会先调用ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function(option) {
    // console.log(option.url);

    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;


    // 统一为有权限的接口,设置headers请求头
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载 complete
    option.complete = function(res) {
        // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        // console.log(res.responseJSON);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空toke
            localStorage.removeItem('token');
            // 2.强制跳转到index页面
            location.href = '/login.html';
        }
    }
})