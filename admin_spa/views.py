from django.shortcuts import render

def app(request):
    return render(request, "admin_spa/spa.html")