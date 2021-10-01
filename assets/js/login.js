$(function() {
    // 点击去注册账号的链接
    $("#link_reg").on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登陆的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的值
            // 还需要拿到密码框中的值
            var pwd = $('.reg-box [name=password]').val();
            // console.log(pwd);
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                layer.msg('注册成功');

                //模拟人的点击行为
                $('#link_login').click();
            }

        })

        // $.post('http://api-breakingnews-web.itheima.net/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
        //     if (res.status !== 0) {
        //         return console.log(res.message)
        //     }
        //     console.log(res);
        // })
    })

    // 监听登陆表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败');
                }
                layer.msg('登陆成功');
                // console.log(res.token);

                // 将登陆成功得到的token字符串,保存到localStorage中
                localStorage.setItem('token', res.token);

                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})