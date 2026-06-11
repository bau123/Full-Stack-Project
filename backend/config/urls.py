from django.contrib import admin
from django.urls import include, path
from config import settings

if settings.DEBUG:
    from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("tasks.urls")),
] + debug_toolbar_urls()
