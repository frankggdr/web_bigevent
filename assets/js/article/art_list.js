$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);

                $('[name=cate_id]').html(htmlStr);

                //通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    //为筛选表单绑定 submit事件
    $('#form-search').on('submit', function(e) {
        // console.log(123);
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;

        //根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候，触发
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候
            // 2.只要调用了laypage.render()
            jump: function(obj, first) {
                console.log(obj.curr);
                console.log(first);
                // 把最新的页码值，赋值到q这个查询参数中
                q.pagenum = obj.curr;

                // 把最新的条目数，复制到q这个查询对象的pagesize属性中
                q.pagesize = obj.limit;

                if (!first) {
                    initTable()
                }
            }
        })
    }

    //通过代理方式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {

        var len = $('.btn-delete').length;
        console.log(len);

        var id = $(this).attr('data-Id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后，再重新调用
                    if (len === 1) {
                        //如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了

                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})