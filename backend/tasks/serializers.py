from rest_framework import serializers

from .models import Category, Task


class CategorySerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "color", "task_count", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_task_count(self, obj):
        return obj.tasks.count()


class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_color = serializers.CharField(source="category.color", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "category_color",
            "priority",
            "due_date",
            "completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
