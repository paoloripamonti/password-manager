//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

//= require bootstrap.min.js
//= require bootstrap-material-design


$(document).ready(function(){

  $("a[rel~=popover], .has-popover").popover()
  $("a[rel~=tooltip], .has-tooltip").tooltip()

  $.material.init()

  //Show snackbar
  if($(".notice-snackbar").length){
    options =  { content: $(".notice-snackbar").attr("msg"), style: "toast", timeout: 4000 }
    $.snackbar(options);
  }

  $("#nav-search").keyup(function(){
    navbarSearch()
  });

})

$(".entry-master-password").click(function(){
  entity_id = $(this).attr('data-object-id')
  if($("#icon_"+entity_id).html()=="lock_open"){
    $("#hidden_passsword_"+entity_id).show()
    $("#show_passsword_"+entity_id).hide()
    $("#show_passsword_"+entity_id).html("")
    $("#icon_"+entity_id).html("lock")
  }else{
    $("#error_decrypt_div").hide() 
    $("#check-master-password-form")[0].reset()
    $("#modal_master_password").modal('show')
    $("input[name='entity_id']").val(entity_id)
  }

  return false;
})

$('#check-master-password-form').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) { 
    getPassword();
    return false;
  }
});



$(".check-master-password-btn").click(function(){
  getPassword();
  return false;
})


function navbarSearch(){
  text = $("#nav-search").val().toUpperCase();
  $(".list-group-item").each(function(index, obj){
      item = $($(obj).find(".master-link")[0]).html().toUpperCase();
      if(item.indexOf(text) > -1){
        $(obj).show();
      }else{
        $(obj).hide();
      }
  })
}

function getPassword(){
  $("#error_decrypt_div").hide() 
  $.ajax({
    url: $("#check-master-password-form").attr('data-ref-action'),
    data: $("#check-master-password-form").serialize(),
    type: "POST",
    success: function(data) { 
      entity_id = $("#entity_id").val()
      $("#hidden_passsword_"+entity_id).hide()
      $("#show_passsword_"+entity_id).show()
      $("#show_passsword_"+entity_id).html(data)
      $("#icon_"+entity_id).html("lock_open")
      $("#modal_master_password").modal('hide')
    },
    error: function(error) {
      $("#error_decrypt_div").show()   
    },
    dataType: 'json'
  });
}

$(".add_attribute_modal").click(function(){
  $("#modal_add_attribute").modal('show')
  return false;
})


$(".add_attribute").click(function(){
  key = $("#key_attribute").val();
  value = $("#value_attribute").val();
  i = $('#table_attribute tr').length-1;
  btn_delete = '<button class="btn btn-raised btn-danger btn-xs" onClick="$(this).closest(\'tr\').remove();" href="#"><i class="mi md-18 bottom">delete</i></button>';
  hidden_field = '<input name="entity['+key+']" type="hidden" value="'+value+'">'
  $("#table_attribute tr:last").after('<tr><td><strong>'+key+'<strong></td><td>'+value+'</td><td><div class="pull-right">'+btn_delete+'</div>'+hidden_field+'</td></tr>');

  key = $("#key_attribute").val("");
  value = $("#value_attribute").val("");

  $("#modal_add_attribute").modal('close')
  return false;
})
