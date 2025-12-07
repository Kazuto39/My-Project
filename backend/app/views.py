from django.shortcuts import render

def frontpage(request):
    return render(request, "app/frontpage.html")