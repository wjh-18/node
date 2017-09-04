/**
 * Created by Administrator on 2017/9/4.
 */
$(function(){
    $('.del').click(function(e){
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            method : 'DELETE',
            url : '/admin/list?id=' + id,
            success : function(res){
                if(tr.length > 0){
                    tr.remove();
                }
            }
        })
    })
})