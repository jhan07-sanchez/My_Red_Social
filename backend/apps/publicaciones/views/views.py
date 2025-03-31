from django.http import JsonResponse

def publicaciones(request):
    return JsonResponse({"mensaje": "API de publicaciones funcionando"})
