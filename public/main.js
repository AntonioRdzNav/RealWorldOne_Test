
$('.alert').delay(2000).fadeOut(300, function() { $(this).remove(); });

var textarea = document.getElementById('chat');
textarea.scrollTop = textarea.scrollHeight;