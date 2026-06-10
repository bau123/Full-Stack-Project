from django.contrib import admin

from .models import Category, Task


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "color", "created_at")


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "priority", "due_date", "completed")
    list_filter = ("completed", "priority", "category")
    search_fields = ("title", "description")
