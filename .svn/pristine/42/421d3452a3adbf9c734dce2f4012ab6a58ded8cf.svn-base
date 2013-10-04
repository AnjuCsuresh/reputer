from django.contrib.auth.views import password_reset
from django.shortcuts import render
from django.contrib.auth.models import User

def forgot_password(request):
    if request.method == 'POST':
        return password_reset(request,email_template_name='registration/mail.html', post_reset_redirect='/userprofile/password/',
            from_email=request.POST.get('email'))
    else:
        return render(request, 'forgot_password.html')

def password(request):
	return render(request, 'success.html')
def mail(request):
	return render(request, 'mail.html')
def resetdone(request):
	return render(request, 'done.html')

	