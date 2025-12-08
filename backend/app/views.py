from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def check_naturalness(request):
    text = request.data.get("text", "")
    return Response({"message": f"Received: {text}"})

def frontpage(request):
    return render(request, "app/frontpage.html")