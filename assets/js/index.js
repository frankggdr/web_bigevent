$(function() {
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log('ok');
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.重新跳转到登陆页面
            location.href = '/login.html';

            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar 渲染用户的头像
            // console.log(res.data);
            renderAvatar(res.data)
        },
        // 不论成功还是失败，最终都会调用complete
        complete: function(res) {
            // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            console.log(res.responseJSON);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.强制清空toke
                localStorage.removeItem('token');
                // 2.强制跳转到index页面
                location.href = '/login.html';
            }
        }

    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户昵称
    var name = user.nickname || user.username;

    $('#welocme').html('欢迎你&nbsp;' + name)

    //渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();

        $('.text-avatar').html(first).show();
    }
}